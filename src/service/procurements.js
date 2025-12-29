import { axiosInstanceProcurement } from "./axiosInstance";
import { addProduct, getProduct, getVarity, addVarity, addPurchase, fetchPurchase, getUnits, getCountry, getTerms, getModes, getPorts, searchPurchase, getSupplier, getSupplierById, getPurchaseByUIN, addPort, getVarityById, updatePurchaseStatus, addSupplier, addUnit, updatePurchase, addCountry, getHSNByProduct } from "./api";


// Add new Supplier
export const createSupplier = async (payload) => {
  const response = await axiosInstanceProcurement.post(addSupplier, payload);
  return response.data;
};

// Fetch all Suppliers
export const getAllSuppliers = async () => {
  try {
    const response = await axiosInstanceProcurement.get(getSupplier);
    //console.log("Suppliers fetched successfully:", response.data);
    if (!response.data) {
      throw new Error("No data returned from suppliers endpoint");
    }
    return response;
  } catch (error) {
    console.error("Failed to fetch suppliers:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error("Unable to fetch suppliers. Please try again later.");
  }
};

export const fetchSupplierById = async (id) => {
  try {
    const response = await axiosInstanceProcurement.get(`${getSupplierById}?id=${id}`);
    if (!response.data) {
      throw new Error("No supplier data returned for ID: " + id);
    }
    return response.data;
  } catch (error) {
    console.error("Failed to fetch supplier details:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error("Unable to fetch supplier details. Please try again.");
  }
};

// Add new Product
export const createProduct = async (payload) => {
  const response = await axiosInstanceProcurement.post(addProduct, payload);
  return response.data;
};

// Fetch all Products
export const getAllProducts = async () => {
  const response = await axiosInstanceProcurement.get(getProduct);
  //console.log("products : ",response.data)
  return response.data;
};

//Fetch all variety
export const fetchVarity = async () => {
  const response = await axiosInstanceProcurement.get(getVarity);
  console.log("variety : ",response.data.data)
  return response.data.data;
};

// Fetch variety by product ID
export const fetchVarityByProductId = async (productId) => {
  try {
    const response = await axiosInstanceProcurement.get(`${getVarityById}?product_id=${productId}`);
    if (!response.data) {
      throw new Error("No variety data returned for product ID: " + productId);
    }
    return response.data;
  } catch (error) {
    console.error("Failed to fetch variety by product ID:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error("Unable to fetch variety details. Please try again.");
  }
}

// Fetch HSN code by product id
export const fetchHSNByProduct = async (productId) => {
  try {
    const response = await axiosInstanceProcurement.get(`${getHSNByProduct}?id=${productId}`);
    if (!response.data) {
      throw new Error("No HSN data returned for product ID: " + productId);
    }
    return response.data;
  } catch (error) {
    console.error("Failed to fetch HSN by product ID:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error("Unable to fetch HSN details. Please try again.");
  }
};

//add variety
export const createVariety = async (data) => {
  const response = await axiosInstanceProcurement.post(addVarity, data);
  return response.data;
};

//fetch units
export const fetchUnits = async () => {
  const response = await axiosInstanceProcurement.get(getUnits);
  //console.log("units : ",response.data)
  return response.data;
};

//create purchase
export const createPurchase = async (data) => {
  const response = await axiosInstanceProcurement.post(addPurchase, data);
  return response.data;
};

//fetch purchase
export const getPurchase = async () => {
  const response = await axiosInstanceProcurement.get(fetchPurchase);
  //console.log("purchase : ",response.data)
  return response.data;
}

//add country
export const createCountry = async (data) => {
  const response = await axiosInstanceProcurement.post(addCountry, data);
  return response.data;
}

//fetch all countries
export const fetchCountry = async () => {
  const response = await axiosInstanceProcurement.get(getCountry);
  //console.log("country : ",response.data)
  return response.data;
}

//fetch all INCO TERMS
export const fetchIncoTerms = async () => {
  const response = await axiosInstanceProcurement.get(getTerms);
  //console.log("INCO TERMS : ",response.data)
  return response.data;
}

//fetch all modes
export const fetchModes = async () => {
  const response = await axiosInstanceProcurement.get(getModes);
  //console.log("modes : ",response.data)
  return response.data;
}

//add port
export const createPort = async (data) => {
  const response = await axiosInstanceProcurement.post(addPort, data);
  return response.data;
}

//fetch all ports
export const fetchPorts = async () => {
  const response = await axiosInstanceProcurement.get(getPorts);
  //console.log("ports : ",response.data)
  return response.data;
}

//search procurement 
export const fetchProcurementSearch = async (name) => {
  try {
    const response = await axiosInstanceProcurement.get(
      `${searchPurchase}?party_name=${name}`
    );
    //console.log("search trip : ",response.data.data)
    return response.data.data;
  } catch (error) {
    console.error("Error fetching trip search:", error);
    throw error;
  }
};

// Get purchase by UIN
export const fetchPurchaseByUIN = async (uin) => {
  try {
    const response = await axiosInstanceProcurement.get(`${getPurchaseByUIN}?uin=${uin}`);
    if (!response.data) {
      throw new Error("No purchase data returned for UIN: " + uin);
    }
    return response.data;
  } catch (error) {
    console.error("Failed to fetch purchase details by UIN:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error("Unable to fetch purchase details. Please try again.");
  }
}

// Update purchase status
export const updatePurchaseOrderStatus = async (uin, status) => {
  try {
    const response = await axiosInstanceProcurement.put(
      `${updatePurchaseStatus}?uin=${uin}&status=${status}`
    );
    return response.data;
  } catch (error) {
    console.error('Error updating purchase order status:', error);
    throw error;
  }
};

export const createUnit = async (data) => {
  const response = await axiosInstanceProcurement.post(addUnit, data);
  return response.data;
}

export const updatePurchaseOrder = async (data) => {
  try {
    const response = await axiosInstanceProcurement.put(updatePurchase, data);
    return response.data;
  } catch (error) {
    console.error('Error updating purchase order:', error);
    throw error;
  }
};