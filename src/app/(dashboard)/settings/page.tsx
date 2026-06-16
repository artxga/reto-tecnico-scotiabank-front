"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/toast-context";
import { User, Volume2, RefreshCw, Shield, Save, Moon, Sun } from "lucide-react";

export default function SettingsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Settings state
  const [profile, setProfile] = useState({
    name: "Ángel Arteaga",
    role: "Administrador de Solicitudes",
    department: "Operaciones y Sistemas"
  });
  
  const [theme, setTheme] = useState("system");
  const [notifications, setNotifications] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState("30");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Mock API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    setLoading(false);
    toast("Ajustes guardados exitosamente", "success");
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Ajustes</h2>
        <p className="text-gray-500 mt-1">Configura las preferencias de tu espacio de trabajo y perfil.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-sm border border-white p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-950">Perfil de Usuario</h3>
              <p className="text-xs text-gray-500">Información básica del solicitante asignado.</p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">Nombre Completo</label>
              <input
                id="name"
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-gray-950 font-medium transition-all focus:bg-white text-sm outline-hidden"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1.5">Rol / Cargo</label>
              <input
                id="role"
                type="text"
                value={profile.role}
                disabled
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/70 text-gray-500 text-sm font-medium outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1.5">Departamento</label>
              <input
                id="department"
                type="text"
                value={profile.department}
                disabled
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/70 text-gray-500 text-sm font-medium outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Preferences Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-sm border border-white p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <Sun className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-950">Preferencias de Interfaz</h3>
              <p className="text-xs text-gray-500">Configura la visualización de la plataforma.</p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Theme Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2.5">Tema Visual</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "light", label: "Claro", icon: Sun },
                  { value: "dark", label: "Oscuro", icon: Moon },
                  { value: "system", label: "Sistema", icon: Shield }
                ].map((item) => {
                  const Icon = item.icon;
                  const active = theme === item.value;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setTheme(item.value)}
                      className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
                        active 
                          ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-xs" 
                          : "border-gray-200 bg-white/50 text-gray-600 hover:bg-white hover:text-gray-950"
                      }`}
                    >
                      <Icon className={`h-4.5 w-4.5 ${active ? "text-indigo-600" : "text-gray-400"}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Refresh Interval */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4.5 w-4.5 text-gray-400" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">Actualización Automática</p>
                  <p className="text-xs text-gray-500">Frecuencia de refresco para la lista de solicitudes.</p>
                </div>
              </div>
              <select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(e.target.value)}
                className="px-3 py-2 rounded-xl border border-gray-200 bg-white/50 text-gray-700 font-medium text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-hidden"
              >
                <option value="10">Cada 10 segundos</option>
                <option value="30">Cada 30 segundos</option>
                <option value="60">Cada 1 minuto</option>
                <option value="0">Desactivado</option>
              </select>
            </div>

            {/* Notification Switch */}
            <div className="flex items-center justify-between py-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4.5 w-4.5 text-gray-400" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">Alertas de Sonido</p>
                  <p className="text-xs text-gray-500">Emitir sonido en notificaciones importantes.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setNotifications(!notifications)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  notifications ? "bg-indigo-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    notifications ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold inline-flex items-center justify-center gap-2 transform active:scale-98 disabled:opacity-75 disabled:pointer-events-none"
          >
            <Save className="h-4 w-4" />
            {loading ? "Guardando..." : "Guardar Ajustes"}
          </button>
        </div>
      </form>
    </div>
  );
}
