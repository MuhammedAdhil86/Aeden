"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

export default function Step4({ register, errors }) {
  return (
    <div className="grid grid-cols-3 gap-8">
      <div>
        <p className="text-[13px] ps-5 pb-1 text-black">Notify party 1(Optional)</p>
        <Input
          {...register("notify1", {
            // required: "party Name is required",
          })}
          placeholder="Enter party name"
          className="border-neutral-400 placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        {errors.notify1 && (
          <p className="text-red-500 text-xs mt-1">
            {errors.notify1.message}
          </p>
        )}
      </div>
      <div>
        <p className="text-[13px] ps-5 pb-1 text-black">Notify party 2(Optional)</p>
        <Input
          {...register("notify2", {
            // required: "party Name is required",
          })}
          placeholder="Enter party name"
          className="border-neutral-400 placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        {errors.notify2 && (
          <p className="text-red-500 text-xs mt-1">
            {errors.notify2.message}
          </p>
        )}
      </div>
      <div>
        <p className="text-[13px] ps-5 pb-1 text-black">Notify party 3(Optional)</p>
        <Input
          {...register("notify3", {
            // required: "party Name is required",
          })}
          placeholder="Enter party name"
          className="border-neutral-400 placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        {errors.notify3 && (
          <p className="text-red-500 text-xs mt-1">
            {errors.notify3.message}
          </p>
        )}
      </div>
    </div>
  );
}
