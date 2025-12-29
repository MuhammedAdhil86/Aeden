"use client";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SupplierInfo from "./SupplierInfo";
import PortInfo from "./PortInfo";
import ProductSelection from "./ProductSelection";
import FreightTerms from "./FreightTerms";
import {
  getAllProducts,
  getAllSuppliers,
  fetchCountry,
  fetchIncoTerms,
  fetchModes,
  fetchPorts,
  createPurchase,
  fetchSupplierById,
} from "@/service/procurements";
import ProductDialog from "./VarietyDialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function page({ onCancel }) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [countries, setCountries] = useState([]);
  const [incoTerms, setIncoTerms] = useState([]);
  const [modes, setModes] = useState([]);
  const [ports, setPorts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const selectedIncoTermId = watch("incoTerms");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          productsRes,
          suppliersRes,
          countriesRes,
          incoTermsRes,
          modesRes,
          portsRes,
        ] = await Promise.all([
          getAllProducts(),
          getAllSuppliers(),
          fetchCountry(),
          fetchIncoTerms(),
          fetchModes(),
          fetchPorts(),
          
        ]);
        setProducts(productsRes?.data || []);
        setSuppliers(suppliersRes?.data.data || []);
        setCountries(countriesRes?.data || []);
        setIncoTerms(incoTermsRes?.data || []);
        setModes(modesRes?.data || []);
        setPorts(portsRes?.data || []);
        setCountries(countriesRes?.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to load initial data.");
      }
    };
    fetchData();
  }, []);

  const handleCancel = () => {
    reset();
    onCancel?.();
  };

  const calculateGrandTotal = () => {
    return selectedProducts
      .reduce((total, product) => total + parseFloat(product.totalAmount), 0)
      .toFixed(2);
  };

  const handleSupplierChange = async (partyName) => {
    try {
      const selectedSupplier = suppliers.find(
        (supplier) => supplier.party_name === partyName
      );
      if (!selectedSupplier) {
        toast.error("Selected supplier not found.");
        return;
      }

      const supplierDetails = await fetchSupplierById(selectedSupplier.id);
      setValue("mobile", supplierDetails.phone || "");
      setValue("country", supplierDetails.country_name || "");
      setValue("email", supplierDetails.email || "");
      setValue("address", supplierDetails.address || "");
      setValue("zip", supplierDetails.zipcode || "");
    } catch (err) {
      console.error("Error fetching supplier details:", err);
      toast.error(err.message || "Failed to load supplier details.");
    }
  };

  const onSubmit = async (data) => {
    if (!selectedProducts || selectedProducts.length === 0) {
      toast.error("Please add at least one product before submitting.");
      return;
    }

    console.log("Form data:", data);

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
          count_or_size: firstQuantitySpec.countSize || 0, 
          //count_or_size: (firstQuantitySpec.countSize || 0).toString(),
          net_weight: parseFloat(firstWeightSpec.netWeight || 0),
          weight_unit: firstWeightSpec.weightUnit || "kg",
          unit_cost: parseFloat(product.unitPrice || 0),
        };
      });

      const payload = {
        party_name: data.partyName,
        date: new Date().toISOString(),
        address: data.address,
        country: data.country,
        zipcode: data.zip,
        email: data.email,
        phone: data.mobile,
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
        remarks: data.remark || "",
      };

      await createPurchase(payload);
      toast.success("Purchase created successfully!");
      reset();
      setSelectedProducts([]);
    } catch (error) {
      console.error("Error in onSubmit:", error);
      toast.error(`Failed to create purchase: ${error.message}`);
    }
  };

  return (
    <div className="">
      <Header />
      <div className="pt-5">
        <p className="text-black text-xl font-medium">Create Purchase Order</p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="pt-5 overflow-hidden"
        >
          <div className="bg-white h-[70vh] overflow-auto rounded-xl space-y-4 p-10 text-black flex flex-col gap-y-3">
            <SupplierInfo
              control={control}
              suppliers={suppliers}
              setSuppliers={setSuppliers}
              setValue={setValue}
              errors={errors}
              register={register}
              countries={countries}
              setCountries={setCountries} 
              handleSupplierChange={handleSupplierChange}
            />
            <PortInfo
              control={control}
              ports={ports}
              setPorts={setPorts}
              setValue={setValue}
              errors={errors}
              countries={countries}
              setCountries={setCountries}
              register={register}
            />
            <ProductSelection
              control={control}
              watch={watch}
              setValue={setValue}
              products={products}
              register={register}
              setProducts={setProducts}
              selectedProducts={selectedProducts}
              setSelectedProducts={setSelectedProducts}
              currencies={countries}
            />
            <FreightTerms
              control={control}
              incoTerms={incoTerms}
              modes={modes}
              selectedIncoTermId={selectedIncoTermId}
              register={register}
              errors={errors}
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
              Create Order
            </Button>
          </div>
        </form>
        <ProductDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
}

export default page;
