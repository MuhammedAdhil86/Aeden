import { addBooking, getBlType, getBooking, getBookingById, getBookingByUinId, getDetailsByUinId, searchBooking } from "./api";
import { axiosInstanceProcurement } from "./axiosInstance";

//fetch details by uin id
export const fetchExporterByUinId = async (UinId) => {
    try {
      const response = await axiosInstanceProcurement.get(
        `${getDetailsByUinId}?uin=${UinId}`
      );
      //console.log("details by uin id : ",response.data.data)
      return response.data.data;
    } catch (error) {
      console.error("Error fetching exporter by uin ID:", error);
      throw error;
    }
  };

//fetch all bl type

export const fetchBlType = async () => {
  const response = await axiosInstanceProcurement.get(getBlType);
  //console.log("bl type : ",response.data)
  return response.data;
}

//create booking

export const createBooking = async (formData) => {
    try {
      const response = await axiosInstanceProcurement.post(addBooking,formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating driver:", error);
      throw error;
    }
  };

//fetch all booking
export const fetchBooking = async () => {
    const response = await axiosInstanceProcurement.get(getBooking);
    //console.log("booking : ",response.data.data)
    return response.data.data;
  }

//booking search
export const fetchBookingSearch = async (name) => {
  try {
    const response = await axiosInstanceProcurement.get(
      `${searchBooking}?product=${name}`
    );
    //console.log("search booking : ",response.data.data)
    return response.data.data;
  } catch (error) {
    console.error("Error fetching exporter by uin ID:", error);
    throw error;
  }
};

//fetch booking by id
export const fetchBookingById = async (id) => {
  try {
    const response = await axiosInstanceProcurement.get(
      `${getBookingById}?id=${2}`
    );
    //console.log("booking by id : ",response.data.data)
    return response.data.data;
  } catch (error) {
    console.error("Error fetching booking by id:", error);
    throw error;
  }
}

//fetch booking by uin id
export const fetchBookingByUinId = async (UinId) => {
  try {
    const response = await axiosInstanceProcurement.get(
      `${getBookingByUinId}?uin=${UinId}`
    );
    //console.log("booking by uin id : ",response.data.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching booking by uin ID:", error);
    throw error;
  }
}