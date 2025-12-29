"use client";

import React from "react";
import { Input } from "@/components/ui/input";

function InsuranceDetails({ register }) {
  return (
    <div className="grid grid-cols-4 gap-x-5 gap-y-5 mt-5">
      <div>
        <p className="text-[13px] ps-5 text-black">Policy No</p>
        <Input
          {...register("policyNo")}
          placeholder="Enter number"
          required
          className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      <div>
        <p className="text-[13px] ps-5 text-black">Premium amount (INR)</p>
        <Input
          {...register("premium")}
          type="number"
          placeholder="Enter amount"
          required
          className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      <div>
        <p className="text-[13px] ps-5 text-black">Invoice Date</p>
        <div className="relative w-full">
          <Input
            {...register("invoiceDate")}
            id="invoiceDate"
            type="date"
            required
            className="border-neutral-400 text-black placeholder:text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none pr-10 
                                [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none"
          />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              const invoiceDate = document.getElementById("invoiceDate");
              if (invoiceDate) {
                invoiceDate.showPicker();
              }
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
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

      <div>
        <p className="text-[13px] ps-5 text-black">Owner Name</p>
        <Input
          {...register("ownerName")}
          placeholder="Enter name"
          required
          className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      <div>
        <p className="text-[13px] ps-5 text-black">Invoice Number</p>
        <Input
          {...register("inVoiceNumber")}
          placeholder="Enter number"
          required
          className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
    </div>
  );
}

export default InsuranceDetails;
