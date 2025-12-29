import React from "react";
import { fetchTrip } from "@/service/fleet";
import * as XLSX from "xlsx";

const DownloadXLButton = () => {
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleDownloadXL = async () => {
    try {
      console.log("Fetching trip data...");

      const tripData = await fetchTrip();

      if (!tripData || tripData.length === 0) {
        alert("No data available to export.");
        return;
      }

      console.log(`Found ${tripData.length} trips to export`);
      console.log("unloading_date : ")

      const formattedData = tripData.map((trip) => ({
        DATE: formatDate(trip.start_time) || "",
        "UNLOADING DATE": formatDate(trip.unloading_date) || "",
        "VEHICLE NO": trip.truckid?.register_number || "",
        "Driver Name": trip.driverid?.full_name || "",
        "Trip Type":
          trip.trip_type === "self" && trip.self_type === "own-load"
            ? "own-load"
            : trip.trip_type === "self" && trip.self_type === "other-load"
            ? "other-load"
            : trip.trip_type === "3rd-party"
            ? "third party"
            : "-",
        "Trip Sheet no": trip.trip_sheet_no || "",
        Branch: trip.branch || "",
        "Name of the Customer": trip.customer_name || "",
        "INVOICE NO": trip.insurance_invoice_number || "",
        From: trip.loading_point || "",
        To: trip.unloading_point || "",
        Transit: trip.in_transit?.join(", ") || "N/A",
        Transporter: trip.driverid.full_name || "",
        Frieght: trip.freight || "0",
        "Starting Km": trip.kilometer || "0",
        "Ending km": trip.ending_kilometer || "0",
        "Total Km": trip.total_kilometer || "0",
        "Diesal Ltr": trip.diesel_ltr || "0",
        "Diesal Amount": trip.diesel_amount || "0",
        "Filling KM": trip.filling_km || "0",
        Mileage: trip.mileage || "0",
        Qty: trip.trip_qty || "0",
        "Trip Advance": trip.advance_received || "0",
        "Tyre work": trip.tyre_work || "0",
        "Greasing & Air checking": trip.greasing_air_check || "0",
        Adblue: trip.adblue || "0",
        "Gate pass": trip.gate_pass || "0",
        "RTO Expense": trip.rto_expense || "0",
        "Other Expense": trip.total_other_expense || "0",
        Status: trip.status || "0",
        Profit: trip.profit || "0",
        // "Vehicle Model": trip.truckid?.model || "N/A",
        // "Trip Date": formatDate(trip.date) || "N/A",
        // "Start Location": trip.startLocation || "N/A",
        // "End Location": trip.endLocation || "N/A",
        // "Distance (km)": trip.distance || "N/A",
      }));

      // Step 1: Create a workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(formattedData);

      // Step 2: Set column widths based on content
      const headerKeys = Object.keys(formattedData[0]);
      const colWidths = headerKeys.map((key) => ({
        wch: Math.max(key.length, 20), // Minimum width of 15 characters
      }));
      worksheet["!cols"] = colWidths;

      // Step 3: Set row height for header row
      worksheet["!rows"] = [{ hpt: 25 }]; // Header row height in points

      // Step 4: Style the header row with black background
      // Get the range of the worksheet
      const range = XLSX.utils.decode_range(worksheet["!ref"]);

      // Define header style with black background and white text
      const headerStyle = {
        fill: {
          patternType: "solid",
          fgColor: { rgb: "FF000000" }, // Black with FF prefix for 100% opacity
        },
        font: {
          name: "Arial",
          color: { rgb: "FFFFFFFF" }, // White text with FF prefix for 100% opacity
          bold: true,
          sz: 12,
        },
        alignment: {
          horizontal: "center",
          vertical: "center",
          wrapText: true,
        },
        border: {
          top: { style: "thin", color: { rgb: "FF000000" } },
          bottom: { style: "thin", color: { rgb: "FF000000" } },
          left: { style: "thin", color: { rgb: "FF000000" } },
          right: { style: "thin", color: { rgb: "FF000000" } },
        },
      };

      // Apply style to each header cell (first row)
      headerKeys.forEach((key, colIndex) => {
        const cellRef = XLSX.utils.encode_cell({ r: 1, c: 0 }); // r:0 is first row
        if (worksheet[cellRef]) {
          worksheet[cellRef].s = headerStyle;
        }
      });

      // Step 5: Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Trips");

      // Step 6: Write to file with options to preserve styles
      const options = {
        bookType: "xlsx",
        bookSST: false,
        type: "binary",
        cellStyles: true,
      };

      // Generate the file
      XLSX.writeFile(workbook, "trip_report.xlsx", options);

      console.log("Excel file exported successfully");
    } catch (error) {
      console.error("Failed to download Excel:", error);
      alert("Failed to generate Excel file. Please try again.");
    }
  };

  return (
    <button
      onClick={handleDownloadXL}
      className="w-full px-4 py-2 text-left text-black text-sm hover:bg-gray-100"
    >
      Download Excel
    </button>
  );
};

export default DownloadXLButton;
