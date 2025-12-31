"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import { useBenchmarkStore } from "../../../../../components/store/useBenchmarkStore";

import TopBar from "./topbar";
import StatsRow from "./statsrow";
import ChartSection from "./chartsecsion";
import PriceTable from "./pricetable";

export default function BenchMarkDetail() {
  const searchParams = useSearchParams();

  const product = searchParams.get("product");
  const category = searchParams.get("category");
  const month = searchParams.get("month");
  const year = searchParams.get("year");

  const {
    monthRangeDetails = [],
    monthlyData = [],
    fetchMonthRangeDetails,
  } = useBenchmarkStore();

  const [search, setSearch] = useState("");

  /* ---------------- FETCH DETAILS ---------------- */
  useEffect(() => {
    if (!product || !category || !month || !year) return;

    fetchMonthRangeDetails({ product, category, month, year });
  }, [product, category, month, year, fetchMonthRangeDetails]);

  /* ---------------- SEARCH FILTER ---------------- */
  const filteredTable = useMemo(() => {
    return monthRangeDetails.filter(
      (row) =>
        row.staff?.toLowerCase().includes(search.toLowerCase()) ||
        row.location?.toLowerCase().includes(search.toLowerCase())
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
    return new Set(filteredTable.map((i) => i.location).filter(Boolean)).size;
  }, [filteredTable]);

  /* ---------------- SUMMARY DATA ---------------- */
  const summary = useMemo(() => {
    const staffSet = new Set();
    const providerSet = new Set();
    const demandMap = {};

    filteredTable.forEach((item) => {
      // Normalize staff & provider names to avoid duplicates
      if (item.staff) staffSet.add(item.staff.trim().toLowerCase());

      if (item.provider) {
        const normalizedProvider = item.provider.trim().toLowerCase();
        if (normalizedProvider) providerSet.add(normalizedProvider);
      }

      if (item.demand) {
        const d = item.demand.toLowerCase();
        demandMap[d] = (demandMap[d] || 0) + 1;
      }
    });

    const marketDemand =
      Object.entries(demandMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

    return {
      totalStaffs: staffSet.size,
      totalProviders: providerSet.size, // fixed provider count
      marketDemand,
      totalPrices: filteredTable.length,
    };
  }, [filteredTable]);

  /* ---------------- TRANSFORM DATA FOR CHART ---------------- */
  const chartData = useMemo(() => {
    if (!Array.isArray(monthlyData)) return [];

    const dataByMonth = monthlyData.reduce((acc, item) => {
      const monthName = new Date(item.date).toLocaleString("default", {
        month: "short",
      });
      const price = Number(item.price || 0);

      const existing = acc.find((d) => d.month === monthName);
      if (existing) existing.totalPrice += price;
      else acc.push({ month: monthName, totalPrice: price });

      return acc;
    }, []);

    // Sort by calendar order
    const monthOrder = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    dataByMonth.sort(
      (a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
    );

    return dataByMonth;
  }, [monthlyData]);

  return (
    <div className="bg-[#F6F6F6] min-h-screen pb-5 px-5">
      <Header />

      <div className="py-6">
        <TopBar
          category={category}
          product={product}
          search={search}
          setSearch={setSearch}
        />

        <StatsRow
          stats={priceStats}
          totalCount={totalCount}
          locationCount={locationCount}
        />

        <ChartSection monthlyData={chartData} summary={summary} />

        <PriceTable data={filteredTable} />
      </div>
    </div>
  );
}
