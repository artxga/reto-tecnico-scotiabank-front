"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, PlusCircle, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Solicitudes", href: "/requests", icon: FileText },
  { name: "Nueva Solicitud", href: "/requests/new", icon: PlusCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div 
      className={cn(
        "flex h-full flex-col border-r border-gray-200 bg-white shadow-[2px_0_15px_-3px_rgba(0,0,0,0.05)] z-20 transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className={cn("flex h-16 items-center border-b border-gray-100 overflow-hidden", isCollapsed ? "justify-center" : "justify-between px-6")}>
        {!isCollapsed && (
          <div className="flex items-center gap-2 min-w-max">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Gestor</h1>
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none"
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>
      
      <nav className="flex-1 space-y-1.5 px-3 py-6 overflow-hidden">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              title={isCollapsed ? item.name : undefined}
              className={cn(
                "group flex items-center py-2.5 text-sm font-medium rounded-lg transition-all duration-200 relative",
                isActive
                  ? "bg-indigo-50 text-indigo-700 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600",
                isCollapsed ? "justify-center px-0" : "justify-start px-3"
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-0 h-full w-1 bg-indigo-600 rounded-r-full" />
              )}
              <item.icon
                className={cn(
                  "h-5 w-5 flex-shrink-0 transition-all duration-200",
                  isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-indigo-500 group-hover:scale-110",
                  !isCollapsed && "mr-3"
                )}
                aria-hidden="true"
              />
              {!isCollapsed && <span className="truncate">{item.name}</span>}
            </Link>
          );
        })}
      </nav>
      
      <div className="border-t border-gray-100 p-4">
        <button 
          title={isCollapsed ? "Ajustes" : undefined}
          className={cn(
            "group flex w-full items-center py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-indigo-600 transition-colors",
            isCollapsed ? "justify-center px-0" : "justify-start px-3"
          )}
        >
          <Settings 
            className={cn(
              "h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-transform group-hover:rotate-45",
              !isCollapsed && "mr-3"
            )} 
          />
          {!isCollapsed && <span>Ajustes</span>}
        </button>
      </div>
    </div>
  );
}
