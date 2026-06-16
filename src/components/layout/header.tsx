"use client";

import { useState, useEffect } from "react";
import { Bell, User, Menu, Sun, Moon } from "lucide-react";

interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

export function Header({ onOpenMobileMenu }: HeaderProps) {
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<string>("light");

  useEffect(() => {
    setMounted(true);
    
    const getThemeResolution = () => {
      const saved = localStorage.getItem("theme") || "system";
      if (saved === "system") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
      return saved;
    };

    setCurrentTheme(getThemeResolution());

    const handleThemeChange = () => {
      setCurrentTheme(getThemeResolution());
    };

    window.addEventListener("theme-change", handleThemeChange);
    return () => window.removeEventListener("theme-change", handleThemeChange);
  }, []);

  const toggleTheme = () => {
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    setCurrentTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    window.dispatchEvent(new Event("theme-change"));
  };

  return (
    <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white/70 backdrop-blur-xl px-4 sm:px-6 shadow-sm sticky top-0 z-10 transition-all">
      <div className="flex flex-1 items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 -ml-2 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors md:hidden focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h2 className="text-base sm:text-lg font-semibold text-gray-800">Panel de Control</h2>
      </div>
      <div className="flex items-center space-x-4 sm:space-x-5">
        {/* Quick theme toggle */}
        <button 
          onClick={toggleTheme}
          className="rounded-full p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Cambiar tema"
        >
          {!mounted ? (
            <div className="h-5 w-5" />
          ) : currentTheme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>

        <button className="relative rounded-full p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          <Bell className="h-5 w-5" aria-hidden="true" />
        </button>
        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-100 to-blue-100 flex items-center justify-center text-indigo-700 font-semibold shadow-sm cursor-pointer hover:shadow-md hover:scale-105 transition-all ring-1 ring-black/5">
          <User className="h-5 w-5" />
        </div>
      </div>
    </header>
  );
}
