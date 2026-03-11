"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";


const navItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Employees", href: "/employees" },
  { name: "Succession Pool", href: "/succession-pool" },
  { name: "Training Records", href: "/training-records" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-slate-200 bg-white">
      
      {/* Logo / System Name */}
      <div className="border-b border-slate-200 px-6 py-5">
        <div className="mb-4 flex justify-center">
          <Image
            src="/hrmdo-logo.png"
            alt="HRMDO Logo"
            width={50}
            height={50}
            className="rounded"
          />
        </div>
        <h1 className="text-center text-lg font-bold text-slate-800">
          Succession
          <br />
          Planning System
        </h1>
        <p className="mt-1 text-center text-sm text-slate-500">
          HR Monitoring Dashboard
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`block rounded-xl px-4 py-3 text-sm font-medium transition
              ${
                isActive
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-200 p-4 text-sm text-slate-500">
        HRMDO System v1.0
      </div>
    </aside>
  );
}