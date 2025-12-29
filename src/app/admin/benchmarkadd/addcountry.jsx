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

const AddCountryModal = ({ isOpen, onClose, onSuccess }) => {
  const [countryName, setCountryName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!countryName.trim()) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${FLEET_BASE_URL}/master/bench/Add-country`,
        { country_name: countryName },
        { headers: { Authorization: token ? `Bearer ${token}` : "" } }
      );
      setCountryName("");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error adding country:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Add New Country</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Country Name</Label>
            <Input
              placeholder="e.g. India, UAE, USA"
              value={countryName}
              onChange={(e) => setCountryName(e.target.value)}
              className="h-10"
            />
          </div>
        </div>
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={loading || !countryName.trim()} className="bg-black text-white">
            {loading ? "Saving..." : "Save Country"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCountryModal;