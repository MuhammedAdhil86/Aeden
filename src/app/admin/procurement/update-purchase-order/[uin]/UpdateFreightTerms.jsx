import React, { useEffect } from "react";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

function UpdateFreightTerms({ control, incoTerms, modes, selectedIncoTermId, register, errors, setValue, purchase }) {
  // Pre-fill form fields with purchase data
  useEffect(() => {
    if (purchase) {
      console.log("Purchase data in FreightTerms:", purchase);
      if (purchase.incoterm_id?.id) {
        setValue("incoTerms", String(purchase.incoterm_id.id));
        console.log("Pre-filled IncoTerms:", purchase.incoterm_id.id);
      }
      if (purchase.mode_id?.id) {
        setValue("mode", String(purchase.mode_id.id));
        console.log("Pre-filled Mode:", purchase.mode_id.id);
      }
      if (purchase.other_mode) {
        setValue("otherMode", purchase.other_mode);
        console.log("Pre-filled Other Mode:", purchase.other_mode);
      }
      // Log form state after setting values
      console.log("Form state after setValue:", control._formValues);
    } else {
      console.log("No purchase data provided to FreightTerms");
    }
  }, [purchase, setValue, control]);

  return (
    <div className="grid grid-cols-[25.5%_23%_23%_auto] gap-7 border-b border-b-neutral-200 pb-10">
      <Controller
        name="incoTerms"
        control={control}
        rules={{ required: "Freight term is required" }}
        render={({ field }) => (
          <div>
            <p className="text-[13px] ps-5 pb-1 text-black">Freight term</p>
            <Select
              onValueChange={field.onChange}
              value={field.value || ""}
              className="border-neutral-400 bg-white text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <SelectTrigger className="text-black border-neutral-400 text-xs">
                <SelectValue placeholder="Select Freight Terms" />
              </SelectTrigger>
              <SelectContent className="text-black bg-white">
                {incoTerms.length > 0 ? (
                  incoTerms.map((term) => (
                    <SelectItem key={term.id} value={String(term.id)}>
                      {term.terms}
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-2 py-1 text-xs text-black">
                    No freight terms available
                  </div>
                )}
              </SelectContent>
            </Select>
            {errors.incoTerms && (
              <p className="text-red-500 text-xs mt-1">{errors.incoTerms.message}</p>
            )}
          </div>
        )}
      />
      <div>
        <Controller
          name="mode"
          control={control}
          rules={{ required: "INCO Term is required" }}
          render={({ field }) => (
            <div>
              <p className="text-[13px] ps-5 pb-1 text-black">INCO Term</p>
              <Select
                onValueChange={field.onChange}
                value={field.value || ""}
                className="border-neutral-400 bg-white text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <SelectTrigger className="text-black border-neutral-400 text-xs">
                  <SelectValue placeholder="Select Term" />
                </SelectTrigger>
                <SelectContent className="text-black bg-white">
                  {modes
                    .filter((m) => String(m.terms_id?.id) === selectedIncoTermId)
                    .map((m) => (
                      <SelectItem key={m.id} value={String(m.id)}>
                        {m.mode} - {m.description}
                      </SelectItem>
                    ))}
                  {modes.filter((m) => String(m.terms_id?.id) === selectedIncoTermId).length === 0 && (
                    <div className="px-2 py-1 text-xs text-black">
                      No modes available for selected freight term
                    </div>
                  )}
                </SelectContent>
              </Select>
              {errors.mode && (
                <p className="text-red-500 text-xs mt-1">{errors.mode.message}</p>
              )}
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
        {errors.otherMode && (
          <p className="text-red-500 text-xs mt-1">{errors.otherMode.message}</p>
        )}
      </div>
    </div>
  );
}

export default UpdateFreightTerms