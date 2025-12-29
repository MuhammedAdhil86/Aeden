"use client";

import dynamic from "next/dynamic";

const PurchaseDetailsPage = dynamic(
  () => import("./PurchaseDetailsPage"), // relative import
  { ssr: false }
);

export default function Page() {
  return <PurchaseDetailsPage />;
}
