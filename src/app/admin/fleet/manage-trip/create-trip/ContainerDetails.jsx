"use client";

import React from "react";
import { Input } from "@/components/ui/input";

function ContainerDetails({ register }) { 
  return (
    <div className="grid grid-cols-4 gap-x-5 gap-y-5 mt-5">
      <div>
        <p className="text-[13px] ps-5 text-black">Container Number</p>
        <Input
          {...register("containerNumber")}
          placeholder="Enter number"
          required
          className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      <div>
        <p className="text-[13px] ps-5 pb-1 text-black">Do Valid</p>
        <div className="relative w-full">
          <Input
            {...register("doValid")}
            id="doValid"
            type="date"
            required
            className="border-neutral-400 text-black placeholder:text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none pr-10 
                          [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none"
          />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              const doValid = document.getElementById("doValid");
              if (doValid) {
                doValid.showPicker();
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
        <p className="text-[13px] ps-5 pb-1 text-black">Godown In</p>
        <div className="relative w-full">
          <Input
            {...register("godownIn")}
            id="godownIn"
            type="date"
            required
            className="border-neutral-400 text-black placeholder:text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none pr-10 
                          [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none"
          />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              const godownIn = document.getElementById("godownIn");
              if (godownIn) {
                godownIn.showPicker();
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
        <p className="text-[13px] ps-5 text-black">Number of days</p>
        <Input
          {...register("noDays")}
          placeholder="Enter days"
          required
          className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
    </div>
  );
}

export default ContainerDetails;
