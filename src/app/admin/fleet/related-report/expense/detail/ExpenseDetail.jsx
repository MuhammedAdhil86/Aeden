// "use client";

// import React, { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import Header from "@/components/Header";
// import { fetchExpenseById } from "@/service/report";

// export default function ExpenseDetail() {
//   const searchParams = useSearchParams();
//   const id = Number(searchParams.get("id"));
//   const truckId = Number(searchParams.get("truckid"));
//   const [trip, setTrip] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   //console.log("truckId : ",id)

//   useEffect(() => {
//     const getExpense = async () => {
//       try {
//         setLoading(true);
//         const data = await fetchExpenseById(id);
//         //console.log("expense By Id : ", data);

//         if (!data || data.length === 0) {
//           throw new Error("No expense data found for this ID");
//         }

//         // Aggregate expenses if multiple records are returned
//         const aggregatedData = data.reduce(
//           (acc, expense) => {
//             return {
//               register_number:
//                 expense.truckid?.register_number || acc.register_number,
//               vehicle_name: expense.truckid?.vehicle_name || acc.vehicle_name,
//               number_of_trips:
//                 (acc.number_of_trips || 0) + (expense.number_of_trips || 0),
//               profit: (acc.profit || 0) + (expense.profit || 0),
//               diesel_amount:
//                 (acc.diesel_amount || 0) + (expense.diesel_amount || 0),
//               advance_received:
//                 (acc.advance_received || 0) + (expense.advance_received || 0),
//               greasing_air_check:
//                 (acc.greasing_air_check || 0) +
//                 (expense.greasing_air_check || 0),
//               adblue: (acc.adblue || 0) + (expense.adblue || 0),
//               gate_pass: (acc.gate_pass || 0) + (expense.gate_pass || 0),
//               unloading_charge_expense:
//                 (acc.unloading_charge_expense || 0) +
//                 (expense.unloading_charge_expense || 0),
//               road_expense:
//                 (acc.road_expense || 0) + (expense.road_expense || 0),
//               other_expense:
//                 (acc.other_expense || 0) + (expense.other_expense || 0),
//             };
//           },
//           {
//             register_number: "N/A",
//             vehicle_name: "N/A",
//             number_of_trips: 0,
//             profit: 0,
//             diesel_amount: 0,
//             advance_received: 0,
//             greasing_air_check: 0,
//             adblue: 0,
//             gate_pass: 0,
//             unloading_charge_expense: 0,
//             road_expense: 0,
//             other_expense: 0,
//           }
//         );

//         setTrip(aggregatedData);
//       } catch (err) {
//         setError(err.message || "Failed to fetch expense");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       getExpense();
//     } else {
//       setError("No expense ID provided");
//       setLoading(false);
//     }
//   }, [id]);

//   if (loading) return <div className="text-black">Loading...</div>;
//   if (error) return <div>{error}</div>;

//   // Calculate total expenses
//   const totalExpenses =
//     (trip.diesel_amount || 0) +
//     (trip.advance_received || 0) +
//     (trip.greasing_air_check || 0) +
//     (trip.adblue || 0) +
//     (trip.gate_pass || 0) +
//     (trip.unloading_charge_expense || 0) +
//     (trip.road_expense || 0) +
//     (trip.other_expense || 0);

//   return (
//     <div>
//       <Header />
//       <div className="pt-5 px-5 w-full">
//         <div className="w-1/2 flex justify-between">
//           <p className="text-black font-medium pt-1">Expense Detail</p>
//         </div>
//         <div className="mt-5 pt-5 px-10 w-1/2 bg-white rounded-md uppercase">
//           <div className="w-full flex justify-between items-center">
//             <p className="text-black">{trip.register_number}</p>

