import { fetchTruck } from "@/service/fleet";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const DownloadExcelButton = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchTruckData = async () => {
      try {
        const truckData = await fetchTruck();
        console.log("truckData : ", truckData);
        const processedData = truckData.map((truck, index) => ({
          "Sl No": index + 1,
          Vehicle: truck.vehicle_name || "N/A",
          "Vehicle No": truck.register_number || "N/A",
          RC: truck.rc_file?.file_path ? "Original received" : "Nill",
          INSURANCE: truck.vehicle_insurance_file?.file_path ? "Original received" : "Nill",
          TAX: truck.fitness_file?.file_path ? "Original received" : "Nill", // If there's no dedicated TAX file, use fitness as placeholder
          POLLUTION: truck.polution_file?.file_path ? "Original received" : "Nill",
          "SPEED GOVERNER": truck.speed_governer_file?.file_path ? "Original received" : "Nill", // Only if such field exists
        }));
        setData(processedData);
      } catch (error) {
        console.error("Failed to fetch truck data:", error);
      }
    };

    fetchTruckData();
  }, []);

  const handleDownload = () => {
    if (data.length === 0) {
      console.error("No data available to download.");
      return;
    }
  
    // Step 1: Create the worksheet
    const ws = XLSX.utils.json_to_sheet(data);
  
    ws['!cols'] = [
      { wch: 8 },   // slNo
      { wch: 20 },  // Vechicle
      { wch: 20 },  // Vehicle No
      { wch: 25 },  // RC
      { wch: 25 },  // INSURANCE
      { wch: 20 },  // TAX
      { wch: 25 },  // POLLUTION
      { wch: 25 },  // SPEED GOVERNER
    ];
  
    // Step 3: Create workbook and append sheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "trucks");
  
    // Step 4: Download the Excel file
    XLSX.writeFile(wb, "truck_data.xlsx");
  };
  

  return (
    <div
      className="cursor-pointer text-xs px-4 py-2.5 font-medium bg-blue-600 text-white rounded hover:bg-blue-700"
      onClick={handleDownload}
    >
      Download
    </div>
  );
};

export default DownloadExcelButton;
