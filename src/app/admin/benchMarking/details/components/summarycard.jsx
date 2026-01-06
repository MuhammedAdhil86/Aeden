"use client";

import React from "react";
import { Icon } from "@iconify/react";

export default function SummaryCard({
  label,
  value,
  isText = false,
  description = "based on last month",
}) {
  // Show string values for text cards (like Market Demand), numbers for numeric cards
  const displayValue = isText
    ? value || "-"             // ✅ for string/text values
    : typeof value === "number"
      ? value                  // ✅ for numeric values like totalStaffs, totalProviders, totalPrices
      : "-";

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-50 relative">
      <div className="flex justify-between items-start">
        <p className="text-gray-500 text-xs">{label}</p>
        <Icon icon="mdi:dots-horizontal" className="text-gray-400 text-xl" />
      </div>

      <div className="flex items-center gap-2 mt-2">
        <p
          className={`font-medium leading-none${isText ? " truncate" : ""}`}
          style={{ fontSize: "28px" }}
        >
          {displayValue}
        </p>
        <Icon icon="uim:graph-bar" className="text-gray-300 text-2xl" />
      </div>

      <p className="text-[10px] text-gray-400 mt-7">{description}</p>
    </div>
  );
}
