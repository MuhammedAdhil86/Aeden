// components/booking/Step7.jsx
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function Step7({ register, errors }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedTravelFile = event.target.files[0];
    if (selectedTravelFile) {
      setFile(selectedTravelFile);
    } else {
      setFile(null);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="grid grid-cols-2 gap-8">
        <div>
          <p className="text-[13px] ps-5 pb-1 text-black">File name</p>
          <Input
            {...register("fileName", {
            //   required: "File name is required",
            })}
            placeholder="Enter File name"
            className="border-neutral-400 placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          {errors.fileName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.fileName.message}
            </p>
          )}
        </div>
        <div>
          <p className="text-[13px] ps-5 pb-1 text-black">Category</p>
          <Input
            {...register("fileCategory", {
            //   required: "File name is required",
            })}
            placeholder="Enter File Category"
            className="border-neutral-400 placeholder:text-xs text-xs rounded-lg mt-1 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          {errors.fileCategory && (
            <p className="text-red-500 text-xs mt-1">
              {errors.fileCategory.message}
            </p>
          )}
        </div>
      </div>

      <div className="relative flex gap-x-5 border border-dashed rounded-md py-1">
        <div className="bg-red-500 w-1 rounded-l-md"></div>{" "}
        <input
          {...register("file")}
          type="file"
          onChange={handleFileChange}
          className="absolute bottom-2 left-[23px] opacity-0 w-36 h-8 cursor-pointer"
         //required
        />
        <div>
          <p className="text-black text-xs pt-1">File upload</p>
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
            {file && (
              <div className="flex items-center gap-2 border rounded-md px-2 py-1">
                <p className="text-xs text-gray-700">{file.name}</p>
                <button
                  type="button"
                  className="text-black hover:text-red-700"
                  onClick={() => setFile(null)}
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
  );
}
