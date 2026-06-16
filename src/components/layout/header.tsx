"use client";

import { useState, useEffect } from "react";
import { Bell, User, Menu, Sun, Moon } from "lucide-react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  read: boolean;
}

export function Header({ onOpenMobileMenu }: HeaderProps) {
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<string>("light");
  const [isOpenNotifications, setIsOpenNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: "1", title: "Actualización de Estado", desc: "La solicitud #42a fue Aprobada por Operaciones.", time: "Hace 5 min", read: false },
    { id: "2", title: "Nueva Solicitud", desc: "Ángel Arteaga creó la solicitud 'Licencias de Software'.", time: "Hace 1 hora", read: true }
  ]);

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

  // Web Audio API Synthesizer for notifications (zero assets, offline-friendly)
  const playBeep = () => {
    try {
      const isSoundEnabled = localStorage.getItem("notifications") !== "false";
      if (!isSoundEnabled) return;

      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
      osc2.frequency.setValueAtTime(987.77, ctx.currentTime + 0.08); // B5

      gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);

      osc1.start(ctx.currentTime);
      osc2.start(ctx.currentTime + 0.08);

      osc1.stop(ctx.currentTime + 0.35);
      osc2.stop(ctx.currentTime + 0.35);
    } catch (e) {
      console.error("Audio error", e);
    }
  };

  // Simulate incoming notifications in background
  useEffect(() => {
    if (!mounted) return;

    const mockNotificationsPool = [
      { title: "Nueva Solicitud", desc: "Sofía Castro ha registrado una solicitud de 'Acceso VPN'." },
      { title: "Actualización de Estado", desc: "La solicitud 'Renovación Laptop' cambió a En Revisión." },
      { title: "Solicitud Cerrada", desc: "El ticket 'Mouse Ergonómico' ha sido marcado como cerrado." },
      { title: "Nueva Solicitud", desc: "Marcos Ruiz envió solicitud crítica 'Teclado de repuesto'." },
    ];

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * mockNotificationsPool.length);
      const chosen = mockNotificationsPool[randomIndex];

      const newNotif: NotificationItem = {
        id: Math.random().toString(),
        title: chosen.title,
        desc: chosen.desc,
        time: "Hace un momento",
        read: false
      };

      setNotifications((prev) => [newNotif, ...prev]);
      playBeep();
    }, 45000); // Trigger every 45s

    return () => clearInterval(interval);
  }, [mounted]);

  // Click outside to close notifications dropdown
  useEffect(() => {
    if (!isOpenNotifications) return;
    const closeDropdown = () => setIsOpenNotifications(false);
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, [isOpenNotifications]);

  const markAllAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white/70 backdrop-blur-xl px-4 sm:px-6 shadow-sm sticky top-0 z-20 transition-all glass-header">
      <div className="flex flex-1 items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 -ml-2 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors md:hidden focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h2 className="text-base sm:text-lg font-semibold text-gray-800">Gestor de Solicitudes</h2>
      </div>

      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Quick theme toggle */}
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

        {/* Notifications Dropdown Container */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpenNotifications(!isOpenNotifications);
            }}
            className="relative rounded-full p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            aria-label="Notificaciones"
          >
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 h-4 w-4 rounded-full bg-rose-500 text-[10px] font-extrabold text-white flex items-center justify-center ring-2 ring-white animate-bounce">
                {unreadCount}
              </span>
            )}
            <Bell className="h-5 w-5" aria-hidden="true" />
          </button>

          {/* Notifications Dropdown Menu */}
          {isOpenNotifications && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-gray-250 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 flex justify-between items-center">
                <span className="font-bold text-gray-900 dark:text-white">Notificaciones</span>
                <div className="flex gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                      title="Marcar todas como leídas"
                    >
                      Leído
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-800 cursor-pointer"
                      title="Limpiar panel"
                    >
                      Limpiar
                    </button>
                  )}
                </div>
              </div>

              <div className="divide-y divide-gray-100 dark:divide-slate-800 max-h-85 overflow-y-auto hide-scrollbar">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={(e) => markAsRead(n.id, e)}
                    className={`p-4 transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-start gap-3 relative ${!n.read ? "bg-indigo-50/25 dark:bg-indigo-950/15" : ""
                      }`}
                  >
                    {!n.read && (
                      <span className="absolute left-2.5 top-5.5 h-1.5 w-1.5 rounded-full bg-indigo-600" />
                    )}
                    <div className="flex-1 space-y-0.5 pl-1.5">
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{n.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">{n.desc}</p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">{n.time}</p>
                    </div>
                  </div>
                ))}

                {notifications.length === 0 && (
                  <div className="p-8 text-center text-gray-450 dark:text-gray-500 space-y-1.5">
                    <Bell className="h-8 w-8 text-gray-300 dark:text-slate-800 mx-auto" />
                    <p className="text-sm">Sin notificaciones nuevas</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-100 to-blue-100 flex items-center justify-center text-indigo-700 font-semibold shadow-sm cursor-pointer hover:shadow-md hover:scale-105 transition-all ring-1 ring-black/5 shrink-0">
          <User className="h-5 w-5" />
        </div>
      </div>
    </header>
  );
}
