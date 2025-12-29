import React from "react";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

function FreightTerms({ control, incoTerms, modes, selectedIncoTermId, register, errors }) {
  return (
    <div className="grid grid-cols-[25.5%_23%_23%_auto] gap-7 border-b border-b-neutral-200 pb-10">
      <Controller
        name="incoTerms"
        control={control}
        render={({ field }) => (
          <div>
            <p className="text-[13px] ps-5 pb-1 text-black">Freight term</p>
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="text-black border-neutral-400 rounded-lg text-xs mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                <SelectValue placeholder="Select Freight Terms" />
              </SelectTrigger>
              <SelectContent className="text-black bg-white">
                {incoTerms.map((term) => (
                  <SelectItem key={term.id} value={String(term.id)}>
                    {term.terms}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      />
      <div>
        <Controller
          name="mode"
          control={control}
          render={({ field }) => (
            <div>
              <p className="text-[13px] ps-5 pb-1 text-black">INCO Term</p>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="text-black">
                  <SelectValue placeholder="Select Term" />
                </SelectTrigger>
                <SelectContent className="text-black bg-white">
                  {modes
                    .filter((m) => String(m.terms_id.id) === selectedIncoTermId)
                    .map((m) => (
                      <SelectItem key={m.id} value={String(m.id)}>
                        {m.mode} - {m.description}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}
        />
      </div>
      <div>
        <p className="text-[13px] ps-5 pb-1 text-black">Other mode</p>
        <Input
          {...register("otherMode")}
          placeholder="Enter name"
          className="border-neutral-400 placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
    </div>
  );
}

export default FreightTerms;