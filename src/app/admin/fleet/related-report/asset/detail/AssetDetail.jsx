"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import { fetchAssetManagementById, fetchExpenseById } from "@/service/report";

export default function AssetDetail() {
  const searchParams = useSearchParams();
  const id = Number(searchParams.get("id"));
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getExpense = async () => {
      try {
        setLoading(true);
        const data = await fetchAssetManagementById(id);
        console.log("fleet expense details : ", data);

        if (!data || data.length === 0) {
          throw new Error("No asset data found for this ID");
        }

        const truckData = data[0];
        setTrip(truckData);
      } catch (err) {
        setError(err.message || "Failed to fetch asset details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getExpense();
    } else {
      setError("No asset ID provided");
      setLoading(false);
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const totalCost =
    trip.maintenance?.reduce((sum, item) => sum + (item.cost || 0), 0) || 0;

  const formatDate = (dateString) => {
    if (!dateString || dateString === "0001-01-01T00:00:00Z") return "N/A";
    return new Date(dateString).toISOString().split("T")[0]; // Returns YYYY-MM-DD
  };

  return (
    <div>
      <Header />
      <div className="pt-5 px-5 w-full">
        <div className="w-2/3 flex justify-between">
          <p className="text-black font-medium pt-1">Vehicle Maintanance Detail</p>
        </div>
        <div className="mt-5 pt-5 px-10 w-2/3 bg-white rounded-md uppercase">
          <p className="text-black">{trip.register_number || "N/A"}</p>
          <div className="mt-3 flex flex-col gap-y-5 border-t py-6">
            <div className="w-full grid grid-cols-[50%_auto] gap-x-10">
              <p className="text-neutral-600 font-medium text-xs">
                Vehicle Name
              </p>
              <p className="text-black font-medium text-sm">
                {trip.vehicle_name || "N/A"}
              </p>
            </div>
            {/* <div className="w-full grid grid-cols-[50%_auto] gap-x-10">
              <p className="text-neutral-600 font-medium text-xs">
                Number of Trips
              </p>
              <p className="text-black font-medium text-sm">N/A</p>
            </div>
            <div className="w-full grid grid-cols-[50%_auto] gap-x-10">
              <p className="text-neutral-600 font-medium text-xs">Profit</p>
              <p className="text-black font-medium text-sm">N/A</p>
            </div> */}
          </div>
          <div className="grid grid-cols-4 gap-y-5 border-b border-t py-2 gap-x-8">
            <p className="text-black font-medium text-sm">Date</p>
            <p className="text-black font-medium text-sm">Type Maintenance</p>
            <p className="text-black font-medium text-sm">Description</p>
            <p className="text-black font-medium text-sm">Cost</p>
          </div>
          <div className="mt-3 flex flex-col gap-y-3 border-b py-3">
            {trip.maintenance && trip.maintenance.length > 0 ? (
              trip.maintenance.map((item, index) => (
                <div key={index} className="w-full grid grid-cols-4 gap-x-8">
                  <p className="text-neutral-600 font-medium text-xs">
                    {formatDate(item.maintenance_date)}
                  </p>
                  <p className="text-neutral-600 font-medium text-xs capitalize">
                    {item.maintenance_type || "N/A"}
                  </p>
                  <p className="text-neutral-600 font-medium text-xs">
                    {item.description || "N/A"}
                  </p>
                  <p className="text-black font-medium text-sm">
                    ₹ {(item.cost || 0).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="w-full flex justify-between">
                <p className="text-neutral-600 font-medium text-xs">
                  No maintenance records found
                </p>
              </div>
            )}
          </div>
          <div className="w-full flex justify-between py-3">
            <p className="text-neutral-600 font-medium text-xs">
              Total Fleet Expenses
            </p>
            <div className="flex gap-x-3 text-black">
              ₹{" "}
              <p className="text-black font-semibold">
                {totalCost.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
