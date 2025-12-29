import React, { Suspense } from "react";
import IdleDetail from "./ServiceDetail";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-black">Loading trip details...</div>}>
      <IdleDetail />
    </Suspense>
  );
}