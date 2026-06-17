"use client";

import { RequestForm } from "@/components/requests/request-form";
import { useCreateRequest } from "@/hooks/use-requests";
import { useToast } from "@/components/ui/toast-context";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SolicitudFormData } from "@/lib/validations";
import { useLanguage } from "@/components/providers/language-provider";

export default function NewRequestPage() {
  const createRequest = useCreateRequest();
  const { toast } = useToast();
  const router = useRouter();
  const { t, language } = useLanguage();

  const handleSubmit = async (data: SolicitudFormData) => {
    try {
      await createRequest.mutateAsync(data);
      toast(t("requests.form.toastCreated"), "success");
      router.push("/requests");
    } catch (error: any) {
      toast(
        error.message ||
          (language === "en" ? "Error creating request" : "Error al crear la solicitud"),
        "error",
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/requests"
          className="p-2 rounded-full hover:bg-white/60 dark:hover:bg-slate-800/60 dark:bg-slate-900/50 transition-colors shadow-sm bg-white/30 dark:bg-slate-900/20 backdrop-blur-sm border border-white"
        >
          <ArrowLeft className="h-5 w-5 text-gray-700" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            {t("requests.form.newTitle")}
          </h2>
          <p className="text-sm text-gray-500">{t("requests.form.newSubtitle")}</p>
        </div>
      </div>

      <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-sm border border-white p-6 sm:p-8">
        <RequestForm onSubmit={handleSubmit} isLoading={createRequest.isPending} />
      </div>
    </div>
  );
}
