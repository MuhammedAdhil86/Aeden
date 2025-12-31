"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "@/components/Header";
import MonthSelector from "@/components/ui/monthSelector";
import AddBenchmarkModal from "./addBenchmarking/page";

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

import { useBenchmarkStore } from "../../../components/store/useBenchmarkStore";

// ===== TABLE COLUMNS =====
const useBenchmarkColumns = () =>
  useMemo(
    () => [
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ getValue }) => {
          const d = new Date(getValue());
          return isNaN(d) ? "-" : d.toLocaleDateString("en-GB");
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
          const value = (getValue() || "").toLowerCase();
          const map = {
            high: "bg-green-500 w-full",
            medium: "bg-yellow-400 w-2/3",
            low: "bg-red-500 w-1/3",
          };
          return (
            <div className="w-full bg-gray-300 h-2 rounded">
              <div className={`h-2 rounded ${map[value] || ""}`} />
            </div>
          );
        },
      },
    ],
    []
  );

export default function BenchMarking() {
  const router = useRouter();
  const columns = useBenchmarkColumns();
  const menuRef = useRef(null);

  const {
    groupedData,
    loading,
    searchTerm,
    searchField,
    selectedMonth,
    selectedYear,
    fetchBenchmarks,
    setSearchTerm,
    setSearchField,
    setMonthYear,
  } = useBenchmarkStore();

  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [open, setOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchBenchmarks();
  }, [fetchBenchmarks]);

  useEffect(() => {
    const close = (e) =>
      menuRef.current && !menuRef.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

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

  const handleRowClick = (row) => {
    const d = new Date(row.date);
    router.push(
      `/admin/benchMarking/details?product=${row.product}&category=${row.category}&month=${d.getMonth() + 1}&year=${d.getFullYear()}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="p-6">
        <div className="flex justify-between mb-6">
          <h1 className="text-xl font-medium">Price List</h1>

          <div className="flex gap-4 items-center">
            <MonthSelector
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onMonthChange={(m) => setMonthYear(m, selectedYear)}
              onYearChange={(y) => setMonthYear(selectedMonth, y)}
            />

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-black text-white rounded"
            >
              Add
            </button>

            <div ref={menuRef} className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="px-4 py-2 bg-black text-white rounded"
              >
                Filter
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow">
                  {["product", "category", "origin"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setSearchField(f)}
                      className={`block w-full px-4 py-2 text-left ${
                        searchField === f
                          ? "bg-black text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search ${searchField}`}
              className="border px-3 py-2 rounded"
            />
          </div>
        </div>

        <div className="bg-white rounded shadow overflow-x-auto">
          <Table>
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
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    onClick={() => handleRowClick(row.original)}
                    className="cursor-pointer hover:bg-blue-50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center">
                    No data found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AddBenchmarkModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          fetchBenchmarks();
          toast.success("Product added");
        }}
      />

      <ToastContainer />
    </div>
  );
}
