"use client";

import Header from "@/components/Header";
import React from "react";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { getPurchase, fetchProcurementSearch } from "@/service/procurements";
import * as XLSX from "xlsx"; // Add this import
import { toast, ToastContainer } from "react-toastify";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
// import { toast } from "@/components/hooks/use-toast"
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { debounce } from "lodash";

const columns = [
  {
    accessorKey: "uin",
    header: "UIN",
  },
  {
    accessorKey: "party_name",
    header: "Party Name",
  },
  {
    accessorKey: "items",
    header: "Product",
    cell: ({ row }) => {
      const items = row.original.items || [];
      return items.length > 0
        ? items.map((item) => item.product_name).join(", ") || "—"
        : "—";
    },
  },
  {
    accessorKey: "items",
    header: "Variety",
    cell: ({ row }) => {
      const items = row.original.items || [];
      return items.length > 0
        ? items.map((item) => item.variety_name).join(", ") || "—"
        : "—";
    },
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <span
          className={`${
            status === "Pending"
              ? "bg-yellow-100 text-yellow-800"
              : status === "Approved"
              ? "bg-green-100 text-green-800"
              : status === "Rejected"
              ? "bg-red-100 text-red-800"
              : "bg-gray-100 text-gray-800"
          } px-2 py-1 rounded-full text-xs`}
        >
          {status}
        </span>
      );
    },
  },
];

