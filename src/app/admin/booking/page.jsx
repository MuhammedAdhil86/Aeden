// "use client";

// import Header from "@/components/Header";
// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import { Progress } from "@/components/ui/progress";

// export default function Booking({ onCancel, onSubmit }) {
//   const { register, handleSubmit, reset, formState: { errors }, trigger } = useForm();
//   const [currentStep, setCurrentStep] = useState(1);
//   const [files, setFiles] = useState({});

//   const totalSteps = 7;

//   const handleFileChange = (fieldName) => (event) => {
//     const selectedFile = event.target.files[0];
//     if (selectedFile) {
//       setFiles((prev) => ({ ...prev, [fieldName]: selectedFile }));
//     }
//   };

//   const handleCancel = () => {
//     reset();
//     setCurrentStep(1);
//     setFiles({});
//     onCancel?.();
//   };

//   const handleNext = async () => {
//     const fieldsToValidate = getFieldsForStep(currentStep);
//     const isValid = await trigger(fieldsToValidate);
//     if (isValid) {
//       setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
//     }
//   };

//   const handlePrevious = () => {
//     setCurrentStep((prev) => Math.max(prev - 1, 1));
//   };

//   const getFieldsForStep = (step) => {
//     switch (step) {
//       case 1:
//         return [
//           "supplierName",
//           "consignee",
//           "country",
//           "shipperContact",
//           "shipperEmail",
//           "consigneeContact",
//           "consigneeEmail",
//           "originAddress",
//         ];
//       case 2:
//         return [
//           "BINumber",
//           "CNTNumber",
//           "invoiceNumber",
//           "HSMCode",
//           "billOfLadingNumber",
//           "purchaseOrderNumber",
//           "shipmentReferenceNumber",
//           "customsDeclarationNumber",
//         ];
//       case 3:
//         return [
//           "eta",
//           "etaDate",
//           "freeDate",
//           "departureDate",
//           "estimatedDeliveryDate",
//           "customsClearanceDate",
//           "lastFreeDay",
//           "portArrivalDate",
//         ];
//       case 4:
//         return [
//           "product",
//           "productCategory",
//           "productQuantity",
//           "productWeight",
//           "productDimensions",
//           "productValue",
//           "packagingType",
//           "hazardousMaterial",
//         ];
//       case 5:
//         return [
//           "modeOfTransport",
//           "carrierName",
//           "vesselFlightNumber",
//           "portOfLoading",
//           "portOfDischarge",
//           "freightForwarderName",
//           "freightForwarderContact",
//           "containerType",
//         ];
//       case 6:
//         return [
//           "insuranceProvider",
//           "insurancePolicyNumber",
//           "insuranceAmount",
//           "specialInstructions",
//           "shipmentStatus",
//           "paymentTerms",
//           "incoterms",
//           "currency",
//         ];
//       case 7:
//         return [
//           "file",
//           "commercialInvoice",
//           "packingList",
//           "certificateOfOrigin",
//           "billOfLading",
//           "customsDeclaration",
//           "additionalDoc1",
//           "additionalDoc2",
//         ];
//       default:
//         return [];
//     }
//   };

