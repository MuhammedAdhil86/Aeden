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
import { fetchFleetExpense } from "@/service/report";
import DownloadExpense from "./DownloadExpense";

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
    accessorKey: "regNo",
    header: "Reg No",
    cell: ({ getValue }) => getValue(),
  }, 
  {
    accessorKey: "vehicleName",
    header: "Vehicle Name",
    cell: ({ getValue }) => getValue(),
  },
  {
    accessorKey: "noTrip",
    header: "No of Trips",
    cell: ({ getValue }) => getValue(),
  },
  {
    accessorKey: "KmDriver",
    header: "Km Driver",
    cell: ({ getValue }) => getValue(),
  },
  {
    accessorKey: "totalExpense",
    header: "Total Expense",
    cell: ({ getValue }) => getValue(),
  },
];

export default function ExpensePage() {
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

  useEffect(() => {
  const fetchData = async () => {
    try {
      const startDate = fromDate
        ? format(fromDate, "yyyy-MM-dd'T'00:00:00'Z'")
        : "";
      const endDate = toDate
        ? format(toDate, "yyyy-MM-dd'T'23:59:59'Z'")
        : "";

      const response = await fetchFleetExpense(startDate, endDate);
      console.log("response : ", response);

      const tripsArray = response
        ? response.map((data) => ({
            id: data.id,
            regNo: data.truckid.register_number || "",
            vehicleName: data.truckid.vehicle_name || "",
            noTrip: data.number_of_trips || "0",
            KmDriver: data.truckid.odometer_km || "0",
            totalExpense: data.trip_expenses || "0",
            email: data.email,
            aadhar: data.aadhaar_number,
            truckid: data.truckid.id
          }))
        : [];

      console.log("Fleet expense data:", tripsArray);
      setData(tripsArray);
    } catch (error) {
      console.error("Failed to fetch fleet expense:", error);
      setData([]);
    }
  };

  fetchData();
}, [fromDate, toDate]);


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
      <div className="pt-5 px-5">
        <div className="w-full flex gap-x-5 items-center">
          <p className="text-black font-medium pt-1">Fleet Expense Analysis</p>
          <div className="flex-1 flex items-center">
            <Form {...form}>
              <form className="space-x-2 w-[80%] flex items-center">
                <FormField
                  control={form.control}
                  name="from"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-[200px] pl-3 text-left text-[13px] font-normal bg-white text-neutral-600",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <div className="w-full flex items-center justify-between">
                                  <span className="text-neutral-600 text-[13px]">
                                    Select date
                                  </span>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="16"
                                    viewBox="0 -960 960 960"
                                    width="16"
                                    className="fill-neutral-600"
                                  >
                                    <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
                                  </svg>
                                </div>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            className="bg-white text-neutral-600"
                            selected={field.value}
                            onSelect={(date) => field.onChange(date)}
                            initialFocus
                            classNames={{
                              day_selected: "bg-black text-white",
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center px-3">
                  <p className="text-xs text-neutral-600">---&nbsp; to &nbsp;---</p>
                </div>

                <FormField
                  control={form.control}
                  name="to"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-[200px] pl-3 text-left text-[13px] font-normal bg-white text-neutral-600",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <div className="w-full flex items-center justify-between">
                                  <span className="text-neutral-600 text-[13px]">
                                    Select date
                                  </span>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="16"
                                    viewBox="0 -960 960 960"
                                    width="16"
                                    className="fill-neutral-600"
                                  >
                                    <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
                                  </svg>
                                </div>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            className="bg-white text-neutral-600"
                            selected={field.value}
                            onSelect={(date) => field.onChange(date)}
                            initialFocus
                            classNames={{
                              day_selected: "bg-black text-white",
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
          <DownloadExpense data={data} className=''/>
        </div>

        <div className="">
          <Table className="p-5 text-neutral-600 bg-white mt-3 rounded-lg">
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
                      console.log("Navigating to expense truck ID:", row.original.truckid);
                      const isActionClick = e.target.closest(
                        ".action-button, .popover-content"
                      );
                      if (isActionClick) return;
                      if (!row.original.truckid) {
                        console.error("Missing id in row data:", row.original);
                        return;
                      }
                      router.push(
                        `/admin/expense/detail?id=${row.original.truckid}`
                      );
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-left">
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
      </div>
    </div>
  );
}
