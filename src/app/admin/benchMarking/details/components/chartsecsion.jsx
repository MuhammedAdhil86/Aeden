"use client";

import React from "react";
import BenchmarkPriceChart from "@/components/ui/monthlyRevenueChart";
import SummaryCard from "./summarycard";

export default function ChartSection({ monthlyData = [], summary = {} }) {
  // Ensure safe values for all summary cards
  const safeSummary = {
    totalStaffs: summary.totalStaffs ?? 0,
    totalProviders: summary.totalProviders ?? 0,
    marketDemand: summary.marketDemand ?? "-", // string value
    totalPrices: summary.totalPrices ?? 0,     // numeric value
  };

  return (
    <div className="grid grid-cols-12 gap-6 mb-8">
      {/* ---------- CHART ---------- */}
      <div className="col-span-7 bg-white rounded-lg shadow-sm border border-gray-50">
        <BenchmarkPriceChart priceData={monthlyData} />
      </div>

      {/* ---------- SUMMARY CARDS ---------- */}
      <div className="col-span-5 grid grid-cols-2 gap-5">
        <SummaryCard 
          label="Total Staffs" 
          value={safeSummary.totalStaffs} 
        />
        <SummaryCard 
          label="Total Providers" 
          value={safeSummary.totalProviders} 
        />
        <SummaryCard
          label="Market Demand"
          value={safeSummary.marketDemand}
          isText
        />
        <SummaryCard 
          label="Total Prices" 
          value={safeSummary.totalPrices} 
        />
      </div>
    </div>
  );
}
