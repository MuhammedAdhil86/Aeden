"use client";

import Header from "@/components/Header";
import Link from "next/link";
import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Controller } from "react-hook-form";
import { createDriver } from "@/service/fleet";
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
import ExpiryDatesDialog from "./ExpiryDatesDialog";

// function addVehicle({ onCancel }) {
//   const {
//     register,
//     handleSubmit,
//     reset,
//     control,
//     watch,
//     trigger,
//     formState: { errors },
//   } = useForm({
//     defaultValues: { filter: false, gender: "", },
//     mode: "onChange",
//   });
//   const [file2, setFile2] = useState(null);
//   const [imgFile, setImgFile] = useState(null);

//   const [licensefile, setLicensefile] = useState(null);
//   const [aadharfile, setAadharFile] = useState(null);
//   const [fitnessfile, setFitnessFile] = useState(null);
//   const [eyeTestfile, setEyeTestfile] = useState(null);
//   const [eyeTestPreview, setEyeTestPreview] = useState(null);
//   const isYes = watch("filter");
//   const [isDialogOpen, setIsDialogOpen] = useState(false);

//   // const handleFileChange1 = (event) => {
//   //   const selectedTravelFile = event.target.files[0];
//   //   if (selectedTravelFile) {
//   //     setVehicleFile(selectedTravelFile);
//   //   }
//   // };
//   const handleFileChange1 = (event) => {
//     const selectedFile1 = event.target.files[0];
//     if (selectedFile1) {
//       setFile2(URL.createObjectURL(selectedFile1));
//       setImgFile(selectedFile1);
//     }
//   };

//   const handleFileChangeAadhr = (event) => {
//     const selectedAadharFile = event.target.files[0];
//     if (selectedAadharFile) {
//       setAadharFile(selectedAadharFile);
//     }
//   };

//   const handleFileChangeLcns = (event) => {
//     const selectedLicensefile = event.target.files[0];
//     if (selectedLicensefile) {
//       setLicensefile(selectedLicensefile);
//     }
//   };

//   const handleFileChangeFitns = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       console.log("Selected file: ", file);
//       setFitnessFile(file);
//     }
//   };

//   const handleFileChangEye = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       //console.log("eyeTestfile : ", file);
//       setEyeTestfile(file);
//       setEyeTestPreview(URL.createObjectURL(file));
//     }
//   };

//   const handleCancel = () => {
//     setLicensefile(null);
//     setEyeTestfile(null);
//     setIsDialogOpen(false);
//     onCancel?.();
//   };

//   // const handleCancel = () => {
//   //   reset();
//   //   onCancel?.();
//   // };

//   const handleSaveExpiryDates = async () => {
//     const fieldsToValidate = [
//       "licenseInsuranceExpiry",
//       "eyeTestCertificateExpiry",
//       "aadharExpiry",
//       "fitnessCertificateExpiry",
//     ];
//     const isValid = await trigger(fieldsToValidate);
//     if (isValid) {
//       setIsDialogOpen(false);
//     }
//   };

//   const onSubmit = async (data) => {
//     if (!data.gender) {
//       toast.error("gender is required");
//       return;
//     }
//     if (
//       !data.licenseEndingDate ||
//       !data.licenseStartingDate ||
//       !data.eyeTestCertificateStartingDate ||
//       !data.eyeTestCertificateEndingDate ||
//       !data.fCExpiryStaringDate ||
//       !data.fCExpiryEndingDate
//     ) {
//       toast.error("Please select all expiry dates");
//       setIsDialogOpen(true);
//       return;
//     }
//     //console.log("data : ",data)
//     const formData = new FormData();

//     formData.append("full_name", data.name);
//     formData.append("imgupload", imgFile);
//     formData.append("email", data.email);
//     formData.append("contact_number", data.con);
//     formData.append("date_of_birth", new Date(data.dob).toISOString());

//     formData.append("gender", data.gender);
//     formData.append("address", data.address);
//     formData.append("aadhaar_number", data.aadhaar);
//     formData.append("license_number", data.license);

