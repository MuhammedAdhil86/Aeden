"use client";

import React from "react";

/**
 * SummaryCard component
 * - Displays a label and a value in a styled card
 * - SSR safe with fallback values
 *
 * Props:
 *  - label: string
 *  - value: number | string
 *  - isText: boolean (optional, true if value is non-numeric)
 */
export default function SummaryCard({ label, value, isText = false }) {
  // Fallback value to avoid hydration mismatch
  const displayValue = value ?? "-";

  return (
    <div className="bg-white p-6 rounded-[28px] shadow-sm border border-gray-50 relative">
      {/* Label */}
      <p className="text-gray-500 text-xs">{label}</p>

      {/* Value */}
      <p className={`font-bold text-lg ${isText ? "truncate" : ""}`}>
        {displayValue}
      </p>
    </div>
  );
}
