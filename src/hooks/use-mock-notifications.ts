import { useState, useEffect } from "react";
import { useLanguage } from "@/components/providers/language-provider";

export interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  read: boolean;
}

export function useMockNotifications() {
  const { t, language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: "1", title: "Actualización de Estado", desc: "La solicitud #42a fue Aprobada por Operaciones.", time: "Hace 5 min", read: false },
    { id: "2", title: "Nueva Solicitud", desc: "Ángel Arteaga creó la solicitud 'Licencias de Software'.", time: "Hace 1 hora", read: true }
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

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

      osc1.frequency.setValueAtTime(659.25, ctx.currentTime);
      osc2.frequency.setValueAtTime(987.77, ctx.currentTime + 0.08);

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
    }, 45000);

    return () => clearInterval(interval);
  }, [mounted]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const translateNotificationTitle = (title: string) => {
    if (title === "Nueva Solicitud") return t("dashboard.recentActivity.newEvent");
    if (title === "Actualización de Estado") return t("dashboard.recentActivity.statusUpdated");
    if (title === "Solicitud Cerrada") return t("requests.detail.closeRequest");
    return title;
  };

  const translateNotificationDesc = (desc: string) => {
    if (language === "es") return desc;
    const map: Record<string, string> = {
      "La solicitud #42a fue Aprobada por Operaciones.": "Request #42a was Approved by Operations.",
      "Ángel Arteaga creó la solicitud 'Licencias de Software'.": "Ángel Arteaga created request 'Software Licenses'.",
      "Sofía Castro ha registrado una solicitud de 'Acceso VPN'.": "Sofía Castro has registered a request for 'VPN Access'.",
      "La solicitud 'Renovación Laptop' cambió a En Revisión.": "Request 'Laptop Renewal' changed to In Review.",
      "El ticket 'Mouse Ergonómico' ha sido marcado como cerrado.": "Ticket 'Ergonomic Mouse' has been marked as closed.",
      "Marcos Ruiz envió solicitud crítica 'Teclado de repuesto'.": "Marcos Ruiz sent critical request 'Spare keyboard'."
    };
    return map[desc] || desc;
  };

  const translateNotificationTime = (time: string) => {
    if (time === "Hace un momento") return t("dashboard.recentActivity.time.now");
    if (time === "Hace 5 min") return t("dashboard.recentActivity.time.mins", { count: 5 });
    if (time === "Hace 1 hora") return t("dashboard.recentActivity.time.hour");
    return time;
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    unreadCount,
    markAllAsRead,
    markAsRead,
    clearAllNotifications,
    translateNotificationTitle,
    translateNotificationDesc,
    translateNotificationTime
  };
}
