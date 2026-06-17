"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "flex items-center gap-3 rounded-lg p-4 shadow-xl border backdrop-blur-md transition-all duration-300 animate-in slide-in-from-right-8 fade-in",
              t.type === "success" && "bg-emerald-50/90 text-emerald-900 border-emerald-200",
              t.type === "error" && "bg-rose-50/90 text-rose-900 border-rose-200",
              t.type === "info" && "bg-blue-50/90 text-blue-900 border-blue-200",
            )}
          >
            {t.type === "success" && <CheckCircle className="h-5 w-5 text-emerald-600" />}
            {t.type === "error" && <AlertCircle className="h-5 w-5 text-rose-600" />}
            {t.type === "info" && <Info className="h-5 w-5 text-blue-600" />}
            <p className="text-sm font-medium">{t.message}</p>
            <button
              onClick={() => setToasts((prev) => prev.filter((to) => to.id !== t.id))}
              className="ml-auto text-gray-400 hover:text-gray-700 p-1 rounded-md hover:bg-black/5 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
