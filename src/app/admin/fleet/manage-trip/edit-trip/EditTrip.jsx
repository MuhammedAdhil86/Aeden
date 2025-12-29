
"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import {
  fetchAllDriver,
  fetchAvailableTruck,
  fetchDriver,
  fetchTripById,
  fetchTruck,
  updateTrip,
} from "@/service/fleet";
import OtherLoad from "./OtherLoad";
import OwnLoadEdit from "./OwnLoadEdit";
import ThirdPartyEdit from "./ThirdPartyEdit";
import EditTripSummary from "./EditTripSummary";
import { useForm } from "react-hook-form";
import EditContainerDetails from "./EditContainerDetails";
import EditInsuranceDetails from "./EditInsuranceDetails";
import EditRelatedDocuments from "./EditRelatedDocuments";
import { Button } from "@/components/ui/button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { set } from "date-fns";
import { useRouter } from "next/navigation";


export default function EditTrip() {
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
      from: "",
      to: "",
      kilometer: 0,
      startDate: "",
      endDate: "",
      driver: "",
      driverName: "",
      vehicle: "",
      vehicleName: "",
      shippingFrom: "",
      description: "",
      HSMCode: "",
      purpose: "",
      cargo_temp: "",
      transit: "",
      startingKilometer: "",
    },
    mode: "onChange",
  });

  const [travelfile, setTravelFile] = useState(null);
  const [otherfile, setOtherFile] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [truck, setTruck] = useState([]);
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();


  // Watch all form values
  const watchAll = watch();
  const searchParams = useSearchParams();
  const id = Number(searchParams.get("id"));

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const trip = await fetchTripById(id);
        console.log("edit trip : ", trip);
        setTrip(trip || null);

        const formatToDDMMYYYY = (date) => {
          if (!date || date === "0001-01-01T00:00:00Z") return "";
          const d = new Date(date);
          if (isNaN(d.getTime())) return "";
          const day = String(d.getDate()).padStart(2, "0");
          const month = String(d.getMonth() + 1).padStart(2, "0");
          const year = d.getFullYear();
          return `${day}/${month}/${year}`;
        };

        if (trip) {
          setValue("tripType", trip.trip_type || "self");
          setValue("selfType", trip.self_type || "own-load");
          setValue("from", trip.loading_point || "");
          setValue("to", trip.unloading_point || "");
          setValue("kilometer", trip.total_kilometer || 0);
          setValue("startingKilometer", trip.kilometer || "");
          setValue(
            "transit",
            Array.isArray(trip.in_transit)
              ? trip.in_transit.join(",")
              : typeof trip.in_transit === "string"
              ? trip.in_transit
              : ""
          );
          setValue("shippingFrom", trip.shippingFrom || "");
          setValue("description", trip.description || "");
          setValue("product", trip.carry_product || "");
          setValue("loading_date", formatToDDMMYYYY(trip.loading_date));
          setValue("unloading_date", formatToDDMMYYYY(trip.unloading_date));
          setValue("HSMCode", trip.hsm_code || "");
          setValue("purpose", trip.purpose || "");
          setValue("cargo_temp", trip.cargo_temp || "");
          setValue("source_type", trip.source_type);
          
          const formatDate = (date) => {
            if (!date) return "";
            const d = new Date(date);
            return d.toISOString().split("T")[0];
          };
          setValue("startDate", formatDate(trip.startDate));
          setValue("endDate", formatDate(trip.endDate));

          setValue("driver", trip.driverid?.id?.toString() || "");
          setValue("vehicle", trip.truckid?.id?.toString() || "");
          setValue("driverName", trip.driverid?.full_name || "");
          setValue("vehicleName", trip.truckid?.vehicle_name || "");
          setValue("purpose_of_use", trip.purpose_of_use);

          setValue("container_number", trip.container_number);
          setValue("do_validate", trip.do_validate);
          setValue("godown_in", trip.godown_in);
          setValue("number_of_days", trip.number_of_days);

          setValue("branch", trip.branch);
          setValue("diesel_amount", trip.diesel_amount);
          setValue("customer_name", trip.customer_name);
          setValue("freight", trip.freight);
          setValue("client", trip.client);
          setValue("commission", trip.commission);
          setValue("commodity", trip.commodity);
          setValue("committed_rate", trip.committed_rate);
          setValue("qty", trip.qty);
          setValue("trip_sheet_no", trip.trip_sheet_no);
          setValue("halting", trip.halting);

          setValue("advance_received", trip.advance_received);
          setValue("advance_received_date", trip.advance_received_date);
          setValue("is_advance_paid", trip.is_advance_paid);
          setValue("balance_payable", trip.balance_payable);

          setValue("insurance_policy_no", trip.insurance_policy_no);
          setValue("insurance_premium_amount", trip.insurance_premium_amount);
          setValue("insurance_owner_name", trip.insurance_owner_name);
          setValue("insurance_invoice_date", trip.insurance_invoice_date);
          setValue("insurance_invoice_number", trip.insurance_invoice_number);

          if (trip.insurence_file) {
            setTravelFile({
              name:
                trip.insurence_file_name ||
                trip.insurence_file.split("/").pop() ||
                "Travel Insurance Document",
            });
          }
          if (trip.other_file) {
            setOtherFile({
              name:
                trip.other_file_name ||
                trip.other_file.split("/").pop() ||
                "Other Document",
            });
            setValue("documentTitle", trip.other_file_category || "");
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch trip:", error);
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [id, setValue]);

  useEffect(() => {
    const getDrivers = async () => {
      try {
        const data = await fetchAllDriver();
        setDrivers(data || []);
      } catch (err) {
        console.error("Failed to fetch drivers:", err);
      }
    };

    const getTrucks = async () => {
      try {
        const data = await fetchAvailableTruck();
        setTruck(data || []);
        console.log("data : ", data);
      } catch (err) {
        console.error("Failed to fetch trucks:", err);
      }
    };

    getDrivers();
    getTrucks();
  }, []);

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

  const parseDate = (dateValue, fieldName) => {
    if (!dateValue) {
      console.warn(`Field ${fieldName} is empty or undefined`);
      return "";
    }

    // Handle DD/MM/YYYY format
    const dateParts = dateValue.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (dateParts) {
      const [_, day, month, year] = dateParts;
      const date = new Date(`${year}-${month}-${day}T00:00:00Z`);
      if (isNaN(date.getTime())) {
        console.error(`Invalid date for ${fieldName}: ${dateValue}`);
        return "";
      }
      return date.toISOString();
    }

    // Fallback for other formats
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) {
      console.error(`Invalid date for ${fieldName}: ${dateValue}`);
      return "";
    }
    return date.toISOString();
  };

  // FIXED: Proper form submission handler
  const onSubmit = async (data) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      console.log("Submitting data:", data);

      // Map form fields to backend-expected keys
      const tripTitle = `${data.from || ""} to ${data.to || ""}`;

      formData.append("id", Number(trip.id));
      formData.append("trip_type", data.tripType);
      formData.append("trip_title", tripTitle);
      formData.append("self_type", data.selfType);
      formData.append("loading_point", data.from);
      formData.append("unloading_point", data.to);
      formData.append("total_km", Number(data.kilometer));
      formData.append("km", Number(data.startingKilometer));
      formData.append("in_transit", data.transit || "");
      formData.append("shippingFrom", data.shippingFrom || "");
      formData.append("description", data.description || "");
      formData.append("carry_product", data.product || "");
      formData.append(
        "loading_date",
        parseDate(data.loading_date, "loading_date")
      );
      formData.append(
        "unloading_date",
        parseDate(data.unloading_date, "unloading_date")
      );
      formData.append("hsmcode", data.HSMCode || "");
      formData.append("purpose", data.purpose || "");
      formData.append("cargo_temp", data.cargo_temp || "");
      formData.append("source_type", data.source_type || "");
      formData.append(
        "startDate",
        data.startDate ? parseDate(data.startDate, "startDate") : ""
      );
      formData.append(
        "endDate",
        data.endDate ? parseDate(data.endDate, "endDate") : ""
      );
      formData.append("driverid", Number(data.driver));
      formData.append("truckid", Number(data.vehicle));
      formData.append("purpose_of_use", data.purpose_of_use || "");
      formData.append("container_number", data.container_number || "");
      formData.append("no_of_days", data.number_of_days || "");
      formData.append("branch", data.branch || "");
      formData.append("halting", data.halting);
      formData.append("diesel_amount", Number(data.diesel_amount));
      formData.append("customer_name", data.customer_name || "");
      formData.append("freight", Number(data.freight));
      formData.append("commission", Number(data.commission));
      formData.append("trip_sheet_no", data.trip_sheet_no || "");

      formData.append("insurance_policy_number", data.insurance_policy_no);
      formData.append(
        "insurance_invoice_date",
        data.insurance_invoice_date
          ? parseDate(data.insurance_invoice_date, "insurance_invoice_date")
          : ""
      );
      formData.append(
        "insurance_premium_amount",
        Number(data.insurance_premium_amount)
      );
      formData.append("insurance_owner_name", data.insurance_owner_name || "");
      formData.append(
        "insurance_invoice_number",
        data.insurance_invoice_number || ""
      );

      // Add file data
      if (travelfile && travelfile instanceof File) {
        formData.append("insurance_file", travelfile);
      }

      if (otherfile && otherfile instanceof File) {
        formData.append("other_file", otherfile);
        formData.append("Otherfile_category", data.documentTitle || "");
      }

      console.log("FormData entries:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await updateTrip(formData);
      console.log("Update response:", response);
      toast.success("Trip updated successfully!");
      setTimeout(() => {
  router.back(); // Go back to the previous page
}, 1500);
    } catch (error) {
      console.error(
        "Update trip error:",
        error.response?.data || error.message
      );
      toast.error("Failed to update trip. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderComponent = () => {
    if (!trip) return null;

    if (trip.trip_type === "self" && trip.self_type === "other-load") {
      return (
        <OtherLoad
          trip={trip}
          register={register}
          watch={watch}
          setValue={setValue}
        />
      );
    }

    if (trip.trip_type === "self" && trip.self_type === "own-load") {
      return (
        <OwnLoadEdit register={register} watch={watch} setValue={setValue} />
      );
    }

    return (
      <ThirdPartyEdit
        trip={trip}
        register={register}
        watch={watch}
        setValue={setValue}
      />
    );
  };

  return (
    <div>
      <Header />
      <ToastContainer />
      {loading ? (
        <p className="text-black">Loading trip details...</p>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)} // FIXED: Simplified form submission
          className="pt-5 flex flex-col gap-y-7"
        >
          <div>
            <p className="text-black font-medium text-sm">
              Trip Update - {trip.trip_title} (
              {trip?.trip_type === "self" && trip?.self_type === "other-load"
                ? "Other Load"
                : trip?.trip_type === "self" && trip?.self_type === "own-load"
                ? "Own Load"
                : "Third Party"}
              )
            </p>
          </div>

          <div className="bg-white rounded-lg px-10 py-5">
            <div>
              <EditTripSummary
                from={watchAll.from}
                to={watchAll.to}
                kilometer={watchAll.kilometer}
                driver={watchAll.driver}
                register={register}
                control={control}
                driverName={watchAll.driverName}
                drivers={drivers}
                vehicle={watchAll.vehicle}
                truck={truck}
                vehicleName={watchAll.vehicleName}
                loading_date={watchAll.loading_date}
                unloading_date={watchAll.unloading_date}
                product={watchAll.product}
                source_type={watchAll.source_type}
                watch={watch}
                setValue={setValue}
                trip={trip}
              />
            </div>
            {watchAll.source_type === "port" && (
              <div className="border-t mt-5 pt-5">
                <p className="text-black text-sm font-medium">
                  Container Details
                </p>
                <EditContainerDetails
                  register={register}
                  watch={watch}
                  setValue={setValue}
                  trip={trip}
                />
              </div>
            )}

            <div className="border-t mt-5 pt-5">
              <p className="text-black text-sm font-medium">Other Details</p>
              {renderComponent()}
            </div>

            <div className="border-t mt-5 pt-5">
              <p className="text-black text-sm font-medium">
                Insurance Details
              </p>
              <EditInsuranceDetails
                insurance_invoice_date={watchAll.insurance_invoice_date}
                register={register}
                watch={watch}
                setValue={setValue}
                trip={trip}
              />
            </div>

            <div className="border-t mt-5 pt-5">
              <div className="w-full flex justify-between">
                <p className="text-black text-sm font-medium">
                  Related Documents
                </p>
              </div>
              <EditRelatedDocuments
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
              type="submit"
              className="bg-black text-white font-normal px-5"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Trip"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
