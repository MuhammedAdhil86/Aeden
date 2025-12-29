"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { fetchAllocationStaffs } from "@/service/sales";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

export default function StaffsPage() {
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAction, setOpenAction] = useState(null);

  const loadStaffs = async () => {
    try {
      setLoading(true);

      const res = await fetchAllocationStaffs();

      const list = Array.isArray(res?.data) ? res.data : [];
      console.log(list);

      // Format table rows
      const formatted = list.map((item, index) => ({
        id: item.id,
        // name: item.staff_name,
        name: item.staff_id,
        contact: item.sales_id?.contact_number || "-",
        designation: "Sales Executive", // static as UI uses
        joinedOn: item.allocated_at?.split(" ")[0] || "-",
        clientsAllocated: Math.floor(Math.random() * 10),
        ordersTaken: Math.floor(Math.random() * 70),
        status: index % 2 === 0 ? "Active" : "Inactive",
      }));

      setStaffs(formatted);
    } catch (err) {
      console.error(err);
      setStaffs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaffs();
  }, []);

  /** ======================
   *  COLUMNS FOR TABLE
   *  ====================== */
  const columns = useMemo(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        cell: ({ row }) => row.original.name || "-",
      },
      {
        header: "Contact Number",
        accessorKey: "contact",
        cell: ({ row }) => row.original.contact || "-",
      },
      {
        header: "Designation",
        accessorKey: "designation",
        cell: ({ row }) => row.original.designation || "-",
      },
      {
        header: "Joined On",
        accessorKey: "joinedOn",
        cell: ({ row }) => row.original.joinedOn || "-",
      },
      {
        header: "Clients Allocated",
        accessorKey: "clientsAllocated",
        cell: ({ row }) => row.original.clientsAllocated,
      },
      {
        header: "Orders Taken",
        accessorKey: "ordersTaken",
        cell: ({ row }) => row.original.ordersTaken,
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => {
          const value = row.original.status;
          return (
            <span
              className={`px-3 py-1 rounded-md text-xs ${
                value === "Active"
                  ? "bg-gray-100 text-green-700 border border-green-300 font-semibold"
                  : "bg-gray-100 text-yellow-600 border border-yellow-400 font-semibold"
              }`}
            >
              {value}
            </span>
          );
        },
      },
      {
        header: "Action",
        accessorKey: "action",
        cell: ({ row }) => {
          const item = row.original;

          return (
            <button
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setOpenAction({
                  id: item.id,
                  data: item,
                  top: rect.top + 25,
                  left: rect.left - 180,
                });
              }}
              className="px-2 py-1 rounded hover:bg-gray-100"
            >
              ⋮
            </button>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: staffs,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  /** ======================
   *  UI MARKUP
   *  ====================== */
  return (
    <div className="p-6">
      <h1 className="text-md text-black font-semibold mb-5">Manage Sale Staffs</h1>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="w-full overflow-x-auto">
          <Table className="w-full text-xs table-auto">
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id} className="border-b border-gray-200">
                  {hg.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="bg-gray-50 px-4 py-3 text-left font-semibold text-black uppercase text-xs tracking-wider whitespace-nowrap"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center py-10"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-4 py-3 text-gray-700">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center py-12"
                  >
                    No Staffs Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
