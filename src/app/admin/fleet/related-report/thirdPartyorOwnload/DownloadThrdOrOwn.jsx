"use client";

import React from "react";
import { utils, writeFile } from "xlsx";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

function DownloadThrdOrOwn({ data }) {
 const handleDownload = () => {
     // Prepare data for export (only include regNo, noTrip, KmDriver, totalExpense)
     const exportData = data.map((item) => ({
       regNo: item.regNo || "",
       "Trip Id": item.id || "0",
       "Trip Type": item.trip_type,
       "Loading Date": item.loading_date,
       "Unloading Date": item.unloading_date,
        "Reg No": item.regNo,
        "Driver name": item.driver_name,
        "Loading Point": item.loading_point,
        "Unloading Point": item.unloading_point,
     }));
 
     // Create a worksheet from the data
     const worksheet = utils.json_to_sheet(exportData);
 
     // Define column headers explicitly
     worksheet["!cols"] = [
       { wch: 15 }, // regNo
       { wch: 10 }, // noTrip
       { wch: 10 }, // KmDriver
       { wch: 15 }, // totalExpense
     ];
 
     // Create a workbook and append the worksheet
     const workbook = utils.book_new();
     utils.book_append_sheet(workbook, worksheet, "ThirdPartyorOwnload");
 
     // Generate file name with current date (e.g., fleet_expense_2025-05-19.xlsx)
     const today = format(new Date(), "yyyy-MM-dd");
     const fileName = `ThirdPartyorOwnload${today}.xlsx`;
 
     // Export the file
     writeFile(workbook, fileName);
   };
 
   return (
     <Button
       onClick={handleDownload}
       className="bg-black text-white border border-neutral-300 hover:bg-neutral-100 hover:text-black text-[13px] font-normal"
       disabled={data.length === 0}
     >
       Download
     </Button>
   );
 };

export default DownloadThrdOrOwn