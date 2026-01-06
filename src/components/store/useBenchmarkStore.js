import { create } from "zustand";
import { axiosInstanceBenchmarking } from "../../service/axiosInstance";
import {
  benchMonthRange,
  benchMonthRangeDetails,
  benchDominantDemand,
} from "@/service/api";

/* -------------------- HELPERS -------------------- */
const groupByProduct = (arr) => {
  const map = {};
  arr.forEach((item) => {
    const key = (item.product || "").trim().toLowerCase();
    if (!map[key]) map[key] = [];
    map[key].push(item);
  });
  return Object.values(map).map((group) => group[0]);
};

/* -------------------- STORE -------------------- */
export const useBenchmarkStore = create((set, get) => ({
  /* ================= STATE ================= */
  allStockData: [],
  groupedData: [],
  monthRangeDetails: [],

  tableData: [],
  monthlyData: [],

  /* 🔹 Market Demand */
  dominantDemand: "-",

  /* 🔹 New: Provider & Staff Count */
  providerCount: 0,
  staffCount: 0,

  /* 🔹 New: Total Prices Count */
  totalPriceEntries: 0,

  loading: false,
  error: null,

  searchTerm: "",
  searchField: "product",
  selectedMonth: "",
  selectedYear: new Date().getFullYear().toString(),

  /* ================= ACTIONS ================= */

  /* 🔹 FETCH BENCHMARKS BY MONTH RANGE */
  fetchMonthRange: async (from, to) => {
    set({ loading: true, error: null });

    try {
      const res = await axiosInstanceBenchmarking.get(benchMonthRange, { params: { from, to } });
      const raw = res.data?.data || [];

      const processed = raw.map((item, index) => {
        const avgPrice = Number(item.avg_price || 0);
        const lowerPrice = Number(item.lowest_price || 0);
        const higherPrice = Number(item.highest_price || 0);

        return {
          id: item.latest_id || index,
          date: item.last_date || "-",
          product: item.product?.product_name || "-",
          category: item.category?.category_name || "-",
          brand: item.brand_name || "-",
          origin: item.origin_country || "-",
          region: item.region || item.latest_region || "-",
          unit: item.unit || "-",
          lowerPrice,
          higherPrice,
          averagePrice: avgPrice,
          average_demand:
            item.average_demand && item.average_demand !== "None"
              ? item.average_demand
              : "-",
          originalData: item,
        };
      });

      set({
        allStockData: processed,
        groupedData: groupByProduct(processed),
        loading: false,
      });
    } catch (err) {
      console.error("❌ Fetch Month Range Error:", err);
      set({ error: "Failed to load data", loading: false });
    }
  },

  /* 🔹 FETCH MONTH RANGE DETAILS */
  fetchMonthRangeDetails: async ({ product_id, category_id, from, to }) => {
    set({ loading: true, error: null });

    try {
      const res = await axiosInstanceBenchmarking.get(benchMonthRangeDetails, { params: { product_id, category_id, from, to } });
      const raw = res.data?.data || [];

      const tableData = raw.map((item, index) => ({
        id: item.id || index,
        date: item.date || "-",
        product: item.product?.product_name || "-",
        category: item.category?.category_name || "-",
        region: item.region || "-",
        price: Number(item.price || 0),
        unit: item.unit || "-",
        origin: item.origin?.country_name || "-",
        brand: item.brand?.brand_name || "-",
        company: item.company?.company_name || "-",
        provider: item.provider || "-",
        quantity: Number(item.count || 0),
        demand: item.demand && item.demand !== "None" ? item.demand : "-",
        staff: item.uploaded_by || "-",
        remarks: item.remarks || "-",
      }));

      const monthlyData = raw.map((item) => ({
        date: item.date,
        price: Number(item.price || 0),
      }));

      set({
        tableData,
        monthlyData,
        monthRangeDetails: tableData,
        loading: false,
      });
    } catch (err) {
      console.error("❌ Month Details Error:", err);
      set({ error: "Failed to fetch details", loading: false });
    }
  },

  /* 🔹 FETCH DOMINANT MARKET DEMAND */
  fetchDominantDemand: async ({ product_id, from, to }) => {
    try {
      const res = await axiosInstanceBenchmarking.get(benchDominantDemand, { params: { product_id, from, to } });
      set({ dominantDemand: res.data?.data?.dominant_demand || "-" });
    } catch (err) {
      console.error("❌ Demand API Error:", err);
      set({ dominantDemand: "-" });
    }
  },

  /* 🔹 FETCH PROVIDER & STAFF COUNT */
  fetchProviderAndStaffCount: async ({ product_id, from, to }) => {
    try {
      const res = await axiosInstanceBenchmarking.get("/master/bench/providerAndstaffCount", { params: { product_id, from, to } });
      set({
        providerCount: res.data?.data?.unique_providers || 0,
        staffCount: res.data?.data?.unique_staff || 0,
      });
    } catch (err) {
      console.error("❌ Provider & Staff API Error:", err);
      set({ providerCount: 0, staffCount: 0 });
    }
  },

  /* 🔹 FETCH TOTAL PRICE ENTRIES */
  fetchTotalPriceEntries: async ({ product_id, from, to }) => {
    try {
      const res = await axiosInstanceBenchmarking.get("/master/bench/price-count", { params: { product_id, from, to } });
      set({ totalPriceEntries: res.data?.data || 0 });
    } catch (err) {
      console.error("❌ Total Price Entries API Error:", err);
      set({ totalPriceEntries: 0 });
    }
  },

  /* ================= FILTERS ================= */
  applyFilters: () => {
    const { allStockData, searchTerm, searchField, selectedMonth, selectedYear } = get();
    let filtered = [...allStockData];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((item) =>
        (item[searchField] || "").toLowerCase().includes(term)
      );
    }

    if (selectedMonth && selectedYear) {
      filtered = filtered.filter((item) => {
        const d = new Date(item.date);
        return d.getMonth() + 1 === Number(selectedMonth) && d.getFullYear() === Number(selectedYear);
      });
    }

    set({ groupedData: groupByProduct(filtered) });
  },

  /* ================= SETTERS ================= */
  setSearchTerm: (value) => {
    set({ searchTerm: value });
    get().applyFilters();
  },

  setSearchField: (field) => {
    set({ searchField: field });
    get().applyFilters();
  },

  setMonthYear: async (month, year) => {
    set({ selectedMonth: month, selectedYear: year });
    if (month && year) {
      const from = `${year}-${month.padStart(2, "0")}-01`;
      const to = new Date(year, Number(month), 0).toISOString().split("T")[0];
      await get().fetchMonthRange(from, to);
    } else {
      get().applyFilters();
    }
  },

  clearFilters: () => {
    set({
      searchTerm: "",
      searchField: "product",
      selectedMonth: "",
      selectedYear: new Date().getFullYear().toString(),
      groupedData: groupByProduct(get().allStockData),
    });
  },
}));
