"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";

export default function Step6({ register, errors, watch, control, setValue }) {
  return (
    <div className="grid grid-cols-4 gap-8">
      <div>
        <p className="text-[13px] ps-5 pb-1 text-black">
          POL (Port of loading)
        </p>
        <Input
          {...register("pol")}
          readOnly
          value={watch("pol") || ""}
          placeholder="pol"
          className="border-neutral-400 bg-blue-50 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 cursor-not-allowed"
        />
        {errors.pol && (
          <p className="text-red-500 text-xs mt-1">{errors.pol.message}</p>
        )}
      </div>
      <div>
        <p className="text-[13px] ps-5 pb-1 text-black">
          POD (Port of discharge)
        </p>
        <Input
          {...register("pod")}
          readOnly
          value={watch("pod") || ""}
          placeholder="Enter POD"
          className="border-neutral-400 bg-blue-50 placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 cursor-not-allowed"
        />
        {errors.pod && (
          <p className="text-red-500 text-xs mt-1">{errors.pod.message}</p>
        )}
      </div>
      <div>
        <p className="text-[13px] ps-5 pb-1 text-black">
          FPOL (First point of loading)
        </p>
        <Input
          {...register("fpol", {
            // required: "FPOL is required",
          })}
          placeholder="Enter FPOL"
          className="border-neutral-400 placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        {errors.fpol && (
          <p className="text-red-500 text-xs mt-1">{errors.fpol.message}</p>
        )}
      </div>
      <div>
        <p className="text-[13px] ps-5 pb-1 text-black">
          FPOD (Final point of destination)
        </p>
        <Input
          {...register("fpod", {
            // required: "FPOD is required",
          })}
          placeholder="Enter FPOD"
          className="border-neutral-400 placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        {errors.fpod && (
          <p className="text-red-500 text-xs mt-1">{errors.fpod.message}</p>
        )}
      </div>
    </div>
  );
}
