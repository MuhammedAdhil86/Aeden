"use client";
// components/UpdateDialog.jsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { paymentUpdate, startTripUpdate } from "@/service/fleet";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";

function StartTrip({ open, onClose, data, onUpdate }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);

  //console.log("start trip : ", data);

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const payload = {
        id: data.id,
        truckid: { id: data.truckid?.id || data.truckid },
        driverid: { id: data.driverid?.id || data.driverid },
        filling_km: parseFloat(formData.Starting_km),
        //diesel_amount: parseFloat(formData.diesel_amount),
        diesel_ltr: parseFloat(formData.filling_fuel),
      };

      await startTripUpdate(payload);
      toast.success("Trip started successfully!");
      onUpdate();
      onClose();
    } catch (error) {
      toast.error("Failed to update trip start");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClick = (e) => {
    e.stopPropagation();
  };

  return (
    <Dialog
      open={open}
      onClick={(e) => e.stopPropagation()}
      onOpenChange={onClose}
    >
      <DialogContent
        className="sm:max-w-[600px] bg-white"
        onClick={handleDialogClick}
      >
        <DialogHeader className="text-black">
          <DialogTitle className="pb-5 font-medium text-black border-b flex gap-x-5">
            <img src="/carbon_update-now.svg" className="h-5" />
            <p>Start Trip</p>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="">
          <div className="grid grid-cols-2 gap-7 pb-10 border-neutral-400">
            <div>
              <p className="text-[13px] pb-1 text-black">Starting Km</p>
              <Input
                type="number"
                min="0"
                //max={data.balance}
                {...register("Starting_km", {
                  required: "Starting km is required",
                })}
                className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1"
              />
              {/* <Input
              type="text"
              {...register("driverName", { required: "Driver Name is required" })}
              className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1"
            /> */}
              {errors.Starting_km && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.Starting_km.message}
                </p>
              )}
            </div>

            <div>
              <p className="text-[13px] pb-1 text-black">filling fuel</p>
              <Input
                type="number"
                min="0"
                //max={data.balance}
                {...register("filling_fuel")}
                className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1"
              />
              {/* <Input
              type="text"
              {...register("driverName", { required: "Driver Name is required" })}
              className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1"
            /> */}
              {errors.filling_fuel && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.filling_fuel.message}
                </p>
              )}
            </div>
          </div>

          <div className="w-full flex justify-end">
            {data.Status === "created" || data.Status === "Created" ? (
              <Button type="submit" className="bg-black text-white ">
                Start trip
              </Button>
            ) : (
              <div className="relative group">
                <Button type="submit" 
                disabled 
                className="bg-gray-300 text-white cursor-not-allowed"
                >
                  Start trip
                </Button>
                <div className="absolute -top-10 right-0 bg-black text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Trip allready started
                </div>
              </div>
            )}
          </div>
        </form>
        <ToastContainer position="top-right" autoClose={3000} />
      </DialogContent>
    </Dialog>
  );
}

export default StartTrip;
