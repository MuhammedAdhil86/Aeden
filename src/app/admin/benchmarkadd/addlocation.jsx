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
import axios from "axios";

const BASE_URL = "https://aeden-fleet-t579q.ondigitalocean.app";

const AddLocationModal = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    country: "",
    state: "",
    city: "",
    latitude: "",
    longitude: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!form.country || !form.state || !form.city) return;

    setLoading(true);
    try {
      await axios.post(
        `${BASE_URL}/master/bench/Add-location`,
        {
          country: form.country.trim().toUpperCase(),
          state: form.state.trim().toUpperCase(),
          city: form.city.trim().toUpperCase(),
          latitude: form.latitude,
          longitude: form.longitude,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      onSuccess();
      onClose();

      setForm({
        country: "",
        state: "",
        city: "",
        latitude: "",
        longitude: "",
      });
    } catch (error) {
      console.error("Error adding location:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px] bg-white text-black">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-black">
            Add New Location
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <Input
            placeholder="Country"
            value={form.country}
            onChange={(e) => handleChange("country", e.target.value)}
            className="text-black placeholder:text-gray-500"
          />

          <Input
            placeholder="State"
            value={form.state}
            onChange={(e) => handleChange("state", e.target.value)}
            className="text-black placeholder:text-gray-500"
          />

          <Input
            placeholder="City"
            value={form.city}
            onChange={(e) => handleChange("city", e.target.value)}
            className="text-black placeholder:text-gray-500"
          />

          <div className="flex gap-2">
            <Input
              placeholder="Latitude"
              value={form.latitude}
              onChange={(e) => handleChange("latitude", e.target.value)}
              className="text-black placeholder:text-gray-500"
            />

            <Input
              placeholder="Longitude"
              value={form.longitude}
              onChange={(e) => handleChange("longitude", e.target.value)}
              className="text-black placeholder:text-gray-500"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-black text-white w-full hover:bg-gray-800"
          >
            {loading ? "Saving..." : "Save Location"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddLocationModal;
