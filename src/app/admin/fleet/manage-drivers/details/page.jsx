import React, { Suspense } from "react";
import DriverDetails from "./DriverDetails";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading Driver details...</div>}>
      <DriverDetails />
    </Suspense>
  );
}