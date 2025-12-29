// src/components/Sidebar.jsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Sidebar({ activePage, setActivePage }) {
  const pathname = usePathname();

  const sidebarItems = [
    {
      category: "General",
      items: [
        { name: "Dashboard", path: "/admin/dashboard", iconType: "dashboard" },
      ],
    },
    {
      category: "Logistics",
      items: [
        { name: "Procurement", path: "/admin/procurement" },
        { name: "Booking", path: "/admin/booking" },
        { name: "Tracking", path: "/admin/tracking" },
        { name: "Fleet", path: "/admin/fleet" },
      ],
    },
    {
      category: "Sales",
      items: [
        { name: "Dashboard", path: "/admin/sales-dashboard" },
        { name: "Stock", path: "/admin/stock" },
        { name: "Orders", path: "/admin/orders" },
        { name: "BenchMarking", path: "/admin/benchMarking" },
        { name: "Demand Projection", path: "/admin/demand_projection" },
        { name: "Pricing", path: "/admin/pricing" },
      ],
    },
  ];

  const isActiveItem = (itemPath) => {
    if (pathname === itemPath) return true;
    if (itemPath !== "/admin/dashboard" && pathname.startsWith(`${itemPath}/`))
      return true;
    return false;
  };

  return (
    <div className="bg-black h-screen w-64 p-5 flex flex-col gap-y-5">
      <div>
        <img src="/aeden_white_logo.svg" className="h-5" alt="Logo" />
      </div>

      {sidebarItems.map((section) => (
        <div
          key={section.category}
          className="border-t border-t-neutral-800 flex flex-col gap-y-3"
        >
          <p className="text-neutral-400 text-xs pt-3">{section.category}</p>

          {section.items.map((item) => {
            const active = isActiveItem(item.path);

            return (
              <Link href={item.path} key={item.name}>
                <div
                  onClick={() => setActivePage(item.name)}
                  className={[
                    "flex items-center gap-x-1 py-2 rounded-lg cursor-pointer transition-all",
                    active ? "bg-gray-700" : "hover:bg-gray-600",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {/* LEFT ACTIVE BAR (FIXED) */}
                  <div
                    className={[
                      "h-5 w-1 rounded-r-lg",
                      active && "bg-rose-600",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  />

                  <p className="text-sm text-white">{item.name}</p>
                </div>
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
