import { Activity } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";

export function DashboardHeader() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
          {t("dashboard.title")}
        </h2>
        <p className="text-sm text-gray-500 mt-1">{t("dashboard.subtitle")}</p>
      </div>
      <Link
        href="/requests/new"
        className="w-full sm:w-auto justify-center btn-primary-liquid px-5 py-2.5 rounded-xl text-sm font-medium inline-flex items-center gap-2 transform active:scale-95"
      >
        <Activity className="h-4 w-4" />
        {t("dashboard.newRequest")}
      </Link>
    </div>
  );
}
