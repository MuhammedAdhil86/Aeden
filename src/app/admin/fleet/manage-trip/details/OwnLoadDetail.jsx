import React from "react";

function OwnLoadDetail(trip) {
  //console.log("trips in detail page : ", trip.trip);
  return (
    <div className="py-10 grid grid-cols-6 gap-y-10 border-b">
      <div>
        <p className="text-[10px] font-medium text-gray-600">Branch</p>
        <p className="text-xs pt-1 text-black font-medium uppercase">
          {trip.trip.branch}
        </p>
      </div>
      <div>
        <p className="text-[10px] font-medium text-gray-600">Customer Name</p>
        <p className="text-xs pt-1 text-black font-medium uppercase	">
          {trip.trip.customer_name}
        </p>
      </div>
      <div>
        <p className="text-[10px] font-medium text-gray-600">Fuel (ltr)</p>
        <p className="text-xs pt-1 text-black font-medium">{trip.trip.diesel_ltr}</p>
      </div>
      <div>
        <p className="text-[10px] font-medium text-gray-600">
          Fuel Amount (INR)
        </p>
        <p className="text-xs pt-1 text-black font-medium">
          {trip.trip.diesel_amount}
        </p>
      </div>
      <div>
        <p className="text-[10px] font-medium text-gray-600">
          Freight charge (INR)
        </p>
        <p className="text-xs pt-1 text-black font-medium">
          {trip.trip.freight}
        </p>
      </div>
      <div>
        <p className="text-[10px] font-medium text-gray-600">Trip Sheet No</p>
        <p className="text-xs pt-1 text-black font-medium">
          {trip.trip.trip_sheet_no}
        </p>
      </div>
    </div>
  );
}

export default OwnLoadDetail;
