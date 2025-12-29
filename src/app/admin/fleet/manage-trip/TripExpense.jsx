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
import { useForm, useFieldArray } from "react-hook-form";
import { paymentUpdate, startTripUpdate } from "@/service/fleet";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";

function TripExpense({ open, onClose, data, onUpdate }) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { other_expense: [{ reason: "", amount: "" }] },
  });

  const [loading, setLoading] = useState(false);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "other_expense",
  });

  //console.log("data : ", data);

  const onSubmit = async (formData) => {
    setLoading(true);
    console.log("formData : ", formData);
    try {
      const payload = {
        id: data.id,
        truckid: { id: data.truckid?.id || data.truckid },
        driverid: { id: data.driverid?.id || data.driverid },
        filling_km: parseFloat(formData.Starting_km),
        diesel_amount: parseFloat(formData.diesel_amount),
        diesel_ltr: parseFloat(formData.filling_fuel),
        greasing_air_check: formData.greasing_air_checking
          ? parseFloat(formData.greasing_air_checking)
          : 0,
        adblue: formData.adblue ? parseFloat(formData.adblue) : 0,
        gate_pass: formData.gate_pass ? parseFloat(formData.gate_pass) : 0,
        rto_expense: formData.rto_expense
          ? parseFloat(formData.rto_expense)
          : 0,
        road_expense: formData.road_expense
          ? parseFloat(formData.road_expense)
          : 0,
        other_expense: Array.isArray(formData.other_expense)
          ? formData.other_expense.map((item) => ({
              reason: item.reason,
              amount: item.amount ? parseFloat(item.amount) : 0,
            }))
          : [],
      };

      await paymentUpdate(payload);
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
            <p>Trip expense</p>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="">
          <div className="grid grid-cols-2 gap-7 pb-10 border-neutral-400">
            {data.self_type === "own-load" && (
              <>
                <div>
                  <p className="text-[13px] pb-1 text-black">Fuel(ltr)</p>
                  <Input
                    type="number"
                    min="0"
                    {...register("diesel_ltr", {
                      required: "This field is required",
                    })}
                    className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1"
                  />
                  {errors.diesel_ltr && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.diesel_ltr.message}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-[13px] pb-1 text-black">Fuel Amount</p>
                  <Input
                    type="number"
                    min="0"
                    {...register("diesel_amount", {
                      required: "This field is required",
                    })}
                    className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1"
                  />
                  {errors.diesel_amount && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.diesel_amount.message}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-[13px] pb-1 text-black">
                    Greasing & Air checking
                  </p>
                  <Input
                    type="number"
                    min="0"
                    {...register("greasing_air_checking", {
                      required: "This field is required",
                    })}
                    className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1"
                  />
                  {errors.greasing_air_checking && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.greasing_air_checking.message}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-[13px] pb-1 text-black">Adblue</p>
                  <Input
                    type="number"
                    min="0"
                    {...register("adblue", {
                      required: "Adblue is required",
                    })}
                    className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1"
                  />
                  {errors.adblue && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.adblue.message}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-[13px] pb-1 text-black">Gate pass</p>
                  <Input
                    type="number"
                    min="0"
                    {...register("gate_pass", {
                      required: "Gate pass is required",
                    })}
                    className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1"
                  />
                  {errors.gate_pass && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.gate_pass.message}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-[13px] pb-1 text-black">RTO Expense</p>
                  <Input
                    type="number"
                    min="0"
                    {...register("rto_expense", {
                      required: "RTO expense is required",
                    })}
                    className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1"
                  />
                  {errors.rto_expense && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.rto_expense.message}
                    </p>
                  )}
                </div>

                <div className="col-span-2 pb-10">
                  <p className="text-[13px] pb-1 text-black">Other Expenses</p>
                  {fields.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-2 gap-4 mb-3">
                      <Input
                        placeholder="Reason (e.g. Toll)"
                        {...register(`other_expense.${index}.reason`)}
                        className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg"
                      />
                      <Input
                        placeholder="Amount"
                        type="number"
                        min="0"
                        {...register(`other_expense.${index}.amount`, {
                          valueAsNumber: true,
                        })}
                        className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg"
                      />
                      {errors.other_expense?.[index]?.reason && (
                        <p className="text-red-500 text-xs col-span-2">
                          {errors.other_expense[index].reason.message}
                        </p>
                      )}
                      {errors.other_expense?.[index]?.amount && (
                        <p className="text-red-500 text-xs col-span-2">
                          {errors.other_expense[index].amount.message}
                        </p>
                      )}
                      {/* <Button
                        type="button"
                        variant="destructive"
                        onClick={() => remove(index)}
                        className="col-span-2 hidden mt-2 text-xs"
                      >
                        Remove
                      </Button> */}
                    </div>
                  ))}
                  <Button
                    type="submit"
                    onClick={() => append({ reason: "", amount: "" })}
                    className="bg-black text-white"
                  >
                    + Add Expense
                  </Button>
                </div>
              </>
            )}

            {data.self_type === "other-load" && (
              <>
                <div>
                  <p className="text-[13px] pb-1 text-black">Road Expense</p>
                  <Input
                    type="number"
                    min="0"
                    {...register("road_expense", {
                      required: "road expense is required",
                    })}
                    className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1"
                  />
                  {errors.road_expense && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.road_expense.message}
                    </p>
                  )}
                </div>

                <div className="col-span-2 pb-10">
                  <p className="text-[13px] pb-1 text-black">Other Expenses</p>
                  {fields.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-2 gap-4 mb-3">
                      <Input
                        placeholder="Reason (e.g. Toll)"
                        {...register(`other_expense.${index}.reason`, {
                          required: "Reason is required",
                        })}
                        className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg"
                      />
                      <Input
                        placeholder="Amount"
                        type="number"
                        min="0"
                        {...register(`other_expense.${index}.amount`, {
                          required: "Amount is required",
                          valueAsNumber: true,
                        })}
                        className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg"
                      />
                      {errors.other_expense?.[index]?.reason && (
                        <p className="text-red-500 text-xs col-span-2">
                          {errors.other_expense[index].reason.message}
                        </p>
                      )}
                      {errors.other_expense?.[index]?.amount && (
                        <p className="text-red-500 text-xs col-span-2">
                          {errors.other_expense[index].amount.message}
                        </p>
                      )}
                    </div>
                  ))}
                  <Button
                    type="submit"
                    onClick={() => append({ reason: "", amount: "" })}
                    className="bg-black text-white"
                  >
                    + Add Expense
                  </Button>
                </div>
              </>
            )}

            {data.tripType === "3rd-party" && (
              <>
                <div className="col-span-2 pb-10">
                  <p className="text-[13px] pb-1 text-black">Other Expenses</p>
                  {fields.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-2 gap-4 mb-3">
                      <Input
                        placeholder="Reason (e.g. Toll)"
                        {...register(`other_expense.${index}.reason`, {
                          required: "Reason is required",
                        })}
                        className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg"
                      />
                      <Input
                        placeholder="Amount"
                        type="number"
                        min="0"
                        {...register(`other_expense.${index}.amount`, {
                          required: "Amount is required",
                          valueAsNumber: true,
                        })}
                        className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg"
                      />
                      {errors.other_expense?.[index]?.reason && (
                        <p className="text-red-500 text-xs col-span-2">
                          {errors.other_expense[index].reason.message}
                        </p>
                      )}
                      {errors.other_expense?.[index]?.amount && (
                        <p className="text-red-500 text-xs col-span-2">
                          {errors.other_expense[index].amount.message}
                        </p>
                      )}
                    </div>
                  ))}
                  <Button
                    type="submit"
                    onClick={() => append({ reason: "", amount: "" })}
                    className="bg-black text-white"
                  >
                    + Add Expense
                  </Button>
                </div>
              </>
            )}
          </div>

          <div className="w-full flex justify-end">
            <Button type="submit" className="bg-black text-white">
              Submit
            </Button>
          </div>
        </form>

        <ToastContainer position="top-right" autoClose={3000} />
      </DialogContent>
    </Dialog>
  );
}

export default TripExpense;
