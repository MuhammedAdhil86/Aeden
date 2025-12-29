"use client";
import React, { useState, useEffect } from "react";
import { X, Calendar } from "lucide-react";
import { toast } from "react-toastify";

import { fetchAllocationStaffs, addAllocation } from "@/service/sales";

export default function AllocateStaffModal({ client, onClose, onSuccess }) {
  const [staffList, setStaffList] = useState([]);
  const [staffId, setStaffId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [newStaffName, setNewStaffName] = useState("");
  const [isAddStaffMode, setIsAddStaffMode] = useState(false);

  useEffect(() => {
    loadStaffs();
  }, []);

  const loadStaffs = async () => {
    try {
      const res = await fetchAllocationStaffs();

      console.log("STAFF RESPONSE:", res);

      let list = [];

      if (Array.isArray(res?.data)) list = res.data;
      else if (Array.isArray(res?.staffs)) list = res.staffs;
      else if (Array.isArray(res)) list = res;
      else list = []; // fallback

      setStaffList(list);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load staff");
      setStaffList([]);
    }
  };

  const handleAllocate = async () => {
    if (!staffId && !newStaffName.trim()) {
      return toast.error("Please choose or enter staff");
    }
    if (!startDate) return toast.error("Select starting date");
    if (!endDate) return toast.error("Select ending date");

    setLoading(true);

    const payload = {
      sales_id: {
        id: client?.sales_id?.id || client?.id,
      },

      staff_id: staffId
        ? String(staffId) // Existing staff → send ID as a string
        : newStaffName.trim(), // New staff → send name as string

      starting_date: startDate,
      ending_date: endDate,
    };

    console.log(JSON.stringify(payload, null, 2));

    try {
      await addAllocation(payload);
      toast.success("Staff allocated successfully!");

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error("Allocation failed:", err);
      toast.error("Allocation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center ml-4">
      <div className="bg-white rounded-xl w-[500px] overflow-hidden shadow-xl ml-3">
        {/* Header */}
        <div className="flex items-center justify-between p-2 border-b ml-3">
          <div className="flex items-center gap-3 mt-3">
            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-pink-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h2 className="text-sm font-semibold text-black ">
              Allocate Staff
            </h2>
          </div>

          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-700 hover:text-gray-700" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* <div>
            <label className="text-sm font-sm mb-1 block ml-1 text-black">Staff</label>

            {staffList.length === 0 || isAddStaffMode ? (
              // ADD STAFF SECTION
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Enter staff name"
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  className="w-full h-[46px] border rounded-lg px-3 text-sm"
                />

                <button
                  onClick={() => {
                    if (!newStaffName.trim())
                      return toast.error("Enter staff name");

                    const newStaff = {
                      id: Date.now(),
                      staff_id: Date.now(),
                      staff_name: newStaffName,
                    };

                    setStaffList((prev) => [...prev, newStaff]);
                    setStaffId(newStaff.staff_id);
                    setIsAddStaffMode(false);
                    toast.success("Staff added!");
                  }}
                  className="px-4 py-2 bg-black text-white rounded-lg"
                >
                  Add Staff
                </button>
              </div>
            ) : (
              <select
                className="w-full h-[46px] border rounded-lg px-3 text-sm"
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
              >
                <option value="">Choose staff</option>

                {staffList.map((staff) => (
                  <option key={staff.id} value={staff.staff_id}>
                    {staff.staff_name || staff.name}
                  </option>
                ))}
              </select>
            )}

            <button
              className="text-blue-600 text-xs mt-2 underline"
              onClick={() => setIsAddStaffMode(!isAddStaffMode)}
            >
              {isAddStaffMode ? "Back to staff list" : "Add new staff"}
            </button>
          </div> */}

          <div>
            <label className="text-sm font-sm  text-black mb-1 block ml-1">
              Staff
            </label>

            {/* If adding new staff → show only input */}
            {isAddStaffMode ? (
              <input
                type="text"
                placeholder="Enter staff name"
                value={newStaffName}
                onChange={(e) => setNewStaffName(e.target.value)}
                className="w-full h-[46px] border rounded-lg px-3 text-xs"
              />
            ) : (
              /* Normal dropdown with arrow */
              <select
                className="w-full h-[46px] border rounded-lg px-3 text-xs appearance-none bg-white text-gray-500 "
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml;utf8,<svg fill='gray' height='20' viewBox='0 0 20 20' width='20' xmlns='http://www.w3.org/2000/svg'><polygon points='0,0 20,0 10,10'/></svg>\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 10px center",
                  backgroundSize: "14px",
                }}
              >
                <option value="">Choose staff</option>
                {staffList.map((staff) => (
                  <option key={staff.id} value={staff.staff_id} style={{color:'black' ,hover:'bg-gray-200'}}>
                    {staff.staff_name || staff.name}
                  </option>
                ))}
              </select>
            )}

            <button
              className="text-black text-xs mt-2 underline"
              onClick={() => {
                if (!isAddStaffMode && staffList.length === 0) {
                  setStaffId("");
                }
                setIsAddStaffMode(!isAddStaffMode);
              }}
            >
              {isAddStaffMode ? "Back to staff list" : "Add new staff"}
            </button>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            {/* Start Date */}
            <div>
              <label className="text-xs text-black font-sm mb-1 block ml-1">
                Starting Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border rounded-lg px-3 h-[46px] text-xs text-gray-500"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 " />
              </div>
            </div>

            {/* End Date */}
            <div>
              <label className="text-xs font-sm text-black mb-1 block ml-1">
                End Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border rounded-lg px-3 h-[46px] text-xs text-gray-400 font-xs"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 " />
              </div>
            </div>
          </div>

          {/* Client Preview */}
        </div>
          {/* <div className="flex items-center gap-3 ml-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-black font-bold">🧾</span>
            </div>
            <p className="font-sm text-xs text-black">
              {client?.sales_id?.client_name || client?.client_name}
            </p>
          </div>

        <div className="p-5 border-t flex justify-end gap-4 bg-white">
          <button
            onClick={onClose}
            className="px-5 py-2 border rounded-lg text-gray-700 bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleAllocate}
            disabled={loading}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            {loading ? "Allocating..." : "Allocate"}
          </button>
        </div> */}

        {/* CLIENT + BUTTONS IN ONE FLEX ROW */}
<div className="p-5 border-t bg-white flex items-center justify-between">

  {/* CLIENT PREVIEW */}
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
      <span className="text-black font-bold">🧾</span>
    </div>

    <p className="text-xs text-black">
      {client?.sales_id?.client_name || client?.client_name}
    </p>
  </div>

  {/* BUTTONS */}
  <div className="flex items-center gap-4">
    <button
      onClick={onClose}
      className="px-5 py-2 border rounded-lg text-gray-700 bg-gray-100 text-xs"
    >
      Cancel
    </button>

    <button
      onClick={handleAllocate}
      disabled={loading}
      className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 text-xs"
    >
      {loading ? "Allocating..." : "Allocate"}
    </button>
  </div>
</div>

      </div>
    </div>
  );
}
