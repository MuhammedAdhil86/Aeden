"use client";

import Header from "@/components/Header";
import React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  deleteDriverById,
  fetchAllDriver,
  fetchDetailsByDriverSearch,
  fetchDriverById,
  filterDriver,
} from "@/service/fleet";
import { format, parse } from "date-fns";
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
import Link from "next/link";
import { Input } from "@/components/ui/input";
import DriverDetailsDialog from "./DriverDetailsDialog";
import TripExpense from "../manage-trip/TripExpense";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FormSchema = z.object({
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
});

const statusColors = {
  "Not available": "bg-red-500 text-white",
  Reached: "bg-green-500 text-white",
  "On trip": "bg-blue-500 text-white",
};

function ManageDrivers() {
  const { register, handleSubmit, reset, control, watch, setValue } = useForm();
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [loadingDriver, setLoadingDriver] = useState(false);
  const [searchField, setSearchField] = useState("name");
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  const selectedStatus = watch("status");

  const refreshDriverData = () => {
    setTriggerRefresh((prev) => !prev);
  };

  const columns = [
    {
      accessorKey: "startingDate",
      header: "Date",
      cell: ({ getValue }) => getValue(),
    },
    {
      accessorKey: "party_name",
      header: "Driver Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <img
            src={row.original.avatar}
            alt={row.original.party_name}
            className="w-6 h-6 rounded-full"
          />
          <span>{row.original.driver_name}</span>
        </div>
      ),
    },
    {
      accessorKey: "ContactNumber",
      header: "Contact number",
      cell: ({ getValue }) => getValue(),
    },
    {
      accessorKey: "registrationNumber",
      header: "License number",
      cell: ({ getValue }) => getValue(),
    },

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue();
        const statusMap = {
          Created: {
            label: "Created",
            className: "bg-violet-100 text-violet-700",
          },
          created: {
            label: "Created",
            className: "bg-violet-100 text-violet-700",
          },
          "Not-Accepted": {
            label: "Not Accepted",
            className: "bg-gray-100 text-gray-700",
          },
          accepted: {
            label: "Accepted",
            className: "bg-blue-100 text-blue-700",
          },
          "In-Transit": {
            label: "In Transit",
            className: "bg-yellow-100 text-yellow-700",
          },
          Completed: {
            label: "Reached",
            className: "bg-green-100 text-green-700",
          },
          reached: {
            label: "Reached",
            className: "bg-green-100 text-green-700",
          },
          "License Expired": {
            label: "License Expired",
            className: "bg-red-100 text-red-700",
          },
          "License Expired, Fitness Expired, Eyetest Expired": {
            label: "All Expired", // Shortened label
            className: "bg-red-100 text-red-700",
          },
        };
        const statusInfo = statusMap[status] || {
          label: "Unknown",
          className: "bg-neutral-200 text-neutral-800",
        };
        return (
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.className}`}
          >
            {statusInfo.label}
          </span>
        );
      },
    },

    {
      accessorKey: "location",
      header: "Location",
      cell: ({ getValue }) => (
        <div className="line-clamp-2 overflow-hidden text-ellipsis break-words max-w-xs">
          {getValue()}
        </div>
      ),
    },

    {
      accessorKey: "dob",
      header: "dob",
      cell: ({ getValue }) => getValue(),
    },
    {
      accessorKey: "email",
      header: "email",
      cell: ({ getValue }) => getValue(),
    },
    {
      accessorKey: "aadhar",
      header: "aadhar",
      cell: ({ getValue }) => getValue(),
    },

    {
      accessorKey: "actions",
      header: "Action",
      cell: ({ row }) => {
        const handleEditTrip = (e) => {
          e.stopPropagation();
          const driverId = row.original.id;
          router.push(`/admin/fleet/manage-drivers/edit-driver?id=${driverId}`);
        };

        const handleDelete = async (e) => {
          e.stopPropagation();
          const confirmed = window.confirm(
            "Do you want to delete this driver?"
          );
          if (!confirmed) return;
          const driverId = row.original.id;
          console.log("Deleting driver ID:", driverId);
          try {
            await deleteDriverById(driverId);
            toast.success("driver deleted successfully");
            fetchDriverData();
          } catch (error) {
            console.error("Failed to delete driver:", error);
            toast.error("Failed to delete driver");
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
                    onUpdate={refreshDriverData}
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
    data,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    console.log("Selected Status:", selectedStatus);
    if (selectedStatus) {
      fetchDriverData(selectedStatus);
    } else {
      fetchDriverData();
    }
  }, [selectedStatus]);

  const fetchDriverData = async (status) => {
    setLoading(true);
    try {
      console.log("Fetching data with status:", status);
      const response = status
        ? await filterDriver(status)
        : await fetchAllDriver();
      console.log("Table driver data:", response);

      const processedData = response
        ? response.map((driver) => ({
            id: driver.id,
            startingDate: format(new Date(), "MMM dd, yyyy"),
            driver_name: driver.full_name || "",
            ContactNumber: driver.contact_number || "",
            registrationNumber: driver.license_number || "N/A",
            location: driver.address || "N/A",
            status: driver.status,
            //avatar: driver.image_url?.file_path || "/default-avatar.png",
            avatar: driver.image_url || "/default-avatar.png",

            dob: driver.date_of_birth
              ? format(new Date(driver.date_of_birth), "MMM dd, yyyy")
              : "N/A",
            email: driver.email,
            aadhar: driver.aadhaar_number,
          }))
        : [];

      setData(processedData);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch drivers:", error);
      setError("Failed to load driver data. Please try again later.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      fetchDriverData();
      return;
    }

    try {
      setLoading(true);
      const response = await fetchDetailsByDriverSearch({
        value,
        field: searchField,
      });

      if (!response || response.length === 0) {
        setData([]);
        setError("No matching drivers found.");
        return;
      }

      const processedData = response.map((driver) => ({
        startingDate: format(new Date(), "MMM dd, yyyy"),
        driver_name: driver.full_name || "",
        ContactNumber: driver.contact_number || "",
        registrationNumber: driver.license_number || "N/A",
        location: driver.address || "N/A",
        status: driver.status,
        //avatar: driver.image_url?.file_path || "/default-avatar.png",
        avatar: driver.image_url || "/default-avatar.png",

        dob: driver.date_of_birth
          ? format(new Date(driver.date_of_birth), "MMM dd, yyyy")
          : "N/A",
        email: driver.email,
        aadhar: driver.aadhaar_number,
      }));

      setData(processedData);
      setError(null);
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to search drivers.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = async (driverId) => {
    setLoadingDriver(true);
    setIsDialogOpen(true);
    console.log("Row clicked, driverId:", driverId);
    try {
      const driver = await fetchDriverById(driverId);
      setSelectedDriver(driver);
    } catch (error) {
      console.error("Failed to fetch driver details:", error);
      setSelectedDriver(null);
    } finally {
      setLoadingDriver(false);
    }
  };

  return (
    <div className="mt-6 px-2">
      <div className="w-full flex justify-between">
        <div className="flex items-center gap-x-5">
          <p className="text-black font-medium text-lg">Manage Drivers</p>
          <div>
            <Select
              onValueChange={(value) => {
                console.log("Select changed to:", value);
                setValue("status", value);
              }}
              value={selectedStatus}
              required
              className="border-neutral-400 bg-white text-neutral-600 rounded-lg text-xs mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <SelectTrigger className="text-neutral-600 bg-white ">
                <SelectValue placeholder="status" />
              </SelectTrigger>
              <SelectContent className="text-black  bg-white">
                <SelectItem value="Created">Created</SelectItem>
                <SelectItem value="Not-Accepted">Not Accepted</SelectItem>
                <SelectItem value="onTrip">On trip</SelectItem>
                <SelectItem value="notAvailable">Not available</SelectItem>
                <SelectItem value="License Expired">
                  Expired - License
                </SelectItem>
                <SelectItem value="In-Transit">In-Transit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-x-5">
          <Link
            href="/admin/fleet/manage-drivers/add-driver"
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
            <p className="text-white text-[13px]">Add driver</p>
          </Link>
          <div>
            <Select
              onValueChange={(value) => setSearchField(value)}
              required
              className="border-neutral-400 bg-white text-neutral-600 rounded-lg text-xs mt-1"
            >
              <SelectTrigger className="text-neutral-600 bg-white">
                <SelectValue placeholder="Search by" />
              </SelectTrigger>
              <SelectContent className="text-black bg-white">
                <SelectItem value="name">Driver Name</SelectItem>
                <SelectItem value="contact_number">Contact number</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-52 justify-between rounded-lg">
            <div className="flex items-center">
              <Input
                type="text"
                placeholder="Search driver"
                className="px-3 py-2 bg-white text-black rounded-md text-sm focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                value={searchTerm}
                onChange={handleSearch}
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
        <Table className="p-5 text-neutral-600 bg-white mt-3 rounded-lg w-[2000px]">
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
                    console.log("Navigating to driver ID:", row.original.id);
                    const isActionClick = e.target.closest(
                      ".action-button, .popover-content"
                    );
                    if (isActionClick) return;
                    if (!row.original.id) {
                      console.error("Missing id in row data:", row.original);
                      return;
                    }
                    router.push(
                      `/admin/fleet/manage-drivers/details?id=${row.original.id}`
                    );
                  }}
                  //onClick={() => handleRowClick(row.original.id)} // Moved onClick here
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-left">
                      {cell.column.id === "avatar" ? (
                        <img
                          src={cell.getValue()}
                          alt="Avatar"
                          className="w-8 h-8 rounded-full"
                        />
                      ) : cell.column.id === "Status" ? (
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

      <DriverDetailsDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        driver={selectedDriver}
        loading={loadingDriver}
      />
    </div>
  );
}

export default ManageDrivers;

// const documents = [
//   {
//     name: "Insurance_2025.pdf",
//     url: "https://yourdomain.com/uploads/Insurance_2025.pdf",
//     uploadedAt: "22 March 2021",
//   },
//   {
//     name: "License_tony.pdf",
//     url: "https://yourdomain.com/uploads/License_tony.pdf",
//     uploadedAt: "05 April 2022",
//   },
//   {
//     name: "Eye_test_C.pdf",
//     url: "https://yourdomain.com/uploads/Eye_test_C.pdf",
//     uploadedAt: "10 January 2023",
//   },
//   {
//     name: "Fitness_C.pdf",
//     url: "https://yourdomain.com/uploads/Fitness_C.pdf",
//     uploadedAt: "01 February 2024",
//   },
// ];

// <div className="bg-white mt-10 p-4 w-full">
// <div className="border-b flex gap-x-5 pb-3">
//   <img src="" />
//   <p className="text-black font-semibold">Tony mathew</p>
//   <div className="bg-green-500 rounded-md flex w-24 items-center">
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       stroke-width="2"
//       stroke-linecap="round"
//       stroke-linejoin="round"
//       class="lucide lucide-dot-icon lucide-dot"
//     >
//       <circle cx="12.1" cy="12.1" r="1" />
//     </svg>
//     <p className="text-white text-[13px] ">Available</p>
//   </div>
// </div>
// <div className="border-b grid grid-cols-3 gap-y-5 py-5">
//   <div>
//     <p className="text-neutral-600 text-xs">Gender</p>
//     <p className="text-black font-medium text-sm pt-1">Male</p>
//   </div>
//   <div>
//     <p className="text-neutral-600 text-xs">Date of Birth</p>
//     <p className="text-black font-medium text-sm pt-1">Male</p>
//   </div>
//   <div>
//     <p className="text-neutral-600 text-xs">Contact Number</p>
//     <p className="text-black font-medium text-sm pt-1">Male</p>
//   </div>
//   <div>
//     <p className="text-neutral-600 text-xs">Email </p>
//     <p className="text-black font-medium text-sm pt-1">Male</p>
//   </div>
//   <div>
//     <p className="text-neutral-600 text-xs">Aadhar Number</p>
//     <p className="text-black font-medium text-sm pt-1">Male</p>
//   </div>
//   <div>
//     <p className="text-neutral-600 text-xs">Address</p>
//     <p className="text-black font-medium text-sm pt-1">Male</p>
//   </div>
//   <div>
//     <p className="text-neutral-600 text-xs">License Number</p>
//     <p className="text-black font-medium text-sm pt-1">Male</p>
//   </div>
//   <div>
//     <p className="text-neutral-600 text-xs">License Expiry</p>
//     <p className="text-black font-medium text-sm pt-1">Male</p>
//   </div>
//   <div>
//     <p className="text-neutral-600 text-xs">
//       Fitness Certificate Expiry
//     </p>
//     <p className="text-black font-medium text-sm pt-1">Male</p>
//   </div>
//   <div>
//     <p className="text-neutral-600 text-xs">Aadhar Expiry</p>
//     <p className="text-black font-medium text-sm pt-1">Male</p>
//   </div>
//   <div>
//     <p className="text-neutral-600 text-xs">
//       Eye Test Certificate Expiry
//     </p>
//     <p className="text-black font-medium text-sm pt-1">Male</p>
//   </div>
//   <div>
//     <p className="text-neutral-600 text-xs">
//       Fitness Certificate Expiry
//     </p>
//     <p className="text-black font-medium text-sm pt-1">Male</p>
//   </div>
// </div>
// <div className="pt-5">
//   <p className="text-sm text-black font-semibold">Documents</p>
//   <div className="w-full flex flex-col gap-y-3 pt-5">
//     {documents.map((doc, index) => (
//       <div
//         key={index}
//         className="border rounded-md p-3 flex justify-between items-center"
//       >
//         <div className="flex gap-x-3">
//           <div className="bg-black w-12 h-12 flex justify-center items-center rounded-md">
//             <p className="text-white text-sm">PDF</p>
//           </div>
//           <div className="flex flex-col justify-center">
//             <p className="text-black text-sm font-medium">{doc.name}</p>
//             <p className="text-xs text-neutral-400">
//               Uploaded {doc.uploadedAt}
//             </p>
//           </div>
//         </div>
//         <div
//           className="flex items-center gap-x-2 cursor-pointer"
//           onClick={() => window.open(doc.url, "_blank")}
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             height="16px"
//             viewBox="0 -960 960 960"
//             width="16px"
//             fill="#000"
//           >
//             <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
//           </svg>
//           <p className="text-black text-sm">View document</p>
//         </div>
//       </div>
//     ))}
//   </div>
// </div>
// </div>
