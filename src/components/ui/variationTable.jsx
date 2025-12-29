export function VariationTable({ data }) {
  return (
    <div className="bg-white border shadow rounded-lg p-4 mt-6">
      <h3 className="text-lg font-semibold mb-3">Price Breakdown by Region</h3>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Region</th>
            <th className="p-2 border">Min Price</th>
            <th className="p-2 border">Avg Price</th>
            <th className="p-2 border">Max Price</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr key={row.region} className="hover:bg-gray-50">
              <td className="p-2 border">{row.region}</td>
              <td className="p-2 border">{row.minPrice}</td>
              <td className="p-2 border">{row.avgPrice.toFixed(2)}</td>
              <td className="p-2 border">{row.maxPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
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