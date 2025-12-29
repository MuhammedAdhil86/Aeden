"use client";
import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";

export default function Step5({ register, errors, watch, control, setValue }) {
  const isYes = watch("is_transhipment");

  useEffect(() => {
    setValue("is_transhipment_string", isYes ? "Yes" : "No");
  }, [isYes, setValue]);

  return (
    <div className="grid grid-cols-4 gap-8">
      <div>
        <p className="text-[13px] ps-5 pb-1 text-black">CNT Number</p>
        <Input
          {...register("CNTNumber")}
          // , { required: "CNT Number is required" }
          type="number"
          placeholder="Enter CNT number"
          className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        {errors.CNTNumber && (
          <p className="text-red-500 text-xs mt-1">
            {errors.CNTNumber.message}
          </p>
        )}
      </div>
      <div>
        <p className="text-[13px] ps-5 pb-1 text-black">Shipping Line</p>
        <Input
          {...register("shippingLine")}
          // , { required: "shipping Line is required" }
          placeholder="Enter Shipping Line"
          className="border-neutral-400 placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        {errors.shippingLine && (
          <p className="text-red-500 text-xs mt-1">
            {errors.shippingLine.message}
          </p>
        )}
      </div>
      <div>
        <p className="text-[13px] ps-5 pb-1 text-black">Vessel name</p>
        <Input
          {...register("vesselName")}
          // , { required: "Vessel name is required" }
          placeholder="Enter Vessel name"
          className="border-neutral-400 placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        {errors.vesselName && (
          <p className="text-red-500 text-xs mt-1">
            {errors.vesselName.message}
          </p>
        )}
      </div>
      <div>
        <p className="text-[13px] ps-5 pb-1 text-black">Vessel voyage number</p>
        <Input
          {...register("vesselNumber", {
            // required: "Vessel voyage number is required",
          })}
          placeholder="Enter number"
          className="border-neutral-400 placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        {errors.vesselNumber && (
          <p className="text-red-500 text-xs mt-1">
            {errors.vesselNumber.message}
          </p>
        )}
      </div>

      <div className="w-full flex flex-col">
        <p className="text-[13px] ps-5 pb-1 text-black">Tran shipment</p>
        <label
          className="switch w-full rounded-md flex items-center cursor-pointer border p-0.5"
          aria-label="Toggle Filter"
        >
          <input
            type="checkbox"
            id="is_transhipment"
            {...register("is_transhipment")}
            className="hidden"
          />
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
          Tran shipment port
        </p>
        <Input
          {...register("transhipmentPort"
          //   , {
          //   required: "Tran shipment port is required",
          // }
        )}
          placeholder="Enter T/S-Port"
          disabled={!isYes}
          className={`border-neutral-400 placeholder:text-xs text-xs rounded-lg mt-1 
    focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 
    ${!isYes ? "!text-black bg-gray-100" : ""}`}
        />

        {errors.transhipmentPort && (
          <p className="text-red-500 text-xs mt-1">
            {errors.transhipmentPort.message}
          </p>
        )}
      </div>
      <div>
      <p
          className={`text-[13px] ps-5 pb-1 ${
            !isYes ? "text-neutral-400" : "text-black"
          } `}
        >          
        Feeder vessel name</p>
        <Input
          {...register("feederVesselName"
          //   , {
          //   required: "Feeder vessel name is required",
          // }
        )}
          disabled={!isYes}   
          placeholder="Enter name"
          className={`border-neutral-400 placeholder:text-xs text-xs rounded-lg mt-1 
            focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 
            ${!isYes ? "!text-black bg-gray-100" : ""}`}
                        />
        {errors.feederVesselName && (
          <p className="text-red-500 text-xs mt-1">
            {errors.feederVesselName.message}
          </p>
        )}
      </div>
    </div>
  );
}