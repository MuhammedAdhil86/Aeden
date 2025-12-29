"use client";
import { useState } from "react";
import Header from "@/components/Header";
import React from "react";
import ManageTrip from "./manage-trip/page";
import ManageVehicle from "./manage-vehicle/page";
import ManageDrivers from "./manage-drivers/page";
import RelatedReport from "./related-report/page";
import FleetDashboard from "./fleet-dashboard/page";

function Fleet() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div>
      <Header />
      <div className="border-b pt-3">
        <div className="flex gap-x-5">
          <div
            className="flex flex-col items-center gap-y-1 pe-3 border-r border-r-neutral-300 cursor-pointer"
            onClick={() => setActiveTab("dashboard")}
          >
            <p
              className={`text-[13px] font-medium ${
                activeTab === "dashboard" ? "text-black" : "text-neutral-400"
              }`}
            >
              Dashboard
            </p>
            {activeTab === "dashboard" && (
              <div className="bg-red-600 h-0.5 rounded-t-lg w-2/3"></div>
            )}
          </div>
          <div
            className="flex flex-col items-center gap-y-1 pe-3 border-r border-r-neutral-300 cursor-pointer"
            onClick={() => setActiveTab("trip")}
          >
            <p
              className={`text-[13px] font-medium ${
                activeTab === "trip" ? "text-black" : "text-neutral-400"
              }`}
            >
              Manage Trip
            </p>
            {activeTab === "trip" && (
              <div className="bg-red-600 h-0.5 rounded-t-lg w-2/3"></div>
            )}
          </div>

          <div
            className="flex flex-col items-center gap-y-1 pe-3 border-r border-r-neutral-300 cursor-pointer"
            onClick={() => setActiveTab("vehicle")}
          >
            <p
              className={`text-[13px] font-medium ${
                activeTab === "vehicle" ? "text-black" : "text-neutral-400"
              }`}
            >
              Manage Vehicle
            </p>
            {activeTab === "vehicle" && (
              <div className="bg-red-600 h-0.5 rounded-t-lg w-2/3"></div>
            )}
          </div>

          <div
            className="flex flex-col items-center gap-y-1 pe-3 border-r border-r-neutral-300 cursor-pointer"
            onClick={() => setActiveTab("drivers")}
          >
            <p
              className={`text-[13px] font-medium ${
                activeTab === "drivers" ? "text-black" : "text-neutral-400"
              }`}
            >
              Manage Drivers
            </p>
            {activeTab === "drivers" && (
              <div className="bg-red-600 h-0.5 rounded-t-lg w-2/3"></div>
            )}
          </div>

          <div
            className="flex flex-col items-center gap-y-1 pe-3 border-r border-r-neutral-300 cursor-pointer"
            onClick={() => setActiveTab("report")}
          >
            <p
              className={`text-[13px] font-medium ${
                activeTab === "report" ? "text-black" : "text-neutral-400"
              }`}
            >
              Fleet Reports
            </p>
            {activeTab === "report" && (
              <div className="bg-red-600 h-0.5 rounded-t-lg w-2/3"></div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4">
        {activeTab === "dashboard" && <FleetDashboard />}
        {activeTab === "trip" && <ManageTrip />}
        {activeTab === "vehicle" && <ManageVehicle />}
        {activeTab === "drivers" && <ManageDrivers />}
        {activeTab === "report" && <RelatedReport />}
      </div>
    </div>
  );
}

export default Fleet;
