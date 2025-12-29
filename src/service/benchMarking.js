"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "@/components/Header";
import MonthSelector from "@/components/ui/monthSelector";
import AddBenchmarkModal from "@/app/admin/benchMarking/addBenchmarking/page";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

/* -------------------- HELPERS -------------------- */

const debounce = (fn, wait) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
};

const groupByProduct = (arr) => {
  const map = {};
  arr.forEach((item) => {
    const key = (item.product || "").toLowerCase().trim();
    if (!map[key]) map[key] = [];
    map[key].push(item);
  });
  return Object.values(map).map((g) => g[0]);
};

/* -------------------- COLUMNS -------------------- */

const useBenchmarkColumns = () =>
  useMemo(
    () => [
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ getValue }) => {
          const v = getValue();
          if (!v) return "-";
          const d = new Date(v);
          if (isNaN(d)) return "-";
          return `${String(d.getDate()).padStart(2, "0")}-${String(
            d.getMonth() + 1
          ).padStart(2, "0")}-${d.getFullYear()}`;
        },
      },
      { accessorKey: "category", header: "Category" },
      { accessorKey: "product", header: "Product" },
      { accessorKey: "brand", header: "Brand" },
      { accessorKey: "origin", header: "Origin" },
      { accessorKey: "region", header: "Region" },
      { accessorKey: "unit", header: "Unit" },
      {
        accessorKey: "lowerPrice",
        header: "Low Index",
        cell: ({ getValue }) => `₹${getValue()}`,
      },
      {
        accessorKey: "higherPrice",
        header: "High Index",
        cell: ({ getValue }) => `₹${getValue()}`,
      },
      {
        accessorKey: "averagePrice",
        header: "Average Index",
        cell: ({ getValue }) => `₹${getValue()}`,
      },
      {
        accessorKey: "demand",
        header: "Market Demand",
        cell: ({ getValue }) => {
          const v = (getValue() || "").toLowerCase();
          let p = 0,
            c = "";
          if (v === "high") (p = 100), (c = "bg-green-500");
          if (v === "medium") (p = 66), (c = "bg-yellow-400");
          if (v === "low") (p = 33), (c = "bg-red-500");

          return (
            <div className="w-full">
              <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
                <div className={`${c} h-2`} style={{ width: `${p}%` }} />
              </div>
            </div>
          );
        },
      },
    ],
    []
  );

/* -------------------- PAGE -------------------- */

export default function BenchMarking() {
  const router = useRouter();
  const menuRef = useRef(null);

  const columns = useBenchmarkColumns();

  const [data, setData] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const [allStockData, setAllStockData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [stockSearchTerm, setStockSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("product");

  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState(""); // SSR safe
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  /* ---------- SAFE CLIENT INIT ---------- */
  useEffect(() => {
    setSelectedYear(new Date().getFullYear().toString());
  }, []);

  /* ---------- FETCH ---------- */
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token")
          : null;

      const res = await axios.get(
        "https://aeden-fleet-t579q.ondigitalocean.app/master/bench/fetchAll",
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      const processed =
        res.data?.data?.map((item, i) => {
          const price = Number(item.price || 0);
          return {
            id: item.id || i,
            date: item.date || "",
            product: item.product?.product_name || "-",
            category: item.category?.category_name || "-",
            brand: item.brand?.brand_name || "-",
            origin: item.origin?.country_name || "-",
            region: item.region || item.location?.state || "-",
            unit: item.unit || "-",
            lowerPrice: (price * 0.9).toFixed(2),
            higherPrice: (price * 1.1).toFixed(2),
            averagePrice: price.toFixed(2),
            demand: item.demand || "-",
          };
        }) || [];

      setAllStockData(processed);
      setData(processed);
      setGroupedData(groupByProduct(processed));
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ---------- TABLE ---------- */
  const table = useReactTable({
    data: groupedData,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getRowId: (row) => row.id.toString(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  /* ---------- SEARCH ---------- */
  const searchFn = useCallback(
    debounce((val) => {
      if (!val) return setGroupedData(groupByProduct(allStockData));
      const t = val.toLowerCase();
      const f = allStockData.filter((i) =>
        (i[searchField] || "").toLowerCase().includes(t)
      );
      setGroupedData(groupByProduct(f));
    }, 300),
    [allStockData, searchField]
  );

  const onSearchChange = (e) => {
    setStockSearchTerm(e.target.value);
    searchFn(e.target.value);
  };

  /* ---------- CLICK ---------- */
  const handleRowClick = (row) => {
    const d = new Date(row.date);
    router.push(
      `/admin/benchMarking/details?product=${encodeURIComponent(
        row.product
      )}&category=${encodeURIComponent(
        row.category
      )}&month=${d.getMonth() + 1}&year=${d.getFullYear()}`
    );
  };

  /* ---------- OUTSIDE CLICK ---------- */
  useEffect(() => {
    const fn = (e) =>
      menuRef.current && !menuRef.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  /* -------------------- JSX -------------------- */

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="bg-gray-100 p-6">
        <div className="flex justify-between mb-6">
          <h1 className="text-xl font-medium">Price List</h1>

          <div className="flex gap-4">
            <MonthSelector
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onMonthChange={setSelectedMonth}
              onYearChange={setSelectedYear}
            />

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-black text-white rounded"
            >
              Add
            </button>

            <input
              value={stockSearchTerm}
              onChange={onSearchChange}
              placeholder={`Search ${searchField}`}
              className="px-4 py-2 border rounded"
            />
          </div>
        </div>

        <div className="bg-white border rounded overflow-x-auto">
          <Table className="text-xs">
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((h) => (
                    <TableHead key={h.id}>
                      {flexRender(h.column.columnDef.header, h.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((r) => (
                  <TableRow
                    key={r.id}
                    onClick={() => handleRowClick(r.original)}
                    className="cursor-pointer hover:bg-blue-50"
                  >
                    {r.getVisibleCells().map((c) => (
                      <TableCell key={c.id}>
                        {flexRender(
                          c.column.columnDef.cell,
                          c.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AddBenchmarkModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchData}
        existingData={allStockData}
      />

      <ToastContainer position="top-right" autoClose={1000} />
    </div>
  );
}
