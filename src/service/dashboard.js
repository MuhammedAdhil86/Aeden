import { completedTripPercentage, graphProfitByYear, nOfDriver, nOfTruck, onGoingTripPercentage, tripCompleted, triPending, triPendingPercentage, tripOngoing } from "./api";
import { axiosInstance } from "./axiosInstance";


//total truck
export const totalTruck = async () => {
    const response = await axiosInstance.get(nOfTruck);
    //console.log("totalTruck : ",response.data.data)
    return response.data.data;
};

//total driver
export const totalDriver = async () => {
    const response = await axiosInstance.get(nOfDriver);
    //console.log("totalDriver : ",response.data.data)
    return response.data.data;
};

//total completed trip 
export const totalCompletedTrip = async () => {
    const response = await axiosInstance.get(tripCompleted);
    //console.log("total completed trip : ",response.data.data)
    return response.data.data;
};

//completed trip percentage
export const tripcompletedTripPercentage = async () => {
    const response = await axiosInstance.get(completedTripPercentage);
    console.log("trip completed percentage : ",response.data.data)
    return response.data.data;
};

//total ongoing trip
export const totalOnGoingTrip = async () => {
    const response = await axiosInstance.get(tripOngoing);
    //console.log("total On going trip : ",response.data.data)
    return response.data.data;
};

//ongoing trip percentage
export const tripOnGoingPercentage = async () => {
    const response = await axiosInstance.get(onGoingTripPercentage);
    //console.log("total On going trip : ",response.data.data)
    return response.data.data;
};

//total pending trip
export const totalPendingTrip = async () => {
    const response = await axiosInstance.get(triPending);
    //console.log("total On going trip percentage : ",response.data.data)
    return response.data.data;
};

//total pending trip
export const tripPendingPercentage = async () => {
    const response = await axiosInstance.get(triPendingPercentage);
    //console.log("total On going trip percentage : ",response.data.data)
    return response.data.data;
};

//graph by year
export const fetchProfitByYear = async (year) => {
  try {
    const response = await axiosInstance.get(
      `${graphProfitByYear}?year=${year}`
    );
    //console.log("Profit By year : ",response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching Profit By year:", error);
    throw error;
  }
};