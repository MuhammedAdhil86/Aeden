"use client";
import React, { useEffect, useMemo, useState, useRef } from "react";
import Header from "@/components/Header";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

import { fetchAllClients, fetchAllAllocation } from "@/service/sales";

import MonthSelector from "@/components/ui/monthSelector";
import CreateClientModal from "../clients/createClientModal/page";
import AllocateClientModal from "./AllocateClientModal/page";
import ActionMenuPortal from "@/components/ui/ActionMenuPortal";
import AllocateStaffModal from "./AllocateStaffModal/page";

export default function AllocationPage() {
  const [allocationData, setAllocationData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedClient, setSelectedClient] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAllocateOpen, setIsAllocateOpen] = useState(false);

  const [openAction, setOpenAction] = useState(null);

  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // For the top filter dropdown
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // For search field selection
  const [searchField, setSearchField] = useState("product");

  // For search input
  const [stockSearchTerm, setStockSearchTerm] = useState("");

  // Month selector handlers
  const handleMonthChange = (month) => setSelectedMonth(month);
  const handleYearChange = (year) => setSelectedYear(year);

  // Changing which search field is active
  const handleSearchFieldChange = (field) => {
    setSearchField(field);
    setOpen(false);
  };

  // Get display version of search field
  const getSearchFieldDisplayName = () => {
    if (searchField === "product") return "Product";
    if (searchField === "category") return "Category";
    if (searchField === "origin") return "Origin";
    return "Search";
  };

  // Handle search input change
  const onSearchInputChange = (e) => {
    setStockSearchTerm(e.target.value);
  };

  // Handle clicking a row (optional, since you have onClick)
  const handleRowClick = (rowData) => {
    console.log("Row clicked:", rowData);
  };

  // TABLE COLUMNS
  const columns = useMemo(
    () => [
      {
        header: "Customer",
        accessorKey: "sales_id.client_name",
        cell: ({ row }) => row.original.sales_id?.client_name || "-",
      },
      {
        header: "Address",
        accessorKey: "sales_id.address",
        cell: ({ row }) => row.original.sales_id?.address || "-",
      },
      {
        header: "Point of contact",
        accessorKey: "sales_id.poc_name",
        cell: ({ row }) => row.original.sales_id?.poc_name || "-",
      },
      {
        header: "Contact Number",
        accessorKey: "sales_id.contact_number",
        cell: ({ row }) => row.original.sales_id?.contact_number || "-",
      },

      {
        header: "Created on",
        accessorKey: "allocated_at",
        cell: ({ row }) =>
          row.original.allocated_at
            ? new Date(row.original.allocated_at).toLocaleString()
            : "-",
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) =>
          row.original.status
            ? new Date(row.original.status).toLocaleString()
            : "-",
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
    data: allocationData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const loadAllocations = async () => {
    setLoading(true);
    try {
      const clientsRes = await fetchAllClients();
      const allocRes = await fetchAllAllocation();

      const clients = Array.isArray(clientsRes?.data) ? clientsRes.data : [];
      const allocations = Array.isArray(allocRes?.data) ? allocRes.data : [];

      const merged = clients.map((client) => {
        const alloc = allocations.find(
          (a) => a.sales_id?.id === client.id || a.sales_id === client.id
        );

        return {
          sales_id: client,
          allocation_id: alloc?.id || null,
          staff_name: alloc?.staff_name || null,
          allocated_at: alloc?.allocated_at || null,
        };
      });

      setAllocationData(merged);
    } catch (err) {
      toast.error("Failed to fetch allocation data");
      setAllocationData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllocations();
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f6f8] overflow-visible relative">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-semibold text-gray-900">
            Orders Received
          </h1>

          <div className="flex items-center gap-6 text-black">
            <MonthSelector
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onMonthChange={handleMonthChange}
              onYearChange={handleYearChange}
              className="text-sm text-black"
            />
            <div className="flex items-center gap-3">
              {/* <button
                          onClick={() => setIsAddModalOpen(true)}
                          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition flex items-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </button> */}
              <button
                onClick={() => {
                  setSelectedClient(null);
                  setIsCreateOpen(true);
                }}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition flex items-center gap-2 h-[38px]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>

              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setOpen(!open)}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 text-xs font-medium text-gray-500 border-b">
                      Filter By
                    </div>
                    <div className="p-2">
                      {["product", "category", "origin"].map((field) => (
                        <button
                          key={field}
                          onClick={() => handleSearchFieldChange(field)}
                          className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 rounded-lg transition-colors mt-1 ${
                            searchField === field
                              ? "bg-black text-white"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Download Button */}
              <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </button>

              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder={`Search by ${getSearchFieldDisplayName().toLowerCase()}...`}
                  value={stockSearchTerm}
                  onChange={onSearchInputChange}
                  className="pl-4 pr-10 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent w-64 text-sm text-gray-800"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="w-full rounded-lg border border-gray-200 shadow-sm bg-white -mt-1">
            <div className="w-full overflow-x-auto overflow-y-hidden">
              <Table className="w-screen text-xs table-auto ">
                <TableHeader>
                  {table.getHeaderGroups().map((hg) => (
                    <TableRow key={hg.id} className="border-b border-gray-200">
                      {hg.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className="bg-gray-50 px-4 py-3 text-left font-semibold text-gray-700 uppercase text-xs tracking-wider whitespace-nowrap"
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
                      ></TableCell>
                    </TableRow>
                  ) : table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        onClick={() => handleRowClick(row.original)}
                        className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className="px-4 py-3 text-gray-500 text-xs"
                          >
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
                        {/* no data */}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      {/* ⭐ FLOATING MODAL ACTION MENU */}
      {openAction && (
        <ActionMenuPortal
          position={{ top: openAction.top, left: openAction.left }}
          onClose={() => setOpenAction(null)}
        >
          <div className="w-56">
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 border-b">
              Action
            </div>

            <button
              className="w-full px-4 py-2 text-left hover:bg-black hover:text-white rounded-md flex items-center gap-2 text-black text-sm"
              onClick={() => {
                setSelectedClient(openAction.data);
                setIsAllocateOpen(true);
                setOpenAction(null);
              }}
            >
              Allocate staff
            </button>

            <button
              className="w-full px-4 py-2 text-left hover:bg-gray-100 rounded-md flex items-center gap-2 text-black text-sm"
              onClick={() => {
                setSelectedClient(openAction.data.sales_id);
                setIsCreateOpen(true);
                setOpenAction(null);
              }}
            >
              Edit Client details
            </button>

            <button
              className="w-full px-4 py-2 text-left hover:bg-gray-100 rounded-md flex items-center gap-2 text-black text-sm"
              onClick={() => {
                alert(`Client: ${openAction.data.sales_id.client_name}`);
                setOpenAction(null);
              }}
            >
              View Client
            </button>
          </div>
        </ActionMenuPortal>
      )}

      {/* MODALS */}
      {isCreateOpen && (
        <CreateClientModal
          existingClient={selectedClient}
          onClose={() => setIsCreateOpen(false)}
          onSubmit={() => {
            loadAllocations();
            setIsCreateOpen(false);
          }}
        />
      )}

      {isAllocateOpen && selectedClient && (
        <AllocateStaffModal
          client={selectedClient}
          onClose={() => {
            setIsAllocateOpen(false);
            setSelectedClient(null);
          }}
          onSuccess={() => {
            loadAllocations();
            setIsAllocateOpen(false);
            setSelectedClient(null);
          }}
        />
      )}

      <ToastContainer position="top-right" autoClose={1500} />
    </div>
  );
}
