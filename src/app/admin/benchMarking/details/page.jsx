"use client";

import React, { useState, useEffect, Suspense } from "react";
import Header from "@/components/Header";
import BenchmarkPriceChart from "@/components/ui/monthlyRevenueChart";
import { fetchMonthRangeDetails } from "../../../../service/addBenchmark";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import {
  Calendar,
  Plus,
  Filter,
  Download,
  Search,
  LayoutGrid,
  Clock,
  TrendingUp,
  MoreHorizontal,
} from "lucide-react";

/* ---------------- PAGE WRAPPER ---------------- */
export default function BenchMarkDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center text-gray-500">
          Loading Dashboard...
        </div>
      }
    >
      <BenchMarkDetail />
    </Suspense>
  );
}

/* ---------------- MAIN COMPONENT ---------------- */
function BenchMarkDetail() {
  const [monthlyData, setMonthlyData] = useState([]);
  const [tableDetails, setTableDetails] = useState([]);
  const [stockSearchTerm, setStockSearchTerm] = useState("");
  const [activeSubModal, setActiveSubModal] = useState(null);

  const [summary] = useState({
    totalCount: 550,
    locations: 14,
    lowestPrice: "250.00",
    highestPrice: "290.00",
    averagePrice: "275.00",
  });

  const searchParams = useSearchParams();
  const product = searchParams.get("product") || "Pink Lady";
  const category = searchParams.get("category") || "Apple";

  /* ---------------- SAFE HELPERS ---------------- */
  const safe = (v) => (v && v !== "" ? v : "-");

  const safeDate = (v) => {
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
  };

  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const response = await fetchMonthRangeDetails(product, category);
        if (!response || !response.length) return;

        const table = response.map((item, idx) => ({
          id: idx,
          date: item.date || item.uploaded_at,
          staff: safe(item.uploaded_by),
          location: safe(item.region),
          price: Number(item.price || 0).toLocaleString("en-IN"),
          demand: safe(item.demand),
          remarks: safe(item.remarks),
        }));

        setTableDetails(table);

        const grouped = {};
        response.forEach((item) => {
          const d = safeDate(item.date);
          if (!d) return;

          const month = d.toLocaleString("en-US", { month: "short" });
          if (!grouped[month]) grouped[month] = { month, totalPrice: 0 };
          const price = Number(item.price);
          grouped[month].totalPrice += isNaN(price) ? 0 : price;
        });

        setMonthlyData(Object.values(grouped));
      } catch (err) {
        console.error(err);
      }
    };

    fetchAll();
  }, [product, category]);

  /* ---------------- FILTER ---------------- */
  const filteredTable = tableDetails.filter(
    (row) =>
      row.staff.toLowerCase().includes(stockSearchTerm.toLowerCase()) ||
      row.location.toLowerCase().includes(stockSearchTerm.toLowerCase())
  );

  /* ---------------- UI ---------------- */
  return (
    <div className="bg-[#F6F6F6] min-h-screen pb-10">
      <Header />

      <div className="px-10 py-6">
        {/* TOP BAR */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-gray-800 text-[16px]">
            {category} - {product}
          </h1>

          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white border border-gray-100 rounded-xl px-4 py-2.5 shadow-sm text-sm text-gray-500 gap-3">
              <span>15/10/2025</span>
              <Calendar size={16} />
              <span className="text-gray-300">—</span>
              <span>16/10/2025</span>
              <Calendar size={16} />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setActiveSubModal("add_price")}
                className="p-2.5 bg-[#121212] text-white rounded-xl shadow-md"
              >
                <Plus size={20} />
              </button>
              <button className="p-2.5 bg-[#1A1C1E] text-white rounded-xl shadow-md">
                <Filter size={20} />
              </button>
              <button className="p-2.5 bg-[#1A1C1E] text-white rounded-xl shadow-md">
                <Download size={20} />
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search Product"
                className="pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl w-64 shadow-sm focus:outline-none"
                value={stockSearchTerm}
                onChange={(e) => setStockSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* STAT ROW — FIX HERE */}
        <div
          suppressHydrationWarning
          className="grid grid-cols-5 gap-5 mb-8"
        >
          <MainStatCard
            icon={<LayoutGrid size={22} />}
            value={summary.totalCount}
            label="Total Price Added"
            trend="+2.3%"
          />
          <MainStatCard
            icon={<TrendingUp size={22} />}
            value={summary.locations}
            label="Locations"
            trend="23%"
            trendDown
          />
          <MainStatCard
            icon={<Clock size={22} />}
            value={summary.lowestPrice}
            label="Lowest Price"
          />
          <MainStatCard
            icon={<LayoutGrid size={22} />}
            value={summary.highestPrice}
            label="Highest Price"
          />
          <MainStatCard
            icon={<TrendingUp size={22} />}
            value={summary.averagePrice}
            label="Average Price"
          />
        </div>

        {/* CHART + SUMMARY */}
        <div className="grid grid-cols-12 gap-6 mb-8">
          <div className="col-span-7 bg-white p-8 rounded-[32px] shadow-sm border border-gray-50">
            <span className="text-xs text-gray-400 italic tracking-widest">
              AVG . . . . . . . .
            </span>
            <BenchmarkPriceChart priceData={monthlyData} />
          </div>

          <div className="col-span-5 grid grid-cols-2 gap-5">
            <SummaryCard label="Total Staffs" value="25" />
            <SummaryCard label="Total Providers" value="08" />
            <SummaryCard label="Market Demand" value="Medium" isText />
            <SummaryCard label="Total Prices" value="135" />
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-50 overflow-hidden">
          <div className="p-8 pb-0">
            <h2 className="text-lg font-bold text-gray-800">
              Product Prices
            </h2>
          </div>

          <Table className="mt-4">
            <TableHeader className="bg-[#FCFCFC]">
              <TableRow>
                <TableHead className="pl-8">Date</TableHead>
                <TableHead>Staff Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Demand</TableHead>
                <TableHead className="pr-8">Remarks</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredTable.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="pl-8">
                    {item.date
                      ? format(new Date(item.date), "dd/MM/yyyy")
                      : "-"}
                  </TableCell>
                  <TableCell>{item.staff}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell className="font-bold">₹{item.price}</TableCell>
                  <TableCell>
                    <span
                      className={`font-medium ${
                        item.demand.toUpperCase() === "HIGH"
                          ? "text-green-500"
                          : "text-yellow-500"
                      }`}
                    >
                      {item.demand}
                    </span>
                  </TableCell>
                  <TableCell className="pr-8 text-xs text-gray-400 italic">
                    {item.remarks}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

/* ---------------- UI COMPONENTS ---------------- */
function MainStatCard({ icon, value, label, trend, trendDown }) {
  return (
    <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-50 flex gap-5">
      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
        {icon}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold">{value}</span>
          {trend && (
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                trendDown
                  ? "bg-pink-50 text-pink-500"
                  : "bg-green-50 text-green-500"
              }`}
            >
              {trendDown ? "↘" : "↗"} {trend}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400 uppercase">{label}</p>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, isText }) {
  return (
    <div className="bg-white p-6 rounded-[28px] shadow-sm border border-gray-50 relative">
      <MoreHorizontal
        size={18}
        className="absolute top-5 right-5 text-gray-300"
      />
      <p className="text-xs text-gray-400 uppercase">{label}</p>
      <p className={`font-bold ${isText ? "text-2xl" : "text-4xl"}`}>
        {value}
      </p>
      <p className="text-[10px] text-gray-300 italic">
        based on last month
      </p>
    </div>
  );
}
