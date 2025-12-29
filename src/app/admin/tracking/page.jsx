"use client";

import Header from "@/components/Header";
import React, { useEffect } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

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
import { fetchBooking, fetchBookingSearch } from "@/service/booking";
import ExcelDownloadComponent from "./ExcelDownloadComponent";
import { Input } from "@/components/ui/input";

const columns = [
  {
    accessorKey: "supplier_name",
    header: "Supplier Name",
  },
  {
    accessorKey: "consignee",
    header: "Consignee",
  },
  {
    accessorKey: "country",
    header: "Country",
  },
  {
    accessorKey: "product_id",
    header: "Product Name",
  },
  {
    accessorKey: "uin",
    header: ({ column }) => (
      <div
        variant="ghost"
        className="text-left flex items-center cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        UIN No{" "}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="18px"
          viewBox="0 -960 960 960"
          width="18px"
          fill="#000"
        >
          <path d="M440-160v-487L216-423l-56-57 320-320 320 320-56 57-224-224v487h-80Z" />
        </svg>
      </div>
    ),
  },
  // {
  //   accessorKey: "uin",
  //   header: "UIN",
  // },
];

// const columns = [
//   {
//     accessorKey: "uin",
//     header: "UIN",
//   },
//   {
//     accessorKey: "party_name",
//     header: "Party Name",
//   },
//   {
//     accessorKey: "category.category_name",
//     header: "category"
//   },
//   {
//     accessorKey: "products.name",
//     header: "Product",
//     cell: ({ row }) => {
//       return row.original.products?.name ?? "—";
//     }
//   },
//   {
//     accessorKey: "address",
//     header: "Address",
//   },
// ];

export default function Tracking() {
  const router = useRouter();
  const { register, handleSubmit, reset, control } = useForm();
  const [bookingData, setBookingData] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleCancel = () => {
    reset();
    onCancel?.();
  };

  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const table = useReactTable({
    data: data || [],
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    fetchBookingData();
  }, []);

  const fetchBookingData = async () => {
    setLoading(true);
    try {
      const response = await fetchBooking();
      const bookings = Array.isArray(response)
        ? response
        : response?.data || [];

      console.log("bookings data : ", bookings);
      if (bookings) {
        setExcelData(bookings);
      }
      const processedData = bookings.map((booking) => ({
        supplier_name: booking.supplier_name || "N/A",
        consignee: booking.consignee || "N/A",
        country: booking.country || "N/A",
        product_id: booking.product_id || "N/A",
        uin: booking.uin || "N/A",
      }));
      setData(processedData);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      setError("Failed to load booking data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      fetchBookingData();
      return;
    }

    try {
      setLoading(true);
      const response = await fetchBookingSearch(value);

      if (!response || response.length === 0) {
        setData([]);
        setError("No matching bookings found.");
        return;
      }

      const processedData = response.map((booking) => ({
        supplier_name: booking.supplier_name || "N/A",
        consignee: booking.consignee || "N/A",
        country: booking.country || "N/A",
        product_id: booking.product_id || "N/A",
        uin: booking.uin || "N/A",
      }));

      setData(processedData);
      setError(null);
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to search bookings.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (row) => {
    const rowData = row.original;
    const uin = rowData.uin;

    router.push(`/admin/tracking/detail?uin=${uin}`);
  };

  return (
    <div className="overflow-hidden">
      <div>
        <Header />
      </div>
      <div className="mt-6 px-2">
        <div className="w-[98%] flex justify-between pe-5">
          <div className="flex items-center gap-x-5">
            <p className="text-black font-medium text-lg">Track orders</p>
            <div className="hidden">
              <Select
                {...register("category")}
                required
                className="border-neutral-400 text-neutral-600 rounded-lg text-xs mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <SelectTrigger className="text-neutral-600 ">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="text-black  bg-white">
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="furniture">Furniture</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-x-3 ">
            <ExcelDownloadComponent data={excelData} />
            <div className="bg-white flex w-52 justify-between rounded-lg">
              <div className="flex items-center">
                <Input
                  type="text"
                  placeholder="Search by product"
                  value={searchTerm}
                  onChange={handleSearch}
                  className="px-3 py-2 bg-white text-black rounded-md text-sm focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <div
                onClick={handleSearch}
                className="bg-black flex items-center rounded-r-lg px-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20px"
                  viewBox="0 -960 960 960"
                  width="20px"
                  fill="#FFFFFF"
                >
                  <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="">
          <Table className="p-5 text-neutral-600 bg-white mt-3 rounded-lg uppercase">
            <TableHeader className="text-black text-left">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="text-left">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-left">
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
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="text-left h-12 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleRowClick(row)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-left">
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
                    No data found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="w-full flex justify-end gap-x-8 items-center text-xs border-t py-3 px-5 text-black bg-white">
            <p>Rows per page 10</p>
            <span>
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
            <div
              variant="outline"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="14px"
                viewBox="0 -960 960 960"
                width="14px"
                fill="#000"
              >
                <path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" />
              </svg>
            </div>
            <div
              variant="outline"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="14px"
                viewBox="0 -960 960 960"
                width="14px"
                fill="#000"
              >
                <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
