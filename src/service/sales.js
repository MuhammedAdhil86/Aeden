import { axiosInstanceSales } from "./axiosInstance"
export const fetchAllOrders = async () => {
  try {
    const response = await axiosInstanceSales.get("master/sales/fetchAll-order");
    const list = response.data?.data || [];
    console.log("fetchorders",list)
    const formatted = list.map((order, index) => ({
      slNo: index + 1,
      orderId: order.id || "-",
      customer: order.allocated_user_id?.sales_id?.client_name || "-",
      orderTakenBy: order.allocated_user_id?.staff_name || "-",
      date: order.created_at || "-",
      amount: order.total_amount || "0",
      status: order.order_status || "-",
      action: order.id,
      items: order.items || [],
      raw: order, 
    }));

    return formatted;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};


export const addOrder = async (payload) => {
  try {
    const response = await axiosInstanceSales.post(
      "master/sales/Add-order",
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};




// src/service/sales.js

export const fetchAllAllocation = async () => {
  const res = await axiosInstanceSales.get('/master/sales/fetchAll-allocation');
  return res.data;
};

export const createClient = async (payload) => {
  const res = await axiosInstanceSales.post('/master/sales/Add-client', payload);
  return res.data;
};

export const fetchAllStaffs = async () => {
  const res = await axiosInstanceSales.get('/master/sales/fetchAll-staffs');
  return res.data;
};

export const allocateClientToStaff = async (payload) => {
  // payload: { client_id, staff_id }
  const res = await axiosInstanceSales.post('/master/sales/allocate-client', payload);
  return res.data;
};

export const fetchOrdersForClient = async (clientId) => {
  const res = await axiosInstanceSales.get(`/master/sales/fetchOrders?client_id=${clientId}`);
  return res.data;
};


export const fetchAllocationStaffs = async () => {
  const res = await axiosInstanceSales.get(
    "master/sales/fetch-allocationStaffID"
  );
  return res.data;
};


export const addAllocation = async (payload) => {
  const res = await axiosInstanceSales.post(
    "master/sales/Add-allocation",
    payload
  );
  return res.data;
};


export const fetchAllClients = async () => {
  const res = await axiosInstanceSales.get("master/sales/fetchAll-client");
  return res.data;
};
