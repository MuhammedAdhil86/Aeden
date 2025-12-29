"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import DwnTruckTracking from "./DwnTruckTracking";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { fetchTruckTracking, searchTruckTracking } from "@/service/report";
import { cn } from "@/lib/utils";
const LOCATIONIQ_KEY = "pk.492eeab5615982c8b97ca80a3984555e";
const LOCATIONIQ_URL = "https://us1.locationiq.com/v1/reverse";

const columns = [
  {
    accessorKey: "regNo",
    header: "Reg No",
    cell: ({ getValue }) => getValue() || "N/A",
  },
  // {
  //   accessorKey: "vehicleName",
  //   header: "Vehicle Name",
  //   cell: ({ getValue }) => getValue() || "N/A",
  // },
  {
    accessorKey: "speed",
    header: "Speed Range",
    cell: ({ getValue }) => `${getValue()} km/hr`,
  },

  {
    accessorKey: "currentLocation",
    header: "Current Location",
    cell: ({ getValue }) => getValue() || "N/A",
  },
  {
    accessorKey: "ignition",
    header: "Ignition",
    cell: ({ getValue }) => (getValue() ? "ON" : "OFF"),
  },
  {
    accessorKey: "is_active",
    header: "Device",
    cell: ({ getValue }) => (getValue() ? "Active" : "Inactive"),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => getValue() || "N/A",
  },
];

const statusColors = {
  Moving: "text-green-500",
  Stopped: "text-red-500",
};

