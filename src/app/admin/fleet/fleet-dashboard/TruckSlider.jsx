import { fetchTruck } from "@/service/fleet";
import Link from "next/link";
import { useEffect, useState } from "react";

function TruckSlider() {
  const [trucks, setTrucks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentTruck = trucks[currentIndex] || {};

  useEffect(() => {
    const loadTrucks = async () => {
      const data = await fetchTruck();
      console.log("data : ", data);
      setTrucks(data || []);
    };
    loadTrucks();
  }, []);

  const handleNext = () => {
    if (currentIndex < trucks.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  console.log("currentTruck : ", currentTruck);

  return (
    <div className="bg-white w-full flex flex-col rounded-lg p-5">
      <div className="w-full flex justify-between">
        <div className="border-b pb-1">
          <div className="flex gap-x-3">
            <p className="text-black font-semibold">
              {currentTruck.register_number}
            </p>
            <div
              className={`px-2 flex items-center rounded-md ${
                currentTruck.availability
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-200 text-black"
              }`}
            >
              <p className="text-xs font-medium">
                {currentTruck.availability ? "Available" : "In trip"}
              </p>
            </div>
          </div>
          <p className="text-neutral-600 text-xs font-medium">Reg No</p>
        </div>
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="22px"
            viewBox="0 -960 960 960"
            width="22px"
            className="fill-neutral-600"
          >
            <path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z" />
          </svg>
        </div>
      </div>
      <div className="w-full grid grid-cols-2">
        <div className="w-full h-full flex items-end">
          <div className="w-full flex flex-col gap-y-6">
            <div className="flex flex-col gap-y-1">
              <p className="text-neutral-600 font-medium text-[11px]">Model</p>
              <p className="text-black font-medium text-[13px]">
                {currentTruck.model}{" "}
              </p>
            </div>
            <div className="w-full flex justify-between">
              <div className="flex flex-col gap-y-2">
                <p className="text-neutral-600 font-medium text-[11px]">
                  Total Running Km
                </p>
                <p className="text-black font-semibold text-sm">
                  {currentTruck.odometer_km} km
                </p>
              </div>
              <div className="flex flex-col gap-y-2">
                <p className="text-neutral-600 font-medium text-[11px]">
                  Mileage
                </p>
                <p className="text-black font-semibold text-sm">
                  {currentTruck.mileage_range
                    ? currentTruck.mileage_range
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-end">
          <img src="/truck.png" />
        </div>
      </div>
      <div className="border rounded-md mt-5 grid grid-cols-[40%_auto_40%] px-5 py-5 gap-x-8">
        <div className="flex flex-col gap-y-2">
          <p className="text-black text-sm font-medium">Revenue</p>
          <div className="flex gap-x-3">
            <p className="text-black text-sm font-semibold">
              {currentTruck.revenue ? currentTruck.revenue : "-"}
            </p>
            <div
              className={`${
                currentTruck.revenue_percentage_change < 0
                  ? "bg-red-100"
                  : "bg-green-100"
              } rounded-full mb-2 px-1 flex gap-x-1`}
            >
              <img
                src="/red-down.svg"
                className={`${
                  currentTruck.revenue_percentage_change < 0 ? "h-3" : " hidden"
                }`}
              />
              <img
                src="/green-up.svg"
                className={`${
                  currentTruck.revenue_percentage_change > 0 ? "h-3" : " hidden"
                }`}
              />
              <p
                className={`text-[10px] font-semibold ${
                  currentTruck.revenue_percentage_change < 0
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {Math.abs(currentTruck.revenue_percentage_change || 0).toFixed(
                  0
                )}{" "}
                %
              </p>
            </div>
          </div>
          <p className="text-xs font-medium text-neutral-600">
            Total Vehicle Revenue
          </p>
          <Link href='/admin/fleet/related-report/expense' className="bg-neutral-200 rounded-md py-2 px-3 inline-block w-fit text-black text-xs font-medium">
            View Detail
          </Link>
        </div>
        <div className="h-full flex flex-col justify-center">
          <div className="h-[80%] w-[1px] bg-neutral-200"></div>
        </div>
        <div className="flex flex-col gap-y-2">
          <p className="text-black text-sm font-medium">Expense</p>
          <div className="flex gap-x-3">
            <p className="text-black text-sm font-semibold">
              {currentTruck.total_expenses ? currentTruck.total_expenses : "-"}
            </p>
            <div
              className={`${
                currentTruck.expense_percentage_change < 0 ? "bg-red-100" : "bg-green-100"
              } rounded-full mb-2 px-1 flex gap-x-1`}
            >
              <img
                src="/red-down.svg"
                className={`${currentTruck.expense_percentage_change < 0 ? "h-3" : " hidden"}`}
              />
              <img
                src="/green-up.svg"
                className={`${currentTruck.expense_percentage_change > 0 ? "h-3" : " hidden"}`}
              />
              <p
                className={`text-[10px] font-semibold ${
                  currentTruck.expense_percentage_change < 0 ? "text-red-500" : "text-green-500"
                }`}
              >
                {Math.abs(currentTruck.expense_percentage_change || 0).toFixed(0)} %
              </p>
            </div>
          </div>
          <p className="text-xs font-medium text-neutral-600">
            based on Last month
          </p>
          <Link href='/admin/fleet/related-report/expense' className="bg-neutral-200 rounded-md py-2 px-3 inline-block w-fit text-black text-xs font-medium">
            View Detail
          </Link>
        </div>
      </div>
      <div className="w-full flex justify-between mt-5">
        <div className="flex gap-x-3">
          <div
            className={`border rounded-lg h-10 w-10 flex justify-center items-center ${
              currentIndex === 0 ? "bg-white cursor-not-allowed" : ""
            }`}
            onClick={currentIndex === 0 ? null : handlePrev}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              className={`${
                currentIndex === 0 ? "fill-neutral-200" : "fill-neutral-600"
              }`}
            >
              <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
            </svg>
          </div>

          <div
            className={`border rounded-lg h-10 w-10 flex justify-center items-center ${
              currentIndex === trucks.length - 1
                ? " cursor-not-allowed "
                : "bg-black"
            }`}
            onClick={currentIndex === trucks.length - 1 ? null : handleNext}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              className={`${
                currentIndex === trucks.length - 1
                  ? "fill-neutral-200"
                  : "fill-white"
              }`}
            >
              <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
            </svg>
          </div>
        </div>
        <Link
          href="/admin/fleet"
          className="bg-black text-xs px-4 text-white rounded-md flex justify-center items-center"
        >
          More Truck Details
        </Link>
      </div>
    </div>
  );
}

export default TruckSlider;
