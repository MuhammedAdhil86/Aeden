"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchTripById } from "@/service/fleet";
import Header from "@/components/Header";

function Page() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params?.id);
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log("Params:", useParams());

  console.log("id : ", id);

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const trip = await fetchTripById(id);
        setTrip(trip || null);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch trip:", error);
        setLoading(false);
      }
    };
    fetchTripDetails();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!trip) return <div>Trip not found</div>;

  const sections = [
    {
      title: "Basic Details",
      fields: [
        { label: "Exporter Name", key: "exporterName" },
        { label: "Consignee", key: "consignee" },
        { label: "Invoice Number", key: "invoiceNumber" },
        { label: "Invoice Amount", key: "invoiceAmount" },
        { label: "Bl type", key: "bltype_name" },
        { label: "BL Number", key: "BiNumber" },
        {
          label: "Is Switch BL",
          key: "filter",
          format: (value) => (value ? "Yes" : "No"),
        },
        { label: "Place of Switch", key: "country_name" },
        { label: "ETA/ATA", key: "eta" },
        { label: "Last Updated ETA", key: "etaDate" },
        { label: "Free Days", key: "freeDays" },
        { label: "Detention Period End Date", key: "endDate" },
        { label: "Country", key: "country" },
        { label: "Category", key: "category" },
        { label: "Product", key: "product" },
      ],
    },
    {
      title: "INCO Terms",
      fields: [
        { label: "INCO Terms", key: "incoTerms" },
        { label: "Mode", key: "mode" },
        { label: "Other Mode", key: "otherMode" },
      ],
    },
    {
      title: "Insurance",
      fields: [
        { label: "Has Insurance", key: "has_insurance_string" },
        { label: "Premium Amount", key: "premiumAmount" },
        { label: "Insurance Start Date", key: "insuranceStartDate" },
        { label: "Insurance End Date", key: "insuranceEndDate" },
        { label: "Insurance number", key: "insuranceNumber" },

        // { label: "File Upload", key: "insuranceFiles", isFile: true },
      ],
    },
    {
      title: "Notify",
      fields: [
        { label: "Notify Party 1 (Optional)", key: "notify1" },
        { label: "Notify Party 2 (Optional)", key: "notify2" },
        { label: "Notify Party 3 (Optional)", key: "notify3" },
      ],
    },
    {
      title: "CNT Details",
      fields: [
        { label: "CNT Number", key: "CNTNumber" },
        { label: "Shipping Line", key: "shippingLine" },
        { label: "Vessel Name", key: "vesselName" },
        { label: "Vessel Voyage Number", key: "vesselNumber" },
        { label: "Trans Shipment", key: "is_transhipment_string" },
        { label: "Trans Shipment Port", key: "transhipmentPort" },
        { label: "Feeder Vessel Name", key: "feederVesselName" },
      ],
    },
    {
      title: "Port Details",
      fields: [
        { label: "POL (Port of Loading)", key: "pol" },
        { label: "POD (Port of Discharge)", key: "pod" },
        { label: "FPOL (First Point of Loading)", key: "fpol" },
        { label: "FPOD (Final Point of Destination)", key: "fpod" },
      ],
    },
    {
      title: "File Upload",
      fields: [
        { label: "File Name", key: "fileName" },
        { label: "file Category", key: "fileCategory" },
      ],
    },
  ];

  return (
    <div className="p-6">
      <Header />

      <h1 className="text-2xl font-semibold mb-4">Trip Details: {id}</h1>
      <div className="bg-white p-4 rounded-lg shadow">
        <p>
          <strong>From - To:</strong> {trip.trip_title}
        </p>
        <p>
          <strong>Driver Name:</strong> {trip.driver_name}
        </p>
        <p>
          <strong>Registration Number:</strong> {trip.registrationNumber}
        </p>
        <p>
          <strong>Vehicle Model:</strong> {trip.vehicleModel}
        </p>
        <p>
          <strong>Starting Date:</strong> {trip.startingDate}
        </p>
        <p>
          <strong>Status:</strong> {trip.Status}
        </p>
      </div>
      <button
        onClick={() => router.push("/admin/fleet/manage-trip")}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Back to Trips
      </button>
    </div>
  );
}

export default Page;
