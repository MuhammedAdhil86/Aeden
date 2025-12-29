import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Controller } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import ProductSpecifications from "./ProductSpecifications";
import { getAllProducts, fetchVarityByProductId } from "@/service/procurements";
import { toast } from "react-toastify";
import {createUnit} from "@/service/procurements";

function ProductSelectionForm({
  register,
  control,
  setValue,
  watch,
  products,
  setProducts,
  units,
  currencies,
  selectedProducts,
  setSelectedProducts,
}) {
  const [varieties, setVarieties] = useState([]);
  const [loadingVarieties, setLoadingVarieties] = useState(false);
  const [currentProductSpecs, setCurrentProductSpecs] = useState([]);

  const watchedProduct = watch("product");
  const watchedVariety = watch("variety");
  const watchedUnitPrice = watch("unitPrice");

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (watchedProduct) {
      fetchVarieties();
    } else {
      setVarieties([]);
    }
  }, [watchedProduct, products]);

  const fetchProducts = async () => {
    try {
      const res = await getAllProducts();
      setProducts(res?.data || []);
    } catch (err) {
      console.error("Fetch products error", err);
      toast.error("Failed to load products.");
    }
  };

  const fetchVarieties = async () => {
    const productObj = products.find((p) => p.product_name === watchedProduct);
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
  };

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

  const addProductToSelection = () => {
    const autoUnit = calculateAutoUnit();

    if (!watchedProduct) {
      alert("Please select a product");
      return;
    }
    if (!watchedVariety) {
      alert("Please select a variety");
      return;
    }
    if (
      currentProductSpecs.filter((spec) => spec.type === "quantity").length === 0
    ) {
      alert("Please add at least one quantity specification");
      return;
    }
    if (!watchedUnitPrice) {
      alert("Please enter unit price");
      return;
    }

    const newProduct = {
      id: Date.now(),
      product: watchedProduct,
      variety: watchedVariety,
      brand: watch("brand"),
      autoUnit: autoUnit,
      currency: watch("currency") || "USD",
      unitPrice: parseFloat(watchedUnitPrice).toFixed(2),
      totalAmount: parseFloat(calculateTotalAmount()).toFixed(2),
      specifications: [...currentProductSpecs],
    };

    setSelectedProducts([...selectedProducts, newProduct]);

    // Reset product fields
    setValue("product", "");
    setValue("variety", "");
    setValue("brand", "");
    setValue("currency", "");
    setValue("unitPrice", "");
    setCurrentProductSpecs([]);
  };

  return (
    <div className="w-full bg-white">
      <div className="rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-4">Add Product</h2>

        {/* Product Selection Row */}
        <div className="grid grid-cols-[25.5%_23%_23%_23%] gap-4 border-b border-b-neutral-200 pb-6 mb-6">
          <div>
            <p className="text-[13px] ps-5 pb-1">Product</p>
            <Controller
              name="product"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setValue("variety", "");
                  }}
                  value={field.value}
                >
                  <SelectTrigger className="border-neutral-400 text-xs">
                    <SelectValue placeholder="Select Product" />
                  </SelectTrigger>
                  <SelectContent className="text-black bg-white">
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.product_name}>
                        {product.product_name}
                      </SelectItem>
                    ))}
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
                  onValueChange={field.onChange}
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
                    {varieties.map((variety) => (
                      <SelectItem key={variety.id} value={variety.name}>
                        {variety.name}
                      </SelectItem>
                    ))}
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

        {/* Pricing Section */}
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
                      <SelectItem key={currency.id} value={currency.currency_code}>
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

        <ProductSpecifications
          register={register}
          control={control}
          setValue={setValue}
          watch={watch}
          units={units}
          currentProductSpecs={currentProductSpecs}
          setCurrentProductSpecs={setCurrentProductSpecs}
        />

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
    </div>
  );
}

export default ProductSelectionForm;