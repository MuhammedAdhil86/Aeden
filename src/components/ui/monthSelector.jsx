"use client";

import React, { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const MonthSelector = ({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
  className,
  placeholder = {
    month: "Select Month",
    year: "Select Year",
  },
}) => {
  const [years, setYears] = useState([]);

  // Client-only dynamic logic
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const list = [];
    for (let i = currentYear; i >= currentYear - 10; i--) {
      list.push(i);
    }
    setYears(list);
  }, []);

  if (!years.length) return null;

  return (
    <div
      className={["flex items-center gap-4", className]
        .filter(Boolean)
        .join(" ")}
    >
      {/* MONTH */}
      <Select value={selectedMonth} onValueChange={onMonthChange}>
        <SelectTrigger className="w-40 bg-white border border-gray-300 text-black rounded-lg">
          <SelectValue placeholder={placeholder.month} />
        </SelectTrigger>
        <SelectContent className="bg-white text-black">
          {MONTH_NAMES.map((month, index) => (
            <SelectItem key={index} value={(index + 1).toString()}>
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* YEAR */}
      <Select value={selectedYear} onValueChange={onYearChange}>
        <SelectTrigger className="w-28 bg-white border border-gray-300 text-black rounded-lg">
          <SelectValue placeholder={placeholder.year} />
        </SelectTrigger>
        <SelectContent className="bg-white text-black">
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default MonthSelector;
