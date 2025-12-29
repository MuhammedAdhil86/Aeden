"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "@/components/Header";
import MonthSelector from "@/components/ui/monthSelector";
import { z } from "zod";
import { cn } from "@/lib/utils";

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

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetchAllOrders } from "@/service/sales";
import AddOrderModal from "./addOrders/page";
const FormSchema = z.object({
  month: z.string().optional(),
  year: z.string().optional(),
});

// Debounce function
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const useOrdersColumns = () =>
  useMemo(
    () => [
      {
        accessorKey: "slNo",
        header: "S.No",
        size: 70,
        cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: "orderId",
        header: "Order Id",
        size: 120,
        cell: ({ getValue }) => getValue() || "-",
      },
      {
        accessorKey: "customer",
        header: "Customer",
        size: 250,
        cell: ({ getValue }) => getValue() || "-",
      },
      {
        accessorKey: "orderTakenBy",
        header: "Order taken by",
        size: 200,
        cell: ({ getValue }) => getValue() || "-",
      },
      {
        accessorKey: "date",
        header: "Date",
        size: 150,
        cell: ({ getValue }) => {
          const value = getValue();
          if (!value || value === "-") return "-";
          
          try {
            const date = new Date(value);
            if (isNaN(date.getTime())) {
              if (typeof value === 'string' && value.includes('/')) {
                return value;
              }
              return "-";
            }
            
            const d = String(date.getDate()).padStart(2, "0");
            const m = String(date.getMonth() + 1).padStart(2, "0");
            const y = date.getFullYear();
            return `${d}/${m}/${y}`;
          } catch {
            return value;
          }
        },
      },
      {
        accessorKey: "amount",
        header: "Amount",
        size: 150,
        cell: ({ getValue }) => {
          const value = getValue();
          if (!value || value === "0") return "¥0";
          return `¥${Number(value).toLocaleString()}`;
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 150,
        cell: ({ getValue }) => {
          const status = (getValue() || "").toLowerCase();
          const getStatusBlocks = (status) => {
            switch(status) {
              case 'approved':
              case 'completed':
                return (
                  <div className="flex items-center">
                    <div className="w-12 h-2 bg-green-600 rounded-full"></div>
                    <span className="ml-2 text-xs font-medium text-green-600 capitalize">
                      {status}
                    </span>
                  </div>
                );
              case 'pending':
                return (
                  <div className="flex items-center">
                    <div className="w-8 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="ml-2 text-xs font-medium text-yellow-600 capitalize">
                      {status}
                    </span>
                  </div>
                );
              case 'cancelled':
                return (
                  <div className="flex items-center">
                    <div className="w-10 h-2 bg-red-600 rounded-full"></div>
                    <span className="ml-2 text-xs font-medium text-red-600 capitalize">
                      {status}
                    </span>
                  </div>
                );
              default:
                return (
                  <div className="flex items-center">
                    <div className="w-12 h-2 bg-gray-400 rounded-full"></div>
                    <span className="ml-2 text-xs font-medium text-gray-600 capitalize">
                      {status || "processing"}
                    </span>
                  </div>
                );
            }
          };
          
          return getStatusBlocks(status);
        },
      },
      {
        accessorKey: "action",
        header: "Action",
        size: 120,
        cell: ({ row }) => {
          const handleViewClick = (e) => {
            e.stopPropagation();
            // You can navigate to order details page or show modal
            console.log("View order:", row.original.orderId);
            // router.push(`/admin/orders/${row.original.orderId}`);
          };
          
          return (
            <button 
              onClick={handleViewClick}
              className="text-blue-600 hover:text-blue-800 underline text-sm font-medium"
            >
              View
            </button>
          );
        },
      },
    ],
    []
  );

function Sales() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const [searchField, setSearchField] = useState("customer");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState("");
  const [originalData, setOriginalData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );

  const columns = useOrdersColumns();
  const router = useRouter();
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const form = useForm({
    resolver: zodResolver(FormSchema),
  });
const fetchData = useCallback(async () => {
  setLoading(true);
  try {
    console.log("📡 Fetching orders...");

    const response = await fetchAllOrders();
    console.log("📦 Raw API response:", response);

    const list = Array.isArray(response) ? response : [];
    console.log("📋 Final list after formatting:", list);

    setOriginalData(list);
    setData(list);
    setError(null);
  } catch (err) {
    console.error("❌ Error fetching orders:", err);
    setError("Failed to load orders data");
    toast.error("Error fetching orders");
  }
  setLoading(false);
}, []);



  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const table = useReactTable({
    data,
    columns,
    getRowId: (row) => row.orderId?.toString() || Math.random().toString(),
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleRowClick = (row) => {
    // Navigate to order details page
    if (row.orderId) {
      router.push(`/admin/orders/${row.orderId}`);
    }
  };

  const performClientSideSearch = useCallback(
  (searchValue, field) => {
    if (!searchValue.trim()) return originalData;

    const term = searchValue.toLowerCase();

    return originalData.filter((item) => {
      let fieldValue = item[field] ? String(item[field]).toLowerCase() : "";
      return fieldValue.includes(term);
    });
  },
  [originalData]
);


  const handleSearch = useCallback(
    debounce((value) => {
      if (value.trim() === "") {
        fetchData();
        return;
      }

      try {
        setLoading(true);
        const searchResults = performClientSideSearch(value, searchField);

        if (searchResults.length > 0) {
          setData(searchResults);
          setError(null);
        } else {
          setData([]);
          setError("No matching orders found.");
        }
      } catch (err) {
        console.error("Search Error:", err);
        setError("Failed to search orders.");
        setData([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    [performClientSideSearch, searchField, fetchData]
  );

  const onSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleSearch(value);
  };

  const handleSearchFieldChange = (field) => {
    setSearchField(field);
    setOpen(false);
    setSearchTerm("");
    fetchData(); 
  };

  const handleMonthChange = async (monthValue) => {
    setSelectedMonth(monthValue);
    filterDataByMonth(monthValue, selectedYear);
  };

  const handleYearChange = async (yearValue) => {
    setSelectedYear(yearValue);
    if (selectedMonth) {
      filterDataByMonth(selectedMonth, yearValue);
    }
  };
  
  const filterDataByMonth = (month, year) => {
  if (!month || !year) {
    setData(originalData);
    return;
  }

  const filtered = originalData.filter((item) => {
    if (!item.date || item.date === "-") return false;

    let dateObj;

    // dd/mm/yyyy
    if (item.date.includes("/")) {
      const [d, m, y] = item.date.split("/");
      dateObj = new Date(y, m - 1, d);
    } else {
      dateObj = new Date(item.date);
    }

    if (isNaN(dateObj)) return false;

    return (
      dateObj.getMonth() + 1 === parseInt(month) &&
      dateObj.getFullYear() === parseInt(year)
    );
  });

  setData(filtered);
};


  const clearAllFilters = () => {
  setSearchTerm("");
  setSearchField("customer");
  setSelectedMonth("");
  setSelectedYear(new Date().getFullYear().toString());
  setData(originalData); // Restore original values
};


  const getSearchFieldDisplayName = () => {
    const fieldNames = {
      customer: "Customer",
      orderTakenBy: "Order Taken By",
      orderId: "Order ID",
      status: "Status",
    };
    return fieldNames[searchField] || "Customer";
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-gray-900">Orders Received</h1>

          <div className="flex items-center gap-6 text-black">
            <MonthSelector
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onMonthChange={handleMonthChange}
              onYearChange={handleYearChange}
              className="text-sm text-black"
            />

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
              <div className="relative" ref={menuRef}>
                <button 
                  onClick={() => setOpen(!open)}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 text-xs font-medium text-gray-500 border-b">
                      Filter By
                    </div>
                    <div className="p-2">
                      {["customer", "orderTakenBy", "orderId", "status"].map((field) => (
                        <button
                          key={field}
                          onClick={() => handleSearchFieldChange(field)}
                          className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 rounded-lg transition-colors mt-1 ${
                            searchField === field
                              ? "bg-black text-white"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Download Button */}
              <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </button>

              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder={`Search by ${getSearchFieldDisplayName().toLowerCase()}...`}
                  value={searchTerm}
                  onChange={onSearchInputChange}
                  className="pl-4 pr-10 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent w-64 text-sm text-gray-800"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden text-gray-500">
          <div className="w-full rounded-lg border border-gray-200 shadow-sm bg-white -mt-1">
            <div className="w-full overflow-x-auto overflow-y-hidden">
              <Table className="w-screen text-xs table-auto">
                <TableHeader>
                  {table.getHeaderGroups().map((hg) => (
                    <TableRow key={hg.id} className="border-b border-gray-200">
                      {hg.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className="bg-gray-50 px-4 py-3 text-left font-semibold text-gray-700 uppercase text-xs tracking-wider whitespace-nowrap"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>

                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="text-center py-10"
                      >
                        <div className="flex justify-center items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        onClick={() => handleRowClick(row.original)}
                        className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className="px-4 py-3 text-gray-500 text-xs"
                          >
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
                      <TableCell
                        colSpan={columns.length}
                        className="text-center py-12 text-gray-500"
                      >
                        {error ? error : "No orders found"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {table.getRowModel().rows.length > 0 && (
            <div className="bg-white px-6 py-3 flex items-center justify-end border-t border-gray-200">
              <div className="flex items-center gap-6">
                <span className="text-sm text-gray-700">
                  Showing{" "}
                  {table.getState().pagination.pageIndex *
                    table.getState().pagination.pageSize +
                    1}{" "}
                  -{" "}
                  {Math.min(
                    (table.getState().pagination.pageIndex + 1) *
                      table.getState().pagination.pageSize,
                    data.length
                  )}{" "}
                  of {data.length} entries
                </span>
              </div>
              <div className="flex items-center gap-2 ml-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="p-1 h-8 w-8"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="p-1 h-8 w-8"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <AddOrderModal
  open={isAddModalOpen}
  onClose={() => setIsAddModalOpen(false)}
  onSuccess={fetchData}   // refresh orders after submit
/>


      <ToastContainer position="top-right" autoClose={1000} />
    </div>
  );
}

export default Sales;