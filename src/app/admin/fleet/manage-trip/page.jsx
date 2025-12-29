"use client";

import Header from "@/components/Header";
import React from "react";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  deleteTripById,
  fetchTrip,
  fetchTripDdetailsByDateRange,
  fetchTripDetailsByDate,
  fetchTripDetailsByDateRange,
  fetchTripSearch,
} from "@/service/fleet";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
import UpdateDialog from "./UpdateDialog";
import DownloadPDFButton from "./download/DownloadPDFButton";
import DownloadXLButton from "./download/DownloadXLButton";
import { Input } from "@/components/ui/input";
import StartTrip from "./StartTrip";
import TripExpense from "./TripExpense";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EndTrip from "./EndTrip";
import TripScoreDialog from "./TripScoreDialog";
const FormSchema = z.object({
  dateRange: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .optional(),
});




const statusColors = {
  Created: "bg-blue-100 text-blue-700",
  "In-Transit": "bg-yellow-100 text-yellow-700",
  Reached: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

function ManageTrip() {
  const { register, handleSubmit, reset, control, watch } = useForm();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tripSearchTerm, setTripSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();
  const [searchField, setSearchField] = useState("drivers_name");
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const selectedStatus = watch("filterByStatus");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateRange, setSelectedDateRange] = useState({
    from: undefined,
    to: undefined,
  });

  const refreshTripData = () => {
    setTriggerRefresh((prev) => !prev);
  };
  const columns = [
    {
      accessorKey: "fromTo",
      header: "From - To",
      cell: ({ getValue }) => getValue(),
    },
    {
      accessorKey: "driver_name",
      header: "Driver Name",
      cell: ({ getValue }) => getValue(),
    },
    {
      accessorKey: "registrationNumber",
      header: "Reg. No",
      cell: ({ getValue }) => getValue(),
    },
    {
      accessorKey: "vehicleModel",
      header: "Vehicle",
      cell: ({ getValue }) => getValue(),
    },
    {
      accessorKey: "startingDate",
      header: "Starting Date",
      cell: ({ getValue }) => getValue(),
    },
    {
      accessorKey: "in_transit",
      header: "In Transit",
      cell: ({ getValue }) => {
        const stops = getValue();

        if (!Array.isArray(stops) || stops.length === 0) return "-";
        if (stops.length === 1) return stops[0];

        const lastStop = stops[stops.length - 1];
        const otherStops = stops.slice(0, -1);
        const countBeforeLast = stops.length - 1;

        return (
          <div className="relative group text-black inline-flex items-center ">
            <span>{lastStop}</span>{" "}
            <span className="text-blue-600 cursor-pointer ml-1 font-medium hover:text-blue-800 transition-colors">
              +{countBeforeLast}
            </span>
            <div className="absolute drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] left-9 ml-14 mb-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 bg-gray-900 text-white text-5px  px-2 py-0 rounded-sm shadow-2xl shadow-black pointer-events-none ">
              <div className="absolute  top-full left-4 -translate-x-1/2 border-transparent border-t-gray-900" />
              {otherStops.map((stop, index) => (
                <div key={index} className="">
                  {stop}
                </div>
              ))}
            </div>
          </div>
        );
      },
    },

    {
      accessorKey: "actions",
      header: "Action",
      cell: ({ row }) => {
        const [openDialog, setOpenDialog] = useState(false);
        const [tripopenDialog, setTripOpenDialog] = useState(false);
        const [scorecardopenDialog, setScorecardOpenDialog] = useState(false);

        const [endTripopenDialog, setEndTripOpenDialog] = useState(false);

        const [tripexpenseopenDialog, setTripExpenseOpenDialog] =
          useState(false);

        const handleUpdateAmount = (e) => {
          e.stopPropagation();
          setOpenDialog(true);
        };

        const handleStartTrip = (e) => {
          e.stopPropagation();
          setTripOpenDialog(true);
        };

        const handleEndTrip = (e) => {
          e.stopPropagation();
          setEndTripOpenDialog(true);
        };

        const handleTripExpense = (e) => {
          e.stopPropagation();
          setTripExpenseOpenDialog(true);
        };

        const handleScorecardExpense = (e) => {
          e.stopPropagation();
          setScorecardOpenDialog(true);
        };

        const handleEditTrip = (e) => {
          e.stopPropagation();
          const tripId = row.original.id;
          router.push(`/admin/fleet/manage-trip/edit-trip?id=${tripId}`);
        };

        const handleDelete = async (e) => {
          e.stopPropagation();
          const confirmed = window.confirm("Do you want to delete this trip?");
          if (!confirmed) return;
          const tripId = row.original.id;
          console.log("Deleting trip ID:", tripId);
          try {
            await deleteTripById(tripId);
            toast.success("Trip deleted successfully");
            fetchTripData();
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
                    className="w-full flex justify-start px-4 py-2 hover:bg-gray-100"
                    onClick={handleUpdateAmount}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="18px"
                      viewBox="0 -960 960 960"
                      width="18px"
                      fill="#000"
                    >
                      <path d="M880-720v480q0 33-23.5 56.5T800-160H160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720Zm-720 80h640v-80H160v80Zm0 160v240h640v-240H160Zm0 240v-480 480Z" />
                    </svg>
                    <p className="text-black text-left font-normal text-sm">
                      Update Amount
                    </p>
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full flex justify-start px-4 py-2 hover:bg-gray-100"
                    onClick={handleStartTrip}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="18px"
                      viewBox="0 -960 960 960"
                      width="18px"
                      fill="#000"
                    >
                      <path d="m600-120-240-84-186 72q-20 8-37-4.5T120-170v-560q0-13 7.5-23t20.5-15l212-72 240 84 186-72q20-8 37 4.5t17 33.5v560q0 13-7.5 23T812-192l-212 72Zm-40-98v-468l-160-56v468l160 56Zm80 0 120-40v-474l-120 46v468Zm-440-10 120-46v-468l-120 40v474Zm440-458v468-468Zm-320-56v468-468Z" />
                    </svg>
                    <p className="text-black text-left font-normal text-sm">
                      Start trip
                    </p>
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full flex justify-start px-4 py-2 hover:bg-gray-100"
                    onClick={handleEndTrip}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="18px"
                      viewBox="0 -960 960 960"
                      width="18px"
                      fill="#000"
                    >
                      <path d="m600-120-240-84-186 72q-20 8-37-4.5T120-170v-560q0-13 7.5-23t20.5-15l212-72 240 84 186-72q20-8 37 4.5t17 33.5v560q0 13-7.5 23T812-192l-212 72Zm-40-98v-468l-160-56v468l160 56Zm80 0 120-40v-474l-120 46v468Zm-440-10 120-46v-468l-120 40v474Zm440-458v468-468Zm-320-56v468-468Z" />
                    </svg>
                    <p className="text-black text-left font-normal text-sm">
                      End trip
                    </p>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full flex justify-start px-4 py-2 hover:bg-gray-100"
                    onClick={handleTripExpense}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="18px"
                      viewBox="0 -960 960 960"
                      width="18px"
                      fill="#000"
                    >
                      <path d="M120-80v-800l60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60v800l-60-60-60 60-60-60-60 60-60-60-60 60-60-60-60 60-60-60-60 60-60-60-60 60Zm120-200h480v-80H240v80Zm0-160h480v-80H240v80Zm0-160h480v-80H240v80Zm-40 404h560v-568H200v568Zm0-568v568-568Z" />
                    </svg>
                    <p className="text-black text-left font-normal text-sm">
                      Trip expense
                    </p>
                  </Button>
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

                  <Button
                    variant="ghost"
                    className="w-full flex justify-start px-4 py-2 hover:bg-gray-100"
                    onClick={handleScorecardExpense}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="18px"
                      viewBox="0 -960 960 960"
                      width="18px"
                      fill="#000"
                    >
                      <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h168q13-36 43.5-58t68.5-22q38 0 68.5 22t43.5 58h168q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm80-80h280v-80H280v80Zm0-160h400v-80H280v80Zm0-160h400v-80H280v80Zm200-190q13 0 21.5-8.5T510-820q0-13-8.5-21.5T480-850q-13 0-21.5 8.5T450-820q0 13 8.5 21.5T480-790ZM200-200v-560 560Z" />
                    </svg>
                    <p className="text-black text-left font-normal text-sm">
                      Add Scorecard
                    </p>
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Update dialog */}
            <UpdateDialog
              open={openDialog}
              onClose={() => setOpenDialog(false)}
              data={row.original}
              onUpdate={refreshTripData}
            />
            <TripExpense
              open={tripexpenseopenDialog}
              onClose={() => setTripExpenseOpenDialog(false)}
              data={row.original}
              onUpdate={refreshTripData}
            />

            <EndTrip
              open={endTripopenDialog}
              onClose={() => setEndTripOpenDialog(false)}
              data={row.original}
              onUpdate={refreshTripData}
            />

            <StartTrip
              open={tripopenDialog}
              onClose={() => setTripOpenDialog(false)}
              data={row.original}
              onUpdate={refreshTripData}
            />

            <TripScoreDialog
              open={scorecardopenDialog}
              onClose={() => setScorecardOpenDialog(false)}
              data={row.original}
            />
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
    defaultValues: {
      dateRange: {
        from: undefined,
        to: undefined,
      },
    },
  });

  const handleCancel = () => {
    reset();
    onCancel?.();
  };

  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 9 });

  const filteredData = statusFilter
    ? data.filter(
        (item) => item.status.toLowerCase() === statusFilter.toLowerCase()
      )
    : data;

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

  const formatDate = (isoDateString) => {
    if (!isoDateString || isoDateString.startsWith("0001")) return "-";
    const date = new Date(isoDateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    fetchTripData();
  }, [])

  const fetchTripData = async () => {
  setLoading(true);
  try {
    const response = await fetchTrip();
    console.log("Table TRIP data:", response);

    if (!response || response.length === 0) {
      setData([]);
      setError("No trip data available.");
      return;
    }

    const processedData = response.map((trip) => {
      return {
        id: trip.id,
        fromTo: trip.trip_title || "",
        driver_name: trip.driverid?.full_name || "No Driver",
        registrationNumber: trip.truckid?.register_number || "N/A",
        vehicleModel: trip.truckid?.model || "N/A",
        startingDate: formatDate(trip.start_time),
        in_transit: trip.in_transit || [],
        Status: trip.status,
        advance_received: trip.advance_received,
        balance_payable: trip.balance_payable,
        truckid: trip.truckid?.id,
        driverid: trip.driverid?.id,
        status: trip.status,
        tripType: trip.trip_type,
        self_type: trip.self_type,
      };
    });

    setData(processedData);
    setError(null);
  } catch (error) {
    console.error("Failed to fetch trips:", error);
    setError("Failed to load trip data. Please try again later.");
    setData([]);
  } finally {
    setLoading(false);
  }
};

  const handleTripSearch = async (e) => {
    const value = e?.target?.value || "";
    setTripSearchTerm(value);

    if (value.trim() === "") {
      fetchTripData();
      return;
    }

    try {
      setLoading(true);
      const response = await fetchTripSearch({
        value,
        field: searchField,
        ...(selectedDate && { date: format(selectedDate, "yyyy-MM-dd") }),
      });

      if (!response || response.length === 0) {
        setData([]);
        setError("No matching trips found.");
        return;
      }

      const processedData = response.map((trip) => ({
        id: trip.id,
        fromTo: trip.trip_title || "",
        driver_name: trip.driverid?.full_name || "No Driver",
        registrationNumber: trip.truckid?.register_number || "N/A",
        vehicleModel: trip.truckid?.vehicle_name || "N/A",
        startingDate: formatDate(trip.start_time),
        in_transit: trip.in_transit || [],
        Status: trip.trip_status || "created",
        truckid: trip.truckid.id,
        driverid: trip.driverid.id,
        advance_received: trip.advance_received,
        status: trip.status,
        tripType: trip.trip_type,
        self_type: trip.self_type,
      }));

      setData(processedData);
      setError(null);
    } catch (err) {
      console.error("Trip Search Error:", err);
      setError("Failed to search trips.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

const handleDateRangeChange = (range) => {
  console.log("Date range selected:", range);
  setSelectedDateRange(range);
  setLoading(true);

  if (range?.from) {
    // Fetch all trips and filter client-side
    fetchTrip()
      .then((response) => {
        console.log("All trips fetched successfully:", response);
        
        if (!response || response.length === 0) {
          setData([]);
          setError("No trips found.");
          setLoading(false);
          return;
        }

        // Filter trips client-side based on date range
        const filteredTrips = response.filter((trip) => {
          try {
            if (!trip.start_time || trip.start_time.startsWith("0001")) {
              return false;
            }
            
            const tripDate = new Date(trip.start_time);
            const startDate = new Date(range.from);
            startDate.setHours(0, 0, 0, 0); // Start of day
            
            let endDate;
            if (range.to) {
              endDate = new Date(range.to);
              endDate.setHours(23, 59, 59, 999); // End of day
            } else {
              endDate = new Date(); // Today
              endDate.setHours(23, 59, 59, 999); // End of today
            }

            // Check if trip date is within range
            return tripDate >= startDate && tripDate <= endDate;
          } catch (error) {
            console.error("Error filtering trip:", trip.id, error);
            return false;
          }
        });

        console.log(`Filtered ${filteredTrips.length} trips from ${response.length} total`);

        if (filteredTrips.length === 0) {
          setData([]);
          setError("No trips found for the selected date range.");
          setLoading(false);
          return;
        }

        // Process the filtered data
        const processedData = filteredTrips.map((trip) => ({
          id: trip.id,
          fromTo: trip.trip_title || "",
          driver_name: trip.driverid?.full_name || "No Driver",
          registrationNumber: trip.truckid?.register_number || "N/A",
          vehicleModel: trip.truckid?.model || "N/A",
          startingDate: formatDate(trip.start_time),
          in_transit: trip.in_transit || [],
          Status: trip.status || "created",
          advance_received: trip.advance_received,
          balance_payable: trip.balance_payable,
          truckid: trip.truckid?.id,
          driverid: trip.driverid?.id,
          status: trip.status,
          tripType: trip.trip_type,
          self_type: trip.self_type,
        }));

        setData(processedData);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching trips:", err);
        setError("Failed to load trip data. Please try again.");
        setData([]);
      })
      .finally(() => {
        setLoading(false);
      });
  } else {
    // If no date range selected, fetch all trips
    fetchTripData();
  }
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

  useEffect(() => {
    fetchTripData();
  }, [triggerRefresh]);

  useEffect(() => {
    setStatusFilter(selectedStatus || "");
  }, [selectedStatus]);

  useEffect(() => {
    fetchTripData();
  }, []);

  const clearFilters = () => {
    setSelectedDateRange({ from: undefined, to: undefined });
    setTripSearchTerm("");
    form.reset({
      dateRange: {
        from: undefined,
        to: undefined,
      },
    });
    fetchTripData();
  };

  return (
    <div className="mt-6 px-2">
      <div className="w-full flex justify-between">
        <div className="flex items-center gap-x-5">
          <p className="text-black font-medium text-lg">Manage Trip</p>
          <div className="">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="dateRange"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left text-[13px] font-normal bg-white text-neutral-600",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value?.from ? (
                                field.value.to ? (
                                  <>
                                    {format(field.value.from, "LLL dd, y")} -{" "}
                                    {format(field.value.to, "LLL dd, y")}
                                  </>
                                ) : (
                                  format(field.value.from, "LLL dd, y")
                                )
                              ) : (
                                <div className="w-full flex items-center justify-between">
                                  <span className="text-neutral-600 text-[13px]">
                                    Filter by date
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
                            mode="range"
                            className="bg-white text-neutral-600"
                            selected={field.value}
                            onSelect={(range) => {
                              field.onChange(range);
                              handleDateRangeChange(range);
                            }}
                            initialFocus
                            classNames={{
                              daySelected: "bg-black text-white",
                              day_range_start:
                                "bg-black text-white rounded-l-md",
                              day_range_end: "bg-black text-white rounded-r-md",
                              day_range_middle: "bg-gray-200 text-black",
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
          <Button
            variant="outline"
            onClick={clearFilters}
            className="text-xs text-black"
          >
            Clear Filters
          </Button>
          <div className="">
            <Select
              {...register("filterByStatus")}
              onValueChange={(value) => setStatusFilter(value)}
              className="border bg-white text-neutral-600 rounded-lg text-xs mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <SelectTrigger className="text-neutral-600 bg-white ">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="text-black  bg-white">
                <SelectItem value="Created">Created</SelectItem>
                <SelectItem value="In-Transit">In Transit</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-x-5">
          <div className="relative inline-block text-left" ref={menuRef}>
            <div
              onClick={() => setOpen((prev) => !prev)}
              className="cursor-pointer text-xs px-4 py-2.5 font-medium bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Download
            </div>

            {open && (
              <div className="absolute mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1 flex flex-col">
                  {/* <DownloadPDFButton /> */}
                  <DownloadXLButton />
                </div>
              </div>
            )}
          </div>
          <Link
            href="/admin/fleet/manage-trip/create-trip"
            className="bg-black flex py-1 px-3 gap-x-1 items-center rounded-lg cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="14px"
              viewBox="0 -960 960 960"
              width="14px"
              fill="#FFFFFF"
            >
              <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
            </svg>
            <p className="text-white text-xs">Create trip</p>
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
                <SelectItem value="loading_point">From</SelectItem>
                <SelectItem value="unloading_point">To</SelectItem>
                <SelectItem value="drivers_name">Driver Name</SelectItem>
                <SelectItem value="register_number">
                  Registration number
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-52 justify-between rounded-lg">
            <div className="flex items-center">
              <Input
                type="text"
                placeholder="Search"
                onChange={handleTripSearch}
                value={tripSearchTerm}
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
        <Table className="p-5 text-neutral-600 bg-white mt-3 rounded-lg w-[100vw]">
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

export default ManageTrip;
