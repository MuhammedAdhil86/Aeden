"use client";

import { useSearchParams } from "next/navigation";
import { Calendar, Plus, Filter, Download, Search } from "lucide-react";

export default function TopBar({ search, setSearch }) {
  const searchParams = useSearchParams();

  // ✅ Get product & category from URL
  const product = searchParams.get("product") || "-";
  const category = searchParams.get("category") || "-";

  return (
    <div className="flex items-center justify-between mb-8">
      {/* LEFT TITLE */}
      <h1 className="text-gray-800 text-[16px]">
        {category} - {product}
      </h1>

      {/* RIGHT CONTROLS */}
      <div className="flex items-center gap-4">
        {/* DATE RANGE */}
        <div className="flex items-center gap-4 min-w-[300px] h-10 text-sm text-gray-500">
          {/* FROM DATE */}
          <div className="flex items-center gap-2 bg-white px-4 py-2 h-full rounded-md border border-gray-100">
            <span>15/10/2025</span>
            <Calendar size={16} />
          </div>

          {/* DASHED SEPARATOR */}
          <div className="flex-1 flex items-center justify-center h-full">
            <div className="w-full border-t border-dashed border-gray-300" />
          </div>

          {/* TO DATE */}
          <div className="flex items-center gap-2 bg-white px-4 py-2 h-full rounded-md border border-gray-100">
            <span>16/10/2025</span>
            <Calendar size={16} />
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-2 h-10">
          <button className="flex items-center justify-center w-10 h-full bg-[#121212] text-white rounded-xl shadow-md">
            <Plus size={18} />
          </button>

          <button className="flex items-center justify-center w-10 h-full bg-[#1A1C1E] text-white rounded-xl shadow-md">
            <Filter size={18} />
          </button>

          <button className="flex items-center justify-center w-10 h-full bg-[#1A1C1E] text-white rounded-xl shadow-md">
            <Download size={18} />
          </button>
        </div>

        {/* SEARCH */}
        <div className="relative h-10">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search Product"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 h-full bg-white border border-gray-100 rounded-xl w-64 shadow-sm focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
