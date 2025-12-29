"use client";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/Header";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductSelection from "./ProductSelection";
import {
  getAllProducts,
  getAllSuppliers,
  fetchCountry,
  fetchIncoTerms,
  fetchModes,
  fetchPorts,
  fetchSupplierById,
  fetchPurchaseByUIN,
  updatePurchase,
  fetchVarityByProductId,
  fetchUnits,
  updatePurchaseOrder,
} from "@/service/procurements";
import SupplierInfoUpdate from "./SupplierInfoUpdate";
import PortInfoUpdate from "./PortInfoUpdate";
import UpdateFreightTerms from "./UpdateFreightTerms";
import { Textarea } from "@/components/ui/textarea";

function UpdatePurchaseOrder({ onCancel }) {
  const router = useRouter();
  const { uin } = useParams();
  console.log("useParams output:", useParams());
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm();
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [varietiesCache, setVarietiesCache] = useState({});
  const [units, setUnits] = useState([]);
  const [countries, setCountries] = useState([]);
  const [incoTerms, setIncoTerms] = useState([]);
  const [modes, setModes] = useState([]);
  const [ports, setPorts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [purchase, setPurchase] = useState(null); // Added to store purchase data
  const [status, setStatus] = useState("");
  const [uinCode, setUinCode] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false);

  const selectedIncoTermId = watch("incoTerms");
  const watchedPartyName = watch("partyName");
  const supplierDetailsLoadedRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      console.log("fetchData called with uin:", uin);
      try {
        const [
          productsRes,
          suppliersRes,
          countriesRes,
          incoTermsRes,
          modesRes,
          portsRes,
          purchaseRes,
          unitsRes,
        ] = await Promise.all([
          getAllProducts(),
          getAllSuppliers(),
          fetchCountry(),
          fetchIncoTerms(),
          fetchModes(),
          fetchPorts(),
          fetchPurchaseByUIN(uin),
          fetchUnits(),
        ]);
        console.log("fetchPurchaseByUIN response:", purchaseRes);
        console.log("getAllSuppliers response:", suppliersRes);
        console.log("getAllProducts response:", productsRes);
        console.log("fetchUnits response:", unitsRes);

        const validSuppliers = (suppliersRes?.data?.data || []).filter(
          (supplier) =>
            supplier &&
            supplier.id &&
            supplier.party_name &&
            supplier.party_name.trim() !== ""
        );

        const purchaseData = purchaseRes?.data || {};
        setPurchase(purchaseData); // Store purchase data
        setStatus(purchaseData.status || "");
        setUinCode(purchaseData.uin_code || "");
        console.log("Purchase data:", purchaseData);
        console.log("Purchase data party_name:", purchaseData.party_name);

        // Add supplier from purchase data if not in validSuppliers
        if (
          (console.log("testing Purchase party_name:", purchaseData.party_name),
          purchaseData.party_name &&
            !validSuppliers.find(
              (s) => s.party_name === purchaseData.party_name
            ))
        ) {
          console.log(
            "Adding supplier from purchase data:",
            purchaseData.party_name
          );
          validSuppliers.push({
            id: purchaseData.id || Date.now(),
            party_name: purchaseData.party_name,
            address: purchaseData.address,
            country_name: purchaseData.country,
            zipcode: purchaseData.zipcode,
            email: purchaseData.email,
            phone: purchaseData.phone,
          });
        }
        setSuppliers(validSuppliers);
        console.log("Updated suppliers:", validSuppliers);

        // Add products from purchase.items if not in productsRes
        const validProducts = (productsRes?.data || []).filter(
          (product) =>
            product &&
            product.id &&
            product.product_name &&
            product.product_name.trim() !== ""
        );
        const purchaseProducts = purchaseData.items || [];
        purchaseProducts.forEach((item) => {
          if (
            !validProducts.find((p) => p.product_name === item.product_name)
          ) {
            console.log(
              "Adding product from purchase data:",
              item.product_name
            );
            validProducts.push({
              id: item.product_id || Date.now(),
              product_name: item.product_name,
            });
          }
        });
        setProducts(validProducts);
        console.log("Updated products:", validProducts);

        // Fetch varieties for each product in purchase.items
        const varietiesCacheTemp = {};
        for (const item of purchaseProducts) {
          if (item.product_id && item.variety_name) {
            try {
              const varietyData = await fetchVarityByProductId(item.product_id);
              const varieties = varietyData?.data || [];
              varietiesCacheTemp[item.product_id] = varieties.filter(
                (v) => v && v.id && v.name && v.name.trim() !== ""
              );
              if (!varieties.find((v) => v.name === item.variety_name)) {
                console.log(
                  "Adding variety from purchase data:",
                  item.variety_name,
                  "for product_id:",
                  item.product_id
                );
                varietiesCacheTemp[item.product_id].push({
                  id: item.variety_id || Date.now(),
                  name: item.variety_name,
                  product_id: item.product_id,
                });
              }
            } catch (error) {
              console.error(
                `Error fetching varieties for product_id ${item.product_id}:`,
                error
              );
              varietiesCacheTemp[item.product_id] = [
                {
                  id: item.variety_id || Date.now(),
                  name: item.variety_name,
                  product_id: item.product_id,
                },
              ];
            }
          }
        }
        setVarietiesCache(varietiesCacheTemp);
        console.log("Updated varietiesCache:", varietiesCacheTemp);

        // Add units from purchase.items if not in unitsRes
        const validUnits = (unitsRes?.data || []).filter(
          (unit) =>
            unit && unit.id && unit.unit_name && unit.unit_name.trim() !== ""
        );
        purchaseProducts.forEach((item) => {
          if (item.unit && !validUnits.find((u) => u.unit_name === item.unit)) {
            console.log("Adding unit from purchase data:", item.unit);
            validUnits.push({
              id: Date.now(),
              unit_name: item.unit,
            });
          }
          if (
            item.weight_unit &&
            !validUnits.find((u) => u.unit_name === item.weight_unit)
          ) {
            console.log(
              "Adding weight unit from purchase data:",
              item.weight_unit
            );
            validUnits.push({
              id: Date.now() + 1,
              unit_name: item.weight_unit,
            });
          }
        });
        setUnits(validUnits);
        console.log("Updated units:", validUnits);

        // Add ports from purchase data if not in portsRes
        const validPorts = (portsRes?.data || []).filter(
          (port) =>
            port &&
            port.id &&
            port.port_name &&
            port.country_id &&
            port.country_id.country_name
        );
        if (
          purchaseData.port_of_loading_id &&
          !validPorts.find((p) => p.id === purchaseData.port_of_loading_id.id)
        ) {
          console.log(
            "Adding port of loading from purchase data:",
            purchaseData.port_of_loading_id
          );
          validPorts.push({
            id: purchaseData.port_of_loading_id.id,
            port_name:
              purchaseData.port_of_loading_id.port_name || "Unknown Port",
            country_id: {
              id: purchaseData.port_of_loading_id.country_id?.id || 0,
              country_name:
                purchaseData.port_of_loading_id.country_id?.country_name ||
                "Unknown Country",
            },
          });
        }
        if (
          purchaseData.port_of_discharge_id &&
          !validPorts.find((p) => p.id === purchaseData.port_of_discharge_id.id)
        ) {
          console.log(
            "Adding port of discharge from purchase data:",
            purchaseData.port_of_discharge_id
          );
          validPorts.push({
            id: purchaseData.port_of_discharge_id.id,
            port_name:
              purchaseData.port_of_discharge_id.port_name || "Unknown Port",
            country_id: {
              id: purchaseData.port_of_discharge_id.country_id?.id || 0,
              country_name:
                purchaseData.port_of_discharge_id.country_id?.country_name ||
                "Unknown Country",
            },
          });
        }
        setPorts(validPorts);
        console.log("Updated ports:", validPorts);

        setCountries(countriesRes?.data || []);
        setCurrencies(countriesRes?.data || []);
        setIncoTerms(incoTermsRes?.data || []);
        setModes(modesRes?.data || []);

        // Set form values
        setValue("partyName", purchaseData.party_name || "");
        setValue("address", purchaseData.address || "");
        setValue("country", purchaseData.country || "");
        setValue("zip", purchaseData.zipcode || "");
        setValue("email", purchaseData.email || "");
        setValue("mobile", purchaseData.phone || "");
        setValue("brand", purchaseData.brand_name || "");
        setValue("incoTerms", purchaseData.incoterm_id?.id?.toString() || "");
        setValue("mode", purchaseData.mode_id?.id?.toString() || "");
        setValue("otherMode", purchaseData.other_mode || "");
        setValue("transhipment", purchaseData.transhipment || []);
        setValue("status", purchaseData.status);
        setValue("uin_code", purchaseData.uin_code || "PO");
        setValue("remark", purchaseData.remarks || "");

        if (purchaseData.party_name) {
          console.log("Setting partyName and calling handleSupplierChange");
          // Use setTimeout to ensure the setValue has been processed
          handleSupplierChange(purchaseData.party_name);
        }

        console.log("partyName value :", purchaseData.party_name);
        console.log("partyName value after setValue:", getValues("partyName"));

        const formattedProducts = purchaseProducts.map((item, index) => ({
          id: Date.now() + index,
          product: item.product_name || "",
          variety: item.variety_name || "",
          brand: purchaseData.brand_name || "",
          autoUnit: parseFloat(item.qty) || 0,
          currency: purchaseData.currency_code || "USD",
          unitPrice: parseFloat(item.unit_cost || 0).toFixed(2),
          totalAmount: (
            parseFloat(item.qty || 0) * parseFloat(item.unit_cost || 0)
          ).toFixed(2),
          specifications: [
            {
              id: Date.now() + index + 1,
              type: "quantity",
              quantity: parseFloat(item.qty || 0),
              unit: item.unit || "",
              countSize: parseFloat(item.count_or_size || 0),
            },
            ...(item.net_weight && item.weight_unit
              ? [
                  {
                    id: Date.now() + index + 2,
                    type: "weight",
                    netWeight: parseFloat(item.net_weight || 0),
                    weightUnit: item.weight_unit || "",
                  },
                ]
              : []),
          ],
        }));
        setSelectedProducts(formattedProducts);
        console.log("Formatted selected products:", formattedProducts);

        // Log form state after setting values
        console.log("Form state after setValue:", getValues());
      } catch (err) {
        console.error("Error in fetchData:", err);
        toast.error("Failed to load purchase order data.");
      }
    };
    if (uin && !dataLoaded) {
      // Only fetch if data hasn't been loaded yet
      console.log("useEffect triggered, calling fetchData with uin:", uin);
      fetchData();
    } else {
      console.log(
        "useEffect skipped: uin is undefined/empty or data already loaded"
      );
    }
  }, [uin, setValue, getValues]);

  const handleCancel = () => {
    reset();
    setSelectedProducts([]);
    onCancel?.();
    router.push("/admin/procurement");
  };

  const calculateGrandTotal = () => {
    return selectedProducts
      .reduce(
        (total, product) => total + parseFloat(product.totalAmount || 0),
        0
      )
      .toFixed(2);
  };

  const handleSupplierChange = useCallback(
    async (partyName) => {
      try {
        console.log("handleSupplierChange called with:", partyName);

        if (!partyName || !suppliers.length) {
          console.log("No partyName or suppliers available");
          return;
        }

        // Prevent duplicate calls for the same supplier
        if (supplierDetailsLoadedRef.current === partyName) {
          console.log("Supplier details already loaded for:", partyName);
          return;
        }

        const selectedSupplier = suppliers.find(
          (supplier) => supplier.party_name === partyName
        );

        if (!selectedSupplier) {
          console.log("Selected supplier not found:", partyName);
          return;
        }

        console.log("Found supplier:", selectedSupplier);

        // Mark this supplier as being processed
        supplierDetailsLoadedRef.current = partyName;

        // Try to get detailed supplier info, but fallback to existing data
        try {
          const supplierDetails = await fetchSupplierById(selectedSupplier.id);
          console.log("Supplier details from API:", supplierDetails);

          setValue(
            "mobile",
            supplierDetails.phone || selectedSupplier.phone || ""
          );
          setValue(
            "country",
            supplierDetails.country_name || selectedSupplier.country_name || ""
          );
          setValue(
            "email",
            supplierDetails.email || selectedSupplier.email || ""
          );
          setValue(
            "address",
            supplierDetails.address || selectedSupplier.address || ""
          );
          setValue(
            "zip",
            supplierDetails.zipcode || selectedSupplier.zipcode || ""
          );
          setValue(
            "partyName",
            supplierDetails.party_name || selectedSupplier.party_name || ""
          );
        } catch (apiError) {
          console.warn(
            "API call failed, using cached supplier data:",
            apiError
          );
          // Use the supplier data we already have
          setValue("mobile", selectedSupplier.phone || "");
          setValue("country", selectedSupplier.country_name || "");
          setValue("email", selectedSupplier.email || "");
          setValue("address", selectedSupplier.address || "");
          setValue("zip", selectedSupplier.zipcode || "");
          setValue("partyName", selectedSupplier.party_name || "");
        }
      } catch (err) {
        console.error("Error in handleSupplierChange:", err);
        toast.error(err.message || "Failed to load supplier details.");
      }
    },
    [suppliers, setValue]
  );

  useEffect(() => {
    if (dataLoaded && watchedPartyName && suppliers.length > 0) {
      // Only handle supplier changes after initial data load and if it's different from current
      if (supplierDetailsLoadedRef.current !== watchedPartyName) {
        console.log(
          "Handling user-triggered supplier change:",
          watchedPartyName
        );
        handleSupplierChange(watchedPartyName);
      }
    }
  }, [watchedPartyName, dataLoaded, suppliers.length]);

  const onSubmit = async (data) => {
    if (!selectedProducts || selectedProducts.length === 0) {
      toast.error("Please add at least one product before submitting.");
      return;
    }

    const requiredFields = [
      "partyName",
      "address",
      "country",
      "zip",
      "email",
      "mobile",
      "pdl",
      "pdd",
      "incoTerms",
      "mode",
    ];
    const missingFields = requiredFields.filter((field) => !data[field]);
    if (missingFields.length > 0) {
      toast.error(
        `Please fill in all required fields: ${missingFields.join(", ")}`
      );
      return;
    }

    try {
      const items = selectedProducts.map((product) => {
        const quantitySpecs =
          product.specifications?.filter((spec) => spec.type === "quantity") ||
          [];
        const weightSpecs =
          product.specifications?.filter((spec) => spec.type === "weight") ||
          [];
        const firstQuantitySpec = quantitySpecs[0] || {};
        const firstWeightSpec = weightSpecs[0] || {};

        if (
          !product.product ||
          !product.variety ||
          !firstQuantitySpec.unit ||
          !firstQuantitySpec.quantity
        ) {
          throw new Error(
            `Invalid product data for ${product.product || "unknown product"}`
          );
        }

        return {
          product_name: product.product || "",
          variety_name: product.variety || "",
          unit: firstQuantitySpec.unit || "",
          qty: firstQuantitySpec.quantity?.toString() || "0",
          count_or_size: parseFloat(firstQuantitySpec.countSize || 0),
          net_weight: parseFloat(firstWeightSpec.netWeight || 0),
          weight_unit: firstWeightSpec.weightUnit || "kg",
          unit_cost: parseFloat(product.unitPrice || 0),
        };
      });

      const payload = {
        uin: uin,
        party_name: data.partyName,
        date: new Date().toISOString(),
        address: data.address,
        country: data.country,
        zipcode: data.zip,
        email: data.email,
        phone: data.mobile,
        remarks: data.remark || "", 
        // status: "Waiting for Approval",
        status: data.status,
        uin_code: data.uin_code,
        brand_name: data.brand || "",
        port_of_loading_id: data.pol ? { id: parseInt(data.pol) } : null,
        port_of_discharge_id: data.pod ? { id: parseInt(data.pod) } : null,
        planned_date_of_load: new Date(data.pdl).toISOString(),
        planned_date_of_delivery: new Date(data.pdd).toISOString(),
        incoterm_id: { id: parseInt(data.incoTerms) },
        mode_id: { id: parseInt(data.mode) },
        other_mode: data.otherMode || "",
        items,
        amount: parseFloat(calculateGrandTotal()),
        currency_code: selectedProducts[0]?.currency || data.currency || "USD",
        transhipment: data.transhipment || [],
      };

      await updatePurchaseOrder(payload);
      toast.success("Purchase order updated successfully!");
      reset();
      setSelectedProducts([]);
      router.push("/admin/procurement");
    } catch (error) {
      console.error("Error in onSubmit:", error);
      toast.error(`Failed to update purchase order: ${error.message}`);
    }
  };

  console.log("Watched partyName in parent page :", watchedPartyName);

  return (
    <div className="">
      <Header />
      <div className="pt-5">
        <p className="text-black text-xl font-medium">Update Purchase Order</p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="pt-5 overflow-hidden"
        >
          <div className="bg-white h-[70vh] overflow-auto rounded-xl space-y-4 p-10 text-black flex flex-col gap-y-3">
            <SupplierInfoUpdate
              //key={suppliers.length}
              control={control}
              suppliers={suppliers}
              setSuppliers={setSuppliers}
              setValue={setValue}
              errors={errors}
              register={register}
              countries={countries}
              setCountries={setCountries}
              watch={watch}
              watchedPartyName={watchedPartyName}
              handleSupplierChange={handleSupplierChange}
            />
            <PortInfoUpdate
              control={control}
              ports={ports}
              setPorts={setPorts}
              setValue={setValue}
              errors={errors}
              countries={countries}
              setCountries={setCountries}
              register={register}
              purchase={purchase} // Pass purchase data
            />
            <ProductSelection
              key={products.length}
              control={control}
              watch={watch}
              setValue={setValue}
              products={products}
              setProducts={setProducts}
              varietiesCache={varietiesCache}
              setVarietiesCache={setVarietiesCache}
              units={units}
              setUnits={setUnits}
              selectedProducts={selectedProducts}
              setSelectedProducts={setSelectedProducts}
              currencies={currencies}
              register={register}
            />
            <UpdateFreightTerms
              control={control}
              incoTerms={incoTerms}
              modes={modes}
              selectedIncoTermId={selectedIncoTermId}
              register={register}
              errors={errors}
              setValue={setValue}
              purchase={purchase}
            />
            <div className="flex justify-between items-center">
            <div>
              <p className="text-[13px] ps-5 pb-1 text-black">Remark</p>
              <Textarea
                rows={4}
                cols={45}
                {...register("remark")}
                placeholder="Enter remark"
                className="border-neutral-400 placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
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
              Update Order
            </Button>
          </div>
        </form>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
}

export default UpdatePurchaseOrder;
