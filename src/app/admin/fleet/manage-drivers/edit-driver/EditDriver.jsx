"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Controller } from "react-hook-form";
import {
  createDriver,
  fetchDriverById,
  updateDriverById,
} from "@/service/fleet";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import ExpiryDatesDialog from "../add-driver/ExpiryDatesDialog";
import EditExpiryDatesDialog from "./EditExpiryDatesDialog";

function EditDriver() {
  const searchParams = useSearchParams();
  const id = Number(searchParams.get("id"));

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    trigger,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: { filter: false, gender: "" },
    mode: "onChange",
  });
  const [file2, setFile2] = useState(null);
  const [imgFile, setImgFile] = useState(null);
  const [licensefile, setLicensefile] = useState(null);
  const [aadharfile, setAadharFile] = useState(null);
  const [fitnessfile, setFitnessFile] = useState(null);
  const [eyeTestfile, setEyeTestfile] = useState(null);
  const [eyeTestPreview, setEyeTestPreview] = useState(null);
  const isYes = watch("filter");
  const driver_id = watch("driver_id");
  const date_of_birth = watch("date_of_birth");
  const license_expiry_from = watch("license_expiry_from");
  const license_expiry_to = watch("license_expiry_to");
  const eye_expiry_from = watch("eye_expiry_from");
  const eye_expiry_to = watch("eye_expiry_to");
  const fitness_expiry_from = watch("fitness_expiry_from");
  const fitness_expiry_to = watch("fitness_expiry_to");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);

 const handleFileChange1 = (event) => {
    const selectedFile1 = event.target.files[0];
    if (selectedFile1) {
      setFile2(URL.createObjectURL(selectedFile1));
      setImgFile(selectedFile1);
      console.log("Selected image file:", selectedFile1);
    } else {
      setFile2(null);
      setImgFile(null);
    }
  };

  const handleFileChangeAadhr = (event) => {
    const selectedAadharFile = event.target.files[0];
    if (selectedAadharFile) {
      setAadharFile(selectedAadharFile);
      console.log("Selected Aadhar file:", selectedAadharFile);
    } else {
      setAadharFile(null);
    }
  };

  const handleFileChangeLcns = (event) => {
    const selectedLicensefile = event.target.files[0];
    if (selectedLicensefile) {
      setLicensefile(selectedLicensefile);
      console.log("Selected License file:", selectedLicensefile);
    } else {
      setLicensefile(null);
    }
  };

  const handleFileChangeFitns = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFitnessFile(file);
      console.log("Selected Fitness file:", file);
    } else {
      setFitnessFile(null);
    }
  };

  const handleFileChangEye = (event) => {
    const file = event.target.files[0];
    if (file) {
      setEyeTestfile(file);
      setEyeTestPreview(URL.createObjectURL(file));
      console.log("Selected Eye Test file:", file);
    } else {
      setEyeTestfile(null);
      setEyeTestPreview(null);
    }
  };

  const handleCancel = () => {
    setLicensefile(null);
    setEyeTestfile(null);
    setAadharFile(null);
    setFitnessFile(null);
    setImgFile(null);
    setFile2(null);
    setIsDialogOpen(false);
    reset();
  };

  const handleSaveExpiryDates = async () => {
    const fieldsToValidate = [
      "license_expiry_from",
      "license_expiry_to",
      "eye_expiry_from",
      "eye_expiry_to",
      "fitness_expiry_from",
      "fitness_expiry_to",
    ];
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setIsDialogOpen(false);
    }
  };

  const formatToYYYYMMDD = (dateStr) => {
    if (!dateStr || dateStr === "0001-01-01T00:00:00Z") return "";
    if (dateStr.includes("/")) {
      const [day, month, year] = dateStr.split("/");
      return `${year}-${month}-${day}`;
    }
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
        const driver = await fetchDriverById(id);
        console.log("edit driver : ", driver);
        setDriver(driver || null);

        const formatToDDMMYYYY = (date) => {
          if (!date || date === "0001-01-01T00:00:00Z") return "";
          const d = new Date(date);
          if (isNaN(d.getTime())) return "";
          const day = String(d.getDate()).padStart(2, "0");
          const month = String(d.getMonth() + 1).padStart(2, "0");
          const year = d.getFullYear();
          return `${day}/${month}/${year}`;
        };

        if (driver) {
          setValue("driver_id", driver.id);
          setValue("full_name", driver.full_name || "");
          setValue("gender", driver.gender);
          setValue("date_of_birth", formatToDDMMYYYY(driver.date_of_birth));
          setValue("contact_number", driver.contact_number || "");
          setValue("email", driver.email || "");
          setValue("aadhaar_number", driver.aadhaar_number || "");
          setValue("address", driver.address || "");
          setValue("license_number", driver.license_number || "");
          setValue("license_expiry_from", formatToYYYYMMDD(driver.license_expiry_from));
          setValue("license_expiry_to", formatToYYYYMMDD(driver.license_expiry_to));
          setValue("eye_expiry_from", formatToYYYYMMDD(driver.eye_expiry_from));
          setValue("eye_expiry_to", formatToYYYYMMDD(driver.eye_expiry_to));
          setValue("fitness_expiry_from", formatToYYYYMMDD(driver.fitness_expiry_from));
          setValue("fitness_expiry_to", formatToYYYYMMDD(driver.fitness_expiry_to));

          if (driver.image_url) {
            setFile2(driver.image_url); // Set image URL for preview
            setImgFile(null); // No File object unless replaced
          }
          if (driver.eye_file) {
            setEyeTestPreview(driver.eye_file); // Set eye test file URL for preview
            setEyeTestfile({ name: driver.eye_file_name || driver.eye_file.split('/').pop() || "Eye Test Certificate" });
          }
          if (driver.license_file) {
            setLicensefile({ name: driver.license_file_name || driver.license_file.split('/').pop() || "License Document" });
          }
          if (driver.aadhaar_file) {
            setAadharFile({ name: driver.aadhaar_file_name || driver.aadhaar_file.split('/').pop() || "Aadhar Document" });
          }
          if (driver.fitness_file) {
            setFitnessFile({ name: driver.fitness_file_name || driver.fitness_file.split('/').pop() || "Fitness Certificate" });
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch driver:", error);
        setLoading(false);
      }
    };

    fetchDriverDetails();
  }, [id, setValue]);

  const convertToISOString = (dateString) => {
  if (!dateString) return "";

  // Handle YYYY-MM-DD format
  if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date format");
    }
    return date.toISOString();
  }

  const parts = dateString.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (parts) {
    const [_, day, month, year] = parts;
    const date = new Date(`${year}-${month}-${day}T00:00:00Z`);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date format");
    }
    return date.toISOString();
  }

  throw new Error("Unsupported date format");
};

 const validateDateOfBirth = (dateString) => {
  //if (!dateString) throw new Error("Date of birth is required");

  const parts = dateString.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!parts) throw new Error("Date of birth must be in DD/MM/YYYY format");

  const [_, day, month, year] = parts;
  const date = new Date(`${year}-${month}-${day}T00:00:00Z`);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date of birth");
  }

  const today = new Date();
  if (date > today) {
    throw new Error("Date of birth cannot be in the future");
  }

  const age = today.getFullYear() - date.getFullYear();
  if (age < 18) {
    throw new Error("Driver must be at least 18 years old");
  }
};

