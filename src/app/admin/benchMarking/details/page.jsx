"use client";

import { Suspense } from "react";
import BenchMarkDetail from "./components/benchmarkdetail";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className=" text-center text-gray-500">
          Loading Dashboard...
        </div>
      }
    >
      <BenchMarkDetail />
    </Suspense>
  );
}
