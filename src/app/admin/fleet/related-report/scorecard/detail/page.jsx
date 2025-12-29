import React, { Suspense } from "react";
import AccidentDetail from "./AccidentDetail";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-black">Loading trip details...</div>}>
      <AccidentDetail />
    </Suspense>
  );
}