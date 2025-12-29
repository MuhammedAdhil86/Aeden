import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Preview({ formData, files, onBack, uinId }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    return () => {
      if (selectedImage && selectedImage.objectUrl) {
        URL.revokeObjectURL(selectedImage.objectUrl);
      }
    };
  }, []);

  const handlePreviewClick = (file) => {
    if (!file || typeof file !== "object") {
      console.error("Invalid file object:", file);
      return;
    }

    try {
      const objectUrl = URL.createObjectURL(file);

      setSelectedImage({
        file,
        objectUrl,
        isImage: file.type && file.type.startsWith("image/"),
      });

      setDialogOpen(true);
    } catch (error) {
      console.error("Error creating object URL:", error);
      setSelectedImage({
        file,
        objectUrl: null,
        isImage: false,
        error: error.message,
      });
      setDialogOpen(true);
    }
  };

  console.log("files:", files);

  const sections = [
    {
      title: "Basic Details",
      fields: [
        { label: "Exporter Name", key: "exporterName" },
        { label: "Consignee", key: "consignee" },
        { label: "Invoice Number", key: "invoiceNumber" },
        { label: "Invoice Amount", key: "invoiceAmount" },
        { label: "Bl type", key: "bltype_name" },
        { label: "BL Number", key: "BiNumber" },
        {
          label: "Is Switch BL",
          key: "filter",
          format: (value) => (value ? "Yes" : "No"),
        },
        { label: "Place of Switch", key: "country_name" },
        { label: "ETA/ATA", key: "eta" },
        { label: "Last Updated ETA", key: "etaDate" },
        { label: "Free Days", key: "freeDays" },
        { label: "Detention Period End Date", key: "endDate" },
        { label: "Country", key: "country" },
        { label: "Category", key: "category" },
        { label: "Product", key: "product" },
      ],
    },
    {
      title: "INCO Terms",
      fields: [
        { label: "INCO Terms", key: "incoTerms" },
        { label: "Mode", key: "mode" },
        { label: "Other Mode", key: "otherMode" },
      ],
    },
    {
      title: "Insurance",
      fields: [
        { label: "Has Insurance", key: "has_insurance_string" },
        { label: "Premium Amount", key: "premiumAmount" },
        { label: "Insurance Start Date", key: "insuranceStartDate" },
        { label: "Insurance End Date", key: "insuranceEndDate" },
        { label: "Insurance number", key: "insuranceNumber" },

        // { label: "File Upload", key: "insuranceFiles", isFile: true },
      ],
    },
    {
      title: "Notify",
      fields: [
        { label: "Notify Party 1 (Optional)", key: "notify1" },
        { label: "Notify Party 2 (Optional)", key: "notify2" },
        { label: "Notify Party 3 (Optional)", key: "notify3" },
      ],
    },
    {
      title: "CNT Details",
      fields: [
        { label: "CNT Number", key: "CNTNumber" },
        { label: "Shipping Line", key: "shippingLine" },
        { label: "Vessel Name", key: "vesselName" },
        { label: "Vessel Voyage Number", key: "vesselNumber" },
        { label: "Trans Shipment", key: "is_transhipment_string" },
        { label: "Trans Shipment Port", key: "transhipmentPort" },
        { label: "Feeder Vessel Name", key: "feederVesselName" },
      ],
    },
    {
      title: "Port Details",
      fields: [
        { label: "POL (Port of Loading)", key: "pol" },
        { label: "POD (Port of Discharge)", key: "pod" },
        { label: "FPOL (First Point of Loading)", key: "fpol" },
        { label: "FPOD (Final Point of Destination)", key: "fpod" },
      ],
    },
    {
      title: "File Upload",
      fields: [
        { label: "File Name", key: "fileName" },
        { label: "file Category", key: "fileCategory" },
      ],
    },
  ];

  return (
    <div className="pt-5">
      <div className="bg-white rounded-xl p-8 text-black flex flex-col h-[72vh] overflow-y-auto">
        <h2 className="text-lg font-medium text-black">UIN NO : #{uinId}</h2>

        <div>
          {sections.map((section, index) => (
            <div key={index} className="border-t mt-5">
              <h3 className="text-sm font-medium text-black border-b py-3 mb-4">
                {section.title}
              </h3>

              <div className="grid grid-cols-6 gap-y-12 gap-x-4 py-6">
                {section.fields.map((field, idx) => (
                  <div key={idx}>
                    <p className="text-xs font-medium text-gray-600">
                      {field.label}
                    </p>
                    <p className="text-sm font-medium">
                      {formData[field.key] || 'Not provided'}
                    </p>
                  </div>
                ))}

                {/* Show Insurance File */}
                {section.title === 'Insurance' && (
                  <div className="col-span-6 mt-4">
                    <p className="text-xs font-medium text-gray-600">
                      Insurance File
                    </p>
                    {files[0] ? (
                      <div className="flex gap-4 mt-2 flex-wrap">
                        <div
                          className="flex items-center bg-black py-2 px-5 gap-x-3 rounded-md cursor-pointer"
                          onClick={() => handlePreviewClick(files[0])}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="18px"
                            viewBox="0 -960 960 960"
                            width="18px"
                            fill="#FFFFFF"
                          >
                            <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
                          </svg>
                          <p className="text-sm text-white">{files[0].name}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No insurance file uploaded.
                      </p>
                    )}
                  </div>
                )}

                {/* Show Additional File */}
                {section.title === 'File Upload' && (
                  <div className="col-span-6 mt-4">
                    <p className="text-xs font-medium text-gray-600">
                      Additional File
                    </p>
                    {files[1] ? (
                      <div className="flex gap-4 mt-2 flex-wrap">
                        <div
                          className="flex items-center bg-black py-2 px-5 gap-x-3 rounded-md cursor-pointer"
                          onClick={() => handlePreviewClick(files[1])}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="18px"
                            viewBox="0 -960 960 960"
                            width="18px"
                            fill="#FFFFFF"
                          >
                            <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
                          </svg>
                          <p className="text-sm text-white">{files[1].name}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No additional file uploaded.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image/File Preview Dialog */}
      {dialogOpen && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-black">
                {selectedImage.file?.name || 'File Preview'}
              </h3>
              <button
                onClick={() => {
                  if (selectedImage.objectUrl) {
                    URL.revokeObjectURL(selectedImage.objectUrl);
                  }
                  setDialogOpen(false);
                  setSelectedImage(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="flex justify-center">
              {selectedImage.error ? (
                <div className="p-8 text-center text-red-600">
                  <p>Error previewing file: {selectedImage.error}</p>
                </div>
              ) : selectedImage.isImage && selectedImage.objectUrl ? (
                <img
                  src={selectedImage.objectUrl}
                  alt={selectedImage.file.name}
                  className="max-w-full max-h-[70vh] object-contain"
                />
              ) : selectedImage.file?.type === 'application/pdf' &&
                selectedImage.objectUrl ? (
                <iframe
                  src={selectedImage.objectUrl}
                  title="PDF Preview"
                  className="w-full h-[70vh]"
                />
              ) : (
                <div className="p-8 text-center">
                  <p>
                    This file type ({selectedImage.file?.type || 'unknown'}) cannot
                    be previewed directly.
                  </p>
                  {selectedImage.objectUrl && (
                    <a
                      href={selectedImage.objectUrl}
                      download={selectedImage.file?.name}
                      className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Download File
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}