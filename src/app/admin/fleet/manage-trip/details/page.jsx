import React, { Suspense } from "react";
import TripDetails from "./TripDetails";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-black">Loading trip details...</div>}>
      <TripDetails />
    </Suspense>
  );
}