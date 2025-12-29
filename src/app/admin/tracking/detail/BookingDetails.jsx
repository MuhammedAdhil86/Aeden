"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import { fetchBookingByUinId } from "@/service/booking";

function BookingDetails() {
  const searchParams = useSearchParams();
  const uin = Number(searchParams.get("uin"));
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await fetchBookingByUinId(uin);
        console.log("Booking Details:", response);
        setBooking(response);
      } catch (error) {
        console.error("Error fetching booking details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (uin) {
      fetchBookingDetails();
    }
  }, [uin]);

  const formatDate = (dateString) => {
    if (!dateString || dateString === "0001-01-01T00:00:00Z") {
      return "N/A";
    }
    return new Date(dateString).toLocaleDateString("en-GB");
  };

  const formatDateTime = (dateString) => {
    if (!dateString || dateString === "0001-01-01T00:00:00Z") {
      return "N/A";
    }
    return new Date(dateString).toLocaleString("en-GB");
  };

  const getStatusColor = (status) => {
    const statusColors = {
      "Active": "bg-green-100 text-green-700",
      "Pending": "bg-yellow-100 text-yellow-700",
      "Completed": "bg-blue-100 text-blue-700",
      "Cancelled": "bg-red-100 text-red-700",
    };
    return statusColors[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="p-2">
      <Header />
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : booking ? (
        <div className="bg-white w-full py-4 px-8 rounded-lg shadow">
          {/* Header Section */}
          <div className="border-b flex gap-x-5 pb-3 items-center">
            <div className="bg-blue-600 w-10 h-10 flex justify-center items-center rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-black font-semibold text-lg">
                Booking #{booking.id}
              </p>
              <p className="text-sm text-gray-600">
                {booking.bi_number} • {booking.bi_type?.types}
              </p>
            </div>
            <div className="rounded-md flex px-3 py-1 items-center bg-blue-100 text-blue-700">
              <p className="text-[12px] font-medium">
                {booking.switchbi ? "Switch B/L" : "Direct B/L"}
              </p>
            </div>
          </div>

          {/* Basic Information */}
          <div className="border-b py-5">
            <h3 className="text-sm font-semibold text-black mb-4">Basic Information</h3>
            <div className="grid grid-cols-3 gap-y-6">
              <div>
                <p className="text-[10px] font-medium text-gray-600">Supplier Name</p>
                <p className="text-black font-medium text-xs pt-1">
                  {booking.supplier_name}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-gray-600">Consignee</p>
                <p className="text-black font-medium text-xs pt-1">
                  {booking.consignee}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-gray-600">Country</p>
                <p className="text-black font-medium text-xs pt-1">
                  {booking.country?.country_name || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-gray-600">HSM Code</p>
                <p className="text-black font-medium text-xs pt-1">
                  {booking.hsm_code || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-gray-600">Invoice Number</p>
                <p className="text-black font-medium text-xs pt-1">
                  {booking.invoice_number}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-gray-600">Invoice Amount</p>
                <p className="text-black font-medium text-xs pt-1">
                  ${booking.invoice_amount}
                </p>
              </div>
            </div>
          </div>

          {/* Product & Terms */}
          <div className="border-b py-5">
            <h3 className="text-sm font-semibold text-black mb-4">Product & Terms</h3>
            <div className="grid grid-cols-3 gap-y-6">
              <div>
                <p className="text-[10px] font-medium text-gray-600">Product Name</p>
                <p className="text-black font-medium text-xs pt-1">
                  {booking.product_id?.name || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-gray-600">Incoterm</p>
                <p className="text-black font-medium text-xs pt-1">
                  {booking.incoterm_id?.terms || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-gray-600">Mode</p>
                <p className="text-black font-medium text-xs pt-1">
                  {booking.mode_id?.mode || booking.other_mode || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-gray-600">Insurance</p>
                <div className="flex items-center gap-2 pt-1">
                  <div className={`w-2 h-2 rounded-full ${booking.has_insurance ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <p className="text-black font-medium text-xs">
                    {booking.has_insurance ? `Yes ($${booking.amount})` : "No"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Details */}
          <div className="border-b py-5">
            <h3 className="text-sm font-semibold text-black mb-4">Shipping Details</h3>
            <div className="grid grid-cols-3 gap-y-6">
              <div>
                <p className="text-[10px] font-medium text-gray-600">Container Number</p>
                <p className="text-black font-medium text-xs pt-1">
                  {booking.cnt_number}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-gray-600">Shipping Line</p>
                <p className="text-black font-medium text-xs pt-1">
                  {booking.shipping_line}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-gray-600">Vessel Name</p>
                <p className="text-black font-medium text-xs pt-1">
                  {booking.vessal_name}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-gray-600">Voyage Number</p>
                <p className="text-black font-medium text-xs pt-1">
                  {booking.vessal_voyage_number}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-gray-600">Transhipment</p>
                <div className="flex items-center gap-2 pt-1">
                  <div className={`w-2 h-2 rounded-full ${booking.istranshipment ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <p className="text-black font-medium text-xs">
                    {booking.istranshipment ? "Yes" : "No"}
                  </p>
                </div>
              </div>
              {booking.istranshipment && (
                <div>
                  <p className="text-[10px] font-medium text-gray-600">Transhipment Port</p>
                  <p className="text-black font-medium text-xs pt-1">
                    {booking.transhipment_port || "N/A"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Ports & Locations */}
          <div className="border-b py-5">
            <h3 className="text-sm font-semibold text-black mb-4">Ports & Locations</h3>
            <div className="grid grid-cols-2 gap-y-6">
              <div>
                <p className="text-[10px] font-medium text-gray-600">Port of Loading</p>
                <p className="text-black font-medium text-xs pt-1">
                  {booking.port_of_loading?.port_name || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-gray-600">Port of Discharge</p>
                <p className="text-black font-medium text-xs pt-1">
                  {booking.port_of_discharge?.port_name || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-gray-600">First Point of Loading</p>
                <p className="text-black font-medium text-xs pt-1 uppercase">
                  {booking.first_point_of_loading || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-gray-600">Final Point of Discharge</p>
                <p className="text-black font-medium text-xs pt-1 uppercase">
                  {booking.final_point_of_discharge || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Dates & Timeline */}
          <div className="border-b py-5">
            <h3 className="text-sm font-semibold text-black mb-4">Dates & Timeline</h3>
            <div className="grid grid-cols-3 gap-y-6">
              <div>
                <p className="text-[10px] font-medium text-gray-600">ETA/ATA</p>
                <p className="text-black font-medium text-xs pt-1">
                  {formatDate(booking.eta_or_ata)}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-gray-600">Last Updated ETA</p>
                <p className="text-black font-medium text-xs pt-1">
                  {formatDate(booking.last_updated_eta)}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-gray-600">Free Days</p>
                <p className="text-black font-medium text-xs pt-1">
                  {booking.free_days} days
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-gray-600">Detention Period</p>
                <p className="text-black font-medium text-xs pt-1">
                  {formatDate(booking.detention_period)}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-gray-600">Created At</p>
                <p className="text-black font-medium text-xs pt-1">
                  {formatDateTime(booking.created_at)}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-gray-600">Updated At</p>
                <p className="text-black font-medium text-xs pt-1">
                  {formatDateTime(booking.updated_at)}
                </p>
              </div>
            </div>
          </div>

          {/* Notify Parties */}
          <div className="border-b py-5">
            <h3 className="text-sm font-semibold text-black mb-4">Notify Parties</h3>
            <div className="grid grid-cols-3 gap-y-6">
              <div>
                <p className="text-[10px] font-medium text-gray-600">Notify Party 1</p>
                <p className="text-black font-medium text-xs pt-1">
                  {booking.notifyparty1 || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-gray-600">Notify Party 2</p>
                <p className="text-black font-medium text-xs pt-1">
                  {booking.notifyparty2 || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-gray-600">Notify Party 3</p>
                <p className="text-black font-medium text-xs pt-1">
                  {booking.notifyparty3 || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Documents */}
          {/* <div className="pt-5 ">
            <h3 className="text-sm font-semibold text-black mb-4">Documents</h3>
            <div className="grid grid-cols-2 gap-3">
              {booking.insurance_file?.file_path && (
                <div className="border rounded-md p-3 flex justify-between items-center">
                  <div className="flex gap-x-3">
                    <div className="bg-black w-10 h-10 flex justify-center items-center rounded-md">
                      <p className="text-white text-sm">PDF</p>
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-black text-sm font-medium">
                        Insurance Document
                      </p>
                      <p className="text-xs text-neutral-400">
                        Insurance Certificate
                      </p>
                    </div>
                  </div>
                  <div
                    className="flex items-center gap-x-2 cursor-pointer"
                    onClick={() => window.open(booking.insurance_file.file_path, "_blank")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="16px"
                      viewBox="0 -960 960 960"
                      width="16px"
                      fill="#000"
                    >
                      <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
                    </svg>
                    <p className="text-black text-sm">View document</p>
                  </div>
                </div>
              )}
              
              {booking.file?.file_path && (
                <div className="border rounded-md p-3 flex justify-between items-center">
                  <div className="flex gap-x-3">
                    <div className="bg-black w-10 h-10 flex justify-center items-center rounded-md">
                      <p className="text-white text-sm">PDF</p>
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-black text-sm font-medium">
                        Booking Document
                      </p>
                      <p className="text-xs text-neutral-400">
                        Main booking file
                      </p>
                    </div>
                  </div>
                  <div
                    className="flex items-center gap-x-2 cursor-pointer"
                    onClick={() => window.open(booking.file.file_path, "_blank")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="16px"
                      viewBox="0 -960 960 960"
                      width="16px"
                      fill="#000"
                    >
                      <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
                    </svg>
                    <p className="text-black text-sm">View document</p>
                  </div>
                </div>
              )}
            </div>
          </div> */}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">No booking data available.</p>
        </div>
      )}
    </div>
  );
}

export default BookingDetails;