"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, PlusCircle, Settings, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Solicitudes", href: "/requests", icon: FileText },
  { name: "Nueva Solicitud", href: "/requests/new", icon: PlusCircle },
];

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ isMobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div 
      className={cn(
        "flex h-full flex-col border-r border-gray-200 bg-white shadow-[2px_0_15px_-3px_rgba(0,0,0,0.05)] transition-all duration-300",
        // Desktop behavior
        "md:relative md:z-20 md:translate-x-0",
        isCollapsed ? "md:w-20" : "md:w-64",
        // Mobile behavior
        "fixed inset-y-0 left-0 z-40 w-64 transform",
        isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
    >
      <div className={cn(
        "flex h-16 items-center border-b border-gray-100 overflow-hidden px-6 justify-between",
        isCollapsed && "md:justify-center md:px-0"
      )}>
        <div className={cn("flex items-center gap-2 min-w-max", isCollapsed && "md:hidden")}>
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
            <FileText className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Gestor</h1>
        </div>
        
        {/* Toggle desktop collapse */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none hidden md:block"
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>

        {/* Close mobile menu */}
        <button 
          onClick={onCloseMobile}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none md:hidden"
          aria-label="Cerrar menú"
        >
          <X className="h-5 w-5" />
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
              onClick={onCloseMobile}
              className={cn(
                "group flex items-center py-2.5 text-sm font-medium rounded-lg transition-all duration-200 relative",
                isActive
                  ? "bg-indigo-50 text-indigo-700 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600",
                isCollapsed ? "md:justify-center md:px-0 justify-start px-3" : "justify-start px-3"
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-0 h-full w-1 bg-indigo-600 rounded-r-full" />
              )}
              <item.icon
                className={cn(
                  "h-5 w-5 flex-shrink-0 transition-all duration-200",
                  isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-indigo-500 group-hover:scale-110",
                  "mr-3",
                  isCollapsed && "md:mr-0"
                )}
                aria-hidden="true"
              />
              <span className={cn("truncate", isCollapsed && "md:hidden")}>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="border-t border-gray-100 p-4">
        <button 
          title={isCollapsed ? "Ajustes" : undefined}
          className={cn(
            "group flex w-full items-center py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-indigo-600 transition-colors",
            isCollapsed ? "md:justify-center md:px-0 justify-start px-3" : "justify-start px-3"
          )}
        >
          <Settings 
            className={cn(
              "h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-transform group-hover:rotate-45",
              "mr-3",
              isCollapsed && "md:mr-0"
            )} 
          />
          <span className={cn("truncate", isCollapsed && "md:hidden")}>Ajustes</span>
        </button>
      </div>
    </div>
  );
}