function Procurement() {
  const [purchaseData, setPurchaseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date());
  const [isDownloading, setIsDownloading] = useState(false);
  const router = useRouter();

  const FormSchema = z.object({
    dob: z.date(),
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: { dob: null },
  });

  function onSubmit(data) {
    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // })
  }

  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 9 });
  const [searchQuery, setSearchQuery] = useState("");

  const table = useReactTable({
    data: purchaseData,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPurchase();
        console.log("Purchase data fetched:", res.data);
        setPurchaseData(res.data || []);
      } catch (err) {
        console.error("Error fetching purchase data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Debounced search handler
  const handleSearch = useMemo(
    () =>
      debounce(async (query) => {
        if (!query.trim()) {
          // If query is empty, fetch all data
          try {
            const res = await getPurchase();
            setPurchaseData(res.data || []);
          } catch (err) {
            console.error("Error fetching all purchase data:", err);
          }
          return;
        }

        try {
          const res = await fetchProcurementSearch(query);
          console.log("Search results:", res);
          setPurchaseData(res || []);
        } catch (err) {
          console.error("Error searching procurement data:", err);
          setPurchaseData([]);
        }
      }, 300),
    []
  );

  // Update search results when query changes
  useEffect(() => {
    handleSearch(searchQuery);
    // Cleanup debounce on unmount
    return () => handleSearch.cancel();
  }, [searchQuery, handleSearch]);

  const downloadExcel = async () => {
    if (!purchaseData || purchaseData.length === 0) {
      toast.error("No data available to download");
      return;
    }

    setIsDownloading(true);

    try {
      // Transform the data to a flat structure for Excel
      const excelData = purchaseData.map((order, index) => {
        // Get the first item's details (or concatenate all items)
        const firstItem =
          order.items && order.items.length > 0 ? order.items[0] : {};

        // Concatenate all product names and varieties
        const allProductNames = order.items
          ? order.items.map((item) => item.product_name).join(", ")
          : "";
        const allVarietyNames = order.items
          ? order.items.map((item) => item.variety_name).join(", ")
          : "";
        const allUnits = order.items
          ? order.items.map((item) => item.unit).join(", ")
          : "";
        const allQuantities = order.items
          ? order.items.map((item) => item.qty).join(", ")
          : "";

        return {
          "S.No": index + 1,
          UIN: order.uin || "",
          "Product Name": allProductNames || "",
          "Variety Name": allVarietyNames || "",
          "Product Brand": order.brand_name || "",
          Units: allUnits || "",
          Quantities: allQuantities || "",
          "Net Weight": firstItem.net_weight || 0,
          "Gross Weight": firstItem.gross_weight || 0,
          "Party Name": order.party_name || "",
          "Order Date": order.date
            ? new Date(order.date).toLocaleDateString()
            : "",
          Address: order.address || "",
          Country: order.country || "",
          Zipcode: order.zipcode || "",
          Email: order.email || "",
          Phone: order.phone || "",
          "Port of Loading": order.port_of_loading_id?.port_name || "",
          "Port of Discharge": order.port_of_discharge_id?.port_name || "",
          "Planned Load Date": order.planned_date_of_load
            ? new Date(order.planned_date_of_load).toLocaleDateString()
            : "",
          "Planned Delivery Date": order.planned_date_of_delivery
            ? new Date(order.planned_date_of_delivery).toLocaleDateString()
            : "",
          Mode: order.mode_id?.mode || "",
          Incoterm: order.incoterm_id?.terms || "",
          Currency: order.currency_code || "",
          "Total Amount": order.amount || 0,
          Status: order.status || "",
          "Created At":
            order.created_at && order.created_at !== "0001-01-01T00:00:00Z"
              ? new Date(order.created_at).toLocaleDateString()
              : "",
          "Updated At":
            order.updated_at && order.updated_at !== "0001-01-01T00:00:00Z"
              ? new Date(order.updated_at).toLocaleDateString()
              : "",
        };
      });

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Auto-size columns based on content
      const columnWidths = [];
      const headers = Object.keys(excelData[0] || {});

      headers.forEach((header, index) => {
        const maxLength = Math.max(
          header.length,
          ...excelData.map((row) => String(row[header] || "").length)
        );
        columnWidths[index] = { width: Math.min(maxLength + 2, 50) };
      });

      worksheet["!cols"] = columnWidths;

      // Add some styling to headers (optional)
      const headerRange = XLSX.utils.decode_range(worksheet["!ref"]);
      for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
        if (!worksheet[cellAddress]) continue;
        worksheet[cellAddress].s = {
          font: { bold: true },
          fill: { fgColor: { rgb: "EEEEEE" } },
        };
      }

      // Add the worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Purchase Orders");

      // Generate filename with current date and time
      const currentDate = new Date();
      const dateString = currentDate.toISOString().split("T")[0];
      const timeString = currentDate
        .toTimeString()
        .split(" ")[0]
        .replace(/:/g, "-");
      const filename = `purchase_orders_${dateString}_${timeString}.xlsx`;

      // Download the file
      XLSX.writeFile(workbook, filename);

      toast.success("Excel file downloaded successfully!");
    } catch (error) {
      console.error("Error downloading Excel file:", error);
      toast.error("Failed to download Excel file");
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadExcelWithSeparateRows = async () => {
    if (!purchaseData || purchaseData.length === 0) {
      toast.error("No data available to download");
      return;
    }

    setIsDownloading(true);

    try {
      // Transform the data - each item gets its own row
      const excelData = [];
      let serialNumber = 1;

      purchaseData.forEach((order) => {
        if (order.items && order.items.length > 0) {
          // Create a row for each item
          order.items.forEach((item) => {
            excelData.push({
              "S.No": serialNumber++,
              UIN: order.uin || "",
              "Product Name": item.product_name || "",
              "Variety Name": item.variety_name || "",
              Unit: item.unit || "",
              Quantity: item.qty || "",
              "Net Weight": item.net_weight || 0,
              "Gross Weight": item.gross_weight || 0,
              "Party Name": order.party_name || "",
              "Order Date": order.date
                ? new Date(order.date).toLocaleDateString()
                : "",
              Address: order.address || "",
              Country: order.country || "",
              Zipcode: order.zipcode || "",
              Email: order.email || "",
              Phone: order.phone || "",
              "Port of Loading": order.port_of_loading_id?.port_name || "",
              "Port of Discharge": order.port_of_discharge_id?.port_name || "",
              "Planned Load Date": order.planned_date_of_load
                ? new Date(order.planned_date_of_load).toLocaleDateString()
                : "",
              "Planned Delivery Date": order.planned_date_of_delivery
                ? new Date(order.planned_date_of_delivery).toLocaleDateString()
                : "",
              Mode: order.mode_id?.mode || "",
              Incoterm: order.incoterm_id?.terms || "",
              Currency: order.currency_code || "",
              "Total Amount": order.amount || 0,
              Status: order.status || "",
              "Created At":
                order.created_at && order.created_at !== "0001-01-01T00:00:00Z"
                  ? new Date(order.created_at).toLocaleDateString()
                  : "",
              "Updated At":
                order.updated_at && order.updated_at !== "0001-01-01T00:00:00Z"
                  ? new Date(order.updated_at).toLocaleDateString()
                  : "",
            });
          });
        } else {
          // If no items, create a row with order details only
          excelData.push({
            "S.No": serialNumber++,
            UIN: order.uin || "",
            "Product Name": "",
            "Variety Name": "",
            Unit: "",
            Quantity: "",
            "Net Weight": 0,
            "Gross Weight": 0,
            "Party Name": order.party_name || "",
            "Order Date": order.date
              ? new Date(order.date).toLocaleDateString()
              : "",
            Address: order.address || "",
            Country: order.country || "",
            Zipcode: order.zipcode || "",
            Email: order.email || "",
            Phone: order.phone || "",
            "Port of Loading": order.port_of_loading_id?.port_name || "",
            "Port of Discharge": order.port_of_discharge_id?.port_name || "",
            "Planned Load Date": order.planned_date_of_load
              ? new Date(order.planned_date_of_load).toLocaleDateString()
              : "",
            "Planned Delivery Date": order.planned_date_of_delivery
              ? new Date(order.planned_date_of_delivery).toLocaleDateString()
              : "",
            Mode: order.mode_id?.mode || "",
            Incoterm: order.incoterm_id?.terms || "",
            Currency: order.currency_code || "",
            "Total Amount": order.amount || 0,
            Status: order.status || "",
            "Created At":
              order.created_at && order.created_at !== "0001-01-01T00:00:00Z"
                ? new Date(order.created_at).toLocaleDateString()
                : "",
            "Updated At":
              order.updated_at && order.updated_at !== "0001-01-01T00:00:00Z"
                ? new Date(order.updated_at).toLocaleDateString()
                : "",
          });
        }
      });

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Auto-size columns
      const columnWidths = [];
      const headers = Object.keys(excelData[0] || {});

      headers.forEach((header, index) => {
        const maxLength = Math.max(
          header.length,
          ...excelData.map((row) => String(row[header] || "").length)
        );
        columnWidths[index] = { width: Math.min(maxLength + 2, 50) };
      });

      worksheet["!cols"] = columnWidths;

      // Add the worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Purchase Orders");

      // Generate filename
      const currentDate = new Date();
      const dateString = currentDate.toISOString().split("T")[0];
      const timeString = currentDate
        .toTimeString()
        .split(" ")[0]
        .replace(/:/g, "-");
      const filename = `purchase_orders_detailed_${dateString}_${timeString}.xlsx`;

      // Download the file
      XLSX.writeFile(workbook, filename);

      toast.success("Excel file downloaded successfully!");
    } catch (error) {
      console.error("Error downloading Excel file:", error);
      toast.error("Failed to download Excel file");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div>
      <div>
        <Header breadcrumbs={["Dashboard", "Booking", "Procurement"]} />
      </div>
      <div className="mt-6 px-2">
        <div className="w-full flex justify-between">
          <div className="flex items-center gap-x-5">
            <p className="text-black font-medium text-lg">Purchase orders</p>

            {/* <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left text-[13px] font-normal bg-white text-neutral-600",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <div className="w-full flex items-center justify-between">
                                  <span className="text-neutral-600 text-[13px]">
                                    Pick a date
                                  </span>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="16"
                                    viewBox="0 -960 960 960"
                                    width="16"
                                    className="fill-neutral-600"
                                  >
                                    <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
                                  </svg>
                                </div>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            className="bg-white text-neutral-600"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                            classNames={{
                              daySelected: "bg-black text-white",
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form> */}
          </div>
          <div className="flex gap-x-5">
            <button
              onClick={downloadExcel}
              className="bg-blue-500 font-medium text-white px-4 text-xs py-1.5 rounded-lg"
            >
              Download EXCEL
            </button>
            <Link
              href="/admin/procurement/create-purchase-order"
              className="bg-black flex py-2 px-5 gap-x-2 items-center rounded-lg cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="18px"
                viewBox="0 -960 960 960"
                width="18px"
                fill="#FFFFFF"
              >
                <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
              </svg>
              <p className="text-white text-[13px]">Create purchase order</p>
            </Link>
            <div className="bg-white flex w-52 justify-between rounded-lg">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search order by party name"
                className="text-neutral-400 text-[13px] font-light border-none focus:ring-0"
              />
              <div className="bg-black flex items-center rounded-r-lg px-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20px"
                  viewBox="0 -960 960 960"
                  width="20px"
                  fill="#FFFFFF"
                >
                  <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="">
          <Table className="p-5 text-neutral-600 bg-white mt-3 rounded-lg w-[90vw] uppercase">
            <TableHeader className="text-black text-left">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="text-left">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-left">
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
                  <TableCell colSpan={columns.length} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="text-left h-12 cursor-pointer"
                    onClick={(e) => {
                      console.log("Navigating to UIN:", row.original.uin);
                      const isActionClick = e.target.closest(
                        ".action-button, .popover-content"
                      );
                      if (isActionClick) return;
                      if (!row.original.uin) {
                        console.error("Missing UIN in row data:", row.original);
                        return;
                      }
                      router.push(
                        `/admin/procurement/details?uin=${row.original.uin}`
                      );
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-left">
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
                  <TableCell colSpan={columns.length} className="text-center">
                    No data found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="w-full flex justify-end gap-x-8 items-center text-xs border-t py-3 px-5 text-black bg-white">
            <p>Rows per page 9</p>
            <span>
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
            <div
              variant="outline"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="14px"
                viewBox="0 -960 960 960"
                width="14px"
                fill="#000"
              >
                <path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" />
              </svg>
            </div>
            <div
              variant="outline"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="14px"
                viewBox="0 -960 960 960"
                width="14px"
                fill="#000"
              >
                <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Procurement;
