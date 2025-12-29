"use client";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { createSupplier, getAllSuppliers, createCountry, fetchCountry } from "@/service/procurements";

function SupplierInfo({
  control,
  suppliers,
  setSuppliers,
  handleSupplierChange,
  setValue,
  errors,
  countries,
  setCountries, // Add setCountries to props
  register,
}) {
  const [isSupplierDialogOpen, setIsSupplierDialogOpen] = useState(false);
  const [isCountryDialogOpen, setIsCountryDialogOpen] = useState(false);

  // Separate form for the supplier dialog
  const {
    register: supplierDialogRegister,
    handleSubmit: handleSupplierDialogSubmit,
    control: supplierDialogControl,
    reset: supplierDialogReset,
    formState: { errors: supplierDialogErrors },
  } = useForm();

  // Separate form for the country dialog
  const {
    register: countryDialogRegister,
    handleSubmit: handleCountryDialogSubmit,
    reset: countryDialogReset,
    formState: { errors: countryDialogErrors },
  } = useForm({
    defaultValues: {
      country_name: "",
      country_code: "",
      currency_code: "",
    },
  });

  const onSupplierDialogSubmit = async (data) => {
    try {
      // Create the supplier via API
      const newSupplier = await createSupplier({
        party_name: data.party_name,
        address: data.address,
        zipcode: data.zipcode,
        email: data.email,
        country_name: data.country_name,
        phone: `${data.dialing_code}${data.phone}`,
      });

      // Update suppliers list
      const suppliersRes = await getAllSuppliers();
      const updatedSuppliers = suppliersRes?.data?.data || [];
      setSuppliers(updatedSuppliers);
      toast.success("Supplier added successfully!");

      // Close dialog and reset form
      setIsSupplierDialogOpen(false);
      supplierDialogReset();
    } catch (err) {
      console.error("Error adding supplier:", err);
      toast.error(err.message || "Failed to add supplier.");
    }
  };

  const onCountryDialogSubmit = async (data, event) => {
    event.preventDefault(); // Prevent default form submission
    event.stopPropagation(); // Stop event from bubbling to parent form

    try {
      // Create the country via API
      const newCountry = await createCountry({
        country_name: data.country_name,
        country_code: data.country_code,
        currency_code: data.currency_code,
      });

      // Update countries list
      const countriesRes = await fetchCountry();
      const updatedCountries = countriesRes?.data || [];
      setCountries(updatedCountries);
      toast.success("Country added successfully!");

      // Optionally auto-select the new country
      supplierDialogControl._formValues.country_name = data.country_name;

      // Close dialog and reset form
      setIsCountryDialogOpen(false);
      countryDialogReset();
    } catch (err) {
      console.error("Error adding country:", err);
      toast.error(err.message || "Failed to add country.");
    }
  };

  return (
    <div className="grid grid-rows-2 grid-flow-col gap-7 border-b border-b-neutral-200 pb-10">
      <div>
        <p className="text-[13px] ps-5 pb-1">Supplier</p>
        <Controller
          name="partyName"
          control={control}
          rules={{ required: "Supplier is required" }}
          render={({ field }) => (
            <Select
              onValueChange={(value) => {
                if (value === "add_new") {
                  setIsSupplierDialogOpen(true);
                } else {
                  field.onChange(value);
                  handleSupplierChange(value);
                }
              }}
              value={field.value}
            >
              <SelectTrigger className="border-neutral-400 text-xs uppercase">
                <SelectValue placeholder="Select Supplier" />
              </SelectTrigger>
              <SelectContent className="text-black bg-white">
                <SelectItem
                  value="add_new"
                  className="text-blue-600 font-semibold"
                >
                  + Add New Supplier
                </SelectItem>
                {suppliers
                  .filter(
                    (supplier) =>
                      supplier &&
                      supplier.party_name &&
                      supplier.party_name.trim() !== ""
                  )
                  .map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.party_name}>
                      {supplier.party_name}
                    </SelectItem>
                  ))}
                {suppliers.length === 0 && (
                  <div className="px-2 py-1 text-xs text-black">
                    No suppliers available
                  </div>
                )}
              </SelectContent>
            </Select>
          )}
        />
        {errors.partyName && (
          <p className="text-red-500 text-xs mt-1">
            {errors.partyName.message}
          </p>
        )}
      </div>
      <div>
        <p className="text-[13px] ps-5">Mobile Number</p>
        <Input
          {...register("mobile")}
          type="text"
          placeholder="Mobile number"
          required
          className="border-neutral-400 placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 cursor-not-allowed"
        />
      </div>
      <div>
        <p className="text-[13px] ps-5 pb-1 text-black">Country</p>
        <Input
          {...register("country")}
          type="text"
          placeholder="Country"
          readOnly
          className="border-neutral-400 placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 cursor-not-allowed"
        />
      </div>
      <div>
        <p className="text-[13px] ps-5">Email</p>
        <Input
          {...register("email")}
          type="email"
          placeholder="Enter email"
          required
          readOnly
          className="border-neutral-400 placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 cursor-not-allowed"
        />
      </div>
      <div className="row-span-2 flex flex-col">
        <p className="text-[13px] ps-5">Address</p>
        <Textarea
          {...register("address")}
          placeholder="Address"
          readOnly
          className="flex-1 resize-none border-neutral-400 placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 cursor-not-allowed"
        />
      </div>
      <div>
        <p className="text-[13px] ps-5">Zip</p>
        <Input
          {...register("zip")}
          type="text"
          placeholder="Zip"
          required
          readOnly
          className="border-neutral-400 placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 cursor-not-allowed"
        />
      </div>

      {/* Add Supplier Dialog */}
      <Dialog open={isSupplierDialogOpen} onOpenChange={setIsSupplierDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white text-black">
          <DialogHeader>
            <DialogTitle>Add New Supplier</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleSupplierDialogSubmit(onSupplierDialogSubmit)}
            className="space-y-4"
          >
            <div>
              <label className="text-[13px] ps-1">Party Name</label>
              <Input
                {...supplierDialogRegister("party_name", {
                  required: "Party name is required",
                })}
                placeholder="Enter party name"
                className="border-neutral-400 text-xs rounded-lg mt-1"
              />
              {supplierDialogErrors.party_name && (
                <p className="text-red-500 text-xs mt-1">
                  {supplierDialogErrors.party_name.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-[13px] ps-1">Address</label>
              <Input
                {...supplierDialogRegister("address", {
                  required: "Address is required",
                })}
                placeholder="Enter address"
                className="border-neutral-400 text-xs rounded-lg mt-1"
              />
              {supplierDialogErrors.address && (
                <p className="text-red-500 text-xs mt-1">
                  {supplierDialogErrors.address.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-[13px] ps-1">Zipcode</label>
              <Input
                {...supplierDialogRegister("zipcode", {
                  required: "Zipcode is required",
                })}
                placeholder="Enter zipcode"
                className="border-neutral-400 text-xs rounded-lg mt-1"
              />
              {supplierDialogErrors.zipcode && (
                <p className="text-red-500 text-xs mt-1">
                  {supplierDialogErrors.zipcode.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-[13px] ps-1">Email</label>
              <Input
                {...supplierDialogRegister("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
                type="email"
                placeholder="Enter email"
                className="border-neutral-400 text-xs rounded-lg mt-1"
              />
              {supplierDialogErrors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {supplierDialogErrors.email.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-[13px] ps-1">Country</label>
              <Controller
                name="country_name"
                control={supplierDialogControl}
                rules={{ required: "Country is required" }}
                render={({ field }) => (
                  <>
                    <Select
                      onValueChange={(value) => {
                        if (value === "add_new") {
                          setIsCountryDialogOpen(true);
                          return;
                        }
                        field.onChange(value);
                      }}
                      value={field.value}
                      className="border-neutral-400 bg-white text-xs rounded-lg mt-1"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent className="text-black bg-white">
                        <SelectItem value="add_new" className="text-blue-600 font-semibold">
                          + Add New Country
                        </SelectItem>
                        {countries.length > 0 ? (
                          countries.map((country) => (
                            <SelectItem
                              key={country.id}
                              value={country.country_name}
                            >
                              {country.country_name}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="px-2 py-1 text-xs text-black">
                            No countries available
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    {supplierDialogErrors.country_name && (
                      <p className="text-red-500 text-xs mt-1">
                        {supplierDialogErrors.country_name.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
            <div>
              <label className="text-[13px] ps-1">Dialing Code</label>
              <Input
                {...supplierDialogRegister("dialing_code", {
                  required: "Dialing code is required",
                })}
                placeholder="Enter dialing code (e.g., +91)"
                className="border-neutral-400 text-xs rounded-lg mt-1"
              />
              {supplierDialogErrors.dialing_code && (
                <p className="text-red-500 text-xs mt-1">
                  {supplierDialogErrors.dialing_code.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-[13px] ps-1">Phone</label>
              <Input
                {...supplierDialogRegister("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^\d{10}$/,
                    message: "Phone number must be 10 digits",
                  },
                })}
                placeholder="Enter phone number"
                className="border-neutral-400 text-xs rounded-lg mt-1"
              />
              {supplierDialogErrors.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {supplierDialogErrors.phone.message}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  supplierDialogReset();
                  setIsSupplierDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-black text-white">
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Country Dialog */}
      <Dialog open={isCountryDialogOpen} onOpenChange={setIsCountryDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white text-black">
          <DialogHeader>
            <DialogTitle>Add New Country</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleCountryDialogSubmit(onCountryDialogSubmit)}
            className="space-y-4"
          >
            <div>
              <label className="text-[13px] ps-1">Country Name</label>
              <Input
                {...countryDialogRegister("country_name", {
                  required: "Country name is required",
                })}
                placeholder="Enter country name"
                className="border-neutral-400 text-xs rounded-lg mt-1"
              />
              {countryDialogErrors.country_name && (
                <p className="text-red-500 text-xs mt-1">
                  {countryDialogErrors.country_name.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-[13px] ps-1">Country Code</label>
              <Input
                {...countryDialogRegister("country_code", {
                  required: "Country code is required",
                  pattern: {
                    value: /^\+\d{1,3}$/,
                    message: "Country code must be in the format +[1-3 digits] (e.g., +12)",
                  },
                })}
                placeholder="Enter country code (e.g., +12)"
                className="border-neutral-400 text-xs rounded-lg mt-1"
              />
              {countryDialogErrors.country_code && (
                <p className="text-red-500 text-xs mt-1">
                  {countryDialogErrors.country_code.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-[13px] ps-1">Currency Code</label>
              <Input
                {...countryDialogRegister("currency_code", {
                  required: "Currency code is required",
                })}
                placeholder="Enter currency code (e.g., JPY)"
                className="border-neutral-400 text-xs rounded-lg mt-1"
              />
              {countryDialogErrors.currency_code && (
                <p className="text-red-500 text-xs mt-1">
                  {countryDialogErrors.currency_code.message}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="text-red-500"
                onClick={() => {
                  countryDialogReset();
                  setIsCountryDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-black text-white">
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SupplierInfo;