import { Download, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";

interface RequestsHeaderProps {
  onExportCSV: () => void;
  exportDisabled: boolean;
}

export function RequestsHeader({ onExportCSV, exportDisabled }: RequestsHeaderProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">{t("requests.title")}</h2>
        <p className="text-sm text-gray-500 mt-1">{t("requests.subtitle")}</p>
      </div>
      <div className="flex gap-3 w-full sm:w-auto">
        <button
          onClick={onExportCSV}
          disabled={exportDisabled}
          className="flex-1 sm:flex-initial justify-center btn-secondary-liquid px-4 py-2.5 rounded-xl text-sm font-medium inline-flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
        >
          <Download className="h-4 w-4" />
          {t("requests.exportCSV")}
        </button>
        <Link
          href="/requests/new"
          className="flex-1 sm:flex-initial justify-center btn-primary-liquid px-5 py-2.5 rounded-xl text-sm font-medium inline-flex items-center gap-2 transform active:scale-95"
        >
          <PlusCircle className="h-4 w-4" />
          {t("dashboard.newRequest")}
        </Link>
      </div>
    </div>
  );
}
