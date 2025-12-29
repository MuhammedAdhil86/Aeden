"use client";

import Header from "@/components/Header";
import Link from "next/link";
import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { createTruck, fetchTrip } from "@/service/fleet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ExpiryDatesVehicleDialog from "./ExpiryDatesVehicleDialog";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

function manageTrip({ onCancel }) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      vehicleType: "own",
    },
  });
  const [file1Preview, setFile1Preview] = useState(null);
  const [file2Preview, setFile2Preview] = useState(null);
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [vehicleInsurancefile, setVehicleInsurancefile] = useState(null);
  const [regfile, setRegFile] = useState(null);
  const [polfile, setPolFile] = useState(null);
  const [fitnessfile, setFitnessFile] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  //const thirdParty = watch("thirdParty","thirdParty")
  //const truckType = watch("truckType")

  const handleFileChange1 = (event) => {
    const selectedTravelFile = event.target.files[0];
    if (selectedTravelFile) {
      setVehicleInsurancefile(selectedTravelFile);
    }
  };

  const handleFileChange2 = (event) => {
    const selectedRegFile = event.target.files[0];
    if (selectedRegFile) {
      setRegFile(selectedRegFile);
    }
  };

  const handleFileChange3 = (event) => {
    const selectedPolFile = event.target.files[0];
    if (selectedPolFile) {
      setPolFile(selectedPolFile);
    }
  };

  const handleFileChange4 = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile2(selectedFile);
      setFile2Preview(URL.createObjectURL(selectedFile));
    }
  };

  const handleFileChange5 = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile1(selectedFile);
      setFile1Preview(URL.createObjectURL(selectedFile));
    }
  };

  const handleFileChange6 = (event) => {
    const selectedFitnessFile = event.target.files[0];
    if (selectedFitnessFile) {
      setFitnessFile(selectedFitnessFile);
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
    setIsDialogOpen(false);
    onCancel?.();
  };

  // const handleCancel = () => {
  //   reset();
  //   onCancel?.();
  // };

  const handleSaveExpiryDates = async () => {
    const fieldsToValidate = [
      "pollutionInsuranceExpiry",
      "registrationCertificateExpiry",
      "vehicleExpiry",
      "fitnessCertificateExpiry",
    ];
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setIsDialogOpen(false);
    }
  };

  const onSubmit = async (data) => {
    // if (!file1) {
    //   toast.error("vehicle image is required");
    //   return;
    // }

    // if (!file2) {
    //   toast.error("vehicle image is required");
    //   return;
    // }

    // if (
    //   !data.pCStartingDate ||
    //   !data.pCEndingDate ||
    //   !data.fCStaringDate ||
    //   !data.fCEndingDate ||
    //   !data.rCStartingDate ||
    //   !data.rCEndingDate ||
    //   !data.InsuranceStartingDate ||
    //   !data.InsuranceEndingDate
    // ) {
    //   toast.error("Please select all expiry dates");
    //   setIsDialogOpen(true);
    //   return;
    // }

    console.log("data");
    console.log("Form submitted", data);
    const formData = new FormData();

    formData.append("owner_name", data.name ?? "");
    formData.append("owner_address", data.address ?? "");
    formData.append("phone_number", data.mobile ?? "");
    formData.append("register_number", data.reg ?? "");
    formData.append("engine_number", data.engine ?? "");
    formData.append("model_number", data.model ?? "");
    formData.append("chassis_number", data.chase ?? "");
    formData.append("vehicle_name", data.vehicleName ?? "");

    formData.append(
      "is_third_party",
      data.vehicleType === "thirdParty" ? "true" : "false"
    );

    formData.append(
      "manf_date",
      data.manDate ? new Date(data.manDate).toISOString() : ""
    );
    formData.append(
      "regi_date",
      data.regDate ? new Date(data.regDate).toISOString() : ""
    );
    formData.append(
      "vehicle_insurance_expiry_from",
      data.InsuranceStartingDate
        ? new Date(data.InsuranceStartingDate).toISOString()
        : ""
    );
    formData.append(
      "pollution_expiry_from",
      data.pCStartingDate ? new Date(data.pCStartingDate).toISOString() : ""
    );
    formData.append(
      "fitness_expiry_from",
      data.fCStaringDate ? new Date(data.fCStaringDate).toISOString() : ""
    );
    formData.append(
      "rc_expiry_from",
      data.rCStartingDate ? new Date(data.rCStartingDate).toISOString() : ""
    );
    formData.append(
      "vehicle_insurance_expiry_to",
      data.InsuranceEndingDate
        ? new Date(data.InsuranceEndingDate).toISOString()
        : ""
    );
    formData.append(
      "pollution_expiry_to",
      data.pCEndingDate ? new Date(data.pCEndingDate).toISOString() : ""
    );
    formData.append(
      "fitness_expiry_to",
      data.fCEndingDate ? new Date(data.fCEndingDate).toISOString() : ""
    );

    if (file1) {
      formData.append("image_url_front", file1);
    }

    if (file2) {
      formData.append("image_url_rear", file2);
    }

    if (data.regfile?.[0]) {
      formData.append("rc_file", data.regfile[0]);
    }

    if (data.polfile?.[0]) {
      formData.append("polution_file", data.polfile[0]);
    }

    if (data.fitnessfile?.[0]) {
      formData.append("fitness_file", data.fitnessfile[0]);
    }

    if (data.vehicleInsurancefile?.[0]) {
      formData.append("vehicle_file", data.vehicleInsurancefile[0]);
    }

    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const result = await createTruck(formData);
      //console.log("Trip created successfully:", result);
      toast.success("Vehicle added successfully!");
      reset();
      setFile1(null);
      setFile2(null);
      setFitnessFile(null);
      setPolFile(null);
      setRegFile(null);
      setVehicleInsurancefile(null);
    } catch (error) {
      //console.error("Submission failed:", error);
      const errorMessage =
        error.response?.data ||
        error.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div>
      <div>
        <Header />
      </div>
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
        <p className="text-black font-medium text-lg">Add New Vehicle</p>
        <div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="pt-5 flex flex-col gap-y-7"
          >
            <div className="bg-white rounded-lg p-10">
              <div className="w-full grid grid-cols-[15%_auto] gap-x-7">
                <div className="flex flex-col justify-between h-full overflow-hidden">
                  <div className="h-2/3">
                    <p className="text-xs font-medium text-gray-700 px-1">
                      Image <span className="text-black">*</span>
                    </p>
                    <div className="relative border border-neutral-600 h-[60%] w-full rounded-md flex flex-col justify-center items-center cursor-pointer overflow-hidden mt-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange4}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {file2Preview ? (
                        <img
                          src={file2Preview}
                          alt="Uploaded"
                          className="w-full object-cover rounded-md"
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
                    <div className="relative border border-neutral-600 h-[60%] w-full mt-5 rounded-md flex flex-col justify-center items-center cursor-pointer overflow-hidden">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange5}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {file1Preview ? (
                        <img
                          src={file1Preview}
                          alt="Uploaded"
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
                            Upload image
                          </p>
                        </div>
                      )}
                    </div>
                    {/* <div></div> */}
                  </div>
                </div>
                <div className="">
                  <div className="grid grid-cols-3 gap-7">
                    <div className="flex items-center">
                      <div className="mb-4">
                        <p className="text-sm font-medium text-black mb-2">
                          Vehicle Type
                        </p>
                        <div className="flex gap-x-6">
                          <label className="flex items-center text-xs text-black">
                            <input
                              type="radio"
                              value="own"
                              {...register("vehicleType", {
                                required: "Vehicle type is required",
                              })}
                              className="accent-black mr-2"
                            />
                            Own-vehicle
                          </label>
                          <label className="flex items-center text-xs text-black">
                            <input
                              type="radio"
                              value="thirdParty"
                              {...register("vehicleType", {
                                required: "Vehicle type is required",
                              })}
                              className="accent-black mr-2"
                            />
                            Third party vehicle
                          </label>
                        </div>
                        {errors.vehicleType && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.vehicleType.message}
                          </p>
                        )}
                      </div>

                      {/* <div className="flex items-center">
                      <div className="w-full">
                        <p className="text-[13px] text-black">
                          Vehicle type
                        </p>

                        <label
                          className="switch flex items-center gap-x-2 mt-1 cursor-pointer border rounded-md p-1 w-full"
                          aria-label="Toggle Filter"
                        >
                          <input
                            type="checkbox"
                            id="vehicleType"
                            {...register("vehicleType", {
                              required: "Vehicle type is required",
                            })}
                            //className="hidden"
                          />
                          <p
                            className={`flex justify-center rounded-md items-center w-full py-1 px-3 text-[13px] ${
                              isOwnVehicle
                                ? "bg-black text-white rounded-md"
                                : "text-gray-500 rounded-md"
                            }`}
                          >
                            Own Vehicle
                          </p>
                          <p
                            className={`flex justify-center items-center rounded-md w-full py-1 px-3 text-[13px] ${
                              !isOwnVehicle
                                ? "bg-black text-white rounded-md"
                                : "text-gray-500 rounded-md"
                            }`}
                          >
                            Third Party
                          </p>
                        </label>
                      </div>
                    </div> */}
                    </div>
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
                        {...register("mobile")}
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
                        {...register("reg")}
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
                        {...register("engine")}
                        //type="number"
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
                        {...register("chase")}
                        //type="number"
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
                          {...register("manDate")}
                          id="manDate"
                          type="date"
                          //required
                          className="border-neutral-400 text-black placeholder:text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none pr-10 
                    [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            const manDate = document.getElementById("manDate");
                            if (manDate) {
                              manDate.showPicker();
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
                          {...register("regDate")}
                          id="regDate"
                          type="date"
                          //required
                          className="border-neutral-400 text-black placeholder:text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none pr-10 
                                  [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            const regDate = document.getElementById("regDate");
                            if (regDate) {
                              regDate.showPicker();
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
                        {...register("vehicleName")}
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
                    onClick={() => {
                      console.log(
                        "Opening dialog, isDialogOpen:",
                        isDialogOpen
                      );
                      setIsDialogOpen(true);
                      console.log(
                        "After setIsDialogOpen, isDialogOpen:",
                        isDialogOpen
                      );
                    }}
                  >
                    Add Expiry Dates
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-x-5 gap-y-5 mt-5">
                  <div className="relative flex gap-x-5 border border-dashed rounded-md py-1">
                    <div className="bg-red-500 w-1 rounded-l-md"></div>{" "}
                    <input
                      {...register("vehicleInsurancefile")}
                      type="file"
                      onChange={handleFileChange1}
                      className="absolute bottom-2 left-[23px] opacity-0 w-36 h-8 cursor-pointer"
                      //required
                    />
                    <div>
                      <p className="text-black text-xs pt-1">
                        Vehicle Insurance
                      </p>
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
                        {vehicleInsurancefile && (
                          <div className="flex items-center gap-2 border rounded-md px-2 py-1">
                            <p className="text-xs text-gray-700">
                              {vehicleInsurancefile.name}
                            </p>
                            <button
                              type="button"
                              className="text-black hover:text-red-700"
                              onClick={() => setVehicleInsurancefile(null)}
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
                      {...register("regfile")}
                      type="file"
                      onChange={handleFileChange2}
                      className="absolute bottom-2 left-[23px] opacity-0 w-36 h-8 cursor-pointer"
                      //required
                    />
                    <div>
                      <p className="text-black text-xs pt-1">
                        Registration Certificate(RC)
                      </p>
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
                        {regfile && (
                          <div className="flex items-center gap-2 border rounded-md px-2 py-1">
                            <p className="text-xs text-gray-700">
                              {regfile.name}
                            </p>
                            <button
                              type="button"
                              className="text-black hover:text-red-700"
                              onClick={() => setRegFile(null)}
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
                      {...register("polfile")}
                      type="file"
                      onChange={handleFileChange3}
                      className="absolute bottom-2 left-[23px] opacity-0 w-36 h-8 cursor-pointer"
                      //required
                    />
                    <div>
                      <p className="text-black text-xs pt-1">
                        Pollution Certificate
                      </p>
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
                        {polfile && (
                          <div className="flex items-center gap-2 border rounded-md px-2 py-1">
                            <p className="text-xs text-gray-700">
                              {polfile.name}
                            </p>
                            <button
                              type="button"
                              className="text-black hover:text-red-700"
                              onClick={() => setPolFile(null)}
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
                      {...register("fitnessfile")}
                      type="file"
                      onChange={handleFileChange6}
                      className="absolute bottom-2 left-[23px] opacity-0 w-36 h-8 cursor-pointer"
                      //required
                    />
                    <div>
                      <p className="text-black text-xs pt-1">
                        Fitness Certificate
                      </p>
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
                        {fitnessfile && (
                          <div className="flex items-center gap-2 border rounded-md px-2 py-1">
                            <p className="text-xs text-gray-700">
                              {fitnessfile.name}
                            </p>
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
                Add Vehicle
              </Button>
            </div>
          </form>
          <ExpiryDatesVehicleDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            register={register}
            errors={errors}
            trigger={trigger}
            onSave={handleSaveExpiryDates}
          />
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default manageTrip;
