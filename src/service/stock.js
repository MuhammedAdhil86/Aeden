
import { axiosInstance, axiosInstanceWarehouse } from "./axiosInstance";

// Base URLs
const MASTER_STOCK_BASE = "/master/stock";

export const fetchStock = async () => {
  try {
    const response = await axiosInstanceWarehouse.get("/master/stock/fetchUrl");
    return response.data;
  } catch (error) {
    console.error("Error fetching stock:", error);
    
    if (error.response) {
      console.error("Server responded with:", error.response.status);
      console.error("Response data:", error.response.data);
    } else if (error.request) {
      console.error("No response received from:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
    
    throw error;
  }
};

export const searchStock = async (searchField, searchValue, allStockData) => {
  try {
    // If we have all data, filter client-side
    if (allStockData && allStockData.length > 0) {
      const filteredData = allStockData.filter((stock) => {
        const fieldValue = String(stock[searchField] || '').toLowerCase();
        const searchTerm = searchValue.toLowerCase();
        
        return fieldValue.includes(searchTerm);
      });
      
      console.log(`Client-side search: Found ${filteredData.length} results for ${searchField}: ${searchValue}`);
      return filteredData;
    }
    
    // If no data provided, try API call (but it might fail)
    const params = new URLSearchParams();
    if (searchField && searchValue) {
      params.append(searchField, `%${searchValue}%`);
    }
    
    const url = `${MASTER_STOCK_BASE}/filter?${params.toString()}`;
    console.log("Search Stock URL:", url);
    
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error('Error searching stock:', error);
    
    // If API fails, return empty array and we'll handle client-side filtering in the component
    if (error.response?.status === 404) {
      console.warn('Search API endpoint not found, using client-side filtering');
      return [];
    }
    
    if (error.response?.status === 500) {
      console.warn('Backend server error detected for stock search');
      return [];
    }
    
    throw error;
  }
};

// export const fetchStockByDateRange = async (fromDate, toDate = null) => {
//   try {
//     const params = new URLSearchParams();
//     params.append('from', fromDate);
//     if (toDate) { 
//       params.append('to', toDate);
//     }    
//     const url = `${MASTER_STOCK_BASE}/dateRange?${params.toString()}`;
//     console.log("Final Stock API URL:", url);
    
//     const response = await axiosInstanceWarehouse.get(url);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching from stock date range', error);

//     if (error.response?.status === 500) {
//       console.warn('Backend server data detected for stock data');
//       return [];
//     } 
//     throw error;
//   }
// };


// export const fetchStockByDateRange = async (fromDate, toDate = null) => {
//   try {
//     const params = new URLSearchParams();
//     params.append('from', fromDate);
//     if (toDate) { 
//       params.append('to', toDate);
//     }    
    
//     const url = `/master/stock/dateRange?${params.toString()}`;
//     console.log("Final Stock API URL:", url);
    
//     const response = await axiosInstanceWarehouse.get(url);
//     console.log("Raw API response:", response);
//     console.log("Response data:", response.data);
    
//     // Handle different response structures
//     if (response.data === null) {
//       console.log("API returned null - no data found");
//       return [];
//     }
    
//     if (Array.isArray(response.data)) {
//       return response.data;
//     }
    
//     // If response is an object with a data property
//     if (response.data && Array.isArray(response.data.data)) {
//       return response.data.data;
//     }
    
//     // If response is an object with other structure
//     if (response.data && typeof response.data === 'object') {
//       // Try to find array in the response object
//       const possibleArrays = Object.values(response.data).filter(item => Array.isArray(item));
//       if (possibleArrays.length > 0) {
//         return possibleArrays[0];
//       }
//     }
    
//     console.warn("Unexpected API response structure:", response.data);
//     return [];
    
//   } catch (error) {
//     console.error('Error fetching from stock date range', error);
//     console.error('Error details:', error.response?.data);

//     if (error.response?.status === 500) {
//       console.warn('Backend server error detected for stock data');
//       return [];
//     } 
    
//     if (error.response?.status === 404) {
//       console.warn('Date range endpoint not found');
//       return [];
//     }
    
//     throw error;
//   }
// };


export const fetchStockByDateRange = async (fromDate, toDate = null) => {
  try {
    const params = new URLSearchParams();
    
    if (fromDate) {
      params.append('from', fromDate);
    }
    
    if (toDate) { 
      params.append('to', toDate);
    }
    
    const url = `/master/stock/dateRange?${params.toString()}`;
    console.log("🔍 Making API call to:", url);
    
    const response = await axiosInstanceWarehouse.get(url);
    console.log("📊 API Response status:", response.status);
    console.log("📦 Response data type:", typeof response.data);
    console.log("🔢 Response data length:", Array.isArray(response.data) ? response.data.length : 'Not an array');
    
    // Rest of your existing response handling code...
    if (response.data === null) {
      console.log("API returned null - no data found");
      return [];
    }
    
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    // If response is an object with a data property
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    
    // If response is an object with other structure
    if (response.data && typeof response.data === 'object') {
      const possibleArrays = Object.values(response.data).filter(item => Array.isArray(item));
      if (possibleArrays.length > 0) {
        return possibleArrays[0];
      }
    }
    
    console.warn("Unexpected API response structure:", response.data);
    return [];
    
  } catch (error) {
    console.error('❌ Error fetching from stock date range:', error);
    console.error('Error details:', error.response?.data);
    throw error;
  }
};

export const stockService = {
  searchStocks: searchStock,
  fetchStockByDateRange,
  fetchStock
};
