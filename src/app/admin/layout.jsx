"use client";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const currentPath = pathname.split("/").pop();
  const activePage = currentPath.charAt(0).toUpperCase() + currentPath.slice(1);
  
  const handlePageChange = (page) => {
    // This will be passed to Sidebar
  };

  return (
    <div className="w-full h-screen flex overflow-hidden">
      <Sidebar activePage={activePage} setActivePage={handlePageChange} />
      <div className="flex-1 px-5 pt-2 pb-5 bg-gray-100 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}