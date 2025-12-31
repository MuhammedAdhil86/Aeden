import { create } from "zustand";
import axios from "axios";

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
  monthRange: [],
  monthRangeDetails: [],

  tableData: [],        // ✅ For BenchMarkDetail table
  monthlyData: [],      // ✅ For charts
  loading: false,
  error: null,

  searchTerm: "",
  searchField: "product",
  selectedMonth: "",
  selectedYear: new Date().getFullYear().toString(),

  /* ================= ACTIONS ================= */

  /* 🔹 FETCH ALL BENCHMARKS */
  fetchBenchmarks: async () => {
    set({ loading: true, error: null });
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(
        "https://aeden-fleet-t579q.ondigitalocean.app/master/bench/fetchAll",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const raw = res.data?.data || [];

      const processed = raw.map((item, index) => {
        const price = Number(item.price || 0);
        return {
          id: item.id || index,
          date: item.date || "-",
          product: item.product?.product_name || "-",
          category: item.category?.category_name || "-",
          brand: item.brand?.brand_name || "-",
          origin: item.origin?.country_name || "-",
          region: item.region || item.location?.state || "-",
          unit: item.unit || "-",
          lowerPrice: Number((price * 0.9).toFixed(2)),
          higherPrice: Number((price * 1.1).toFixed(2)),
          averagePrice: Number(price.toFixed(2)),
          demand: item.demand || "-",
          originalData: item,
        };
      });

      set({
        allStockData: processed,
        groupedData: groupByProduct(processed),
        loading: false,
      });
    } catch (err) {
      console.error("❌ Fetch Benchmarks Error:", err);
      set({ error: "Failed to load data", loading: false });
    }
  },



  /* 🔹 FETCH MONTH RANGE DETAILS */
  fetchMonthRangeDetails: async ({ product, category, month, year }) => {
    set({ loading: true, error: null });
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(
        "https://aeden-fleet-t579q.ondigitalocean.app/master/bench/monthRange-details",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { product, category, month, year },
        }
      );

      const raw = res.data?.data || [];

      // Normalize for table
      const tableData = raw.map((item) => ({
        id: item.id,
        date: item.date,
        staff: item.uploaded_by || "-",
        location: item.region || item.location?.state || item.location?.city || "-",
        price: Number(item.price || 0),
        demand: item.demand || "-",
        remarks: item.remarks || "-",
      }));

      // Chart / Monthly data
      const monthlyData = raw.map((item) => ({
        date: item.date,
        price: Number(item.price || 0),
      }));

      set({
        tableData,
        monthlyData,
        monthRangeDetails: tableData, // optional if you need for other usage
        loading: false,
      });
    } catch (err) {
      console.error("❌ Month Details Error:", err);
      set({ error: "Failed to fetch details", loading: false });
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
        return (
          d.getMonth() + 1 === Number(selectedMonth) &&
          d.getFullYear() === Number(selectedYear)
        );
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

  setMonthYear: (month, year) => {
    set({ selectedMonth: month, selectedYear: year });
    get().applyFilters();
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