//             <div className="flex items-center gap-x-5">
//               <p className="text-neutral-600 font-medium text-xs">Profit</p>
//               <p className="text-black font-medium text-sm">
//                 ₹ {trip.profit.toLocaleString()}
//               </p>
//             </div>
//           </div>
//           <div className="mt-3 flex flex-col gap-y-5 border-t py-6">
//             <div className="w-full grid grid-cols-[50%_auto] gap-x-10">
//               <p className="text-neutral-600 font-medium text-xs">
//                 Vehicle Name
//               </p>
//               <p className="text-black font-medium text-sm">
//                 {trip.vehicle_name}
//               </p>
//             </div>
//             <div className="w-full grid grid-cols-[50%_auto] gap-x-10">
//               <p className="text-neutral-600 font-medium text-xs">
//                 Number of Trips
//               </p>
//               <p className="text-black font-medium text-sm">
//                 {trip.number_of_trips}
//               </p>
//             </div>
//           </div>
//           <div className="flex justify-between gap-y-5 border-b border-t py-2">
//             <p className="text-black font-medium text-sm">Particulars</p>
//             <p className="text-black font-medium text-sm">Amount</p>
//           </div>
//           <div className="mt-3 flex flex-col gap-y-3 border-b py-3">
//             <div className="w-full flex justify-between">
//               <p className="text-neutral-600 font-medium text-xs">
//                 Diesel Amount
//               </p>
//               <p className="text-black font-medium text-sm">
//                 {trip.number_of_trips === 0
//                   ? "Not Started yet"
//                   : `₹ ${(trip.diesel_amount || 0).toLocaleString()}`}
//               </p>
//             </div>
//             <div className="w-full flex justify-between">
//               <p className="text-neutral-600 font-medium text-xs">
//                 Advance Received
//               </p>
//               <p className="text-black font-medium text-sm">
//                 {trip.number_of_trips === 0
//                   ? "Not Started yet"
//                   : `₹ ${(trip.advance_received || 0).toLocaleString()}`}
//               </p>
//             </div>
//             <div className="w-full flex justify-between">
//               <p className="text-neutral-600 font-medium text-xs">
//                 Greasing Air Check
//               </p>
//               <p className="text-black font-medium text-sm">
//                 {trip.number_of_trips === 0
//                   ? "Not Started yet"
//                   : `₹ ${(trip.greasing_air_check || 0).toLocaleString()}`}
//               </p>
//             </div>
//             <div className="w-full flex justify-between">
//               <p className="text-neutral-600 font-medium text-xs">AdBlue</p>
//               <p className="text-black font-medium text-sm">
//                 {trip.number_of_trips === 0
//                   ? "Not Started yet"
//                   : `₹ ${(trip.adblue || 0).toLocaleString()}`}
//               </p>
//             </div>
//             <div className="w-full flex justify-between">
//               <p className="text-neutral-600 font-medium text-xs">Gate Pass</p>
//               <p className="text-black font-medium text-sm">
//                 {trip.number_of_trips === 0
//                   ? "Not Started yet"
//                   : `₹ ${(trip.gate_pass || 0).toLocaleString()}`}
//               </p>
//             </div>
//             <div className="w-full flex justify-between">
//               <p className="text-neutral-600 font-medium text-xs">
//                 Unloading Charge Expense
//               </p>
//               <p className="text-black font-medium text-sm">
//                 {trip.number_of_trips === 0
//                   ? "Not Started yet"
//                   : `₹ ${(
//                       trip.unloading_charge_expense || 0
//                     ).toLocaleString()}`}
//               </p>
//             </div>
//             <div className="w-full flex justify-between">
//               <p className="text-neutral-600 font-medium text-xs">
//                 Road Expense
//               </p>
//               <p className="text-black font-medium text-sm">
//                 {trip.number_of_trips === 0
//                   ? "Not Started yet"
//                   : `₹ ${(trip.road_expense || 0).toLocaleString()}`}
//               </p>
//             </div>
//             <div className="w-full flex justify-between">
//               <p className="text-neutral-600 font-medium text-xs">
//                 Other Expense
//               </p>
//               <p className="text-black font-medium text-sm">
//                 {trip.number_of_trips === 0
//                   ? "Not Started yet"
//                   : `₹ ${(trip.other_expense || 0).toLocaleString()}`}
//               </p>
//             </div>
//           </div>

//           <div className="w-full flex justify-between py-3">
//             <p className="text-neutral-600 font-medium text-xs">
//               Total Fleet Expenses
//             </p>
//             <p className="text-black font-semibold">
//               ₹ {totalExpenses.toLocaleString()}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import { fetchExpenseByTruckId } from "@/service/fleet";

