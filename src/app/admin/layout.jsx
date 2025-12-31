"use client";

import Sidebar from "@/components/Sidebar";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  // Safe guard for hydration + routing
  const currentPath = pathname?.split("/").pop() || "";
  const activePage =
    currentPath.charAt(0).toUpperCase() + currentPath.slice(1);

  const handlePageChange = () => {
    // handled inside Sidebar if needed
  };

  return (
    <div className="w-full h-screen flex overflow-hidden">
      <Sidebar activePage={activePage} setActivePage={handlePageChange} />

      {/* ✅ FIXED: single space in className */}
      <div className="flex-1 pt-2 pb-5 bg-gray-100 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
