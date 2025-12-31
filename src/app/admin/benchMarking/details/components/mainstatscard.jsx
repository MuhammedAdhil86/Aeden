"use client";

import { Icon } from "@iconify/react";

export default function MainStatCard({
  icon,
  value,
  label,
  trend,
  trendDown,
}) {
  /**
   * IMPORTANT:
   * - Always render the SAME value on server & first client render
   * - Never render "—" conditionally
   * - Normalize value to string
   */
  const displayValue =
    value === undefined || value === null ? "0.00" : String(value);

  return (
    <div className="p-6 rounded-[24px] flex gap-5 items-center">
      {/* ICON */}
      <div className="w-12 h-12 bg-white p-3 rounded-full flex items-center justify-center">
        <Icon
          icon={icon}
          width={22}
          height={22}
          className="text-gray-700"
        />
      </div>

      {/* CONTENT */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          {/* ✅ NO trailing spaces, NO dynamic mismatch */}
          <span className="text-[16px]">
            {displayValue}
          </span>

          {trend && (
            <div
              className={`flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full ${
                trendDown
                  ? "bg-pink-50 text-pink-500"
                  : "bg-green-50 text-green-500"
              }`}
            >
              <Icon
                icon={
                  trendDown
                    ? "streamline:money-graph-arrow-decrease-descend-growth-down-arrow-stats-graph-right-fall"
                    : "streamline:money-graph-arrow-increase-ascend-growth-up-arrow-stats-graph-right-grow"
                }
                width={12}
                height={12}
              />
              <span>{trend}</span>
            </div>
          )}
        </div>

        <p className="text-[10px] text-gray-400 uppercase">
          {label}
        </p>
      </div>
    </div>
  );
}
