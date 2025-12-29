"use client";
import Header from "@/components/Header";
import React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  deleteTruckById,
  fetchDetailsByTruckSearch,
  fetchTruck,
  fetchTrucksBySearch,
} from "@/service/fleet";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

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
import Link from "next/link";
import { Input } from "@/components/ui/input";
import DownloadExcelButton from "./download/DownloadExcelButton";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FormSchema = z.object({
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
});

const statusColors = {
  false: "bg-red-500 text-white",
  true: "bg-green-500 text-white",
  "On trip": "bg-blue-500 text-white",
};

function ManageVehicle() {
  const { register, handleSubmit, reset, control } = useForm();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [availabilityFilter, setAvailabilityFilter] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [searchField, setSearchField] = useState("owner_name");

  const refreshTruckData = () => {
    setTriggerRefresh((prev) => !prev);
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Owner Name",
      cell: ({ getValue }) => getValue(),
    },
    {
      accessorKey: "ContactNumber",
      header: "Contact number",
      cell: ({ getValue }) => getValue(),
    },
    {
      accessorKey: "registrationNumber",
      header: "Registration number",
      cell: ({ getValue }) => getValue(),
    },
    {
      accessorKey: "vehicleModel",
      header: "Vehicle Model",
      cell: ({ getValue }) => getValue(),
    },
    // {
    //   accessorKey: "availability",
    //   header: "Availability",
    //   cell: ({ getValue }) => {
    //     const rawValue = getValue();
    //     const available = String(rawValue).toLowerCase() === "true";
    //     return (
    //       <span
    //         className={`px-2 py-1 text-xs font-semibold rounded-full ${
    //           available
    //             ? "bg-green-100 text-green-700"
    //             : "bg-yellow-200 text-yellow-700"
    //         }`}
    //       >
    //         {available ? "Available" : "In trip"}
    //       </span>
    //     );
    //   },
    // },

    {
      accessorKey: "actions",
      header: "Action",
      cell: ({ row }) => {
        const handleEditTrip = (e) => {
          e.stopPropagation();
          const vehicleId = row.original.id;
          router.push(
            `/admin/fleet/manage-vehicle/edit-vehicle?id=${vehicleId}`
          );
        };

        const handleDelete = async (e) => {
          e.stopPropagation();
          const confirmed = window.confirm("Do you want to delete this truck?");
          if (!confirmed) return;
          const truckId = row.original.id;
          console.log("Deleting truck ID:", truckId);
          try {
            await deleteTruckById(truckId);
            toast.success("truck deleted successfully");
            fetchTruckData();
          } catch (error) {
            console.error("Failed to delete truck:", error);
            toast.error("Failed to delete truck");
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
                    className="w-full flex justify-start px-4 py-2 hover:bg-gray-100"
                    onClick={handleEditTrip}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="18px"
                      viewBox="0 -960 960 960"
                      width="18px"
                      fill="#000"
                    >
                      <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                    </svg>
                    <p className="text-black text-left font-normal text-sm">
                      Edit details
                    </p>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full flex justify-start px-4 py-2 text-black hover:bg-gray-100"
                    data={row.original}
                    onClick={handleDelete}
                    onUpdate={refreshTruckData}
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

  const FormSchema = z.object({
    dob: z.date(),
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: { dob: null },
  });

  const handleCancel = () => {
    reset();
    onCancel?.();
  };

  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 9 });

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  function onSubmit(data) {
    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // })
  }

  const fetchTruckData = async () => {
    setLoading(true);
    try {
      const response = await fetchTruck();
      console.log("Table truck data:", response);

      const processedData = response.map((truck) => {
        return {
          id: truck.id,
          ContactNumber: truck.phone_number || "",
          name: truck.name || "",
          registrationNumber: truck.register_number || "N/A",
          vehicleModel: truck.vehicle_name || "N/A",
          availability: truck.availability,
        };
      });

      setData(processedData);
      setFilteredData(processedData);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch trucks:", error);
      setError("Failed to load truck data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTruckData();
  }, []);

  const handleTruckSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      fetchTruckData();
      return;
    }

    try {
      setLoading(true);
      const response = await fetchDetailsByTruckSearch({
        value,
        field: searchField,
      });

      if (!response || response.length === 0) {
        setData([]);
        setFilteredData([]);
        setError("No matching trucks found.");
        return;
      }

      const processedData = response.map((truck) => ({
        id: truck.id,
        ContactNumber: truck.phone_number || "",
        name: truck.name || "",
        registrationNumber: truck.register_number || "N/A",
        vehicleModel: truck.vehicle_name || "N/A",
        availability: truck.availability || "created",
      }));

      setData(processedData);
      // Apply filter to search results
      setFilteredData(
        availabilityFilter === null
          ? processedData
          : processedData.filter(
              (truck) => truck.availability === (availabilityFilter === "true")
            )
      );
      setError(null);
    } catch (err) {
      console.error("Truck search error:", err);
      setError("Failed to search trucks.");
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (availabilityFilter === null) {
      setFilteredData(data);
    } else {
      const filterValue = availabilityFilter === "true";
      setFilteredData(
        data.filter((truck) => truck.availability === filterValue)
      );
    }
  }, [availabilityFilter, data]);

  return (
    <div className="mt-6 ps-2">
      <div className="w-full flex justify-between">
        <div className="flex items-center gap-x-5">
          <p className="text-black font-medium text-lg">Manage Vehicles</p>

          <div className="hidden">
            <Select
              onValueChange={(value) => setAvailabilityFilter(value)} // Update filter state
              value={availabilityFilter || ""} // Ensure controlled value, fallback to empty string
              className="border-neutral-400 bg-white text-neutral-600 rounded-lg text-xs mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <SelectTrigger className="text-neutral-600 bg-white">
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent className="text-black bg-white">
                <SelectItem value="true">Available</SelectItem>
                <SelectItem value="false">In trip</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-x-5">
          <DownloadExcelButton />
          <Link
            href="/admin/fleet/manage-vehicle/add-vehicle"
            className="bg-black flex py-2 px-3 gap-x-1 items-center rounded-lg cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="18px"
              viewBox="0 -960 960 960"
              width="18px"
              fill="#FFFFFF"
            >
              <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
            </svg>
            <p className="text-white text-[13px]">Add vehicle</p>
          </Link>
          <div>  
            <Select
              onValueChange={(value) => setSearchField(value)}
              required
              className="border bg-white text-neutral-600 rounded-lg text-xs mt-1"
            >
              <SelectTrigger className="text-neutral-600 bg-white">
                <SelectValue placeholder="Search by" />
              </SelectTrigger>
              <SelectContent className="text-black bg-white">
                <SelectItem value="owner_name">Owner Name</SelectItem>
                <SelectItem value="register_number">
                  Registration number
                </SelectItem>
                <SelectItem value="vehicle_name">Vehicle Name</SelectItem>
                <SelectItem value="owner_phonenumber">Phone Number</SelectItem>
                <SelectItem value="chassis_number">Chassis Number</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-52 justify-between rounded-lg">
            <div className="flex items-center">
              <Input
                type="text"
                placeholder="Search trucks..."
                value={searchTerm}
                onChange={handleTruckSearch}
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
      </div>
      <div className="">
        <Table className="p-5 text-neutral-600 bg-white mt-3 rounded-lg w-[90vw]">
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
                  className="text-left h-12 cursor-pointer
                hover:bg-gray-100"
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
                      `/admin/fleet/manage-vehicle/details?id=${row.original.id}`
                    );
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-left">
                      {cell.column.id === "Status" ? (
                        <span
                          className={`ps-1 py-1 pe-3 inline-block w-max flex items-center rounded-md text-xs font-medium ${
                            statusColors[cell.getValue()] ||
                            "bg-green-100 text-black"
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
                            className="lucide lucide-dot"
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

        {/* Pagination */}
        <div className="w-full flex justify-end gap-x-8 items-center text-xs border-t py-3 px-5 text-black bg-white">
          <p>Rows per page 9</p>
          <span>
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <div
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
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
  );
}

export default ManageVehicle;
