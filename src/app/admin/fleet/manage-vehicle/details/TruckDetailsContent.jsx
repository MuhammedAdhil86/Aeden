"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { fetchTruckById } from "@/service/fleet";
import Header from "@/components/Header";

function TruckDetailsContent() {
  const searchParams = useSearchParams();
  const id = Number(searchParams.get("id"));
  const [truck, setTruck] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchTruckDetails = async () => {
      try {
        const truck = await fetchTruckById(id);
        setTruck(truck || null);
      } catch (error) {
        console.error("Failed to fetch truck:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTruckDetails();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!truck) return <div>Truck not found</div>;

  const documents = [
    { name: "insurance.pdf", url: truck?.vehicle_insurance_file?.file_path },
    { name: "Fitness Certificate.pdf", url: truck?.fitness_file?.file_path },
    { name: "pollution.pdf", url: truck?.polution_file?.file_path },
    { name: "rc.pdf", url: truck?.rc_file?.file_path },
  ];

  return (
    <div className="p-6">
      <Header />

      <div className="bg-white p-4 rounded-lg shadow uppercase">
        <p className="text-black font-semibold">{truck.engine_number}</p>
        <div className="border-t mt-4 py-4">
          <p className="text-black font-medium text-sm">Basic Details</p>
          <div className="pt-10 grid grid-cols-5 gap-y-7 border-b pb-7">
            <Detail label="Registration Date" value={truck.regi_date ? new Date(truck.regi_date).toLocaleDateString("en-GB") : "N/A"} />
            <Detail label="Chassis Number" value={truck.chassis_number} />
            <Detail label="Engine Number" value={truck.engine_number} />
            <Detail label="Registration Number" value={truck.register_number} />
            <Detail label="Manufacturing Date" value={truck.manf_date ? new Date(truck.manf_date).toLocaleDateString("en-GB") : "N/A"} />
            <Detail label="Model" value={truck.model} />
            <Detail label="Owner Name" value={truck.name} />
            <Detail label="Owner Address" value={truck.address} />
            <Detail label="Owner Mobile Number" value={truck.phone_number} />
          </div>

          <p className="text-black font-medium text-sm pt-4">Images</p>
          <div className="pt-10 grid grid-cols-5 gap-7 border-b pb-7">
            {truck?.image_url_front?.file_path && (
              <img src={truck.image_url_front.file_path} alt="Front" className="h-40 object-fill" />
            )}
            {truck?.image_url_rear?.file_path && (
              <img src={truck.image_url_rear.file_path} alt="Rear" className="h-40 object-fill" />
            )}
          </div>

          <p className="text-black font-medium text-sm pt-4">Documents</p>
          <div className="grid grid-cols-2 gap-x-5 gap-y-5">
            {documents.map((doc, index) => (
              doc.url && (
                <div
                  key={index}
                  className="border rounded-md p-3 flex justify-between items-center"
                >
                  <div className="flex gap-x-3">
                    <div className="bg-black w-12 h-12 flex justify-center items-center rounded-md">
                      <p className="text-white text-sm">PDF</p>
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-black text-sm font-medium">{doc.name}</p>
                      <p className="text-xs text-neutral-400">Uploaded</p>
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
                      <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Z" />
                    </svg>
                    <p className="text-black text-sm">View document</p>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-600">{label}</p>
      <p className="text-sm text-black font-medium">{value}</p>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading truck details...</div>}>
      <TruckDetailsContent />
    </Suspense>
  );
}
