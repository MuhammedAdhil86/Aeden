import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// PartyDialog Component
const PartyDialog = ({ open, onClose, onSave, countries }) => {
  const {
    control: dialogControl,
    handleSubmit: handleDialogSubmit,
    register: dialogRegister,
    formState: { errors: dialogErrors },
    reset: dialogReset,
  } = useForm({
    defaultValues: {
      party_name: "",
      address: "",
      zipcode: "",
      email: "",
      country_name: "",
      dialing_code: "",
      phone: "",
    },
  });

  const onSubmit = (data) => {
    onSave(data);
    dialogReset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white text-black">
        <DialogHeader>
          <DialogTitle>Add New Party</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleDialogSubmit(onSubmit)} className="space-y-4">
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
                    onValueChange={field.onChange}
                    value={field.value}
                    className="border-neutral-400 bg-white text-xs rounded-lg mt-1"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent className="text-black bg-white">
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
          <div className="w-full flex gap-x-5">
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
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                dialogReset();
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

// Updated Supplier Section
const SupplierSection = ({
  control,
  suppliers,
  setSuppliers,
  handleSupplierChange,
  setValue,
  errors,
  countries,
}) => {
  const [isPartyDialogOpen, setIsPartyDialogOpen] = useState(false);

  const handleAddParty = (data) => {
    const newParty = {
      id: Date.now(), // Generate unique ID
      ...data,
    };
    setSuppliers((prev) => [...prev, newParty]);
    setValue("partyName", data.party_name);
    handleSupplierChange(data.party_name);
    toast.success("Party added successfully!");
  };

  return (
    <>
      <div>
        <p className="text-[13px] ps-5">Party name / Supplier name</p>
        <Controller
          name="partyName"
          control={control}
          rules={{ required: "Supplier is required" }}
          render={({ field }) => (
            <>
              <Select
                onValueChange={(value) => {
                  if (value === "add_new") {
                    setIsPartyDialogOpen(true);
                    return;
                  }
                  field.onChange(value);
                  handleSupplierChange(value);
                }}
                value={field.value}
                className="border-neutral-400 bg-white text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a supplier" />
                </SelectTrigger>
                <SelectContent className="text-black bg-white">
                  <SelectItem
                    value="add_new"
                    className="text-blue-600 font-semibold"
                  >
                    + Add New Party
                  </SelectItem>
                  {suppliers.length > 0 ? (
                    suppliers.map((supplier) => (
                      <SelectItem
                        key={supplier.id}
                        value={supplier.party_name}
                        className="text-black bg-white"
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
              {errors.partyName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.partyName.message}
                </p>
              )}
            </>
          )}
        />
      </div>
      <PartyDialog
        open={isPartyDialogOpen}
        onClose={() => setIsPartyDialogOpen(false)}
        onSave={handleAddParty}
        countries={countries}
      />
    </>
  );
};

export default SupplierSection;
