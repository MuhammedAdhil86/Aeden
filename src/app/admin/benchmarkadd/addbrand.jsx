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

const AddCategoryModal = ({ isOpen, onClose, onSuccess }) => {
  const [categoryName, setCategoryName] = useState("");
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
  // User can type lowercase
  // Backend receives UPPERCASE
  const handleSave = async () => {
    if (!categoryName.trim()) return;

    setLoading(true);
    try {
      await axios.post(
        `${FLEET_BASE_URL}/master/stock/Addcategory`,
        {
          category_name: categoryName.trim().toUpperCase(),
        },
        {
          headers: getAuthHeader(),
        }
      );

      setCategoryName("");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error adding category:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-black">
            Add New Category
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-black">
              Category Name
            </Label>

            <Input
              placeholder="E.g. Spare Parts"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
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
            disabled={loading || !categoryName.trim()}
            className="bg-black text-white hover:bg-gray-800"
          >
            {loading ? "Saving..." : "Save Category"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryModal;
