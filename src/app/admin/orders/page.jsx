"use client";

import { useState } from "react";
import React from "react";
import Orders from "./order/page";
import Staff from "./staff/page";
import Header from "@/components/Header";
import Client from "./clients/page";
import AllocationPage from "./allocation/page";


export default function Sales() {
  const [activeTab, setActiveTab] = useState("orders");

  const TabItem = ({ id, label }) => (
    <div
      className="flex flex-col items-center gap-y-1 pe-3 border-r border-r-neutral-300 cursor-pointer"
      onClick={() => setActiveTab(id)}
    >
      <p
        className={`text-[13px] font-medium ${
          activeTab === id ? "text-black" : "text-neutral-400"
        }`}
      >
        {label}
      </p>
      {activeTab === id && (
        <div className="bg-red-600 h-0.5 rounded-t-lg w-2/3"></div>
      )}
    </div>
  );

  return (
    <div>
      <Header/>
      <div className="border-b pt-3">
        <div className="flex gap-x-5">

          <TabItem id="orders" label="Orders" />
          <TabItem id="allocation" label="Allocation" />
          
          <TabItem id="staffs" label="Staffs" />
          <TabItem id="clients" label="Clients" />

        </div>
      </div>

      <div className="mt-4">
        {activeTab === "orders" && <Orders />}
        {activeTab === "allocation" && <AllocationPage />}
        {activeTab === "staffs" && <Staff />}
        {activeTab === "client" && <Client />}
      </div>
    </div>
  );
}
