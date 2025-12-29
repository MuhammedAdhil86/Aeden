import React, { Suspense } from "react";
import ExpenseDetail from "./ExpenseDetail";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-black">Loading trip details...</div>}>
      <ExpenseDetail />
    </Suspense>
  );
}