//     formData.append(
//       "license_expiry_to",
//       new Date(data.licenseEndingDate).toISOString()
//     );
//     formData.append(
//       "license_expiry_from",
//       new Date(data.licenseStartingDate).toISOString()
//     );
//     formData.append(
//       "eye_expiry_from",
//       new Date(data.eyeTestCertificateStartingDate).toISOString()
//     );
//     formData.append(
//       "eye_expiry_to",
//       new Date(data.eyeTestCertificateEndingDate).toISOString()
//     );
//     formData.append(
//       "fitness_expiry_from",
//       new Date(data.fCExpiryStaringDate).toISOString()
//     );
//     formData.append(
//       "fitness_expiry_to",
//       new Date(data.fCExpiryEndingDate).toISOString()
//     );

//     //formData.append("password", data.password);

//     if (data.licensefile?.[0]) {
//       formData.append("license_file", data.licensefile[0]);
//     }

//     // if (data.file2?.[0]) {
//     //   formData.append("imgupload", data.file2[0]);
//     // }

//     if (data.fitnessfile?.[0]) {
//       formData.append("fitness_file", data.fitnessfile[0]);
//     }

//     if (data.eyetestfile?.[0]) {
//       formData.append("eyeTest_file", data.eyetestfile[0]);
//     }

//     if (data.aadharfile?.[0]) {
//       formData.append("aadhar_file", data.aadharfile[0]);
//     }

//     //formData.append("filter", data.filter ? "true" : "false");

//     // for (let [key, value] of formData.entries()) {
//     //   console.log(`${key}:`, value);
//     // }
//     try {
//       const result = await createDriver(formData);
//       console.log("Driver created successfully:", result);
//       toast.success("Driver added successfully!");
//       reset();
//       setFile2(null);
//       setImgFile(null);
//       setLicensefile(null);
//       setEyeTestfile(null);
//       setAadharFile(null);
//       setFitnessFile(null);
//     } catch (error) {
//       //console.error("Submission failed:", error);
//       //console.log("response : ",response)
//       const errorMessage =
//       error.response?.data ||
//       error.message ||
//       "Something went wrong. Please try again.";
//     toast.error(errorMessage)    }
//   };

//   return (
//     <div>
//       <div>
//         <Header />
//       </div>
//       <div className="border-b pt-3 flex gap-x-5">
//         <Link
//           href="/admin/fleet/manage-trip/create-trip"
//           className="flex flex-col items-center gap-y-1 pe-3 border-r border-r-neutral-300 cursor-pointer"
//         >
//           <p className="text-[13px] font-medium text-neutral-400">
//             Manage Trip
//           </p>
//         </Link>
//         <Link
//           href="/admin/fleet/manage-vehicle/add-vehicle"
//           className="flex flex-col items-center gap-y-1 pe-3 border-r border-r-neutral-300 cursor-pointer"
//         >
//           <p className="text-[13px] font-medium text-neutral-400">
//             Manage Vehicle
//           </p>
//         </Link>
//         <Link
//           href="/admin/fleet/manage-drivers/add-driver"
//           className="flex flex-col items-center gap-y-1 pe-3 border-r border-r-neutral-300 cursor-pointer"
//         >
//           <p className="text-[13px] font-medium text-black">Manage Drivers</p>
//           <div className="bg-red-600 h-0.5 rounded-t-lg w-2/3"></div>
//         </Link>
//       </div>
//       <div className="mt-6 px-2">
//         <p className="text-black font-medium text-lg">Add New Driver</p>
//         <div>
//           <form
//             onSubmit={handleSubmit(onSubmit)}
//             className="pt-5 flex flex-col gap-y-7"
//           >
//             <div className="bg-white rounded-lg p-10">
//               <div className="w-full flex gap-x-7">
//                 <div className="flex flex-col justify-between w-[10%] h-[13.5rem] overflow-hidden">
//                   <div className="h-2/3">
//                     <p className="text-xs font-medium text-gray-700 px-1">
//                       Image <span className="text-black">*</span>
//                     </p>
//                     <div className="relative h-[85%] border border-neutral-600 rounded-md flex flex-col justify-center items-center cursor-pointer overflow-hidden mt-2">
//                       <input
//                         type="file"
//                         accept="image/*"
//                         required
//                         onChange={handleFileChange1}
//                         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                       />
//                       {file2 ? (
//                         <img
//                           src={file2}
//                           alt="Uploaded"
//                           className="h-[80%] object-cover rounded-md"
//                         />
//                       ) : (
//                         <div className="flex flex-col justify-center items-center">
//                           <img
//                             src="/image-upload.svg"
//                             alt="Upload"
//                             className="w-10 h-10"
//                           />
//                           <p className="text-neutral-400 text-[10px] pt-1">
//                             Upload image
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                   <div className="pt-10 hidden">
//                     <p className="text-[13px] text-black pb-2">Availability</p>
//                     <label
//                       className="switch flex items-center gap-y-2 cursor-pointer border rounded-md p-1 w-1/2"
//                       aria-label="Toggle Filter"
//                     >
//                       <input
//                         type="checkbox"
//                         id="filter"
//                         {...register("filter")}
//                         className="hidden"
//                       />
//                       <p
//                         className={`flex justify-center rounded-md w-14 py-1 text-xs ${
//                           isYes ? "bg-black text-white" : "text-gray-500"
//                         }`}
//                       >
//                         Yes
//                       </p>
//                       <p
//                         className={`flex justify-center rounded-md w-13 text-xs py-1 ${
//                           !isYes ? "bg-black text-white" : "text-gray-500"
//                         }`}
//                       >
//                         No
//                       </p>
//                     </label>
//                   </div>
//                 </div>
//                 <div className="flex-1">
//                   <div className="grid grid-cols-3 gap-y-3 gap-x-7">
//                     <div>
//                       <p className="text-[13px] ps-5 text-black">Name</p>
//                       <Input
//                         {...register("name")}
//                         placeholder="Enter name"
//                         required
//                         className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
//                       />
//                     </div>

