import { useEffect, useState } from "react";
import { components } from "react-select";
import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Controller } from "react-hook-form";
import MultiSelect from "react-select";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  createStop,
  deleteStopById,
  fetchDriver,
  fetchStop,
} from "@/service/fleet";
import ProductDialog from "@/app/admin/procurement/create-purchase-order/VarietyDialog";
import {
  fetchVarity,
  getAllProducts,
  createProduct,
  fetchVarityByProductId,
} from "@/service/procurements";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VarityOpenDialogue from "./VarityOpenDialogue";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function TripSummary({
  from,
  to,
  kilometer,
  startDate,
  endDate,
  driver,
  vehicle,
  register,
  control,
  drivers,
  truck,
  watch,
  setValue,
}) {
  const driverId = driver ? Number(driver) : null;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [allVariety, setAllVariety] = useState([]);
  const [stops, setStops] = useState([]);
  const [products, setProducts] = useState([]);
  const [showProductInput, setShowProductInput] = useState(false);
  const [newProduct, setNewProduct] = useState("");
  const [showStopInput, setShowStopInput] = useState(false);
  const [newStop, setNewStop] = useState("");

  
  const selectedProduct = watch("product");

  const driverName = useMemo(() => {
    const foundDriver = drivers.find((d) => d.id === driverId);
    return foundDriver ? foundDriver.full_name : "Select Driver";
  }, [driverId, drivers]);

  const truckId = vehicle ? Number(vehicle) : null;
  const truckName = useMemo(() => {
    const foundTruck = truck.find((d) => d.id === truckId);
    return foundTruck ? foundTruck.register_number : "Select Vehicle";
  }, [truckId, truck]);

  useEffect(() => {
    fetchAllVariety();
    fetchProducts();
    fetchStops();
  }, []);

  const fetchStops = async () => {
    try {
      const stopsData = await fetchStop();
      console.log("stopsData : ", stopsData);
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
      const selectedProduct = allVariety.find((p) => p.id === Number(val));
      if (selectedProduct) {
        setValue("variety", selectedProduct.id);
        setValue("HSMCode", selectedProduct.hsm_code);
      }
    }
  };

  const fetchAllVariety = async () => {
    try {
      const res = await fetchVarity();
      console.log("variety : ", res);
      const varietyList = res || [];

      const validVarieties = varietyList.filter(
        (variety) => variety.name && variety.name.trim() !== ""
      );

      if (validVarieties.length !== varietyList.length) {
        console.warn(
          "Filtered out invalid varieties:",
          varietyList.filter(
            (variety) => !variety.name || variety.name.trim() === ""
          )
        );
      }

      setAllVariety(validVarieties);
    } catch (err) {
      console.error("variety fetch error", err);
    }
  };

  const handleProductChange = async (productName) => {
    try {
      const selectedProduct = products.find(
        (p) => p.product_name === productName
      );
      if (!selectedProduct) {
        console.warn("Selected product not found:", productName);
        setAllVariety([]);
        setValue("variety", "");
        setValue("HSMCode", "");
        return;
      }

      const response = await fetchVarityByProductId(selectedProduct.id);
      console.log("fetchVarityByProductId response:", response);

      const varieties = Array.isArray(response)
        ? response
        : response?.data || [];

      const validVarieties = varieties.filter(
        (variety) => variety?.name && variety.name.trim() !== ""
      );

      setAllVariety(validVarieties);
      setValue("variety", "");
      setValue("HSMCode", "");
    } catch (err) {
      console.error("Error fetching varieties for product:", err);
      toast.error("Failed to load varieties for the selected product");
      setAllVariety([]);
      setValue("variety", "");
      setValue("HSMCode", "");
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await getAllProducts();
      console.log("Parent products:", res.data);
      setProducts(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err.response?.data || err.message);
      toast.error("Failed to fetch products. Please try again.");
    }
  };

  const handleAddProduct = async () => {
    try {
      if (!newProduct.trim()) {
        toast.error("Product name cannot be empty");
        return;
      }
      await createProduct({ product_name: newProduct });
      setValue("product", "");
      setNewProduct("");
      setShowProductInput(false);
      await fetchProducts();
      toast.success("Product added successfully");
      setIsDialogOpen(true);
    } catch (err) {
      console.error("Add product error", err);
      toast.error("Failed to add product");
    }
  };

  const handleAddStop = async () => {
    try {
      if (!newStop.trim()) {
        toast.error("Stop name cannot be empty");
        return;
      }
      await createStop({ stop_name: newStop });
      const currentTransit = watch("transit") || "";
      const updatedTransit = currentTransit
        ? `${currentTransit},${newStop}`
        : newStop;
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

  const handleVarietyAdded = async (newVariety) => {
    console.log("handleVarietyAdded called with newVariety:", newVariety);
    try {
      if (newVariety && newVariety.data) {
        const varietyData = newVariety.data;
        setAllVariety((prev) => [...prev, varietyData]);
        setValue("variety", varietyData.id);
        setValue("HSMCode", varietyData.hsm_code);
      }

      setIsDialogOpen(false);

      setTimeout(() => {
        fetchAllVariety();
      }, 1000);

      toast.success("Variety added and selected successfully");
    } catch (err) {
      console.error("Error in handleVarietyAdded:", err);
      toast.error("Failed to refresh varieties");
      setIsDialogOpen(false);
    }
  };

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
              <p>{startDate}</p>
              <p>--</p>
              <p>{endDate}</p>
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
                  <p className="text-xs font-medium text-black">{truckName}</p>
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
                return (
                  <div>
                    <p className="text-[13px] ps-5 pb-1 text-black">Driver</p>
                    {drivers && drivers.length > 0 ? (
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
                          {drivers
                            .filter(
                              (driver) =>
                                driver.id && driver.id.toString().trim() !== ""
                            )
                            .map((driver) => (
                              <SelectItem
                                key={driver.id}
                                value={String(driver.id)}
                              >
                                {driver.full_name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-sm text-gray-500 mt-1 ps-1">
                        No drivers are currently available.
                      </p>
                    )}
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
            <p className="text-[13px] ps-5 pb-1 text-black">Vehicle</p>
            <Controller
              name="vehicle"
              rules={{ required: "Vehicle is required" }}
              control={control}
              render={({ field, fieldState: { error } }) => {
                const selectedTruck = truck?.find(
                  (d) => d.id === Number(field.value)
                );
                return (
                  <div>
                    {truck && truck.length > 0 ? (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value?.toString() || ""}
                        className="border-neutral-400 rounded-lg text-xs mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      >
                        <SelectTrigger className="text-black">
                          <SelectValue placeholder="Select vehicle">
                            {selectedTruck
                              ? selectedTruck.register_number
                              : "Select vehicle"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="text-black bg-white">
                          {truck
                            .filter(
                              (vehicle) =>
                                vehicle.id &&
                                vehicle.id.toString().trim() !== ""
                            )
                            .map((vehicle) => (
                              <SelectItem
                                key={vehicle.id}
                                value={String(vehicle.id)}
                              >
                                {vehicle.register_number}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-sm text-gray-500 mt-1 ps-1">
                        No vehicles are currently available.
                      </p>
                    )}
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
                        id: stop.id, // Assuming each stop has an ID
                      })),
                    ]}
                    value={
                      field.value
                        ? field.value.split(",").map((name) => ({
                            value: name.trim(),
                            label: name.trim(),
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
                
                    // Custom component for rendering options with delete icon
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
                          e.stopPropagation(); // Prevent selecting the option when clicking delete
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
               

            {/* {showAllStops && (
              <ul className="mt-2 border p-2 rounded bg-gray-100 text-sm">
                {selectedStops.map((stop, index) => (
                  <li key={index} className="text-black">
                    {stop}
                  </li>
                ))}
              </ul>
            )} */}
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
                  {...register("shippingFrom", { required: true })}
                  className="accent-black mr-2"
                />
                From Port
              </label>
              <label className="flex items-center text-xs text-black">
                <input
                  type="radio"
                  value="warehouse"
                  {...register("shippingFrom", { required: true })}
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
            <p className="text-[13px] ps-5 pb-1 text-black">Product</p>
            <div className="space-y-2">
              <Controller
                name="product"
                control={control}
                rules={{ required: "Product is required" }}
                render={({ field, fieldState: { error } }) => (
                  <div>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        if (value === "__add_new__") {
                          setShowProductInput(true);
                        } else {
                          handleProductChange(value);
                        }
                      }}
                      value={field.value || ""}
                    >
                      <SelectTrigger className="text-black">
                        <SelectValue placeholder="Select Product" />
                      </SelectTrigger>
                      <SelectContent className="text-black bg-white">
                        <SelectItem
                          value="__add_new__"
                          className="text-blue-600 font-semibold"
                        >
                          + Add New Product
                        </SelectItem>
                        {Array.isArray(products) &&
                          products
                            .filter(
                              (cat) =>
                                cat.product_name &&
                                cat.product_name.trim() !== ""
                            )
                            .map((cat) => (
                              <SelectItem key={cat.id} value={cat.product_name}>
                                {cat.product_name}
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
                )}
              />
              {showProductInput && (
                <div className="flex gap-2 items-center mt-2">
                  <Input
                    type="text"
                    value={newProduct}
                    onChange={(e) => setNewProduct(e.target.value)}
                    placeholder="Enter new Product"
                    className="text-sm text-black"
                  />
                  <Button
                    type="button"
                    className="bg-black text-white"
                    onClick={handleAddProduct}
                  >
                    Add
                  </Button>
                </div>
              )}
            </div>
          </div>
          <TooltipProvider>
            <div>
              <Controller
                name="variety"
                control={control}
                rules={{ required: "Variety is required" }}
                render={({ field, fieldState: { error } }) => {
                  const selectedVariety = allVariety?.find(
                    (v) => v.id === Number(field.value)
                  );
                  return (
                    <div>
                      <p className="text-[13px] ps-5 pb-1 text-black">
                        Variety
                      </p>
                      {allVariety && allVariety.length > 0 ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Select
                              onValueChange={handleSelectChange}
                              value={field.value?.toString() || ""}
                              className="border-neutral-400 rounded-lg text-xs mt-1"
                              disabled={!selectedProduct}
                            >
                              <SelectTrigger className="text-black">
                                <SelectValue placeholder="Select variety">
                                  {selectedVariety
                                    ? selectedVariety.name
                                    : "Select variety"}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent className="text-black bg-white">
                                <SelectItem
                                  value="add_new"
                                  className="font-semibold text-blue-600"
                                >
                                  + Add New Variety
                                </SelectItem>
                                <div className="border-t border-gray-200 my-1"></div>
                                {allVariety
                                  .filter(
                                    (variety) =>
                                      variety.id &&
                                      variety.id.toString().trim() !== ""
                                  )
                                  .map((variety) => (
                                    <SelectItem
                                      key={variety.id}
                                      value={String(variety.id)}
                                    >
                                      {variety.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </TooltipTrigger>
                          {!selectedProduct && (
                            <TooltipContent
                              className="bg-gray-800 text-white text-xs rounded py-1 px-2"
                              sideOffset={5}
                            >
                              Please select a product first
                            </TooltipContent>
                          )}
                        </Tooltip>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-sm text-gray-500 mt-1 ps-1">
                            No varieties are currently available.
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setIsDialogOpen(true)}
                            className="text-xs text-blue-600 border-blue-600 hover:bg-blue-50"
                            disabled={!selectedProduct}
                          >
                            + Add New Variety
                          </Button>
                          {!selectedProduct && (
                            <p className="text-sm text-gray-500 mt-1 ps-1">
                              Please select a product to add a variety.
                            </p>
                          )}
                        </div>
                      )}
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
          </TooltipProvider>
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
              {...register("purpose")}
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
                {...register("startDate")}
                id="startDate"
                type="date"
                required
                className="border-neutral-400 text-black placeholder:text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none pr-10 
                    [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  const startDate = document.getElementById("startDate");
                  if (startDate) {
                    startDate.showPicker();
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
                {...register("endDate")}
                id="endDate"
                type="date"
                required
                className="border-neutral-400 text-black placeholder:text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none pr-10 
                    [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  const endDate = document.getElementById("endDate");
                  if (endDate) {
                    endDate.showPicker();
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
        <VarityOpenDialogue
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          selectedProduct={selectedProduct}
          onProductAdded={handleVarietyAdded}
        />
      </div>
    </div>
  );
}

export default TripSummary;
