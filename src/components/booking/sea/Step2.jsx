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

export default function Step2({ register, errors, watch, control, setValue }) {
  return (
    <div className="grid grid-cols-3 gap-8">
      <div>
        <p className="text-[13px] ps-5 pb-1 text-black">INCO Terms</p>
        <Input
          {...register("incoTerms")}
          readOnly
          placeholder="incoTerms"
          value={watch("incoTerms") || ""}
          className="border-neutral-400 bg-blue-50 placeholder:text-xs text-xs text-black rounded-lg mt-1 cursor-not-allowed
                  "
        />

        {errors.incoTerms && (
          <p className="text-red-500 text-xs mt-1">
            {errors.incoTerms.message}
          </p>
        )}
      </div>
      <div>
        <p className="text-[13px] ps-5 pb-1 text-black">Mode</p>
        <Input
          {...register("mode")}
          readOnly
          placeholder="mode"
          value={watch("mode") || ""}
          className="border-neutral-400 bg-blue-50 placeholder:text-xs text-xs text-black rounded-lg mt-1 cursor-not-allowed
                  "
        />

        {errors.mode && (
          <p className="text-red-500 text-xs mt-1">{errors.mode.message}</p>
        )}
      </div>
      <div>
        <p className="text-[13px] ps-5 pb-1 text-black">Other mode</p>
        <Input
          {...register("otherMode")}
          readOnly
          value={watch("mode") || ""}
          placeholder="Enter name"
          className="border-neutral-400 bg-blue-50 placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 cursor-not-allowed"
        />
        {errors.otherMode && (
          <p className="text-red-500 text-xs mt-1">
            {errors.otherMode.message}
          </p>
        )}
      </div>
    </div>
  );
}
