"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createBranch, fetchAllBranches } from "@/service/fleet";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function OtherDetailsOwnLoad({ register, watch, setValue, errors }) {
  const [branches, setBranches] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [newBranch, setNewBranch] = useState("");

  useEffect(() => {
    const loadBranches = async () => {
      try {
        const data = await fetchAllBranches();
        setBranches(data);
      } catch (err) {
        console.error("Failed to load branches:", err);
      }
    };
    loadBranches();
  }, []);

  const handleAddBranch = async () => {
    try {
      if (!newBranch.trim()) {
        toast.error("Branch name cannot be empty");
        return;
      }

      await createBranch({ branch_name: newBranch });

      const updatedBranches = await fetchAllBranches();
      setBranches(Array.isArray(updatedBranches) ? updatedBranches : []);

      setValue("branch", "");
      setNewBranch("");
      setShowInput(false);

      toast.success("Branch added successfully");
    } catch (err) {
      console.error("Add branch error", err);
      toast.error("Failed to add branch");
    }
  };

  return (
    <div className="grid grid-cols-4 gap-x-5 gap-y-5 mt-5">
      <div>
        <p className="text-[13px] ps-5 text-black">Branch</p>
        <Select
          {...register("branch")}
          value={watch("branch")}
          onValueChange={(value) => {
            if (value === "add_new") {
              setShowInput(true);
            } else {
              setValue("branch", value);
            }
          }}
          required
          className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <SelectTrigger className="text-black">
            <SelectValue placeholder="Select branch" />
          </SelectTrigger>
          <SelectContent className="text-black bg-white">
            <SelectItem value="add_new" className="text-blue-600 font-semibold">
              + Add New branch
            </SelectItem>{" "}
            {branches.map((branch) => (
              <SelectItem key={branch.id} value={branch.branch_name}>
                {branch.branch_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {showInput && (
          <div className="flex gap-2 items-center mt-3">
            <Input
              type="text"
              value={newBranch}
              onChange={(e) => setNewBranch(e.target.value)}
              placeholder="Enter new branch"
              className="text-sm text-black"
            />
            <Button
              type="button"
              className="bg-black"
              onClick={handleAddBranch}
            >
              Add
            </Button>
          </div>
        )}
      </div>
      <div>
        <p className="text-[13px] ps-5 text-black">Customer Name</p>
        <Input
          {...register("customerName")}
          placeholder="Enter name"
          required
          className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      <div>
        <p className="text-[13px] ps-5 text-black">Fuel (ltr)</p>
        <Input
          {...register("diesel")}
          type="number"
          placeholder="Enter Fuel"
          required
          className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      <div>
        <p className="text-[13px] ps-5 text-black">Fuel Amount (INR)</p>
        <Input
          {...register("dieselAmount")}
          type="number"
          placeholder="Enter Amount"
          required
          className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      <div>
        <p className="text-[13px] ps-5 text-black">Freight charge (INR)</p>
        <Input
          {...register("freightNumber", {
            required: "Freight charge is required",
            min: {
              value: 1,
              message: "Freight charge cannot be 0",
            },
            valueAsNumber: true,
            validate: (value) => value > 0 || "Freight charge cannot be 0",
          })}
          type="number"
          step="1"
          min="1"
          placeholder="Enter amount"
          className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        {errors.freightNumber && (
          <p className="text-red-500 text-xs mt-1">{errors.freightNumber.message}</p>
        )}
      </div>
      <div>
        <p className="text-[13px] ps-5 text-black">Trip Sheet No</p>
        <Input
          {...register("tripSheetNo")}
          //type='number'
          placeholder="Enter Number"
          required
          className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default OtherDetailsOwnLoad;
