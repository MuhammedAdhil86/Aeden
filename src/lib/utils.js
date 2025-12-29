import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


export function formatVariationData(apiData) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const grouped = {};

  apiData.forEach(item => {
    const date = new Date(item.date); // change this to item.createdAt if needed
    const month = monthNames[date.getMonth()];
    const price = Number(item.price);

    if (!grouped[month]) grouped[month] = [];
    grouped[month].push(price);
  });

  return Object.keys(grouped).map(month => {
    const prices = grouped[month];
    return {
      month,
      minPrice: Math.min(...prices),
      avgPrice: prices.reduce((a, b) => a + b, 0) / prices.length,
      maxPrice: Math.max(...prices),
    };
  });
}

