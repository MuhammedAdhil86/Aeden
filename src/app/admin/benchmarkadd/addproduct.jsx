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

const BASE_URL = "https://aeden-fleet-t579q.ondigitalocean.app";

const AddProductModal = ({ isOpen, onClose, onSuccess, categoryId }) => {
  const [productName, setProductName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!productName.trim() || !categoryId) return;

    setLoading(true);
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token")
          : null;

      await axios.post(
        `${BASE_URL}/master/stock/Addproduct`,
        {
          product_name: productName.trim(),
          category: {
            id: categoryId, // ✅ REQUIRED FORMAT
          },
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      setProductName("");
      onSuccess?.();
      onClose?.();
    } catch (error) {
      console.error("Add product error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Add New Product
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-3">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Product Name</Label>
            <Input
              placeholder="e.g. APPLE GALA 18KG"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="h-10"
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading || !productName.trim() || !categoryId}
            className="bg-black text-white"
          >
            {loading ? "Saving..." : "Save Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;
