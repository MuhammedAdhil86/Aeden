"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import TopBar from "./topbar";
import StatsRow from "./statsrow";
import ChartSection from "./chartsecsion";
import PriceTable from "./pricetable";
import { useBenchmarkStore } from "@/components/store/useBenchmarkStore";

export default function BenchMarkDetail() {
  const searchParams = useSearchParams();
  const product_id = searchParams.get("product_id");
  const category_id = searchParams.get("category_id");
  const product_name = searchParams.get("product") || "-";
  const category_name = searchParams.get("category") || "-";

  // ✅ Store: dominant demand, provider/staff counts, total price entries, month range details, actions
  const {
    dominantDemand,
    providerCount,
    staffCount,
    totalPriceEntries,
    monthRangeDetails,
    monthlyData,
    loading,
    fetchMonthRangeDetails,
    fetchDominantDemand,
    fetchProviderAndStaffCount,
    fetchTotalPriceEntries,
  } = useBenchmarkStore();

  const [search, setSearch] = useState("");

  // Default last month range
  const today = new Date();
  const lastMonth = new Date(today);
  lastMonth.setMonth(today.getMonth() - 1);

  const [fromDate, setFromDate] = useState(lastMonth);
  const [toDate, setToDate] = useState(today);

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    if (!product_id || !category_id) return;

    const from = fromDate.toISOString().split("T")[0];
    const to = toDate.toISOString().split("T")[0];

    // Existing APIs
    fetchMonthRangeDetails({ product_id, category_id, from, to });
    fetchDominantDemand({ product_id, from, to });

    // ✅ New APIs
    fetchProviderAndStaffCount({ product_id, from, to });
    fetchTotalPriceEntries({ product_id, from, to });
  }, [
    product_id,
    category_id,
    fromDate,
    toDate,
    fetchMonthRangeDetails,
    fetchDominantDemand,
    fetchProviderAndStaffCount,
    fetchTotalPriceEntries,
  ]);

  /* ---------------- SEARCH FILTER ---------------- */
  const filteredTable = useMemo(() => {
    if (!Array.isArray(monthRangeDetails)) return [];
    return monthRangeDetails.filter(
      (row) =>
        row.staff?.toLowerCase().includes(search.toLowerCase()) ||
        row.region?.toLowerCase().includes(search.toLowerCase())
    );
  }, [monthRangeDetails, search]);

  /* ---------------- PRICE STATS ---------------- */
  const priceStats = useMemo(() => {
    if (!filteredTable.length)
      return { lowest: "0.00", highest: "0.00", average: "0.00" };
    const prices = filteredTable.map((i) => Number(i.price || 0));
    return {
      lowest: Math.min(...prices).toFixed(2),
      highest: Math.max(...prices).toFixed(2),
      average: (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2),
    };
  }, [filteredTable]);

  /* ---------------- COUNTS ---------------- */
  const totalCount = filteredTable.length;

  const locationCount = useMemo(() => {
    return new Set(filteredTable.map((i) => i.region).filter(Boolean)).size;
  }, [filteredTable]);

  /* ---------------- SUMMARY ---------------- */
  const summary = useMemo(() => {
    return {
      totalStaffs: staffCount ?? 0,             // ✅ from new API
      totalProviders: providerCount ?? 0,       // ✅ from new API
      marketDemand: dominantDemand || "-",      // ✅ from existing API
      totalPrices: totalPriceEntries ?? totalCount, // ✅ from new API (fallback to filteredTable length)
    };
  }, [filteredTable, dominantDemand, staffCount, providerCount, totalPriceEntries]);

  /* ---------------- CHART DATA ---------------- */
  const chartData = useMemo(() => {
    if (!Array.isArray(monthlyData)) return [];
    const map = {};
    monthlyData.forEach((item) => {
      const day = new Date(item.date).getDate();
      map[day] = (map[day] || 0) + Number(item.price || 0);
    });
    return Object.entries(map)
      .map(([day, totalPrice]) => ({ month: day.toString(), totalPrice }))
      .sort((a, b) => Number(a.month) - Number(b.month));
  }, [monthlyData]);

  return (
    <div className="bg-[#F6F6F6] min-h-screen pb-5 px-5">
      <Header />

      <div className="py-6">
        {/* ---------- TOPBAR ---------- */}
        <TopBar
          search={search}
          setSearch={setSearch}
          fromDate={fromDate}
          toDate={toDate}
          setFromDate={setFromDate}
          setToDate={setToDate}
          product={product_name}
          category={category_name}
        />

        {/* ---------- STATS ROW ---------- */}
        <StatsRow
          stats={priceStats}
          totalCount={totalCount}
          locationCount={locationCount}
          loading={loading}
        />

        {/* ---------- CHART SECTION ---------- */}
        <ChartSection monthlyData={chartData} summary={summary} />

        {/* ---------- PRICE TABLE ---------- */}
        <PriceTable data={filteredTable} loading={loading} />
      </div>
    </div>
  );
}
