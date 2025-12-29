"use client";

import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";

function OtherLoad({ register, watch, setValue, trip }) {
  const isAdvanceChecked = watch("is_advance_paid");
  const advance_received_date = watch("advance_received_date");

  const formatToYYYYMMDD = (dateStr) => {
    if (!dateStr || dateStr === "0001-01-01T00:00:00Z") return "";
    if (dateStr.includes("/")) {
      const [day, month, year] = dateStr.split("/");
      return `${year}-${month}-${day}`;
    }
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    setValue("is_advance_paid", trip.is_advance_paid === true);
  }, [setValue, trip.is_advance_paid]);

  return (
    <div className="grid grid-cols-4 gap-x-5 gap-y-5 mt-5">
      <div>
        <p className="text-[13px] ps-5 text-black">Branch</p>
        <Input
          {...register("branch")}
          placeholder="Enter branch"
          required
          className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      <div>
        <p className="text-[13px] ps-5 text-black">Customer Name</p>
        <Input
          {...register("customer_name")}
          placeholder="Enter name"
          required
          className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      <div>
        <p className="text-[13px] ps-5 text-black">Freight charge (INR)</p>
        <Input
          {...register("freight")}
          type="number"
          placeholder="Enter Number"
          required
          className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      <div>
        <p className="text-[13px] ps-5 text-black">Commission</p>
        <Input
          {...register("commission")}
          type="number"
          placeholder="Enter Number"
          required
          className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      <div>
        <p className="text-[13px] ps-5 text-black">Halting</p>
        <Input
          {...register("halting")}
          value={watch("halting")}
          placeholder="Enter name"
          required
          className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      <div>
        <div className="flex items-center gap-x-3 ps-5">
          <input
            type="checkbox"
            id="advanceCheckbox"
            {...register("is_advance_paid")}
            disabled={trip.is_advance_paid === true}
            className="w-4 h-4 rounded-md accent-black border-gray-300 cursor-pointer"
          />
          <label
            htmlFor="advanceCheckbox"
            className="text-[13px] text-black cursor-pointer"
          >
            Advance Received Amount (INR)
          </label>
        </div>
        <Input
          {...register("advance_received")}
          type="number"
          placeholder="Enter amount"
          required={isAdvanceChecked}
           disabled={trip.is_advance_paid === true}
          className={`border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 ${
            !isAdvanceChecked ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
        />
      </div>

      <div>
        <p
          className={`text-[13px] ps-5 ${
            isAdvanceChecked ? "text-black" : "text-neutral-400"
          }`}
        >
          Advance Received Amount date
        </p>
        <div className="relative w-full">
          <Input
            {...register("advance_received_date")}
            id="advance_received_date"
            type="date"
            required={isAdvanceChecked}
             disabled={trip.is_advance_paid === true}
            value={formatToYYYYMMDD(advance_received_date) || ""}
            onChange={(e) => {
              const date = e.target.value;
              if (date) {
                const [year, month, day] = date.split("-");
                setValue("advance_received_date", `${day}/${month}/${year}`);
              } else {
                setValue("advance_received_date", "");
              }
            }}
            className={`border-neutral-400 text-black placeholder:text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none pr-10
              [&::-webkit-calendar-picker-indicator]:opacity-0 
              [&::-webkit-calendar-picker-indicator]:pointer-events-none ${
                !isAdvanceChecked ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
          />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              const advance_received_date = document.getElementById(
                "advance_received_date"
              );
              if (advance_received_date && isAdvanceChecked) {
                advance_received_date.showPicker();
              }
            }}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
              isAdvanceChecked
                ? "text-gray-500"
                : "text-gray-300 cursor-not-allowed"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-calendar-days"
            >
              <path d="M8 2v4" />
              <path d="M16 2v4" />
              <rect width="18" height="18" x="3" y="4" rx="2" />
              <path d="M3 10h18" />
              <path d="M8 14h.01" />
              <path d="M12 14h.01" />
              <path d="M16 14h.01" />
              <path d="M8 18h.01" />
              <path d="M12 18h.01" />
              <path d="M16 18h.01" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default OtherLoad;
