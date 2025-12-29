"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import { fetchDriverById } from "@/service/fleet";

function DriverDetails() {
  const searchParams = useSearchParams();
  const id = Number(searchParams.get("id"));
  const [loading, setLoading] = useState(true);
  const [driver, setDriver] = useState(null);

  console.log("id : ", id);

  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
        const driver = await fetchDriverById(id);
        console.log("driver detail : ", driver);
        //console.log("Insurance file:", driver.insurence_file);
        setDriver(driver || null);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch driver:", error);
        setLoading(false);
      }
    };
    fetchDriverDetails();
  }, [id]);

  const documents = [
    {
      name: "aadhar.pdf",
      url: driver?.aadhaar_file?.file_path || "",
      uploadedAt: "22 March 2021",
    },
    {
      name: "License_tony.pdf",
      url: driver?.license_file?.file_path || "",
      uploadedAt: "05 April 2022",
    },
    {
      name: "Eye_test_C.pdf",
      url: driver?.eye_file?.file_path || "",
      uploadedAt: "10 January 2023",
    },
    {
      name: "Fitness_C.pdf",
      url: driver?.fitness_file?.file_path || "",
      uploadedAt: "01 February 2024",
    },
  ];

  return (
    <div className="p-2">
      <Header />
      {loading ? (
        <div className="text-center text-black py-4">Loading...</div>
      ) : driver ? (
        <div className="bg-white w-full py-4 px-8 rounded-lg shadow uppercase">
          <div className="border-b flex gap-x-5 pb-3">
            <img src={driver.image_url.file_path} className="h-5" />
            <p className="text-black font-semibold">{driver.full_name}</p>
            {(() => {
              const statusColors = {
                "Not-Accepted": "bg-gray-100 text-gray-700",
                Accepted: "bg-blue-100 text-blue-700",
                "In-Transit": "bg-yellow-100 text-yellow-700",
                Reached: "bg-green-100 text-green-700",
                "License Expired": "bg-red-100 text-red-700",
              };

              const colorClasses =
                statusColors[driver.status] || "bg-red-100 text-red-700";

              return (
                <div
                  className={`rounded-md flex px-3 items-center ${colorClasses}`}
                >
                  {/* <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-dot-icon lucide-dot"
                    >
                      <circle cx="12.1" cy="12.1" r="1" />
                    </svg> */}
                  <p className="text-[12px] ml-2 font-medium">
                    {driver.status}
                  </p>
                </div>
              );
            })()}
          </div>
          <div className="border-b grid grid-cols-3 gap-y-10 py-5 uppercase">
            <div>
              <p className="text-[10px] font-medium text-gray-600">Gender</p>
              <p className="text-black font-medium text-xs pt-1 uppercase">
                {driver.gender}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-600">
                Date of Birth
              </p>
              <p className="text-black font-medium text-xs pt-1">
                {driver.date_of_birth &&
                driver.date_of_birth !== "01/01/1" &&
                driver.date_of_birth !== "0001-01-01T00:00:00Z"
                  ? new Date(driver.date_of_birth).toLocaleDateString("en-GB")
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-600">
                Contact Number
              </p>
              <p className="text-black font-medium text-xs pt-1">
                {driver.contact_number}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-600">Email </p>
              <p className="text-black font-medium text-xs pt-1">
                {driver.email}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-600">
                Aadhar Number
              </p>
              <p className="text-black font-medium text-xs pt-1">
                {driver.aadhaar_number}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-600">Address</p>
              <p className="text-black font-medium text-xs pt-1 uppercase	">
                {driver.address}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-600">
                License Number
              </p>
              <p className="text-black font-medium text-xs pt-1 uppercase">
                {driver.license_number}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-600">
                License Expiry
              </p>
              <p className="text-black font-medium text-xs pt-1">
                {driver.license_expiry_to &&
                driver.license_expiry_to !== "01/01/1" &&
                driver.license_expiry_to !== "0001-01-01T00:00:00Z" // in case it's ISO
                  ? new Date(driver.license_expiry_to).toLocaleDateString(
                      "en-GB"
                    )
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-600">
                Fitness Certificate Expiry
              </p>
              <p className="text-black font-medium text-xs pt-1">
                {driver.fitness_expiry_to &&
                driver.fitness_expiry_to !== "01/01/1" &&
                driver.fitness_expiry_to !== "0001-01-01T00:00:00Z"
                  ? new Date(driver.fitness_expiry_to).toLocaleDateString(
                      "en-GB"
                    )
                  : "N/A"}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-medium text-gray-600">
                Eye Test Certificate Expiry
              </p>
              <p className="text-black font-medium text-xs pt-1">
                {driver.eye_expiry_to &&
                driver.eye_expiry_to !== "01/01/1" &&
                driver.eye_expiry_to !== "0001-01-01T00:00:00Z"
                  ? new Date(driver.eye_expiry_to).toLocaleDateString("en-GB")
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-600">
                Fitness Certificate Expiry
              </p>
              <p className="text-black font-medium text-xs pt-1">
                {driver.fitness_expiry_to &&
                driver.fitness_expiry_to !== "01/01/1" &&
                driver.fitness_expiry_to !== "0001-01-01T00:00:00Z"
                  ? new Date(driver.fitness_expiry_to).toLocaleDateString(
                      "en-GB"
                    )
                  : "N/A"}
              </p>
            </div>
          </div>
          <div className="pt-5">
            <p className="text-sm text-black font-semibold">Documents</p>
            <div className="w-full grid grid-cols-2 gap-3 pt-5">
              {documents.map((doc, index) => (
                <div
                  key={index}
                  className="border rounded-md p-3 flex justify-between items-center"
                >
                  <div className="flex gap-x-3">
                    <div className="bg-black w-10 h-10 flex justify-center items-center rounded-md">
                      <p className="text-white text-sm">PDF</p>
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-black text-sm font-medium">
                        {doc.name}
                      </p>
                      <p className="text-xs text-neutral-400">
                        Uploaded {doc.uploadedAt}
                      </p>
                    </div>
                  </div>
                  <div
                    className="flex items-center gap-x-2 cursor-pointer"
                    onClick={() => window.open(doc.url, "_blank")}
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
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div>No driver data available.</div>
      )}
    </div>
  );
}

export default DriverDetails;
