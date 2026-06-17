import { Calendar, Search } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/providers/language-provider";

import { Request } from "@/lib/types";

interface RequestsMobileListProps {
  filtered: Request[];
  categoryTranslations: Record<string, string>;
}

export function RequestsMobileList({ filtered, categoryTranslations }: RequestsMobileListProps) {
  const { t, language } = useLanguage();

  return (
    <div className="grid gap-4 md:hidden">
      {filtered.map((req) => (
        <Link
          key={req.id}
          href={`/requests/${req.id}`}
          className="block p-5 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-white rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
        >
          <div className="flex justify-between items-start gap-2 mb-2">
            <h3 className="font-bold text-gray-900 line-clamp-2 pr-2 leading-snug">{req.title}</h3>
            <Badge variant={req.status} className="shrink-0" />
          </div>
          <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
            <span>{req.requester}</span>
            <span className="font-mono bg-white/80 px-2 py-0.5 rounded text-[10px] dark:bg-slate-900/60 text-gray-600">
              {categoryTranslations[req.category] || req.category}
            </span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-xs text-gray-440 dark:text-gray-500">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {new Date(req.creationDate).toLocaleDateString(
                  language === "en" ? "en-US" : "es-ES",
                )}
              </span>
            </div>
            <Badge variant={req.priority} />
          </div>
        </Link>
      ))}
      {filtered.length === 0 && (
        <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white p-12 text-center text-gray-500">
          <div className="flex flex-col items-center gap-2">
            <Search className="h-8 w-8 text-gray-300" />
            <p>{t("requests.noResults")}</p>
          </div>
        </div>
      )}
    </div>
  );
}
