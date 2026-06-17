import { Request } from "@/lib/types";

interface ExportParams {
  filtered: Request[];
  language: string;
  categoryTranslations: Record<string, string>;
  priorityTranslations: Record<string, string>;
  statusTranslations: Record<string, string>;
}

export function useCsvExport() {
  const exportToCSV = ({
    filtered,
    language,
    categoryTranslations,
    priorityTranslations,
    statusTranslations,
  }: ExportParams) => {
    const headers =
      language === "en"
        ? ["ID", "Title", "Requester", "Category", "Priority", "Status", "Creation Date"]
        : ["ID", "Título", "Solicitante", "Categoría", "Prioridad", "Estado", "Fecha de Creación"];

    const rows = filtered.map((req) => [
      req.id,
      `"${req.title.replace(/"/g, '""')}"`,
      `"${req.requester.replace(/"/g, '""')}"`,
      `"${(categoryTranslations[req.category] || req.category).replace(/"/g, '""')}"`,
      priorityTranslations[req.priority] || req.priority,
      statusTranslations[req.status] || req.status,
      new Date(req.creationDate).toLocaleDateString(language === "en" ? "en-US" : "es-ES"),
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      language === "en"
        ? `exported_requests_${new Date().toISOString().split("T")[0]}.csv`
        : `solicitudes_exportadas_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return { exportToCSV };
}