//   const renderStep = () => {
//     switch (currentStep) {
//       case 1:
//         return (
//           <div className="grid grid-cols-4 gap-8">
//             <div>
//               <p className="text-[13px] ps-5 pb-1 text-black">Supplier Name</p>
//               <Input
//                 {...register("supplierName", { required: "Supplier Name is required" })}
//                 placeholder="Enter name"
//                 className="border-neutral-400 placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
//               />
//               {errors.supplierName && (
//                 <p className="text-red-500 text-xs mt-1">{errors.supplierName.message}</p>
//               )}
//             </div>
//             <div>
//               <p className="text-[13px] ps-5 pb-1 text-black">Consignee</p>
//               <Input
//                 {...register("consignee", { required: "Consignee is required" })}
//                 placeholder="Enter consignee"
//                 className="border-neutral-400 placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
//               />
//               {errors.consignee && (
//                 <p className="text-red-500 text-xs mt-1">{errors.consignee.message}</p>
//               )}
//             </div>
//             <div>
//               <p className="text-[13px] ps-5 pb-1">Country</p>
//               <Select
//                 {...register("country", )}
//                 // { required: "Country is required" }
//                 className="border-neutral-400 rounded-lg text-xs mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
//               >
//                 <SelectTrigger className="text-black">
//                   <SelectValue placeholder="Select Country" />
//                 </SelectTrigger>
//                 <SelectContent className="text-black bg-white">
//                   <SelectItem value="india">India</SelectItem>
//                   <SelectItem value="japan">Japan</SelectItem>
//                   <SelectItem value="china">China</SelectItem>
//                 </SelectContent>
//               </Select>
//               {errors.country && (
//                 <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>
//               )}
//             </div>
//             <div>
//               <p className="text-[13px] ps-5 pb-1 text-black">Shipper Contact Number</p>
//               <Input
//                 {...register("shipperContact", { required: "Shipper Contact is required" })}
//                 placeholder="Enter contact number"
//                 className="border-neutral-400 placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
//               />
//               {errors.shipperContact && (
//                 <p className="text-red-500 text-xs mt-1">{errors.shipperContact.message}</p>
//               )}
//             </div>
//             <div>
//               <p className="text-[13px] ps-5 pb-1 text-black">Shipper Email</p>
//               <Input
//                 {...register("shipperEmail", {
//                   required: "Shipper Email is required",
//                   pattern: {
//                     value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//                     message: "Invalid email address",
//                   },
//                 })}
//                 placeholder="Enter email"
//                 className="border-neutral-400 placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
//               />
//               {errors.shipperEmail && (
//                 <p className="text-red-500 text-xs mt-1">{errors.shipperEmail.message}</p>
//               )}
//             </div>
//             <div>
//               <p className="text-[13px] ps-5 pb-1 text-black">Consignee Contact Number</p>
//               <Input
//                 {...register("consigneeContact", { required: "Consignee Contact is required" })}
//                 placeholder="Enter contact number"
//                 className="border-neutral-400 placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
//               />
//               {errors.consigneeContact && (
//                 <p className="text-red-500 text-xs mt-1">{errors.consigneeContact.message}</p>
//               )}
//             </div>
//             <div>
//               <p className="text-[13px] ps-5 pb-1 text-black">Consignee Email</p>
//               <Input
//                 {...register("consigneeEmail", {
//                   required: "Consignee Email is required",
//                   pattern: {
//                     value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//                     message: "Invalid email address",
//                   },
//                 })}
//                 placeholder="Enter email"
//                 className="border-neutral-400 placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
//               />
//               {errors.consigneeEmail && (
//                 <p className="text-red-500 text-xs mt-1">{errors.consigneeEmail.message}</p>
//               )}
//             </div>
//             <div>
//               <p className="text-[13px] ps-5 pb-1 text-black">Origin Address</p>
//               <Input
//                 {...register("originAddress", { required: "Origin Address is required" })}
//                 placeholder="Enter address"
//                 className="border-neutral-400 placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
//               />
//               {errors.originAddress && (
//                 <p className="text-red-500 text-xs mt-1">{errors.originAddress.message}</p>
//               )}
//             </div>
//           </div>
//         );
//       case 2:
//         return (
//           <div className="grid grid-cols-4 gap-8">
//             <div>
//               <p className="text-[13px] ps-5 pb-1 text-black">BI Number</p>
//               <Input
//                 {...register("BINumber", { required: "BI Number is required" })}
//                 type="number"
//                 placeholder="Enter BI number"
//                 className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
//               />
//               {errors.BINumber && (
//                 <p className="text-red-500 text-xs mt-1">{errors.BINumber.message}</p>
//               )}
//             </div>
            // <div>
            //   <p className="text-[13px] ps-5 pb-1 text-black">CNT Number</p>
            //   <Input
            //     {...register("CNTNumber", { required: "CNT Number is required" })}
            //     type="number"
            //     placeholder="Enter CNT number"
            //     className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            //   />
            //   {errors.CNTNumber && (
            //     <p className="text-red-500 text-xs mt-1">{errors.CNTNumber.message}</p>
            //   )}
            // </div>
