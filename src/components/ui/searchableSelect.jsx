"use client";

import React, { useState } from "react";
import { XCircle, ChevronDown } from "lucide-react";
import SearchInput from "./searchInput";
import { closeDropdown, openDropdown } from "./dropdownManager";

const SearchableSelect = ({
  id,
  options = [],
  value,
  onChange,
  placeholder = "Select",
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  // ================= SAFE LABEL =================
  const getLabel = (opt) => {
    if (typeof opt === "string") return opt;
    if (typeof opt === "number") return String(opt);
    if (opt && typeof opt === "object") {
      if (opt.label !== undefined && opt.label !== null) {
        return String(opt.label);
      }
      if (opt.name) return String(opt.name);
    }
    return "Unknown";
  };

  // ================= SAFE VALUE (KEY) =================
  const getKey = (opt, index) => {
    if (opt && typeof opt === "object") {
      if (opt.id !== undefined && opt.id !== null) return opt.id;
      if (opt.value !== undefined && opt.value !== null) return opt.value;
    }
    return `opt-${index}`; // ✅ always unique fallback
  };

  // ================= FILTER =================
  const filtered = options.filter((opt) =>
    getLabel(opt).toLowerCase().includes(query.toLowerCase())
  );

  const toggleDropdown = () => {
    if (open) {
      setOpen(false);
      closeDropdown(id);
    } else {
      openDropdown(id, () => setOpen(false));
      setOpen(true);
    }
  };

  return (
    <div className="w-full relative text-black">
      {/* ================= SELECT BUTTON ================= */}
      {disabled ? (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50">
          <XCircle size={16} className="text-black" />
          <span className="text-sm text-gray-400">{placeholder}</span>
        </div>
      ) : (
        <button
          type="button"
          onClick={toggleDropdown}
          className="w-full text-left rounded-lg px-4 py-2.5 border border-gray-300 bg-white
                     hover:border-gray-400 hover:shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-gray-400
                     transition-all duration-200
                     flex items-center justify-between"
        >
          <span className="text-xs text-black">
            {value ? getLabel(value) : (
              <span className="text-gray-500">{placeholder}</span>
            )}
          </span>

          <ChevronDown
            size={16}
            className={`text-gray-500 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      )}

      {/* ================= DROPDOWN ================= */}
      {open && !disabled && (
        <div className="absolute bg-white rounded-lg shadow-lg mt-2 w-full z-10 border border-gray-200 overflow-hidden">
          {/* Search */}
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder={`Search ${placeholder}`}
            showClear
          />

          {/* Options */}
          <ul className="max-h-60 overflow-auto">
            {filtered.length > 0 ? (
              filtered.map((opt, index) => (
                <li
                  key={getKey(opt, index)} // ✅ FIXED UNIQUE KEY
                  role="option"
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className="px-3 py-2 text-sm text-black cursor-pointer hover:bg-gray-50"
                >
                  {getLabel(opt)}
                </li>
              ))
            ) : (
              <li className="text-sm text-gray-500 px-4 py-3 text-center">
                No results found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
