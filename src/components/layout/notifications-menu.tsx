import { Bell } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { useMockNotifications } from "@/hooks/use-mock-notifications";
import { useEffect, useRef } from "react";

interface NotificationsMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export function NotificationsMenu({ isOpen, onToggle, onClose }: NotificationsMenuProps) {
  const { t, language } = useLanguage();
  const menuRef = useRef<HTMLDivElement>(null);

  const {
    notifications,
    unreadCount,
    markAllAsRead,
    markAsRead,
    clearAllNotifications,
    translateNotificationTitle,
    translateNotificationDesc,
    translateNotificationTime,
  } = useMockNotifications();

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

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
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

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          role="menu"
          tabIndex={0}
          className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-gray-100/70 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl z-50 overflow-hidden"
        >
          <div className="p-4 border-b border-gray-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 flex justify-between items-center">
            <span className="font-bold text-gray-900 dark:text-white">
              {t("header.notifications")}
            </span>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                  title={t("header.markAllRead")}
                >
                  {language === "en" ? "Read" : "Leído"}
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAllNotifications}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-800 cursor-pointer"
                  title={language === "en" ? "Clear panel" : "Limpiar panel"}
                >
                  {language === "en" ? "Clear" : "Limpiar"}
                </button>
              )}
            </div>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-slate-800 max-h-85 overflow-y-auto hide-scrollbar">
            {notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={`w-full p-4 transition-colors cursor-pointer hover:bg-white/60 dark:hover:bg-slate-800/50 flex items-start gap-3 relative text-left border-none outline-none ${!n.read ? "bg-indigo-50/25 dark:bg-indigo-950/15" : ""}`}
              >
                {!n.read && (
                  <span className="absolute left-2.5 top-5.5 h-1.5 w-1.5 rounded-full bg-indigo-600" />
                )}
                <div className="flex-1 space-y-0.5 pl-1.5">
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {translateNotificationTitle(n.title)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">
                    {translateNotificationDesc(n.desc)}
                  </p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                    {translateNotificationTime(n.time)}
                  </p>
                </div>
              </button>
            ))}

            {notifications.length === 0 && (
              <div className="p-8 text-center text-gray-450 dark:text-gray-500 space-y-1.5">
                <Bell className="h-8 w-8 text-gray-300 dark:text-slate-800 mx-auto" />
                <p className="text-sm">{t("header.noNotifications")}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
