import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import {
  useAdminAreas,
  useAdminRequest,
  useAdminServices,
  useRequestMutations,
} from "../../../../api/hooks";
import {
  formatDate,
  fromKuwaitDateTimeLocal,
  toDateTimeLocal,
} from "../../../../lib/format";
import { isRequestStatus } from "../../../../lib/status";
import { adminReplySchema } from "../../../../lib/validation";
import type { RequestStatus, UpdateServiceRequestDto } from "../../../../types/api";
import type { RequestDetailFormValues, RequestReplyFormValues } from "../types";

export function useRequestDetailsPage() {
  const id = Number(useParams().id);
  const navigate = useNavigate();
  const request = useAdminRequest(id);
  const areas = useAdminAreas();
  const services = useAdminServices();
  const mutations = useRequestMutations(id);
  const [status, setStatus] = useState<RequestStatus>("New");

  const detailsForm = useForm<RequestDetailFormValues>();
  const replyForm = useForm<RequestReplyFormValues>({
    resolver: zodResolver(adminReplySchema),
    defaultValues: { message: "" },
  });

  const areaId = detailsForm.watch("areaId");
  const selectedArea = areas.data?.find((area) => area.id === Number(areaId));
  const serviceOptions = useMemo(() => {
    if (!selectedArea?.services?.length) return services.data || [];

    const linkedIds = new Set(selectedArea.services.map((service) => service.id));

    return (services.data || []).filter((service) => linkedIds.has(service.id));
  }, [selectedArea, services.data]);

  useEffect(() => {
    if (!request.data) return;

    detailsForm.reset({
      name: request.data.name || "",
      phone: request.data.phone,
      serviceId: request.data.serviceId,
      areaId: request.data.areaId,
      notes: request.data.notes || "",
      address: request.data.address || "",
      latitude: request.data.latitude ?? null,
      longitude: request.data.longitude ?? null,
      scheduledAt: toDateTimeLocal(request.data.scheduledAt),
      finalPrice: request.data.finalPrice ?? null,
      internalNotes: request.data.internalNotes || "",
    });
    replyForm.reset({ message: request.data.adminReplyMessage || "" });
    setStatus(request.data.status);
  }, [request.data, detailsForm, replyForm]);

  const saveDetails = detailsForm.handleSubmit(async (values) => {
    const body: UpdateServiceRequestDto = {
      ...values,
      serviceId: Number(values.serviceId),
      areaId: Number(values.areaId),
      finalPrice:
        values.finalPrice === null || values.finalPrice === undefined
          ? null
          : Number(values.finalPrice),
      scheduledAt: fromKuwaitDateTimeLocal(values.scheduledAt),
    };

    try {
      await mutations.update.mutateAsync(body);
      toast.success("تم حفظ بيانات الطلب.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذر حفظ الطلب.");
    }
  });

  const saveStatus = async () => {
    try {
      await mutations.status.mutateAsync({ status });
      toast.success("تم تحديث الحالة.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "تعذر تحديث الحالة.",
      );
    }
  };

  const saveReply = replyForm.handleSubmit(async (values) => {
    try {
      await mutations.reply.mutateAsync(values);
      toast.success("تم إرسال رد الإدارة للعميل.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذر إرسال الرد.");
    }
  });

  const setStatusFromValue = (value: string) => {
    if (isRequestStatus(value)) setStatus(value);
  };

  const hasReply =
    !!request.data?.isReplied ||
    !!request.data?.adminReplyMessage ||
    !!request.data?.adminRepliedAt;

  return {
    id,
    navigate,
    request,
    areas,
    services,
    serviceOptions,
    mutations,
    status,
    detailsForm,
    replyForm,
    hasReply,
    formattedCreatedAt: request.data ? formatDate(request.data.createdAt) : "",
    formattedUpdatedAt: request.data?.updatedAt
      ? formatDate(request.data.updatedAt)
      : "",
    saveDetails,
    saveStatus,
    saveReply,
    setStatusFromValue,
  };
}
