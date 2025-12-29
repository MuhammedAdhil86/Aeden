import React, { Suspense } from "react";
import AssetDetail from "./AssetDetail";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-black">Loading trip details...</div>}>
      <AssetDetail />
    </Suspense>
  );
}