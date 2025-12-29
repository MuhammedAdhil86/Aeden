"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  fetchassetManagement,
  assetManagementSearch,
  fetchthirdPartyOwnload,
  searchthirdPartyOwnload,
} from "@/service/report";
// import DownloadAsset from "./DownloadAsset";
import { Input } from "@/components/ui/input";
import DownloadThrdOrOwn from "./DownloadThrdOrOwn";
import { deleteTripById } from "@/service/fleet";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FormSchema = z.object({
  from: z.date({
    required_error: "A start date is required.",
  }),
  to: z.date({
    required_error: "An end date is required.",
  }),
});

export default function page() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 9,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [triggerRefresh, setTriggerRefresh] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      from: null,
      to: null,
    },
  });

  const refreshTripData = () => {
    setTriggerRefresh((prev) => !prev);
  };

  const { watch } = form;
  const fromDate = watch("from");
  const toDate = watch("to");

  const columns = [
  {
    accessorKey: "id",
    header: "Trip Id",
    cell: ({ getValue }) => getValue() || "N/A",
  },
  {
    accessorKey: "trip_type",
    header: "Trip Type",
    cell: ({ getValue }) => getValue() || "N/A",
  },
  {
    accessorKey: "loading_date",
    header: "Loading Date",
    cell: ({ getValue }) => getValue() || "N/A",
  },
  {
    accessorKey: "unloading_date",
    header: "Unloading Date",
    cell: ({ getValue }) => getValue() || "N/A",
  },
  {
    accessorKey: "regNo",
    header: "Reg No",
    cell: ({ getValue }) => getValue() || "N/A",
  },
  {
    accessorKey: "driver_name",
    header: "Driver name",
    cell: ({ getValue }) => getValue() || "N/A",
  },
  {
    accessorKey: "loading_point",
    header: "Loading Point",
    cell: ({ getValue }) => getValue() || "N/A",
  },
  {
    accessorKey: "unloading_point",
    header: "Unloading Point",
    cell: ({ getValue }) => (
      <div className="line-clamp-2 overflow-hidden text-ellipsis break-words max-w-xs">
        {getValue() || "N/A"}
      </div>
    ),
  },
   {
        accessorKey: "actions",
        header: "Action",
        cell: ({ row }) => {
          
          const handleDelete = async (e) => {
            e.stopPropagation();
            const confirmed = window.confirm("Do you want to delete this trip?");
            if (!confirmed) return;
            const tripId = row.original.id;
            console.log("Deleting trip ID:", tripId);
            try {
              await deleteTripById(tripId);
              toast.success("Trip deleted successfully");
              fetchDefaultData();
            } catch (error) {
              console.error("Failed to delete trip:", error);
              toast.error("Failed to delete trip");
            }
          };
  
          return (
            <div className="relative">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="p-2 action-button rounded-full hover:bg-gray-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24"
                      viewBox="0 -960 960 960"
                      width="24"
                      fill="#000"
                    >
                      <path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z" />
                    </svg>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40 p-0 popover-content" align="end">
                  <div className="flex flex-col items-start bg-white">
                  
                    <Button
                      variant="ghost"
                      className="w-full flex justify-start px-4 py-2 text-black hover:bg-gray-100"
                      data={row.original}
                      onClick={handleDelete}
                      onUpdate={refreshTripData}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="18px"
                        viewBox="0 -960 960 960"
                        width="18px"
                        fill="#000"
                      >
                        <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                      </svg>
                      Delete
                    </Button>
                    
                  
                  </div>
                </PopoverContent>
              </Popover>
  
            </div>
          );
        },
      },
];

  useEffect(() => {
      fetchDefaultData();
    }, [triggerRefresh]);

  const fetchDefaultData = async () => {
    try {
      const startDate = fromDate
        ? format(fromDate, "yyyy-MM-dd'T'00:00:00'Z'")
        : "";
      const endDate = toDate ? format(toDate, "yyyy-MM-dd'T'23:59:59'Z'") : "";

      const response = await fetchthirdPartyOwnload(startDate, endDate);
      console.log("response : ", response);

      const tripsArray = response?.entries
        ? response.entries.map((data) => ({
            id: data.trip_id,
            trip_type: data.trip_type,
            loading_date:
              data.loading_date && data.loading_date !== "0001-01-01T00:00:00Z"
                ? format(new Date(data.loading_date), "MMM dd, yyyy")
                : "N/A",
            unloading_date:
              data.unloading_date &&
              data.unloading_date !== "0001-01-01T00:00:00Z"
                ? format(new Date(data.unloading_date), "MMM dd, yyyy")
                : "N/A",
            regNo: data.vehicle_number,
            driver_name: data.driver_name,
            loading_point: data.loading_point,
            unloading_point: data.unloading_point,
          }))
        : [];

      console.log("Fleet expense data:", tripsArray);
      setData(tripsArray);
      setIsSearching(false);
    } catch (error) {
      console.error("Failed to fetch asset management:", error);
      setData([]);
    }
  };

  const fetchSearchData = async (term) => {
    try {
      const response = await searchthirdPartyOwnload(term);
      console.log("Search result : ", response);

      const searchArray = response.entries
        ? response.entries.map((data) => ({
            id: data.trip_id,
            trip_type: data.trip_type,
            loading_date:
              data.loading_date && data.loading_date !== "0001-01-01T00:00:00Z"
                ? format(new Date(data.loading_date), "MMM dd, yyyy")
                : "N/A",
            unloading_date:
              data.unloading_date &&
              data.unloading_date !== "0001-01-01T00:00:00Z"
                ? format(new Date(data.unloading_date), "MMM dd, yyyy")
                : "N/A",
            regNo: data.vehicle_number,
            driver_name: data.driver_name,
            loading_point: data.loading_point,
            unloading_point: data.unloading_point,
          }))
        : [];

      console.log("Search asset management data:", searchArray);
      setData(searchArray);
      setIsSearching(true);
    } catch (error) {
      console.error("Failed to fetch search results:", error);
      setData([]);
    }
  };

  useEffect(() => {
    if (!searchTerm) {
      fetchDefaultData();
    }
  }, [fromDate, toDate, searchTerm]);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      fetchDefaultData();
    } else {
      fetchSearchData(term);
    }
  };

  const table = useReactTable({
    data,
    columns,
    getRowId: (row) => row.id?.toString(),
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      <Header />
      <div className="pt-5 px-2">
        <div className="w-full flex gap-x-5 items-center">
          <div className="w-full flex justify-between">
            <p className="text-black font-medium pt-1">
              Third-party trip/ own vehicle trip details
            </p>
            <DownloadThrdOrOwn data={data} className="" />
          </div>
          <div className="flex w-52 justify-between rounded-lg">
            <div className="flex items-center">
              <Input
                type="text"
                placeholder="Search by Reg no / driver name"
                onChange={handleSearchChange}
                value={searchTerm}
                className="px-3 py-2 bg-white text-black rounded-md text-sm focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <div className="bg-black flex items-center rounded-r-lg px-2">
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

        <div className="">
          <Table className="p-5 text-neutral-600 bg-white mt-3 rounded-lg w-[85vw]">
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
                    className="text-left h-12 cursor-pointer hover:bg-gray-100"
                    onClick={(e) => {
                      console.log("Navigating to trip ID:", row.original.id);
                      const isActionClick = e.target.closest(
                        ".action-button, .popover-content"
                      );
                      if (isActionClick) return;
                      if (!row.original.id) {
                        console.error("Missing id in row data:", row.original);
                        return;
                      }
                      router.push(`/admin/asset/detail?id=${row.original.id}`);
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-left uppercase">
                        {cell.column.id === "status" ? (
                          <span
                            className={`ps-1 py-1 pe-3 inline-block w-max flex items-center gap-1 rounded-md text-xs font-medium ${
                              //statusColors[cell.getValue()] ||
                              "bg-gray-100 text-black"
                            }`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <circle cx="12.1" cy="12.1" r="1" />
                            </svg>
                            {cell.getValue()}
                          </span>
                        ) : (
                          flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )
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

          <div className="w-full flex justify-end gap-x-8 items-center text-xs border-t py-3 px-5 text-black bg-white">
            <p>Rows per page 9</p>
            <span>
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
            <div
              onClick={() => table.previousPage()}
              className={cn(
                "cursor-pointer",
                !table.getCanPreviousPage() && "opacity-50 cursor-not-allowed"
              )}
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
              onClick={() => table.nextPage()}
              className={cn(
                "cursor-pointer",
                !table.getCanNextPage() && "opacity-50 cursor-not-allowed"
              )}
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
              <ToastContainer position="top-right" autoClose={3000} />

      </div>
    </div>
  );
}
