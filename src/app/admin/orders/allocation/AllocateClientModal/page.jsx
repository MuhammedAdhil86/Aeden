"use client";
export const dynamic = "force-dynamic";
import React, { useEffect, useState } from "react";
import { X, Calendar } from "lucide-react";
import { toast } from "react-toastify";
import { fetchAllocationStaffs, addAllocation } from "@/service/sales";

export default function AllocateClientModal({ client, onClose, onSuccess }) {
  const [staffList, setStaffList] = useState([]);
  const [staffId, setStaffId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

   if (!client) return null;

  useEffect(() => {
    loadStaffs();
  }, []);

  const loadStaffs = async () => {
    try {
      const res = await fetchAllocationStaffs(); // expects { data: [...] }
      const list = Array.isArray(res?.data) ? res.data : res;
      setStaffList(list);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load staff list");
    }
  };

  const handleAllocate = async () => {
    if (!staffId) return toast.warn("Select a staff");
    if (!startDate) return toast.warn("Select starting date");
    if (!endDate) return toast.warn("Select end date");

    setLoading(true);
    try {
      const payload = {
        sales_id: client?.sales_id?.id || client?.sales_id || client?.id,
        staff_id: staffId,
        starting_date: startDate,
        ending_date: endDate,
      };

      await addAllocation(payload);
      toast.success("Allocated successfully");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Allocation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[520px] overflow-hidden shadow-xl">
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-pink-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            </div>
            <h3 className="text-lg font-semibold">Allocate Staff</h3>
          </div>
          <button onClick={onClose} className="text-gray-500"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <div>
            <label className="text-sm font-medium block mb-1">Staff</label>
            <select value={staffId} onChange={(e) => setStaffId(e.target.value)} className="w-full border rounded-lg px-3 h-[44px]">
              <option value="">Select staff</option>
              {staffList.map((s) => (
                <option key={s.id} value={s.staff_id || s.id}>
                  {s.staff_name || s.name || `${s.first_name || ""} ${s.last_name || ""}`}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">Starting Date</label>
              <div className="relative">
                <input type="date" className="w-full border rounded-lg px-3 h-[44px]" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Ending Date</label>
              <div className="relative">
                <input type="date" className="w-full border rounded-lg px-3 h-[44px]" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">🧾</div>
            <div>
              {/* <div className="font-medium">{client.sales_id?.client_name || client.sales_id?.client_name}</div> */}
              <div className="font-medium">{client.sales_id?.client_name}</div>
              <div className="text-sm text-gray-500">{client.sales_id?.address}</div>
            </div>
          </div>
        </div>

        <div className="p-5 border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          <button onClick={handleAllocate} disabled={loading} className="px-4 py-2 bg-black text-white rounded">
            {loading ? "Allocating..." : "Allocate"}
          </button>
        </div>
      </div>
    </div>
  );
}