//             <div>
//               <p className="text-[13px] ps-5 pb-1 text-black">Invoice Number</p>
//               <Input
//                 {...register("invoiceNumber", { required: "Invoice Number is required" })}
//                 type="number"
//                 placeholder="Enter Invoice number"
//                 className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
//               />
//               {errors.invoiceNumber && (
//                 <p className="text-red-500 text-xs mt-1">{errors.invoiceNumber.message}</p>
//               )}
//             </div>
//             <div>
//               <p className="text-[13px] ps-5 pb-1">HSM Code</p>
//               <Select
//                 {...register("HSMCode", { required: "HSM Code is required" })}
//                 className="border-neutral-400 rounded-lg text-xs mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
//               >
//                 <SelectTrigger className="text-black">
//                   <SelectValue placeholder="Select Product" />
//                 </SelectTrigger>
//                 <SelectContent className="text-black bg-white">
//                   <SelectItem value="101">101 - Apple</SelectItem>
//                   <SelectItem value="102">102 - Pine Apple</SelectItem>
//                   <SelectItem value="103">103 - Grapes</SelectItem>
//                 </SelectContent>
//               </Select>
//               {errors.HSMCode && (
//                 <p className="text-red-500 text-xs mt-1">{errors.HSMCode.message}</p>
//               )}
//             </div>
//             <div>
//               <p className="text-[13px] ps-5 pb-1 text-black">Bill of Lading Number</p>
//               <Input
//                 {...register("billOfLadingNumber", { required: "Bill of Lading Number is required" })}
//                 placeholder="Enter number"
//                 className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
//               />
//               {errors.billOfLadingNumber && (
//                 <p className="text-red-500 text-xs mt-1">{errors.billOfLadingNumber.message}</p>
//               )}
//             </div>
//             <div>
//               <p className="text-[13px] ps-5 pb-1 text-black">Purchase Order Number</p>
//               <Input
//                 {...register("purchaseOrderNumber", { required: "Purchase Order Number is required" })}
//                 placeholder="Enter number"
//                 className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
//               />
//               {errors.purchaseOrderNumber && (
//                 <p className="text-red-500 text-xs mt-1">{errors.purchaseOrderNumber.message}</p>
//               )}
//             </div>
//             <div>
//               <p className="text-[13px] ps-5 pb-1 text-black">Shipment Reference Number</p>
//               <Input
//                 {...register("shipmentReferenceNumber", { required: "Shipment Reference Number is required" })}
//                 placeholder="Enter number"
//                 className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
//               />
//               {errors.shipmentReferenceNumber && (
//                 <p className="text-red-500 text-xs mt-1">{errors.shipmentReferenceNumber.message}</p>
//               )}
//             </div>
//             <div>
//               <p className="text-[13px] ps-5 pb-1 text-black">Customs Declaration Number</p>
//               <Input
//                 {...register("customsDeclarationNumber", { required: "Customs Declaration Number is required" })}
//                 placeholder="Enter number"
//                 className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
//               />
//               {errors.customsDeclarationNumber && (
//                 <p className="text-red-500 text-xs mt-1">{errors.customsDeclarationNumber.message}</p>
//               )}
//             </div>
//           </div>
//         );
//       case 3:
//         return (
//           <div className="grid grid-cols-4 gap-8">
//             <div>
//               <p className="text-[13px] ps-5 pb-1 text-black">ETA/ATA</p>
//               <Input
//                 {...register("eta", { required: "ETA/ATA is required" })}
//                 type="number"
//                 placeholder="ETA/ATA"
//                 className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
//               />
//               {errors.eta && (
//                 <p className="text-red-500 text-xs mt-1">{errors.eta.message}</p>
//               )}
//             </div>
            // <div>
            //   <p className="text-[13px] ps-5 pb-1 text-black">Last Updated ETA</p>
            //   <div className="relative w-full">
            //     <Input
            //       {...register("etaDate", { required: "Last Updated ETA is required" })}
            //       id="etaDateInput"
            //       type="date"
            //       className="border-neutral-400 text-black placeholder:text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none pr-10
            //       [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none"
            //     />
            //     <button
            //       type="button"
            //       onClick={(e) => {
            //         e.preventDefault();
            //         const etaDateInput = document.getElementById("etaDateInput");
            //         if (etaDateInput) {
            //           etaDateInput.showPicker();
            //         }
            //       }}
            //       className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            //     >
            //       <svg
            //         xmlns="http://www.w3.org/2000/svg"
            //         width="22"
            //         height="22"
            //         viewBox="0 0 24 24"
            //         fill="none"
            //         stroke="currentColor"
            //         strokeWidth="2"
            //         strokeLinecap="round"
            //         strokeLinejoin="round"
            //         className="lucide lucide-calendar-days"
            //       >
            //         <path d="M8 2v4" />
            //         <path d="M16 2v4" />
            //         <rect width="18" height="18" x="3" y="4" rx="2" />
            //         <path d="M3 10h18" />
            //         <path d="M8 14h.01" />
            //         <path d="M12 14h.01" />
            //         <path d="M16 14h.01" />
            //         <path d="M8 18h.01" />
            //         <path d="M12 18h.01" />
            //         <path d="M16 18h.01" />
            //       </svg>
            //     </button>
            //   </div>
            //   {errors.etaDate && (
            //     <p className="text-red-500 text-xs mt-1">{errors.etaDate.message}</p>
            //   )}
            // </div>
