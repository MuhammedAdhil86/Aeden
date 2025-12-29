import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Controller } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { getAllSuppliers, fetchSupplierById } from "@/service/procurements";
import { toast } from "react-toastify";

function SupplierDetailsForm({
  register,
  control,
  setValue,
  errors,
  suppliers,
  setSuppliers,
  countries,
}) {
  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await getAllSuppliers();
      setSuppliers(res?.data.data || []);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
      toast.error("Failed to load suppliers. Please try again.");
    }
  };

  const handleSupplierChange = async (partyName) => {
    try {
      const selectedSupplier = suppliers.find(
        (supplier) => supplier.party_name === partyName
      );
      if (!selectedSupplier) {
        toast.error("Selected supplier not found.");
        return;
      }

      const supplierDetails = await fetchSupplierById(selectedSupplier.id);
      setValue("mobile", supplierDetails.phone || "");
      setValue("country", supplierDetails.country_name || "");
      setValue("email", supplierDetails.email || "");
      setValue("address", supplierDetails.address || "");
      setValue("zip", supplierDetails.zipcode || "");
    } catch (err) {
      console.error("Error fetching supplier details:", err);
      toast.error("Failed to load supplier details.");
    }
  };

  return (
    <div className="grid grid-rows-2 grid-flow-col gap-7 border-b border-b-neutral-200 pb-10">
      <div>
        <p className="text-[13px] ps-5 pb-1">Supplier</p>
        <Controller
          name="partyName"
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                handleSupplierChange(value);
              }}
              value={field.value}
            >
              <SelectTrigger className="border-neutral-400 text-xs">
                <SelectValue placeholder="Select Supplier" />
              </SelectTrigger>
              <SelectContent className="text-black bg-white">
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.party_name}>
                    {supplier.party_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div>
        <p className="text-[13px] ps-5">Mobile Number</p>
        <Input
          {...register("mobile")}
          type="text"
          placeholder="Mobile number"
          required
          className="border-neutral-400 placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
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
          className="border-neutral-400 placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
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
          className="border-neutral-400 placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
    </div>
  );
}

export default SupplierDetailsForm;