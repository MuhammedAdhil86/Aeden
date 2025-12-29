import Link from "next/link";
import React from "react";

const reports = [
  {
    title: "Fleet Expense Analysis",
    href: "/admin/fleet/related-report/expense",
    icon: "/report-1.svg",
  },
  {
    title: "Asset Management",
    href: "/admin/fleet/related-report/asset",
    icon: "/report-2.svg",
  },
  {
    title: "Vehicle idle time monitoring",
    href: "/admin/fleet/related-report/monitoring",
    icon: "/report-3.svg",
  },
  {
    title: "Service History Log",
    href: "/admin/fleet/related-report/service",
    icon: "/report-4.svg",
  },
  {
    title: "Trip Sheet Logbook",
    href: "/admin/fleet/related-report/tripSheet",
    icon: "/report-5.svg",
  },
  {
    title: "Vehicle Live tracking Reports",
    href: "/admin/fleet/related-report/vehicleTracking",
    icon: "/report-6.svg",
  },
//   {
//     title: "Insurance Overview",
//     href: "/admin/fleet/related-report/",
//     icon: "/report-7.svg",
//   },
  {
    title: "Empty Container Tracking",
    href: "/admin/fleet/related-report/containerTracking",
    icon: "/report-8.svg",
  },
  {
    title: "Transit Insurance tracking",
    href: "/admin/fleet/related-report/insurance",
    icon: "/report-9.svg",
  },
  {
    title: "Third-party trip/ own vehicle trip details",
    href: "/admin/fleet/related-report/thirdPartyorOwnload",
    icon: "/report-10.svg",
  },
  {
    title: "Driver Safety Scorecard",
    href: "/admin/fleet/related-report/scorecard",
    icon: "/report-11.svg",
  },
//   {
//     title: "Document Expiry",
//     href: "/admin/fleet/related-report",
//     icon: "/report-12.svg",
//   },
];

function RelatedReport() {
  return (
    <div>
      <p className="text-black font-medium text-lg mb-4">Reports</p>
      <div className="w-full grid grid-cols-3 gap-4">
        {reports.map((report, index) => (
          <Link
            key={index}
            href={report.href}
            className="bg-white flex items-center gap-x-3 rounded-md h-14 p-2 hover:shadow-md transition"
          >
            <div className="bg-neutral-100 flex items-center justify-center rounded-md h-full px-3">
              <img src={report.icon} alt={report.title} />
            </div>
            <p className="text-sm font-medium text-black">{report.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default RelatedReport;
