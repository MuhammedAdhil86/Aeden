"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import Header from "@/components/Header";
import MonthSelector from "@/components/ui/monthSelector";
import AddBenchmarkModal from "../../admin/benchMarking/addBenchmarking/page";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Group data by product name
const groupByProduct = (arr) => {
  const map = {};
  arr.forEach((item) => {
    const key = (item.product || "").trim().toLowerCase();
    if (!map[key]) map[key] = [];
    map[key].push(item);
  });
  return Object.values(map).map((group) => group[0]);
};

// Define table columns
const useBenchmarkColumns = () =>
  useMemo(
    () => [
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ getValue }) => {
          const value = getValue();
          if (!value) return "-";
          const date = new Date(value);
          if (isNaN(date.getTime())) return "-";
          return `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
        },
      },
      { accessorKey: "category", header: "Category", cell: ({ getValue }) => getValue() || "-" },
      { accessorKey: "product", header: "Product", cell: ({ getValue }) => getValue() || "-" },
      { accessorKey: "brand", header: "Brand", cell: ({ getValue }) => getValue() || "-" },
      { accessorKey: "origin", header: "Origin", cell: ({ getValue }) => getValue() || "-" },
      { accessorKey: "region", header: "Region", cell: ({ getValue }) => getValue() || "-" },
      { accessorKey: "unit", header: "Unit", cell: ({ getValue }) => getValue() || "-" },
      { accessorKey: "lowerPrice", header: "Low Index", cell: ({ getValue }) => `₹${getValue()}` },
      { accessorKey: "higherPrice", header: "High Index", cell: ({ getValue }) => `₹${getValue()}` },
      { accessorKey: "averagePrice", header: "Average Index", cell: ({ getValue }) => `₹${getValue()}` },
      {
        accessorKey: "demand",
        header: "Market Demand",
        cell: ({ getValue }) => {
          const value = (getValue() || "").toLowerCase();
          if (!value) return "-";
          let color = "", percent = 0;
          if (value === "high") { color = "bg-green-500"; percent = 100; }
          else if (value === "medium") { color = "bg-yellow-400"; percent = 66; }
          else if (value === "low") { color = "bg-red-500"; percent = 33; }
          return (
            <div className="w-full">
              <div className="w-full bg-gray-300 h-2 rounded-full overflow-hidden">
                <div className={`${color} h-2 rounded-full`} style={{ width: `${percent}%` }} />
              </div>
            </div>
          );
        },
      },
    ],
    []
  );

function BenchMarking() {
  const [data, setData] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const [allStockData, setAllStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stockSearchTerm, setStockSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("product");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const columns = useBenchmarkColumns();
  const router = useRouter();
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  // Fetch benchmarking data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://aeden-fleet-t579q.ondigitalocean.app/master/bench/fetchAll",
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      const raw = response.data?.data || [];
      console.log("Raw API data:", raw);

      const processed = raw.map((item, index) => {
        const price = parseFloat(item.price || 0);
        return {
          id: item.id || index,
          date: item.date || "-",
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
          originalData: item,
        };
      });

      // 🔹 Simplified log for processed data
      console.log(
        "Processed Benchmark Data (simplified):",
        processed.map(p => ({
          date: p.date,
          product: p.product,
          category: p.category,
          origin: p.origin,
          unit: p.unit,
          lowerPrice: p.lowerPrice,
          higherPrice: p.higherPrice,
          averagePrice: p.averagePrice,
        }))
      );

      const grouped = groupByProduct(processed);

      // 🔹 Simplified log for grouped data
      console.log(
        "Grouped Benchmark Data (simplified):",
        grouped.map(p => ({
          date: p.date,
          product: p.product,
          category: p.category,
          origin: p.origin,
          unit: p.unit,
          lowerPrice: p.lowerPrice,
          higherPrice: p.higherPrice,
          averagePrice: p.averagePrice,
        }))
      );

      setData(processed);
      setAllStockData(processed);
      setGroupedData(grouped);
      setError(null);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Failed to load data");
      toast.error("Error fetching benchmarking data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // React Table
  const table = useReactTable({
    data: groupedData,
    columns,
    getRowId: (row) => row.id.toString(),
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Search
  const performClientSideSearch = useCallback(
    (searchValue, field) => {
      if (!searchValue.trim()) return allStockData;
      const term = searchValue.toLowerCase();
      return allStockData.filter(item => (item[field] || "").toLowerCase().includes(term));
    },
    [allStockData]
  );

  const handleStockSearch = useCallback(
    debounce((value) => {
      if (!value.trim()) return setData(allStockData);
      const results = performClientSideSearch(value, searchField);
      setData(results.length ? results : []);
    }, 300),
    [performClientSideSearch, searchField, allStockData]
  );

  const onSearchInputChange = (e) => {
    const value = e.target.value;
    setStockSearchTerm(value);
    handleStockSearch(value);
  };

  const handleRowClick = (row) => {
    console.log("Row clicked (simplified):", {
      date: row.date,
      product: row.product,
      category: row.category,
      origin: row.origin,
      unit: row.unit,
      lowerPrice: row.lowerPrice,
      higherPrice: row.higherPrice,
      averagePrice: row.averagePrice,
    });
    const productName = row.product;
    const category = row.category;
    const date = new Date(row.date);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear());
    router.push(`/admin/benchMarking/details?product=${encodeURIComponent(productName)}&category=${encodeURIComponent(category)}&month=${month}&year=${year}`);
  };

  // Filter by month/year
  const filterDataByMonth = (month, year) => {
    if (!month || !year) return setData(allStockData);
    const filtered = allStockData.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate.getMonth() + 1 === parseInt(month) && itemDate.getFullYear() === parseInt(year);
    });
    setData(filtered);
  };

  const handleMonthChange = (monthValue) => {
    setSelectedMonth(monthValue);
    filterDataByMonth(monthValue, selectedYear);
  };

  const handleYearChange = (yearValue) => {
    setSelectedYear(yearValue);
    filterDataByMonth(selectedMonth, yearValue);
  };

  const clearAllFilters = () => {
    setStockSearchTerm("");
    setSearchField("product");
    setSelectedMonth("");
    setSelectedYear(new Date().getFullYear().toString());
    setData(allStockData);
  };

  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
    fetchData();
    toast.success("Product added successfully");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="bg-gray-100 ">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-medium text-gray-900">Price List</h1>
          <div className="flex items-center gap-6 text-black">
            <MonthSelector
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onMonthChange={handleMonthChange}
              onYearChange={handleYearChange}
              className="text-sm text-black"
            />
            <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">Add</button>
            <div className="relative" ref={menuRef}>
              <button onClick={() => setOpen(!open)} className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">Filter</button>
              {open && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {["product", "category", "origin"].map(field => (
                    <button key={field} onClick={() => setSearchField(field)} className={`w-full px-4 py-2 text-left ${searchField === field ? "bg-black text-white" : "text-gray-700 hover:bg-gray-50"}`}>
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <input type="text" placeholder={`Search ${searchField}`} value={stockSearchTerm} onChange={onSearchInputChange} className="pl-4 pr-10 py-2 bg-white border rounded-lg w-64" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden text-black">
          <div className="w-full overflow-x-auto">
            <Table className="w-full text-xs table-auto">
              <TableHeader>
                {table.getHeaderGroups().map(hg => (
                  <TableRow key={hg.id}>
                    {hg.headers.map(header => (
                      <TableHead key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={columns.length} className="text-center py-10">Loading...</TableCell></TableRow>
                ) : table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map(row => (
                    <TableRow key={row.id} onClick={() => handleRowClick(row.original)} className="hover:bg-blue-50 cursor-pointer">
                      {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={columns.length} className="text-center py-10">No data found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <AddBenchmarkModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSuccess={handleAddSuccess} existingData={allStockData} />
      <ToastContainer position="top-right" autoClose={1000} />
    </div>
  );
}

export default BenchMarking;
