import * as React from "react"
import { cn } from "@/lib/utils"
import { RequestStatus, Priority } from "@/lib/types"
import { useLanguage } from "@/components/providers/language-provider"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | RequestStatus | Priority | string;
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants: Record<string, string> = {
    default: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    secondary: "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-800",
    outline: "bg-transparent border border-gray-300 text-gray-800 dark:border-slate-700 dark:text-slate-300",

    // Status
    pending: "bg-amber-100 text-amber-800 border-amber-200 shadow-sm dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-900/50",
    in_review: "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200 shadow-sm dark:bg-fuchsia-900/30 dark:text-fuchsia-200 dark:border-fuchsia-900/50",
    approved: "bg-emerald-100 text-emerald-800 border-emerald-200 shadow-sm dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-900/50",
    rejected: "bg-rose-100 text-rose-800 border-rose-200 shadow-sm dark:bg-rose-900/30 dark:text-rose-200 dark:border-rose-900/50",
    closed: "bg-slate-200 text-slate-700 border-slate-300 shadow-sm dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700/50",

    // Priority
    low: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-200 dark:border-teal-900/50",
    medium: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-200 dark:border-orange-900/50",
    high: "bg-red-50 text-red-700 border-red-200 font-bold dark:bg-red-900/30 dark:text-red-200 dark:border-red-900/50",
    critical: "bg-red-600 text-white border-red-700 font-bold shadow-sm animate-pulse dark:bg-red-700 dark:border-red-800",
  }

  let language = "es";
  try {
    const langCtx = useLanguage();
    language = langCtx.language;
  } catch (e) {
    // Fallback if not inside LanguageProvider (e.g. standalone tests)
  }

  const formatText = (text: string) => {
    const textLower = text.toLowerCase();
    
    const esTranslations: Record<string, string> = {
      pending: "Pendiente",
      in_review: "En Revisión",
      approved: "Aprobada",
      rejected: "Rechazada",
      closed: "Cerrada",
      low: "Baja",
      medium: "Media",
      high: "Alta",
      critical: "Crítica",
    };

    const enTranslations: Record<string, string> = {
      pending: "Pending",
      in_review: "In Review",
      approved: "Approved",
      rejected: "Rejected",
      closed: "Closed",
      low: "Low",
      medium: "Medium",
      high: "High",
      critical: "Critical",
    };

    const translations = language === "en" ? enTranslations : esTranslations;
    return translations[textLower] || text.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
        variants[variant as string] || variants.default,
        className
      )}
      {...props}
    >
      {props.children || formatText(variant)}
    </div>
  )
}

export { Badge }
