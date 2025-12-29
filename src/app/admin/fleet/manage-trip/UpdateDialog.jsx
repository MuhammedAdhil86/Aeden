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
import { paymentUpdate } from "@/service/fleet";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";

const UpdateDialog = ({ open, onClose, data, onUpdate }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  //console.log("UpdateDialog data : ",data)

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      reset({
        driverName: data.driver_name || "",
        vehicleModel: data.vehicleModel || "",
      });
    }
  }, [data, reset]);

  const onSubmit = async (payload) => {
    try {
      setLoading(true);
      console.log("Submitted values:", payload);
      const datas = {
        id: Number(data.id),
        truckid: { id: Number(data.truckid) },
        driverid: { id: Number(data.driverid) },
        //road_expense: Number(payload.RTOExpense),
        balance_received: Number(payload.balanceReceivedAmount),
        //other_expense: Number(payload.otherExpense),
        //unloading_charge_expense: Number(payload.unLoadingCharge),
        unloading_date: payload.BRDate
          ? new Date(payload.BRDate).toISOString()
          : null,
      };
      const res = await paymentUpdate(datas);
      console.log("Submitted values:", res);
      toast.success("Payment amount update successfully!");
      onClose();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!open || !data) return null;

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
            <p>Payment Updates</p>
          </DialogTitle>
        </DialogHeader>
        <div className="flex gap-x-10 py-7">
          <div>
            <p className="text-sm text-neutral-400">Advance Amount</p>
            <p className="text-black font-semibold">
              ₹ {data.advance_received}
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-400">Balance Amount</p>
            <p className="text-black font-semibold">₹ {data.balance_payable}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="">
          <div className="grid grid-cols-2 gap-7 border-neutral-400">
            <div>
              <p className="text-[13px] pb-1 text-black">Balance Received</p>
              <Input
                type="number"
                min="0"
                //max={data.balance}
                {...register("balanceReceivedAmount", {
                  required: "balance Received Amount is required",
                })}
                className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1"
              />
              {/* <Input
              type="text"
              {...register("driverName", { required: "Driver Name is required" })}
              className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1"
            /> */}
              {errors.balanceReceivedAmount && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.balanceReceivedAmount.message}
                </p>
              )}
            </div>
            <div>
              <p className="text-[13px] pb-1 text-black">
                Balance Received Date
              </p>
              <div className="relative w-full">
                <Input
                  {...register("BRDate")}
                  id="BRDate"
                  type="date"
                  className="border-neutral-400 text-black placeholder:text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none pr-10 
                                            [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    const input = document.getElementById("BRDate");
                    if (input) {
                      input.showPicker();
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
              {errors.BRDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.BRDate.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-7 pt-10">
            {/* <div>
              <p className="text-[13px] pb-1 text-black">
                Unloading Charge Expense
              </p>
              <Input
                type="number"
                min="0"
                {...register("unLoadingCharge")}
                className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1"
              />
              {errors.unLoadingCharge && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.unLoadingCharge.message}
                </p>
              )}
            </div>

            <div>
              <p className="text-[13px] pb-1 text-black">RTO Expense</p>
              <Input
                type="number"
                min="0"
                //max={data.balance}
                {...register("RTOExpense")}
                className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1"
              />
              {errors.RTOExpense && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.RTOExpense.message}
                </p>
              )}
            </div> */}

            {/* <div>
              <p className="text-[13px] pb-1 text-black">Other Expense</p>
              <Input
                type="number"
                min="0"
                {...register("otherExpense")}
                className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1"
              />
              {errors.otherExpense && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.otherExpense.message}
                </p>
              )}
            </div> */}
          </div>

          <div className="flex justify-end mt-4 space-x-2 col-span-2">
            {data.status !== "Created" ? (
              data.balance_payable > 0 ? (
                <Button
                  type="submit"
                  className="bg-black text-white"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update"}
                </Button>
              ) : (
                <div className="relative group">
                  <Button
                    type="button"
                    className="bg-gray-300 text-white cursor-not-allowed"
                    disabled
                  >
                    Update
                  </Button>
                  <div className="absolute -top-10 right-0 bg-black text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  No pending due
                  </div>
                </div>
              )
            ) : (
              <div className="relative group">
                <Button
                  type="button"
                  className="bg-gray-300 text-white cursor-not-allowed"
                  disabled
                >
                  Update
                </Button>
                <div className="absolute -top-10 right-0 bg-black text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Trip is not started
                </div>
              </div>
            )}
          </div>
        </form>
        <ToastContainer position="top-right" autoClose={3000} />
      </DialogContent>
    </Dialog>
  );
};

export default UpdateDialog;
