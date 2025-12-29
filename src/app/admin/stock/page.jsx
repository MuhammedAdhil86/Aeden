
"use client";
import React from "react";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
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
import { Input } from "@/components/ui/input";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchStock, fetchStockByDateRange } from "@/service/stock";
import Header from "@/components/Header";

const FormSchema = z.object({
  dateRange: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .optional(),
});

const availabilityColors = {
  Available: "text-gray-600",
  "Out of stock": "text-red-700",
};

// Memoized table columns to prevent unnecessary re-renders
const useStockColumns = () => useMemo(() => [
  {
    accessorKey: "sno",
    header: "S.No",
    cell: ({ row }) => row.index + 1,
  },
   {
    accessorKey: "category",
    header: "Category",
    cell: ({ getValue }) => getValue(),
    size: 180,
  },
  {
    accessorKey: "productName",
    header: "Variety",
    cell: ({ getValue }) => getValue(),
    size: 250,
  },
 
  {
    accessorKey: "batchId",
    header: "Batch Id",
    cell: ({ getValue }) => getValue(),
    size: 160,
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ getValue }) => getValue() || "-",
    size: 160,
  },
  {
    accessorKey: "availability",
    header: "Availability",
    size: 160,
    cell: ({ getValue }) => {
      const availability = getValue();
      return (
        <span
          className={`px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${
            availabilityColors[availability] || " text-black"
          }`}
        >
          {availability}
        </span>
      );
    },
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ getValue }) => getValue(),
    size: 160,
  },
  {
    accessorKey: "unit",
    header: "Unit",
    cell: ({ getValue }) => getValue(),
    size: 160,
  },
], []);

// Debounce function outside component
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