//                     <Controller
//                       name="gender"
//                       control={control}
//                       //rules={{ required: true }}
//                       render={({ field, fieldState: { error } }) => (
//                         <div>
//                           <p className="text-[13px] ps-5 pb-1 text-black">
//                             Gender
//                           </p>
//                           <Select
//                             onValueChange={field.onChange}
//                             value={field.value}
//                           >
//                             <SelectTrigger className="text-black">
//                               <SelectValue placeholder="Select gender" />
//                             </SelectTrigger>
//                             <SelectContent className="text-black bg-white">
//                               <SelectItem value="male">Male</SelectItem>
//                               <SelectItem value="female">Female</SelectItem>
//                             </SelectContent>
//                           </Select>
//                           {error && (
//                             <p className="text-red-500 text-xs mt-1">
//                               {error.message}
//                             </p>
//                           )}
//                         </div>
//                       )}
//                     />

//                     <div>
//                       <p className="text-[13px] ps-5 pb-1 text-black">
//                         Date of birth
//                       </p>
//                       <div className="relative w-full">
//                         <Input
//                           {...register("dob")}
//                           id="dob"
//                           type="date"
//                           required
//                           className="border-neutral-400 text-black placeholder:text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none pr-10
//                                         [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none"
//                         />
//                         <button
//                           type="button"
//                           onClick={(e) => {
//                             e.preventDefault();
//                             const dob = document.getElementById("dob");
//                             if (dob) {
//                               dob.showPicker();
//                             }
//                           }}
//                           className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
//                         >
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             width="22"
//                             height="22"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             className="lucide lucide-calendar-days"
//                           >
//                             <path d="M8 2v4" />
//                             <path d="M16 2v4" />
//                             <rect width="18" height="18" x="3" y="4" rx="2" />
//                             <path d="M3 10h18" />
//                             <path d="M8 14h.01" />
//                             <path d="M12 14h.01" />
//                             <path d="M16 14h.01" />
//                             <path d="M8 18h.01" />
//                             <path d="M12 18h.01" />
//                             <path d="M16 18h.01" />
//                           </svg>
//                         </button>
//                       </div>
//                     </div>

//                     <div>
//                       <p className="text-[13px] ps-5 text-black">
//                         Contact number
//                       </p>
//                       <Input
//                         {...register("con")}
//                         type="number"
//                         placeholder="Enter number"
//                         required
//                         className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
//                       />
//                     </div>

//                     <div>
//                       <p className="text-[13px] ps-5 pb-1 text-black">Email</p>
//                       <Input
//                         {...register("email")}
//                         type="email"
//                         placeholder="Enter email"
//                         required
//                         className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
//                       />
//                     </div>

