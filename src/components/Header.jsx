


"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment);
  const router = useRouter();
  
  const segmentLabels = {
    home: "Dashboard",
    procurement: "Procurement",
    booking: "Booking",
    benchmarking: "Market Price Trends",
    sales: "Sales",
    "market-price-trends": "Market Price Trends",
    "stock-analysis": "Stock Analysis",
    "performance-metrics": "Performance Metrics",
    stock: "Stocks"
  };

  const breadcrumbs = pathSegments.map(
    (segment) =>
      segmentLabels[segment] ||
      segment.charAt(0).toUpperCase() + segment.slice(1)
  );

  console.log("Generated breadcrumbs:", breadcrumbs);

  // Function to determine the proper path for breadcrumb links
  const getBreadcrumbPath = (index) => {
    return `/${pathSegments.slice(0, index + 1).join("/")}`;
  };

  const [user, setUser] = useState({
    img: "/avatar.png",
    name: "Guest",
    email: "",
  });

  useEffect(() => {
    const img = localStorage.getItem("img");
    const name = localStorage.getItem("contact_person");
    const email = localStorage.getItem("email");

    if (img && name && email) {
      setUser({
        img,
        name,
        email,
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("img");
    localStorage.removeItem("contact_person");
    localStorage.removeItem("email");
    router.push("/");
  };

  return (
    <div className="w-full flex items-center justify-between pb-2 border-b border-b-neutral-200">
      <div className="flex items-center space-x-2">
        {breadcrumbs.length > 1 &&
          breadcrumbs[breadcrumbs.length - 1] !== "Dashboard" && (
            <button
              onClick={() => window.history.back()}
              className="text-gray-500 hover:underline flex items-center gap-x-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="18px"
                viewBox="0 -960 960 960"
                width="18px"
                className="fill-gray-500"
              >
                <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
              </svg>
              <p className="text-sm">Back</p>
            </button>
          )}

        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => {
              const path = getBreadcrumbPath(index);
              const isLast = index === breadcrumbs.length - 1;

              return (
                <React.Fragment key={index}>
                  {index > 0 && <BreadcrumbSeparator className="text-black" />}
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="text-gray-800 font-medium">
                        {crumb}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        href={path}
                        className={`${
                          crumb === "Admin"
                            ? "hidden"
                            : "text-gray-500 hover:underline"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          router.push(path);
                        }}
                      >
                        {crumb}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex gap-x-3">
        <div className="bg-white h-10 w-10 flex justify-center items-center rounded-xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#a3a3a3"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-bell"
          >
            <path d="M10.268 21a2 2 0 0 0 3.464 0" />
            <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
          </svg>
        </div>
        <div className="bg-white h-10 w-10 flex justify-center items-center rounded-xl">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  className="fill-neutral-400"
                >
                  <path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z" />
                </svg>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60 bg-white border rounded-xl me-5 p-3">
              <DropdownMenuLabel className="w-full flex gap-x-2 relative">
                <div className="rounded-full w-10 h-10 flex object-cover">
                  <img
                    src={user.img}
                    alt="User Avatar"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-black text-sm font-semibold">
                    {user.name}
                  </p>
                  <p className="text-xs font-normal text-neutral-400">
                    {user.email}
                  </p>
                </div>
                <div className="bg-green-500 rounded-full h-2 w-2 absolute top-2/3 left-7"></div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup className="flex flex-col gap-y-2">
                <DropdownMenuItem className="bg-black flex justify-start rounded-lg py-2 cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-user-round"
                  >
                    <circle cx="12" cy="8" r="5" />
                    <path d="M20 21a8 8 0 0 0-16 0" />
                  </svg>
                  <p className="text-white text-sm">View Profile</p>
                </DropdownMenuItem>
                <DropdownMenuItem className="bg-transparent flex justify-start rounded-lg py-2 cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="32px"
                    viewBox="0 -960 960 960"
                    width="32px"
                    className="fill-neutral-400"
                  >
                    <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" />
                  </svg>
                  <p className="text-sm font-medium text-black">
                    Account Settings
                  </p>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="28px"
                    viewBox="0 -960 960 960"
                    width="28px"
                    className="fill-neutral-400"
                  >
                    <path d="M480-400 40-640l440-240 440 240-440 240Zm0 160L63-467l84-46 333 182 333-182 84 46-417 227Zm0 160L63-307l84-46 333 182 333-182 84 46L480-80Zm0-411 273-149-273-149-273 149 273 149Zm0-149Z" />
                  </svg>
                  <p className="text-sm font-medium text-black">About Us</p>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#a3a3a3"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-lock"
                  >
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <p className="text-sm font-medium text-black">
                    Change email address
                  </p>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <img src="/help-logo.svg" />
                  <p className="text-sm font-medium text-black">Help</p>
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger
                    onClick={handleLogout}
                    className="cursor-pointer"
                  >
                    <img src="/logout-icon.svg" />
                    <p className="text-sm font-medium text-black">Logout</p>
                  </DropdownMenuSubTrigger>
                </DropdownMenuSub>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Header;
