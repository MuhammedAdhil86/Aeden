"use client";

import React from "react";
import { Input } from "@/components/ui/input";

function EditInsuranceDetails({ insurance_invoice_date, register, watch, setValue }) {

    const formatToYYYYMMDD = (dateStr) => {
    if (!dateStr || dateStr === "0001-01-01T00:00:00Z") return "";
    if (dateStr.includes("/")) {
      const [day, month, year] = dateStr.split("/");
      return `${year}-${month}-${day}`;
    }
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  };

   return (
     <div className="grid grid-cols-4 gap-x-5 gap-y-5 mt-5">
       <div>
         <p className="text-[13px] ps-5 text-black">Policy No</p>
         <Input
           {...register("insurance_policy_no")}
           placeholder="Enter number"
           required
           className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
         />
       </div>
       <div>
         <p className="text-[13px] ps-5 text-black">Premium amount (INR)</p>
         <Input
           {...register("insurance_premium_amount")}
           type="number"
           placeholder="Enter amount"
           required
           className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
         />
       </div>
 
       <div>
         <p className="text-[13px] ps-5 text-black">Invoice Date</p>
         <div className="relative w-full">
           <Input
             {...register("insurance_invoice_date")}
             id="insurance_invoice_date"
             type="date"
             required
             value={formatToYYYYMMDD(insurance_invoice_date) || ""}
                onChange={(e) => {
                  const date = e.target.value;
                  if (date) {
                    const [year, month, day] = date.split("-");
                    setValue("insurance_invoice_date", `${day}/${month}/${year}`);
                  } else {
                    setValue("insurance_invoice_date", "");
                  }
                }}
             className="border-neutral-400 text-black placeholder:text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none pr-10 
                                 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none"
           />
           <button
             type="button"
             onClick={(e) => {
               e.preventDefault();
               const insurance_invoice_date = document.getElementById("insurance_invoice_date");
               if (insurance_invoice_date) {
                 insurance_invoice_date.showPicker();
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
       </div>
 
       <div>
         <p className="text-[13px] ps-5 text-black">Owner Name</p>
         <Input
           {...register("insurance_owner_name")}
           placeholder="Enter name"
           required
           className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
         />
       </div>
 
       <div>
         <p className="text-[13px] ps-5 text-black">Invoice Number</p>
         <Input
           {...register("insurance_invoice_number")}
           placeholder="Enter number"
           required
           className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
         />
       </div>
     </div>
   );
 }

export default EditInsuranceDetails