//                     {/* <div>
//                       <p className="text-[13px] ps-5 text-black">Password</p>
//                       <Input
//                         {...register("password")}
//                         placeholder="Enter password"
//                         required
//                         className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
//                       />
//                     </div> */}

//                     <div>
//                       <p className="text-[13px] ps-5 pb-1 text-black">
//                         Aadhaar number
//                       </p>
//                       <Input
//                         {...register("aadhaar")}
//                         placeholder="Enter aadhaar"
//                         type="number"
//                         required
//                         className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
//                       />
//                     </div>

//                     <div>
//                       <p className="text-[13px] ps-5 pb-1 text-black">
//                         Address
//                       </p>
//                       <Input
//                         {...register("address")}
//                         placeholder="Enter address"
//                         required
//                         className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
//                       />
//                     </div>

//                     <div>
//                       <p className="text-[13px] ps-5 pb-1 text-black">
//                         License Number
//                       </p>
//                       <Input
//                         {...register("license")}
//                         //type="number"
//                         placeholder="Enter number"
//                         required
//                         className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
//                       />
//                     </div>

//                     {/* <div>
//                       <p className="text-[13px] ps-5 pb-1 text-black">
//                         License expiry
//                       </p>
//                       <div className="relative w-full">
//                         <Input
//                           {...register("licenseExp")}
//                           id="licenseExp"
//                           type="date"
//                           required
//                           className="border-neutral-400 text-black placeholder:text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none pr-10
//                                         [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none"
//                         />
//                         <button
//                           type="button"
//                           onClick={(e) => {
//                             e.preventDefault();
//                             const licenseExp =
//                               document.getElementById("licenseExp");
//                             if (licenseExp) {
//                               licenseExp.showPicker();
//                             }
//                           }}
//                           className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
//                         >
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             width="22"
//                             height="22"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             className="lucide lucide-calendar-days"
//                           >
//                             <path d="M8 2v4" />
//                             <path d="M16 2v4" />
//                             <rect width="18" height="18" x="3" y="4" rx="2" />
//                             <path d="M3 10h18" />
//                             <path d="M8 14h.01" />
//                             <path d="M12 14h.01" />
//                             <path d="M16 14h.01" />
//                             <path d="M8 18h.01" />
//                             <path d="M12 18h.01" />
//                             <path d="M16 18h.01" />
//                           </svg>
//                         </button>
//                       </div>
//                     </div> */}
//                   </div>
//                 </div>
//               </div>
//               <div className="border-t mt-5 pt-5">
//                 <div className="w-full flex justify-between">
//                   <p className="text-black text-sm font-medium">
//                     Related Documents
//                   </p>
//                   <Button
//                     type="button"
//                     className="border rounded-md text-xs py-1 px-3 text-black"
//                     onClick={() => {
//                       console.log(
//                         "Opening dialog, isDialogOpen:",
//                         isDialogOpen
//                       );
//                       setIsDialogOpen(true);
//                       console.log(
//                         "After setIsDialogOpen, isDialogOpen:",
//                         isDialogOpen
//                       );
//                     }}
//                   >
//                     Add Expiry Dates
//                   </Button>
//                 </div>
//                 <div className="grid grid-cols-2 gap-x-5 gap-y-5 mt-5">
//                   <div className="relative flex gap-x-5 border border-dashed rounded-md py-1">
//                     <div className="bg-red-500 w-1 rounded-l-md"></div>{" "}
//                     <input
//                       {...register("licensefile")}
//                       type="file"
//                       onChange={handleFileChangeLcns}
//                       className="absolute bottom-2 left-[23px] opacity-0 w-36 h-8 cursor-pointer"
//                       required
//                     />
//                     <div>
//                       <p className="text-black text-xs pt-1">License</p>
//                       <div className="flex gap-x-2 py-1">
//                         <button
//                           type="button"
//                           className="flex items-center gap-x-2 px-5 border border-neutral-400 text-xs text-white py-[6px] rounded-lg bg-black"
//                         >
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             height="20px"
//                             viewBox="0 -960 960 960"
//                             width="20px"
//                             fill="#FFFFFF"
//                           >
//                             <path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H520q-33 0-56.5-23.5T440-240v-206l-64 62-56-56 160-160 160 160-56 56-64-62v206h220q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41h100v80H260Zm220-280Z" />
//                           </svg>
//                           Browse file
//                         </button>
//                         {licensefile && (
//                           <div className="flex items-center gap-2 border rounded-md px-2 py-1">
//                             <p className="text-xs text-gray-700">
//                               {licensefile.name}
//                             </p>
//                             <button
//                               type="button"
//                               className="text-black hover:text-red-700"
//                               onClick={() => setLicensefile(null)}
//                             >
//                               <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 height="20px"
//                                 viewBox="0 -960 960 960"
//                                 width="20px"
//                                 fill="#000"
//                               >
//                                 <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
//                               </svg>
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="relative flex gap-x-5 border border-dashed rounded-md py-1">
//                     <div className="bg-red-500 w-1 rounded-l-md"></div>
//                     <input
//                       {...register("aadharfile")}
//                       type="file"
//                       onChange={handleFileChangeAadhr}
//                       className="absolute bottom-2 left-[23px] opacity-0 w-36 h-8 cursor-pointer"
//                       required
//                     />
//                     <div>
//                       <p className="text-black text-xs pt-1">Aadhar</p>
//                       <div className="flex gap-x-2 py-1">
//                         <button
//                           type="button"
//                           className="flex justify-center items-center gap-x-2 w-36 border border-neutral-400 text-xs text-white py-[6px] rounded-lg bg-black"
//                         >
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             height="20px"
//                             viewBox="0 -960 960 960"
//                             width="20px"
//                             fill="#FFFFFF"
//                           >
//                             <path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H520q-33 0-56.5-23.5T440-240v-206l-64 62-56-56 160-160 160 160-56 56-64-62v206h220q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41h100v80H260Zm220-280Z" />
//                           </svg>
//                           Browse file
//                         </button>
//                         {aadharfile && (
//                           <div className="flex items-center gap-2 border rounded-md px-2 py-1">
//                             <p className="text-xs text-gray-700">
//                               {aadharfile.name}
//                             </p>
//                             <button
//                               type="button"
//                               className="text-black hover:text-red-700"
//                               onClick={() => setAadharFile(null)}
//                             >
//                               <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 height="20px"
//                                 viewBox="0 -960 960 960"
//                                 width="20px"
//                                 fill="#000"
//                               >
//                                 <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
//                               </svg>
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="relative flex gap-x-5 border border-dashed rounded-md py-1">
//                     <div className="bg-red-500 w-1 rounded-l-md"></div>

