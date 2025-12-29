// components/booking/Sea.jsx
"use client";

import Header from "@/components/Header";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import Step6 from "./Step6";
import Step7 from "./Step7";
import Preview from "./Preview";
import { createBooking, fetchExporterByUinId } from "@/service/booking";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Sea({ onCancel }) {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
    control,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      exporterName: "",
      consignee: "",
      invoiceNumber: "",
      invoiceAmount: "",
      BiNumber: "",
      filter: false,
      place: "",
      eta: "",
      etaDate: "",
      freeDays: "",
      endDate: "",
      country: "",
      category: "",
      product: "",
    },
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [files, setFiles] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [country, setCountry] = useState("");
  const [category, setCategory] = useState("");
  const [product, setProduct] = useState("");
  const [inco, setINCO] = useState("");
  const [mode, setMode] = useState("");
  const [othermode, setOtherMode] = useState("");
  const [pol, setPol] = useState("");
  const [pod, setPod] = useState("");
  const [loadingExporter, setLoadingExporter] = useState(false);
  const uinId = watch("uinId");
  const [previewFiles, setPreviewFiles] = useState([]);

  const totalSteps = 7;

  const steps = [
    { number: 1, title: "Basic Details" },
    { number: 2, title: "INCO Terms" },
    { number: 3, title: "Insurance" },
    { number: 4, title: "Notify" },
    { number: 5, title: "CNT Details" },
    { number: 6, title: "Port Details" },
    { number: 7, title: "File Upload" },
  ];

  const getStatus = (stepNumber) => {
    if (stepNumber === currentStep) return "Ongoing";
    if (stepNumber < currentStep) return "Completed";
    return "Pending";
  };

  const handleFileChange = (fieldName) => (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFiles((prev) => ({ ...prev, [fieldName]: selectedFile }));
    }
  };

  const handleCancel = () => {
    reset();
    setCurrentStep(1);
    setFiles({});
    setShowPreview(false);
    onCancel?.();
  };

  const handleNext = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  useEffect(() => {
    const getExporter = async () => {
      if (uinId?.trim()) {
        setLoadingExporter(true);
        try {
          const response = await fetchExporterByUinId(uinId);
          if (response) {
            setCountry(response.country.country_name);
            setCategory(response.category.category_name);
            setProduct(response.products.name);
            setINCO(response.incoterm_id.terms);
            setMode(response.mode_id.mode);
            setOtherMode(response.other_mode);
            setPol(response.port_of_loading_id.port_name);
            setPod(response.port_of_discharge_id.port_name);
            setValue("country", response.country.country_name);
            setValue("category", response.category.category_name);
            setValue("product", response.products.name);
            setValue("incoTerms", response.incoterm_id.terms);
            setValue("mode", response.mode_id.mode);
            setValue("otherMode", response.other_mode);
            setValue("pol", response.port_of_loading_id.port_name);
            setValue("pod", response.port_of_discharge_id.port_name);
          } else {
            setCountry("");
            setCategory("");
            setINCO("");
            setMode("");
            setOtherMode("");
            setPol("");
            setPod("");
            setValue("country", "");
            setValue("category", "");
            setValue("product", "");
            setValue("incoTerms", "");
            setValue("mode", "");
            setValue("otherMode", "");
            setValue("pol", "");
            setValue("pod", "");
          }
        } catch (error) {
          console.error("Error fetching exporter:", error);
          setCountry("");
          setValue("country", "");
        } finally {
          setLoadingExporter(false);
        }
      }
    };

    getExporter();
  }, [uinId]);

  const onSubmit = async (data) => {
    console.log("data : ", data);

    const formData = new FormData();

    formData.append("uin", uinId);
    formData.append("supplier_name", data.exporterName);
    formData.append("consignee", data.consignee);
    formData.append("invoice_amount", data.invoiceAmount);
    formData.append("invoice_number", data.invoiceNumber);
    formData.append("bi_number", data.BiNumber);
    formData.append("bi_type_id", data.bltype);
    formData.append("switch_bi", data.filter);
    formData.append(
      "pos_id",
      data.filter === "No" ? null : parseInt(data.country_id, 10)
    );
    formData.append("eta_or_ata", data.eta);
    formData.append("last_updated_eta", data.etaDate);
    formData.append("free_days", data.freeDays);
    formData.append("detention_period", data.endDate);
    formData.append("other_mode", data.otherMode);
    //formData.append("",selectedCategory)

    //insurance fields
    formData.append("has_insurance", data.insurance);

    if (data.insurance) {
      const premium = parseInt(data.premiumAmount);
      if (!isNaN(premium)) {
        formData.append("premium_amount", premium);
      }

      formData.append(
        "insurance_start_date",
        data.insuranceStartDate
          ? new Date(data.insuranceStartDate).getTime()
          : ""
      );
      formData.append(
        "insurance_end_date",
        data.insuranceEndDate ? new Date(data.insuranceEndDate).getTime() : ""
      );
      formData.append("insurance_number", data.insuranceNumber || "");
    }

    //notify
    formData.append("notify_party1", data.notify1 || "");
    formData.append("notify_party2", data.notify2 || "");
    formData.append("notify_party3", data.notify3 || "");

    //cnt
    formData.append("cnt_number", data.CNTNumber);
    formData.append("shipping_line", data.shippingLine);
    formData.append("vessel_name", data.vesselName);
    formData.append("feeder_vessal_voyage_number", data.vesselNumber);
    formData.append("is_transhipment", data.is_transhipment);
    formData.append(
      "transhipment_port",
      data.is_transhipment ? data.transhipmentPort : null
    );
    formData.append(
      "feeder_vessal_name",
      data.is_transhipment ? data.feederVesselName : null
    );

    //port details
    formData.append("first_point_of_loading", data.fpol);
    formData.append("final_point_of_discharge", data.fpod);

    //file upload
    formData.append("file_name", data.fileName);
    formData.append("fileCategory", data.file_category);
    formData.append("file_category", data.fileCategory);

    if (data.insuranceFile && data.insuranceFile.length > 0) {
      formData.append("insurance_file", data.insuranceFile[0]);
    }

    if (data.file && data.file.length > 0) {
      formData.append("file", data.file[0]);
    }

    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const result = await createBooking(formData);
      console.log("Booking created successfully:", result);
      toast.success("Booking created successfully!");
      //reset();
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const getFieldsForStep = (step) => {
    switch (step) {
      case 1:
        return [
          "exporterName",
          "consignee",
          "country",
          "invoiceNumber",
          "invoiceAmount",
          "BiNumber",
          "bltype_name",
          "filter",
          "eta",
          "country_name",
          "etaDate",
          "freeDays",
          "endDate",
          "category",
          "product",
        ];
      case 2:
        return [
          "incoTerms",
          "mode",
          "otherMode",
          "CNTNumber",
          "HSMCode",
          "billOfLadingNumber",
          "purchaseOrderNumber",
          "shipmentReferenceNumber",
          "customsDeclarationNumber",
        ];
      case 3:
        return [
          "has_insurance_string",
          "premiumAmount",
          "insuranceStartDate",
          "insuranceEndDate",
          "insuranceNumber",
          "file",
        ];
      case 4:
        return ["notify1", "notify2", "notify3"];
      case 5:
        return [
          "CNTNumber",
          "shippingLine",
          "vesselName",
          "vesselNumber",
          "is_transhipment_string",
          "transhipmentPort",
          "feederVesselName",
        ];
      case 6:
        return ["pol", "pod", "fpol", "fpod"];
      case 7:
        return ["file", "fileName", "fileCategory"];
      default:
        return [];
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1
            register={register}
            errors={errors}
            watch={watch}
            control={control}
            setValue={setValue}
            country={country}
            loadingExporter={loadingExporter}
          />
        );
      case 2:
        return (
          <Step2
            register={register}
            errors={errors}
            watch={watch}
            control={control}
          />
        );
      case 3:
        return (
          <Step3
            register={register}
            errors={errors}
            watch={watch}
            control={control}
            setValue={setValue}
          />
        );
      case 4:
        return (
          <Step4
            register={register}
            errors={errors}
            watch={watch}
            control={control}
          />
        );
      case 5:
        return (
          <Step5
            register={register}
            errors={errors}
            watch={watch}
            control={control}
            setValue={setValue}
          />
        );
      case 6:
        return (
          <Step6
            register={register}
            errors={errors}
            watch={watch}
            control={control}
          />
        );
      case 7:
        return (
          <Step7
            register={register}
            errors={errors}
            files={files}
            handleFileChange={handleFileChange}
          />
        );
      default:
        return null;
    }
  };

  const handlePreview = async () => {
    const currentValues = getValues();
    const insuranceFile = currentValues.insuranceFile;
    const additionalFile = currentValues.file;

    let generatedFiles = [];

    if (insuranceFile) {
      if (Array.isArray(insuranceFile)) {
        generatedFiles = insuranceFile;
      } else if (insuranceFile instanceof FileList) {
        generatedFiles = Array.from(insuranceFile);
      } else if (insuranceFile instanceof File) {
        generatedFiles = [insuranceFile];
      } else if (typeof insuranceFile === "object") {
        generatedFiles = Array.isArray(insuranceFile)
          ? insuranceFile
          : [insuranceFile];
      }
    }

    if (additionalFile) {
      if (additionalFile instanceof File) {
        generatedFiles.push(additionalFile);
      } else if (additionalFile instanceof FileList) {
        generatedFiles.push(...Array.from(additionalFile));
      }
    }

    console.log("Files being passed to Preview:", generatedFiles);
    setPreviewFiles(generatedFiles);

    const allFields = [
      ...getFieldsForStep(1),
      ...getFieldsForStep(2),
      ...getFieldsForStep(3),
      ...getFieldsForStep(4),
      ...getFieldsForStep(5),
      ...getFieldsForStep(6),
      ...getFieldsForStep(7),
    ];

    const isValid = await trigger(
      allFields.filter(
        (field) =>
          currentValues[field] !== undefined && currentValues[field] !== ""
      )
    );

    setShowPreview(true);
  };

  const handleBackFromPreview = () => {
    setShowPreview(false);
  };

  return (
    <div>
      <div className="pt-5">
        <div>
          {showPreview ? (
            <div className="w-full flex justify-between px-2">
              <p className="text-black text-xl font-medium">Preview</p>
              <Button
                type="button"
                className="bg-black text-white px-7"
                onClick={handleBackFromPreview}
              >
                Back
              </Button>
            </div>
          ) : (
            <div className="w-full flex justify-between">
              <p className="text-black text-xl font-medium">
                New Shipment Information Entry
              </p>
              <Button
                type="button"
                className="bg-black text-white px-7"
                onClick={handlePreview}
              >
                Preview
              </Button>
            </div>
          )}
          {!showPreview && (
            <div className="flex items-center justify-between w-full mt-4">
              {steps.map((step, index) => {
                const status = getStatus(step.number);

                return (
                  <div key={step.number} className="w-full overflow-hidden">
                    <div className="flex items-center">
                      <div className="flex ps-5">
                        <div>
                          <p
                            className={`w-7 h-7 rounded-full flex flex-col items-center justify-center text-xs font-medium ${
                              status === "Pending"
                                ? "bg-white text-black"
                                : "bg-black text-white"
                            }`}
                          >
                            {step.number}
                          </p>
                        </div>
                      </div>
                      <div className="ps-5">
                        {index < steps.length - 1 && (
                          <div
                            className={`h-0.5 w-40 ${
                              step.number < currentStep
                                ? "bg-red-500"
                                : "bg-gray-300"
                            }`}
                          />
                        )}
                      </div>
                    </div>
                    <div className="ps-5 pt-2">
                      <p className="text-xs font-medium mt-2 text-black">
                        {step.title}
                      </p>
                      <p
                        className={`text-[10px] mt-1 ${
                          status === "Completed"
                            ? "text-green-500"
                            : status === "Ongoing"
                            ? "text-blue-500"
                            : "text-gray-500"
                        }`}
                      >
                        {status}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {showPreview ? (
          <Preview
            formData={getValues()}
            files={previewFiles}
            onBack={handleBackFromPreview}
            uinId={uinId}
          />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="pt-5">
            <div className="bg-white rounded-xl space-y-4 py-10 px-10 text-black flex flex-col gap-y-10">
              {renderStep()}
            </div>
            <div className="border-t w-full flex justify-between p-8">
              <Button
                type="button"
                variant="outline"
                className="text-red-500 px-7 border-neutral-300"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <div className="flex gap-x-5">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="px-7 text-black border-neutral-300"
                    onClick={handlePrevious}
                  >
                    Previous
                  </Button>
                )}
                {currentStep < totalSteps && (
                  <Button
                    type="button"
                    className="bg-black text-white px-7"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                )}
                {currentStep === totalSteps && (
                  <Button
                    type="submit"
                    onClick={handleSubmit(onSubmit)}
                    className="bg-black text-white px-7"
                  >
                    Submit
                  </Button>
                )}
              </div>
            </div>
          </form>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
