import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Controller, useForm } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { fetchSupplierById, createSupplier, getAllSuppliers, createCountry } from "@/service/procurements";
import { toast } from "react-toastify";

const CountryDialog = ({ open, onClose, onSave }) => {
  const {
    control: countryControl,
    handleSubmit: handleCountrySubmit,
    register: countryRegister,
    formState: { errors: countryErrors },
    reset: countryReset,
  } = useForm({
    defaultValues: {
      country_name: "",
      country_code: "",
      currency_code: "",
    },
  });

  const onCountrySubmit = async (data, event) => {
    event.preventDefault(); // Prevent default form submission
    event.stopPropagation(); // Stop event from bubbling to parent form

    try {
      await onSave({
        country_name: data.country_name,
        country_code: data.country_code,
        currency_code: data.currency_code,
      });
      countryReset();
      onClose();
      toast.success("Country added successfully!");
    } catch (error) {
      toast.error(`Failed to add country: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose} onClick={(e) => e.stopPropagation()}>
      <DialogContent className="sm:max-w-[425px] bg-white text-black">
        <DialogHeader>
          <DialogTitle>Add New Country</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault(); // Prevent default at form level
            e.stopPropagation(); // Stop propagation at form level
            handleCountrySubmit(onCountrySubmit)(e);
          }}
          className="space-y-4"
        >
          <div>
            <label className="text-[13px] ps-1">Country Name</label>
            <Input
              {...countryRegister("country_name", {
                required: "Country name is required",
              })}
              placeholder="Enter country name"
              className="border-neutral-400 text-xs rounded-lg mt-1"
            />
            {countryErrors.country_name && (
              <p className="text-red-500 text-xs mt-1">
                {countryErrors.country_name.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-[13px] ps-1">Country Code</label>
            <Input
              {...countryRegister("country_code", {
                required: "Country code is required",
                pattern: {
                  value: /^\+\d{1,3}$/,
                  message: "Country code must be in the format +[1-3 digits] (e.g., +12)",
                },
              })}
              placeholder="Enter country code (e.g., +12)"
              className="border-neutral-400 text-xs rounded-lg mt-1"
            />
            {countryErrors.country_code && (
              <p className="text-red-500 text-xs mt-1">
                {countryErrors.country_code.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-[13px] ps-1">Currency Code</label>
            <Input
              {...countryRegister("currency_code", {
                required: "Currency code is required",
              })}
              placeholder="Enter currency code (e.g., JPY)"
              className="border-neutral-400 text-xs rounded-lg mt-1"
            />
            {countryErrors.currency_code && (
              <p className="text-red-500 text-xs mt-1">
                {countryErrors.currency_code.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="text-red-500"
              onClick={() => {
                countryReset();
                onClose();
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
  );
};

function SupplierInfoUpdate({
  control,
  suppliers,
  setSuppliers,
  handleSupplierChange,
  setValue,
  errors,
  countries,
  setCountries,
  register,
  watchedPartyName,
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCountryDialogOpen, setIsCountryDialogOpen] = useState(false);

  const {
    register: dialogRegister,
    handleSubmit: handleDialogSubmit,
    control: dialogControl,
    reset: dialogReset,
    formState: { errors: dialogErrors },
  } = useForm();

  console.log("Watched partyName in SupplierInfoUpdate:", watchedPartyName);
  console.log("Suppliers in SupplierInfoUpdate:", suppliers);

  useEffect(() => {
    if (watchedPartyName && suppliers.length > 0) {
      const supplierExists = suppliers.some(
        (supplier) => supplier.party_name === watchedPartyName
      );
      if (!supplierExists) {
        console.warn(`Supplier with party_name "${watchedPartyName}" not found in suppliers array`);
      } else {
        console.log(`Supplier "${watchedPartyName}" found, ensuring form state`);
        setValue("partyName", watchedPartyName); // Ensure form state is updated
      }
    }
  }, [watchedPartyName, suppliers, setValue]);

  const onDialogSubmit = async (data, event) => {

    event.preventDefault(); // Prevent default form submission
    event.stopPropagation();

    try {
      const newSupplier = await createSupplier({
        party_name: data.party_name,
        address: data.address,
        zipcode: data.zipcode,
        email: data.email,
        country_name: data.country_name,
        phone: `${data.dialing_code}${data.phone}`,
      });

      const suppliersRes = await getAllSuppliers();
      const updatedSuppliers = suppliersRes?.data?.data || [];
      setSuppliers(updatedSuppliers);

      console.log("create Supplier response:", newSupplier);

      toast.success("Supplier added successfully!");

      setIsDialogOpen(false);
      dialogReset();
    } catch (err) {
      console.error("Error adding supplier:", err);
      toast.error(err.message || "Failed to add supplier.");
    }
  };

   const handleAddCountry = async (data) => {
    try {
      const response = await createCountry(data);
      const newCountry = {
        id: response?.data?.id || response.id || Date.now(),
        country_name: data.country_name,
        country_code: data.country_code,
        currency_code: data.currency_code,
      };
      setCountries((prev) => {
        const updatedCountries = [...prev, newCountry];
        console.log("Updated countries after adding:", updatedCountries);
        return updatedCountries;
      });
      // Auto-select the new country in the supplier dialog
      dialogControl._formValues.country_name = newCountry.country_name;
      //toast.success("Country added successfully!");
    } catch (error) {
      toast.error(`Failed to add country: ${error.message}`);
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
          render={({ field }) => {
            console.log("Current partyName field value:", field.value);
            console.log("Watched partyName value:", watchedPartyName);
            console.log("Available suppliers:", suppliers);

            // Use the field value as primary source, watchedPartyName as fallback
            const currentValue = field.value || watchedPartyName || "";

            return (
              <Select
                onValueChange={(value) => {
                  console.log("Select onValueChange called with:", value);
                  if (value === "add_new") {
                    setIsDialogOpen(true);
                  } else {
                    field.onChange(value); // Update the form field
                    handleSupplierChange(value); // Update related fields
                  }
                }}
                value={currentValue}
              >
                <SelectTrigger className="border-neutral-400 text-xs">
                  <SelectValue placeholder="Select Supplier" />
                </SelectTrigger>
                <SelectContent className="text-black bg-white">
                  <SelectItem
                    value="add_new"
                    className="text-blue-600 font-semibold"
                  >
                    + Add New Supplier
                  </SelectItem>
                  {suppliers.length > 0 ? (
                    suppliers
                      .filter(
                        (supplier) =>
                          supplier &&
                          supplier.party_name &&
                          supplier.party_name.trim() !== ""
                      )
                      .map((supplier) => (
                        <SelectItem
                          key={supplier.id}
                          value={supplier.party_name}
                        >
                          {supplier.party_name}
                        </SelectItem>
                      ))
                  ) : (
                    <div className="px-2 py-1 text-xs text-black">
                      No suppliers available
                    </div>
                  )}
                </SelectContent>
              </Select>
            );
          }}
        />
        {/* {errors.partyName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.partyName.message}
            </p>
          )} */}
      </div>
      <div>
        <p className="text-[13px] ps-5">Mobile Number</p>
        <Input
          {...register("mobile", {
            required: "Mobile number is required"
          })}
          type="text"
          placeholder="Mobile number"
          className="border-neutral-400 placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        {errors.mobile && (
          <p className="text-red-500 text-xs mt-1">{errors.mobile.message}</p>
        )}
      </div>
      <div>
        <p className="text-[13px] ps-5 pb-1 text-black">Country</p>
        <Input
          {...register("country", { required: "Country is required" })}
          type="text"
          placeholder="Country"
          className="border-neutral-400 placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        {errors.country && (
          <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>
        )}
      </div>
      <div>
        <p className="text-[13px] ps-5">Email</p>
        <Input
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email address",
            },
          })}
          type="email"
          placeholder="Enter email"
          className="border-neutral-400 placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>
      <div className="row-span-2 flex flex-col">
        <p className="text-[13px] ps-5">Address</p>
        <Textarea
          {...register("address", { required: "Address is required" })}
          placeholder="Address"
          className="flex-1 resize-none border-neutral-400 placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        {errors.address && (
          <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
        )}
      </div>
      <div>
        <p className="text-[13px] ps-5">Zip</p>
        <Input
          {...register("zip", { required: "Zipcode is required" })}
          type="text"
          placeholder="Zip"
          className="border-neutral-400 placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        {errors.zip && (
          <p className="text-red-500 text-xs mt-1">{errors.zip.message}</p>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onClick={(e) => e.stopPropagation()}>
        <DialogContent className="sm:max-w-[425px] bg-white text-black">
          <DialogHeader>
            <DialogTitle>Add New Supplier</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault(); // Prevent default at form level
              e.stopPropagation(); // Stop propagation at form level
              handleDialogSubmit(onDialogSubmit)(e);
            }}
            className="space-y-4"
          >
            <div>
              <label className="text-[13px] ps-1">Party Name</label>
              <Input
                {...dialogRegister("party_name", {
                  required: "Party name is required",
                })}
                placeholder="Enter party name"
                className="border-neutral-400 text-xs rounded-lg mt-1"
              />
              {dialogErrors.party_name && (
                <p className="text-red-500 text-xs mt-1">
                  {dialogErrors.party_name.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-[13px] ps-1">Address</label>
              <Input
                {...dialogRegister("address", {
                  required: "Address is required",
                })}
                placeholder="Enter address"
                className="border-neutral-400 text-xs rounded-lg mt-1"
              />
              {dialogErrors.address && (
                <p className="text-red-500 text-xs mt-1">
                  {dialogErrors.address.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-[13px] ps-1">Zipcode</label>
              <Input
                {...dialogRegister("zipcode", {
                  required: "Zipcode is required",
                })}
                placeholder="Enter zipcode"
                className="border-neutral-400 text-xs rounded-lg mt-1"
              />
              {dialogErrors.zipcode && (
                <p className="text-red-500 text-xs mt-1">
                  {dialogErrors.zipcode.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-[13px] ps-1">Email</label>
              <Input
                {...dialogRegister("email", {
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
              {dialogErrors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {dialogErrors.email.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-[13px] ps-1">Country</label>
              <Controller
                name="country_name"
                control={dialogControl}
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
                    {dialogErrors.country_name && (
                      <p className="text-red-500 text-xs mt-1">
                        {dialogErrors.country_name.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
            <div>
              <label className="text-[13px] ps-1">Dialing Code</label>
              <Input
                {...dialogRegister("dialing_code", {
                  required: "Dialing code is required",
                })}
                placeholder="Enter dialing code (e.g., +91)"
                className="border-neutral-400 text-xs rounded-lg mt-1"
              />
              {dialogErrors.dialing_code && (
                <p className="text-red-500 text-xs mt-1">
                  {dialogErrors.dialing_code.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-[13px] ps-1">Phone</label>
              <Input
                {...dialogRegister("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^\d{10}$/,
                    message: "Phone number must be 10 digits",
                  },
                })}
                placeholder="Enter phone number"
                className="border-neutral-400 text-xs rounded-lg mt-1"
              />
              {dialogErrors.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {dialogErrors.phone.message}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  dialogReset();
                  setIsDialogOpen(false);
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

      <CountryDialog
        open={isCountryDialogOpen}
        onClose={() => setIsCountryDialogOpen(false)}
        onSave={handleAddCountry}
      />
    </div>
  );
}

export default SupplierInfoUpdate;
