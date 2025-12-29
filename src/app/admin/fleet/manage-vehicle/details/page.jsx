"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { fetchTripById, fetchTruckById } from "@/service/fleet";
import Header from "@/components/Header";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

function TruckDetails() {
  const searchParams = useSearchParams();
  const id = Number(searchParams.get("id"));
  const [truck, setTruck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
    const fetchTruckDetails = async () => {
      try {
        const truck = await fetchTruckById(id);
        setTruck(truck || null);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch truck:", error);
        setLoading(false);
      }
    };
    fetchTruckDetails();
  }, [id]);

  if (loading) return <div className="text-black">Loading...</div>;
  if (!truck) return <div className="text-black">Truck not found</div>;

  const documents = [
    {
      name: "Insurance",
      url: truck.vehicle_insurance_file?.file_path || "",
    },
    {
      name: "Fitness Certificate",
      url: truck.fitness_file?.file_path || "",
    },
    {
      name: "Pollution",
      url: truck.polution_file?.file_path || "",
    },
    {
      name: "RC",
      url: truck.rc_file?.file_path || "",
    },
  ];

  const PDFViewer = ({ url, name }) => {
    const [viewMethod, setViewMethod] = useState("embed"); // 'embed' or 'download'

    return (
      <div className="w-full h-full flex flex-col">
        {viewMethod === "embed" ? (
          <div className="w-full h-full flex flex-col">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                If the PDF doesn't display properly, you can download it
                instead.
              </p>
              <button
                className="px-4 py-2 bg-black text-white rounded-md text-sm"
                onClick={() => setViewMethod("download")}
              >
                Switch to Download
              </button>
            </div>
            <object data={url} type="application/pdf" className="w-full h-full">
              <div className="flex flex-col items-center justify-center h-64 border border-gray-200 rounded-md">
                <p className="mb-4">
                  Unable to display PDF. Your browser might not support PDF
                  embedding.
                </p>
                <button
                  className="px-4 py-2 bg-black text-white rounded-md"
                  onClick={() => setViewMethod("download")}
                >
                  Switch to Download
                </button>
              </div>
            </object>
          </div>
        ) : (
          <div className="p-4 flex flex-col items-center justify-center h-full">
            <p className="mb-4">PDF is available for download.</p>
            <div className="flex space-x-4">
              <a
                href={url}
                download
                className="px-4 py-2 bg-black text-white rounded-md flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download PDF
              </a>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-black text-black rounded-md flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                Open in New Tab
              </a>
              <button
                className="px-4 py-2 bg-gray-200 text-black rounded-md flex items-center gap-2"
                onClick={() => setViewMethod("embed")}
              >
                Try to Embed
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const ExcelViewer = ({ url, name }) => {
    return (
      <div className="p-4 flex flex-col items-center justify-center h-full">
        <p className="mb-4">Excel document preview not available.</p>
        <div className="flex space-x-4">
          <a
            href={url}
            download
            className="px-4 py-2 bg-black text-white rounded-md flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download Excel
          </a>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 border border-black text-black rounded-md flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            Open in New Tab
          </a>
        </div>
      </div>
    );
  }; 

  return (
    <div className="p-2">
      <Header />
      <div className="bg-white py-4 px-6 rounded-lg shadow uppercase">
        <p className="text-black font-semibold">{truck.vehicle_name}</p>
        <div className="border-t mt-4 py-4">
          <p className="text-black font-medium text-sm">Basic Details</p>
          <div className="py-10 grid grid-cols-6 gap-y-10 border-b">
            <div>
              <p className="text-[10px] font-medium text-gray-600">
                Registration Date
              </p>
              <p className="text-xs pt-1 text-black font-medium">
                {truck.regi_date
                  ? new Date(truck.regi_date).toLocaleDateString("en-GB")
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-600">
                Chassis Number
              </p>
              <p className="text-xs pt-1 text-black font-medium">
                {truck.chassis_number}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-600">
                Engine Number
              </p>
              <p className="text-xs pt-1 text-black font-medium">
                {truck.engine_number}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-600">
                Registration Number
              </p>
              <p className="text-xs pt-1 text-black font-medium">
                {truck.register_number}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-600">
                Manufacturing Date
              </p>
              <p className="text-xs pt-1 text-black font-medium">
                {truck.manf_date
                  ? new Date(truck.regi_date).toLocaleDateString("en-GB")
                  : "N/A"}
              </p>
            </div>{" "}
            <div>
              <p className="text-[10px] font-medium text-gray-600">Model</p>
              <p className="text-xs pt-1 text-black font-medium">
                {truck.model}
              </p>
            </div>{" "}
            <div>
              <p className="text-[10px] font-medium text-gray-600">
                Owner Name
              </p>
              <p className="text-xs pt-1 text-black font-medium">
                {truck.name}
              </p>
            </div>{" "}
            <div>
              <p className="text-[10px] font-medium text-gray-600">
                Owner Address
              </p>
              <p className="text-xs pt-1 text-black font-medium">
                {truck.address}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-600">
                Owner Mobile Number
              </p>
              <p className="text-xs pt-1 text-black font-medium">
                {truck.phone_number}
              </p>
            </div>{" "}
          </div>
          <p className="text-black font-medium text-sm pt-4">Images</p>
          <div className="pt-10 grid grid-cols-5 gap-7 border-b pb-7">
            <div className="h-40 overflow-hidden">
              {truck?.image_url_front?.file_path ? (
                <img
                  src={truck.image_url_front.file_path}
                  alt="Front View"
                  className="object-fill h-full"
                />
              ) : null}
            </div>
            <div className="h-40 overflow-hidden">
              {truck?.image_url_rear?.file_path ? (
                <img
                  src={truck.image_url_rear.file_path}
                  alt="Rear View"
                  className="object-fill h-full"
                />
              ) : null}
            </div>
          </div>

          <p className="text-black font-medium text-sm pt-4">Documents</p>
          <div className="grid grid-cols-2 gap-x-5 gap-y-5">
            {documents.map((doc, index) =>
              doc.url ? (
                <div
                  key={index}
                  className="border rounded-md p-3 flex justify-between items-center"
                >
                  <div className="flex gap-x-3">
                    <div className="bg-black w-12 h-12 flex justify-center items-center rounded-md">
                      <p className="text-white text-sm">
                        {doc.url.toLowerCase().endsWith(".pdf")
                          ? "PDF"
                          : doc.url.toLowerCase().endsWith(".xlsx") ||
                            doc.url.toLowerCase().endsWith(".xls")
                          ? "XLS"
                          : "DOC"}
                      </p>
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-black text-sm font-medium">
                        {doc.name}
                      </p>
                      <p className="text-[10px] text-neutral-400">Uploaded</p>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="flex items-center gap-x-2 cursor-pointer">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="18px"
                          viewBox="0 -960 960 960"
                          width="18px"
                          fill="#000"
                        >
                          <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
                        </svg>
                        <p className="text-black text-sm">View document</p>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-4xl bg-white max-h-[90vh]">
                      <DialogHeader>
                        <DialogTitle>{doc.name}</DialogTitle>
                      </DialogHeader>
                      <div className="h-[80vh] w-full overflow-auto">
                        {doc.url.toLowerCase().endsWith(".pdf") ? (
                          <PDFViewer url={doc.url} name={doc.name} />
                        ) : doc.url.toLowerCase().endsWith(".xlsx") ||
                          doc.url.toLowerCase().endsWith(".xls") ? (
                          <ExcelViewer url={doc.url} name={doc.name} />
                        ) : (
                          <img
                            src={doc.url}
                            alt={doc.name}
                            className="max-w-full h-auto mx-auto"
                          />
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              ) : null
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TruckDetails />
    </Suspense>
  );
}
