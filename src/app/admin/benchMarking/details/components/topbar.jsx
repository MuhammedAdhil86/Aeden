"use client";

import { Calendar, Plus, Download, Search } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function TopBar({
  search,
  setSearch,
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  product = "-",
  category = "-",
}) {
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-gray-800 text-[16px]">{category} - {product}</h1>

      <div className="flex items-center gap-4">
        {/* DATE RANGE */}
        <div className="flex items-center gap-4 min-w-[300px] h-10 text-sm text-gray-500">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-md border border-gray-100">
            <DatePicker
              selected={fromDate}
              onChange={(date) => setFromDate(date)}
              dateFormat="dd/MM/yyyy"
              className="w-[90px] outline-none cursor-pointer"
            />
            <Calendar size={16} />
          </div>

          <div className="flex-1 border-t border-dashed border-gray-300" />

          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-md border border-gray-100">
            <DatePicker
              selected={toDate}
              onChange={(date) => setToDate(date)}
              minDate={fromDate}
              dateFormat="dd/MM/yyyy"
              className="w-[90px] outline-none cursor-pointer"
            />
            <Calendar size={16} />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-2 h-10">
          <button className="w-10 h-full bg-[#121212] text-white rounded-xl flex items-center justify-center">
            <Plus size={18} />
          </button>

          <button className="w-10 h-full bg-[#1A1C1E] text-white rounded-xl flex items-center justify-center">
            <Download size={18} />
          </button>
        </div>

        {/* SEARCH */}
        <div className="relative h-10">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Product"
            className="pl-10 pr-4 h-full bg-white border border-gray-100 rounded-xl w-64 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
