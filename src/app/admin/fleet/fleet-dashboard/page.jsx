"use client";

import react, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Header from "@/components/Header";
import Link from "next/link";
import TripBarChart from "../../dashboard/trip-bar-chart/page";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  fetchProfitByYear,
  totalCompletedTrip,
  totalDriver,
  totalOnGoingTrip,
  totalPendingTrip,
  totalTruck,
  tripcompletedTripPercentage,
  tripOnGoingPercentage,
  tripPendingPercentage,
} from "@/service/dashboard";
import TruckSlider from "./TruckSlider";
// import { TripBarChart } from "./TripBarChart/page";

const startYear = 2024;
const endYear = 2030;
const years = Array.from(
  { length: endYear - startYear + 1 },
  (_, i) => startYear + i
); // [2024, 2025, ..., 2030]
const currentYear = new Date().getFullYear();

function FleetDashboard() {
  const { register, watch, setValue } = useForm({
    defaultValues: {
      year: currentYear.toString(),
    },
  });
  const [trips, setTrips] = useState([]);
  const CompletedTrip = watch("CompletedTrip");
  const CompletedTriPercentage = watch("CompletedTriPercentage");
  const OnGoingTrip = watch("OnGoingTrip");
  const OnGoingTriPercentage = watch("OnGoingTriPercentage");
  const PendingTrip = watch("PendingTrip");
  const PendingTriPercentage = watch("PendingTriPercentage");

  const truckCount = watch("truckCount");
  const driverCount = watch("driverCount");
  const selectedYear = Number(watch("year"));

  useEffect(() => {
    const fetchCompletedTrip = async () => {
      try {
        const count = await totalCompletedTrip();
        setValue("CompletedTrip", count);
      } catch (error) {
        console.error("Failed to total completed count:", error);
      }
    };

    fetchCompletedTrip();
  }, [setValue]);

  useEffect(() => {
    const fetchCompletedTripPercentage = async () => {
      try {
        const count = await tripcompletedTripPercentage();
        setValue("CompletedTriPercentage", count);
      } catch (error) {
        console.error("Failed to fetch OnGoing Trip:", error);
      }
    };

    fetchCompletedTripPercentage();
  }, [setValue]);

  useEffect(() => {
    const fetchOngoingTrip = async () => {
      try {
        const count = await totalOnGoingTrip();
        setValue("OnGoingTrip", count);
      } catch (error) {
        console.error("Failed to fetch OnGoing Trip:", error);
      }
    };

    fetchOngoingTrip();
  }, [setValue]);

  useEffect(() => {
    const fetchOngoingPercentage = async () => {
      try {
        const count = await tripOnGoingPercentage();
        setValue("OnGoingTriPercentage", count);
      } catch (error) {
        console.error("Failed to fetch OnGoing Trip:", error);
      }
    };

    fetchOngoingPercentage();
  }, [setValue]);

  useEffect(() => {
    const fetchPendingTrip = async () => {
      try {
        const count = await totalPendingTrip();
        setValue("PendingTrip", count);
      } catch (error) {
        console.error("Failed to fetch Pending Trip:", error);
      }
    };

    fetchPendingTrip();
  }, [setValue]);

  useEffect(() => {
    const fetchPendingPercentage = async () => {
      try {
        const count = await tripPendingPercentage();
        setValue("PendingTriPercentage", count);
      } catch (error) {
        console.error("Failed to fetch OnGoing Trip:", error);
      }
    };

    fetchPendingPercentage();
  }, [setValue]);

  useEffect(() => {
    const fetchTruckData = async () => {
      try {
        const count = await totalTruck();
        setValue("truckCount", count);
      } catch (error) {
        console.error("Failed to fetch truck count:", error);
      }
    };

    fetchTruckData();
  }, [setValue]);

  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        const count = await totalDriver();
        setValue("driverCount", count);
      } catch (error) {
        console.error("Failed to fetch truck count:", error);
      }
    };

    fetchDriverData();
  }, [setValue]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProfitByYear(selectedYear);
        const tripsArray = Array.isArray(data) ? data : data?.data || [];
        setTrips(tripsArray);
      } catch (error) {
        console.error("Failed to fetch trips:", error);
        setTrips([]);
      }
    };
    fetchData();
  }, [selectedYear]);

  return (
    <div className="">
      <div className="w-full flex items-center justify-between"></div>
      <div className="grid grid-cols-[60%_auto] gap-x-5">
        <div className="w-full h-full flex flex-col justify-end">
          <div className="w-full grid grid-cols-[25%_24.5%_24.5%_auto] items-end gap-x-5">
            <div className="w-full flex gap-x-3">
              <div className="bg-white rounded-full flex w-12 h-12 justify-center items-center">
                <img src="/dashboard-1.svg" className="h-6" />
              </div>
              <div className="">
                <div className="flex gap-x-3">
                  <p className="text-xl text-black font-medium">
                    {CompletedTrip ?? "-"}
                  </p>
                  <div className="flex items-end">
                    <div
                      className={`${
                        CompletedTriPercentage < 0
                          ? "bg-red-100"
                          : "bg-green-100"
                      } rounded-full mb-2 px-1 flex gap-x-1`}
                    >
                      <img
                        src="/red-down.svg"
                        className={`${
                          CompletedTriPercentage < 0 ? "h-3" : " hidden"
                        }`}
                      />
                      <img
                        src="/green-up.svg"
                        className={`${
                          CompletedTriPercentage > 0 ? "h-3" : " hidden"
                        }`}
                      />
                      <p
                        className={`text-[10px] font-semibold ${
                          CompletedTriPercentage < 0
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {Math.abs(CompletedTriPercentage || 0).toFixed(0)} %
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-neutral-600 text-[10px] font-medium">
                  Total Completed Trips
                </p>
              </div>
            </div>
            <div className="w-full flex gap-x-3">
              <div className="bg-white rounded-full flex w-12 h-12 justify-center items-center">
                <img src="/dashboard-2.svg" className="h-6" />
              </div>
              <div className="">
                <div className="flex gap-x-3">
                  <p className="text-xl text-black font-medium">
                    {OnGoingTrip ?? "-"}
                  </p>
                  <div className="flex items-end">
                    <div
                      className={`${
                        OnGoingTriPercentage < 0 ? "bg-red-100" : "bg-green-100"
                      } rounded-full mb-2 px-1 flex gap-x-1`}
                    >
                      <img
                        src="/red-down.svg"
                        className={`${
                          OnGoingTriPercentage < 0 ? "h-3" : " hidden"
                        }`}
                      />
                      <img
                        src="/green-up.svg"
                        className={`${
                          OnGoingTriPercentage > 0 ? "h-3" : " hidden"
                        }`}
                      />
                      <p
                        className={`text-[10px] font-semibold ${
                          OnGoingTriPercentage < 0
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {Math.abs(OnGoingTriPercentage || 0).toFixed(0)} %
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-neutral-600 text-[10px] font-medium">
                  On Going Trips
                </p>
              </div>
            </div>
            <div className="w-full flex gap-x-3">
              <div className="bg-white rounded-full flex w-12 h-12 justify-center items-center">
                <img src="/dashboard-3.svg" className="h-6" />
              </div>
              <div className="">
                <div className="flex gap-x-3">
                  <p className="text-xl text-black font-medium">
                    {PendingTrip ?? "-"}
                  </p>
                  <div className="flex items-end">
                    <div
                      className={`${
                        PendingTriPercentage < 0 ? "bg-red-100" : "bg-green-100"
                      } rounded-full mb-2 px-1 flex gap-x-1`}
                    >
                      <img
                        src="/red-down.svg"
                        className={`${
                          PendingTriPercentage < 0 ? "h-3" : " hidden"
                        }`}
                      />
                      <img
                        src="/green-up.svg"
                        className={`${
                          PendingTriPercentage > 0 ? "h-3" : " hidden"
                        }`}
                      />
                      <p
                        className={`text-[10px] font-semibold ${
                          PendingTriPercentage < 0
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {Math.abs(PendingTriPercentage || 0).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-neutral-600 text-[10px] font-medium">
                  Pending Trips
                </p>
              </div>
            </div>
            <div className="">
              <div className="w-full flex items-end">
                <Link
                  href="/admin/fleet/manage-trip/create-trip"
                  className="bg-black flex py-2.5 px-4 gap-x-1 items-center rounded-lg cursor-pointer"
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
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-5">
          <div className="bg-white w-full h-28 flex flex-col justify-between rounded-lg p-4">
            <div className="w-full flex justify-between">
              <p className="text-neutral-600 text-xs font-medium">
                Total Vehicle
              </p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="22px"
                viewBox="0 -960 960 960"
                width="22px"
                className="fill-neutral-600"
              >
                <path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z" />
              </svg>
            </div>
            <div className="w-full flex justify-between">
              <div className="flex h-8 items-end gap-x-5">
                <p className="text-black text-xl font-semibold ">
                  {truckCount ?? "-"}
                </p>
                <img src="/dummy-bar.svg" className="h-8" />
              </div>
            </div>
            <p className="text-neutral-600 text-[10px]">based on Last month</p>
          </div>
          <div className="bg-white w-full h-28 flex flex-col justify-between rounded-lg p-4">
            <div className="w-full flex justify-between">
              <p className="text-neutral-600 text-xs font-medium">
                Total Drivers
              </p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="22px"
                viewBox="0 -960 960 960"
                width="22px"
                className="fill-neutral-600"
              >
                <path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z" />
              </svg>
            </div>
            <div className="w-full flex justify-between">
              <div className="flex h-8 items-end gap-x-5">
                <p className="text-black text-xl font-semibold ">
                  {driverCount ?? "-"}
                </p>
                <img src="/dummy-bar.svg" className="h-8" />
              </div>
            </div>
            <p className="text-neutral-600 text-[10px]">based on Last month</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-[60%_auto] gap-x-5 pt-5">
        <div className="w-full bg-white rounded-md p-5">
          <div className="flex justify-between">
            <div>
              <p className="text-black font-semibold">Revenue Analysis</p>
              <p className="text-neutral-600 text-xs">
                View and analysis Total Revenue
              </p>
            </div>
            <div className="mb-4">
              <Select
                onValueChange={(value) => setValue("year", value)}
                defaultValue={currentYear.toString()}
              >
                <SelectTrigger className="w-[180px] p-2 border rounded-lg bg-white text-sm text-black focus:outline-none">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent className="bg-white text-black">
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="pt-8">
            <TripBarChart trips={trips} />
          </div>
        </div>
        <div>
          <TruckSlider />
        </div>
      </div>
    </div>
  );
}

export default FleetDashboard;
