"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  fetchPurchaseByUIN,
  updatePurchaseOrderStatus,
} from "@/service/procurements"; // Only import the needed function
import Header from "@/components/Header";
import html2pdf from "html2pdf.js";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { generatePurchaseOrderPDF } from "./generatePurchaseOrderPDF";

export default function PurchaseDetailsPage() {
  const searchParams = useSearchParams();
  const uin = searchParams.get("uin"); // Get UIN as string
  const [data, setData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchDetails() {
      try {
        const res = await fetchPurchaseByUIN(uin);
        setData(res.data);
      } catch (err) {
        console.error("Error fetching purchase details", err);
      }
    }

    if (uin) fetchDetails();
  }, [uin]);

  if (!data) return <p>Loading...</p>;

  const handleEdit = () => {
    router.push(`/admin/procurement/update-purchase-order/${uin}`);
  };

  const handleDownloadPDF = () => {
    generatePurchaseOrderPDF(data).catch((err) => {
      console.error("Error generating PDF", err);
      toast.error("Failed to generate PDF.");
    });
  };

  return (
    <div className="p-2">
      <Header />
      <div className="flex justify-between items-center py-2">
        <p className="text-lg text-black font-semibold py-4">Purchase Order</p>
        <div className="flex justify-end">
          <div className="flex gap-x-3">
            <button
              onClick={handleDownloadPDF}
              className="bg-blue-500 font-medium text-white px-4 text-xs py-1.5 rounded"
            >
              Download PDF
            </button>
            <Button
              className="text-white bg-black rounded-md px-4 py-1.5 text-sm"
              onClick={handleEdit}
            >
              Edit Purchase Order
            </Button>
          </div>
        </div>
      </div>
      <div
        id="purchase-order-content"
        className="bg-white mt-3 py-4 px-6 rounded-lg shadow"
      >
        <div className=" pb-4 uppercase">
          <div className="w-full flex justify-between items-center">
            <p className="text-black font-semibold">UIN {data.uin}</p>
            <p
              className={`status-badge px-2 py-1 rounded-full text-xs font-medium
                ${
                  data.status === "Waiting for Approval"
                    ? "bg-yellow-100 text-yellow-800"
                    : data.status === "Approved"
                    ? "bg-green-100 text-green-800"
                    : data.status === "Rejected"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }`}
            >
              {data.status}
            </p>
          </div>
          <div className="mt-3 pt-5 pb-10 grid grid-cols-5 gap-y-10 border-b border-t">
            <div>
              <p className="text-[10px] font-medium text-gray-600">
                Planned date of loading
              </p>
              <p className="text-xs pt-1 text-black font-medium">
                {data.planned_date_of_load
                  ? new Date(data.planned_date_of_load).toLocaleDateString(
                      "en-GB"
                    )
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-600">
                Party Name
              </p>
              <p className="text-xs pt-1 text-black font-medium">
                {data.party_name || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-600">
                Port of Loading
              </p>
              <p className="text-xs pt-1 text-black font-medium">
                {data.port_of_loading_id?.port_name || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-600">Country</p>
              <p className="text-xs pt-1 text-black font-medium">
                {data.country || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-600">
                Port of Discharge
              </p>
              <p className="text-xs pt-1 text-black font-medium">
                {data.port_of_discharge_id?.port_name || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-600">
                Mobile Number
              </p>
              <p className="text-xs pt-1 text-black font-medium">
                {data.phone || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-600">Email</p>
              <p className="text-xs pt-1 text-black font-medium">
                {data.email || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-600">Address</p>
              <p className="text-xs pt-1 text-black font-medium">
                {data.address || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-600">
                Planned date of delivery
              </p>
              <p className="text-xs pt-1 text-black font-medium">
                {data.planned_date_of_delivery
                  ? new Date(data.planned_date_of_delivery).toLocaleDateString(
                      "en-GB"
                    )
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-600">Zip</p>
              <p className="text-xs pt-1 text-black font-medium">
                {data.zipcode || "N/A"}
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mt-6 mb-6">
            <p className="text-black font-medium text-sm mb-4">Order Summary</p>
            <div className="grid grid-cols-3 gap-y-6">
              <div>
                <p className="text-[10px] font-medium text-gray-600">Brand</p>
                <p className="text-xs pt-1 text-black font-medium">
                  {data.brand_name || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-gray-600">
                  Total Amount
                </p>
                <p className="text-xs pt-1 text-black font-medium">
                  {data.amount || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-gray-600">
                  Order Date
                </p>
                <p className="text-xs pt-1 text-black font-medium">
                  {data.date
                    ? new Date(data.date).toLocaleDateString("en-GB")
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-gray-600">
                  Freight
                </p>
                <p className="text-xs pt-1 text-black font-medium">
                  {data.incoterm_id?.terms || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-gray-600">
                  Incoterm
                </p>
                <p className="text-xs pt-1 text-black font-medium">
                  {data.mode_id?.mode || "N/A"} - {data.mode_id?.description || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-gray-600">
                  Currency
                </p>
                <p className="text-xs pt-1 text-black font-medium">
                  {data.currency_code || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <p className="text-black font-medium text-sm">
                Items ({data.items?.length || 0})
              </p>
              <p className="text-xs text-gray-500">
                Total: {data.currency_code || "N/A"} {data.amount || 0}
              </p>
            </div>

            {data.items && data.items.length > 0 ? (
              <div className="space-y-4">
                {data.items.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex justify-between items-start mb-3 pb-3 border-b">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-black">
                          {item.product_name}
                          {item.variety_name && (
                            <span className="text-gray-600 font-normal">
                              {" "}
                              - {item.variety_name}
                            </span>
                          )}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Item #{index + 1}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-black">
                          {item.qty} {item.unit}
                        </p>
                        <p className="text-xs text-gray-500">
                          Net: {item.net_weight} {item.weight_unit}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 text-xs">
                      <div>
                        <p className="text-gray-600 font-medium">Product</p>
                        <p className="text-black">{item.product_name}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">Variety</p>
                        <p className="text-black">{item.variety_name || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">COunt / size</p>
                        <p className="text-black">{item.count_or_size}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">Quantity</p>
                        <p className="text-black">{item.qty} {item.unit}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">Net Weight</p>
                        <p className="text-black">{item.net_weight} {item.weight_unit}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div>
                <p className="text-[10px] font-medium text-gray-600">
                  Reamrks
                </p>
                <p className="text-xs pt-1 text-black font-medium">
                  {data.remarks || "N/A"}
                </p>
              </div>
                {data.status === "Waiting for Approval" && (
                  <div className="mt-3 w-full flex justify-end gap-x-5">
                    <button
                      className="bg-red-500 text-[13px] text-white px-4 py-1.5 rounded"
                      onClick={async () => {
                        try {
                          await updatePurchaseOrderStatus(data.uin, "Rejected");
                          toast.success("Purchase order rejected.");
                          window.location.reload();
                        } catch (err) {
                          toast.error("Failed to reject order.");
                        }
                      }}
                    >
                      Reject
                    </button>
                    <button
                      className="bg-green-500 text-[13px] text-white px-4 py-1.5 rounded"
                      onClick={async () => {
                        try {
                          await updatePurchaseOrderStatus(data.uin, "Approved");
                          toast.success("Purchase order approved.");
                          window.location.reload();
                        } catch (err) {
                          toast.error("Failed to approve order.");
                        }
                      }}
                    >
                      Accept
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No items found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