//             <div>
//               <p className="text-[13px] ps-5 pb-1 text-black">Free Date</p>
//               <div className="relative w-full">
//                 <Input
//                   {...register("freeDate", { required: "Free Date is required" })}
//                   id="freeDate"
//                   type="date"
//                   className="border-neutral-400 text-black placeholder:text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none pr-10
//                   [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none"
//                 />
//                 <button
//                   type="button"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     const freeDate = document.getElementById("freeDate");
//                     if (freeDate) {
//                       freeDate.showPicker();
//                     }
//                   }}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="22"
//                     height="22"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     className="lucide lucide-calendar-days"
//                   >
//                     <path d="M8 2v4" />
//                     <path d="M16 2v4" />
//                     <rect width="18" height="18" x="3" y="4" rx="2" />
//                     <path d="M3 10h18" />
//                     <path d="M8 14h.01" />
//                     <path d="M12 14h.01" />
//                     <path d="M16 14h.01" />
//                     <path d="M8 18h.01" />
//                     <path d="M12 18h.01" />
//                     <path d="M16 18h.01" />
//                   </svg>
//                 </button>
//               </div>
//               {errors.freeDate && (
//                 <p className="text-red-500 text-xs mt-1">{errors.freeDate.message}</p>
//               )}
//             </div>
//             <div>
//               <p className="text-[13px] ps-5 pb-1 text-black">Departure Date</p>
//               <div className="relative w-full">
//                 <Input
//                   {...register("departureDate", { required: "Departure Date is required" })}
//                   id="departureDate"
//                   type="date"
//                   className="border-neutral-400 text-black placeholder:text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none pr-10
//                   [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none"
//                 />
//                 <button
//                   type="button"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     const departureDate = document.getElementById("departureDate");
//                     if (departureDate) {
//                       departureDate.showPicker();
//                     }
//                   }}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="22"
//                     height="22"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     className="lucide lucide-calendar-days"
//                   >
//                     <path d="M8 2v4" />
//                     <path d="M16 2v4" />
//                     <rect width="18" height="18" x="3" y="4" rx="2" />
//                     <path d="M3 10h18" />
//                     <path d="M8 14h.01" />
//                     <path d="M12 14h.01" />
//                     <path d="M16 14h.01" />
//                     <path d="M8 18h.01" />
//                     <path d="M12 18h.01" />
//                     <path d="M16 18h.01" />
//                   </svg>
//                 </button>
//               </div>
//               {errors.departureDate && (
//                 <p className="text-red-500 text-xs mt-1">{errors.departureDate.message}</p>
//               )}
//             </div>
//             <div>
//               <p className="text-[13px] ps-5 pb-1 text-black">Estimated Delivery Date</p>
//               <div className="relative w-full">
//                 <Input
//                   {...register("estimatedDeliveryDate", { required: "Estimated Delivery Date is required" })}
//                   id="estimatedDeliveryDate"
//                   type="date"
//                   className="border-neutral-400 text-black placeholder:text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none pr-10
//                   [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none"
//                 />
//                 <button
//                   type="button"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     const estimatedDeliveryDate = document.getElementById("estimatedDeliveryDate");
//                     if (estimatedDeliveryDate) {
//                       estimatedDeliveryDate.showPicker();
//                     }
//                   }}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="22"
//                     height="22"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     className="lucide lucide-calendar-days"
//                   >
//                     <path d="M8 2v4" />
//                     <path d="M16 2v4" />
//                     <rect width="18" height="18" x="3" y="4" rx="2" />
//                     <path d="M3 10h18" />
//                     <path d="M8 14h.01" />
//                     <path d="M12 14h.01" />
//                     <path d="M16 14h.01" />
//                     <path d="M8 18h.01" />
//                     <path d="M12 18h.01" />
//                     <path d="M16 18h.01" />
//                   </svg>
//                 </button>
//               </div>
//               {errors.estimatedDeliveryDate && (
//                 <p className="text-red-500 text-xs mt-1">{errors.estimatedDeliveryDate.message}</p>
//               )}
//             </div>
//             <div>
//               <p className="text-[13px] ps-5 pb-1 text-black">Customs Clearance Date</p>
//               <div className="relative w-full">
//                 <Input
//                   {...register("customsClearanceDate", { required: "Customs Clearance Date is required" })}
//                   id="customsClearanceDate"
//                   type="date"
//                   className="border-neutral-400 text-black placeholder:text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none pr-10
//                   [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none"
//                 />
//                 <button
//                   type="button"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     const customsClearanceDate = document.getElementById("customsClearanceDate");
//                     if (customsClearanceDate) {
//                       customsClearanceDate.showPicker();
//                     }
//                   }}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="22"
//                     height="22"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     className="lucide lucide-calendar-days"
//                   >
//                     <path d="M8 2v4" />
//                     <path d="M16 2v4" />
//                     <rect width="18" height="18" x="3" y="4" rx="2" />
//                     <path d="M3 10h18" />
//                     <path d="M8 14h.01" />
//                     <path d="M12 14h.01" />
//                     <path d="M16 14h.01" />
//                     <path d="M8 18h.01" />
//                     <path d="M12 18h.01" />
//                     <path d="M16 18h.01" />
//                   </svg>
//                 </button>
//               </div>
//               {errors.customsClearanceDate && (
//                 <p className="text-red-500 text-xs mt-1">{errors.customsClearanceDate.message}</p>
//               )}
//             </div>
//             <div>
//               <p className="text-[13px] ps-5 pb-1 text-black">Last Free Day</p>
//               <div className="relative w-full">
//                 <Input
//                   {...register("lastFreeDay", { required: "Last Free Day is required" })}
//                   id="lastFreeDay"
//                   type="date"
//                   className="border-neutral-400 text-black placeholder:text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none pr-10
//                   [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none"
//                 />
//                 <button
//                   type="button"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     const lastFreeDay = document.getElementById("lastFreeDay");
//                     if (lastFreeDay) {
//                       lastFreeDay.showPicker();
//                     }
//                   }}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="22"
//                     height="22"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     className="lucide lucide-calendar-days"
//                   >
//                     <path d="M8 2v4" />
//                     <path d="M16 2v4" />
//                     <rect width="18" height="18" x="3" y="4" rx="2" />
//                     <path d="M3 10h18" />
//                     <path d="M8 14h.01" />
//                     <path d="M12 14h.01" />
//                     <path d="M16 14h.01" />
//                     <path d="M8 18h.01" />
//                     <path d="M12 18h.01" />
//                     <path d="M16 18h.01" />
//                   </svg>
//                 </button>
//               </div>
//               {errors.lastFreeDay && (
//                 <p className="text-red-500 text-xs mt-1">{errors.lastFreeDay.message}</p>
//               )}
//             </div>
//             <div>
//               <p className="text-[13px] ps-5 pb-1 text-black">Port Arrival Date</p>
//               <div className="relative w-full">
//                 <Input
//                   {...register("portArrivalDate", { required: "Port Arrival Date is required" })}
//                   id="portArrivalDate"
//                   type="date"
//                   className="border-neutral-400 text-black placeholder:text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none pr-10
//                   [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none"
//                 />
//                 <button
//                   type="button"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     const portArrivalDate = document.getElementById("portArrivalDate");
//                     if (portArrivalDate) {
//                       portArrivalDate.showPicker();
//                     }
//                   }}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="22"
//                     height="22"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     className="lucide lucide-calendar-days"
//                   >
//                     <path d="M8 2v4" />
//                     <path d="M16 2v4" />
//                     <rect width="18" height="18" x="3" y="4" rx="2" />
//                     <path d="M3 10h18" />
//                     <path d="M8 14h.01" />
//                     <path d="M12 14h.01" />
//                     <path d="M16 14h.01" />
//                     <path d="M8 18h.01" />
//                     <path d="M12 18h.01" />
//                     <path d="M16 18h.01" />
//                   </svg>
//                 </button>
//               </div>
//               {errors.portArrivalDate && (
//                 <p className="text-red-500 text-xs mt-1">{errors.portArrivalDate.message}</p>
//               )}
//             </div>
//           </div>
//         );
//       case 4:
//         return (
//           <div className="grid grid-cols-4 gap-8">
//             <div>
//               <p className="text-[13px] ps-5 pb-1 text-black">Product</p>
//               <Input
//                 {...register("product", { required: "Product is required" })}
//                 placeholder="Enter Product"
//                 className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
//               />
//               {errors.product && (
//                 <p className="text-red-500 text-xs mt-1">{errors.product.message}</p>
//               )}
//             </div>
//             <div>
//               <p className="text-[13px] ps-5 pb-1 text-black">Product Category</p>
//               <Select
//                 {...register("productCategory", { required: "Product Category is required" })}
//                 className="border-neutral-400 rounded-lg text-xs mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
//               >
//                 <SelectTrigger className="text-black">
//                   <SelectValue placeholder="Select Category" />
//                 </SelectTrigger>
//                 <SelectContent className="text-black bg-white">
//                   <SelectItem value="electronics">Electronics</SelectItem>
//                   <SelectItem value="clothing">Clothing</SelectItem>
//                   <SelectItem value="furniture">Furniture</SelectItem>
//                 </SelectContent>
//               </Select>
//               {errors.productCategory && (
//                 <p className="text-red-500 text-xs mt-1">{errors.productCategory.message}</p>
//               )}
//             </div>
//             <div>
//               <p className="text-[13px] ps-5 pb-1 text-black">Product Quantity</p>
//               <Input
//                 {...register("productQuantity", { required: "Product Quantity is required" })}
//                 type="number"
//                 placeholder="Enter quantity"
//                 className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
//               />
//               {errors.productQuantity && (
//                 <p className="text-red-500 text-xs mt-1">{errors.productQuantity.message}</p>
//               )}
//             </div>
//             <div>
//               <p className="text-[13px] ps-5 pb-1 text-black">Product Weight (kg)</p>
//               <Input
//                 {...register("productWeight", { required: "Product Weight is required" })}
//                 type="number"
//                 placeholder="Enter weight"
//                 className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
//               />
//               {errors.productWeight && (
//                 <p className="text-red-500 text-xs mt-1">{errors.productWeight.message}</p>
//               )}
//             </div>
//             <div>
//               <p className="text-[13px] ps-5 pb-1 text-black">Product Dimensions (cm)</p>
//               <Input
//                 {...register("productDimensions", { required: "Product Dimensions is required" })}
//                 placeholder="L x W x H"
//                 className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
//               />
//               {errors.productDimensions && (
//                 <p className="text-red-500 text-xs mt-1">{errors.productDimensions.message}</p>
//               )}
//             </div>
//             <div>
//               <p className="text-[13px] ps-5 pb-1 text-black">Product Value</p>
//               <Input
//                 {...register("productValue", { required: "Product Value is required" })}
//                 type="number"
//                 placeholder="Enter value"
//                 className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
//               />
//               {errors.productValue && (
//                 <p className="text-red-500 text-xs mt-1">{errors.productValue.message}</p>
//               )}
//             </div>
//             <div>
//               <p className="text-[13px] ps-5 pb-1 text-black">Packaging Type</p>
//               <Select
//                 {...register("packagingType", { required: "Packaging Type is required" })}
//                 className="border-neutral-400 rounded-lg text-xs mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
//               >
//                 <SelectTrigger className="text-black">
//                   <SelectValue placeholder="Select Packaging" />
//                 </SelectTrigger>
//                 <SelectContent className="text-black bg-white">
//                   <SelectItem value="carton">Carton</SelectItem>
//                   <SelectItem value="pallet">Pallet</SelectItem>
//                   <SelectItem value="crate">Crate</SelectItem>
//                 </SelectContent>
//               </Select>
//               {errors.packagingType && (
//                 <p className="text-red-500 text-xs mt-1">{errors.packagingType.message}</p>
//               )}
//             </div>
//             <div>
//               <p className="text-[13px] ps-5 pb-1 text-black">Hazardous Material</p>
//               <Select
//                 {...register("hazardousMaterial", { required: "Hazardous Material selection is required" })}
//                 className="border-neutral-400 rounded-lg text-xs mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
//               >
//                 <SelectTrigger className="text-black">
//                   <SelectValue placeholder="Select Option" />
//                 </SelectTrigger>
//                 <SelectContent className="text-black bg-white">
//                   <SelectItem value="yes">Yes</SelectItem>
//                   <SelectItem value="no">No</SelectItem>
//                 </SelectContent>
//               </Select>
//               {errors.hazardousMaterial && (
//                 <p className="text-red-500 text-xs mt-1">{errors.hazardousMaterial.message}</p>
//               )}
//             </div>
//           </div>
//         );
//       case 5:
//         return (
//           <div className="grid grid-cols-4 gap-8">
//             <div>
//               <p className="text-[13px] ps-5 pb-1 text-black">Mode of Transport</p>
//               <Select
//                 {...register("modeOfTransport", { required: "Mode of Transport is required" })}
//                 className="border-neutral-400 rounded-lg text-xs mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
//               >
//                 <SelectTrigger className="text-black">
//                   <SelectValue placeholder="Select Mode" />
//                 </SelectTrigger>
//                 <SelectContent className="text-black bg-white">
//                   <SelectItem value="air">Air</SelectItem>
//                   <SelectItem value="sea">Sea</SelectItem>
//                   <SelectItem value="land">Land</SelectItem>
//                 </SelectContent>
//               </Select>
//               {errors.modeOfTransport && (
//                 <p className="text-red-500 text-xs mt-1">{errors.modeOfTransport.message}</p>
//               )}
//             </div>
//             <div>
//               <p className="text-[13px] ps-5 pb-1 text-black">Carrier Name</p>
//               <Input
//                 {...register("carrierName", { required: "Carrier Name is required" })}
//                 placeholder="Enter carrier name"
//                 className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
//               />
//               {errors.carrierName && (
//                 <p className="text-red-500 text-xs mt-1">{errors.carrierName.message}</p>
//               )}
//             </div>
//             <div>
//               <p className="text-[13px] ps-5 pb-1 text-black">Vessel/Flight Number</p>
//               <Input
//                 {...register("vesselFlightNumber", { required: "Vessel/Flight Number is required" })}
//                 placeholder="Enter number"
//                 className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
//               />
//               {errors.vesselFlightNumber && (
//                 <p className="text-red-500 text-xs mt-1">{errors.vesselFlightNumber.message}</p>
//               )}
//             </div>
//             <div>
//               <p className="text-[13px] ps-5 pb-1 text-black">Port of Loading</p>
//               <Input
//                 {...register("portOfLoading", { required: "Port of Loading is required" })}
//                 placeholder="Enter port"
//                 className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
//               />
//               {errors.portOfLoading && (
//                 <p className="text-red-500 text-xs mt-1">{errors.portOfLoading.message}</p>
//               )}
//             </div>
//             <div>
//               <p className="text-[13px] ps-5 pb-1 text-black">Port of Discharge</p>
//               <Input
//                 {...register("portOfDischarge", { required: "Port of Discharge is required" })}
//                 placeholder="Enter port"
//                 className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
//               />
//               {errors.portOfDischarge && (
//                 <p className="text-red-500 text-xs mt-1">{errors.portOfDischarge.message}</p>
//               )}
//             </div>
//             <div>
//               <p className="text-[13px] ps-5 pb-1 text-black">Freight Forwarder Name</p>
//               <Input
//                 {...register("freightForwarderName", { required: "Freight Forwarder Name is required" })}
//                 placeholder="Enter name"
//                 className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
//               />
//               {errors.freightForwarderName && (
//                 <p className="text-red-500 text-xs mt-1">{errors.freightForwarderName.message}</p>
//               )}
//             </div>
//             <div>
//               <p className="text-[13px] ps-5 pb-1 text-black">Freight Forwarder Contact</p>
//               <Input
//                 {...register("freightForwarderContact", { required: "Freight Forwarder Contact is required" })}
//                 placeholder="Enter contact"
//                 className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
//               />
//               {errors.freightForwarderContact && (
//                 <p className="text-red-500 text-xs mt-1">{errors.freightForwarderContact.message}</p>
//               )}
//             </div>
//             <div>
//               <p className="text-[13px] ps-5 pb-1 text-black">Container Type</p>
//               <Select
//                 {...register("containerType", { required: "Container Type is required" })}
//                 className="border-neutral-400 rounded-lg text-xs mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
//               >
//                 <SelectTrigger className="text-black">
//                   <SelectValue placeholder="Select Type" />
//                 </SelectTrigger>
//                 <SelectContent className="text-black bg-white">
//                   <SelectItem value="20ft">20ft</SelectItem>
//                   <SelectItem value="40ft">40ft</SelectItem>
//                   <SelectItem value="reefer">Reefer</SelectItem>
//                 </SelectContent>
//               </Select>
//               {errors.containerType && (
//                 <p className="text-red-500 text-xs mt-1">{errors.containerType.message}</p>
//               )}
//             </div>
//           </div>
//         );
//       case 6:
//         return (
//           <div className="grid grid-cols-4 gap-8">
//             <div>
//               <p className="text-[13px] ps-5 pb-1 text-black">Insurance Provider</p>
//               <Input
//                 {...register("insuranceProvider", { required: "Insurance Provider is required" })}
//                 placeholder="Enter provider"
//                 className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
//               />
//               {errors.insuranceProvider && (
//                 <p className="text-red-500 text-xs mt-1">{errors.insuranceProvider.message}</p>
//               )}
//             </div>
//             <div>
//               <p className="text-[13px] ps-5 pb-1 text-black">Insurance Policy Number</p>
//               <Input
//                 {...register("insurancePolicyNumber", { required: "Insurance Policy Number is required" })}
//                 placeholder="Enter number"
//                 className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
//               />
//               {errors.insurancePolicyNumber && (
//                 <p className="text-red-500 text-xs mt-1">{errors.insurancePolicyNumber.message}</p>
//               )}
//             </div>
//             <div>
//               <p className="text-[13px] ps-5 pb-1 text-black">Insurance Amount</p>
//               <Input
//                 {...register("insuranceAmount", { required: "Insurance Amount is required" })}
//                 type="number"
//                 placeholder="Enter amount"
//                 className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
//               />
//               {errors.insuranceAmount && (
//                 <p className="text-red-500 text-xs mt-1">{errors.insuranceAmount.message}</p>
//               )}
//             </div>
//             <div>
//               <p className="text-[13px] ps-5 pb-1 text-black">Special Instructions</p>
//               <Input
//                 {...register("specialInstructions", { required: "Special Instructions are required" })}
//                 placeholder="Enter instructions"
//                 className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
//               />
//               {errors.specialInstructions && (
//                 <p className="text-red-500 text-xs mt-1">{errors.specialInstructions.message}</p>
//               )}
//             </div>
//             <div>
//               <p className="text-[13px] ps-5 pb-1 text-black">Shipment Status</p>
//               <Select
//                 {...register("shipmentStatus", { required: "Shipment Status is required" })}
//                 className="border-neutral-400 rounded-lg text-xs mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
//               >
//                 <SelectTrigger className="text-black">
//                   <SelectValue placeholder="Select Status" />
//                 </SelectTrigger>
//                 <SelectContent className="text-black bg-white">
//                   <SelectItem value="pending">Pending</SelectItem>
//                   <SelectItem value="in-transit">In Transit</SelectItem>
//                   <SelectItem value="delivered">Delivered</SelectItem>
//                 </SelectContent>
//               </Select>
//               {errors.shipmentStatus && (
//                 <p className="text-red-500 text-xs mt-1">{errors.shipmentStatus.message}</p>
//               )}
//             </div>
//             <div>
//               <p className="text-[13px] ps-5 pb-1 text-black">Payment Terms</p>
//               <Input
//                 {...register("paymentTerms", { required: "Payment Terms are required" })}
//                 placeholder="Enter terms"
//                 className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
//               />
//               {errors.paymentTerms && (
//                 <p className="text-red-500 text-xs mt-1">{errors.paymentTerms.message}</p>
//               )}
//             </div>
            // <div>
            //   <p className="text-[13px] ps-5 pb-1 text-black">Incoterms</p>
            //   <Select
            //     {...register("incoterms", { required: "Incoterms are required" })}
            //     className="border-neutral-400 rounded-lg text-xs mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            //   >
            //     <SelectTrigger className="text-black">
            //       <SelectValue placeholder="Select Incoterms" />
            //     </SelectTrigger>
            //     <SelectContent className="text-black bg-white">
            //       <SelectItem value="EXW">EXW</SelectItem>
            //       <SelectItem value="FOB">FOB</SelectItem>
            //       <SelectItem value="CIF">CIF</SelectItem>
            //     </SelectContent>
            //   </Select>
            //   {errors.incoterms && (
            //     <p className="text-red-500 text-xs mt-1">{errors.incoterms.message}</p>
            //   )}
            // </div>
