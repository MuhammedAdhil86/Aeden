import React, { Suspense } from "react";
import EditDriver from "./EditDriver";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading trip details...</div>}>
      <EditDriver />
    </Suspense>
  );
}