"use client";

import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";


const chartConfig = {
  TotalProfit: {
    label: "Total Profit",
    color: "#737373",
  },
};

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function TripBarChart({ trips = [] }) {

  //console.log("trip graph data :", trips);
  
  const data = Array.isArray(trips)
    ? trips.map((trip) => ({
        month: monthNames[trip.month-1] || trip.month,
        TotalProfit: Number(trip.profit) || 0,
      }))
    : [];

  return (
    <ChartContainer config={chartConfig} className="h-[350px] w-[90%]">
      <BarChart accessibilityLayer data={data} barCategoryGap="32%">
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <Tooltip className='bg-white text-black' content={<ChartTooltipContent />} />
        <Bar dataKey="TotalProfit" fill="var(--color-TotalProfit)" radius={[7, 7, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}