const onSubmit = async (data) => {
  try {
    console.log("Form data:", data);

    const formData = new FormData();
    formData.append("id", data.driver_id);
    formData.append("full_name", data.full_name);
    formData.append("email", data.email);
    formData.append("contact_number", data.contact_number);
    formData.append("aadhaar_number", data.aadhaar_number || "");
    formData.append("gender", data.gender);
    formData.append("address", data.address);
    formData.append("license_number", data.license_number);

    const dateFields = [
      { key: "date_of_birth", value: data.date_of_birth },
      { key: "license_expiry_from", value: data.license_expiry_from },
      { key: "license_expiry_to", value: data.license_expiry_to },
      { key: "eye_expiry_from", value: data.eye_expiry_from },
      { key: "eye_expiry_to", value: data.eye_expiry_to },
      { key: "fitness_expiry_from", value: data.fitness_expiry_from }, // Fixed typo
      { key: "fitness_expiry_to", value: data.fitness_expiry_to },
    ];

    // Process date fields
    for (const { key, value } of dateFields) {
      try {
        const isoDate = convertToISOString(value);
        if (key === "date_of_birth" && isoDate) {
          validateDateOfBirth(value);
        }
        formData.append(key, isoDate);
      } catch (error) {
        console.error(`Error converting ${key}:`, error.message);
        throw new Error(
          key === "date_of_birth"
            ? error.message
            : `Invalid date for ${key}. Please select a valid date.`
        );
      }
    }

    // Append files from state variables
    if (imgFile instanceof File) {
      formData.append("imgupload", imgFile);
      console.log("Appended imgupload:", imgFile);
    } else {
      console.log("No imgupload file selected");
    }
    if (licensefile instanceof File) {
      formData.append("license_file", licensefile);
      console.log("Appended license_file:", licensefile);
    } else {
      console.log("No license file selected");
    }
    if (aadharfile instanceof File) {
      formData.append("aadhaar_file", aadharfile);
      console.log("Appended aadhaar_file:", aadharfile);
    } else {
      console.log("No aadhar file selected");
    }
    if (fitnessfile instanceof File) {
      formData.append("fitness_file", fitnessfile);
      console.log("Appended fitness_file:", fitnessfile);
    } else {
      console.log("No fitness file selected");
    }
    if (eyeTestfile instanceof File) {
      formData.append("eyeTest_file", eyeTestfile);
      console.log("Appended eyeTest_file:", eyeTestfile);
    } else {
      console.log("No eye test file selected");
    }

    // Log FormData entries for debugging
    for (let [key, value] of formData.entries()) {
      console.log(`FormData entry: ${key}=`, value);
    }

    // Make API call
    const result = await updateDriverById(formData);
    console.log("Driver updated successfully:", result);
    toast.success("Driver updated successfully!");
    reset();
    window.location.href = "/admin/fleet";
  } catch (error) {
    console.error("Update driver error:", error.message);
    toast.error(error.message || "Failed to update driver. Please try again.");
  }
};
  return (
    <div>
      <div>
        <Header />
      </div>
      <div className="mt-6 px-2">
        <p className="text-black font-medium text-lg">Edit Driver</p>
        <div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="pt-5 flex flex-col gap-y-7"
            encType="multipart/form-data"
          >
            <div className="bg-white rounded-lg p-10">
              <div className="w-full flex gap-x-7">
                <div className="flex flex-col justify-between w-[10%] h-[13.5rem] overflow-hidden">
                  <div className="h-2/3">
                    <p className="text-xs font-medium text-gray-700 px-1">
                      Image <span className="text-black">*</span>
                    </p>
                    <div className="relative h-[85%] border border-neutral-600 rounded-md flex flex-col justify-center items-center cursor-pointer overflow-hidden mt-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange1}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {file2 ? (
                        <img
                          src={file2}
                          alt="Uploaded"
                          className="h-[80%] object-cover rounded-md"
                        />
                      ) : (
                        <div className="flex flex-col justify-center items-center">
                          <img
                            src="/image-upload.svg"
                            alt="Upload"
                            className="w-10 h-10"
                          />
                          <p className="text-neutral-400 text-[10px] pt-1">
                            Upload image
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="pt-10 hidden">
                    <p className="text-[13px] text-black pb-2">Availability</p>
                    <label
                      className="switch flex items-center gap-y-2 cursor-pointer border rounded-md p-1 w-1/2"
                      aria-label="Toggle Filter"
                    >
                      <input
                        type="checkbox"
                        id="filter"
                        {...register("filter")}
                        className="hidden"
                      />
                      <p
                        className={`flex justify-center rounded-md w-14 py-1 text-xs ${
                          isYes ? "bg-black text-white" : "text-gray-500"
                        }`}
                      >
                        Yes
                      </p>
                      <p
                        className={`flex justify-center rounded-md w-13 text-xs py-1 ${
                          !isYes ? "bg-black text-white" : "text-gray-500"
                        }`}
                      >
                        No
                      </p>
                    </label>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="grid grid-cols-3 gap-y-3 gap-x-7">
                    <div>
                      <p className="text-[13px] ps-5 text-black">Name</p>
                      <Input
                        {...register("full_name", { required: "Name is required" })}
                        placeholder="Enter name"
                        className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                      {errors.full_name && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.full_name.message}
                        </p>
                      )}
                    </div>
                    <Controller
                      name="gender"
                      control={control}
                      rules={{ required: "Gender is required" }}
                      render={({ field, fieldState: { error } }) => (
                        <div>
                          <p className="text-[13px] ps-5 pb-1 text-black">Gender</p>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="text-black">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent className="text-black bg-white">
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                          {error && (
                            <p className="text-red-500 text-xs mt-1">{error.message}</p>
                          )}
                        </div>
                      )}
                    />
                    <div>
                      <p className="text-[13px] ps-5 pb-1 text-black">Date of birth</p>
                      <div className="relative w-full">
                        <Input
                          {...register("date_of_birth")}
                          id="date_of_birth"
                          type="date"
                          value={formatToYYYYMMDD(date_of_birth) || ""}
                          onChange={(e) => {
                            const date = e.target.value;
                            if (date) {
                              const [year, month, day] = date.split("-");
                              setValue("date_of_birth", `${day}/${month}/${year}`);
                            } else {
                              setValue("date_of_birth", "");
                            }
                          }}
                          className="border-neutral-400 text-black placeholder:text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none pr-10 
                                    [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            const date_of_birth = document.getElementById("date_of_birth");
                            if (date_of_birth) {
                              date_of_birth.showPicker();
                            }
                          }}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-calendar-days"
                          >
                            <path d="M8 2v4" />
                            <path d="M16 2v4" />
                            <rect width="18" height="18" x="3" y="4" rx="2" />
                            <path d="M3 10h18" />
                            <path d="M8 14h.01" />
                            <path d="M12 14h.01" />
                            <path d="M16 14h.01" />
                            <path d="M8 18h.01" />
                            <path d="M12 18h.01" />
                            <path d="M16 18h.01" />
                          </svg>
                        </button>
                      </div>
                      {errors.date_of_birth && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.date_of_birth.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-[13px] ps-5 text-black">Contact number</p>
                      <Input
                        {...register("contact_number", { required: "Contact number is required" })}
                        type="number"
                        placeholder="Enter number"
                        className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                      {errors.contact_number && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.contact_number.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-[13px] ps-5 pb-1 text-black">Email</p>
                      <Input
                        {...register("email")}
                        type="email"
                        placeholder="Enter email"
                        className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-[13px] ps-5 pb-1 text-black">Aadhaar number</p>
                      <Input
                        {...register("aadhaar_number")}
                        placeholder="Enter aadhaar"
                        type="number"
                        className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                      {errors.aadhaar_number && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.aadhaar_number.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-[13px] ps-5 pb-1 text-black">Address</p>
                      <Input
                        {...register("address")}
                        placeholder="Enter address"
                        className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                      {errors.address && (
                        <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-[13px] ps-5 pb-1 text-black">License Number</p>
                      <Input
                        {...register("license_number", { required: "License number is required" })}
                        placeholder="Enter number"
                        className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                      {errors.license_number && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.license_number.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t mt-5 pt-5">
                <div className="w-full flex justify-between">
                  <p className="text-black text-sm font-medium">Related Documents</p>
                  <Button
                    type="button"
                    className="border rounded-md text-xs py-1 px-3 text-black"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    Add Expiry Dates
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-x-5 gap-y-5 mt-5">
                  <div className="relative flex gap-x-5 border border-dashed rounded-md py-1">
                    <div className="bg-red-500 w-1 rounded-l-md"></div>
                    <input
                      type="file"
                      onChange={handleFileChangeLcns}
                      className="absolute bottom-2 left-[23px] opacity-0 w-36 h-8 cursor-pointer"
                    />
                    <div>
                      <p className="text-black text-xs pt-1">License</p>
                      <div className="flex gap-x-2 py-1">
                        <button
                          type="button"
                          className="flex items-center gap-x-2 px-5 border border-neutral-400 text-xs text-white py-[6px] rounded-lg bg-black"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="20px"
                            viewBox="0 -960 960 960"
                            width="20px"
                            fill="#FFFFFF"
                          >
                            <path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H520q-33 0-56.5-23.5T440-240v-206l-64 62-56-56 160-160 160 160-56 56-64-62v206h220q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41h100v80H260Zm220-280Z" />
                          </svg>
                          Browse file
                        </button>
                        {licensefile && (
                          <div className="flex items-center gap-2 border rounded-md px-2 py-1">
                            <p className="text-xs text-gray-700">{licensefile.name}</p>
                            <button
                              type="button"
                              className="text-black hover:text-red-700"
                              onClick={() => setLicensefile(null)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="20px"
                                viewBox="0 -960 960 960"
                                width="20px"
                                fill="#000"
                              >
                                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="relative flex gap-x-5 border border-dashed rounded-md py-1">
                    <div className="bg-red-500 w-1 rounded-l-md"></div>
                    <input
                      type="file"
                      onChange={handleFileChangeAadhr}
                      className="absolute bottom-2 left-[23px] opacity-0 w-36 h-8 cursor-pointer"
                    />
                    <div>
                      <p className="text-black text-xs pt-1">Aadhar</p>
                      <div className="flex gap-x-2 py-1">
                        <button
                          type="button"
                          className="flex justify-center items-center gap-x-2 w-36 border border-neutral-400 text-xs text-white py-[6px] rounded-lg bg-black"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="20px"
                            viewBox="0 -960 960 960"
                            width="20px"
                            fill="#FFFFFF"
                          >
                            <path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H520q-33 0-56.5-23.5T440-240v-206l-64 62-56-56 160-160 160 160-56 56-64-62v206h220q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41h100v80H260Zm220-280Z" />
                          </svg>
                          Browse file
                        </button>
                        {aadharfile && (
                          <div className="flex items-center gap-2 border rounded-md px-2 py-1">
                            <p className="text-xs text-gray-700">{aadharfile.name}</p>
                            <button
                              type="button"
                              className="text-black hover:text-red-700"
                              onClick={() => setAadharFile(null)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="20px"
                                viewBox="0 -960 960 960"
                                width="20px"
                                fill="#000"
                              >
                                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="relative flex gap-x-5 border border-dashed rounded-md py-1">
                    <div className="bg-red-500 w-1 rounded-l-md"></div>
                    <input
                      id="fitnessfile"
                      type="file"
                      onChange={handleFileChangeFitns}
                      className="absolute bottom-2 left-[23px] opacity-0 w-36 h-8 cursor-pointer"
                    />
                    <div>
                      <p className="text-black text-xs pt-1">Fitness Certificate</p>
                      <div className="flex gap-x-2 py-1">
                        <label
                          htmlFor="fitnessfile"
                          className="flex justify-center items-center gap-x-2 w-36 border border-neutral-400 text-xs text-white py-[6px] rounded-lg bg-black cursor-pointer"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="20px"
                            viewBox="0 -960 960 960"
                            width="20px"
                            fill="#FFFFFF"
                          >
                            <path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H520q-33 0-56.5-23.5T440-240v-206l-64 62-56-56 160-160 160 160-56 56-64-62v206h220q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41h100v80H260Zm220-280Z" />
                          </svg>
                          Browse file
                        </label>
                        {fitnessfile && (
                          <div className="flex items-center gap-2 border rounded-md px-2 py-1">
                            <p className="text-xs text-gray-700">{fitnessfile.name}</p>
                            <button
                              type="button"
                              className="text-black hover:text-red-700"
                              onClick={() => setFitnessFile(null)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="20px"
                                viewBox="0 -960 960 960"
                                width="20px"
                                fill="#000"
                              >
                                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="relative flex gap-x-5 border border-dashed rounded-md py-1">
                    <div className="bg-red-500 w-1 rounded-l-md"></div>
                    <input
                      type="file"
                      onChange={handleFileChangEye}
                      className="absolute bottom-2 left-[23px] opacity-0 w-36 h-8 cursor-pointer"
                    />
                    <div>
                      <p className="text-black text-xs pt-1">Eye Test Certificate</p>
                      <div className="flex gap-x-2 py-1">
                        <button
                          type="button"
                          className="flex justify-center items-center gap-x-2 w-36 border border-neutral-400 text-xs text-white py-[6px] rounded-lg bg-black"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="20px"
                            viewBox="0 -960 960 960"
                            width="20px"
                            fill="#FFFFFF"
                          >
                            <path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H520q-33 0-56.5-23.5T440-240v-206l-64 62-56-56 160-160 160 160-56 56-64-62v206h220q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41h100v80H260Zm220-280Z" />
                          </svg>
                          Browse file
                        </button>
                        {eyeTestfile && (
                          <div className="flex items-center gap-2 border rounded-md px-2 py-1">
                            <p className="text-xs text-gray-700">{eyeTestfile.name}</p>
                            <button
                              type="button"
                              className="text-black hover:text-red-700"
                              onClick={() => setEyeTestfile(null)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="20px"
                                viewBox="0 -960 960 960"
                                width="20px"
                                fill="#000"
                              >
                                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-y-2 gap-x-5 pt-5">
              <Button
                type="button"
                variant="outline"
                className="text-red-500 px-7 border-neutral-300"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-black text-white font-normal px-5"
              >
                Update Driver
              </Button>
            </div>
          </form>
          <EditExpiryDatesDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            register={register}
            errors={errors}
            trigger={trigger}
            onSave={handleSaveExpiryDates}
            setValue={setValue}
            license_expiry_from={license_expiry_from}
            license_expiry_to={license_expiry_to}
            eye_expiry_from={eye_expiry_from}
            eye_expiry_to={eye_expiry_to}
            fitness_expiry_from={fitness_expiry_from}
            fitness_expiry_to={fitness_expiry_to}
          />
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </div>
    </div>
  );
}

export default EditDriver;
