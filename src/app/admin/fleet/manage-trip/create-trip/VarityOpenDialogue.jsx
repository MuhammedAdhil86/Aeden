import React, { useEffect, useState } from "react";
import { createVariety, getAllProducts } from "@/service/procurements";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Controller, useForm } from "react-hook-form";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";

function VarityOpenDialogue({
  open,
  onOpenChange,
  selectedProduct,
  onProductAdded,
}) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category: "",
      name: "",
      hsmCode: "",
      description: "",
      manufacturer: "",
      batchNumber: "",
      validityPeriod: "",
    },
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  console.log("VarityOpenDialogue props:", { open, selectedProduct });

  const fetchCategories = async () => {
    console.log("fetchCategories called");
    setLoading(true);
    try {
      const res = await getAllProducts(`?t=${Date.now()}`);
      console.log("Dialog products:", res.data);
      console.table(res.data || []);
      setCategories(res.data || []);
      setLoading(false);
    } catch (err) {
      console.error(
        "Fetch categories error:",
        err.response?.data || err.message
      );
      toast.error("Failed to fetch products.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchCategories();
      if (selectedProduct) {
        console.log("Setting category to:", selectedProduct);
        setValue("category", selectedProduct);
      }
    } else {
      console.log("Resetting form");
      reset();
    }
  }, [open, selectedProduct, setValue, reset]);

  const getCategoryIdByName = (categoryName) => {
    const selected = categories.find(
      (cat) => cat.product_name === categoryName
    );
    console.log("getCategoryIdByName:", { categoryName, selected });
    return selected?.id || null;
  };

  const handleSave = async (data) => {
    console.log("handleSave called with data:", data);
    try {
      const payload = {
        product_id: {
          id: getCategoryIdByName(data.category),
        },
        name: data.name,
        hsm_code: data.hsmCode,
        description: data.description,
        manufacturer: data.manufacturer,
        batch_number: data.batchNumber,
        validity_period: Number(data.validityPeriod),
      };
      console.log("Saving variety with payload:", payload);

      const response = await createVariety(payload);
      console.log("createVariety response:", response);
      toast.success("Variety added successfully");
      reset();
      if (response) {
        console.log("Calling onProductAdded with new variety:", response.data);
        await onProductAdded(response);
      }
      if (typeof onOpenChange === "function") {
        console.log("Calling onOpenChange(false)");
        onOpenChange(false); // Close dialog
      } else {
        console.warn("onOpenChange is not a function");
      }
    } catch (err) {
      console.error(
        "Variety creation failed:",
        err.response?.data || err.message
      );
      toast.error("Failed to add variety");
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
                name="category"
                control={control}
                rules={{ required: "Product is required" }}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={loading ? "Loading..." : "Select Product"}
                      />
                    </SelectTrigger>
                    <SelectContent className="text-black bg-white">
                      {loading ? (
                        <SelectItem value="loading" disabled>
                          Loading...
                        </SelectItem>
                      ) : categories.length === 0 ? (
                        <SelectItem value="empty" disabled>
                          No products available
                        </SelectItem>
                      ) : (
                        categories
                          .filter(
                            (cat) =>
                              cat.product_name &&
                              cat.product_name.trim() !== ""
                          )
                          .map((cat) => (
                            <SelectItem key={cat.id} value={cat.product_name}>
                              {cat.product_name}
                            </SelectItem>
                          ))
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <p className="text-[13px] ps-5 text-black">Variety Name</p>
            <Input
              {...register("name", { required: "Variety name is required" })}
              placeholder="Variety Name"
              className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div>
            <p className="text-[13px] ps-5 text-black">HSN Code</p>
            <Input
              {...register("hsmCode", { required: "HSN Code is required" })}
              placeholder="HSN Code"
              className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {errors.hsmCode && (
              <p className="text-xs text-red-500">{errors.hsmCode.message}</p>
            )}
          </div>
          {/* <div>
            <p className="text-[13px] ps-5 text-black">Supplier</p>
            <Input
              {...register("manufacturer", {
                required: "Supplier is required",
              })}
              placeholder="Manufacturer"
              className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {errors.manufacturer && (
              <p className="text-xs text-red-500">
                {errors.manufacturer.message}
              </p>
            )}
          </div>
          <div>
            <p className="text-[13px] ps-5 text-black">Validity Period</p>
            <Input
              {...register("validityPeriod", {
                required: "Validity period is required",
                valueAsNumber: true,
                min: {
                  value: 0,
                  message: "Validity period must be non-negative",
                },
              })}
              type="number"
              min="0"
              placeholder="Enter validity period"
              className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {errors.validityPeriod && (
              <p className="text-xs text-red-500">
                {errors.validityPeriod.message}
              </p>
            )}
          </div>
          <div>
            <p className="text-[13px] ps-5 text-black">Batch Number</p>
            <Input
              {...register("batchNumber", {
                required: "Batch Number is required",
              })}
              placeholder="Batch Number"
              className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {errors.batchNumber && (
              <p className="text-xs text-red-500">
                {errors.batchNumber.message}
              </p>
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
          <div className="col-span-2 flex justify-end mt-2 gap-x-2">
            <Button
              variant="outline"
              type="button"
              className="text-red-500 px-7 border-neutral-300"
              onClick={() => {
                if (typeof onOpenChange === "function") {
                  onOpenChange(false);
                } else {
                  console.warn("onOpenChange is not a function");
                }
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
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

export default VarityOpenDialogue;
