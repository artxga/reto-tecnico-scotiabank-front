import { Sun, Moon, Shield, Globe, RefreshCw, Volume2 } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

interface PreferencesSettingsProps {
  theme: string;
  handleThemeSelect: (val: string) => void;
  language: string;
  setLanguage: (val: "es" | "en") => void;
  refreshInterval: string;
  setRefreshInterval: (val: string) => void;
  notifications: boolean;
  setNotifications: (val: boolean) => void;
}

export function PreferencesSettings({
  theme, handleThemeSelect,
  language, setLanguage,
  refreshInterval, setRefreshInterval,
  notifications, setNotifications
}: PreferencesSettingsProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-sm border border-white p-6 sm:p-8 space-y-6">
      <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
        <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
          <Sun className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-950">{t("settings.preferences.title")}</h3>
          <p className="text-xs text-gray-500">{t("settings.preferences.subtitle")}</p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2.5">{t("settings.preferences.theme")}</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "light", label: t("settings.preferences.themeLight"), icon: Sun },
              { value: "dark", label: t("settings.preferences.themeDark"), icon: Moon },
              { value: "system", label: t("settings.preferences.themeSystem"), icon: Shield }
            ].map((item) => {
              const Icon = item.icon;
              const active = theme === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => handleThemeSelect(item.value)}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                    active 
                      ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-xs" 
                      : "border-gray-200 bg-white/50 dark:bg-slate-900/40 text-gray-600 hover:bg-white dark:bg-slate-900 hover:text-gray-950"
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 ${active ? "text-indigo-600" : "text-gray-400"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2.5 flex items-center gap-2">
            <Globe className="h-4.5 w-4.5 text-gray-400" />
            {t("settings.preferences.language")}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "es", label: t("settings.preferences.langEs") },
              { value: "en", label: t("settings.preferences.langEn") }
            ].map((item) => {
              const active = language === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setLanguage(item.value as "es" | "en")}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                    active 
                      ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-xs" 
                      : "border-gray-200 bg-white/50 dark:bg-slate-900/40 text-gray-600 hover:bg-white dark:bg-slate-900 hover:text-gray-950"
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4.5 w-4.5 text-gray-400" />
            <div>
              <p className="text-sm font-semibold text-gray-800">{t("settings.preferences.refresh")}</p>
              <p className="text-xs text-gray-500">
                {language === "en" ? "Auto-refresh frequency for requests lists." : "Frecuencia de refresco para la lista de solicitudes."}
              </p>
            </div>
          </div>
          <select
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 bg-white/50 dark:bg-slate-900/40 text-gray-700 font-medium text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-hidden"
          >
            <option value="10">{t("settings.preferences.refreshOption", { count: 10 })}</option>
            <option value="30">{t("settings.preferences.refreshOption", { count: 30 })}</option>
            <option value="60">{t("settings.preferences.refreshMinute")}</option>
            <option value="0">{t("settings.preferences.refreshDisabled")}</option>
          </select>
        </div>

        <div className="flex items-center justify-between py-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4.5 w-4.5 text-gray-400" />
            <div>
              <p className="text-sm font-semibold text-gray-800">{t("settings.preferences.sound")}</p>
              <p className="text-xs text-gray-500">{t("settings.preferences.soundDesc")}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setNotifications(!notifications)}
            aria-label={t("settings.preferences.sound")}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
              notifications ? "bg-indigo-600" : "bg-gray-200"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white dark:bg-slate-900 shadow-sm ring-0 transition duration-200 ease-in-out ${
                notifications ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
