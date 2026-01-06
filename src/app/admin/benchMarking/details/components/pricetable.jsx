"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

export default function PriceTable({ data, loading }) {
  return (
    <div className="mt-10">
      <h2 className="text-lg font-bold text-gray-800 mb-4 px-2">Product Prices</h2>

      <div className="bg-white rounded-[32px] shadow-sm border border-gray-50 overflow-hidden">
        <Table>
          <TableHeader className="bg-[#FCFCFC]">
            <TableRow>
              <TableHead className="pl-8">Date</TableHead>
              <TableHead>Staff Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Demand</TableHead>
              <TableHead>Remarks</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Loading...
                </TableCell>
              </TableRow>
            ) : data.length ? (
              data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{format(new Date(item.date), "dd/MM/yyyy")}</TableCell>
                  <TableCell>{item.staff || "-"}</TableCell>
                  <TableCell>{item.region || "-"}</TableCell>
                  <TableCell>₹{item.price || "-"}</TableCell>
                  <TableCell
                    className={`font-medium ${
                      item.demand?.toUpperCase() === "HIGH"
                        ? "text-green-500"
                        : "text-yellow-500"
                    }`}
                  >
                    {item.demand || "-"}
                  </TableCell>
                  <TableCell className="text-xs text-gray-400 italic">{item.remarks || "-"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                  No data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
