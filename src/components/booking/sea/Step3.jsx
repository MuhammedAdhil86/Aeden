"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Step3({ register, errors, watch, control, setValue }) {
  const isYes = watch("insurance");
  const [file, setFile] = useState(null);
  useEffect(() => {
    setValue("has_insurance_string", isYes ? "Yes" : "No");
  }, [isYes, setValue]);

  const handleFileChange = (event) => {
    const selectedTravelFile = event.target.files[0];
    if (selectedTravelFile) {
      setFile(selectedTravelFile);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8">
      <div className="grid grid-cols-4 gap-8 pb-8 border-b">
        <div className="w-full flex flex-col">
          <p className="text-[13px] ps-5 pb-1 text-black">Has Insurance</p>
          <label
            className="switch w-full rounded-md flex items-center cursor-pointer border p-0.5"
            aria-label="Toggle Filter"
          >
            <input
              type="checkbox"
              id="insurance"
              {...register("insurance")}
              className="hidden"
            />
            <input type="hidden" {...register("insuranceString")} />
            <p
              className={`flex justify-center w-28 rounded-md py-2 text-xs ${
                isYes ? "bg-black text-white" : "text-gray-500"
              }`}
            >
              Yes
            </p>
            <p
              className={`flex justify-center w-28 rounded-md text-xs py-2 ${
                !isYes ? "bg-black text-white" : "text-gray-500"
              }`}
            >
              No
            </p>
          </label>
        </div>
        <div>
          <p
            className={`text-[13px] ps-5 pb-1 ${
              !isYes ? "text-neutral-400" : "text-black"
            } `}
          >
            Premium amount
          </p>
          <Input
            {...register("premiumAmount")}
            placeholder="Enter Premium amount"
            disabled={!isYes}
            className={`border-neutral-400 placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 ${!isYes ? "!text-black bg-gray-100" : ""}`}
          />
          {errors.premiumAmount && (
            <p className="text-red-500 text-xs mt-1">
              {errors.premiumAmount.message}
            </p>
          )}
        </div>
        <div>
          <p
            className={`text-[13px] ps-5 pb-1 ${
              !isYes ? "text-neutral-400" : "text-black"
            } `}
          >
            Start Date
          </p>
          <div className="relative w-full">
            <Input
              {...register("insuranceStartDate")}
              type="date"
              disabled={!isYes}
              id="insuranceStartDateInput"
              className={`border-neutral-400 text-black placeholder:text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none pr-10
    [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none ${!isYes ? "!text-black bg-gray-100" : ""}`}
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                const insuranceStartDateInput = document.getElementById(
                  "insuranceStartDateInput"
                );
                if (insuranceStartDateInput) {
                  insuranceStartDateInput.showPicker();
                }
              }}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                isYes ? "text-gray-500" : "text-gray-400 bg-gray-100"
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
          {errors.insuranceStartDate && (
            <p className="text-red-500 text-xs mt-1">
              {errors.insuranceStartDate.message}
            </p>
          )}
        </div>
        <div>
          <p
            className={`text-[13px] ps-5 pb-1 ${
              !isYes ? "text-neutral-400" : "text-black"
            } `}
          >
            End Date
          </p>
          <div className="relative w-full">
            <Input
              {...register("insuranceEndDate")}
              type="date"
              disabled={!isYes}
              id="insuranceEndDateInput"
              className={`border-neutral-400 text-black placeholder:text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none pr-10
      [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none  ${!isYes ? "!text-black bg-gray-100" : ""}`}
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                const insuranceEndDateInput = document.getElementById(
                  "insuranceEndDateInput"
                );
                if (insuranceEndDateInput) {
                  insuranceEndDateInput.showPicker();
                }
              }}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                isYes ? "text-gray-500" : "text-gray-400"
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

          {errors.insuranceEndDate && (
            <p className="text-red-500 text-xs mt-1">
              {errors.insuranceEndDate.message}
            </p>
          )}
        </div>
        <div>
          <p
            className={`text-[13px] ps-5 pb-1 ${
              !isYes ? "text-neutral-400" : "text-black"
            } `}
          >
            Insurance Number
          </p>
          <Input
            {...register("insuranceNumber")}
            placeholder="Enter Insurance Number"
            disabled={!isYes}
            className={`border-neutral-400 placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0  ${!isYes ? "!text-black bg-gray-100" : ""}`}
          />
          {errors.insuranceNumber && (
            <p className="text-red-500 text-xs mt-1">
              {errors.insuranceNumber.message}
            </p>
          )}
        </div>
      </div>
      <div>
        <p
          className={`text-[13px] ps-5 pb-1 font-medium ${
            !isYes ? "text-neutral-400" : "text-black"
          } `}
        >
          {" "}
          Upload Document{" "}
        </p>
        <div className="relative flex gap-x-5 border border-dashed rounded-md py-1">
          <div className="bg-red-500 w-1 rounded-l-md"></div>{" "}
          <input
            {...register("insuranceFile")}
            type="file"
            onChange={handleFileChange}
            disabled={!isYes}
            className="absolute bottom-2 left-[23px] opacity-0 w-36 h-8 cursor-pointer"
          />
          <div>
            <p
              className={`text-[13px] ps-5 pb-1 ${
                !isYes ? "text-neutral-400" : "text-black"
              } `}
            >
              {" "}
              File upload
            </p>
            <div className="flex gap-x-2 py-1">
              <button
                type="button"
                className={`flex items-center gap-x-2 px-5 border text-xs py-[6px] rounded-lg 
        ${
          isYes
            ? "bg-black text-white "
            : "bg-transparent text-gray-200 border-gray-400"
        }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20px"
                  viewBox="0 -960 960 960"
                  width="20px"
                  className={`${isYes ? "fill-white " : "fill-gray-400"}`}
                >
                  <path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H520q-33 0-56.5-23.5T440-240v-206l-64 62-56-56 160-160 160 160-56 56-64-62v206h220q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41h100v80H260Zm220-280Z" />
                </svg>
                Browse file
              </button>

              {file && (
                <div className="flex items-center gap-2 border rounded-md px-2 py-1">
                  <p className="text-xs text-gray-700">{file.name}</p>
                  <button
                    type="button"
                    className="text-black hover:text-red-700"
                    onClick={() => setFile(null)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="20px"
                      viewBox="0 -960 960 960"
                      width="20px"
                      fill="#000"
                    >
                      <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
