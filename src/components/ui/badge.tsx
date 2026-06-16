import * as React from "react"
import { cn } from "@/lib/utils"
import { RequestStatus, Priority } from "@/lib/types"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | RequestStatus | Priority | string;
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants: Record<string, string> = {
    default: "bg-gray-100 text-gray-800 border-gray-200",
    secondary: "bg-indigo-100 text-indigo-800 border-indigo-200",
    outline: "bg-transparent border border-gray-300 text-gray-800",

    // Status
    pending: "bg-amber-100 text-amber-800 border-amber-200 shadow-sm",
    in_review: "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200 shadow-sm",
    approved: "bg-emerald-100 text-emerald-800 border-emerald-200 shadow-sm",
    rejected: "bg-rose-100 text-rose-800 border-rose-200 shadow-sm",
    closed: "bg-slate-200 text-slate-700 border-slate-300 shadow-sm",

    // Priority
    low: "bg-teal-50 text-teal-700 border-teal-200",
    medium: "bg-orange-50 text-orange-700 border-orange-200",
    high: "bg-red-50 text-red-700 border-red-200 font-bold",
    critical: "bg-red-600 text-white border-red-700 font-bold shadow-sm animate-pulse",
  }

  const formatText = (text: string) => {
    const translations: Record<string, string> = {
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
    return translations[text.toLowerCase()] || text.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

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
