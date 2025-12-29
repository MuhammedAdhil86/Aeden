"use client";

import React from "react";
import { utils, writeFile } from "xlsx";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

function ContainerDownload({ data }) {
  const handleDownload = () => {
    // Prepare data for export (only include regNo, noTrip, KmDriver, totalExpense)
    const exportData = data.map((item) => ({
      "Trip Id": item.trip_id || "",
      "Container Number": item.container_number || "0",
      "Godown in": item.godown_in,
      "Godown Out": item.godown_out,
      "Yard in": item.yard_in,
      "Ageing Days": item.ageing_days,
      "Return Location": item.return_location,
      "Status": item.status
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
    utils.book_append_sheet(workbook, worksheet, "Container Tracking");

    // Generate file name with current date (e.g., fleet_expense_2025-05-19.xlsx)
    const today = format(new Date(), "yyyy-MM-dd");
    const fileName = `Container_Tracking_${today}.xlsx`;

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
}

export default ContainerDownload;
