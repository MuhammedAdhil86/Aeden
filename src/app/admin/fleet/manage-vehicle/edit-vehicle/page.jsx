import React, { Suspense } from "react";
import EditVehicle from "./EditVehicle";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading trip details...</div>}>
      <EditVehicle />
    </Suspense>
  );
}