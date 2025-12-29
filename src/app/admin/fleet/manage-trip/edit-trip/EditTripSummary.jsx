"use client";
import { components } from "react-select";
import { useEffect, useState } from "react";
import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import MultiSelect from "react-select";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { fetchDriver, fetchStop, createStop, deleteStopById } from "@/service/fleet";
import ProductDialog from "@/app/admin/procurement/create-purchase-order/VarietyDialog";
import { fetchVarity } from "@/service/procurements";
import { toast } from "react-toastify";

function EditTripSummary({
  from,
  to,
  kilometer,
  source_type,
  unloading_date,
  driver,
  driverName,
  vehicleName,
  register,
  product,
  loading_date,
  watch,
  setValue,
  control,
  trip,
  drivers,
  truck,
  vehicle,
}) {
  const driverId = driver ? Number(driver) : null;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [stops, setStops] = useState([]);
  const [showStopInput, setShowStopInput] = useState(false);
  const [newStop, setNewStop] = useState("");

  // console.log("source_type : ", source_type);
  // console.log("driver : ",driver)
  //   console.log("driverName : ",driverName)
  //   console.log("drivers : ",drivers)

  //console.log("truck : ", truck);
  //console.log("vehicle : ", vehicle);

  //console.log("shippingFrom : ",watch("shippingFrom"))

  //   const driverName = useMemo(() => {
  //     const foundDriver = drivers.find((d) => d.id === driverId);
  //     return foundDriver ? foundDriver.full_name : "Select Driver";
  //   }, [driverId, drivers]);

  //   const truckId = vehicle ? Number(vehicle) : null;
  //   const truckName = useMemo(() => {
  //     const foundTruck = truck.find((d) => d.id === truckId);
  //     return foundTruck ? foundTruck.vehicle_name : "Select Vehicle";
  //   }, [truckId, truck]);

  const dropdownProducts = useMemo(() => {
    const tripProduct = trip?.carry_product
      ? {
          name: trip.carry_product,
          HSMCode: trip.hsm_code || "",
        }
      : null;

    // Filter out the trip product from allProducts to avoid duplicates
    const availableProducts = allProducts.filter(
      (p) => p.name !== tripProduct?.name
    );

    // Include trip product (if exists) followed by available products
    return tripProduct
      ? [tripProduct, ...availableProducts]
      : availableProducts;
  }, [allProducts, trip]);

  useEffect(() => {
    fetchAllProducts();
    fetchStops();
  }, []);

  const handleAddStop = async () => {
    try {
      if (!newStop.trim()) {
        toast.error("Stop name cannot be empty");
        return;
      }
      const response = await createStop({ stop_name: newStop });
      // Use the stop name directly from the input
      const newStopName = newStop.trim();
      // Get current transit value from the form
      const currentTransit = watch("transit") || "";
      const updatedTransit = currentTransit
        ? `${currentTransit},${newStopName}`
        : newStopName;
      setValue("transit", updatedTransit);
      setNewStop("");
      setShowStopInput(false);
      await fetchStops();
      toast.success("Stop added successfully");
    } catch (err) {
      console.error("Add stop error", err);
      toast.error(err.message || "Failed to add stop");
    }
  };

  const fetchStops = async () => {
    try {
      const stopsData = await fetchStop();
      setStops(stopsData || []);
    } catch (err) {
      console.error("Stops fetch error:", err);
      toast.error("Failed to fetch stops");
    }
  };

  const handleSelectChange = (val) => {
    if (val === "add_new") {
      setIsDialogOpen(true);
    } else {
      const selectedProduct = dropdownProducts.find((p) => p.name === val);
      if (selectedProduct) {
        setValue("product", selectedProduct.name);
        setValue("HSMCode", selectedProduct.hsm_code || "");
      }
    }
  };

  const fetchAllProducts = async () => {
    try {
      const res = await fetchVarity();
      console.log("products : ", res.data);
      setAllProducts(res?.data || []);
    } catch (err) {
      console.error("Product fetch error", err);
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
    if (trip) {
      const sourceType = trip.source_type ? trip.source_type.toLowerCase() : "";
      const validSourceType =
        sourceType === "warehouse" || sourceType === "port"
          ? sourceType
          : "warehouse";
      setValue("source_type", validSourceType);
    }
  }, [trip, setValue]);

  return (
    <div className="w-full flex gap-x-7 pt-5">
      <div className="w-[23%]">
        <div className="border border-dashed overflow-hidden border-neutral-400 h-52 p-3">
          <div className="w-full overflow-x-auto">
            <div className="w-full flex items-center gap-x-3">
              <p className="text-black font-medium text-lg">{from}</p>
              <img src="/2way-arrow.svg" className="h-3" />
              <p className="text-black font-medium text-lg">{to}</p>
            </div>
            <div className="w-full flex items-baseline gap-x-2">
              <p className="text-black font-medium text-3xl">{kilometer}</p>
              <p className="text-sm text-neutral-400">KM</p>
            </div>
            <div className="w-full flex gap-x-2 text-xs text-neutral-400">
              <p>{loading_date}</p>
              <p>--</p>
              <p>{unloading_date}</p>
            </div>
            <div className="flex flex-col gap-y-2 mt-2">
              <div className="bg-neutral-200 rounded-md flex items-center py-1 gap-x-2">
                <div className="bg-rose-500 rounded-r-lg w-1 h-6"></div>
                <div>
                  <p className="text-xs font-medium text-black">{driverName}</p>
                  <p className="text-[10px] text-neutral-400">Driver</p>
                </div>
              </div>
              <div className="bg-neutral-200 rounded-md flex items-center py-1 gap-x-2">
                <div className="bg-rose-500 rounded-r-lg w-1 h-6"></div>
                <div>
                  <p className="text-xs font-medium text-black">
                    {vehicleName}
                  </p>
                  <p className="text-[10px] text-neutral-400">Vehicle</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div>
            <p className="text-[13px] ps-5 pb-1 text-black">Trip distance</p>
            <Input
              {...register("kilometer")}
              type="number"
              placeholder="Enter kilometer"
              className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <div className="mt-3">
            <p className="text-[13px] ps-5 pb-1 text-black">
              Odometer Kilometer
            </p>
            <Input
              {...register("startingKilometer")}
              type="number"
              placeholder="Enter kilometer"
              className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>
      </div>
      <div>
        <div className="w-5 h-5 rounded-full border border-neutral-400 flex justify-center items-center">
          <div className="bg-black h-2 w-2 rounded-full"></div>
        </div>
        <div className="h-16 flex justify-center py-2">
          <div className="h-12 w-1 ms-[2.375px] border-l border-dashed border-neutral-400"></div>
        </div>
        <div className="w-5 h-5 rounded-full border border-neutral-400 flex justify-center items-center">
          <div className="bg-black h-2 w-2 rounded-full"></div>
        </div>
        <div className="h-16 flex flex-col items-center py-2">
          <div className="h-12 w-1 ms-[2.375px] border-l border-dashed border-neutral-400"></div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="18px"
            viewBox="0 -960 960 960"
            width="18px"
            className="fill-neutral-400"
          >
            <path d="M440-800v487L216-537l-56 57 320 320 320-320-56-57-224 224v-487h-80Z" />
          </svg>
        </div>
        <div className="flex justify-center items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            className="fill-neutral-400"
          >
            <path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z" />
          </svg>
        </div>
      </div>
      <div className="flex-1">
        <div className="grid grid-cols-3 gap-x-7 gap-y-3">
          <div>
            <p className="text-[13px] ps-5 text-black">From (loading point)</p>
            <Input
              {...register("from")}
              placeholder="Search..."
              required
              className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          <div>
            <Controller
              name="driver"
              control={control}
              rules={{ required: "Driver is required" }}
              render={({ field, fieldState: { error } }) => {
                const selectedDriver = drivers?.find(
                  (d) => d.id === Number(field.value)
                );

                // console.log({
                //   fieldValue: field.value,
                //   driverId,
                //   selectedDriver,
                //   drivers,
                // });

                return (
                  <div>
                    <p className="text-[13px] ps-5 pb-1 text-black">Driver</p>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value?.toString() || ""}
                      className="border-neutral-400 rounded-lg text-xs mt-1"
                    >
                      <SelectTrigger className="text-black">
                        <SelectValue placeholder="Select driver">
                          {selectedDriver
                            ? selectedDriver.full_name
                            : "Select driver"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="text-black bg-white">
                        {drivers.map((driver) => (
                          <SelectItem
                            key={driver.id}
                            value={String(driver.id)}
                            className={
                              driver.id === driverId
                                ? "bg-blue-100 hover:bg-blue-200"
                                : "bg-white hover:bg-gray-100"
                            }
                          >
                            {driver.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {error && (
                      <p className="text-red-500 text-xs mt-1">
                        {error.message}
                      </p>
                    )}
                  </div>
                );
              }}
            />
          </div>

          <div>
            <Controller
              name="vehicle"
              control={control}
              rules={{ required: "Vehicle is required" }}
              render={({ field, fieldState: { error } }) => {
                const selectedTruck = truck?.find(
                  (d) => d.id === Number(field.value)
                );

                // console.log({
                //   fieldValue: field.value,
                //   vehicleProp: vehicle,
                //   selectedTruck,
                //   truck,
                // });

                return (
                  <div>
                    <p className="text-[13px] ps-5 pb-1 text-black">Vehicle</p>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value ? String(field.value) : ""}
                      className="border-neutral-400 rounded-lg text-xs mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    >
                      <SelectTrigger className="text-black">
                        <SelectValue placeholder="Select vehicle">
                          {selectedTruck
                            ? selectedTruck.register_number ||
                              selectedTruck.register_number ||
                              "Unnamed Vehicle"
                            : field.value
                            ? `Vehicle ID ${field.value} not found`
                            : "Select vehicle"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="text-black bg-white">
                        {truck?.length > 0 ? (
                          truck.map((vehicle) => (
                            <SelectItem
                              key={vehicle.id}
                              value={String(vehicle.id)}
                              className={
                                Number(field.value) === vehicle.id
                                  ? "bg-blue-100 hover:bg-blue-200"
                                  : "bg-white hover:bg-gray-100"
                              }
                            >
                              {vehicle.register_number ||
                                vehicle.register_number ||
                                "Unnamed Vehicle"}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-trucks" disabled>
                            No vehicles available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {error && (
                      <p className="text-red-500 text-xs mt-1">
                        {error.message}
                      </p>
                    )}
                    {!error && field.value && !selectedTruck && (
                      <p className="text-yellow-500 text-xs mt-1">
                        Warning: Selected vehicle not found in available trucks
                      </p>
                    )}
                  </div>
                );
              }}
            />
          </div>

          {/* <div>
            <p className="text-[13px] ps-5 text-black">Driver</p>
            <Input
              {...register("driverName")}
              //placeholder="Search..."
              readOnly
              className="border-neutral-400 bg-blue-50 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 cursor-not-allowed"
            />
          </div>
          <div>
            <p className="text-[13px] ps-5 text-black">vehicle</p>
            <Input
              {...register("vehicleName")}
              //placeholder="Search..."
              readOnly
              className="border-neutral-400 bg-blue-50 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 cursor-not-allowed"
            />
          </div> */}

          <div>
            <p className="text-[13px] ps-5 pb-1 text-black">
              In Transit (optional)
            </p>
            <Controller
              name="transit"
              control={control}
              render={({ field }) => (
                <div>
                  <MultiSelect
                    isMulti
                    options={[
                      { value: "__add_new_stop__", label: "+ Add New Stop" },
                      ...stops.map((stop) => ({
                        value: stop.stop_name,
                        label: stop.stop_name,
                        id: stop.id, // Include stop ID for deletion
                      })),
                    ]}
                    value={
                      field.value
                        ? field.value.split(",").map((name) => ({
                            value: name.trim(),
                            label: name.trim(),
                            id: stops.find(
                              (stop) => stop.stop_name === name.trim()
                            )?.id, // Map ID to selected value
                          }))
                        : []
                    }
                    onChange={(selectedOptions) => {
                      const selectedValues = selectedOptions.map(
                        (option) => option.value
                      );
                      if (selectedValues.includes("__add_new_stop__")) {
                        setShowStopInput(true);
                        const filteredValues = selectedValues.filter(
                          (value) => value !== "__add_new_stop__"
                        );
                        field.onChange(filteredValues.join(","));
                      } else {
                        field.onChange(selectedValues.join(","));
                      }
                    }}
                    placeholder="Select transit stops..."
                    className="border-neutral-400 text-black text-xs rounded-lg mt-1 uppercase"
                    classNamePrefix="react-select"
                    components={{
                      Option: ({ children, data, ...props }) => {
                        // Don't show delete icon for "Add New Stop" option
                        if (data.value === "__add_new_stop__") {
                          return (
                            <components.Option {...props}>
                              {children}
                            </components.Option>
                          );
                        }

                        const handleDelete = async (e) => {
                          e.stopPropagation();
                          try {
                            await deleteStopById(data.id); // Call API to delete stop
                            // Update stops list after deletion
                            setStops(
                              stops.filter((stop) => stop.id !== data.id)
                            );
                            toast.success("Stop deleted successfully");
                            // Remove from selected values
                            const newValues = field.value
                              .split(",")
                              .filter((name) => name.trim() !== data.value)
                              .join(",");
                            field.onChange(newValues);
                          } catch (error) {
                            console.error("Failed to delete stop:", error);
                            // Optionally show error notification to user
                          }
                        };

                        return (
                          <components.Option {...props}>
                            <div className="flex items-center justify-between">
                              <span>{children}</span>
                              <button
                                onClick={handleDelete}
                                className="text-red-500 hover:text-red-700"
                                title="Delete stop"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  height="24px"
                                  viewBox="0 -960 960 960"
                                  width="24px"
                                  className="fill-red-400"
                                >
                                  <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                                </svg>
                              </button>
                            </div>
                          </components.Option>
                        );
                      },
                    }}
                  />
                  {showStopInput && (
                    <div className="flex gap-2 items-center mt-2">
                      <Input
                        type="text"
                        value={newStop}
                        onChange={(e) => setNewStop(e.target.value)}
                        placeholder="Enter new stop"
                        className="text-sm text-black"
                      />
                      <Button
                        type="button"
                        className="bg-black text-white"
                        onClick={handleAddStop}
                      >
                        Add
                      </Button>
                    </div>
                  )}
                </div>
              )}
            />
          </div>

          <div className="flex items-center">
            <div className="flex gap-x-6">
              <label className="flex items-center text-xs text-black">
                <input
                  type="radio"
                  value="port"
                  required
                  {...register("source_type", { required: true })}
                  checked={watch("source_type") === "port"}
                  onChange={() => setValue("source_type", "port")}
                  className="accent-black mr-2"
                />
                From Port
              </label>
              <label className="flex items-center text-xs text-black">
                <input
                  type="radio"
                  value="warehouse"
                  {...register("source_type", { required: true })}
                  checked={watch("source_type") === "warehouse"}
                  onChange={() => setValue("source_type", "warehouse")}
                  className="accent-black mr-2"
                />
                From Warehouse
              </label>
            </div>
          </div>

          <div className="">
            <p className="text-[13px] ps-5 pb-1 text-black">Description</p>
            <Input
              {...register("description")}
              placeholder="Enter description"
              required
              className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          <div>
            <p className="text-[13px] ps-5 text-black">To (unloading point)</p>
            <Input
              {...register("to")}
              placeholder="Search..."
              required
              className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          <div>
            <p className="text-[13px] text-black ps-5 pb-1">Product</p>
            {dropdownProducts && dropdownProducts.length > 0 ? (
              <Select
                onValueChange={handleSelectChange}
                value={watch("product") || ""}
                className="text-black"
              >
                <SelectTrigger className="text-black">
                  <SelectValue placeholder="Select Product">
                    {product
                      ? product
                      : trip?.carry_product
                      ? trip.carry_product
                      : "Select Product"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="text-black bg-white">
                  <SelectItem
                    value="add_new"
                    className="text-blue-600 font-semibold"
                  >
                    + Add New Product
                  </SelectItem>
                  {dropdownProducts.map((prod) => (
                    <SelectItem
                      key={prod.id || prod.name}
                      value={prod.name}
                      className={
                        prod.name === trip?.carry_product
                          ? "bg-blue-100 hover:bg-blue-200"
                          : "bg-white hover:bg-gray-100"
                      }
                    >
                      {prod.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm text-gray-500 mt-1 ps-1">
                {allProducts === null
                  ? "Loading products..."
                  : "No products available"}
              </p>
            )}
          </div>

          <div>
            <p className="text-[13px] ps-5 text-black">HSN code</p>
            <Input
              {...register("HSMCode")}
              readOnly
              className="border-neutral-400 bg-blue-50 text-neutral-600 placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 cursor-not-allowed"
            />
          </div>

          <div>
            <p className="text-[13px] ps-5 pb-1 text-black">Purpose of use</p>
            <Input
              {...register("purpose_of_use")}
              placeholder="Enter the purpose"
              required
              className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          <div className="">
            <div className="flex relative">
              <p className="text-[13px] ps-5 pb-1 text-black">Cargo Temp</p>
              <span className="absolute left-[43%] -top-1 text-xs text-black">
                °
              </span>
              <span className="text-[13px] ps-2 pb-1 text-black">C</span>
            </div>
            <Input
              {...register("cargo_temp")}
              type="number"
              placeholder="Enter temp"
              className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          <div>
            <p className="text-[13px] ps-5 pb-1 text-black">Loading date</p>
            <div className="relative w-full">
              <Input
                {...register("loading_date")}
                id="loading_date"
                type="date"
                required
                value={formatToYYYYMMDD(loading_date) || ""}
                onChange={(e) => {
                  const date = e.target.value;
                  if (date) {
                    const [year, month, day] = date.split("-");
                    setValue("loading_date", `${day}/${month}/${year}`);
                  } else {
                    setValue("loading_date", "");
                  }
                }}
                className="border-neutral-400 text-black placeholder:text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none pr-10 
                  [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  const loadingDateInput =
                    document.getElementById("loading_date");
                  if (loadingDateInput) {
                    loadingDateInput.showPicker();
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
            <p className="text-[13px] ps-5 pb-1 text-black">Unloading date</p>
            <div className="relative w-full">
              <Input
                {...register("unloading_date")}
                id="unloading_date"
                type="date"
                required
                value={formatToYYYYMMDD(unloading_date) || ""}
                onChange={(e) => {
                  const date = e.target.value;
                  if (date) {
                    const [year, month, day] = date.split("-");
                    setValue("unloading_date", `${day}/${month}/${year}`);
                  } else {
                    setValue("unloading_date", "");
                  }
                }}
                className="border-neutral-400 text-black placeholder:text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none pr-10 
                    [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  const unloading_date =
                    document.getElementById("unloading_date");
                  if (unloading_date) {
                    unloading_date.showPicker();
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
        </div>
        <ProductDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      </div>
    </div>
  );
}

export default EditTripSummary;
