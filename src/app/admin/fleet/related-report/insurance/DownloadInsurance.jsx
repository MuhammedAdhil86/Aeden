"use client";

import React from "react";
import { utils, writeFile } from "xlsx";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

function DownloadInsurance({ data }) {
  const handleDownload = () => {
  const exportData = data.map((item) => ({
    "From - To": item.title || "",
    "Policy No.": item.insurance_policy_no || "0",
    "Policy Amount": item.insurance_premium_amount || "0",
    "Insurance Invoice No.": item.insurance_invoice_number || "0",
    "Insurance Owner name": item.insurance_owner_name || "N/A",
  }));

  // Create worksheet
  const worksheet = utils.json_to_sheet(exportData);

  // Set column widths
  worksheet["!cols"] = [
    { wch: 30 },
    { wch: 20 },
    { wch: 15 },
    { wch: 25 },
    { wch: 30 },
  ];

  // Left align all cells (loop through all cell addresses)
  Object.keys(worksheet).forEach((cell) => {
    if (cell[0] === '!') return; // Skip special keys like !ref, !cols
    const cellObj = worksheet[cell];
    if (!cellObj.s) cellObj.s = {};
    cellObj.s.alignment = { horizontal: "left" };
  });

  // Create workbook
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "Transit Insurance tracking");

  const today = format(new Date(), "yyyy-MM-dd");
  const fileName = `Transit_Insurance_tracking_${today}.xlsx`;

  // Export
  writeFile(workbook, fileName, { cellStyles: true }); // Important: enable styles
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
export default DownloadInsurance