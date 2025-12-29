import React from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";
import { createUnit } from "@/service/procurements";

export default function UnitDialog({ open, onOpenChange, onSave }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      unit_name: "",
    },
  });

  const handleSave = async (data) => {
    try {
      await onSave({
        unit_name: data.unit_name,
      });
      reset();
      onOpenChange(false);
      toast.success("Unit added successfully!");
    } catch (error) {
      toast.error(`Failed to add unit: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-black">Add New Unit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
          <div>
            <label className="text-[13px] ps-1 text-black">Unit Name</label>
            <Input
              {...register("unit_name", { required: "Unit name is required" })}
              placeholder="Enter unit name"
              className="border-neutral-400 text-xs rounded-lg mt-1 text-black"
            />
            {errors.unit_name && (
              <p className="text-red-500 text-xs mt-1">{errors.unit_name.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="text-red-500"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" className="text-white bg-black">
              Add Unit
            </Button>
          </DialogFooter>
        </form>
        <ToastContainer position="top-right" autoClose={3000} />
      </DialogContent>
    </Dialog>
  );
}