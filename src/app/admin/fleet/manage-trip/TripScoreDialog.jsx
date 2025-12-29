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
import { createScore } from "@/service/report";

function TripScoreDialog({ open, onClose, data }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);

  console.log("submit : ", data);

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const payload = {
        trip_id: data.id,
        //truckid: data.truckid ,
        driver_id: data.driverid,
        score: parseFloat(formData.score),
        //diesel_amount: parseFloat(formData.diesel_amount),
        comments: formData.comments,
      };

      await createScore(payload);
      toast.success("Score addeed successfully!");
      onUpdate();
      onClose();
    } catch (error) {
      toast.error("Failed to add scorecard");
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
            <p>Add Scorecard</p>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="">
          <div className="grid grid-cols-1 gap-7 pb-10 border-neutral-400">
            <div className="w-1/2">
              <p className="text-[13px] pb-1 text-black">Score</p>
              <Input
                type="number"
                min="0"
                placeholder="Enter score"
                //max={data.balance}
                {...register("score")}
                className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1"
              />

              {errors.score && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.score.message}
                </p>
              )}
            </div>
            <div>
              <p className="text-[13px] pb-1 text-black">Comments</p>
              <Input
                //type="number"
                //min="0"
                //max={data.balance}
                placeholder="Comments"
                {...register("comments")}
                className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1"
              />

              {errors.comments && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.comments.message}
                </p>
              )}
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

export default TripScoreDialog;