function Stock() {
  const { register, handleSubmit, reset, control, watch } = useForm();
  const [data, setData] = useState([]);
  const [allStockData, setAllStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stockSearchTerm, setStockSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const [searchField, setSearchField] = useState("ProductName");
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const selectedAvailability = watch("filterByAvailability");
  const [selectedDateRange, setSelectedDateRange] = useState({
    from: undefined,
    to: undefined,
  });

  // Move useForm hook to top level - FIXED
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      dateRange: {
        from: undefined,
        to: undefined,
      },
    },
  });

  const columns = useStockColumns();

  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  // Optimized data filtering with useMemo
  const filteredData = useMemo(() => {
    if (!availabilityFilter) return data;
    
    return data.filter(
      (item) =>
        item.availability.toLowerCase() === availabilityFilter.toLowerCase()
    );
  }, [data, availabilityFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getRowId: (row) => row.id.toString(),
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Optimized data processing function
  const processStockData = useCallback((stockData) => {
    const idCount = {};
    return stockData.map((stock, index) => {
      const availability =
        parseInt(stock.Quantity) > 0 ? "Available" : "Out of stock";

      // Create unique ID to avoid duplicate keys
      let uniqueId;
      if (stock.ID && stock.BatchID) {
        uniqueId = `${stock.ID}-${stock.BatchID}`;
      } else if (stock.ID) {
        uniqueId = `${stock.ID}-${index}`;
      } else {
        uniqueId = `stock-${index}`;
      }

      if (idCount[uniqueId]) {
        idCount[uniqueId]++;
        uniqueId = `${uniqueId}-${idCount[uniqueId]}`;
      } else {
        idCount[uniqueId] = 1;
      }

      return {
        id: uniqueId,
        sno: index + 1,
        productName: stock.ProductName || "",
        category: stock.Category || "",
        batchId: stock.BatchID || "",
        size: stock.Size || "",
        availability: availability,
        stock: stock.Quantity || "0",
        unit: stock.Unit || "Box",
        createdAt: stock.CreatedAt,
        updatedAt: stock.UpdatedAt,
        // Keep original fields for searching
        ProductName: stock.ProductName || "",
        BatchID: stock.BatchID || "",
        Category: stock.Category || "",
        Quantity: stock.Quantity || "0",
        originalId: stock.ID,
      };
    });
  }, []);

  // Optimized fetch function
  const fetchStockData = useCallback(async () => {
    setLoading(true);
    
    try {
      const response = await fetchStock();
      
      console.log("Stock data:", response);

      if (!response || response.length === 0) {
        setData([]);
        setAllStockData([]);
        setError("No stock data available.");
        return;
      }

      const processedData = processStockData(response);
      
      setData(processedData);
      setAllStockData(processedData);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch stocks:", error);
      setError("Failed to load stock data. Please try again later.");
      setData([]);
      setAllStockData([]);
    } finally {
      setLoading(false);
    }
  }, [processStockData]);

  // Optimized search function
  const performClientSideSearch = useCallback((searchValue, field) => {
    if (!searchValue.trim()) {
      return allStockData;
    }

    const searchTerm = searchValue.toLowerCase();

    return allStockData.filter((stock) => {
      let fieldValue = "";

      if (field === "Available") {
        const quantity = parseInt(stock.Quantity || 0);
        fieldValue = quantity > 0 ? "available" : "out of stock";
      } else {
        const actualField =
          field === "ProductName"
            ? "ProductName"
            : field === "BatchID"
            ? "BatchID"
            : field === "Category"
            ? "Category"
            : field;
        fieldValue = String(stock[actualField] || "").toLowerCase();
      }

      return fieldValue.includes(searchTerm);
    });
  }, [allStockData]);

  // Debounced search handler
  const handleStockSearch = useCallback(
    debounce((value) => {
      if (value.trim() === "") {
        setData(allStockData);
        return;
      }

      try {
        setLoading(true);
        const searchResults = performClientSideSearch(value, searchField);

        if (searchResults.length > 0) {
          setData(searchResults);
          setError(null);
          toast.success(
            `Found ${
              searchResults.length
            } results for ${getSearchFieldDisplayName()}`
          );
        } else {
          setData([]);
          setError("No matching stocks found.");
        }
      } catch (err) {
        console.error("Stock Search Error:", err);
        setError("Failed to search stocks.");
        setData([]);
        toast.error("Search failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }, 300),
    [performClientSideSearch, searchField, allStockData]
  );

  const onSearchInputChange = (e) => {
    const value = e.target.value;
    setStockSearchTerm(value);
    handleStockSearch(value);
  };

  // Optimized date range handler
  const handleDateRangeChange = useCallback(async (range) => {
    console.log("handleDateRangeChange called with:", range);
    setSelectedDateRange(range);

    if (!range?.from && !range?.to) {
      setData(allStockData);
      return;
    }

    setLoading(true);

    try {
      const fromDate = format(range.from, "yyyy-MM-dd");
      const toDate = range.to
        ? format(range.to, "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM-dd");

      console.log("📅 Fetching data - From:", fromDate, "To:", toDate);

      const response = await fetchStockByDateRange(fromDate, toDate);
      
      if (response && Array.isArray(response) && response.length > 0) {
        const processedData = processStockData(response);
        setData(processedData);
        setError(null);
      } else {
        setData([]);
        setError("No stock data found for the selected date range.");
        toast.info("No stock data found for the selected date range.");
      }
    } catch (error) {
      console.error("Failed to fetch stock data by date range:", error);
      setError("Failed to load stock data for the selected date range.");
      toast.error("Failed to load data. Please try again later.");
      // Fallback to showing all data
      setData(allStockData);
    } finally {
      setLoading(false);
    }
  }, [allStockData, processStockData]);

  // Initial data fetch
  useEffect(() => {
    fetchStockData();
  }, [fetchStockData]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Availability filter effect
  useEffect(() => {
    setAvailabilityFilter(selectedAvailability || "");
  }, [selectedAvailability]);

  const clearAllFilters = () => {
    setStockSearchTerm("");
    setSearchField("ProductName");
    setSelectedDateRange({ from: undefined, to: undefined });
    setData(allStockData);
  };

  const getSearchFieldDisplayName = () => {
    const fieldNames = {
      ProductName: "Product Name",
      BatchID: "Batch ID",
      Category: "Category",
      Available: "Available",
    };
    return fieldNames[searchField] || "Product Name";
  };

  const handleSearchFieldChange = (field) => {
    setSearchField(field);
    setOpen(false);
    setStockSearchTerm("");
    setData(allStockData);
  };

  const refreshStockData = () => {
    fetchStockData();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="bg-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-gray-900 ml-2">
            Stock List
          </h1>

          <div className="flex items-center gap-4">
            {/* Date Range Picker */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Popover>
                <PopoverTrigger asChild>
                  <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 text-gray-500 text-xs">
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {selectedDateRange?.from
                      ? format(selectedDateRange.from, "dd/MM/yyyy")
                      : "Start Date"}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDateRange?.from}
                    onSelect={(date) => {
                      const newRange = {
                        from: date,
                        to: selectedDateRange?.to,
                      };
                      setSelectedDateRange(newRange);
                      if (date && !selectedDateRange?.to) {
                        handleDateRangeChange({ from: date, to: null });
                      } else if (date && selectedDateRange?.to) {
                        handleDateRangeChange(newRange);
                      }
                    }}
                    initialFocus
                    className="rounded-md border"
                  />
                </PopoverContent>
              </Popover>

              <div className="flex items-center px-1">
                <p className="text-xs text-neutral-600">--- to ---</p>
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 text-gray-500 text-xs">
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {selectedDateRange?.to
                      ? format(selectedDateRange.to, "dd/MM/yyyy")
                      : "End Date"}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDateRange?.to}
                    onSelect={(date) => {
                      const newRange = {
                        from: selectedDateRange?.from,
                        to: date,
                      };
                      setSelectedDateRange(newRange);
                      if (selectedDateRange?.from && date) {
                        handleDateRangeChange(newRange);
                      }
                    }}
                    initialFocus
                    className="rounded-md border"
                  />
                </PopoverContent>
              </Popover>

              {(stockSearchTerm ||
                selectedDateRange.from ||
                selectedDateRange.to) && (
                <button
                  onClick={clearAllFilters}
                  className="px-3 py-2 text-sm text-black hover:bg-red-50 rounded-lg transition flex items-center gap-2 border border-gray-300"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Clear
                </button>
              )}
            </div>

            {/* Filter, Download, and Search buttons */}
            <div className="flex items-center gap-3">
              {/* Filter Button with Dropdown */}
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
                      <button
                        onClick={() => handleSearchFieldChange("ProductName")}
                        className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 rounded-lg transition-colors ${
                          searchField === "ProductName"
                            ? "bg-black text-white"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
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
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Product Name
                      </button>

                      <button
                        onClick={() => handleSearchFieldChange("BatchID")}
                        className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 rounded-lg transition-colors mt-1 ${
                          searchField === "BatchID"
                            ? "bg-black text-white"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
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
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                          />
                        </svg>
                        Batch ID
                      </button>

                      <button
                        onClick={() => handleSearchFieldChange("Category")}
                        className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 rounded-lg transition-colors mt-1 ${
                          searchField === "Category"
                            ? "bg-black text-white"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
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
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                          />
                        </svg>
                        Category
                      </button>

                      <button
                        onClick={() => handleSearchFieldChange("Available")}
                        className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 rounded-lg transition-colors mt-1 ${
                          searchField === "Available"
                            ? "bg-black text-white"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
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
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Available
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Download Button */}
              <button
                onClick={() =>
                  toast.info("Excel download functionality to be implemented")
                }
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </button>

              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder={`Search by ${getSearchFieldDisplayName().toLowerCase()}...`}
                  value={stockSearchTerm}
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

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden text-gray-600 ml-2">
          <Table>
            <TableHeader className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-xs font-medium text-black uppercase tracking-wider px-3 py-2 whitespace-nowrap"
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
                    className=" py-4 text-gray-500"
                  >
                    <div className="flex items-center justify-center text">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Loading...
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-gray-50 transition"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="text-xs px-3 py-1.5 whitespace-nowrap"
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
                    className="text-center py-4 text-gray-500 text-xs"
                  >
                    No stock data found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="bg-white px-4 py-2 flex items-center justify-end border-t border-gray-200">
            <div className="flex items-center gap-6">
              <span className="text-xs text-gray-700">
                Rows per page: {table.getState().pagination.pageSize}
              </span>
              <span className="text-xs text-gray-700">
                {table.getState().pagination.pageIndex *
                  table.getState().pagination.pageSize +
                  1}
                -
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) *
                    table.getState().pagination.pageSize,
                  filteredData.length
                )}{" "}
                of {filteredData.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="p-1 h-7 w-7"
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="p-1 h-7 w-7"
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Stock;