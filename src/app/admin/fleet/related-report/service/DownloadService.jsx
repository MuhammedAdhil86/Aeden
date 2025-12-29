"use client";

import React from "react";
import { utils, writeFile } from "xlsx";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

function DownloadService({ data }) {
 const handleDownload = () => {
      // Prepare data for export (only include regNo, noTrip, KmDriver, totalExpense)
      const exportData = data.map((item) => ({
        "Reg No": item.regNo || "",
        "Vehicle Name": item.vehicleName,
        "Last Service Date": item.serviceDate,
        "Total Services": item.total_services || "0",
        "Cost": item.cost || "0"
      }));
  
      // Create a worksheet from the data
      const worksheet = utils.json_to_sheet(exportData);
  
      // Define column headers explicitly
      worksheet["!cols"] = [
        { wch: 15 }, // regNo
        { wch: 30 }, // noTrip
        { wch: 20 }, // KmDriver
        { wch: 15 }, // totalExpense
        { wch: 15 },
      ];
  
      // Create a workbook and append the worksheet
      const workbook = utils.book_new();
      utils.book_append_sheet(workbook, worksheet, "Service_History_Log");
  
      // Generate file name with current date (e.g., fleet_expense_2025-05-19.xlsx)
      const today = format(new Date(), "yyyy-MM-dd");
      const fileName = `Service_History_Log${today}.xlsx`;
  
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

export default DownloadService