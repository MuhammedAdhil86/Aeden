import axios from "axios";

const FLEET_BASE_URL = "https://aeden-fleet-t579q.ondigitalocean.app";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: token ? `Bearer ${token}` : "" };
};

// ================= CATEGORY =================
export const getCategories = () =>
  axios.get(`${FLEET_BASE_URL}/master/stock/getAllCategory`, {
    headers: getAuthHeader(),
  });

// ================= PRODUCT =================
export const getProductsByCategory = (categoryName) =>
  axios.get(
    `${FLEET_BASE_URL}/master/stock/getAllProductByCategory?category=${categoryName}`,
    { headers: getAuthHeader() }
  );

// ================= COUNTRY =================
export const getCountries = () =>
  axios.get(`${FLEET_BASE_URL}/master/bench/getAll-country`, {
    headers: getAuthHeader(),
  });

// ================= SUPPLIER =================
export const getSuppliers = () =>
  axios.get(`${FLEET_BASE_URL}/master/bench/getAll-company`, {
    headers: getAuthHeader(),
  });

// ================= BRAND =================
export const getBrands = () =>
  axios.get(`${FLEET_BASE_URL}/master/bench/getAll-brand`, {
    headers: getAuthHeader(),
  });

// ================= LOCATION =================
export const getLocations = () =>
  axios.get(`${FLEET_BASE_URL}/master/bench/getAll-location`, {
    headers: getAuthHeader(),
  });

// ================= UNIT =================
export const getUnits = () =>
  axios.get(`${FLEET_BASE_URL}/master/bench/getAll-units`, {
    headers: getAuthHeader(),
  });

// ================= SUBMIT =================
export const addBenchmark = (payload) =>
  axios.post(`${FLEET_BASE_URL}/master/bench/Add`, payload, {
    headers: getAuthHeader(),
  });
export async function fetchMonthRangeDetails(product, category) {
  try {
    if (!product || !category) {
      return [];
    }

    // Safe token access (client-only)
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("token")
        : null;

    const response = await axios.get(
      "https://aeden-fleet-t579q.ondigitalocean.app/master/bench/fetchAll",
      {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      }
    );

    const data = response?.data?.data || [];

    // Optional filtering (safe)
    return data.filter(
      (item) =>
        item?.product?.product_name === product &&
        item?.category?.category_name === category
    );
  } catch (error) {
    console.error("fetchMonthRangeDetails error:", error);
    return [];
  }
}