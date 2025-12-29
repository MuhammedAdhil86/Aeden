"use client";

import React from "react";
import { Input } from "@/components/ui/input";

function OtherDetailsThirdParty({ register, watch }) {
  const isAdvanceChecked = watch("advanceReceived");

  return (
    <div className="grid grid-cols-4 gap-x-5 gap-y-5 mt-5">
      <div>
        <p className="text-[13px] ps-5 text-black">Quantity</p>
        <Input
          {...register("quantity")}
          type="number"
          placeholder="Enter Quantity"
          required
          className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      <div>
        <p className="text-[13px] ps-5 text-black">Commodity</p>
        <Input
          {...register("commodity")}
          placeholder="Enter Commodity"
          required
          className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      <div>
        <p className="text-[13px] ps-5 text-black">Client</p>
        <Input
          {...register("client")}
          placeholder="Enter Client"
          required
          className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      <div>
        <p className="text-[13px] ps-5 text-black">Commission (INR)</p>
        <Input
          {...register("commission")}
          type="number"
          placeholder="Enter Number"
          required
          className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      <div>
        <p className="text-[13px] ps-5 text-black">Committed Rate (INR)</p>
        <Input
          {...register("committedRate")}
          type="number"
          placeholder="Enter Committed Rate"
          required
          className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      <div>
        <div className="flex items-center gap-x-3 ps-5">
          <input
            type="checkbox"
            id="advanceCheckbox"
            {...register("advanceReceived")}
            className="w-4 h-4 rounded-md accent-black border-gray-300 cursor-pointer"
          />
          <label
            htmlFor="advanceCheckbox"
            className="text-[13px] text-black cursor-pointer"
          >
            Advance Paid Amount (INR)
          </label>
        </div>
        <Input
          {...register("receivedAmount")}
          type="number"
          placeholder="Enter amount"
          required={isAdvanceChecked}
          disabled={!isAdvanceChecked}
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
          Advance Piad Amount date
        </p>
        <div className="relative w-full">
          <Input
            {...register("amountdate")}
            id="amountdate"
            type="date"
            required={isAdvanceChecked}
            disabled={!isAdvanceChecked}
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
              const amountdate = document.getElementById("amountdate");
              if (amountdate && isAdvanceChecked) {
                amountdate.showPicker();
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

      <div>
        <p
          className={`text-[13px] ps-5 ${
            isAdvanceChecked ? "text-black" : "text-neutral-400"
          }`}
        >
          Balance Amount (INR)
        </p>
        <Input
          {...register("balanceAmount")}
          type="number"
          placeholder="Enter amount"
          required={isAdvanceChecked}
          disabled={!isAdvanceChecked}
          className={`border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 ${
            !isAdvanceChecked ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
        />
      </div>
    </div>
  );
}

export default OtherDetailsThirdParty;
