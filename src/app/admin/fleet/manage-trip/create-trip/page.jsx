"use client";

import Header from "@/components/Header";
import Link from "next/link";
import React from "react";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  fetchDriver,
  fetchTruck,
  createTrip,
  fetchAvailableTruck,
  fetchAllDriver,
  fetchThirdPartyTruck,
} from "@/service/fleet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ExpiryDatesTripDialog from "./ExpiryDatesTripDialog";
import TripSummary from "./TripSummary";
import ContainerDetails from "./ContainerDetails";
import OtherDetails from "./OtherDetailsOwnLoad";
import InsuranceDetails from "./InsuranceDetails";
import OtherDetailsOwnLoad from "./OtherDetailsOwnLoad";
import OtherDetailsOtherLoad from "./OtherDetailsOtherLoad";
import OtherDetailsThirdParty from "./OtherDetailsThirdParty";
import RelatedDocuments from "./RelatedDocuments";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CreateTrip({ onCancel }) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      tripType: "self",
      selfType: "own-load",
      variety: "",
    },
    driver: "",
    vehicle: "",
    mode: "onChange",
  });
  const [travelfile, setTravelFile] = useState(null);
  const [otherfile, setOtherFile] = useState(null);
  const shippingFrom = watch("shippingFrom");
  const from = watch("from", "from");
  const to = watch("to", "to");
  const kilometer = watch("kilometer", 0);
  const startDate = watch("startDate", "starting Date");
  const endDate = watch("endDate", "ending Date");
  const vehicle = watch("vehicle", "---");
  const driver = watch("driver", "---");
  const [drivers, setDrivers] = useState([]);
  const [truck, setTruck] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const activeTab = watch("selfType") === "own-load" ? "own" : "other";
  const activeTabOwnVeh =
    watch("tripType") === "self" ? "ownVeh" : "thirdPartyVeh";

  const handleFileChange1 = (event) => {
    const selectedTravelFile = event.target.files[0];
    if (selectedTravelFile) {
      setTravelFile(selectedTravelFile);
    }
  };

  const handleFileChange3 = (event) => {
    const selectedOtherFile = event.target.files[0];
    if (selectedOtherFile) {
      setOtherFile(selectedOtherFile);
    }
  };

  const handleCancel = () => {
    reset();
    setTravelFile(null);
    setOtherFile(null);
    setIsDialogOpen(false);
    onCancel?.();
  };

  // const handleCancel = () => {
  //   reset();
  //   onCancel?.();
  // };

  // const onSubmitForm = (data) => {
  //   const submissionData = {
  //     ...data,
  //     vehiclefile,
  //     eyeTestfile,
  //   };
  //   console.log("Form submitted", submissionData);
  //   onSubmit?.(submissionData);
  // };

  useEffect(() => {
    const getDrivers = async () => {
      try {
        //const data = await fetchDriver();
        const data = await fetchAllDriver();
        setDrivers(data || []);
      } catch (err) {
        console.error("Failed to fetch drivers:", err);
      }
    };
    getDrivers();
  }, []);

  useEffect(() => {
    if (activeTabOwnVeh === "ownVeh") {
      const getTruck = async () => {
        try {
          const data = await fetchTruck();
          setTruck(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error("Failed to fetch trucks:", err);
          toast.error("Failed to fetch trucks");
        }
      };
      getTruck();
    } else {
      const getTruck = async () => {
        try {
          const data = await fetchThirdPartyTruck();
          setTruck(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error("Failed to fetch third-party trucks:", err);
          toast.error("Failed to fetch third-party trucks");
        }
      };
      getTruck();
    }
  }, [activeTabOwnVeh]);

  const handleOwnTabChange = (value) => {
    setValue("selfType", value === "own" ? "own-load" : "other-load");
  };

  const handleVehicleTabChange = (value) => {
    setValue("tripType", value === "ownVeh" ? "self" : "third-party");
  };

  // console.log("activeTabOwnVeh : ",activeTabOwnVeh)
  // console.log("activeTab : ",activeTab)

  const onSubmit = async (data) => {
    console.log("data : ", data);
    const formData = new FormData();
    //console.log("activeTabOwnVeh : ",activeTabOwnVeh)
    console.log("activeTab : ", activeTab);
    const isWarehouse = data.shippingFrom === "warehouse";
    const tripTitle = `${data.from || ""} to ${data.to || ""}`;

    // mergeing all stops:
    // const selectedStopNames = data.transit ? data.transit.split(",") : [];
    // const selectedStopIds = selectedStopNames
    //   .map((name) => {
    //     const stop = stops.find((s) => s.stop_name === name);
    //     return stop ? stop.id : null;
    //   })
    //   .filter(Boolean)
    //   .join(",");

    formData.append("truckid", data.vehicle || "");
    formData.append("driverid", data.driver || "");
    formData.append("total_km", Number(data.kilometer) || "");
    formData.append("km", Number(data.startingKilometer) || "");
    // formData.append("starting_fuel", Number(data.fuel) || "");
    formData.append("cargo_temp", Number(data.cargo_temp) || "");
    formData.append("hsmcode", data.HSMCode);
    // formData.append("hsmcode", "1750");

    formData.append("trip_title", tripTitle);
    formData.append("trip_type", "self");

    formData.append("loading_point", data.from || "");
    formData.append("unloading_point", data.to || "");

    // formData.append("in_transit", selectedStopIds || "");
    formData.append("in_transit", data.transit || "");

    formData.append("loading_date", new Date(data.startDate).toISOString());
    formData.append("unloading_date", new Date(data.endDate).toISOString());

    formData.append(
      "container_number",
      isWarehouse ? null : data.containerNumber
    );
    formData.append(
      "do_validate",
      isWarehouse ? null : new Date(data.doValid).toISOString()
    );
    formData.append(
      "godown_in",
      isWarehouse
        ? null
        : isWarehouse
        ? null
        : new Date(data.godownIn).toISOString()
    );

    formData.append("no_of_days", isWarehouse ? null : data.noDays);
    formData.append("insurance_invoice_number", data.inVoiceNumber || "");

    if (activeTab === "other") {
      formData.append("commission", data.commission || "");
      formData.append("halting", data.halting);
      formData.append("halting_rate", data.halting_rate);
      formData.append("is_advance_paid", data.advanceReceived);
      formData.append("advance_received", Number(data.receivedAmount));
      formData.append(
        "advance_received_date",
        data.amountdate ? new Date(data.amountdate).toISOString() : ""
      );
    } else {
      formData.append("diesel_amount", Number(data.dieselAmount) || 0);
      formData.append("diesel_ltr", Number(data.diesel) || 0);
      formData.append("trip_sheet_no", data.tripSheetNo || 0);
    }

    formData.append(
      "self_type",
      activeTab === "own" ? "own-load" : "other-load"
    );
    formData.append(
      "insurance_invoice_date",
      new Date(data.invoiceDate).toISOString()
    );
    formData.append("insurance_policy_number", data.policyNo || "");
    formData.append("insurance_premium_amount", data.premium || "");
    formData.append("freight", Number(data.freightNumber) || "");
    formData.append("branch", data.branch || "");
    formData.append("customer_name", data.customerName || "");

    formData.append("insurance_owner_name", data.ownerName || "");
    formData.append("carry_product", data.product || "");
    formData.append("product_variety", data.variety || "");
    formData.append("purpose_of_use", data.purpose || "");
    formData.append("description", data.description || "");
    formData.append("source_type", data.shippingFrom || "");

    if (data.travelfile && data.travelfile[0]) {
      formData.append("insurance_file", data.travelfile[0]);
    }

    if (data.otherfile && data.otherfile[0]) {
      formData.append("other_file", data.otherfile[0]);
      formData.append("Otherfile_category", data.documentTitle);
    }

    //alert("Form submitted!");

    console.log("Form submitted with the following data:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value instanceof File ? value.name : value}`);
    }
    try {
      const result = await createTrip(formData);
      console.log("Trip created successfully:", result);
      toast.success("Trip created successfully!");
      reset();
      setTravelFile(null);
      setOtherFile(null);
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Submission failed. Please try again.");
    }
  };

  // console.log("Form errors:", errors);

  const onSubmit2 = async (data) => {
    console.log("data : ", data);
    const formData = new FormData();

    const isWarehouse = data.shippingFrom === "warehouse";
    const tripTitle = `${data.from || ""} to ${data.to || ""}`;

    formData.append("truckid", Number(data.vehicle));
    formData.append("driverid", Number(data.driver));
    formData.append("km", Number(data.kilometer));
    formData.append("hsmcode", Number(data.HSMCode));
    formData.append("cargo_temp", Number(data.cargo_temp) || "");
    // formData.append("starting_fuel", Number(data.fuel) || "");
    formData.append("trip_title", tripTitle);

    formData.append("qty", data.quantity || "");
    formData.append("commodity", data.commodity || "");
    formData.append("client", data.client || "");
    formData.append("commission", data.commission || "");
    formData.append("committed_rate", data.committedRate || "");
    formData.append("is_advance_paid", data.advanceReceived);
    formData.append("advance_received", data.receivedAmount);
    formData.append(
      "advance_received_date",
      data.amountdate ? new Date(data.amountdate).toISOString() : ""
    );
    formData.append("balance_amount", data.balanceAmount);

    formData.append("loading_point", data.from || "");
    formData.append("unloading_point", data.to || "");

    formData.append("in_transit", data.transit || "");

    formData.append("loading_date", new Date(data.startDate).toISOString());
    formData.append("unloading_date", new Date(data.endDate).toISOString());

    formData.append(
      "container_number",
      isWarehouse ? null : data.containerNumber
    );
    formData.append(
      "do_validate",
      isWarehouse ? null : new Date(data.doValid).toISOString()
    );
    formData.append(
      "godown_in",
      isWarehouse ? null : new Date(data.godownIn).toISOString()
    );

    formData.append("no_of_days", isWarehouse ? null : data.noDays);
    formData.append("insurance_invoice_number", data.inVoiceNumber || "");

    formData.append("trip_type", "3rd-party");
    formData.append(
      "insurance_invoice_date",
      new Date(data.invoiceDate).toISOString()
    );
    formData.append("insurance_policy_number", data.policyNo || "");
    formData.append("insurance_premium_amount", data.premium || "");

    formData.append("insurance_owner_name", data.ownerName || "");
    formData.append("carry_product", data.product || "");
    formData.append("product_variety", data.variety || "");
    formData.append("purpose_of_use", data.purpose || "");
    formData.append("description", data.description || "");
    formData.append("source_type", data.shippingFrom || "");

    if (data.travelfile && data.travelfile[0]) {
      formData.append("insurance_file", data.travelfile[0]);
    }

    if (data.otherfile && data.otherfile[0]) {
      formData.append("other_file", data.otherfile[0]);
      formData.append("Otherfile_category", data.documentTitle);
    }

    //alert("Form submitted!");

    // console.log("Form submitted with the following data:");
    // for (let [key, value] of formData.entries()) {
    //   console.log(`${key}: ${value instanceof File ? value.name : value}`);
    // }
    try {
      const result = await createTrip(formData);
      console.log("Trip created successfully:", result);
      toast.success("Trip created successfully!");
      reset();
      setTravelFile(null);
      setOtherFile(null);
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Submission failed. Please try again.");
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
          <p className="text-[13px] font-medium text-black">Manage Trip</p>
          <div className="bg-red-600 h-0.5 rounded-t-lg w-2/3"></div>
        </Link>
        <Link
          href="/admin/fleet/manage-vehicle/add-vehicle"
          className="flex flex-col items-center gap-y-1 pe-3 border-r border-r-neutral-300 cursor-pointer"
        >
          <p className="text-[13px] font-medium text-neutral-400">
            Manage Vehicle
          </p>
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
        <div className="flex gap-x-6">
          <button
            type="button"
            onClick={() => handleVehicleTabChange("ownVeh")}
            className={`py-2 px-3 rounded-md text-xs ${
              activeTabOwnVeh === "ownVeh"
                ? "bg-black text-white"
                : "border border-neutral-400 text-black"
            }`}
          >
            Own Vehicle
          </button>

          <button
            type="button"
            onClick={() => handleVehicleTabChange("thirdPartyVeh")}
            className={`py-2 px-3 rounded-md text-xs ${
              activeTabOwnVeh === "thirdPartyVeh"
                ? "bg-black text-white"
                : "border border-neutral-400 text-black"
            }`}
          >
            3rd Party Vehicle
          </button>
        </div>
        {/* <p className="text-black font-medium text-lg">Create Trip</p> */}
        {activeTabOwnVeh === "ownVeh" ? (
          <div>
            <form
              onSubmit={(e) => {
                console.log("Form submission started");
                return handleSubmit((data) => {
                  console.log("Inside handleSubmit callback");
                  onSubmit(data);
                })(e);
              }}
              className="pt-5 flex flex-col gap-y-7"
            >
              {" "}
              <div className="bg-white rounded-lg px-10 py-5">
                <div className="flex gap-x-6 text-xs border-b border-neutral-300">
                  <button
                    type="button"
                    onClick={() => handleOwnTabChange("own")}
                    className={`flex flex-col items-center gap-y-1 pe-3 border-r border-r-neutral-300 cursor-pointer ${
                      activeTab === "own" ? "text-black" : "text-neutral-400"
                    }`}
                  >
                    <p className="text-[13px] font-medium">Own Load</p>
                    {activeTab === "own" && (
                      <div className="bg-red-600 h-[3px] rounded-t-lg w-2/3"></div>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOwnTabChange("other")}
                    className={`flex flex-col items-center gap-y-1 cursor-pointer ${
                      activeTab === "other" ? "text-black" : "text-neutral-400"
                    }`}
                  >
                    <p className="text-[13px] font-medium">Other Load</p>
                    {activeTab === "other" && (
                      <div className="bg-red-600 h-[3px] rounded-t-lg w-2/3"></div>
                    )}
                  </button>
                </div>
                <TripSummary
                  from={from}
                  to={to}
                  kilometer={kilometer}
                  startDate={startDate}
                  endDate={endDate}
                  driver={driver}
                  vehicle={vehicle}
                  register={register}
                  control={control}
                  drivers={drivers}
                  truck={truck}
                  watch={watch}
                  setValue={setValue}
                />

                {shippingFrom === "port" && (
                  <div className="border-t mt-5 pt-5">
                    <p className="text-black text-sm font-medium">
                      Container Details
                    </p>
                    <ContainerDetails register={register} />
                  </div>
                )}

                <div className="border-t mt-5 pt-5">
                  <p className="text-black text-sm font-medium">
                    Other Details
                  </p>
                  {activeTab === "own" ? (
                    <OtherDetailsOwnLoad
                      register={register}
                      watch={watch}
                      setValue={setValue}
                      errors={errors}
                    />
                  ) : (
                    <OtherDetailsOtherLoad
                      register={register}
                      watch={watch}
                      setValue={setValue}
                      control={control}
                      errors={errors}
                    />
                  )}
                </div>

                <div className="border-t mt-5 pt-5">
                  <p className="text-black text-sm font-medium">
                    Insurance Details
                  </p>
                  <InsuranceDetails register={register} watch={watch} />
                </div>

                <div className="border-t mt-5 pt-5">
                  <div className="w-full flex justify-between">
                    <p className="text-black text-sm font-medium">
                      Related Documents
                    </p>
                    {/* <Button
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
                  </Button> */}
                  </div>
                  <RelatedDocuments
                    register={register}
                    travelfile={travelfile}
                    otherfile={otherfile}
                    handleFileChange1={handleFileChange1}
                    handleFileChange3={handleFileChange3}
                    setTravelFile={setTravelFile}
                    setOtherFile={setOtherFile}
                  />
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
                  Create Trip
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <form
              onSubmit={handleSubmit(onSubmit2)}
              className="pt-5 flex flex-col gap-y-7"
            >
              <div className="bg-white rounded-lg px-10 py-5">
                <p className="text-black font-medium text-sm">Basis Details</p>
                <TripSummary
                  from={from}
                  to={to}
                  kilometer={kilometer}
                  startDate={startDate}
                  endDate={endDate}
                  driver={driver}
                  vehicle={vehicle}
                  //variety={variety}
                  register={register}
                  control={control}
                  drivers={drivers}
                  truck={truck}
                  watch={watch}
                />

                {shippingFrom === "port" && (
                  <div className="border-t mt-5 pt-5">
                    <p className="text-black text-sm font-medium">
                      Container Details
                    </p>
                    <ContainerDetails register={register} />
                  </div>
                )}

                <div className="border-t mt-5 pt-5">
                  <p className="text-black text-sm font-medium">
                    Other Details
                  </p>
                  <OtherDetailsThirdParty register={register} watch={watch} />
                </div>

                <div className="border-t mt-5 pt-5">
                  <p className="text-black text-sm font-medium">
                    Insurance Details
                  </p>
                  <InsuranceDetails register={register} />
                </div>

                <div className="border-t mt-5 pt-5">
                  <div className="w-full flex justify-between">
                    <p className="text-black text-sm font-medium">
                      Related Documents
                    </p>
                  </div>
                  <RelatedDocuments
                    register={register}
                    travelfile={travelfile}
                    otherfile={otherfile}
                    handleFileChange1={handleFileChange1}
                    handleFileChange3={handleFileChange3}
                    setTravelFile={setTravelFile}
                    setOtherFile={setOtherFile}
                  />
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
                  Create Trip
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default CreateTrip;