export default function ExpenseDetail() {
  const searchParams = useSearchParams();
  const tripId = Number(searchParams.get("id")); // This is trip_id from URL
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  console.log("Trip ID from URL:", tripId);

  useEffect(() => {
    const getExpense = async () => {
      try {
        setLoading(true);
        console.log("Fetching expenses for trip ID:", tripId);
        
        const data = await fetchExpenseByTruckId(tripId);
        console.log("Full API response:", data);
        console.log("Data type:", typeof data);
        console.log("Is array?", Array.isArray(data));

        if (!data) {
          console.log("API returned null or undefined");
          throw new Error("No data returned from API");
        }

        let aggregatedData;

        // Check if data is an array or single object
        if (Array.isArray(data)) {
          if (data.length === 0) {
            console.log("API returned empty array");
            throw new Error("No expense records found for this trip");
          }

          console.log("Number of records found:", data.length);
          console.log("First record:", data[0]);

          // Aggregate expenses if multiple records
          aggregatedData = data.reduce(
            (acc, expense) => {
              return {
                register_number:
                  expense.truckid?.register_number || acc.register_number,
                vehicle_name: expense.truckid?.vehicle_name || acc.vehicle_name,
                number_of_trips:
                  (acc.number_of_trips || 0) + (expense.number_of_trips || 0),
                profit: (acc.profit || 0) + (expense.profit || 0),
                diesel_amount:
                  (acc.diesel_amount || 0) + (parseFloat(expense.diesel_amount) || 0),
                advance_received:
                  (acc.advance_received || 0) + (parseFloat(expense.advance_received) || 0),
                greasing_air_check:
                  (acc.greasing_air_check || 0) + (parseFloat(expense.greasing_air_check) || 0),
                adblue: (acc.adblue || 0) + (parseFloat(expense.adblue) || 0),
                gate_pass: (acc.gate_pass || 0) + (parseFloat(expense.gate_pass) || 0),
                unloading_charge_expense:
                  (acc.unloading_charge_expense || 0) + (parseFloat(expense.unloading_charge_expense) || 0),
                road_expense:
                  (acc.road_expense || 0) + (parseFloat(expense.road_expense) || 0),
                other_expense:
                  (acc.other_expense || 0) + (parseFloat(expense.other_expense) || 0),
              };
            },
            {
              register_number: "N/A",
              vehicle_name: "N/A",
              number_of_trips: 0,
              profit: 0,
              diesel_amount: 0,
              advance_received: 0,
              greasing_air_check: 0,
              adblue: 0,
              gate_pass: 0,
              unloading_charge_expense: 0,
              road_expense: 0,
              other_expense: 0,
            }
          );
        } else {
          // Handle single object response
          console.log("Single object response:", data);
          aggregatedData = {
            register_number: data.truckid?.register_number || "N/A",
            vehicle_name: data.truckid?.vehicle_name || "N/A",
            number_of_trips: data.number_of_trips || 0,
            profit: data.profit || 0,
            diesel_amount: parseFloat(data.diesel_amount) || 0,
            advance_received: parseFloat(data.advance_received) || 0,
            greasing_air_check: parseFloat(data.greasing_air_check) || 0,
            adblue: parseFloat(data.adblue) || 0,
            gate_pass: parseFloat(data.gate_pass) || 0,
            unloading_charge_expense: parseFloat(data.unloading_charge_expense) || 0,
            road_expense: parseFloat(data.road_expense) || 0,
            other_expense: parseFloat(data.other_expense) || 0,
          };
        }

        console.log("Aggregated Data:", aggregatedData);
        setTrip(aggregatedData);
      } catch (err) {
        console.error("Full error in getExpense:", err);
        console.error("Error message:", err.message);
        console.error("Error stack:", err.stack);
        setError(err.message || "Failed to fetch expense details");
      } finally {
        setLoading(false);
      }
    };

    if (tripId && tripId > 0) {
      getExpense();
    } else {
      console.log("Invalid trip ID:", tripId);
      setError("No valid trip ID provided");
      setLoading(false);
    }
  }, [tripId]);

  if (loading) return (
    <div>
      <Header />
      <div className="pt-5 px-5">
        <div className="text-black">Loading expense details...</div>
      </div>
    </div>
  );
  
  if (error) return (
    <div>
      <Header />
      <div className="pt-5 px-5">
        <div className="text-red-500">Error: {error}</div>
      </div>
    </div>
  );

  if (!trip) return (
    <div>
      <Header />
      <div className="pt-5 px-5">
        <div className="text-black">No trip data available</div>
      </div>
    </div>
  );

  // Calculate total expenses
  const totalExpenses =
    (trip.diesel_amount || 0) +
    (trip.advance_received || 0) +
    (trip.greasing_air_check || 0) +
    (trip.adblue || 0) +
    (trip.gate_pass || 0) +
    (trip.unloading_charge_expense || 0) +
    (trip.road_expense || 0) +
    (trip.other_expense || 0);

  return (
    <div>
      <Header />
      <div className="pt-5 px-5 w-full">
        <div className="w-1/2 flex justify-between">
          <p className="text-black font-medium pt-1">Expense Detail</p>
        </div>
        <div className="mt-5 pt-5 px-10 w-1/2 bg-white rounded-md uppercase">
          <div className="w-full flex justify-between items-center">
            <p className="text-black">{trip.register_number}</p>

            <div className="flex items-center gap-x-5">
              <p className="text-neutral-600 font-medium text-xs">Profit</p>
              <p className="text-black font-medium text-sm">
                ₹ {trip.profit.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="mt-3 flex flex-col gap-y-5 border-t py-6">
            <div className="w-full grid grid-cols-[50%_auto] gap-x-10">
              <p className="text-neutral-600 font-medium text-xs">
                Vehicle Name
              </p>
              <p className="text-black font-medium text-sm">
                {trip.vehicle_name}
              </p>
            </div>
            <div className="w-full grid grid-cols-[50%_auto] gap-x-10">
              <p className="text-neutral-600 font-medium text-xs">
                Number of Trips
              </p>
              <p className="text-black font-medium text-sm">
                {trip.number_of_trips}
              </p>
            </div>
          </div>
          <div className="flex justify-between gap-y-5 border-b border-t py-2">
            <p className="text-black font-medium text-sm">Particulars</p>
            <p className="text-black font-medium text-sm">Amount</p>
          </div>
          <div className="mt-3 flex flex-col gap-y-3 border-b py-3">
            <div className="w-full flex justify-between">
              <p className="text-neutral-600 font-medium text-xs">
                Diesel Amount
              </p>
              <p className="text-black font-medium text-sm">
                {trip.number_of_trips === 0
                  ? "Not Started yet"
                  : `₹ ${(trip.diesel_amount || 0).toLocaleString()}`}
              </p>
            </div>
            <div className="w-full flex justify-between">
              <p className="text-neutral-600 font-medium text-xs">
                Advance Received
              </p>
              <p className="text-black font-medium text-sm">
                {trip.number_of_trips === 0
                  ? "Not Started yet"
                  : `₹ ${(trip.advance_received || 0).toLocaleString()}`}
              </p>
            </div>
            <div className="w-full flex justify-between">
              <p className="text-neutral-600 font-medium text-xs">
                Greasing Air Check
              </p>
              <p className="text-black font-medium text-sm">
                {trip.number_of_trips === 0
                  ? "Not Started yet"
                  : `₹ ${(trip.greasing_air_check || 0).toLocaleString()}`}
              </p>
            </div>
            <div className="w-full flex justify-between">
              <p className="text-neutral-600 font-medium text-xs">AdBlue</p>
              <p className="text-black font-medium text-sm">
                {trip.number_of_trips === 0
                  ? "Not Started yet"
                  : `₹ ${(trip.adblue || 0).toLocaleString()}`}
              </p>
            </div>
            <div className="w-full flex justify-between">
              <p className="text-neutral-600 font-medium text-xs">Gate Pass</p>
              <p className="text-black font-medium text-sm">
                {trip.number_of_trips === 0
                  ? "Not Started yet"
                  : `₹ ${(trip.gate_pass || 0).toLocaleString()}`}
              </p>
            </div>
            <div className="w-full flex justify-between">
              <p className="text-neutral-600 font-medium text-xs">
                Unloading Charge Expense
              </p>
              <p className="text-black font-medium text-sm">
                {trip.number_of_trips === 0
                  ? "Not Started yet"
                  : `₹ ${(
                      trip.unloading_charge_expense || 0
                    ).toLocaleString()}`}
              </p>
            </div>
            <div className="w-full flex justify-between">
              <p className="text-neutral-600 font-medium text-xs">
                Road Expense
              </p>
              <p className="text-black font-medium text-sm">
                {trip.number_of_trips === 0
                  ? "Not Started yet"
                  : `₹ ${(trip.road_expense || 0).toLocaleString()}`}
              </p>
            </div>
            <div className="w-full flex justify-between">
              <p className="text-neutral-600 font-medium text-xs">
                Other Expense
              </p>
              <p className="text-black font-medium text-sm">
                {trip.number_of_trips === 0
                  ? "Not Started yet"
                  : `₹ ${(trip.other_expense || 0).toLocaleString()}`}
              </p>
            </div>
          </div>

          <div className="w-full flex justify-between py-3">
            <p className="text-neutral-600 font-medium text-xs">
              Total Fleet Expenses
            </p>
            <p className="text-black font-semibold">
              ₹ {totalExpenses.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}