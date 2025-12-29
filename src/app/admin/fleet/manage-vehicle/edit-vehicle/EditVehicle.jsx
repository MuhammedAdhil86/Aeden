"use client";

import Header from "@/components/Header";
import Link from "next/link";
import React, { useEffect } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import {
  createTruck,
  fetchTrip,
  fetchTruckById,
  truckUpdate,
} from "@/service/fleet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import EditExpiryDatesVehicleDialog from "./EditExpiryDatesVehicleDialog";

function EditVehicle({ onCancel }) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    trigger,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const [file1Preview, setFile1Preview] = useState(null); // Front image preview
  const [file2Preview, setFile2Preview] = useState(null); // Rear image preview
  const [file1, setFile1] = useState(null); // Front image file
  const [file2, setFile2] = useState(null); // Rear image file
  const [vehicleInsurancefile, setVehicleInsurancefile] = useState(null);
  const [regfile, setRegFile] = useState(null);
  const [polfile, setPolFile] = useState(null);
  const [fitnessfile, setFitnessFile] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [truck, setTruck] = useState(null);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const id = Number(searchParams.get("id"));

  // Watch form fields
  const manf_date = watch("manf_date");
  const regi_date = watch("regi_date");
  const pollution_expiry_from = watch("pollution_expiry_from");
  const pollution_expiry_to = watch("pollution_expiry_to");
  const rc_expiry_from = watch("rc_expiry_from");
  const rc_expiry_to = watch("rc_expiry_to");
  const vehicle_insurance_expiry_from = watch("vehicle_insurance_expiry_from");
  const vehicle_insurance_expiry_to = watch("vehicle_insurance_expiry_to");
  const fitness_expiry_from = watch("fitness_expiry_from");
  const fitness_expiry_to = watch("fitness_expiry_to");

  // File change handlers
  const handleFileChange1 = (event) => {
    const selectedTravelFile = event.target.files[0];
    if (selectedTravelFile) {
      setVehicleInsurancefile(selectedTravelFile);
    } else {
      setVehicleInsurancefile(null);
    }
  };

  const handleFileChange2 = (event) => {
    const selectedRegFile = event.target.files[0];
    if (selectedRegFile) {
      setRegFile(selectedRegFile);
    } else {
      setRegFile(null);
    }
  };

  const handleFileChange3 = (event) => {
    const selectedPolFile = event.target.files[0];
    if (selectedPolFile) {
      setPolFile(selectedPolFile);
    } else {
      setPolFile(null);
    }
  };

  const handleFileChange4 = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile2(selectedFile);
      setFile2Preview(URL.createObjectURL(selectedFile));
    } else {
      setFile2(null);
      setFile2Preview(null);
    }
  };

  const handleFileChange5 = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile1(selectedFile);
      setFile1Preview(URL.createObjectURL(selectedFile));
    } else {
      setFile1(null);
      setFile1Preview(null);
    }
  };

  const handleFileChange6 = (event) => {
    const selectedFitnessFile = event.target.files[0];
    if (selectedFitnessFile) {
      setFitnessFile(selectedFitnessFile);
    } else {
      setFitnessFile(null);
    }
  };

  const handleCancel = () => {
    reset();
    setFile1(null);
    setFile2(null);
    setFitnessFile(null);
    setPolFile(null);
    setRegFile(null);
    setVehicleInsurancefile(null);
    setFile1Preview(null);
    setFile2Preview(null);
    setIsDialogOpen(false);
    onCancel?.();
  };

  const handleSaveExpiryDates = async () => {
    const fieldsToValidate = [
      "pollution_expiry_from",
      "pollution_expiry_to",
      "rc_expiry_from",
      "rc_expiry_to",
      "vehicle_insurance_expiry_from",
      "vehicle_insurance_expiry_to",
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

  const formatToDDMMYYYY = (date) => {
    if (!date || date === "0001-01-01T00:00:00Z") return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const parseDate = (dateStr, isDDMMYYYY = false) => {
    if (!dateStr) return null;
    let date;
    if (isDDMMYYYY) {
      // Handle DD/MM/YYYY format
      const [day, month, year] = dateStr.split("/");
      date = new Date(`${year}-${month}-${day}`);
    } else {
      // Handle YYYY-MM-DD or other formats
      date = new Date(dateStr);
    }
    return isNaN(date.getTime()) ? null : date;
  };

  useEffect(() => {
    const fetchTruckDetails = async () => {
      try {
        const truck = await fetchTruckById(id);
        console.log("edit truck: ", truck);
        setTruck(truck || null);

        if (truck) {
          // Set form values
          setValue("truck_id", truck.id);
          setValue("name", truck.name || "");
          setValue("phone_number", truck.phone_number || "");
          setValue("manf_date", formatToDDMMYYYY(truck.manf_date));
          setValue("register_number", truck.register_number || "");
          setValue("engine_number", truck.engine_number || "");
          setValue("model", truck.model || "");
          setValue("address", truck.address || "");
          setValue("chassis_number", truck.chassis_number || "");
          setValue("regi_date", formatToYYYYMMDD(truck.regi_date));
          setValue(
            "pollution_expiry_from",
            formatToDDMMYYYY(truck.pollution_expiry_from)
          );
          setValue(
            "pollution_expiry_to",
            formatToDDMMYYYY(truck.pollution_expiry_to)
          );
          setValue("rc_expiry_from", formatToDDMMYYYY(truck.rc_expiry_from));
          setValue("rc_expiry_to", formatToDDMMYYYY(truck.rc_expiry_to));
          setValue(
            "vehicle_insurance_expiry_from",
            formatToDDMMYYYY(truck.vehicle_insurance_expiry_from)
          );
          setValue(
            "vehicle_insurance_expiry_to",
            formatToDDMMYYYY(truck.vehicle_insurance_expiry_to)
          );
          setValue(
            "fitness_expiry_from",
            formatToDDMMYYYY(truck.fitness_expiry_from)
          );
          setValue(
            "fitness_expiry_to",
            formatToDDMMYYYY(truck.fitness_expiry_to)
          );
          setValue("vehicle_name", truck.vehicle_name || "");

          // Set file previews and file states
          if (truck.image_url_front) {
            setFile1Preview(truck.image_url_front); // Set front image URL
            setFile1(null); // No file object unless replaced
          }
          if (truck.image_url_rear) {
            setFile2Preview(truck.image_url_rear); // Set rear image URL
            setFile2(null); // No file object unless replaced
          }
          if (truck.vehicle_insurance_file) {
            setVehicleInsurancefile({
              name: truck.vehicle_insurance_file || "Insurance Document",
            }); // Set file name
          }
          if (truck.rc_file) {
            setRegFile({
              name: truck.rc_file_name || "Registration Certificate",
            });
          }
          if (truck.polution_file) {
            setPolFile({
              name: truck.polution_file_name || "Pollution Certificate",
            });
          }
          if (truck.fitness_file) {
            setFitnessFile({
              name: truck.fitness_file_name || "Fitness Certificate",
            });
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch truck:", error);
        setLoading(false);
      }
    };

    fetchTruckDetails();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    // Validate required fields
    // if (!file1 && !truck?.image_url_front) {
    //   toast.error("Front vehicle image is required");
    //   return;
    // }
    // if (!file2 && !truck?.image_url_rear) {
    //   toast.error("Rear vehicle image is required");
    //   return;
    // }
    // if (
    //   !data.pollution_expiry_from ||
    //   !data.pollution_expiry_to ||
    //   !data.fitness_expiry_from ||
    //   !data.fitness_expiry_to ||
    //   !data.rc_expiry_from ||
    //   !data.rc_expiry_to ||
    //   !data.vehicle_insurance_expiry_from ||
    //   !data.vehicle_insurance_expiry_to
    // ) {
    //   toast.error("Please select all expiry dates");
    //   setIsDialogOpen(true);
    //   return;
    // }

    const formData = new FormData();
    formData.append("id", data.truck_id);
    formData.append("owner_name", data.name);
    formData.append("owner_address", data.address);
    formData.append("phone_number", data.phone_number);
    formData.append("register_number", data.register_number);
    formData.append("engine_number", data.engine_number);
    formData.append("model_number", data.model);
    formData.append("chassis_number", data.chassis_number);
    formData.append("vehicle_name", data.vehicle_name);

    const dates = {
      manf_date: data.manf_date ? parseDate(data.manf_date, true) : null,
      regi_date: data.regi_date ? parseDate(data.regi_date) : null,
      vehicle_insurance_expiry_from: data.vehicle_insurance_expiry_from
        ? parseDate(data.vehicle_insurance_expiry_from, true)
        : null,
      pollution_expiry_from: data.pollution_expiry_from
        ? parseDate(data.pollution_expiry_from, true)
        : null,
      fitness_expiry_from: data.fitness_expiry_from
        ? parseDate(data.fitness_expiry_from, true)
        : null,
      rc_expiry_from: data.rc_expiry_from
        ? parseDate(data.rc_expiry_from, true)
        : null,
      vehicle_insurance_expiry_to: data.vehicle_insurance_expiry_to
        ? parseDate(data.vehicle_insurance_expiry_to, true)
        : null,
      pollution_expiry_to: data.pollution_expiry_to
        ? parseDate(data.pollution_expiry_to, true)
        : null,
      fitness_expiry_to: data.fitness_expiry_to
        ? parseDate(data.fitness_expiry_to, true)
        : null,
      rc_expiry_to: data.rc_expiry_to
        ? parseDate(data.rc_expiry_to, true)
        : null,
    };

    // Append only valid dates to FormData
    for (const [key, date] of Object.entries(dates)) {
      if (date instanceof Date && !isNaN(date)) {
        formData.append(key, date.toISOString());
      }
    }

    // Append files only if they were updated
    if (file1) {
      formData.append("image_url_front", file1);
    }
    if (file2) {
      formData.append("image_url_rear", file2);
    }
    if (vehicleInsurancefile && vehicleInsurancefile instanceof File) {
      formData.append("vehicle_file", vehicleInsurancefile);
    }
    if (regfile && regfile instanceof File) {
      formData.append("rc_file", regfile);
    }
    if (polfile && polfile instanceof File) {
      formData.append("polution_file", polfile);
    }
    if (fitnessfile && fitnessfile instanceof File) {
      formData.append("fitness_file", fitnessfile);
    }

    try {
      const result = await truckUpdate(formData); // Adjust to your update API
      toast.success("Vehicle updated successfully!");
      reset();
      setFile1(null);
      setFile2(null);
      setFitnessFile(null);
      setPolFile(null);
      setRegFile(null);
      setVehicleInsurancefile(null);
      setFile1Preview(null);
      setFile2Preview(null);
      onCancel?.();
    } catch (error) {
      const errorMessage =
        error.response?.data ||
        error.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
    }
  };

  // JSX remains largely the same, with minor updates to handle file names and previews
  return (
    <div>
      <Header />
      <div className="border-b pt-3 flex gap-x-5">
        <Link
          href="/admin/fleet/manage-trip/create-trip"
          className="flex flex-col items-center gap-y-1 pe-3 border-r border-r-neutral-300 cursor-pointer"
        >
          <p className="text-[13px] font-medium text-neutral-400">
            Manage Trip
          </p>
        </Link>
        <Link
          href="/admin/fleet/manage-vehicle/add-vehicle"
          className="flex flex-col items-center gap-y-1 pe-3 border-r border-r-neutral-300 cursor-pointer"
        >
          <p className="text-[13px] font-medium text-black">Manage Vehicle</p>
          <div className="bg-red-600 h-0.5 rounded-t-lg w-2/3"></div>
        </Link>
        <Link
          href="/admin/fleet/manage-drivers/add-driver"
          className="flex flex-col items-center gap-y-1 pe-3 border-r border-r-neutral-300 cursor-pointer"
        >
          <p className="text-[13px] font-medium text-neutral-400">
            Manage Drivers
          </p>
        </Link>
      </div>
      <div className="mt-6 px-2">
        <p className="text-black font-medium text-lg">Edit Vehicle</p>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="pt-5 flex flex-col gap-y-7"
          >
            <div className="bg-white rounded-lg p-10">
              <div className="w-full grid grid-cols-[15%_auto] gap-x-7">
                <div className="flex flex-col justify-between h-full overflow-hidden">
                  <div className="h-2/3">
                    <p className="text-xs font-medium text-gray-700 px-1">
                      Front Image <span className="text-black">*</span>
                    </p>
                    <div className="relative border border-neutral-600 h-[60%] w-full rounded-md flex flex-col justify-center items-center cursor-pointer overflow-hidden mt-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange5}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {file1Preview ? (
                        <img
                          src={file1Preview}
                          alt="Front Image"
                          className="w-full h-48 object-cover rounded-md"
                        />
                      ) : (
                        <div className="flex flex-col justify-center items-center">
                          <img
                            src="/image-upload.svg"
                            alt="Upload"
                            className="w-10 h-10"
                          />
                          <p className="text-neutral-400 text-[10px] pt-1">
                            Upload front image
                          </p>
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-medium text-gray-700 px-1 mt-5">
                      Rear Image <span className="text-black">*</span>
                    </p>
                    <div className="relative border border-neutral-600 h-[60%] w-full mt-2 rounded-md flex flex-col justify-center items-center cursor-pointer overflow-hidden">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange4}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {file2Preview ? (
                        <img
                          src={file2Preview}
                          alt="Rear Image"
                          className="w-full h-48 object-cover rounded-md"
                        />
                      ) : (
                        <div className="flex flex-col justify-center items-center">
                          <img
                            src="/image-upload.svg"
                            alt="Upload"
                            className="w-10 h-10"
                          />
                          <p className="text-neutral-400 text-[10px] pt-1">
                            Upload rear image
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="">
                  <div className="grid grid-cols-3 gap-7">
                    {/* Existing form fields for text, number, and date inputs */}
                    <div>
                      <p className="text-[13px] ps-5 text-black">Owner name</p>
                      <Input
                        {...register("name")}
                        placeholder="Enter name"
                        required
                        className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                    <div>
                      <p className="text-[13px] ps-5 pb-1 text-black">
                        Owner address
                      </p>
                      <Input
                        {...register("address")}
                        placeholder="Enter address"
                        //required
                        className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                    <div>
                      <p className="text-[13px] ps-5 pb-1 text-black">
                        Owner Mobile Number
                      </p>
                      <Input
                        {...register("phone_number")}
                        type="tel"
                        placeholder="Enter number"
                        required
                        className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                    <div>
                      <p className="text-[13px] ps-5 text-black">
                        Registration number
                      </p>
                      <Input
                        {...register("register_number")}
                        placeholder="Enter number"
                        required
                        className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                    <div>
                      <p className="text-[13px] ps-5 pb-1 text-black">
                        Engine number
                      </p>
                      <Input
                        {...register("engine_number")}
                        placeholder="Enter number"
                        //required
                        className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                    <div>
                      <p className="text-[13px] ps-5 pb-1 text-black">Model</p>
                      <Input
                        {...register("model")}
                        placeholder="Enter Model name"
                        //required
                        className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                    <div>
                      <p className="text-[13px] ps-5 pb-1 text-black">
                        Chassis Number
                      </p>
                      <Input
                        {...register("chassis_number")}
                        placeholder="Enter number"
                        //required
                        className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                    <div>
                      <p className="text-[13px] ps-5 pb-1 text-black">
                        Manufacturing date
                      </p>
                      <div className="relative w-full">
                        <Input
                          {...register("manf_date")}
                          id="manf_date"
                          type="date"
                          //required
                          value={formatToYYYYMMDD(manf_date) || ""}
                          onChange={(e) => {
                            const date = e.target.value;
                            if (date) {
                              const [year, month, day] = date.split("-");
                              setValue("manf_date", `${day}/${month}/${year}`);
                            } else {
                              setValue("manf_date", "");
                            }
                          }}
                          className="border-neutral-400 text-black placeholder:text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none pr-10 
                          [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            const manf_date =
                              document.getElementById("manf_date");
                            if (manf_date) {
                              manf_date.showPicker();
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
                    </div>
                    <div>
                      <p className="text-[13px] ps-5 pb-1 text-black">
                        Registration date
                      </p>
                      <div className="relative w-full">
                        <Input
                          {...register("regi_date")}
                          id="regi_date"
                          type="date"
                          //required
                          className="border-neutral-400 text-black placeholder:text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none pr-10 
                            [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            const regi_date =
                              document.getElementById("regi_date");
                            if (regi_date) {
                              regi_date.showPicker();
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
                    </div>
                    <div>
                      <p className="text-[13px] ps-5 text-black">
                        Vehicle Name
                      </p>
                      <Input
                        {...register("vehicle_name")}
                        placeholder="Enter Vehicle name"
                        required
                        className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t mt-5 pt-5">
                <div className="w-full flex justify-between">
                  <p className="text-black text-sm font-medium">
                    Related Documents
                  </p>
                  <Button
                    type="button"
                    className="border rounded-md text-xs py-1 px-3 text-black"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    Add Expiry Dates
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-x-5 gap-y-5 mt-5">
                  {/* Vehicle Insurance File */}
                  <div className="relative flex gap-x-5 border border-dashed rounded-md py-1">
                    <div className="bg-red-500 w-1 rounded-l-md"></div>
                    <input
                      {...register("vehicleInsurancefile")}
                      type="file"
                      onChange={handleFileChange1}
                      className="absolute bottom-2 left-[23px] opacity-0 w-36 h-8 cursor-pointer"
                    />
                    <div>
                      <p className="text-black text-xs pt-1">
                        Vehicle Insurance
                      </p>
                      <div className="flex gap-x-2 py-1 items-center">
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
                        {vehicleInsurancefile && (
                          <div className="flex items-center gap-2 border rounded-md px-2 py-1 max-w-[150px]">
                            <p
                              className="text-xs text-gray-700 truncate"
                              title={
                                vehicleInsurancefile.name ||
                                "Insurance Document"
                              }
                            >
                              {vehicleInsurancefile.name ||
                                "Insurance Document"}
                            </p>
                            <button
                              type="button"
                              className="text-black hover:text-red-700"
                              onClick={() => {
                                setVehicleInsurancefile(null);
                                setValue("vehicleInsurancefile", null);
                              }}
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

                  {/* Registration Certificate (RC) */}
                  <div className="relative flex gap-x-5 border border-dashed rounded-md py-1">
                    <div className="bg-red-500 w-1 rounded-l-md"></div>
                    <input
                      {...register("regfile")}
                      type="file"
                      onChange={handleFileChange2}
                      className="absolute bottom-2 left-[23px] opacity-0 w-36 h-8 cursor-pointer"
                    />
                    <div>
                      <p className="text-black text-xs pt-1">
                        Registration Certificate (RC)
                      </p>
                      <div className="flex gap-x-2 py-1 items-center">
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
                        {regfile && (
                          <div className="flex items-center gap-2 border rounded-md px-2 py-1 max-w-[150px]">
                            <p
                              className="text-xs text-gray-700 truncate"
                              title={regfile.name || "Registration Certificate"}
                            >
                              {regfile.name || "Registration Certificate"}
                            </p>
                            <button
                              type="button"
                              className="text-black hover:text-red-700"
                              onClick={() => {
                                setRegFile(null);
                                setValue("regfile", null);
                              }}
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

                  {/* Pollution Certificate */}
                  <div className="relative flex gap-x-5 border border-dashed rounded-md py-1">
                    <div className="bg-red-500 w-1 rounded-l-md"></div>
                    <input
                      {...register("polfile")}
                      type="file"
                      onChange={handleFileChange3}
                      className="absolute bottom-2 left-[23px] opacity-0 w-36 h-8 cursor-pointer"
                    />
                    <div>
                      <p className="text-black text-xs pt-1">
                        Pollution Certificate
                      </p>
                      <div className="flex gap-x-2 py-1 items-center">
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
                        {polfile && (
                          <div className="flex items-center gap-2 border rounded-md px-2 py-1 max-w-[150px]">
                            <p
                              className="text-xs text-gray-700 truncate"
                              title={polfile.name || "Pollution Certificate"}
                            >
                              {polfile.name || "Pollution Certificate"}
                            </p>
                            <button
                              type="button"
                              className="text-black hover:text-red-700"
                              onClick={() => {
                                setPolFile(null);
                                setValue("polfile", null);
                              }}
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

                  {/* Fitness Certificate */}
                  <div className="relative flex gap-x-5 border border-dashed rounded-md py-1">
                    <div className="bg-red-500 w-1 rounded-l-md"></div>
                    <input
                      {...register("fitnessfile")}
                      type="file"
                      onChange={handleFileChange6}
                      className="absolute bottom-2 left-[23px] opacity-0 w-36 h-8 cursor-pointer"
                    />
                    <div>
                      <p className="text-black text-xs pt-1">
                        Fitness Certificate
                      </p>
                      <div className="flex gap-x-2 py-1 items-center">
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
                        {fitnessfile && (
                          <div className="flex items-center gap-2 border rounded-md px-2 py-1 max-w-[150px]">
                            <p
                              className="text-xs text-gray-700 truncate"
                              title={fitnessfile.name || "Fitness Certificate"}
                            >
                              {fitnessfile.name || "Fitness Certificate"}
                            </p>
                            <button
                              type="button"
                              className="text-black hover:text-red-700"
                              onClick={() => {
                                setFitnessFile(null);
                                setValue("fitnessfile", null);
                              }}
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
                Update Vehicle
              </Button>
            </div>
          </form>
        )}
        <EditExpiryDatesVehicleDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          register={register}
          errors={errors}
          trigger={trigger}
          onSave={handleSaveExpiryDates}
          setValue={setValue}
          pollution_expiry_from={pollution_expiry_from}
          pollution_expiry_to={pollution_expiry_to}
          rc_expiry_from={rc_expiry_from}
          rc_expiry_to={rc_expiry_to}
          vehicle_insurance_expiry_from={vehicle_insurance_expiry_from}
          vehicle_insurance_expiry_to={vehicle_insurance_expiry_to}
          fitness_expiry_from={fitness_expiry_from}
          fitness_expiry_to={fitness_expiry_to}
        />
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default EditVehicle;
