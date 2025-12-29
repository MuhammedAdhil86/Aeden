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
import {
  createAccident,
  createExcalation,
  createIssue,
  fetchIssueById,
} from "@/service/report";

function EscalationDialog({ id, isOpen, onClose }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [issues, setIssues] = useState([]);
  const [loadingIssues, setLoadingIssues] = useState(false);
  const [loading, setLoading] = useState(false);

  //console.log("submit : ", data);

  useEffect(() => {
    if (isOpen && id) {
      const fetchIssues = async () => {
        setLoadingIssues(true);
        try {
          const data = await fetchIssueById(id);
          console.log("dropdown : ", data);
          setIssues(Array.isArray(data) ? data : data && typeof data === "object" ? [data] : []);
        } catch (error) {
          toast.error("Failed to fetch issues");
          console.error("Error fetching issues:", error);
          setIssues([]);
        } finally {
          setLoadingIssues(false);
        }
      };
      fetchIssues();
    }
  }, [isOpen, id]);

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const payload = {
        driver_id: id,
        issue_id: formData.issue_id,
        reason: formData.Reason,
        //diesel_amount: parseFloat(formData.diesel_amount),
        escalated_at: new Date(formData.escalated_at).toISOString(),
      };

      await createExcalation(payload);
      toast.success("Escalation created successfully!");
      onClose();
      reset();
    } catch (error) {
      toast.error("Failed to submit Escalation");
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
            <p>Add Escalation</p>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="">
          <div className="grid grid-cols-1 gap-7 pb-10 border-neutral-400">
            <div>
              <p className="text-[13px] pb-1 text-black">Reason</p>
              <Input
                placeholder="enter reason"
                {...register("Reason")}
                className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1"
              />

              {errors.Reason && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.Reason.message}
                </p>
              )}
            </div>
            <div className="w-full grid grid-cols-2 gap-7">
              <div>
                <p className="text-[13px] pb-1 text-black">Issue</p>
                <select
                  {...register("issue_id", { valueAsNumber: true })}
                  className="w-full p-2 border border-neutral-400 text-black text-xs rounded-lg mt-1 focus:ring-0"
                  disabled={loadingIssues}
                >
                  <option value="" disabled>
                    {loadingIssues ? "Loading issues..." : "Select an issue"}
                  </option>
                  {issues.map((issue) => (
                    <option key={issue.id} value={issue.id}>
                      {issue.description || `Issue ${issue.id}`}
                    </option>
                  ))}
                </select>
                {errors.issue_id && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.issue_id.message}
                  </p>
                )}
              </div>

              <div>
                <p className="text-[13px] pb-1 text-black">occurred at</p>
                <div className="relative w-full">
                  <Input
                    {...register("escalated_at")}
                    id="escalated_at"
                    type="date"
                    required
                    className="border-neutral-400 text-black placeholder:text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none pr-10 
                           [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      const escalated_at =
                        document.getElementById("escalated_at");
                      if (escalated_at) {
                        escalated_at.showPicker();
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
        </form>
        <ToastContainer position="top-right" autoClose={3000} />
      </DialogContent>
    </Dialog>
  );
}

export default EscalationDialog;
