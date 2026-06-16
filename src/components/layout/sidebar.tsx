"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, PlusCircle, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Solicitudes", href: "/requests", icon: FileText },
  { name: "Nueva Solicitud", href: "/requests/new", icon: PlusCircle },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r border-gray-200 bg-white shadow-[2px_0_15px_-3px_rgba(0,0,0,0.05)] z-20">
      <div className="flex h-16 items-center px-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
            <FileText className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Gestor</h1>
        </div>
      </div>
      <nav className="flex-1 space-y-1.5 px-3 py-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 relative overflow-hidden",
                isActive
                  ? "bg-indigo-50 text-indigo-700 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-0 h-full w-1 bg-indigo-600 rounded-r-full" />
              )}
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0 transition-all duration-200",
                  isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-indigo-500 group-hover:scale-110"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-gray-100 p-4">
        <button className="group flex w-full items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-indigo-600 transition-colors">
          <Settings className="mr-3 h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-transform group-hover:rotate-45" />
          Ajustes
        </button>
      </div>
    </div>
  );
}
