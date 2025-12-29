import { accident, addAccident, addExcalation, addIssues, addScore, assetManagement, assetSearch, containerSearch, containerTracking, expenseSearch, fleetExpense, fleetExpenseById, getIssueById, idle, idleSearch, insurance, insuranceSearch, reportTripSearch, scorecardById, scorecardSearch, searchTripLog, service, serviceSearch, thirdParty, thirdPartySearch, truckTracking, truckTrackingSearch } from "./api";
import { axiosInstance } from "./axiosInstance";


//fleet expense
export const fetchFleetExpense = async (starting_date, ending_date) => {
  try {
    const response = await axiosInstance.get(`${fleetExpense}?start_date=${starting_date}&end_date=${ending_date}`);
    console.log("fleet expense details : ",response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching fleet expense details:", error);
    throw error;
  }
};



//filter trip log 
export const filterTripLog = async (starting_date, ending_date) => {
  try {
    const response = await axiosInstance.get(`${searchTripLog}?start=${starting_date}&end=${ending_date}`);
    console.log("tripsheet log details : ",response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching tripsheet log details:", error);
    throw error;
  }
};

//fleet search
export const fleetSearch = async (data) => {
  try {
    const response = await axiosInstance.get(`${expenseSearch}?search=${data}`);
    console.log(" expense search : ",response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching expense search:", error);
    throw error;
  }
};

//asset Management
export const fetchassetManagement = async (starting_date, ending_date) => {
  try {
    const response = await axiosInstance.get(`${assetManagement}?start_date=${starting_date}&end_date=${ending_date}`);
    console.log("fleet expense details : ",response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching fleet expense details:", error);
    throw error;
  }
};

//asset search
export const assetManagementSearch = async (data) => {
  try {
    const response = await axiosInstance.get(`${assetSearch}?search=${data}`);
    console.log(" expense search : ",response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching expense search:", error);
    throw error;
  }
};

//idle monitioring 
export const fetchIdleMonitioring = async (starting_date, ending_date) => {
  try {
    const response = await axiosInstance.get(`${idle}?start_date=${starting_date}&end_date=${ending_date}`);
    console.log("fleet expense details : ",response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching fleet expense details:", error);
    throw error;
  }
};

//idle search
export const searchIdleMonitioring = async (data) => {
  try {
    const response = await axiosInstance.get(`${idleSearch}?search=${data}`);
    console.log("fleet expense details : ",response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching fleet expense details:", error);
    throw error;
  }
};

//service log
export const fetchServiceLog = async (starting_date, ending_date) => {
  try {
    const response = await axiosInstance.get(`${service}?start_date=${starting_date}&end_date=${ending_date}`);
    console.log("fleet expense details : ",response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching fleet expense details:", error);
    throw error;
  }
};

//service search
export const searchService = async (data) => {
  try {
    const response = await axiosInstance.get(`${serviceSearch}?search=${data}`);
    console.log("fleet expense details : ",response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching fleet expense details:", error);
    throw error;
  }
};

//insurance tracking
export const fetchInsuranceTracking = async (starting_date, ending_date) => {
  try {
    const response = await axiosInstance.get(`${insurance}?start_date=${starting_date}&end_date=${ending_date}`);
    console.log("fleet expense details : ",response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching fleet expense details:", error);
    throw error;
  }
};

//search container tracking 
export const searchInsurance = async (data) => {
  try {
    const response = await axiosInstance.get(`${insuranceSearch}?search=${data}`);
    console.log("fleet expense details : ",response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching fleet expense details:", error);
    throw error;
  }
};

//expense by id
export const fetchExpenseById = async (id) => {
  try {
    const response = await axiosInstance.get(
      `${fleetExpense}?truck_id=${id}`
    );
    console.log("expense By Id service : ",response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching expense search:", error);
    throw error;
  }
};

//asset Management by id
export const fetchAssetManagementById = async (id) => {
  try {
    const response = await axiosInstance.get(`${assetManagement}?truck_id=${id}`);
    console.log("fleet expense details : ",response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching fleet expense details:", error);
    throw error;
  }
};

//truck tracking
export const fetchTruckTracking = async () => {
  const response = await axiosInstance.get(truckTracking);
  //console.log("truck tracking : ",response.data)
  return response.data;
};

//truck tracking search
export const searchTruckTracking = async (no) => {
  try {
    const response = await axiosInstance.get(
      `${truckTrackingSearch}?vehicleNumber=${no}`
    );
    //console.log("expense By Id service : ",response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching expense search:", error);
    throw error;
  }
};


//service log by truck id
export const fetchServiceById = async (id) => {
  try {
    const response = await axiosInstance.get(`${service}?truck_id=${id}`);
    //console.log("service details : ",response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching service details:", error);
    throw error;
  }
};

//container tracking
export const fetchContainerTracking = async () => {
  const response = await axiosInstance.get(containerTracking);
  //console.log("truck tracking : ",response.data)
  return response.data;
};

//search container tracking 
export const searchContainer = async (data) => {
  try {
    const response = await axiosInstance.get(`${containerSearch}?search=${data}`);
    console.log("fleet expense details : ",response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching fleet expense details:", error);
    throw error;
  }
};

//thirdParty
export const fetchthirdPartyOwnload = async () => {
  const response = await axiosInstance.get(thirdParty);
  //console.log("truck tracking : ",response.data)
  return response.data;
};

//thirdPartySearch
export const searchthirdPartyOwnload = async (data) => {
  try {
    const response = await axiosInstance.get(`${thirdPartySearch}?search=${data}`);
    console.log("fleet expense details : ",response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching fleet expense details:", error);
    throw error;
  }
};

//trip search
export const searchTripReport = async (data) => {
  try {
    const response = await axiosInstance.get(`${reportTripSearch}?search=${data}`);
    console.log("fleet expense details : ",response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching fleet expense details:", error);
    throw error;
  }
};

//accident fetch all 
export const fetchScorecard = async () => {
    const response = await axiosInstance.get(accident);
    //console.log("Scorecard : ",response.data)
    return response.data;
};

//fetch scorecard by id
export const fetchScorecardById = async (id) => {
  try {
    const response = await axiosInstance.get(`${scorecardById}?driver_id=${id}`);
    console.log("fetch scorecard by id : ",response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching fetch scorecard by id:", error);
    throw error;
  }
};

//add score 
export const createScore = async (data) => {
  const response = await axiosInstance.post(addScore, data);
  return response.data;
};

//add issue 
export const createIssue = async (data) => {
  const response = await axiosInstance.post(addIssues, data);
  return response.data;
};

//add accident
export const createAccident = async (data) => {
  const response = await axiosInstance.post(addAccident, data);
  return response.data;
};

//add excalation
export const createExcalation = async (data) => {
  const response = await axiosInstance.post(addExcalation, data);
  return response.data;
};

//get issue by id
export const fetchIssueById = async (id) => {
  try {
    const response = await axiosInstance.get(`${getIssueById}?driver_id=${id}`);
    console.log("issue id details : ",response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching issue by ID:", error);
    throw error;
  }
};

//search scorecard
export const searchScorecard = async (data) => {
  try {
    const response = await axiosInstance.get(`${scorecardSearch}?driver_name=${data}`);
    console.log("fleet expense details : ",response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching fleet expense details:", error);
    throw error;
  }
};

