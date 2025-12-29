import React, { useEffect, useState } from "react";
import { createVariety, fetchHSNByProduct } from "@/service/procurements";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getAllProducts } from "@/service/procurements";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Controller, useForm } from "react-hook-form";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

export default function VarietyDialog({ open, onOpenChange, onSave, products }) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      product: "",
      name: "",
      hsmCode: "",
      manufacturer: "",
      batchNumber: "",
      validityPeriod: "",
      description: "",
    },
  });

  const selectedProductName = watch("product"); // Watch the product field
  const [isLoadingHSN, setIsLoadingHSN] = useState(false);

    useEffect(() => {
    const fetchHSN = async () => {
      if (!selectedProductName) return;

      const selectedProduct = products.find(
        (prod) => prod.product_name === selectedProductName
      );
      if (!selectedProduct || !selectedProduct.id) {
        setValue("hsmCode", "");
        return;
      }

      try {
        setIsLoadingHSN(true);
        const hsnData = await fetchHSNByProduct(selectedProduct.id);
        setValue("hsmCode", hsnData.hsn_code || "");
      } catch (err) {
        console.error("Failed to fetch HSN code:", err);
        toast.error("Unable to fetch HSN code for the selected product.");
        setValue("hsmCode", "");
      } finally {
        setIsLoadingHSN(false);
      }
    };

    fetchHSN();
  }, [selectedProductName, products, setValue]);

  const handleSave = async (data) => {
    try {
      const selectedProduct = products.find(
        (prod) => prod.product_name === data.product
      );
      if (!selectedProduct) {
        toast.error("Selected product not found.");
        return;
      }

      const payload = {
        product_id: {
          id: selectedProduct.id,
        },
        name: data.name,
        hsm_code: data.hsmCode,
        description: data.description,
        manufacturer: data.manufacturer,
        batch_number: data.batchNumber,
        validity_period: Number(data.validityPeriod),
      };

      await onSave(payload);
      reset();
      onOpenChange(false);
      toast.success("Variety added successfully!");
    } catch (err) {
      console.error("Variety creation failed:", err);
      toast.error('Failed to add variety: Variety already exists');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white text-black sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="mt-5 pt-5 font-semibold text-black border-t text-sm">
            Add New Variety
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleSave)}
          className="grid grid-cols-2 gap-y-6 gap-x-8 mt-4"
        >
          <div>
            <p className="text-[13px] ps-5 pb-1">Product</p>
            <div className="space-y-2">
              <Controller
                name="product"
                control={control}
                rules={{ required: "Product is required" }}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger className="border-neutral-400 text-xs">
                      <SelectValue placeholder="Select Product" />
                    </SelectTrigger>
                    <SelectContent className="text-black bg-white">
                      {products
                        .filter((prod) => prod && prod.id && prod.product_name)
                        .map((prod) => (
                          <SelectItem key={prod.id} value={prod.product_name}>
                            {prod.product_name}
                          </SelectItem>
                        ))}
                      {products.length === 0 && (
                        <div className="px-2 py-1 text-xs text-black">
                          No products available
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.product && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.product.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <p className="text-[13px] ps-5 text-black">Variety Name</p>
            <Input
              {...register("name", { required: "Variety name is required" })}
              placeholder="Variety Name"
              className="border-neutral-400 text-black placeholder:text-xs placeholder:font-normal text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <p className="text-[13px] ps-5 text-black">HSN Code</p>
            <Input
              {...register("hsmCode", { required: "HSN Code is required" })}
              placeholder={isLoadingHSN ? "Loading HSN code..." : "HSN Code"}
              readOnly
              className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 cursor-not-allowed"
            />
            {errors.hsmCode && (
              <p className="text-xs text-red-500">{errors.hsmCode.message}</p>
            )}
          </div>

          {/* <div>
            <p className="text-[13px] ps-5 text-black">Manufacturer</p>
            <Input
              {...register("manufacturer", { required: "Manufacturer is required" })}
              placeholder="Manufacturer"
              className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {errors.manufacturer && (
              <p className="text-xs text-red-500">{errors.manufacturer.message}</p>
            )}
          </div> */}

          {/* <div>
            <p className="text-[13px] ps-5 text-black">Validity Period</p>
            <Input
              {...register("validityPeriod", { 
                required: "Validity Period is required",
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Validity Period must be a positive number",
                },
              })}
              type="number"
              min="0"
              placeholder="Enter validity period"
              className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {errors.validityPeriod && (
              <p className="text-xs text-red-500">{errors.validityPeriod.message}</p>
            )}
          </div> */}

          {/* <div>
            <p className="text-[13px] ps-5 text-black">Batch Number</p>
            <Input
              {...register("batchNumber", { required: "Batch Number is required" })}
              placeholder="Batch Number"
              className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {errors.batchNumber && (
              <p className="text-xs text-red-500">{errors.batchNumber.message}</p>
            )}
          </div> */}

          <div className="col-span-2">
            <p className="text-[13px] ps-5 text-black">Description</p>
            <Textarea
              {...register("description")}
              placeholder="Write a short description..."
              className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          <div className="col-span-2 flex justify-end mt-2">
            <Button
              type="button"
              variant="outline"
              className="text-red-500 mr-2"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={() => setIsVarietyDialogOpen(true)}
              className="bg-black text-white px-4 py-2 text-xs rounded"
            >
              Add Variety
            </Button>
          </div>
        </form>
        <ToastContainer position="top-right" autoClose={3000} />
      </DialogContent>
    </Dialog>
  );
}