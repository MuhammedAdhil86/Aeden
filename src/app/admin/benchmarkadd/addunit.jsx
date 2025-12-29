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

const AddUnitModal = ({ isOpen, onClose, onSuccess }) => {
  const [unitName, setUnitName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!unitName.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${FLEET_BASE_URL}/master/bench/Add-unit`,
        { unit_name: unitName },
        {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        }
      );
      
      setUnitName(""); // Clear input
      onSuccess();     // Refresh the unit list in main form
      onClose();       // Close dialog
    } catch (error) {
      console.error("Error adding unit:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Add New Unit</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Unit Name</Label>
            <Input
              placeholder="e.g. Kg, Litre, Box"
              value={unitName}
              onChange={(e) => setUnitName(e.target.value)}
              className="h-10"
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
            disabled={loading || !unitName.trim()}
            className="bg-black text-white hover:bg-gray-800"
          >
            {loading ? "Saving..." : "Save Unit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUnitModal;