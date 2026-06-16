"use client";

import { RequestForm } from "@/components/requests/request-form";
import { useCreateRequest } from "@/hooks/use-requests";
import { useToast } from "@/components/ui/toast-context";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SolicitudFormData } from "@/lib/validations";

export default function NewRequestPage() {
  const createRequest = useCreateRequest();
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (data: SolicitudFormData) => {
    try {
      await createRequest.mutateAsync(data);
      toast("Solicitud creada exitosamente", "success");
      router.push("/requests");
    } catch (error: any) {
      toast(error.message || "Error al crear la solicitud", "error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/requests" className="p-2 rounded-full hover:bg-white/60 transition-colors shadow-sm bg-white/30 backdrop-blur-sm border border-white">
          <ArrowLeft className="h-5 w-5 text-gray-700" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Nueva Solicitud</h2>
          <p className="text-sm text-gray-500">Completa el formulario para registrar una nueva solicitud.</p>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-sm border border-white p-6 sm:p-8">
        <RequestForm onSubmit={handleSubmit} isLoading={createRequest.isPending} />
      </div>
    </div>
  );
}