export default function page() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 9,
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Helper function to introduce a pause
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const getReadableLocation = async (lat, lng, retries = 3) => {
    if (!LOCATIONIQ_KEY) {
      console.error(
        "LocationIQ Key is missing. Set NEXT_PUBLIC_LOCATIONIQ_KEY in .env.local."
      );
      return `${lat}, ${lng} (Geocoding Key Missing)`;
    }

    const url = `${LOCATIONIQ_URL}?key=${LOCATIONIQ_KEY}&lat=${lat}&lon=${lng}&format=json`;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url);

        // Success: Handle successful response status (e.g., 200 OK)
        if (response.ok) {
          const data = await response.json();
          if (data.display_name) {
            return data.display_name;
          } else {
            console.warn(`LocationIQ: No address found on attempt ${attempt}.`);
            return `${lat}, ${lng}`;
          }
        }

        // Failure: Handle 429 (Too Many Requests)
        if (response.status === 429 && attempt < retries) {
          const retryDelayMs = 500; // Wait 500ms before retrying
          console.warn(
            `Attempt ${attempt} failed with 429. Retrying in ${retryDelayMs}ms...`
          );
          await delay(retryDelayMs);
          continue; // Move to the next loop iteration (retry attempt)
        }

        // Failure: Handle other API errors (e.g., 400, 401, 500)
        const errorData = await response.json();
        console.error(
          `Attempt ${attempt} failed with status ${response.status}: ${
            errorData.error || response.statusText
          }`
        );
        return `${lat}, ${lng} (API Error)`;
      } catch (error) {
        console.error(
          `Error during fetch on attempt ${attempt}:`,
          error.message
        );
        // If the failure is a network error (e.g., DNS error, no connection), don't retry immediately
        if (attempt === retries) {
          return `${lat}, ${lng} (Network Error)`;
        }
      }
    }

    // If the loop completes without success after max retries
    return `${lat}, ${lng} (Max Retries Reached)`;
  };

  // Ensure getReadableLocation is defined elsewhere (e.g., with LocationIQ and retry logic)
  const fetchDefaultData = async () => {
    try {
      const fullResponse = await fetchTruckTracking();

      // 🛑 CORRECTION 1: Access the nested 'data.list' property
      const truckList = fullResponse?.data?.list;

      const truckArray = truckList
        ? await Promise.all(
            truckList.map(async (item) => {
              // ✅ CORRECTION 2: Initialize currentLocation before the if block
              let currentLocation = "Location Not Available";

              // Check if coordinates exist and are valid before calling geocoding API
              if (item?.latitude && item?.longitude) {
                // ✅ CORRECTION 3: Use 'item.latitude' and 'item.longitude'
                currentLocation = await getReadableLocation(
                  item.latitude,
                  item.longitude
                );
              }

              return {
                id: item.vehicleNumber, // Assuming vehicleNumber is the unique ID
                regNo: item.vehicleNumber,
                vehicleName: item.venndorName, // Assuming you meant venndorName (vendorName)
                speed: item?.speed || 0,
                // Note: distance_traveled is not in your response, keep it as 0 unless you map it from elsewhere
                distanceTraveled: item.distance_traveled || 0,
                currentLocation,
                status: item?.speed !== 0 ? "Moving" : "Stopped", // Assuming speed 0 means stopped
                ignition: item?.ignition || false,
                is_active: item?.chargeOn || false,
              };
            })
          )
        : [];

      setData(truckArray);
    } catch (error) {
      console.error("Failed fetch:", error);
      setData([]);
    }
  };

  const fetchSearchData = async (term) => {
    try {
      const response = await searchTruckTracking(term);

      const searchArray = Array.isArray(response)
        ? await Promise.all(
            response.map(async (item) => {
              const latestLocation =
                item?.tracking_history?.length > 0
                  ? item.tracking_history[item.tracking_history.length - 1]
                  : null;

              const current = item?.current_location;
              const locationData =
                current?.latitude && current.latitude !== 0
                  ? current
                  : latestLocation;

              let currentLocation = "Location Not Available";

              if (locationData?.latitude && locationData?.longitude) {
                currentLocation = await getReadableLocation(
                  locationData.latitude,
                  locationData.longitude
                );
              }

              return {
                id: item.vehicle_id,
                regNo: item.vehicle_number,
                vehicleName: item.vehicle_name,
                speed: item?.current_speed || 0,
                distanceTraveled: item.distance_traveled || 0,
                currentLocation,
                status: item?.status || "N/A",
                ignition: item?.ignition || false,
                is_active: item?.is_active || false,
              };
            })
          )
        : [];

      setData(searchArray);
    } catch (error) {
      console.error("Failed search fetch:", error);
      setData([]);
    }
  };

  useEffect(() => {
    fetchDefaultData();
  }, []);

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
          <p className="text-black font-medium pt-1">Vehicle Tracking</p>
          <div className="flex-1 flex items-center"></div>
          <DwnTruckTracking data={data} />
          <div className="flex w-52 justify-between rounded-lg">
            <div className="flex items-center">
              <Input
                type="text"
                placeholder="Search by Reg no"
                onChange={handleSearchChange}
                value={searchTerm}
                className="px-3 py-2 bg-white text-black rounded-md text-sm focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>
        </div>
        <div className="rounded-md border overflow-x-auto">
          <Table className="p-5 text-neutral-600 bg-white mt-3 rounded-lg table-auto w-full">
            <TableHeader className="text-black text-left">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="text-left">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-left whitespace-nowrap"
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
                      // router.push(
                      //   `/admin/fleet/manage-trip/details?id=${row.original.id}`
                      // );
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="text-left align-middle"
                      >
                        {cell.column.id === "status" ? (
                          <div className="flex items-center">
                            <span
                              className={`ps-2 py-1 pe-3 inline-flex items-center gap-1.5 rounded-md text-xs font-medium ${
                                statusColors[cell.getValue()] ||
                                "bg-gray-100 text-black"
                              }`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="8"
                                height="8"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                stroke="none"
                              >
                                <circle cx="12" cy="12" r="12" />
                              </svg>
                              {cell.getValue()}
                            </span>
                          </div>
                        ) : cell.column.id === "currentLocation" ? (
                          <div className="max-w-xs truncate">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </div>
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
        </div>

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
            ◀
          </div>
          <div
            onClick={() => table.nextPage()}
            className={cn(
              "cursor-pointer",
              !table.getCanNextPage() && "opacity-50 cursor-not-allowed"
            )}
          >
            ▶
          </div>
        </div>
      </div>
    </div>
  );
}
