"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import { fetchAssetManagementById, fetchExpenseById, fetchServiceById } from "@/service/report";

export default function ServiceDetail() {
  const searchParams = useSearchParams();
  const id = Number(searchParams.get("id"));
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getService = async () => {
      try {
        setLoading(true);
        const data = await fetchServiceById(id);
        console.log("Raw API response:", data);

        if (!data || !data.trucks || !Array.isArray(data.trucks) || data.trucks.length === 0) {
          throw new Error("No valid truck data found for this ID");
        }

        const truckData = data.trucks[0];
        console.log("Processed truck data:", truckData);
        setTrip(truckData);
      } catch (err) {
        console.error("Error fetching service:", err);
        setError(err.message || "Failed to fetch asset details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getService();
    } else {
      setError("No asset ID provided");
      setLoading(false);
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!trip) return <div>No truck data available</div>;

  const formatDate = (dateString) => {
    if (!dateString || dateString === "0001-01-01T00:00:00Z") return "N/A";
    return new Date(dateString).toISOString().split("T")[0];
  };

  return (
    <div>
      <Header />
      <div className="pt-5 px-5 w-full">
        <div className="w-2/3 flex justify-between">
          <p className="text-black font-medium pt-1">Service History  Detail</p>
        </div>
        <div className="mt-5 pt-5 px-10 w-full bg-white rounded-md uppercase">
          <p className="text-black">{trip.vehicle_number || "N/A"}</p>
          <div className="mt-3 flex flex-col gap-y-5 border-t py-6">
            <div className="w-full grid grid-cols-[50%_auto] gap-x-10">
              <p className="text-neutral-600 font-medium text-xs">Vehicle Name</p>
              <p className="text-black font-medium text-sm">{trip.vehicle_name || "N/A"}</p>
            </div>
            <div className="w-full grid grid-cols-[50%_auto] gap-x-10">
              <p className="text-neutral-600 font-medium text-xs">Number of Services</p>
              <p className="text-black font-medium text-sm">{trip.total_services || "N/A"}</p>
            </div>
            <div className="w-full grid grid-cols-[50%_auto] gap-x-10">
              <p className="text-neutral-600 font-medium text-xs">Last Service Cost</p>
              <p className="text-black font-medium text-sm">
               ₹ {trip.entries && trip.entries.length > 0
                  ? trip.entries[trip.entries.length - 1].cost.toLocaleString()
                  : "0"}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-y-5 border-b border-t py-2">
            <p className="text-black font-medium text-sm">Service Date</p>
            <p className="text-black font-medium text-sm">Service Type</p>
            <p className="text-black font-medium text-sm">Cost</p>
            <p className="text-black font-medium text-sm">Description</p>
            <p className="text-black font-medium text-sm">Service Center</p>
          </div>
          <div className="mt-3 flex flex-col gap-y-6 border-b py-3">
            {trip.entries && trip.entries.length > 0 ? (
              trip.entries.map((item, index) => (
                <div key={index} className="w-full grid grid-cols-5">
                  <p className="text-neutral-600 font-medium text-xs">
                    {formatDate(item.service_date)}
                  </p>
                  <p className="text-neutral-600 font-medium text-xs capitalize">
                    {item.service_type || "N/A"}
                  </p>
                  <p className="text-neutral-600 font-medium text-xs">
                    ₹ {item.cost ? item.cost.toLocaleString() : "0"}
                  </p>
                  <p className="text-neutral-600 font-medium text-xs">
                    {item.description || "N/A"}
                  </p>
                  <p className="text-neutral-600 font-medium text-xs">
                    {item.service_center || "N/A"}
                  </p>
                </div>
              ))
            ) : (
              <div className="w-full flex justify-between">
                <p className="text-neutral-600 font-medium text-xs">No maintenance records found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}