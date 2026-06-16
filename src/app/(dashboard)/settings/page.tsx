"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/toast-context";
import { Save } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { ProfileSettings } from "@/components/settings/profile-settings";
import { PreferencesSettings } from "@/components/settings/preferences-settings";

export default function SettingsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { t, language, setLanguage } = useLanguage();
  
  const [profile, setProfile] = useState({
    name: "Ángel Arteaga",
    role: "Administrador de Solicitudes",
    department: "Operaciones y Sistemas"
  });
  
  const [theme, setTheme] = useState("system");
  const [notifications, setNotifications] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState("30");

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") || "system";
    setTheme(savedTheme);

    const handleThemeChange = () => {
      setTheme(localStorage.getItem("theme") || "system");
    };

    window.addEventListener("theme-change", handleThemeChange);
    return () => window.removeEventListener("theme-change", handleThemeChange);
  }, []);

  useEffect(() => {
    if (language === "en") {
      setProfile({
        name: "Ángel Arteaga",
        role: "Requests Administrator",
        department: "Operations & Systems"
      });
    } else {
      setProfile({
        name: "Ángel Arteaga",
        role: "Administrador de Solicitudes",
        department: "Operaciones y Sistemas"
      });
    }
  }, [language]);

  const applyTheme = (themeValue: string) => {
    if (
      themeValue === "dark" ||
      (themeValue === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleThemeSelect = (value: string) => {
    setTheme(value);
    applyTheme(value);
    localStorage.setItem("theme", value);
    window.dispatchEvent(new Event("theme-change"));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    localStorage.setItem("theme", theme);
    applyTheme(theme);
    
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    setLoading(false);
    toast(t("settings.toastSaved"), "success");
  };

  if (!mounted) return null;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">{t("settings.title")}</h2>
        <p className="text-gray-500 mt-1">{t("settings.subtitle")}</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <ProfileSettings profile={profile} setProfile={setProfile} />

        <PreferencesSettings 
          theme={theme}
          handleThemeSelect={handleThemeSelect}
          language={language}
          setLanguage={setLanguage}
          refreshInterval={refreshInterval}
          setRefreshInterval={setRefreshInterval}
          notifications={notifications}
          setNotifications={setNotifications}
        />

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto btn-primary-liquid px-6 py-3 rounded-xl font-semibold inline-flex items-center justify-center gap-2 transform active:scale-98 disabled:opacity-75 disabled:pointer-events-none"
          >
            <Save className="h-4 w-4" />
            {loading ? t("common.saving") : (language === "en" ? "Save Settings" : "Guardar Ajustes")}
          </button>
        </div>
      </form>
    </div>
  );
}