//                     {/* Invisible file input */}
//                     <input
//                       id="fitnessfile"
//                       type="file"
//                       required
//                       {...register("fitnessfile", { required: true })}
//                       onChange={handleFileChangeFitns}
//                       className="absolute bottom-2 left-[23px] opacity-0 w-36 h-8 cursor-pointer"
//                     />

//                     <div>
//                       <p className="text-black text-xs pt-1">
//                         Fitness Certificate
//                       </p>
//                       <div className="flex gap-x-2 py-1">
//                         {/* Label triggers hidden input */}
//                         <label
//                           htmlFor="fitnessfile"
//                           className="flex justify-center items-center gap-x-2 w-36 border border-neutral-400 text-xs text-white py-[6px] rounded-lg bg-black cursor-pointer"
//                         >
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             height="20px"
//                             viewBox="0 -960 960 960"
//                             width="20px"
//                             fill="#FFFFFF"
//                           >
//                             <path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H520q-33 0-56.5-23.5T440-240v-206l-64 62-56-56 160-160 160 160-56 56-64-62v206h220q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41h100v80H260Zm220-280Z" />
//                           </svg>
//                           Browse file
//                         </label>

//                         {fitnessfile && (
//                           <div className="flex items-center gap-2 border rounded-md px-2 py-1">
//                             <p className="text-xs text-gray-700">
//                               {fitnessfile.name}
//                             </p>
//                             <button
//                               type="button"
//                               className="text-black hover:text-red-700"
//                               onClick={() => setFitnessFile(null)}
//                             >
//                               <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 height="20px"
//                                 viewBox="0 -960 960 960"
//                                 width="20px"
//                                 fill="#000"
//                               >
//                                 <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
//                               </svg>
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="relative flex gap-x-5 border border-dashed rounded-md py-1">
//                     <div className="bg-red-500 w-1 rounded-l-md"></div>
//                     <input
//                       {...register("eyetestfile")}
//                       type="file"
//                       onChange={handleFileChangEye}
//                       className="absolute bottom-2 left-[23px] opacity-0 w-36 h-8 cursor-pointer"
//                       required
//                     />
//                     <div>
//                       <p className="text-black text-xs pt-1">
//                         Eye Test Certificate
//                       </p>
//                       <div className="flex gap-x-2 py-1">
//                         <button
//                           type="button"
//                           className="flex justify-center items-center gap-x-2 w-36 border border-neutral-400 text-xs text-white py-[6px] rounded-lg bg-black"
//                         >
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             height="20px"
//                             viewBox="0 -960 960 960"
//                             width="20px"
//                             fill="#FFFFFF"
//                           >
//                             <path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H520q-33 0-56.5-23.5T440-240v-206l-64 62-56-56 160-160 160 160-56 56-64-62v206h220q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41h100v80H260Zm220-280Z" />
//                           </svg>
//                           Browse file
//                         </button>
//                         {eyeTestfile && (
//                           <div className="flex items-center gap-2 border rounded-md px-2 py-1">
//                             <p className="text-xs text-gray-700">
//                               {eyeTestfile.name}
//                             </p>
//                             <button
//                               type="button"
//                               className="text-black hover:text-red-700"
//                               onClick={() => setEyeTestfile(null)}
//                             >
//                               <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 height="20px"
//                                 viewBox="0 -960 960 960"
//                                 width="20px"
//                                 fill="#000"
//                               >
//                                 <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
//                               </svg>
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="flex justify-end gap-y-2 gap-x-5 pt-5">
//               <Button
//                 type="button"
//                 variant="outline"
//                 className="text-red-500 px-7 border-neutral-300"
//                 onClick={handleCancel}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 className="bg-black text-white font-normal px-5"
//               >
//                 Create Driver
//               </Button>
//             </div>
//           </form>
//           <ExpiryDatesDialog
//             open={isDialogOpen}
//             onOpenChange={setIsDialogOpen}
//             register={register}
//             errors={errors}
//             trigger={trigger}
//             onSave={handleSaveExpiryDates}
//           />
//           <ToastContainer position="top-right" autoClose={3000} />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default addVehicle;

