"use client";

import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";

function EditContainerDetails({ register, watch, setValue }) {
  const containerNumber = watch("container_number");
  const number_of_days = watch("number_of_days");
  const godown_in = watch("godown_in");
  const do_validate = watch("do_validate");

  useEffect(() => {
    if (containerNumber === null || containerNumber === "null") {
      setValue("container_number", "");
    }
    if (number_of_days === null || number_of_days === "null") {
      setValue("number_of_days", "");
    }
  }, [containerNumber, setValue]);

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

  return (
    <div className="grid grid-cols-4 gap-x-5 gap-y-5 mt-5">
      <div>
        <p className="text-[13px] ps-5 text-black">Container Number</p>
        <Input
          {...register("container_number")}
          placeholder="Enter number"
          required
          className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      <div>
        <p className="text-[13px] ps-5 pb-1 text-black">Do Valid</p>
        <div className="relative w-full">
          <Input
            {...register("do_validate")}
            id="do_validate"
            type="date"
            required
            value={formatToYYYYMMDD(do_validate) || ""}
            onChange={(e) => {
              const date = e.target.value;
              if (date) {
                const [year, month, day] = date.split("-");
                setValue("do_validate", `${day}/${month}/${year}`);
              } else {
                setValue("do_validate", "");
              }
            }}
            className="border-neutral-400 text-black placeholder:text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none pr-10 
                           [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none"
          />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              const do_validate = document.getElementById("do_validate");
              if (do_validate) {
                do_validate.showPicker();
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
            {...register("godown_in")}
            id="godown_in"
            type="date"
            required
            value={formatToYYYYMMDD(godown_in) || ""}
            onChange={(e) => {
              const date = e.target.value;
              if (date) {
                const [year, month, day] = date.split("-");
                setValue("godown_in", `${day}/${month}/${year}`);
              } else {
                setValue("godown_in", "");
              }
            }}
            className="border-neutral-400 text-black placeholder:text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none pr-10 
                           [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none"
          />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              const godown_in = document.getElementById("godown_in");
              if (godown_in) {
                godown_in.showPicker();
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
          {...register("number_of_days")}
          placeholder="Enter days"
          required
          className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
    </div>
  );
}

export default EditContainerDetails;
