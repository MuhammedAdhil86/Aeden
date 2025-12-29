import { axiosInstance } from "./axiosInstance";
import { getDriver, getTruck, addDriver, addTrip, addTruck, getTrip, getDrivers, searchDriver, searchTruck, searchTrip, getTripById, updatePayment, searchTripBydate, getDriverById, getTruckById, getAvailableTruck, getBranches, addBranch, tripUpdate, driverUpdate, getHalting, updateTruck, tripDelete, truckDelete, driverDelete, tripEnd, getThirdPartyTruck, getStop, addStop, removeStop } from "./api";

//create driver
export const createDriver = async (formData) => {
    try {
      const response = await axiosInstance.post(addDriver,formData,
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

//fetch all drivers
export const fetchAllDriver = async () => {
    const response = await axiosInstance.get(getDrivers);
    //console.log("driver : ",response.data.data)
    return response.data.data;
};

//Fetch available driver
export const fetchDriver = async () => {
    //const response = await axiosInstance.get(getDrivers); //all driver
    const response = await axiosInstance.get(getDriver); //available driver

    //console.log("driver : ",response.data.data)
    return response.data.data;
};

//fetch available truck 
export const fetchAvailableTruck = async () => {
    //const response = await axiosInstance.get(getTruck); // all truck
    const response = await axiosInstance.get(getAvailableTruck); // available truck

    //console.log("driver : ",response.data.data)
    return response.data.data;
};

//create truck
export const createTruck = async (formData) => {
    try {
      const response = await axiosInstance.post(addTruck,formData,
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

//Fetch all truck
export const fetchTruck = async () => {
    const response = await axiosInstance.get(getTruck);
    //console.log("truck : ",response.data.data)
    return response.data.data;
};

//fetch 3rd party truck
export const fetchThirdPartyTruck = async () => {
    const response = await axiosInstance.get(getThirdPartyTruck);
    //console.log("truck : ",response.data.data)
    return response.data.data;
};

//create stop
export const createStop = async (userData) => {
  try {
    const response = await axiosInstance.post(addStop, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'stop adding failed');
  }
};

//fetch stops
export const fetchStop = async () => {
  try {
     const response = await axiosInstance.get(getStop);
    //console.log("trip : ",response.data.data)
    return response.data.data;
  } catch (error) {
    console.error("Fetch stop error:", error.response?.data || error.message);
    throw error;
  }
};

//removeStop
export const deleteStopById = async (id) => {
  try {    
    const response = await axiosInstance.delete(
      `${removeStop}?id=${id}`
    );
    //console.log("response : ",response)
    return response.data;
  } catch (error) {
    console.error("Error deleting stop:", error);
    throw error;
  }
};

//create trip
export const createTrip = async (formData) => {
    try {
      const response = await axiosInstance.post(addTrip,formData,
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

//trip update
export const updateTrip = async (formData) => {
    try {
      const response = await axiosInstance.put(tripUpdate,formData,
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

//Fetch all trip
export const fetchTrip = async () => {
  try {
     const response = await axiosInstance.get(getTrip);
    //console.log("trip : ",response.data.data)
    return response.data.data;
  } catch (error) {
    console.error("FetchTrip error:", error.response?.data || error.message);
    throw error;
  }
   
};

//driver search
export const fetchDetailsByDriverSearch = async (searchField) => {

  if (!searchField || !searchField.field || !searchField.value) {
    console.error("Invalid searchField input");
    return;
  }

  const { field, value } = searchField;

  try {
    const params = new URLSearchParams({ [field]: value });
    const response = await axiosInstance.get(`${searchDriver}?${params.toString()}`);
    console.log("search driver : ",response.data.data)
    return response.data.data;
  } catch (error) {
    console.error("Error fetching trip search:", error);
    throw error;
  }
};

//filter driver by status
export const filterDriver = async (status) => {
  if (!status) {
    console.error("Status is required for filtering drivers.");
    return [];
  }
  console.log("status : ",status)

  try {
    const params = new URLSearchParams({ status });
    const response = await axiosInstance.get(`${searchDriver}?${params.toString()}`);
    
    console.log("Search Driver Response:", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching filtered drivers:", error);
    throw error;
  }
};

//truck search
export const fetchDetailsByTruckSearch = async (searchField) => {
   if (!searchField || !searchField.field || !searchField.value) {
    console.error("Invalid searchField input");
    return;
  }

  const { field, value } = searchField;

  try {
    const params = new URLSearchParams({ [field]: value });
    const response = await axiosInstance.get(`${searchTruck}?${params.toString()}`);
    //console.log("truck search : ",response.data.data)
    return response.data.data;
  } catch (error) {
    console.error("Error fetching trip search:", error);
    throw error;
  }
};

//trip search
export const fetchTripSearch = async (searchField) => {
  if (!searchField || !searchField.field || !searchField.value) {
    console.error("Invalid searchField input");
    return;
  }

  const { field, value } = searchField;

  try {
    const params = new URLSearchParams({ [field]: value });
    const response = await axiosInstance.get(`${searchTrip}?${params.toString()}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching trip search:", error);
    throw error;
  }
};

//get trip by id
export const fetchTripById = async (id) => {
  try {    
    const response = await axiosInstance.get(
      `${getTripById}?id=${id}`
    );
    console.log("Trip By Id : ",response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching trip search:", error);
    throw error;
  }
};

//payment update
export const paymentUpdate = async (payload) => {
  const response = await axiosInstance.put(updatePayment, payload);
  return response.data;
};

//trip search by date
export const fetchTripDetailsByDate = async (date) => {
  console.log("date : ",date)
  try {
    const response = await axiosInstance.get(
      `${searchTripBydate}?start=${date}`
    );
    console.log("date search : ",response.data  )
    return response.data;
  } catch (error) {
    console.error("Error fetching exporter by uin ID:", error);
    throw error;
  }
};

//fetch driver by id
export const fetchDriverById = async (id) => {
  try {
    const response = await axiosInstance.get(`${getDriverById}?id=${id}`);
    console.log("driver id details : ",response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching driver by ID:", error);
    throw error;
  }
};

//fetch truck by id
export const fetchTruckById = async (id) => {
  try {
    const response = await axiosInstance.get(`${getTruckById}?id=${id}`);
    console.log("truck id details : ",response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching truck by ID:", error);
    throw error;
  }
};


//truchExpense
export const fetchExpenseByTruckId = async (trip_id) => {
  try {
    const response = await axiosInstance.get(`/master/trip/truckExpenseById?trip_id=${trip_id}`);
    return response.data; // axios uses response.data, not response.json()
  } catch (error) {
    console.error('Error fetching expenses by truck:', error);
    console.error('Error response:', error.response?.data);
    throw new Error('Failed to fetch expenses');
  }
};

//start trip
export const startTripUpdate = async (tripData) => {
  try {
    const response = await axiosInstance.put('master/driver/startTrip', tripData);
    return response.data;
  } catch (error) {
    console.error('Error starting trip:', error);
    throw error;
  }
};

//fetch all branches
export const fetchAllBranches = async () => {
    const response = await axiosInstance.get(getBranches);
    console.log("branch : ",response.data.data)
    return response.data.data;
};

//fetch all
export const fetchAllHalting = async () => {
  try {
    const response = await axiosInstance.get(getHalting);
    console.log("halting : ", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching halting slabs:", error);
    return [];
  }
};

//add branch 
export const createBranch = async (payload) => {
  const response = await axiosInstance.post(addBranch, payload);
  return response.data;
};

//driver update
export const updateDriverById = async (formData) => {
  try {
   console.log("Received FormData in updateDriverById:");
    for (let [key, value] of formData.entries()) {
      console.log(`FormData entry: ${key}=`, value);
    }
    
  const response = await axiosInstance.put(driverUpdate, formData);
  return response.data;
} catch (error) {
  console.error("Error updating driver:", error.message);
  throw error;
}
};

//truck update 
export const truckUpdate = async (formData) => {
    try {
      const response = await axiosInstance.put(updateTruck,formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating truck:", error);
      throw error;
    }
  };

//trip delete 
export const deleteTripById = async (id) => {
  try {
    const response = await axiosInstance.delete(`${tripDelete}?id=${id}`);
    console.log("trip deleted : ",response.data)
    return response.data;
  } catch (error) {
    console.error("Error deleting trip by ID:", error);
    throw error;
  }
};

//driver delete
export const deleteDriverById = async (id) => {
  try {
    const response = await axiosInstance.delete(`${driverDelete}?id=${id}`);
    console.log("driver deleted : ",response.data)
    return response.data;
  } catch (error) {
    console.error("Error deleting driver by ID:", error);
    throw error;
  }
};

//truck delete 
export const deleteTruckById = async (id) => {
  try {
    const response = await axiosInstance.delete(`${truckDelete}?id=${id}`);
    console.log("truck deleted : ",response.data)
    return response.data;
  } catch (error) {
    console.error("Error deleting truck by ID:", error);
    throw error;
  }
};

//End trip 
export const endTripUpdate = async (tripData) => {
  try {
    const response = await axiosInstance.put(tripEnd, tripData);
    return response.data;
  } catch (error) {
    console.error('Error ending trip:', error);
    throw error;
  }
};

//fetchDateByRange
export const fetchTripDetailsByDateRange = async (startDate, endDate = null) => {
  try {
    const params = new URLSearchParams();
    params.append('start', startDate);
    
    if (endDate) {
      params.append('end', endDate);
    }

    const url = `${searchTripBydate}?${params.toString()}`;
    console.log("Final API URL:", url);
    
    const response = await axiosInstance.get(url);
    console.log("Date range search response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching trips by date range:", error);
    
    // Check if it's the specific backend error we're seeing
    if (error.response?.status === 500 && 
        error.response?.data?.includes('in_transit_point') &&
        error.response?.data?.includes('unsupported Scan')) {
      console.warn("Backend database error detected. This is a server-side issue with in_transit_point field.");
      // Return empty array instead of throwing error
      return [];
    }
    
    throw error;
  }
};
