import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ExpiryDatesTripDialog({
  open,
  onOpenChange,
  register,
  errors,
  onSave,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <img src="/solar_calendar-linear.svg" className="h-5" />
        <DialogHeader>
          <DialogTitle className="pt-5 font-medium text-black border-t">
            Set Expiry Dates
          </DialogTitle>
          <p className="text-[10px] text-neutral-400 pt-1">
            Please provide the expiry dates for the following documents to
            ensure timely updates and renewals
          </p>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-y-10 gap-x-8 py-4">
          <div>
            <p className="text-[13px] pb-1 text-black">
              Travel Insurance Expiry
            </p>
            <div className="relative w-full">
              <Input
                {...register("travelInsuranceExpiry", {
                  required: "Travel Insurance Expiry is required",
                })}
                id="travelInsuranceExpiry"
                type="date"
                className="border-neutral-400 text-black placeholder:text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none pr-10 
                              [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  const input = document.getElementById(
                    "travelInsuranceExpiry"
                  );
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
            {errors.travelInsuranceExpiry && (
              <p className="text-red-500 text-xs mt-1">
                {errors.travelInsuranceExpiry.message}
              </p>
            )}
          </div>
        </div>
        <DialogFooter className="flex gap-x-6 pt-10 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="text-red-500 border-neutral-300"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onSave}
            className="bg-black text-white"
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
