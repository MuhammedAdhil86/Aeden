import React, { useEffect } from "react";
import { Controller } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { fetchPorts } from "@/service/procurements";

function PortDetailsForm({ control, ports, setPorts }) {
  useEffect(() => {
    getPortData();
  }, []);

  const getPortData = async () => {
    try {
      const res = await fetchPorts();
      setPorts(res.data);
    } catch (error) {
      console.error("Failed to fetch ports:", error);
    }
  };

  return (
    <div className="grid grid-cols-[25.5%_23%_auto] gap-7 border-b border-b-neutral-200 pb-10">
      <div>
        <Controller
          name="pol"
          control={control}
          render={({ field }) => (
            <div>
              <p className="text-[13px] ps-5">Port of Loading (optional)</p>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="border-neutral-400 placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                  <SelectValue placeholder="Select Port of Loading" />
                </SelectTrigger>
                <SelectContent className="text-black bg-white">
                  {ports.map((port) => (
                    <SelectItem key={port.id} value={String(port.id)}>
                      {port.port_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        />
      </div>

      <div>
        <Controller
          name="pod"
          control={control}
          render={({ field }) => (
            <div>
              <p className="text-[13px] ps-5 pb-1 text-black">Port of discharge</p>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="text-black border-neutral-400 rounded-lg text-xs mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                  <SelectValue placeholder="Select port of discharge" />
                </SelectTrigger>
                <SelectContent className="text-black bg-white">
                  {ports.map((port) => (
                    <SelectItem key={port.id} value={String(port.id)}>
                      {port.port_name} - {port.country_id.country_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        />
      </div>
    </div>
  );
}

export default PortDetailsForm;