"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPurchase } from "@/service/procurements";

export default function PurchaseDetailsPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchDetails() {
      try {
        const res = await getPurchase(id);
        setData(res.data);
      } catch (err) {
        console.error("Error fetching purchase details", err);
      }
    }

    if (id) fetchDetails();
  }, [id]);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-4">Purchase Detail</h1>
      <p><strong>UIN:</strong> {data.uin}</p>
      <p><strong>Party Name:</strong> {data.party_name}</p>
      <p><strong>Category:</strong> {data.category?.category_name}</p>
      <p><strong>Product:</strong> {data.products?.name}</p>
      <p><strong>Address:</strong> {data.address}</p>
      {/* Add more fields as needed */}
    </div>
  );
}
