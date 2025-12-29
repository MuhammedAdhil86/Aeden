import { Input } from "@/components/ui/input";
import React from "react";

function EditRelatedDocuments({
  register,
  travelfile,
  otherfile,
  handleFileChange1,
  handleFileChange3,
  setTravelFile,
  setOtherFile,
}) {
  return (
   <div className="grid grid-cols-2 gap-x-5 gap-y-5 mt-5">
      {/* Travel Insurance File */}
      <div className="relative flex gap-x-5 border border-dashed rounded-md py-1">
        <div className="bg-red-500 w-1 rounded-l-md"></div>
        <input
          {...register("travelfile")}
          type="file"
          onChange={handleFileChange1}
          className="absolute bottom-2 left-[23px] opacity-0 w-36 h-8 cursor-pointer"
        />
        <div>
          <p className="text-black text-xs pt-1">Trip Insurance</p>
          <div className="flex gap-x-2 py-1 items-center">
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
            {travelfile && (
              <div className="flex items-center gap-2 border rounded-md px-2 py-1 max-w-[150px]">
                <p
                  className="text-xs text-gray-700 truncate"
                  title={travelfile.name}
                >
                  {travelfile.name}
                </p>
                <button
                  type="button"
                  className="text-black hover:text-red-700"
                  onClick={() => setTravelFile(null)}
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

      {/* Other Related Documents File */}
      <div className="relative flex gap-x-5 border border-dashed rounded-md py-1">
        <div className="bg-red-500 w-1 rounded-l-md"></div>
        <input
          {...register("otherfile")}
          type="file"
          onChange={handleFileChange3}
          className="absolute bottom-2 left-[23px] opacity-0 w-36 h-8 cursor-pointer"
        />
        <div>
          <p className="text-black text-xs pt-1">Other related documents</p>
          <div className="flex gap-x-2 py-1 items-center">
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
            {otherfile && (
              <div className="flex gap-x-5 items-center">
                <div className="flex items-center gap-2 border rounded-md px-2 py-1 max-w-[150px]">
                  <p
                    className="text-xs text-gray-700 truncate"
                    title={otherfile.name}
                  >
                    {otherfile.name}
                  </p>
                  <button
                    type="button"
                    className="text-black hover:text-red-700"
                    onClick={() => setOtherFile(null)}
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
                <Input
                  {...register("documentTitle")}
                  placeholder="Add doc. title"
                  className="border-neutral-400 max-w-40 text-black placeholder:text-xs text-xs rounded-lg focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditRelatedDocuments;
