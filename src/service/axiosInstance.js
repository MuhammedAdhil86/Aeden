import axios from "axios";
import { promise } from "zod";

const axiosInstanceLogin = axios.create({
  //baseURL: process.env.REACT_APP_BASE_URL,
  // baseURL:'https://ks579fsl-8087.inc1.devtunnels.ms/',
  baseURL: "https://rebs-hr-cwhyx.ondigitalocean.app/", //live url
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstanceLogin.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const axiosInstance = axios.create({
  // baseURL:'https://8nqzs8nv-8015.inc1.devtunnels.ms/',
  service1baseURL: "https://aeden-fleet-t579q.ondigitalocean.app", //live url fleet
  // baseURL: "https://ks579fsl-8015.inc1.devtunnels.ms/",
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    //console.log("token in fleet : ", token);
    if (!token) {
      // Redirect to login page
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return Promise.reject(new Error("No token found"));
    }
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    const newToken = response.headers["authorization"];
    if (newToken) {
      localStorage.setItem("token", newToken.replace("Bearer ", ""));
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const axiosInstanceProcurement = axios.create({
  //baseURL: process.env.REACT_APP_BASE_URL,
  // baseURL:'https://8nqzs8nv-8013.inc1.devtunnels.ms/',
  baseURL: "https://aeden-procurement-57sgz.ondigitalocean.app",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstanceProcurement.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//--------------stock-----------------
const axiosInstanceWarehouse = axios.create({
  // baseURL: 'https://8nqzs8nv-8018.inc1.devtunnels.ms/',
  baseURL: "https://aeden-fleet-t579q.ondigitalocean.app", //live url fleet

  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstanceWarehouse.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//----------------------------benchmarking----------------------
const axiosInstanceBenchmarking = axios.create({
  baseURL: "https://aeden-fleet-t579q.ondigitalocean.app",
  headers: {
    "Content-Type": "application/json",
  },
});
axiosInstanceBenchmarking.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const axiosInstanceSales = axios.create({
  baseURL: "https://aeden-fleet-t579q.ondigitalocean.app",

  headers: {
    "Content-Type": "application/json",
  },
});
axiosInstanceSales.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export {
  axiosInstanceLogin,
  axiosInstance,
  axiosInstanceProcurement,
  axiosInstanceWarehouse,
  axiosInstanceBenchmarking,
  axiosInstanceSales,
};
