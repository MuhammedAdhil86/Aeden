"use client";

import React from "react";
import { utils, writeFile } from "xlsx";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

function DownloadIdle({ data }) {
  const handleDownload = () => {
    // Prepare data for export (only include regNo, noTrip, KmDriver, totalExpense)
    const exportData = data.map((item) => ({
      "Reg No": item.regNo || "",
      "Vehicle Name": item.vehicleName,
      "Last Trip Date": item.lastTripDate || "0",
      "Idle Days": item.idlDays || "0",
      Status: item.status || "0",
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
    utils.book_append_sheet(workbook, worksheet, "Vehicle idle time monitoring");

    const today = format(new Date(), "yyyy-MM-dd");
    const fileName = `Vehicle_idle_time_monitoring_${today}.xlsx`;

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
export default DownloadIdle;
