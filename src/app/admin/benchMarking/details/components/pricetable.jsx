import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

export default function PriceTable({ data }) {
  return (
    <div className="mt-10">
      {/* TITLE — OUTSIDE WHITE CARD */}
      <h2 className="text-lg font-bold text-gray-800 mb-4 px-2">
        Product Prices
      </h2>

      {/* TABLE CARD */}
      <div className="bg-white rounded-[32px] shadow-sm border border-gray-50 overflow-hidden">
        <Table>
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
  {data.map((item) => (
    <TableRow key={item.id}>
      <TableCell>{format(new Date(item.date), "dd/MM/yyyy")}</TableCell>
      <TableCell>{item.staff}</TableCell>
      <TableCell>{item.location}</TableCell>
      <TableCell>₹{item.price}</TableCell>
      <TableCell>
        <span
          className={`font-medium ${
            item.demand?.toUpperCase() === "HIGH"
              ? "text-green-500"
              : "text-yellow-500"
          }`}
        >
          {item.demand}
        </span>
      </TableCell>
      <TableCell className="text-xs text-gray-400 italic">{item.remarks}</TableCell>
    </TableRow>
  ))}
</TableBody>

        </Table>
      </div>
    </div>
  );
}