//             <div>
//               <p className="text-[13px] ps-5 pb-1 text-black">Currency</p>
//               <Select
//                 {...register("currency", { required: "Currency is required" })}
//                 className="border-neutral-400 rounded-lg text-xs mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
//               >
//                 <SelectTrigger className="text-black">
//                   <SelectValue placeholder="Select Currency" />
//                 </SelectTrigger>
//                 <SelectContent className="text-black bg-white">
//                   <SelectItem value="USD">USD</SelectItem>
//                   <SelectItem value="EUR">EUR</SelectItem>
//                   <SelectItem value="INR">INR</SelectItem>
//                 </SelectContent>
//               </Select>
//               {errors.currency && (
//                 <p className="text-red-500 text-xs mt-1">{errors.currency.message}</p>
//               )}
//             </div>
//           </div>
//         );
//       case 7:
//         return (
//           <div className="space-y-4">
//             {[
//               { label: "File Upload", name: "file" },
//               { label: "Commercial Invoice", name: "commercialInvoice" },
//               { label: "Packing List", name: "packingList" },
//               { label: "Certificate of Origin", name: "certificateOfOrigin" },
//               { label: "Bill of Lading", name: "billOfLading" },
//               { label: "Customs Declaration", name: "customsDeclaration" },
//               { label: "Additional Document 1", name: "additionalDoc1" },
//               { label: "Additional Document 2", name: "additionalDoc2" },
//             ].map((doc) => (
//               <div
//                 key={doc.name}
//                 className="w-full border border-dashed border-neutral-400 rounded-lg flex items-center py-1"
//               >
//                 <div className="bg-red-500 h-16 w-1 rounded-l-lg"></div>
//                 <div className="px-5 flex flex-col justify-start w-full">
//                   <p className="text-[13px] text-black">{doc.label}</p>
//                   <div className="relative flex gap-x-5">
//                     <input
//                       {...register(doc.name, { required: `${doc.label} is required` })}
//                       type="file"
//                       onChange={handleFileChange(doc.name)}
//                       className="absolute h-full opacity-0 cursor-pointer w-full"
//                     />
//                     <button
//                       type="button"
//                       className="flex items-center gap-x-2 px-5 border border-neutral-400 text-xs text-white py-[6px] rounded-lg bg-black"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         height="20px"
//                         viewBox="0 -960 960 960"
//                         width="20px"
//                         fill="#FFFFFF"
//                       >
//                         <path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H520q-33 0-56.5-23.5T440-240v-206l-64 62-56-56 160-160 160 160-56 56-64-62v206h220q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41h100v80H260Zm220-280Z" />
//                       </svg>
//                       Browse file
//                     </button>
//                     {files[doc.name] && (
//                       <div className="flex items-center gap-2">
//                         <img
//                           src={URL.createObjectURL(files[doc.name])}
//                           alt="Preview"
//                           className="w-10 h-8 object-cover rounded-lg border border-gray-300"
//                         />
//                         <p className="text-xs text-gray-700">{files[doc.name].name}</p>
//                       </div>
//                     )}
//                   </div>
//                   {errors[doc.name] && (
//                     <p className="text-red-500 text-xs mt-1">{errors[doc.name].message}</p>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
// <div>
//   <div>
//     <Header />
//   </div>
//   <div className="pt-5">
//     <div>
//       <p className="text-black text-xl font-medium">
//         New Shipment Information Entry
//       </p>
//       <div className="mt-4">
//         <p className="text-sm text-gray-500">
//           Step {currentStep} of {totalSteps}
//         </p>
//         <Progress value={(currentStep / totalSteps) * 100} className="mt-2 text-green-500 bg-red-500" />
//       </div>
//     </div>
//     <form onSubmit={handleSubmit(onSubmit)} className="pt-5">
//       <div className="bg-white rounded-xl space-y-4 pt-10 px-10 text-black flex flex-col gap-y-10">
//         {renderStep()}
//         <div className="border-t w-full flex justify-between p-8">
//           <Button
//             type="button"
//             variant="outline"
//             className="text-red-500 px-7 border-neutral-300"
//             onClick={handleCancel}
//           >
//             Cancel
//           </Button>
//           <div className="flex gap-x-5">
//             {currentStep > 1 && (
//               <Button
//                 type="button"
//                 variant="outline"
//                 className="px-7 border-neutral-300"
//                 onClick={handlePrevious}
//               >
//                 Previous
//               </Button>
//             )}
//             {currentStep < totalSteps ? (
//               <Button
//                 type="button"
//                 className="bg-black text-white px-7"
//                 onClick={handleNext}
//               >
//                 Next
//               </Button>
//             ) : (
//               <Button type="submit" className="bg-black text-white px-7">
//                 Submit
//               </Button>
//             )}
//           </div>
//         </div>
//       </div>
//     </form>
//   </div>
// </div>

