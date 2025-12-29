import React from 'react';
import * as XLSX from 'xlsx';

const ExcelDownloadComponent = ({ data }) => {
  const formatDate = (dateString) => {
    if (!dateString || dateString === "0001-01-01T00:00:00Z") {
      return "N/A";
    }
    return new Date(dateString).toLocaleDateString("en-GB");
  };

  const formatDateTime = (dateString) => {
    if (!dateString || dateString === "0001-01-01T00:00:00Z") {
      return "N/A";
    }
    return new Date(dateString).toLocaleString("en-GB");
  };

  const transformDataForExcel = (bookingData) => {
    return bookingData.map(booking => ({
      // Basic Information
      'Booking ID': booking.id || 'N/A',
      'Supplier Name': booking.supplier_name || 'N/A',
      'Consignee': booking.consignee || 'N/A',
      'Country': booking.country || 'N/A',
      'HSM Code': booking.hsm_code || 'N/A',
      'BI Number': booking.bi_number || 'N/A',
      'BI Type': booking.bi_type?.types || 'N/A',
      'Switch BI': booking.switchbi ? 'Yes' : 'No',
      'Place of Switch': booking.place_of_switch?.country_name || 'N/A',
      'Invoice Number': booking.invoice_number || 'N/A',
      'Invoice Amount': booking.invoice_amount || 'N/A',
      
      // Product & Terms
      'Product Name': booking.product_id || 'N/A',
      //'Product Description': booking.product_id?.description || 'N/A',
      //'Manufacturer': booking.product_id?.manufacturer || 'N/A',
      //'Batch Number': booking.product_id?.batch_number || 'N/A',
      'Incoterm': booking.incoterm_id || 'N/A',
      'Mode': booking.mode_id || 'N/A',
      'Has Insurance': booking.has_insurance ? 'Yes' : 'No',
      'Insurance Amount': booking.has_insurance ? booking.amount : 'N/A',
      
      // Shipping Details
      'Container Number': booking.cnt_number || 'N/A',
      'Shipping Line': booking.shipping_line || 'N/A',
      'Vessel Name': booking.vessal_name || 'N/A',
      'Vessel Voyage Number': booking.vessal_voyage_number || 'N/A',
      'Is Transhipment': booking.istranshipment ? 'Yes' : 'No',
      'Transhipment Port': booking.transhipment_port || 'N/A',
      'Feeder Vessel Name': booking.feeder_vessal_name || 'N/A',
      'Feeder Vessel Voyage Number': booking.feeder_vessal_voyage_number || 'N/A',
      
      // Ports & Locations
      'Port of Loading': booking.port_of_loading || 'N/A',
      'Port of Discharge': booking.port_of_discharge || 'N/A',
      'First Point of Loading': booking.first_point_of_loading || 'N/A',
      'Final Point of Discharge': booking.final_point_of_discharge || 'N/A',
      
      // Notify Parties
      'Notify Party 1': booking.notifyparty1 || 'N/A',
      'Notify Party 2': booking.notifyparty2 || 'N/A',
      'Notify Party 3': booking.notifyparty3 || 'N/A',
      
      // Dates & Timeline
      'ETA/ATA': formatDate(booking.eta_or_ata),
      'Last Updated ETA': formatDate(booking.last_updated_eta),
      'Free Days': booking.free_days || 'N/A',
      'Detention Period': formatDate(booking.detention_period),
      'Created At': formatDateTime(booking.created_at),
      'Updated At': formatDateTime(booking.updated_at),
      
      // Documents
      'Insurance File Available': booking.insurance_file?.file_path ? 'Yes' : 'No',
      'Insurance File URL': booking.insurance_file || 'N/A',
      //'Booking File Available': booking.file?.file_path ? 'Yes' : 'No',
      //'Booking File URL': booking.insurance_file || 'N/A',
    }));
  };

  const downloadExcel = () => {
    try {
      // Transform the data for Excel format
      const excelData = transformDataForExcel(data);
      
      // Create a new workbook
      const workbook = XLSX.utils.book_new();
      
      // Create worksheet from the data
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      
      // Set column widths for better readability
      const columnWidths = [
        { wch: 12 }, // Booking ID
        { wch: 20 }, // Supplier Name
        { wch: 20 }, // Consignee
        { wch: 15 }, // Country
        { wch: 15 }, // HSM Code
        { wch: 15 }, // BI Number
        { wch: 15 }, // BI Type
        { wch: 12 }, // Switch BI
        { wch: 15 }, // Place of Switch
        { wch: 15 }, // Invoice Number
        { wch: 15 }, // Invoice Amount
        { wch: 20 }, // Product Name
        { wch: 25 }, // Product Description
        { wch: 20 }, // Manufacturer
        { wch: 15 }, // Batch Number
        { wch: 12 }, // Incoterm
        { wch: 12 }, // Mode
        { wch: 15 }, // Has Insurance
        { wch: 15 }, // Insurance Amount
        { wch: 15 }, // Container Number
        { wch: 15 }, // Shipping Line
        { wch: 15 }, // Vessel Name
        { wch: 20 }, // Vessel Voyage Number
        { wch: 15 }, // Is Transhipment
        { wch: 20 }, // Transhipment Port
        { wch: 20 }, // Feeder Vessel Name
        { wch: 25 }, // Feeder Vessel Voyage Number
        { wch: 20 }, // Port of Loading
        { wch: 20 }, // Port of Discharge
        { wch: 25 }, // First Point of Loading
        { wch: 25 }, // Final Point of Discharge
        { wch: 20 }, // Notify Party 1
        { wch: 20 }, // Notify Party 2
        { wch: 20 }, // Notify Party 3
        { wch: 15 }, // ETA/ATA
        { wch: 18 }, // Last Updated ETA
        { wch: 12 }, // Free Days
        { wch: 18 }, // Detention Period
        { wch: 20 }, // Created At
        { wch: 20 }, // Updated At
        { wch: 20 }, // Insurance File Available
        { wch: 50 }, // Insurance File URL
        { wch: 20 }, // Booking File Available
        { wch: 50 }, // Booking File URL
      ];
      
      worksheet['!cols'] = columnWidths;
      
      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Booking Details');
      
      // Generate filename with current date
      const currentDate = new Date().toISOString().split('T')[0];
      const filename = `booking_details_${currentDate}.xlsx`;
      
      // Write the file
      XLSX.writeFile(workbook, filename);
      
      console.log('Excel file downloaded successfully!');
    } catch (error) {
      console.error('Error downloading Excel file:', error);
      alert('Error downloading Excel file. Please try again.');
    }
  };

  return (
    <div
      className="bg-blue-600 hover:bg-blue-700 text-white text-[13px] px-4 py-1.5 rounded-md cursor-pointer flex items-center gap-2 transition-colors"
      onClick={downloadExcel}
    >
      Download Excel
    </div>
  );
};

export default ExcelDownloadComponent;