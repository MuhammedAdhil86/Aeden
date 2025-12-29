"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";

const FLEET_BASE_URL = "https://aeden-fleet-t579q.ondigitalocean.app";

const AddSupplierModal = ({ isOpen, onClose, onSuccess }) => {
  const [supplierName, setSupplierName] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔐 Auth header
  const getAuthHeader = () => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("token")
        : "";

    return {
      Authorization: token ? `Bearer ${token}` : "",
    };
  };

  // 💾 Save handler
  // Backend gets FULL CAPS only
  const handleSave = async () => {
    if (!supplierName.trim()) return;

    setLoading(true);
    try {
      await axios.post(
        `${FLEET_BASE_URL}/master/bench/Add-company`,
        {
          company_name: supplierName.trim().toUpperCase(), // 👈 CAPS ONLY HERE
        },
        {
          headers: getAuthHeader(),
        }
      );

      setSupplierName("");
      onSuccess(); // refresh supplier list
      onClose();   // close modal
    } catch (error) {
      console.error("Error adding supplier:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-black">
            Add New Supplier
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-black">
              Supplier / Company Name
            </Label>

            <Input
              placeholder="E.g. ABC Traders"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              className="h-10 text-black placeholder:text-gray-500"
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            disabled={loading || !supplierName.trim()}
            className="bg-black text-white hover:bg-gray-800"
          >
            {loading ? "Saving..." : "Save Supplier"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSupplierModal;
