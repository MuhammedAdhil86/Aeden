"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

export default function VariationChart({ data }) {
  const avg =
    data.reduce((sum, item) => sum + item.avgPrice, 0) / data.length || 0;

  return (
    <div className="w-full max-w-[1000px] mx-auto rounded-2xl border p-6 bg-white shadow-md">
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} barCategoryGap={28}>
          <XAxis dataKey="month" tick={{ fontSize: 13 }} />
          <YAxis tickFormatter={(value) => `${value / 1000}K`} tick={{ fontSize: 12 }} />

          <Tooltip
            formatter={(value) => `₹${value.toLocaleString()}`}
            labelFormatter={(label) => `Month: ${label}`}
          />

          <ReferenceLine
            y={avg}
            stroke="#6B7280"
            strokeDasharray="6 6"
            label={{ position: "insideTopLeft", value: "Avg", fill: "#6B7280" }}
          />

          {/* Purple Base (Average section) */}
          <Bar dataKey="avgPrice" fill="#A78BFA" radius={[8, 8, 0, 0]} />

          {/* Black Top part (Difference from Avg to Max) */}
          <Bar
            dataKey={(d) => d.maxPrice - d.avgPrice}
            stackId="a"
            fill="#1A1A1A"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}




"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { fetchMonthRangeDetails } from "@/service/benchMarking";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { format } from "date-fns";

function BenchMarkingDetails() {
  const searchParams = useSearchParams();
  const product = searchParams.get("product");
  const category = searchParams.get("category");
  const month = searchParams.get("month");
  const year = searchParams.get("year");
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  if (!product || !category || !month || !year) {
    console.error("Missing query params:", { product, category, month, year });
    return;
  }

  const fetchDetails = async () => {
    try {
      const data = await fetchMonthRangeDetails(product, category, month, year);
      setDetails(data);
    } catch (err) {
      console.error("Error fetching details:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchDetails();
}, [product, category, month, year]);



  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">{product} Details</h1>

      {loading ? (
        <p>Loading...</p>
      ) : details.length === 0 ? (
        <p>No data found.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <Table className="min-w-full text-sm">
              <TableHeader className="bg-gray-50 text-black">
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Origin</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Lowest Price</TableHead>
                  <TableHead>Highest Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {details.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell>{format(new Date(item.date), "dd/MM/yyyy")}</TableCell>
                    <TableCell>{item.product}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.origin}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>₹{item.lowest_price}</TableCell>
                    <TableCell>₹{item.highest_price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Placeholder for graph */}
          <div className="mt-8 bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Price Trends Graph</h2>
            {/* Later: Add a chart (e.g. Recharts) to visualize price changes */}
          </div>
        </>
      )}
    </div>
  );
}

export default BenchMarkingDetails;