// "use client";

// import Header from "@/components/Header";
// import Link from "next/link";
// import React from "react";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Controller } from "react-hook-form";
// import { createDriver } from "@/service/fleet";
// import { toast } from "react-toastify";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import ExpiryDatesDialog from "./ExpiryDatesDialog";

function addVehicle({ onCancel }) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    trigger,
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // const handleFileChange1 = (event) => {
  //   const selectedTravelFile = event.target.files[0];
  //   if (selectedTravelFile) {
  //     setVehicleFile(selectedTravelFile);
  //   }
  // };
  const handleFileChange1 = (event) => {
    const selectedFile1 = event.target.files[0];
    if (selectedFile1) {
      setFile2(URL.createObjectURL(selectedFile1));
      setImgFile(selectedFile1);
    }
  };

  const handleFileChangeAadhr = (event) => {
    const selectedAadharFile = event.target.files[0];
    if (selectedAadharFile) {
      setAadharFile(selectedAadharFile);
    }
  };

  const handleFileChangeLcns = (event) => {
    const selectedLicensefile = event.target.files[0];
    if (selectedLicensefile) {
      setLicensefile(selectedLicensefile);
    }
  };

  const handleFileChangeFitns = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Selected file: ", file);
      setFitnessFile(file);
    }
  };

  const handleFileChangEye = (event) => {
    const file = event.target.files[0];
    if (file) {
      //console.log("eyeTestfile : ", file);
      setEyeTestfile(file);
      setEyeTestPreview(URL.createObjectURL(file));
    }
  };

  const handleCancel = () => {
    setLicensefile(null);
    setEyeTestfile(null);
    setIsDialogOpen(false);
    onCancel?.();
  };

  // const handleCancel = () => {
  //   reset();
  //   onCancel?.();
  // };

  const handleSaveExpiryDates = async () => {
    const fieldsToValidate = [
      "licenseInsuranceExpiry",
      "eyeTestCertificateExpiry",
      "aadharExpiry",
      "fitnessCertificateExpiry",
    ];
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setIsDialogOpen(false);
    }
  };

  const onSubmit = async (data) => {
    if (!data.gender) {
      toast.error("gender is required");
      return;
    }
    // if (
    //   !data.licenseEndingDate ||
    //   !data.licenseStartingDate ||
    //   !data.eyeTestCertificateStartingDate ||
    //   !data.eyeTestCertificateEndingDate ||
    //   !data.fCExpiryStaringDate ||
    //   !data.fCExpiryEndingDate
    // ) {
    //   toast.error("Please select all expiry dates");
    //   setIsDialogOpen(true);
    //   return;
    // }
    //console.log("data : ",data)
    const formData = new FormData();

    formData.append("full_name", data.name);
    formData.append("imgupload", imgFile);
    formData.append("email", data.email || "");
    formData.append("contact_number", data.con);
    if (data.dob) {
      formData.append("date_of_birth", new Date(data.dob).toISOString());
    }
    formData.append("gender", data.gender);
    formData.append("address", data.address  || "");
    formData.append("aadhaar_number", data.aadhaar);
    formData.append("license_number", data.license);

    if (data.licenseEndingDate) {
      formData.append(
        "license_expiry_to",
        new Date(data.licenseEndingDate).toISOString()
      );
    }
    if (data.licenseStartingDate) {
      formData.append(
        "license_expiry_from",
        new Date(data.licenseStartingDate).toISOString()
      );
    }
    if (data.eyeTestCertificateStartingDate) {
      formData.append(
        "eye_expiry_from",
        new Date(data.eyeTestCertificateStartingDate).toISOString()
      );
    }
    if (data.eyeTestCertificateEndingDate) {
      formData.append(
        "eye_expiry_to",
        new Date(data.eyeTestCertificateEndingDate).toISOString()
      );
    }
    if (data.fCExpiryStaringDate) {
      formData.append(
        "fitness_expiry_from",
        new Date(data.fCExpiryStaringDate).toISOString()
      );
    }
    if (data.fCExpiryEndingDate) {
      formData.append(
        "fitness_expiry_to",
        new Date(data.fCExpiryEndingDate).toISOString()
      );
    }

    //formData.append("password", data.password);

    if (data.licensefile?.[0]) {
      formData.append("license_file", data.licensefile[0]);
    }

    // if (data.file2?.[0]) {
    //   formData.append("imgupload", data.file2[0]);
    // }

    if (data.fitnessfile?.[0]) {
      formData.append("fitness_file", data.fitnessfile[0]);
    }

    if (data.eyetestfile?.[0]) {
      formData.append("eyeTest_file", data.eyetestfile[0]);
    }

    if (data.aadharfile?.[0]) {
      formData.append("aadhar_file", data.aadharfile[0]);
    }

    //formData.append("filter", data.filter ? "true" : "false");

    // for (let [key, value] of formData.entries()) {
    //   console.log(`${key}:`, value);
    // }
    try {
      const result = await createDriver(formData);
      console.log("Driver created successfully:", result);
      toast.success("Driver added successfully!");
      reset();
      setFile2(null);
      setImgFile(null);
      setLicensefile(null);
      setEyeTestfile(null);
      setAadharFile(null);
      setFitnessFile(null);
    } catch (error) {
      //console.error("Submission failed:", error);
      //console.log("response : ",response)
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
          <p className="text-[13px] font-medium text-neutral-400">
            Manage Vehicle
          </p>
        </Link>
        <Link
          href="/admin/fleet/manage-drivers/add-driver"
          className="flex flex-col items-center gap-y-1 pe-3 border-r border-r-neutral-300 cursor-pointer"
        >
          <p className="text-[13px] font-medium text-black">Manage Drivers</p>
          <div className="bg-red-600 h-0.5 rounded-t-lg w-2/3"></div>
        </Link>
      </div>
      <div className="mt-6 px-2">
        <p className="text-black font-medium text-lg">Add New Driver</p>
        <div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="pt-5 flex flex-col gap-y-7"
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
                        //required
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
                        {...register("name")}
                        placeholder="Enter name"
                        required
                        className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>

                    <Controller
                      name="gender"
                      control={control}
                      //rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <div>
                          <p className="text-[13px] ps-5 pb-1 text-black">
                            Gender
                          </p>
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
                            <p className="text-red-500 text-xs mt-1">
                              {error.message}
                            </p>
                          )}
                        </div>
                      )}
                    />

                    <div>
                      <p className="text-[13px] ps-5 pb-1 text-black">
                        Date of birth
                      </p>
                      <div className="relative w-full">
                        <Input
                          {...register("dob")}
                          id="dob"
                          type="date"
                          //required
                          className="border-neutral-400 text-black placeholder:text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none pr-10 
                                        [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            const dob = document.getElementById("dob");
                            if (dob) {
                              dob.showPicker();
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
                        Contact number
                      </p>
                      <Input
                        {...register("con")}
                        type="number"
                        placeholder="Enter number"
                        required
                        className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>

                    <div>
                      <p className="text-[13px] ps-5 pb-1 text-black">Email</p>
                      <Input
                        {...register("email")}
                        type="email"
                        placeholder="Enter email"
                        //required
                        className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>

                    {/* <div>
                      <p className="text-[13px] ps-5 text-black">Password</p>
                      <Input
                        {...register("password")}
                        placeholder="Enter password"
                        required
                        className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div> */}

                    <div>
                      <p className="text-[13px] ps-5 pb-1 text-black">
                        Aadhaar number
                      </p>
                      <Input
                        {...register("aadhaar")}
                        placeholder="Enter aadhaar"
                        type="number"
                        //required
                        className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>

                    <div>
                      <p className="text-[13px] ps-5 pb-1 text-black">
                        Address
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
                        License Number
                      </p>
                      <Input
                        {...register("license")}
                        //type="number"
                        placeholder="Enter number"
                        required
                        className="border-neutral-400 text-black placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>

                    {/* <div>
                      <p className="text-[13px] ps-5 pb-1 text-black">
                        License expiry
                      </p>
                      <div className="relative w-full">
                        <Input
                          {...register("licenseExp")}
                          id="licenseExp"
                          type="date"
                          required
                          className="border-neutral-400 text-black placeholder:text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 appearance-none pr-10 
                                        [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            const licenseExp =
                              document.getElementById("licenseExp");
                            if (licenseExp) {
                              licenseExp.showPicker();
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
                    </div> */}
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
                      {...register("licensefile")}
                      type="file"
                      onChange={handleFileChangeLcns}
                      className="absolute bottom-2 left-[23px] opacity-0 w-36 h-8 cursor-pointer"
                      required
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
                            <p className="text-xs text-gray-700">
                              {licensefile.name}
                            </p>
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
                      {...register("aadharfile")}
                      type="file"
                      onChange={handleFileChangeAadhr}
                      className="absolute bottom-2 left-[23px] opacity-0 w-36 h-8 cursor-pointer"
                      //required
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
                            <p className="text-xs text-gray-700">
                              {aadharfile.name}
                            </p>
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

                    {/* Invisible file input */}
                    <input
                      id="fitnessfile"
                      type="file"
                      //required
                      {...register("fitnessfile")}
                      onChange={handleFileChangeFitns}
                      className="absolute bottom-2 left-[23px] opacity-0 w-36 h-8 cursor-pointer"
                    />

                    <div>
                      <p className="text-black text-xs pt-1">
                        Fitness Certificate
                      </p>
                      <div className="flex gap-x-2 py-1">
                        {/* Label triggers hidden input */}
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

                  <div className="relative flex gap-x-5 border border-dashed rounded-md py-1">
                    <div className="bg-red-500 w-1 rounded-l-md"></div>
                    <input
                      {...register("eyetestfile")}
                      type="file"
                      onChange={handleFileChangEye}
                      className="absolute bottom-2 left-[23px] opacity-0 w-36 h-8 cursor-pointer"
                      //required
                    />
                    <div>
                      <p className="text-black text-xs pt-1">
                        Eye Test Certificate
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
                        {eyeTestfile && (
                          <div className="flex items-center gap-2 border rounded-md px-2 py-1">
                            <p className="text-xs text-gray-700">
                              {eyeTestfile.name}
                            </p>
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
                Create Driver
              </Button>
            </div>
          </form>
          <ExpiryDatesDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            register={register}
            errors={errors}
            trigger={trigger}
            onSave={handleSaveExpiryDates}
          />
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </div>
    </div>
  );
}

export default addVehicle;
