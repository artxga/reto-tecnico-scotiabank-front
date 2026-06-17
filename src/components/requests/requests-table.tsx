import { Eye, Search } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/providers/language-provider";

import { Request } from "@/lib/types";

interface RequestsTableProps {
  filtered: Request[];
  categoryTranslations: Record<string, string>;
}

export function RequestsTable({ filtered, categoryTranslations }: RequestsTableProps) {
  const { t, language } = useLanguage();

  return (
    <div className="hidden md:block bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-sm border border-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-white/50 dark:bg-slate-900/40 text-gray-600 font-semibold border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">
                {language === "en" ? "Request Title" : "Título de la Solicitud"}
              </th>
              <th className="px-6 py-4">{language === "en" ? "Requester" : "Solicitante"}</th>
              <th className="px-6 py-4">{t("requests.table.category")}</th>
              <th className="px-6 py-4">{language === "en" ? "Date" : "Fecha"}</th>
              <th className="px-6 py-4">{t("requests.table.priority")}</th>
              <th className="px-6 py-4">{t("requests.table.status")}</th>
              <th className="px-6 py-4 text-right">{t("common.actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((req) => (
              <tr
                key={req.id}
                className="hover:bg-white/60 dark:hover:bg-slate-800/60 dark:bg-slate-900/50 transition-colors group"
              >
                <td
                  className="px-6 py-4 font-semibold text-gray-900 max-w-[280px] truncate"
                  title={req.title}
                >
                  {req.title}
                </td>
                <td className="px-6 py-4 text-gray-600">{req.requester}</td>
                <td className="px-6 py-4 text-gray-600">
                  {categoryTranslations[req.category] || req.category}
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {new Date(req.creationDate).toLocaleDateString(
                    language === "en" ? "en-US" : "es-ES",
                  )}
                </td>
                <td className="px-6 py-4">
                  <Badge variant={req.priority} />
                </td>
                <td className="px-6 py-4">
                  <Badge variant={req.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/requests/${req.id}`}
                    className="inline-flex items-center justify-center p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors opacity-0 group-hover:opacity-100 focus-within:opacity-100"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="h-8 w-8 text-gray-300" />
                    <p>{t("requests.noResults")}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
