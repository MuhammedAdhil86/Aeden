import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { createPort } from "@/service/procurements";

// PortDialog Component
const PortDialog = ({ open, onClose, onSave, countries }) => {
  const {
    control: dialogControl,
    handleSubmit: handleDialogSubmit,
    register: dialogRegister,
    formState: { errors: dialogErrors },
    reset: dialogReset,
  } = useForm({
    defaultValues: {
      port_name: "",
      country_id: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await onSave({
        port_name: data.port_name,
        country_id: {
          id: parseInt(data.country_id),
        },
      });
      dialogReset();
      onClose();
    } catch (error) {
      toast.error(`Failed to add port: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-black">Add New Port</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleDialogSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-[13px] ps-1 text-black">Port Name</label>
            <Input
              {...dialogRegister("port_name", { required: "Port name is required" })}
              placeholder="Enter port name"
              className="border-neutral-400 text-xs rounded-lg mt-1 text-black"
            />
            {dialogErrors.port_name && (
              <p className="text-red-500 text-xs mt-1">{dialogErrors.port_name.message}</p>
            )}
          </div>
          <div>
            <label className="text-[13px] ps-1 text-black">Country</label>
            <Controller
              name="country_id"
              control={dialogControl}
              rules={{ required: "Country is required" }}
              render={({ field }) => (
                <>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    className="border-neutral-400 bg-white text-xs rounded-lg mt-1 text-black"
                  >
                    <SelectTrigger className="text-black border-neutral-400 text-xs">
                      <SelectValue placeholder="Select country for port" />
                    </SelectTrigger>
                    <SelectContent className="text-black bg-white">
                      {countries.length > 0 ? (
                        countries.map((country) => (
                          <SelectItem
                            key={country.id}
                            value={String(country.id)}
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
                  {dialogErrors.country_id && (
                    <p className="text-red-500 text-xs mt-1">{dialogErrors.country_id.message}</p>
                  )}
                </>
              )}
            />
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
              Add Port
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// UpdatePortInfo Component
function UpdatePortInfo({ control, ports, setPorts, setValue, errors, countries, register, purchase }) {
  const [isPortDialogOpen, setIsPortDialogOpen] = useState(false);

  // Pre-fill ports and dates on component mount
  useEffect(() => {
    if (purchase) {
      if (purchase.port_of_loading_id?.id) {
        setValue("pol", String(purchase.port_of_loading_id.id));
        console.log("Pre-filled Port of Loading:", purchase.port_of_loading_id.id);
      }
      if (purchase.port_of_discharge_id?.id) {
        setValue("pod", String(purchase.port_of_discharge_id.id));
        console.log("Pre-filled Port of Discharge:", purchase.port_of_discharge_id.id);
      }
      if (purchase.planned_date_of_load) {
        const formattedPdl = new Date(purchase.planned_date_of_load).toISOString().split("T")[0];
        setValue("pdl", formattedPdl);
        console.log("Pre-filled Planned Date of Load:", formattedPdl);
      }
      if (purchase.planned_date_of_delivery) {
        const formattedPdd = new Date(purchase.planned_date_of_delivery).toISOString().split("T")[0];
        setValue("pdd", formattedPdd);
        console.log("Pre-filled Planned Date of Delivery:", formattedPdd);
      }
    }
  }, [purchase, setValue]);

  const handleAddPort = async (data) => {
    try {
      const response = await createPort(data);
      const newPort = {
        id: response?.data?.id || response.id || Date.now(),
        port_name: data.port_name,
        country_id: {
          id: data.country_id.id,
          country_name: countries.find(c => c.id === data.country_id.id)?.country_name || "",
        },
      };
      setPorts((prev) => {
        const updatedPorts = [...prev, newPort];
        console.log("Updated ports after adding:", updatedPorts);
        return updatedPorts;
      });
      setValue("pol", String(newPort.id)); // Pre-select new port for Port of Loading
      toast.success("Port added successfully!");
    } catch (error) {
      toast.error(`Failed to add port: ${error.message}`);
      throw error;
    }
  };

  return (
    <div>
      <div className="grid grid-cols-[25.5%_23%_auto] gap-7 border-b border-b-neutral-200 pb-10">
        <div>
          <p className="text-[13px] ps-5">Planned date of load</p>
          <div className="relative w-full">
            <Input
              {...register("pdl", { required: "Planned date of load is required" })}
              id="pdl"
              type="date"
              className="border-neutral-400 placeholder:text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none pr-10 
              [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none"
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                const pdl = document.getElementById("pdl");
                if (pdl) {
                  pdl.showPicker();
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
          {errors.pdl && (
            <p className="text-red-500 text-xs mt-1">{errors.pdl.message}</p>
          )}
        </div>
        <div>
          <p className="text-[13px] ps-5">Planned date of Delivery</p>
          <div className="relative w-full">
            <Input
              {...register("pdd", { required: "Planned date of delivery is required" })}
              id="pdd"
              type="date"
              className="border-neutral-400 placeholder:text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none pr-10 
              [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none"
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                const pdd = document.getElementById("pdd");
                if (pdd) {
                  pdd.showPicker();
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
          {errors.pdd && (
            <p className="text-red-500 text-xs mt-1">{errors.pdd.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-[25.5%_23%_auto] gap-7 border-b border-b-neutral-200 pb-10">
        <div>
          <Controller
            name="pol"
            control={control}
            rules={{ required: "Port of Loading is required" }}
            render={({ field }) => (
              <div>
                <p className="text-[13px] ps-5">Port of Loading</p>
                <Select
                  onValueChange={(value) => {
                    if (value === "add_new") {
                      setIsPortDialogOpen(true);
                      return;
                    }
                    field.onChange(value);
                  }}
                  value={field.value || ""}
                  className="border-neutral-400 bg-white text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                  <SelectTrigger className="text-black border-neutral-400 text-xs">
                    <SelectValue placeholder="Select Port of Loading" />
                  </SelectTrigger>
                  <SelectContent className="text-black bg-white">
                    <SelectItem value="add_new" className="text-blue-600 font-semibold">
                      + Add New Port
                    </SelectItem>
                    {ports
                      .filter((port) => port && port.id && port.port_name)
                      .map((port) => (
                        <SelectItem key={port.id} value={String(port.id)}>
                          {port.port_name} - {port.country_id.country_name}
                        </SelectItem>
                      ))}
                    {ports.length === 0 && (
                      <div className="px-2 py-1 text-xs text-black">
                        No ports available
                      </div>
                    )}
                  </SelectContent>
                </Select>
                {errors.pol && (
                  <p className="text-red-500 text-xs mt-1">{errors.pol.message}</p>
                )}
              </div>
            )}
          />
        </div>
        <div>
          <Controller
            name="pod"
            control={control}
            rules={{ required: "Port of Discharge is required" }}
            render={({ field }) => (
              <div>
                <p className="text-[13px] ps-5 pb-1 text-black">Port of Discharge</p>
                <Select
                  onValueChange={(value) => {
                    if (value === "add_new") {
                      setIsPortDialogOpen(true);
                      return;
                    }
                    field.onChange(value);
                  }}
                  value={field.value || ""}
                  className="border-neutral-400 bg-white text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                  <SelectTrigger className="text-black border-neutral-400 text-xs">
                    <SelectValue placeholder="Select Port of Discharge" />
                  </SelectTrigger>
                  <SelectContent className="text-black bg-white">
                    <SelectItem value="add_new" className="text-blue-600 font-semibold">
                      + Add New Port
                    </SelectItem>
                    {ports
                      .filter((port) => port && port.id && port.port_name)
                      .map((port) => (
                        <SelectItem key={port.id} value={String(port.id)}>
                          {port.port_name} - {port.country_id.country_name}
                        </SelectItem>
                      ))}
                    {ports.length === 0 && (
                      <div className="px-2 py-1 text-xs text-black">
                        No ports available
                      </div>
                    )}
                  </SelectContent>
                </Select>
                {errors.pod && (
                  <p className="text-red-500 text-xs mt-1">{errors.pod.message}</p>
                )}
              </div>
            )}
          />
        </div>
        <PortDialog
          open={isPortDialogOpen}
          onClose={() => setIsPortDialogOpen(false)}
          onSave={handleAddPort}
          countries={countries}
        />
      </div>
    </div>
  );
}

export default UpdatePortInfo;