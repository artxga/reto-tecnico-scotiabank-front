"use client";

import { useState, useEffect } from "react";
import { Menu, Sun, Moon, Globe, FileText } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { NotificationsMenu } from "./notifications-menu";
import { UserProfileMenu } from "./user-profile-menu";

interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

export function Header({ onOpenMobileMenu }: HeaderProps) {
  const { t, language, setLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<string>("light");
  const [isOpenNotifications, setIsOpenNotifications] = useState(false);
  const [isOpenProfile, setIsOpenProfile] = useState(false);

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
    <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl px-4 sm:px-6 shadow-sm sticky top-0 z-20 transition-all glass-header">
      <div className="flex flex-1 items-center gap-2 sm:gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 -ml-2 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors md:hidden focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md sm:hidden shrink-0">
          <FileText className="h-4.5 w-4.5 text-white" />
        </div>
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 hidden sm:block">{t("common.appName")}</h2>
      </div>

      <div className="flex items-center space-x-1.5 sm:space-x-3">
        <button
          onClick={() => setLanguage(language === "es" ? "en" : "es")}
          className="rounded-full p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer flex items-center gap-1.5"
          aria-label="Cambiar idioma"
          title={language === "es" ? "Switch to English" : "Cambiar a Español"}
        >
          <Globe className="h-5 w-5" />
          <span className="text-xs font-extrabold uppercase select-none hidden sm:inline-block">{language}</span>
        </button>

        <button
          onClick={toggleTheme}
          className="rounded-full p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
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

        <NotificationsMenu 
          isOpen={isOpenNotifications} 
          onToggle={() => {
            setIsOpenNotifications(!isOpenNotifications);
            setIsOpenProfile(false);
          }}
          onClose={() => setIsOpenNotifications(false)}
        />

        <UserProfileMenu 
          isOpen={isOpenProfile}
          onToggle={() => {
            setIsOpenProfile(!isOpenProfile);
            setIsOpenNotifications(false);
          }}
          onClose={() => setIsOpenProfile(false)}
        />
      </div>
    </header>
  );
}
