"use client";

import React from "react";
import BenchmarkPriceChart from "@/components/ui/monthlyRevenueChart";
import SummaryCard from "./summarycard";

/**
 * ChartSection Component
 * - Displays monthly price chart and summary cards
 * Props:
 *  - monthlyData: Array of { month: string, totalPrice: number }
 *  - summary: { totalStaffs, totalProviders, marketDemand, totalPrices }
 */
export default function ChartSection({ monthlyData = [], summary = {} }) {
  // Fallback values to avoid hydration mismatch
  const safeSummary = {
    totalStaffs: summary.totalStaffs ?? 0,
    totalProviders: summary.totalProviders ?? 0,
    marketDemand: summary.marketDemand ?? "-",
    totalPrices: summary.totalPrices ?? 0,
  };

  return (
    <div className="grid grid-cols-12 gap-6 mb-8">
      {/* Chart */}
      <div className="col-span-7 bg-white p-8 rounded-[32px] shadow-sm border border-gray-50">
        <span className="text-xs text-gray-400 italic tracking-widest">
          AVG . . . . . . . . .
        </span>
        <BenchmarkPriceChart priceData={monthlyData} />
      </div>

      {/* Summary Cards */}
      <div className="col-span-5 grid grid-cols-2 gap-5">
        <SummaryCard label="Total Staffs" value={safeSummary.totalStaffs} />
        <SummaryCard label="Total Providers" value={safeSummary.totalProviders} />
        <SummaryCard label="Market Demand" value={safeSummary.marketDemand} isText />
        <SummaryCard label="Total Prices" value={safeSummary.totalPrices} />
      </div>
    </div>
  );
}
