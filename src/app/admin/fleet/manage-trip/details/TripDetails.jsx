"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchTripById } from "@/service/fleet";
import Header from "@/components/Header";
import OtherLoadDetail from "./OtherLoadDetail";
import OwnLoadDetail from "./OwnLoadDetail";
import ThirdPartyDetail from "./ThirdPartyDetail";

export default function TripDetails() {
  const searchParams = useSearchParams();
  const id = Number(searchParams.get("id"));
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log("id : ", id);

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const trip = await fetchTripById(id);
        console.log("trip detail : ", trip);
        //console.log("Insurance file:", trip.insurence_file);
        setTrip(trip || null);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch trip:", error);
        setLoading(false);
      }
    };
    fetchTripDetails();
  }, [id]);

  if (loading) return <div className="text-black">Loading...</div>;
  if (!trip) return <div className="text-black">Trip not found</div>;

  const doc = {
    url: trip.insurence_file,
    name: "insurance.pdf",
  };

  return (
    <div className="p-2">
      <Header />

      <div className="bg-white py-4 px-6 rounded-lg shadow uppercase">
        <div className="flex gap-x-5">
          <p className="text-black font-semibold">
            {trip.trip_title} (
            {trip?.trip_type === "self" && trip?.self_type === "other-load"
              ? "Other Load"
              : trip?.trip_type === "self" && trip?.self_type === "own-load"
              ? "Own Load"
              : "Third Party"}
            )
          </p>
          {(() => {
            const statusColors = {
              Created: "bg-green-100 text-black",
              "In-Transit": "bg-yellow-100 text-black",
              Reached: "bg-green-100 text-black",
              cancelled: "bg-red-100 text-black",
            };

            const colorClasses =
              statusColors[trip.status] || "bg-neutral-200 text-black";

            return (
              <div
                className={`rounded-md flex px-3 items-center ${colorClasses}`}
              >
                {/* <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-dot-icon lucide-dot"
                    >
                      <circle cx="12.1" cy="12.1" r="1" />
                    </svg> */}
                <p className="text-[12px] ml-2 font-medium">{trip.status}</p>
              </div>
            );
          })()}
        </div>
        <div className="border-t mt-4 py-4">
          <p className="text-black font-medium text-sm">Basic Details</p>
          <div className="py-10 grid grid-cols-6 gap-y-10 border-b">
            <div>
              <p className="text-[10px] font-medium text-gray-600">
                Loading point
              </p>
              <p className="text-xs pt-1 text-black font-medium">
                {trip.loading_point}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-600">
                Unloading point
              </p>
              <p className="text-xs pt-1 text-black font-medium">
                {trip.unloading_point}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-600 ">
                Carry Product
              </p>
              <p className="text-xs pt-1 text-black font-medium uppercase	">
                {trip.carry_product}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-600">
                Driver Name
              </p>
              <p className="text-xs pt-1 text-black font-medium uppercase">
                {trip.driverid.full_name}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-600">Vehicle </p>
              <p className="text-xs pt-1 text-black font-medium">
                {trip.truckid.register_number}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-600">
                Purpose of use
              </p>
              <p className="text-xs pt-1 text-black font-medium">
                {trip.purpose_of_use}
              </p>
            </div>{" "}
            <div>
              <p className="text-[10px] font-medium text-gray-600">Kilometer</p>
              <p className="text-xs pt-1 text-black font-medium">
                {trip.total_kilometer}
              </p>
            </div>{" "}
            <div>
              <p className="text-[10px] font-medium text-gray-600">Fuel</p>
              <p className="text-xs pt-1 text-black font-medium">
                {trip.fuel_lose}
              </p>
            </div>{" "}
            <div>
              <p className="text-[10px] font-medium text-gray-600">
                Loading Date
              </p>
              <p className="text-xs pt-1 text-black font-medium">
                {trip.loading_date
                  ? new Date(trip.loading_date).toLocaleDateString("en-GB")
                  : "N/A"}
              </p>
            </div>{" "}
            <div>
              <p className="text-[10px] font-medium text-gray-600">
                Unloading Date
              </p>
              <p className="text-xs pt-1 text-black font-medium">
                {trip.unloading_date
                  ? new Date(trip.unloading_date).toLocaleDateString("en-GB") // 'en-GB' gives dd/mm/yyyy
                  : "N/A"}
              </p>
            </div>{" "}
            <div>
              <p className="text-[10px] font-medium text-gray-600">
                Description
              </p>
              <p className="text-xs pt-1 text-black font-medium">
                {trip.description}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-600">
                In transit
              </p>
              <p className="text-xs pt-1 text-black font-medium">
                {trip.in_transit?.join(", ")}
              </p>
            </div>
          </div>
          <p className="text-black font-medium text-sm pt-4">Other Details</p>
          {trip.trip_type === "self" && trip.self_type === "other-load" ? (
            <OtherLoadDetail trip={trip} />
          ) : trip.trip_type === "self" && trip.self_type === "own-load" ? (
            <OwnLoadDetail trip={trip} />
          ) : (
            <ThirdPartyDetail trip={trip} />
          )}
          <div className="py-10 grid grid-cols-6 gap-y-10 border-b hidden">
            <div>
              <p className="text-[10px] font-medium text-gray-600">Commodity</p>
              <p className="text-xs pt-1 text-black font-medium">
                {trip.commodity}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-600">Client</p>
              <p className="text-xs pt-1 text-black font-medium">
                {trip.client}
              </p>
            </div>{" "}
            <div>
              <p className="text-[10px] font-medium text-gray-600">
                Commission
              </p>
              <p className="text-xs pt-1 text-black font-medium">
                {trip.commission}
              </p>
            </div>{" "}
            <div>
              <p className="text-[10px] font-medium text-gray-600">
                Committed Date
              </p>
              <p className="text-xs pt-1 text-black font-medium">
                {trip.committed_rate}
              </p>
            </div>{" "}
            <div>
              <p className="text-[10px] font-medium text-gray-600">
                Advanced Received Amount
              </p>
              <p className="text-xs pt-1 text-black font-medium">
                {trip.advance_received}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-600">
                Advanced Received Date{" "}
              </p>
              <p className="text-xs pt-1 text-black font-medium">
                {trip.advance_received_date
                  ? new Date(trip.advance_received_date).toLocaleDateString(
                      "en-GB"
                    )
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-600">
                Balance Amount
              </p>
              <p className="text-xs pt-1 text-black font-medium">
                {trip.balance_payable}
              </p>
            </div>
          </div>
          <p className="text-black font-medium text-sm pt-4">
            Insurance Details
          </p>

          <div className="py-10 grid grid-cols-6 gap-y-10 border-b">
            <div>
              <p className="text-[10px] font-medium text-gray-600">Policy No</p>
              <p className="text-xs pt-1 text-black font-medium">
                {trip.insurance_policy_no}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-600">Premium</p>
              <p className="text-xs pt-1 text-black font-medium">
                {trip.insurance_premium_amount}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-600">
                Invoice Date
              </p>
              <p className="text-xs pt-1 text-black font-medium">
                {trip.insurance_invoice_date
                  ? new Date(trip.insurance_invoice_date).toLocaleDateString(
                      "en-GB"
                    )
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-600">
                Invoice Number{" "}
              </p>
              <p className="text-xs pt-1 text-black font-medium">
                {trip.insurance_invoice_number}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-600">
                Owner Name
              </p>
              <p className="text-xs pt-1 text-black font-medium">
                {trip.insurance_owner_name}
              </p>
            </div>
          </div>
          <p className="text-black font-medium text-sm pt-4 ">Documents</p>
          <div className="grid grid-cols-2 gap-x-5"></div>
          <div className="border rounded-md p-3 flex justify-between items-center">
            <div className="flex gap-x-3">
              <div className="bg-black w-12 h-12 flex justify-center items-center rounded-md">
                <p className="text-white text-sm">PDF</p>
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-black text-sm font-medium">insurance.pdf</p>
                <p className="text-[10px] text-neutral-400">Uploaded</p>
              </div>
            </div>
            <div
              className="flex items-center gap-x-2 cursor-pointer"
              onClick={() => window.open(doc.url, "_blank")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="16px"
                viewBox="0 -960 960 960"
                width="16px"
                fill="#000"
              >
                <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
              </svg>
              <p className="text-black text-sm">View document</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
