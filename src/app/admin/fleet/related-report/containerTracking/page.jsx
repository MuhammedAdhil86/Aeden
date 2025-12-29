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
import { fetchContainerTracking, fetchTruckTracking, searchContainer } from "@/service/report";
import ContainerDownload from "./ContainerDownload";
import { Input } from "@/components/ui/input";

const FormSchema = z.object({
  from: z.date({
    required_error: "A start date is required.",
  }),
  to: z.date({
    required_error: "An end date is required.",
  }),
});

const columns = [
  {
    accessorKey: "trip_id",
    header: "Trip Id",
    cell: ({ getValue }) => getValue() || "N/A",
  },
  {
    accessorKey: "container_number",
    header: "Container Number",
    cell: ({ getValue }) => getValue() || "N/A",
  },
  {
    accessorKey: "godown_in",
    header: "Godown in",
    cell: ({ getValue }) => getValue() || "N/A",
  },
  {
    accessorKey: "godown_out",
    header: "Godown Out",
    cell: ({ getValue }) => getValue() || "N/A",
  },
  {
    accessorKey: "yard_in",
    header: "Yard in",
    cell: ({ getValue }) => `${getValue()}` || "N/A",
  },
  {
    accessorKey: "ageing_days",
    header: "Ageing Days",
    cell: ({ getValue }) => `${getValue()} days` || "0 days",
  },
  {
    accessorKey: "return_location",
    header: "Return Location",
    cell: ({ getValue }) => getValue() || "N/A",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => getValue() || "N/A",
  },
];

const statusColors = {
  returned: "bg-green-100 text-black",
  in_godown: "bg-red-100 text-black",
};

const statusLabels = {
  returned: "Returned",
  in_godown: "In Godown",
};

export default function page() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 9,
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      from: null,
      to: null,
    },
  });

  const { watch } = form;
  const fromDate = watch("from");
  const toDate = watch("to");

  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      fetchDefaultData();
    } else {
      fetchSearchData(term);
    }
  };

  const fetchDefaultData = async () => {
    try {
      const response = await fetchContainerTracking();
      console.log("response : ", response);

      const truckArray = response?.entries
        ? response.entries.map((data) => ({
            trip_id: data.trip_id,
            container_number: data.container_number,
            godown_in: data.godown_in && data.godown_in !== "0001-01-01T00:00:00Z"
              ? format(new Date(data.godown_in), "MMM dd, yyyy")
              : "N/A",
            godown_out: data.godown_out && data.godown_out !== "0001-01-01T00:00:00Z"
              ? format(new Date(data.godown_out), "MMM dd, yyyy")
              : "N/A",
            yard_in: data.yard_in && data.yard_in !== "0001-01-01T00:00:00Z"
              ? format(new Date(data.yard_in), "MMM dd, yyyy")
              : "N/A",
            ageing_days: data.ageing_days || 0,
            return_location: data.return_location || "N/A",
            status: data.status || "N/A",
          }))
        : [];

      console.log("Container tracking data:", truckArray);
      setData(truckArray);
      setIsSearching(false);
    } catch (error) {
      console.error("Failed to fetch container tracking:", error);
      setData([]);
    }
  };

  const fetchSearchData = async (term) => {
    try {
      const response = await searchContainer(term);
      console.log("Search result : ", response);

      const searchArray = response?.entries
        ? response.entries.map((data) => ({
            trip_id: data.trip_id,
            container_number: data.container_number || "N/A" ,
            godown_in: data.godown_in && data.godown_in !== "0001-01-01T00:00:00Z"
              ? format(new Date(data.godown_in), "MMM dd, yyyy")
              : "N/A",
            godown_out: data.godown_out && data.godown_out !== "0001-01-01T00:00:00Z"
              ? format(new Date(data.godown_out), "MMM dd, yyyy")
              : "N/A",
            yard_in: data.yard_in && data.yard_in !== "0001-01-01T00:00:00Z"
              ? format(new Date(data.yard_in), "MMM dd, yyyy")
              : "N/A",
            ageing_days: data.ageing_days || 0,
            return_location: data.return_location || "N/A",
            status: data.status || "N/A",
          }))
        : [];

      console.log("Search container tracking data:", searchArray);
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
  }, [searchTerm]);

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
          <p className="text-black font-medium pt-1">Container Tracking</p>
          <div className="flex-1 flex items-center"></div>
          <ContainerDownload data={data} />
          <div className="flex w-52 justify-between rounded-lg">
            <div className="flex items-center">
              <Input
                type="text"
                placeholder="Search by container number"
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
          <Table className="p-5 text-neutral-600 bg-white mt-3 rounded-lg w-[95vw]">
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
                      router.push(
                        `/admin/fleet/manage-trip/details?id=${row.original.id}`
                      );
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-left">
                        {cell.column.id === "status" ? (
                          <span
                            className={`ps-1 py-1 pe-3 inline-block w-max flex items-center gap-1 rounded-md text-xs font-medium ${
                              statusColors[cell.getValue()] ||
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
                            {statusLabels[cell.getValue()] || "Unknown"}
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
      </div>
    </div>
  );
}
