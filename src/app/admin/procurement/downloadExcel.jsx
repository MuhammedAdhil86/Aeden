import * as XLSX from 'xlsx';

// Function to download purchase orders as Excel
const downloadExcel = () => {
  if (!purchaseData || purchaseData.length === 0) {
    toast.error("No data available to download");
    return;
  }

  try {
    // Transform the data to a flat structure for Excel
    const excelData = purchaseData.map((order, index) => ({
      'S.No': index + 1,
      'UIN': order.uin || '',
      'Product Name': order.products?.name || '',
      'Product Brand': order.products?.brand_name || '',
      'HSM Code': order.products?.hsm_code || '',
      'Category': order.category?.category_name || '',
      'Party Name': order.party_name || '',
      'Date': order.date ? new Date(order.date).toLocaleDateString() : '',
      'Address': order.address || '',
      'Country': order.country?.country_name || '',
      'Zipcode': order.zipcode || '',
      'Email': order.email || '',
      'Phone': order.phone || '',
      'Port of Loading': order.port_of_loading_id?.port_name || '',
      'Port of Discharge': order.port_of_discharge_id?.port_name || '',
      'Planned Load Date': order.planned_date_of_load ? new Date(order.planned_date_of_load).toLocaleDateString() : '',
      'Planned Delivery Date': order.planned_date_of_delivery ? new Date(order.planned_date_of_delivery).toLocaleDateString() : '',
      'Units': Array.isArray(order.unit) ? order.unit.join(', ') : order.unit || '',
      'Quantities': Array.isArray(order.qty) ? order.qty.join(', ') : order.qty || '',
      'Amount': order.amount || 0,
      'Created At': order.created_at && order.created_at !== '0001-01-01T00:00:00Z' ? new Date(order.created_at).toLocaleDateString() : '',
      'Updated At': order.updated_at && order.updated_at !== '0001-01-01T00:00:00Z' ? new Date(order.updated_at).toLocaleDateString() : ''
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Auto-size columns
    const columnWidths = [];
    const headers = Object.keys(excelData[0] || {});
    
    headers.forEach((header, index) => {
      const maxLength = Math.max(
        header.length,
        ...excelData.map(row => String(row[header] || '').length)
      );
      columnWidths[index] = { width: Math.min(maxLength + 2, 50) };
    });
    
    worksheet['!cols'] = columnWidths;

    // Add the worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Purchase Orders');

    // Generate filename with current date
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `purchase_orders_${currentDate}.xlsx`;

    // Download the file
    XLSX.writeFile(workbook, filename);
    
    toast.success("Excel file downloaded successfully!");
    
  } catch (error) {
    console.error("Error downloading Excel file:", error);
    toast.error("Failed to download Excel file");
  }
};

// Alternative version with more detailed product information
const downloadDetailedExcel = () => {
  if (!purchaseData || purchaseData.length === 0) {
    toast.error("No data available to download");
    return;
  }

  try {
    // Create multiple sheets for different views
    const workbook = XLSX.utils.book_new();

    // Sheet 1: Summary Data
    const summaryData = purchaseData.map((order, index) => ({
      'S.No': index + 1,
      'UIN': order.uin || '',
      'Party Name': order.party_name || '',
      'Product': order.products?.name || '',
      'Brand': order.products?.brand_name || '',
      'Category': order.category?.category_name || '',
      'Amount': order.amount || 0,
      'Date': order.date ? new Date(order.date).toLocaleDateString() : '',
      'Status': 'Active' // You can add status logic here
    }));

    // Sheet 2: Detailed Information
    const detailedData = purchaseData.map((order, index) => ({
      'S.No': index + 1,
      'UIN': order.uin || '',
      'Product Name': order.products?.name || '',
      'Product Brand': order.products?.brand_name || '',
      'HSM Code': order.products?.hsm_code || '',
      'Description': order.products?.description || '',
      'Manufacturer': order.products?.manufacturer || '',
      'Batch Number': order.products?.batch_number || '',
      'Category': order.category?.category_name || '',
      'Party Name': order.party_name || '',
      'Address': order.address || '',
      'Country': order.country?.country_name || '',
      'Zipcode': order.zipcode || '',
      'Email': order.email || '',
      'Phone': order.phone || '',
      'Port of Loading': order.port_of_loading_id?.port_name || '',
      'Port of Discharge': order.port_of_discharge_id?.port_name || '',
      'Planned Load Date': order.planned_date_of_load ? new Date(order.planned_date_of_load).toLocaleDateString() : '',
      'Planned Delivery Date': order.planned_date_of_delivery ? new Date(order.planned_date_of_delivery).toLocaleDateString() : '',
      'Units': Array.isArray(order.unit) ? order.unit.join(', ') : order.unit || '',
      'Quantities': Array.isArray(order.qty) ? order.qty.join(', ') : order.qty || '',
      'Amount': order.amount || 0,
      'Order Date': order.date ? new Date(order.date).toLocaleDateString() : '',
      'Created At': order.created_at && order.created_at !== '0001-01-01T00:00:00Z' ? new Date(order.created_at).toLocaleDateString() : '',
      'Updated At': order.updated_at && order.updated_at !== '0001-01-01T00:00:00Z' ? new Date(order.updated_at).toLocaleDateString() : ''
    }));

    // Create worksheets
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    const detailedSheet = XLSX.utils.json_to_sheet(detailedData);

    // Auto-size columns for both sheets
    [summarySheet, detailedSheet].forEach(sheet => {
      const data = sheet === summarySheet ? summaryData : detailedData;
      const headers = Object.keys(data[0] || {});
      const columnWidths = headers.map(header => ({
        width: Math.min(
          Math.max(
            header.length,
            ...data.map(row => String(row[header] || '').length)
          ) + 2,
          50
        )
      }));
      sheet['!cols'] = columnWidths;
    });

    // Add sheets to workbook
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
    XLSX.utils.book_append_sheet(workbook, detailedSheet, 'Detailed');

    // Generate filename
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `purchase_orders_detailed_${currentDate}.xlsx`;

    // Download
    XLSX.writeFile(workbook, filename);
    
    toast.success("Detailed Excel file downloaded successfully!");
    
  } catch (error) {
    console.error("Error downloading detailed Excel file:", error);
    toast.error("Failed to download Excel file");
  }
};