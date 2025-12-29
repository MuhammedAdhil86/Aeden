import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  fetchVarityByProductId,
  fetchUnits,
  createVariety,
} from "@/service/procurements";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createProduct } from "@/service/procurements";
import VarietyDialog from "./VarietyDialog";
import UnitDialog from "./UnitDialog";
import { createUnit } from "@/service/procurements";

const ProductDialog = ({ open, onClose, onSave }) => {
  const {
    control: dialogControl,
    handleSubmit: handleDialogSubmit,
    register: dialogRegister,
    formState: { errors: dialogErrors },
    reset: dialogReset,
  } = useForm({
    defaultValues: {
      product_name: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await onSave({
        product_name: data.product_name,
        hsn_code: data.hsmCode,
      });
      dialogReset();
      onClose();
    } catch (error) {
      toast.error(`Failed to add product: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-black">Add New Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleDialogSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-[13px] ps-1 text-black">Product Name</label>
            <Input
              {...dialogRegister("product_name", {
                required: "Product name is required",
              })}
              placeholder="Enter product name"
              className="border-neutral-400 text-xs rounded-lg mt-1 text-black"
            />
            {dialogErrors.product_name && (
              <p className="text-red-500 text-xs mt-1">
                {dialogErrors.product_name.message}
              </p>
            )}
          </div>
          <div>
            <p className="text-[13px] ps-5 text-black">HSN Code</p>
            <Input
              {...dialogRegister("hsmCode", { required: "HSN Code is required" })}
              placeholder="HSN Code"
              className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {dialogErrors.hsmCode && (
              <p className="text-xs text-red-500">{dialogErrors.hsmCode.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="text-red-500"
              onClick={() => {
                dialogReset();
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" className="text-white bg-black">
              Add Product
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

function ProductSelection({
  control,
  watch,
  setValue,
  products,
  setProducts,
  selectedProducts,
  setSelectedProducts,
  currencies,
  register,
}) {
  const [varieties, setVarieties] = useState([]);
  const [loadingVarieties, setLoadingVarieties] = useState(false);
  const [currentProductSpecs, setCurrentProductSpecs] = useState([]);
  const [units, setUnits] = useState([]);
  const watchedProduct = watch("product");
  const watchedVariety = watch("variety");
  const watchedQuantity = watch("quantity");
  const watchedCountSize = watch("countSize");
  const watchedNetWeight = watch("netWeight");
  const watchedUnitPrice = watch("unitPrice");
  const watchedUnit = watch("unit");
  const watchedWeightUnit = watch("weightUnit");
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isVarietyDialogOpen, setIsVarietyDialogOpen] = useState(false);
  const [isUnitDialogOpen, setIsUnitDialogOpen] = useState(false);

  useEffect(() => {
    const getUnits = async () => {
      try {
        const res = await fetchUnits();
        setUnits(res?.data || []);
      } catch (err) {
        console.error("Error fetching units:", err);
      }
    };
    getUnits();
  }, []);

  useEffect(() => {
    const fetchVarieties = async () => {
      if (watchedProduct) {
        const productObj = products.find(
          (p) => p.product_name === watchedProduct
        );
        if (productObj && productObj.id) {
          setLoadingVarieties(true);
          try {
            const varietyData = await fetchVarityByProductId(productObj.id);
            setVarieties(varietyData?.data || []);
          } catch (error) {
            console.error("Error fetching varieties:", error);
            toast.error("Failed to fetch varieties for selected product.");
            setVarieties([]);
          } finally {
            setLoadingVarieties(false);
          }
        }
      } else {
        setVarieties([]);
      }
    };
    fetchVarieties();
  }, [watchedProduct, products]);

  const calculateAutoUnit = () => {
    if (!currentProductSpecs || currentProductSpecs.length === 0) {
      return 0;
    }
    return currentProductSpecs
      .filter((spec) => spec.type === "quantity")
      .reduce((total, spec) => total + (parseFloat(spec.quantity) || 0), 0);
  };

  const calculateTotalAmount = () => {
    const autoUnit = calculateAutoUnit();
    const unitPrice = parseFloat(watchedUnitPrice) || 0;
    return (autoUnit * unitPrice).toFixed(2);
  };

  const addQuantitySpec = () => {
    if (!watchedQuantity || !watchedUnit) {
      toast.error("Please enter quantity and select unit");
      return;
    }
    const newSpec = {
      id: Date.now(),
      type: "quantity",
      quantity: parseFloat(watchedQuantity),
      unit: watchedUnit,
      countSize: parseFloat(watchedCountSize) || 0,
    };
    setCurrentProductSpecs([...currentProductSpecs, newSpec]);
    setValue("quantity", "");
    setValue("unit", "");
    setValue("countSize", "");
  };

  const addWeightSpec = () => {
    if (!watchedNetWeight || !watchedWeightUnit) {
      toast.error("Please enter net weight and select weight unit");
      return;
    }
    const newSpec = {
      id: Date.now(),
      type: "weight",
      netWeight: parseFloat(watchedNetWeight),
      weightUnit: watchedWeightUnit,
    };
    setCurrentProductSpecs([...currentProductSpecs, newSpec]);
    setValue("netWeight", "");
    setValue("weightUnit", "");
  };

  const removeSpec = (specId) => {
    setCurrentProductSpecs(
      currentProductSpecs.filter((spec) => spec.id !== specId)
    );
  };

  const addProductToSelection = () => {
    if (!watchedProduct) {
      toast.error("Please select a product");
      return;
    }
    if (!watchedVariety) {
      toast.error("Please select a variety");
      return;
    }
    if (
      currentProductSpecs.filter((spec) => spec.type === "quantity").length ===
      0
    ) {
      toast.error("Please add at least one quantity specification");
      return;
    }
    if (!watchedUnitPrice) {
      toast.error("Please enter unit price");
      return;
    }

    const newProduct = {
      id: Date.now(),
      product: watchedProduct,
      variety: watchedVariety,
      brand: watch("brand"),
      autoUnit: calculateAutoUnit(),
      currency: watch("currency") || "USD",
      unitPrice: parseFloat(watchedUnitPrice).toFixed(2),
      totalAmount: parseFloat(calculateTotalAmount()).toFixed(2),
      specifications: [...currentProductSpecs],
      countSize: parseFloat(watchedCountSize) || 0,
    };

    setSelectedProducts([...selectedProducts, newProduct]);
    setValue("product", "");
    setValue("variety", "");
    setValue("brand", "");
    setValue("currency", "");
    setValue("unitPrice", "");
    setValue("quantity", "");
    setValue("countSize", "");
    setValue("unit", "");
    setValue("netWeight", "");
    setValue("weightUnit", "");
    setCurrentProductSpecs([]);
  };

  const removeProduct = (productId) => {
    setSelectedProducts(
      selectedProducts.filter((product) => product.id !== productId)
    );
  };

  const updateCountSize = (change) => {
    const currentCountSize = parseFloat(watchedCountSize) || 0;
    const newCountSize = Math.max(0, currentCountSize + change);
    setValue("countSize", newCountSize);
  };

  const updateQuantity = (change) => {
    const currentQuantity = watchedQuantity || 0;
    const newQuantity = Math.max(0, currentQuantity + change);
    setValue("quantity", newQuantity);
  };

  const updateNetWeight = (change) => {
    const currentWeight = watchedNetWeight || 0;
    const newWeight = Math.max(0, (currentWeight + change).toFixed(1));
    setValue("netWeight", parseFloat(newWeight));
  };

  const handleAddProduct = async (data) => {
    try {
      const response = await createProduct(data);
      const newProduct = {
        id: response?.data?.id || response.id || Date.now(),
        product_name: data.product_name,
      };
      setProducts((prev) => [...prev, newProduct]);
      toast.success("Product added successfully!");
    } catch (error) {
      toast.error(`Failed to add product: ${error.message}`);
      throw error;
    }
  };

  const handleAddVariety = async (data) => {
    try {
      const response = await createVariety(data);
      const newVariety = {
        id: response?.data?.id || response.id || Date.now(),
        name: data.name,
        product_id: data.product_id.id,
      };
      if (watchedProduct) {
        const productObj = products.find(
          (p) => p.product_name === watchedProduct
        );
        if (productObj && productObj.id === data.product_id.id) {
          setVarieties((prev) => [...prev, newVariety]);
        }
      }
      toast.success("Variety added successfully!");
    } catch (error) {
      console.error("Variety creation failed:", error);
      //toast.error(`Failed to add variety: Variety already exists`);
      throw error;
    }
  };

  const handleAddUnit = async (data) => {
    try {
      const response = await createUnit(data);
      const newUnit = {
        id: response?.data?.id || response.id || Date.now(),
        unit_name: data.unit_name,
      };
      setUnits((prev) => [...prev, newUnit]);
      toast.success("Unit added successfully!");
    } catch (error) {
      toast.error(`Failed to add unit: ${error.message}`);
      throw error;
    }
  };

  return (
    <div className="w-full bg-white">
      <div className="rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-4">Add Product</h2>
        <div className="grid grid-cols-[25.5%_23%_23%_23%] gap-4 border-b border-b-neutral-200 pb-6 mb-6">
          <div>
            <p className="text-[13px] ps-5 pb-1">Product</p>
            <Controller
              name="product"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => {
                    if (value === "add_new") {
                      setIsProductDialogOpen(true);
                      return;
                    }
                    field.onChange(value);
                    setValue("variety", "");
                    setValue("unit", "");
                  }}
                  value={field.value}
                >
                  <SelectTrigger className="border-neutral-400 text-xs">
                    <SelectValue placeholder="Select Product" />
                  </SelectTrigger>
                  <SelectContent className="text-black bg-white">
                    <SelectItem
                      value="add_new"
                      className="text-blue-600 font-semibold"
                    >
                      + Add New Product
                    </SelectItem>
                    {products
                      .filter(
                        (product) =>
                          product && product.id && product.product_name
                      )
                      .map((product) => (
                        <SelectItem
                          key={product.id}
                          value={product.product_name}
                        >
                          {product.product_name}
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
          </div>
          <div>
            <p className="text-[13px] ps-5 pb-1">Variety</p>
            <Controller
              name="variety"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => {
                    if (value === "add_new") {
                      setIsVarietyDialogOpen(true);
                      return;
                    }
                    field.onChange(value);
                  }}
                  value={field.value}
                  disabled={!watchedProduct || loadingVarieties}
                >
                  <SelectTrigger className="border-neutral-400 text-xs">
                    <SelectValue
                      placeholder={
                        loadingVarieties
                          ? "Loading varieties..."
                          : !watchedProduct
                          ? "Select product first"
                          : "Select Variety"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="text-black bg-white">
                    <SelectItem
                      value="add_new"
                      className="text-blue-600 font-semibold"
                    >
                      + Add New Variety
                    </SelectItem>
                    {varieties
                      .filter(
                        (variety) => variety && variety.id && variety.name
                      )
                      .map((variety) => (
                        <SelectItem key={variety.id} value={variety.name}>
                          {variety.name}
                        </SelectItem>
                      ))}
                    {varieties.length === 0 && (
                      <div className="px-2 py-1 text-xs text-black">
                        No varieties available
                      </div>
                    )}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div>
            <p className="text-[13px] ps-5">Brand (Optional)</p>
            <Input
              {...register("brand")}
              placeholder="Enter brand name"
              className="border-neutral-400 placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-md font-medium mb-3">
            Add Quantity Specifications
          </h3>
          <div className="flex gap-x-5 items-end">
            <div className="w-1/4">
              <p className="text-[13px] ps-5 pb-0.5">Count / size</p>
              <div className="flex w-full pe-[2.5px] overflow-hidden bg-white items-center border border-neutral-400 rounded-lg">
                <Input
                  type="number"
                  {...register("countSize")}
                  placeholder="count or Size"
                  className="w-full placeholder:text-xs text-xs border-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <div className="h-8 bg-black flex flex-col rounded-r-lg justify-center">
                  <div
                    className="px-3 text-white cursor-pointer"
                    onClick={() => updateCountSize(1)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="14px"
                      viewBox="0 -960 960 960"
                      width="14px"
                      fill="#FFFFFF"
                    >
                      <path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z" />
                    </svg>
                  </div>
                  <div
                    className="px-3 text-white cursor-pointer"
                    onClick={() => updateCountSize(-1)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="14px"
                      viewBox="0 -960 960 960"
                      width="14px"
                      fill="#FFFFFF"
                    >
                      <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-1/4">
              <p className="text-[13px] ps-5 pb-0.5">Quantity</p>
              <div className="flex w-full pe-[2.5px] overflow-hidden bg-white items-center border border-neutral-400 rounded-lg">
                <Input
                  type="number"
                  {...register("quantity")}
                  placeholder="Quantity"
                  className="w-full placeholder:text-xs text-xs border-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <div className="h-8 bg-black flex flex-col rounded-r-lg justify-center">
                  <div
                    className="px-3 text-white cursor-pointer"
                    onClick={() => updateQuantity(1)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="14px"
                      viewBox="0 -960 960 960"
                      width="14px"
                      fill="#FFFFFF"
                    >
                      <path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z" />
                    </svg>
                  </div>
                  <div
                    className="px-3 text-white cursor-pointer"
                    onClick={() => updateQuantity(-1)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="14px"
                      viewBox="0 -960 960 960"
                      width="14px"
                      fill="#FFFFFF"
                    >
                      <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-1/4">
              <p className="text-[13px] ps-5 pb-1">Unit</p>
              <Controller
                control={control}
                name="unit"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      if (value === "add_new") {
                        setIsUnitDialogOpen(true);
                        return;
                      }
                      field.onChange(value);
                    }}
                  >
                    <SelectTrigger className="border-neutral-400 text-xs">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent className="text-black bg-white">
                      <SelectItem
                        value="add_new"
                        className="text-blue-600 font-semibold"
                      >
                        + Add New Unit
                      </SelectItem>
                      {units
                        .filter((unit) => unit && unit.id && unit.unit_name)
                        .map((unit) => (
                          <SelectItem key={unit.id} value={unit.unit_name}>
                            {unit.unit_name}
                          </SelectItem>
                        ))}
                      {units.length === 0 && (
                        <div className="px-2 py-1 text-xs text-black">
                          No units available
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <button
              type="button"
              onClick={addQuantitySpec}
              className="bg-black text-white flex items-center justify-center text-xs rounded-md px-4 h-9"
            >
              Add Quantity
            </button>
          </div>
        </div>

        <div className="grid grid-cols-[25%_25%_25%_auto] gap-4 border-b border-b-neutral-200 pb-6 mb-6">
          <div>
            <p className="text-[13px] ps-5 pb-1">Currency</p>
            <Controller
              name="currency"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="border-neutral-400 text-xs">
                    <SelectValue placeholder="Currency" />
                  </SelectTrigger>
                  <SelectContent className="text-black bg-white">
                    {currencies.map((currency) => (
                      <SelectItem
                        key={currency.id}
                        value={currency.currency_code}
                      >
                        {currency.currency_code?.trim()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div>
            <p className="text-[13px] ps-5 pb-1">Quantity</p>
            <div className="border border-neutral-400 rounded-lg px-3 py-1.5 bg-gray-50">
              <span className="text-xs text-gray-600">
                {calculateAutoUnit() || "Add quantity specifications"}
              </span>
            </div>
          </div>
          <div>
            <p className="text-[13px] ps-5 pb-1">Unit Price</p>
            <Input
              {...register("unitPrice")}
              type="number"
              min="0"
              step="0.01"
              placeholder="Unit price"
              className="border-neutral-400 placeholder:text-xs text-xs rounded-lg focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <div>
            <p className="text-[13px] ps-5 pb-1">Total Amount</p>
            <div className="border border-neutral-400 rounded-lg px-3 py-1.5 bg-gray-50">
              <span className="text-xs font-medium">
                {watch("currency")} {calculateTotalAmount()}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-md font-medium mb-3">
            Add Weight Specifications
          </h3>
          <div className="flex gap-x-5 items-end">
            <div className="w-1/4">
              <p className="text-[13px] ps-5 pb-0.5">Net Weight</p>
              <div className="flex w-full pe-[2.5px] overflow-hidden bg-white items-center border border-neutral-400 rounded-lg">
                <Input
                  type="number"
                  {...register("netWeight")}
                  step="0.01"
                  placeholder="Net Weight"
                  className="w-full placeholder:text-xs text-xs border-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <div className="h-8 bg-black flex flex-col rounded-r-lg justify-center">
                  <div
                    className="px-3 text-white cursor-pointer"
                    onClick={() => updateNetWeight(0.1)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="14px"
                      viewBox="0 -960 960 960"
                      width="14px"
                      fill="#FFFFFF"
                    >
                      <path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z" />
                    </svg>
                  </div>
                  <div
                    className="px-3 text-white cursor-pointer"
                    onClick={() => updateNetWeight(-0.1)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="14px"
                      viewBox="0 -960 960 960"
                      width="14px"
                      fill="#FFFFFF"
                    >
                      <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-1/4">
              <p className="text-[13px] ps-5 pb-1">Weight Unit</p>
              <Controller
                control={control}
                name="weightUnit"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="border-neutral-400 text-xs">
                      <SelectValue placeholder="Select weight unit" />
                    </SelectTrigger>
                    <SelectContent className="text-black bg-white">
                      {units.map((unit) => (
                        <SelectItem key={unit.id} value={unit.unit_name}>
                          {unit.unit_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <button
              type="button"
              onClick={addWeightSpec}
              className="bg-black text-white flex items-center justify-center text-xs rounded-md px-4 h-9"
            >
              Add Weight
            </button>
          </div>
        </div>
        {currentProductSpecs.length > 0 && (
          <div className="mb-6">
            <h3 className="text-md font-medium mb-3">
              Current Product Specifications
            </h3>
            <div className="flex flex-wrap gap-2">
              {currentProductSpecs.map((spec) => (
                <div
                  key={spec.id}
                  className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-3 py-1"
                >
                  {spec.type === "quantity" ? (
                    <span className="text-xs">
                      <span className="font-medium">{spec.quantity}</span>{" "}
                      {spec.unit}
                    </span>
                  ) : (
                    <span className="text-xs">
                      <span className="font-medium">{spec.netWeight}</span>{" "}
                      {spec.weightUnit}
                    </span>
                  )}
                  <button
                    onClick={() => removeSpec(spec.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={addProductToSelection}
            className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-md text-sm font-medium"
          >
            Add Product to Selection
          </button>
        </div>
      </div>
      {selectedProducts.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Selected Products</h2>
            <div className="text-sm text-gray-600">
              <span className="mr-4">
                Total Items: {selectedProducts.length}
              </span>
              <span className="font-semibold text-black">
                Grand Total: {selectedProducts[0]?.currency || "USD"}{" "}
                {selectedProducts
                  .reduce(
                    (total, product) => total + parseFloat(product.totalAmount),
                    0
                  )
                  .toFixed(2)}
              </span>
            </div>
          </div>
          <div className="space-y-4">
            {selectedProducts.map((product, index) => (
              <div
                key={product.id}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 uppercase">
                      {index + 1}. {product.product} - {product.variety}
                      {product.brand && (
                        <span className="text-gray-600">
                          {" "}
                          ({product.brand})
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center gap-4 mt-2">

                      <span className="text-xs bg-blue-100 px-2 py-1 rounded uppercase">
                        Quantity: &nbsp;
                        {(() => {
                          const quantitySpecs = product.specifications.filter(
                            (spec) => spec.type === "quantity"
                          );
                          if (quantitySpecs.length > 0) {
                            return quantitySpecs
                              .map((spec) => `${spec.quantity} ${spec.unit}`)
                              .join(", ");
                          }
                          return "N/A";
                        })()}
                      </span>
                      <span className="text-xs bg-green-100 px-2 py-1 rounded uppercase">
                        Unit Price: {product.currency} {product.unitPrice}
                      </span>
                      <span className="text-xs bg-yellow-100 px-2 py-1 rounded font-semibold uppercase">
                        Total: {product.currency} {product.totalAmount}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeProduct(product.id)}
                    className="text-red-500 hover:text-red-700 text-sm ml-4"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-2">
                      Count / Size Specifications:
                    </p>
                    <div className="space-y-1 uppercase">
                      {product.specifications
                        .filter((spec) => spec.type === "quantity" && spec.countSize)
                        .map((spec, specIndex) => (
                          <div
                            key={specIndex}
                            className="bg-purple-100 rounded-full px-3 py-1 text-xs inline-block mr-2"
                          >
                            {spec.countSize}
                          </div>
                        ))}
                      {product.specifications.filter(
                        (spec) => spec.type === "quantity" && spec.countSize
                      ).length === 0 && (
                        <span className="text-xs text-gray-400">
                          No count/size specifications
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-2">
                      Quantity Specifications:
                    </p>
                    <div className="space-y-1 uppercase">
                      {product.specifications
                        .filter((spec) => spec.type === "quantity")
                        .map((spec, specIndex) => (
                          <div
                            key={specIndex}
                            className="bg-blue-100 rounded-full px-3 py-1 text-xs inline-block mr-2"
                          >
                            {spec.quantity} {spec.unit}
                          </div>
                        ))}
                      {product.specifications.filter(
                        (spec) => spec.type === "quantity"
                      ).length === 0 && (
                        <span className="text-xs text-gray-400">
                          No quantity specifications
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-2">
                      Weight Specifications:
                    </p>
                    <div className="space-y-1 uppercase">
                      {product.specifications
                        .filter((spec) => spec.type === "weight")
                        .map((spec, specIndex) => (
                          <div
                            key={specIndex}
                            className="bg-green-100 rounded-full px-3 py-1 text-xs inline-block mr-2"
                          >
                            {spec.netWeight} {spec.weightUnit}
                          </div>
                        ))}
                      {product.specifications.filter(
                        (spec) => spec.type === "weight"
                      ).length === 0 && (
                        <span className="text-xs text-gray-400">
                          No weight specifications
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <ProductDialog
        open={isProductDialogOpen}
        onClose={() => setIsProductDialogOpen(false)}
        onSave={handleAddProduct}
      />
      <VarietyDialog
        open={isVarietyDialogOpen}
        onOpenChange={setIsVarietyDialogOpen}
        onSave={handleAddVariety}
        products={products}
      />
      <UnitDialog
        open={isUnitDialogOpen}
        onOpenChange={setIsUnitDialogOpen}
        onSave={handleAddUnit}
      />
    </div>
  );
}

export default ProductSelection;
