"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";
import {
  fetchCountry,
  fetchVarity,
  getAllCategories,
} from "@/service/procurements";
import { fetchBlType, fetchExporterByUinId } from "@/service/booking";

export default function Step1({ register, errors, watch, control, setValue }) {
  const isYes = watch("filter") === "Yes";
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [bltype, setBlType] = useState([]);
  const [countries, setCountries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getAllProducts();
      setCategories(res?.data || []);
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  const handleAddCategory = async () => {
    try {
      if (!newCategory.trim()) return;
      await createCategory({ category_name: newCategory });

      setValue("category", "");

      setNewCategory("");
      setShowInput(false);
      await fetchCategories();

      toast.success("Category added successfully");
    } catch (err) {
      console.error("Add category error", err);
      toast.error("Failed to add category");
    }
  };

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const res = await fetchVarity();
        setProducts(res?.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    getAllProducts();
  }, []);

  const handleSelectChange = (val) => {
    if (val === "add_new") {
      setIsDialogOpen(true);
    } else {
      setValue("product", val);
    }
  };

  // useEffect(() => {
  //   const getAllProducts = async () => {
  //     try {
  //       const res = await fetchVarity();
  //       setProducts(res?.data || []);
  //     } catch (err) {
  //       console.error("Error fetching products:", err);
  //     }
  //   };

  //   getAllProducts();
  // }, []);

  useEffect(() => {
    const getBlData = async () => {
      try {
        const res = await fetchBlType();
        setBlType(res.data);
      } catch (error) {
        console.error("Failed to fetch Bl Type:", error);
      }
    };

    getBlData();
  }, []);

  useEffect(() => {
    const getCountries = async () => {
      try {
        const res = await fetchCountry();
        setCountries(res.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    getCountries();
  }, []);

  const handleSelect = (value) => {
    if (!selectedProducts.includes(value)) {
      setSelectedProducts([...selectedProducts, value]);
    }
  };

  const handleRemove = (value) => {
    setSelectedProducts(selectedProducts.filter((item) => item !== value));
  };

  return (
    <div className="grid grid-cols-4 gap-8">
      <div>
        <p className="text-[13px] ps-5 pb-1 text-black">UIN ID</p>
        <Input
          {...register("uinId", {
            required: "UIN ID is required",
          })}
          placeholder="Enter UIN ID"
          className="border-neutral-400 placeholder:text-xs text-xs rounded-lg mt-1"
        />
        {errors.uinId && (
          <p className="text-red-500 text-xs mt-1">{errors.uinId.message}</p>
        )}
      </div>

      <div>
        <p className="text-[13px] ps-5 pb-1 text-black">Exporter Name</p>
        {/* <Input
          {...register("exporterName", {
            required: "Exporter Name is required",
          })}
          placeholder="Enter name"
          disabled
          value={watch("exporterName") || ""}
          className='border-neutral-400 placeholder:text-xs text-xs text-black rounded-lg mt-1
          '
        /> */}
        <Input
          {...register("exporterName", {
            required: "Exporter Name is required",
          })}
          placeholder="Enter name"
          className="border-neutral-400 placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        {errors.exporterName && (
          <p className="text-red-500 text-xs mt-1">
            {errors.exporterName.message}
          </p>
        )}
      </div>
      <div>
        <p className="text-[13px] ps-5 pb-1 text-black">Consignee</p>
        <Input
          {...register("consignee", { required: "Consignee is required" })}
          placeholder="Enter consignee"
          className="border-neutral-400 placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        {errors.consignee && (
          <p className="text-red-500 text-xs mt-1">
            {errors.consignee.message}
          </p>
        )}
      </div>
      <div>
        <p className="text-[13px] ps-5 pb-1 text-black">Invoice number</p>
        <Input
          {...register("invoiceNumber", {
            required: "Invoice number is required",
          })}
          placeholder="Enter number"
          className="border-neutral-400 placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        {errors.invoiceNumber && (
          <p className="text-red-500 text-xs mt-1">
            {errors.invoiceNumber.message}
          </p>
        )}
      </div>
      <div>
        <p className="text-[13px] ps-5 pb-1 text-black">Invoice Amount</p>
        <Input
          {...register("invoiceAmount")}
          //   {
          //     required: "Invoice Amount is required",
          //   }
          placeholder="Enter Amount"
          className="border-neutral-400 placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        {errors.consignee && (
          <p className="text-red-500 text-xs mt-1">
            {errors.consignee.message}
          </p>
        )}
      </div>
      <div>
        <p className="text-[13px] ps-5 pb-1 text-black">BL number</p>
        <Input
          {...register("BiNumber")}
          //   { required: "BL number is required" }
          placeholder="Enter number"
          className="border-neutral-400 placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        {errors.BiNumber && (
          <p className="text-red-500 text-xs mt-1">{errors.BiNumber.message}</p>
        )}
      </div>
      <div>
        <Controller
          name="bltype"
          control={control}
          render={({ field }) => (
            <div>
              <p className="text-[13px] ps-5">BL Type</p>
              <Select
                onValueChange={(selectedId) => {
                  field.onChange(selectedId);

                  const selectedBL = bltype.find(
                    (bl) => bl.id.toString() === selectedId
                  );

                  // Set the BL type name in the form
                  setValue("bltype_name", selectedBL?.types || "");
                }}
                value={field.value}
              >
                <SelectTrigger className="border-neutral-400 placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                  <SelectValue placeholder="Select Bl Type" />
                </SelectTrigger>
                <SelectContent className="text-black bg-white">
                  {bltype.map((bl) => (
                    <SelectItem key={bl.id} value={String(bl.id)}>
                      {bl.types}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        />

        {errors.bltype && (
          <p className="text-red-500 text-xs mt-1">{errors.bltype.message}</p>
        )}
      </div>
      <div className="w-full flex flex-col">
        <p className="text-[13px] ps-5 pb-1 text-black">Is Switch BL</p>
        <label
          className="switch w-full rounded-md flex items-center cursor-pointer border p-0.5"
          aria-label="Toggle Filter"
        >
          <input
            type="checkbox"
            id="filter"
            onChange={(e) =>
              setValue("filter", e.target.checked ? "Yes" : "No")
            }
            checked={isYes}
            className="hidden"
          />

          <p
            className={`flex justify-center w-28 rounded-md py-2 text-xs ${
              isYes ? "bg-black text-white" : "text-gray-500"
            }`}
          >
            Yes
          </p>
          <p
            className={`flex justify-center w-28 rounded-md text-xs py-2 ${
              !isYes ? "bg-black text-white" : "text-gray-500"
            }`}
          >
            No
          </p>
        </label>
      </div>
      <div>
        <p
          className={`text-[13px] ps-5 pb-1 ${
            !isYes ? "text-neutral-400" : "text-black"
          } `}
        >
          Place of switch
        </p>
        <Controller
          name="country_id"
          control={control}
          rules={{ required: "place of switch is required" }}
          render={({ field }) => (
            <Select
              disabled={!isYes}
              value={field.value}
              onValueChange={(selectedId) => {
                field.onChange(selectedId);

                // Find the selected country name
                const selectedCountry = countries.find(
                  (country) => country.id.toString() === selectedId
                );

                // Set the country name in the form
                setValue("country_name", selectedCountry?.country_name || "");
              }}
            >
              <SelectTrigger
                className={`border-neutral-400 rounded-lg text-xs mt-1 text-black ${
                  !isYes
                    ? "opacity-50 cursor-not-allowed !text-black bg-gray-100"
                    : ""
                }`}
              >
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent className="text-black bg-white">
                {countries.map((country) => (
                  <SelectItem key={country.id} value={country.id.toString()}>
                    {country.country_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div>
        <p className="text-[13px] ps-5 pb-1 text-black">ETA</p>
        {/* <Input
          {...register("eta")}
             { required: "ETA/ATA is required" }
          placeholder="ETA/ATA"
          className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        /> */}
        <div className="relative w-full">
          <Input
            {...register("etaDate")}
            // {
            //   required: "Last Updated ETA is required",
            // }
            id="etaDateInput"
            type="date"
            className="border-neutral-400 text-black placeholder:text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none pr-10
                  [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none"
          />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              const etaDateInput = document.getElementById("etaDateInput");
              if (etaDateInput) {
                etaDateInput.showPicker();
              }
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-calendar-days"
            >
              <path d="M8 2v4" />
              <path d="M16 2v4" />
              <rect width="18" height="18" x="3" y="4" rx="2" />
              <path d="M3 10h18" />
              <path d="M8 14h.01" />
              <path d="M12 14h.01" />
              <path d="M16 14h.01" />
              <path d="M8 18h.01" />
              <path d="M12 18h.01" />
              <path d="M16 18h.01" />
            </svg>
          </button>
        </div>
        {errors.eta && (
          <p className="text-red-500 text-xs mt-1">{errors.eta.message}</p>
        )}
      </div>
      <div>
        <p className="text-[13px] ps-5 pb-1 text-black">ATA</p>
        <div className="relative w-full">
          <Input
            {...register("etaDate")}
            // {
            //   required: "Last Updated ETA is required",
            // }
            id="etaDate"
            type="date"
            className="border-neutral-400 text-black placeholder:text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none pr-10
                  [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none"
          />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              const etaDate = document.getElementById("etaDate");
              if (etaDate) {
                etaDate.showPicker();
              }
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-calendar-days"
            >
              <path d="M8 2v4" />
              <path d="M16 2v4" />
              <rect width="18" height="18" x="3" y="4" rx="2" />
              <path d="M3 10h18" />
              <path d="M8 14h.01" />
              <path d="M12 14h.01" />
              <path d="M16 14h.01" />
              <path d="M8 18h.01" />
              <path d="M12 18h.01" />
              <path d="M16 18h.01" />
            </svg>
          </button>
        </div>
        {errors.etaDate && (
          <p className="text-red-500 text-xs mt-1">{errors.etaDate.message}</p>
        )}
      </div>
      <div>
        <p className="text-[13px] ps-5 pb-1 text-black">Free days</p>
        <Input
          {...register("freeDays")}
          //   { required: "Free days is required" }
          placeholder="Enter number"
          className="border-neutral-400 placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        {errors.freeDays && (
          <p className="text-red-500 text-xs mt-1">{errors.freeDays.message}</p>
        )}
      </div>
      <div>
        <p className="text-[13px] ps-5 pb-1 text-black">
          Detention period end date
        </p>
        <div className="relative w-full">
          <Input
            {...register("endDate")}
            // {
            //     required: "endDate is required",
            //   }
            id="endDate"
            type="date"
            className="border-neutral-400 text-black placeholder:text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none pr-10
                  [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none"
          />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              const endDate = document.getElementById("endDate");
              if (endDate) {
                endDate.showPicker();
              }
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-calendar-days"
            >
              <path d="M8 2v4" />
              <path d="M16 2v4" />
              <rect width="18" height="18" x="3" y="4" rx="2" />
              <path d="M3 10h18" />
              <path d="M8 14h.01" />
              <path d="M12 14h.01" />
              <path d="M16 14h.01" />
              <path d="M8 18h.01" />
              <path d="M12 18h.01" />
              <path d="M16 18h.01" />
            </svg>
          </button>
        </div>
        {errors.endDate && (
          <p className="text-red-500 text-xs mt-1">{errors.endDate.message}</p>
        )}
      </div>
      <div>
        <p className="text-[13px] ps-5 pb-1">Country</p>
        <Input
          {...register("country")}
          readOnly
          placeholder="country"
          value={watch("country") || ""}
          className="border-neutral-400 bg-blue-50 placeholder:text-xs text-xs text-black rounded-lg mt-1 cursor-not-allowed
          "
        />
        {errors.country && (
          <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>
        )}
      </div>
      <div>
        <p className="text-[13px] ps-5 pb-1">Category</p>
        <Input
          {...register("category")}
          readOnly
          placeholder="category"
          value={watch("category") || ""}
          className="border-neutral-400 bg-blue-50 placeholder:text-xs text-xs text-black rounded-lg mt-1 cursor-not-allowed
          "
        />
      </div>

      <div>
        <p className="text-[13px] ps-5">Product</p>

        <Input
          {...register("product")}
          readOnly
          placeholder="product"
          value={watch("product") || ""}
          className="border-neutral-400 bg-blue-50 placeholder:text-xs text-xs text-black rounded-lg mt-1 cursor-not-allowed
          "
        />
      </div>
      <div className="w-full flex items-center gap-2">
        {selectedProducts.map((product) => {
          const label = productOptions.find((p) => p.value === product)?.label;
          return (
            <div
              key={product}
              className="flex items-center border text-xs h-7 px-2 rounded-full text-black"
            >
              {label}
              <button onClick={() => handleRemove(product)} className="ml-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="16px"
                  viewBox="0 -960 960 960"
                  width="16px"
                  fill="#000"
                >
                  <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
      {errors.product && (
        <p className="text-red-500 text-xs mt-1">{errors.product.message}</p>
      )}

      {/* <div className="border border-neutral-400 rounded-lg text-xs mt-5 flex w-full justify-center items-center gap-x-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="16px"
          viewBox="0 -960 960 960"
          width="16px"
          fill="#000"
        >
          <path d="M320-280q17 0 28.5-11.5T360-320q0-17-11.5-28.5T320-360q-17 0-28.5 11.5T280-320q0 17 11.5 28.5T320-280Zm0-160q17 0 28.5-11.5T360-480q0-17-11.5-28.5T320-520q-17 0-28.5 11.5T280-480q0 17 11.5 28.5T320-440Zm0-160q17 0 28.5-11.5T360-640q0-17-11.5-28.5T320-680q-17 0-28.5 11.5T280-640q0 17 11.5 28.5T320-600Zm120 320h240v-80H440v80Zm0-160h240v-80H440v80Zm0-160h240v-80H440v80ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z" />
        </svg>
        <p className="text-[13px] text-black">View Added Product</p>
      </div> */}
    </div>
  );
}