"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import Sea from "@/components/booking/sea/Sea";
import Header from "@/components/Header";
import Link from "next/link";

export default function AdminBookingPage() {
  const [activeTab, setActiveTab] = useState("sea");
  const router = useRouter();

  const handleSeaSubmit = (data) => {
    console.log("Sea form submitted:", data);
    router.push("/admin/booking/success");
  };

  const handleSeaCancel = () => {
    console.log("Sea form cancelled");
    //router.push("/admin/dashboard");
  };

  return (
    <div className="">
      <div>
        <Header/>
      </div>
      <div className="">
        <div className="border-b pt-3 flex gap-x-5">
      <Link
          href="/admin/booking"
          className="flex flex-col items-center gap-y-1 ps-4 pe-8 border-r border-r-neutral-300 cursor-pointer"
        >
          <p className="text-[13px] font-medium text-black">&nbsp;&nbsp;&nbsp;Sea&nbsp;&nbsp;&nbsp;</p>
          <div className="bg-red-600 h-0.5 rounded-t-lg w-2/3"></div>
        </Link>
        <Link
          href=""
          className="flex flex-col items-center gap-y-1 ps-4 pe-8 border-r border-r-neutral-300 cursor-pointer"
        >
          <p className="text-[13px] font-medium text-neutral-400">
            Air
          </p>
        </Link>
        </div>
        {/* <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid inline-block w-max grid-cols-2 ">
            <TabsTrigger value="sea">Sea</TabsTrigger>
            <TabsTrigger value="air">Air</TabsTrigger>
          </TabsList>
          <TabsContent value="sea" >
            <Sea onSubmit={handleSeaSubmit} onCancel={handleSeaCancel} />
          </TabsContent>
          <TabsContent value="air">
            <div className="p-4">
              <h2 className="text-xl font-semibold">Air Shipment </h2>
              <p className="text-gray-500 mt-2">
              Air Shipment
              </p>
            </div>
          </TabsContent>
        </Tabs> */}
        <div>
        <Sea/>
        </div>
      </div>
    </div>
  );
}
//   );
// }
