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
import { createAccident } from "@/service/report";

function AccidentDialog({ id, isOpen, onClose }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

    const [loading, setLoading] = useState(false);
  

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const payload = {
        driver_id: id,
        description: formData.description,
        location: formData.Location,
        severity: formData.severity,
        //diesel_amount: parseFloat(formData.diesel_amount),
        occurred_at: new Date(formData.occurred_at).toISOString(),
      };

      await createAccident(payload);
      toast.success("accident created successfully!");
      onClose();
       reset();
    } catch (error) {
      toast.error("Failed to submit add accident");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      //onClick={(e) => e.stopPropagation()}
      onOpenChange={onClose}
    >
      <DialogContent
        className="sm:max-w-[600px] bg-white"
        //onClick={handleDialogClick}
      >
        <DialogHeader className="text-black">
          <DialogTitle className="pb-5 font-medium text-black border-b flex gap-x-5">
            <img src="/carbon_update-now.svg" className="h-5" />
            <p>Add Accident</p>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="">
          <div className="grid grid-cols-1 gap-7 pb-10 border-neutral-400">
            <div>
              <p className="text-[13px] pb-1 text-black">Description</p>
              <Input
                placeholder="description"
                {...register("description")}
                className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1"
              />

              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="w-full grid grid-cols-2 gap-7">
              <div>
                <p className="text-[13px] pb-1 text-black">Location</p>
                <Input
                  placeholder="enter Location"
                  {...register("Location")}
                  className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1"
                />

                {errors.Location && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.Location.message}
                  </p>
                )}
              </div>

              <div>
                <p className="text-[13px] pb-1 text-black">severity</p>
                <Input
                  placeholder="enter severity"
                  {...register("severity")}
                  className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1"
                />

                {errors.severity && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.severity.message}
                  </p>
                )}
              </div>

              <div>
                <p className="text-[13px] pb-1 text-black">occurred at</p>
                <div className="relative w-full">
                  <Input
                    {...register("occurred_at")}
                    id="occurred_at"
                    type="date"
                    required
                    className="border-neutral-400 text-black placeholder:text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none pr-10 
                    [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      const occurred_at =
                        document.getElementById("occurred_at");
                      if (occurred_at) {
                        occurred_at.showPicker();
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
            </div>
          </div>
          <div className="w-full flex justify-end">
            <Button type="submit" className="bg-black text-white ">
              Submit
            </Button>
          </div>

          {/* <div className="w-full flex justify-end">
                  {data.Status === "created" || data.Status === "Created" ? (
                    <Button type="submit" className="bg-black text-white ">
                      Submit
                    </Button>
                  ) : (
                    <div className="relative group">
                      <Button type="submit" 
                      disabled 
                      className="bg-gray-300 text-white cursor-not-allowed"
                      >
                        Submit
                      </Button>
                      <div className="absolute -top-10 right-0 bg-black text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Trip allready started
                      </div>
                    </div>
                  )}
                </div> */}
        </form>
        <ToastContainer position="top-right" autoClose={3000} />
      </DialogContent>
    </Dialog>
  );
}

export default AccidentDialog;
