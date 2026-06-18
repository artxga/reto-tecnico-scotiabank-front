"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SolicitudFormData, requestSchema } from "@/lib/validations";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Request, CATEGORIES, Category, Priority } from "@/lib/types";
import { useLanguage } from "@/components/providers/language-provider";

interface RequestFormProps {
  initialData?: Request;
  onSubmit: (data: SolicitudFormData) => Promise<void>;
  isLoading?: boolean;
}

export function RequestForm({ initialData, onSubmit, isLoading }: RequestFormProps) {
  const { t, language } = useLanguage();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SolicitudFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      category: (initialData?.category || "") as Category,
      priority: (initialData?.priority || "") as Priority,
      requester: initialData?.requester || "",
    },
  });

  const getErrorMessage = (err: { message?: string } | undefined) => {
    if (!err || !err.message) return "";
    const msg = err.message;
    if (msg.includes("al menos 5 caracteres")) {
      return language === "en"
        ? "Title must be at least 5 characters"
        : "El título debe tener al menos 5 caracteres";
    }
    if (msg.includes("exceder los 100 caracteres")) {
      return language === "en"
        ? "Title cannot exceed 100 characters"
        : "El título no puede exceder los 100 caracteres";
    }
    if (msg.includes("al menos 10 caracteres")) {
      return language === "en"
        ? "Description must be at least 10 characters"
        : "La descripción debe tener al menos 10 caracteres";
    }
    if (msg.includes("obligatoria")) {
      return language === "en" ? "Category is required" : "La categoría es obligatoria";
    }
    if (msg.includes("solicitante es obligatorio")) {
      return language === "en"
        ? "Requester name is required"
        : "El nombre del solicitante es obligatorio";
    }
    return msg;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1.5">
            {t("requests.form.fieldTitle")}
          </label>
          <Input
            {...register("title")}
            id="title"
            placeholder={t("requests.form.fieldTitlePlaceholder")}
            disabled={isLoading || !!initialData}
            className={errors.title ? "border-red-500 focus:ring-red-500" : ""}
          />
          {errors.title && (
            <p className="mt-1.5 text-sm text-red-600">{getErrorMessage(errors.title)}</p>
          )}
        </div>

        <div>
          <label htmlFor="requester" className="block text-sm font-medium text-gray-700 mb-1.5">
            {t("requests.form.fieldRequester")}
          </label>
          <Input
            {...register("requester")}
            id="requester"
            placeholder={t("requests.form.fieldRequesterPlaceholder")}
            disabled={isLoading || !!initialData}
            className={errors.requester ? "border-red-500 focus:ring-red-500" : ""}
          />
          {errors.requester && (
            <p className="mt-1.5 text-sm text-red-600">{getErrorMessage(errors.requester)}</p>
          )}
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1.5">
            {t("requests.form.fieldPriority")}
          </label>
          <Select {...register("priority")} id="priority" disabled={isLoading}>
            <option value="low">
              {language === "en" ? "Low - Can wait" : "Baja - Puede esperar"}
            </option>
            <option value="medium">
              {language === "en"
                ? "Medium - Requires attention soon"
                : "Media - Requiere atención pronto"}
            </option>
            <option value="high">{language === "en" ? "High - Urgent" : "Alta - Urgente"}</option>
            <option value="critical">
              {language === "en" ? "Critical - Immediate Action" : "Crítica - Acción Inmediata"}
            </option>
          </Select>
          {errors.priority && (
            <p className="mt-1.5 text-sm text-red-600">{getErrorMessage(errors.priority)}</p>
          )}
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1.5">
            {t("requests.form.fieldCategory")}
          </label>
          <Select
            {...register("category")}
            id="category"
            disabled={isLoading || !!initialData}
            className={errors.category ? "border-red-500 focus:ring-red-500" : ""}
          >
            <option value="">
              {language === "en" ? "Select category..." : "Seleccionar categoría..."}
            </option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {t(`requests.categories.${c}`)}
              </option>
            ))}
          </Select>
          {errors.category && (
            <p className="mt-1.5 text-sm text-red-600">{getErrorMessage(errors.category)}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
            {t("requests.form.fieldDesc")}
          </label>
          <Textarea
            {...register("description")}
            id="description"
            placeholder={t("requests.form.fieldDescPlaceholder")}
            disabled={isLoading}
            className={errors.description ? "border-red-500 focus:ring-red-500" : ""}
          />
          {errors.description && (
            <p className="mt-1.5 text-sm text-red-600">{getErrorMessage(errors.description)}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? t("common.saving")
            : initialData
              ? t("requests.form.submitSave")
              : t("requests.form.submitCreate")}
        </Button>
      </div>
    </form>
  );
}
