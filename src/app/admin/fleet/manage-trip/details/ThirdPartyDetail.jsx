import React from 'react'

function ThirdPartyDetail(trip) {
    console.log("trips in detail page : ", trip.trip);

  return (
    <div className="py-10 grid grid-cols-6 gap-y-10 border-b">
      <div>
        <p className="text-[10px] font-medium text-gray-600">Quantity</p>
        <p className="text-xs pt-1 text-black font-medium">
          {trip.trip.qty}
        </p>
      </div>
      <div>
        <p className="text-[10px] font-medium text-gray-600">Commodity</p>
        <p className="text-xs pt-1 text-black font-medium">
          {trip.trip.commodity}
        </p>
      </div>
      <div>
        <p className="text-[10px] font-medium text-gray-600">Client</p>
        <p className="text-xs pt-1 text-black font-medium uppercase	">
          {trip.trip.client}
        </p>
      </div>
      <div>
        <p className="text-[10px] font-medium text-gray-600">Commission</p>
        <p className="text-xs pt-1 text-black font-medium">
          {trip.trip.commission}
        </p>
      </div>
      <div>
        <p className="text-[10px] font-medium text-gray-600">Committed Rate</p>
        <p className="text-xs pt-1 text-black font-medium">
          {trip.trip.committed_rate}
        </p>
      </div>
      <div>
        <p className="text-[10px] font-medium text-gray-600">
          Advance Received
        </p>
        <p className="text-xs pt-1 text-black font-medium">
          {trip.trip.is_advance_paid ? "Yes" : "No"}
        </p>
      </div>
      <div>
        <p className="text-[10px] font-medium text-gray-600">
          Advanced Received Amount
        </p>
        <p className="text-xs pt-1 text-black font-medium">
          {trip.trip.advance_received}
        </p>
      </div>
      <div>
        <p className="text-[10px] font-medium text-gray-600">
          Advanced Received Date
        </p>
        <p className="text-xs pt-1 text-black font-medium">
          {trip.trip.advance_received_date
            ? new Date(trip.trip.advance_received_date).toLocaleDateString(
                "en-GB"
              )
            : "N/A"}
        </p>
      </div>
      <div>
        <p className="text-[10px] font-medium text-gray-600">Balance Amount</p>
        <p className="text-xs pt-1 text-black font-medium">
          {trip.trip.balance_payable}
        </p>
      </div>
    </div>
  );
}

export default ThirdPartyDetail