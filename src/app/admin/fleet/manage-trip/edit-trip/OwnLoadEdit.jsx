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

function OwnLoadEdit({ register, watch, setValue }) {
const [branches, setBranches] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [newBranch, setNewBranch] = useState("");

  //console.log("diesel_amount : ",watch(diesel_amount));
  
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
          {...register("customer_name")}
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
          {...register("diesel_amount")}
          value={watch("diesel_amount")}
          type="number"
          placeholder="Enter Amount"
          required
          className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      <div>
        <p className="text-[13px] ps-5 text-black">Freight charge (INR)</p>
        <Input
          {...register("freight")}
          type="number"
          placeholder="Enter Number"
          required
          className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      <div>
        <p className="text-[13px] ps-5 text-black">Trip Sheet No</p>
        <Input
          {...register("trip_sheet_no")}
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

export default OwnLoadEdit