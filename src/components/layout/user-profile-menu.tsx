import { User, Settings, LogOut } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

interface UserProfileMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export function UserProfileMenu({ isOpen, onToggle, onClose }: UserProfileMenuProps) {
  const { t, language } = useLanguage();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen, onClose]);

  const profileName = "Ángel Arteaga";
  const profileRole = language === "en" ? "Requests Administrator" : "Administrador de Solicitudes";
  const profileDept = language === "en" ? "Operations & Systems" : "Operaciones y Sistemas";

  const handleSignOut = () => {
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict";
    router.push("/login");
    onClose();
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-tr from-indigo-100 to-blue-100 flex items-center justify-center text-indigo-700 font-semibold shadow-sm cursor-pointer hover:shadow-md hover:scale-105 transition-all ring-1 ring-black/5 shrink-0 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Perfil de usuario"
        title={language === "en" ? "User Profile" : "Perfil de usuario"}
      >
        <User className="h-4 w-4 sm:h-5 w-5" />
      </button>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 mt-2 w-72 rounded-2xl border border-gray-100/70 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl z-50 overflow-hidden p-5 space-y-4"
        >
          <div className="flex flex-col items-center text-center space-y-2.5 pb-4 border-b border-gray-100 dark:border-slate-800">
            <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-indigo-100 to-blue-100 flex items-center justify-center text-indigo-700 font-bold text-xl shadow-inner ring-4 ring-indigo-50 dark:ring-indigo-950/20">
              <User className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-950 dark:text-white leading-tight">{profileName}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">{profileRole}</p>
            </div>
          </div>

          <div className="text-left space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">
              {language === "en" ? "Department" : "Departamento"}
            </span>
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              {profileDept}
            </p>
          </div>

          <Link
            href="/settings"
            onClick={() => onClose()}
            className="w-full btn-primary-liquid py-2 px-3 rounded-xl font-semibold text-xs inline-flex items-center justify-center gap-1.5 transition-all text-white cursor-pointer"
          >
            <Settings className="h-3.5 w-3.5" />
            {language === "en" ? "View Profile" : "Ver Perfil"}
          </Link>

          <button
            onClick={handleSignOut}
            className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 dark:text-rose-400 py-2 px-3 rounded-xl font-semibold text-xs inline-flex items-center justify-center gap-1.5 transition-all border border-rose-100 dark:border-rose-950/30 cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            {t("login.signOut")}
          </button>
        </div>
      )}
    </div>
  );
}
