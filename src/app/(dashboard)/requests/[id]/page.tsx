"use client";

import { use } from "react";
import { useRequest, useDeleteRequest } from "@/hooks/use-requests";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, Trash2, Calendar, User, AlignLeft, Activity } from "lucide-react";
import { useToast } from "@/components/ui/toast-context";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/components/providers/language-provider";

export default function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: request, isLoading } = useRequest(id);
  const deleteRequest = useDeleteRequest();
  const { toast } = useToast();
  const router = useRouter();
  const { t, language } = useLanguage();

  const categoryTranslations: Record<string, string> = {
    Hardware: language === "en" ? "Hardware" : "Hardware",
    Accesos: language === "en" ? "Access" : "Accesos",
    Software: language === "en" ? "Software" : "Software",
    Infraestructura: language === "en" ? "Infrastructure" : "Infraestructura",
    "Recursos Humanos": language === "en" ? "Human Resources" : "Recursos Humanos",
    Otros: language === "en" ? "Others" : "Otros",
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header Actions Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full shrink-0" />
            <Skeleton className="h-8 w-[200px]" />
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Skeleton className="h-10 flex-1 sm:flex-initial sm:w-24" />
            <Skeleton className="h-10 flex-1 sm:flex-initial sm:w-24" />
          </div>
        </div>

        {/* Main Details Box Skeleton */}
        <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-lg border border-white overflow-hidden">
          {/* Box Header */}
          <div className="p-6 sm:p-8 border-b border-gray-100 bg-gradient-to-br from-white/60 to-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-7 w-2/3" />
                <Skeleton className="h-5 w-24" />
              </div>
              <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 shrink-0">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </div>
          </div>

          {/* Box Body */}
          <div className="p-6 sm:p-8 grid gap-8 md:grid-cols-3">
            {/* Description Skeleton */}
            <div className="md:col-span-2 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded-md" />
                  <Skeleton className="h-6 w-28" />
                </div>
                <div className="bg-white/50 dark:bg-slate-900/40 rounded-xl p-5 border border-gray-100 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-11/12" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              </div>
            </div>

            {/* Sidebar details Skeleton */}
            <div className="space-y-6">
              <div className="bg-white/50 rounded-2xl p-5 border border-gray-100/80 space-y-5">
                <div className="border-b border-gray-200 pb-3 flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-md" />
                  <Skeleton className="h-5 w-20" />
                </div>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-3.5 w-1/3" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center p-12 text-gray-500">
        {language === "en" ? "Request not found." : "Solicitud no encontrada."}
      </div>
    );
  }

  const handleDelete = async () => {
    if (
      confirm(
        language === "en"
          ? "Are you sure you want to close/delete this request?"
          : "¿Estás seguro de que deseas cerrar/eliminar esta solicitud?",
      )
    ) {
      try {
        await deleteRequest.mutateAsync(id);
        toast(t("requests.detail.toastClosed"), "success");
        router.push("/requests");
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "";
        toast(
          errorMessage ||
            (language === "en" ? "Error closing request" : "Error al cerrar la solicitud"),
          "error",
        );
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/requests"
            className="p-2 rounded-full hover:bg-white/50 dark:hover:bg-slate-800/50 dark:bg-slate-900/40 transition-colors shadow-sm bg-white/30 dark:bg-slate-900/20 backdrop-blur-sm border border-white shrink-0"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </Link>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
            {t("requests.detail.title")}
          </h2>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Link href={`/requests/${id}/edit`} className="flex-1 sm:flex-initial">
            <Button
              variant="secondary"
              className="w-full gap-2 bg-white/50 dark:bg-slate-900/40 backdrop-blur-sm hover:bg-white dark:bg-slate-900"
            >
              <Edit className="h-4 w-4" /> {t("common.edit")}
            </Button>
          </Link>
          <Button
            variant="danger"
            className="flex-1 sm:flex-initial gap-2"
            onClick={handleDelete}
            disabled={deleteRequest.isPending}
          >
            <Trash2 className="h-4 w-4" /> {t("common.close")}
          </Button>
        </div>
      </div>

      <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-lg shadow-gray-200/50 border border-white overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-gray-100 bg-gradient-to-br from-white/60 to-white/10">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{request.title}</h1>
              <p className="text-gray-500 font-mono text-xs bg-gray-100 dark:bg-slate-800/60 dark:text-gray-400 px-2 py-1 rounded-md inline-block">
                ID: {request.id}
              </p>
            </div>
            <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 shrink-0">
              <Badge variant={request.status} className="px-3 py-1 text-sm shadow-sm" />
              <Badge variant={request.priority} />
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-800 font-semibold text-lg">
                <AlignLeft className="h-5 w-5 text-indigo-500" />
                <h3>{t("requests.detail.description")}</h3>
              </div>
              <div className="bg-white/50 dark:bg-slate-900/40 rounded-xl p-5 border border-gray-100 text-gray-700 leading-relaxed shadow-sm">
                {request.description}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/50 rounded-2xl p-5 border border-gray-100/80 space-y-5">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2 border-b border-gray-200 pb-3">
                <Activity className="h-4 w-4 text-indigo-500" />{" "}
                {language === "en" ? "Details" : "Detalles"}
              </h3>

              <div className="space-y-1">
                <p className="text-xs text-gray-500 flex items-center gap-1.5 uppercase tracking-wider font-semibold">
                  <User className="h-3.5 w-3.5" /> {t("requests.form.fieldRequester")}
                </p>
                <p className="font-medium text-gray-900 ml-5">{request.requester}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-gray-500 flex items-center gap-1.5 uppercase tracking-wider font-semibold">
                  <Activity className="h-3.5 w-3.5" /> {t("requests.detail.category")}
                </p>
                <p className="font-medium text-gray-900 ml-5">
                  {categoryTranslations[request.category] || request.category}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-gray-500 flex items-center gap-1.5 uppercase tracking-wider font-semibold">
                  <Calendar className="h-3.5 w-3.5" /> {t("requests.detail.creationDate")}
                </p>
                <p className="font-medium text-gray-900 ml-5">
                  {new Date(request.creationDate).toLocaleDateString(
                    language === "en" ? "en-US" : "es-ES",
                  )}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-gray-500 flex items-center gap-1.5 uppercase tracking-wider font-semibold">
                  <Calendar className="h-3.5 w-3.5" /> {t("requests.detail.lastUpdate")}
                </p>
                <p className="font-medium text-gray-900 ml-5">
                  {new Date(request.lastChangeDate).toLocaleDateString(
                    language === "en" ? "en-US" : "es-ES",
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
