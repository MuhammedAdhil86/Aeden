import React, { Suspense } from "react";
import BookingDetails from "./BookingDetails";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading Driver details...</div>}>
      <BookingDetails />
    </Suspense>
  );
}