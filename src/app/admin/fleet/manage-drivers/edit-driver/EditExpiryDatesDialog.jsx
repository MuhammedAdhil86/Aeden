import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EditExpiryDatesDialog({
 open,
   onOpenChange,
   register,
   errors,
   onSave,
   trigger,
   setValue,
   license_expiry_from,
   license_expiry_to,
   eye_expiry_from,
   eye_expiry_to,
   fitness_expiry_from,
   fitness_expiry_to
 }) {

    //console.log("license_expiry_from : ",license_expiry_from)

     const convertToYYYYMMDD = (dateStr) => {
    if (!dateStr) return "";
    const [day, month, year] = dateStr.split("/");
    if (!day || !month || !year) return dateStr; // If already in YYYY-MM-DD
    return `${year}-${month}-${day}`;
  };

  const convertToDDMMYYYY = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    if (!day || !month || !year) return dateStr; // If already in DD/MM/YYYY
    return `${day}/${month}/${year}`;
  };
 
   return (
       <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="sm:max-w-[500px] bg-white text-black">
           <img src="/solar_calendar-linear.svg" className="h-5" />
           <DialogHeader>
             <DialogTitle className="pt-5 font-medium text-black border-t">
               Set Expiry Dates
             </DialogTitle>
             <p className="text-[10px] text-neutral-400 pt-1">
               Please provide the expiry dates for the following documents to
               ensure timely updates and renewals
             </p>
           </DialogHeader>
           <div className="grid grid-cols-2 gap-y-10 gap-x-8 py-4">
             <div>
               <p className="text-[13px] pb-1 text-black">License Starting Date</p>
               <div className="relative w-full">
                 <Input
                   {...register("license_expiry_from")}
                   id="license_expiry_from"
                   type="date"
                   value={convertToYYYYMMDD(license_expiry_from) || ""}
                   onChange={(e) => {
                     const date = e.target.value;
                     if (date) {
                       const [year, month, day] = date.split("-");
                       setValue("license_expiry_from", date);
                     } else {
                       setValue("license_expiry_from", "");
                     }
                   }}
                   className="border-neutral-400 text-black placeholder:text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none pr-10 
                                 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none"
                 />
                 <button
                   type="button"
                   onClick={(e) => {
                     e.preventDefault();
                     const input = document.getElementById("license_expiry_from");
                     if (input) {
                       input.showPicker();
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
               {errors.license_expiry_from && (
                 <p className="text-red-500 text-xs mt-1">
                   {errors.license_expiry_from.message}
                 </p>
               )}
             </div>
             <div>
               <p className="text-[13px] pb-1 text-black">License Ending Date</p>
               <div className="relative w-full">
                 <Input
                   {...register("license_expiry_to")}
                   id="license_expiry_to"
                   type="date"
                   value={convertToYYYYMMDD(license_expiry_to) || ""}
                   onChange={(e) => {
                     const date = e.target.value;
                     if (date) {
                       const [year, month, day] = date.split("-");
                       setValue("license_expiry_to", date);
                     } else {
                       setValue("license_expiry_to", "");
                     }
                   }}
                   className="border-neutral-400 text-black placeholder:text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none pr-10 
                                 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none"
                 />
                 <button
                   type="button"
                   onClick={(e) => {
                     e.preventDefault();
                     const input = document.getElementById("license_expiry_to");
                     if (input) {
                       input.showPicker();
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
               {errors.license_expiry_to && (
                 <p className="text-red-500 text-xs mt-1">
                   {errors.license_expiry_to.message}
                 </p>
               )}
             </div>
             <div>
               <p className="text-[13px] pb-1 text-black">
                 Eye Test C Starting Date
               </p>
               <div className="relative w-full">
                 <Input
                   {...register("eye_expiry_from")}
                   id="eye_expiry_from"
                   type="date"
                   value={convertToYYYYMMDD(eye_expiry_from) || ""}
                   onChange={(e) => {
                     const date = e.target.value;
                     if (date) {
                       const [year, month, day] = date.split("-");
                       setValue("eye_expiry_from", date);
                     } else {
                       setValue("eye_expiry_from", "");
                     }
                   }}
                   className="border-neutral-400 text-black placeholder:text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none pr-10 
                                 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none"
                 />
                 <button
                   type="button"
                   onClick={(e) => {
                     e.preventDefault();
                     const input = document.getElementById("eye_expiry_from");
                     if (input) {
                       input.showPicker();
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
               {errors.eye_expiry_from && (
                 <p className="text-red-500 text-xs mt-1">
                   {errors.eye_expiry_from.message}
                 </p>
               )}
             </div>
             <div>
               <p className="text-[13px] pb-1 text-black">
                 Eye Test C Ending Date
               </p>
               <div className="relative w-full">
                 <Input
                   {...register("eye_expiry_to")}
                   id="eye_expiry_to"
                   type="date"
                   value={convertToYYYYMMDD(eye_expiry_to) || ""}
                   onChange={(e) => {
                     const date = e.target.value;
                     if (date) {
                       const [year, month, day] = date.split("-");
                       setValue("eye_expiry_to", date);
                     } else {
                       setValue("eye_expiry_to", "");
                     }
                   }}
                   className="border-neutral-400 text-black placeholder:text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none pr-10 
                                 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none"
                 />
                 <button
                   type="button"
                   onClick={(e) => {
                     e.preventDefault();
                     const input = document.getElementById("eye_expiry_to");
                     if (input) {
                       input.showPicker();
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
               {errors.eye_expiry_to && (
                 <p className="text-red-500 text-xs mt-1">
                   {errors.eye_expiry_to.message}
                 </p>
               )}
             </div>
   
             <div>
               <p className="text-[13px] pb-1 text-black">
                 Fitness certificate Staring Date
               </p>
               <div className="relative w-full">
                 <Input
                   {...register("fitness_expiry_from")}
                   id="fitness_expiry_from"
                   type="date"
                   value={convertToYYYYMMDD(fitness_expiry_from) || ""}
                   onChange={(e) => {
                     const date = e.target.value;
                     if (date) {
                       const [year, month, day] = date.split("-");
                       setValue("fitness_expiry_from", date);
                     } else {
                       setValue("fitness_expiry_from", "");
                     }
                   }}
                   className="border-neutral-400 text-black placeholder:text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none pr-10 
                                 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none"
                 />
                 <button
                   type="button"
                   onClick={(e) => {
                     e.preventDefault();
                     const input = document.getElementById("fitness_expiry_from");
                     if (input) {
                       input.showPicker();
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
               {errors.fitness_expiry_from && (
                 <p className="text-red-500 text-xs mt-1">
                   {errors.fitness_expiry_from.message}
                 </p>
               )}
             </div>
   
             <div>
               <p className="text-[13px] pb-1 text-black">
                 Fitness certificate Ending Date
               </p>
               <div className="relative w-full">
                 <Input
                   {...register("fitness_expiry_to")}
                   id="fitness_expiry_to"
                   type="date"
                   value={convertToYYYYMMDD(fitness_expiry_to) || ""}
                   onChange={(e) => {
                     const date = e.target.value;
                     if (date) {
                       const [year, month, day] = date.split("-");
                       setValue("fitness_expiry_to", date);
                     } else {
                       setValue("fitness_expiry_to", "");
                     }
                   }}
                   className="border-neutral-400 text-black placeholder:text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none pr-10 
                                 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none"
                 />
                 <button
                   type="button"
                   onClick={(e) => {
                     e.preventDefault();
                     const input = document.getElementById("fitness_expiry_to");
                     if (input) {
                       input.showPicker();
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
               {errors.fitness_expiry_to && (
                 <p className="text-red-500 text-xs mt-1">
                   {errors.fitness_expiry_to.message}
                 </p>
               )}
             </div>
           </div>
           <DialogFooter className="flex gap-x-6 pt-10 border-t">
             <Button
               type="button"
               variant="outline"
               onClick={() => onOpenChange(false)}
               className="text-red-500 border-neutral-300"
             >
               Cancel
             </Button>
             <Button
               type="button"
               onClick={onSave}
               className="bg-black text-white"
             >
               Submit
             </Button>
           </DialogFooter>
         </DialogContent>
       </Dialog>
     );
 }