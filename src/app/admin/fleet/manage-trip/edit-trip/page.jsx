import React, { Suspense } from "react";
import EditTrip from "./EditTrip";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading trip details...</div>}>
      <EditTrip />
    </Suspense>
  );
}