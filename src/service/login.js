import {
  axiosInstance,
  axiosInstanceLogin,
  axiosInstanceProcurement,
} from "./axiosInstance";
import { login } from "./api";

export const loginUser = async (credentials) => {
  const response = await axiosInstanceLogin.post(login, credentials);

  // ✅ Console log to view full response data
  console.log("🔐 Login API Response:", response.data);

  return response.data;
};
