import Sidebar from './Sidebar';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Layout({ children }) {
  const router = useRouter();
  const [activePage, setActivePage] = useState('Dashboard');

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard' },
    { name: 'Procurement', href: '/admin/procurement' },
    { name: 'Booking', href: '/admin/booking' },
    { name: 'Tracking', href: '/admin/tracking' },
    { name: 'Fleet', href: '/admin/fleet' },
    { name: 'Warehouse', href: '/admin/warehouse' },
    { name: 'Stock', href: '/admin/stock' },
  ];

  useEffect(() => {
    // Check if the pathname includes any of the nav item paths
    const currentActivePage = navItems.find(item => 
      pathname === item.href || pathname.startsWith(`${item.href}/`)
    );
    
    if (currentActivePage) {
      setActivePage(currentActivePage.name);
    }
  }, [pathname]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar navItems={navItems} activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}