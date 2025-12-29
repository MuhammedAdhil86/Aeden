import { axiosInstance, axiosInstanceLogin, axiosInstanceProcurement } from "./axiosInstance";
import { login } from "./api";

export const loginUser = async (credentials) => {
  const response = await axiosInstanceLogin.post(login, credentials);
  return response.data;
};