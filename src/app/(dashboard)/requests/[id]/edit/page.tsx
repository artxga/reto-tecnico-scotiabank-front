"use client";

import { use } from "react";
import { RequestForm } from "@/components/requests/request-form";
import { useRequest, useUpdateRequest } from "@/hooks/use-requests";
import { useToast } from "@/components/ui/toast-context";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SolicitudFormData } from "@/lib/validations";
import { useLanguage } from "@/components/providers/language-provider";

export default function EditRequestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: request, isLoading } = useRequest(id);
  const updateRequest = useUpdateRequest();
  const { toast } = useToast();
  const router = useRouter();
  const { t, language } = useLanguage();

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
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

  const handleSubmit = async (data: SolicitudFormData) => {
    try {
      await updateRequest.mutateAsync({ id, data: { ...data } });
      toast(t("requests.form.toastUpdated"), "success");
      router.push(`/requests/${id}`);
    } catch (error: any) {
      toast(
        error.message ||
          (language === "en" ? "Error updating request" : "Error al actualizar la solicitud"),
        "error",
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/requests/${id}`}
          className="p-2 rounded-full hover:bg-white/60 dark:hover:bg-slate-800/60 dark:bg-slate-900/50 transition-colors shadow-sm bg-white/30 dark:bg-slate-900/20 backdrop-blur-sm border border-white"
        >
          <ArrowLeft className="h-5 w-5 text-gray-700" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            {t("requests.form.editTitle")}
          </h2>
          <p className="text-sm text-gray-500">{t("requests.form.editSubtitle")}</p>
        </div>
      </div>

      <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-sm border border-white p-6 sm:p-8">
        <RequestForm
          initialData={request}
          onSubmit={handleSubmit}
          isLoading={updateRequest.isPending}
        />
      </div>
    </div>
  );
}
