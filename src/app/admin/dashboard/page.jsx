"use client";

import react, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Header from "@/components/Header";
function Dashboard() {


  return (
    <div>
      <div>
        <Header breadcrumbs={["Dashboard"]} />
      </div>
      <div className="pt-5">
        dashboard
      </div>
    </div>
  );
}

export default Dashboard;
