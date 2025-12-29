"use client";

import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { fetchAllBranches, fetchAllHalting } from "@/service/fleet";

function OtherDetailsOtherLoad({ register, watch, setValue, control, errors }) {
  const isAdvanceChecked = watch("advanceReceived");
  const selectedHalting = watch("halting");
  const [haltingSlabs, setHaltingSlabs] = useState([]);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const slabs = await fetchAllHalting();
        console.log("Fetched halting slabs:", slabs);
        setHaltingSlabs(Array.isArray(slabs) ? slabs : []);
      } catch (error) {
        console.error("Failed to fetch halting slabs:", error);
        setHaltingSlabs([]);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedHalting) {
      const selectedSlab = haltingSlabs.find(
        (slab) => slab.slab === selectedHalting
      );
      const rate = selectedSlab ? selectedSlab.rate_per_hour : 0;
      setValue("halting_rate", rate);
    } else {
      setValue("halting_rate", 0);
    }
  }, [selectedHalting, haltingSlabs, setValue]);

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
          <p className="text-red-500 text-xs mt-1">
            {errors.freightNumber.message}
          </p>
        )}
      </div>
      <div>
        <p className="text-[13px] ps-5 text-black">Commission</p>
        <Input
          {...register("commission")}
          type="number"
          placeholder="Enter Number"
          required
          className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      <div>
        <p className="text-[13px] ps-5 text-black">Halting Slab</p>
        <Controller
          name="halting"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              value={field.value || ""}
              required
            >
              <SelectTrigger className="border-neutral-400 text-black text-xs rounded-lg mt-1 p-2 w-full focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                <SelectValue placeholder="Select Halting Slab" />
              </SelectTrigger>
              <SelectContent className="text-black bg-white">
                {haltingSlabs.map((slab) => (
                  <SelectItem key={slab.id} value={slab.slab}>
                    {slab.slab}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div>
        <p className="text-[13px] ps-5 text-black">Halting Rate (per hour)</p>
        <Input
          {...register("halting_rate")}
          readOnly
          value={watch("halting_rate") || 0}
          className="bg-blue-50 border-neutral-400 text-black cursor-not-allowed placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      <div>
        <div className="flex items-center gap-x-3 ps-5">
          <input
            type="checkbox"
            id="advanceCheckbox"
            {...register("advanceReceived")}
            className="w-4 h-4 rounded-md accent-black border-gray-300 cursor-pointer"
          />
          <label
            htmlFor="advanceCheckbox"
            className="text-[13px] text-black cursor-pointer"
          >
            Advance Received Amount (INR)
          </label>
        </div>
        <Input
          {...register("receivedAmount")}
          type="number"
          placeholder="Enter amount"
          required={isAdvanceChecked}
          disabled={!isAdvanceChecked}
          className={`border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 ${
            !isAdvanceChecked ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
        />
      </div>

      <div>
        <p
          className={`text-[13px] ps-5 ${
            isAdvanceChecked ? "text-black" : "text-neutral-400"
          }`}
        >
          Advance Received Amount date
        </p>
        <div className="relative w-full">
          <Input
            {...register("amountdate")}
            id="amountdate"
            type="date"
            required={isAdvanceChecked}
            disabled={!isAdvanceChecked}
            className={`border-neutral-400 text-black placeholder:text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none pr-10
              [&::-webkit-calendar-picker-indicator]:opacity-0 
              [&::-webkit-calendar-picker-indicator]:pointer-events-none ${
                !isAdvanceChecked ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
          />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              const amountdate = document.getElementById("amountdate");
              if (amountdate && isAdvanceChecked) {
                amountdate.showPicker();
              }
            }}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
              isAdvanceChecked
                ? "text-gray-500"
                : "text-gray-300 cursor-not-allowed"
            }`}
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
  );
}

export default OtherDetailsOtherLoad;
