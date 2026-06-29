import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, LocateFixed, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import {
  useAreas,
  useCreateClientRequest,
  useCreateRequest,
  useServices,
} from "../../api/hooks";
import { useClientAuth } from "../../auth/AuthProvider";
import { Seo } from "../../components/Seo";
import {
  containerClass,
  fieldClass,
  fieldErrorClass,
  fieldLabelClass,
  formGridClass,
  inputClass,
  primaryButtonClass,
  secondaryButtonClass,
  sectionClass,
  surfaceClass,
  textareaClass,
} from "../../components/public/PublicPrimitives";
import { ErrorState, InlineLoading } from "../../components/ui";
import { ApiError } from "../../lib/api-client";
import { serviceRequestSchema } from "../../lib/validation";

type FormValues = {
  name?: string;
  phone: string;
  areaId: number;
  serviceId: number;
  notes?: string;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
};

const stepLabelClass =
  "inline-flex rounded-full bg-[color-mix(in_srgb,var(--color-primary)_14%,transparent)] px-3 py-1 text-xs font-black text-[var(--color-primary-dark)]";

const locationBoxClass =
  "rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-5";

const compactSecondaryButtonClass = `${secondaryButtonClass} min-h-10 rounded-xl px-4 text-xs`;

export function RequestServicePage() {
  const [params] = useSearchParams();
  const presetAreaId = Number(params.get("areaId")) || 0;
  const presetServiceId = Number(params.get("serviceId")) || 0;

  const areas = useAreas();
  const mutation = useCreateRequest();
  const clientMutation = useCreateClientRequest();
  const { session: clientSession } = useClientAuth();

  const [sendFromAccount, setSendFromAccount] = useState(!!clientSession);
  const [locating, setLocating] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");
  const [result, setResult] = useState<{
    id: number;
    status: string;
    message: string;
    fromClient?: boolean;
  } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(serviceRequestSchema) as any,
    defaultValues: {
      name: "",
      phone: "",
      areaId: presetAreaId,
      serviceId: 0,
      notes: "",
      address: "",
      latitude: null,
      longitude: null,
    },
  });

  const areaId = watch("areaId");
  const serviceId = watch("serviceId");
  const latitude = watch("latitude");

  useEffect(() => {
    if (clientSession) {
      setSendFromAccount(true);
      setValue("name", clientSession.client.fullName, {
        shouldValidate: false,
      });
    } else {
      setSendFromAccount(false);
    }
  }, [clientSession, setValue]);

  const selectedArea = useMemo(
    () => areas.data?.find((area) => area.id === Number(areaId)),
    [areas.data, areaId],
  );

  const services = useServices(selectedArea?.slug);

  const selectedService = useMemo(
    () => services.data?.find((service) => service.id === Number(serviceId)),
    [serviceId, services.data],
  );

  const requestSeoTitle = selectedService?.name
    ? `طلب ${selectedService.name} في الكويت | كينج كلين King Clean`
    : "اطلب خدمة تنظيف في الكويت | كينج كلين King Clean";

  const requestSeoDescription = selectedArea?.name
    ? `احجز خدمة تنظيف في ${selectedArea.name} مع كينج كلين الكويت. خدمة تنظيف منازل وشقق وفلل ومكاتب بمواعيد مرنة داخل الكويت.`
    : "احجز خدمة تنظيف في الكويت مع كينج كلين. تنظيف منازل، شقق، فلل، مكاتب، كنب وسجاد، مع مواعيد مرنة وخدمة مرتبة.";

  useEffect(() => {
    if (!presetAreaId || !areas.data?.some((area) => area.id === presetAreaId)) {
      return;
    }

    setValue("areaId", presetAreaId, { shouldValidate: true });
  }, [areas.data, presetAreaId, setValue]);

  useEffect(() => {
    if (
      !presetServiceId ||
      !Number(areaId) ||
      !services.data?.some((service) => service.id === presetServiceId)
    ) {
      return;
    }

    setValue("serviceId", presetServiceId, { shouldValidate: true });
  }, [areaId, presetServiceId, services.data, setValue]);

  useEffect(() => {
    if (!Number(serviceId) || !services.data?.length) return;

    if (!services.data.some((service) => service.id === Number(serviceId))) {
      setValue("serviceId", 0, { shouldValidate: true });
    }
  }, [serviceId, services.data, setValue]);

  const useLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage(
        "متصفحك لا يدعم تحديد الموقع. يمكنك كتابة العنوان بدلا من ذلك.",
      );
      return;
    }

    setLocating(true);
    setLocationMessage("جار تحديد موقعك...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setValue("latitude", Number(position.coords.latitude.toFixed(7)), {
          shouldValidate: true,
        });
        setValue("longitude", Number(position.coords.longitude.toFixed(7)), {
          shouldValidate: true,
        });
        setLocating(false);
        setLocationMessage(
          "تم تحديد موقعك. يمكنك مسحه قبل الإرسال إذا رغبت.",
        );
      },
      (error) => {
        setLocating(false);
        setLocationMessage(
          error.code === error.PERMISSION_DENIED
            ? "لم يتم منح إذن الموقع. الموقع اختياري ويمكنك متابعة الطلب."
            : "تعذر تحديد الموقع حاليا. حاول مرة أخرى أو اكتب العنوان.",
        );
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60_000 },
    );
  };

  const clearLocation = () => {
    setValue("latitude", null);
    setValue("longitude", null);
    setLocationMessage("تم مسح الموقع.");
  };

  const submit = handleSubmit(async (rawValues) => {
    try {
      const values = serviceRequestSchema.parse(rawValues) as FormValues;

      const payload = {
        ...values,
        areaId: Number(values.areaId),
        serviceId: Number(values.serviceId),
      };

      const response =
        clientSession && sendFromAccount
          ? await clientMutation.mutateAsync(payload)
          : await mutation.mutateAsync(payload);

      setResult({
        ...response,
        fromClient: !!clientSession && sendFromAccount,
      });

      reset();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      if (error instanceof ApiError && error.errors) {
        Object.entries(error.errors).forEach(([field, messages]) =>
          setError(field as keyof FormValues, { message: messages[0] }),
        );
      }

      toast.error(error instanceof Error ? error.message : "تعذر إرسال الطلب.");
    }
  });

  if (result) {
    return (
      <>
        <Seo
          title="تم إرسال طلب التنظيف | كينج كلين King Clean"
          description="تم إرسال طلب خدمة التنظيف إلى كينج كلين الكويت بنجاح، وسيتم التواصل معك لترتيب الموعد والتفاصيل."
          canonicalPath="/request-service"
          noIndex
        />

        <section className={sectionClass}>
          <div className={containerClass}>
            <div
              className={`${surfaceClass} mx-auto max-w-2xl p-8 text-center md:p-12`}
            >
              <CheckCircle2
                className="mx-auto mb-5 text-[var(--color-success)]"
                size={64}
              />

              <h1 className="font-display text-3xl font-bold text-[var(--color-text)]">
                تم استلام طلبك
              </h1>

              <p className="mt-3 text-lg text-[var(--color-muted)]">
                {result.message}
              </p>

              <p className="mt-3 text-lg text-[var(--color-muted)]">
                رقم الطلب:{" "}
                <strong className="text-[var(--color-text)]">
                  #{result.id}
                </strong>
              </p>

              <p className="text-[var(--color-muted)]">الحالة الحالية: جديد</p>

              {result.fromClient && (
                <p className="text-[var(--color-muted)]">
                  تم ربط الطلب بحسابك ويمكنك متابعته من صفحة طلباتي.
                </p>
              )}

              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <button
                  className={primaryButtonClass}
                  onClick={() => setResult(null)}
                >
                  إرسال طلب آخر
                </button>

                {result.fromClient && (
                  <Link className={secondaryButtonClass} to="/client/requests">
                    عرض طلباتي
                  </Link>
                )}

                <Link className={secondaryButtonClass} to="/">
                  العودة للرئيسية
                </Link>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Seo
        title={requestSeoTitle}
        description={requestSeoDescription}
        canonicalPath="/request-service"
        keywords={[
          "كينج كلين",
          "King Clean",
          "King Clean Kuwait",
          "شركة تنظيف في الكويت",
          "طلب خدمة تنظيف",
          "تنظيف منازل الكويت",
          "تنظيف شقق الكويت",
          "تنظيف فلل الكويت",
          "تنظيف مكاتب الكويت",
          "تنظيف كنب الكويت",
          "تنظيف سجاد الكويت",
        ]}
      />

      <section className={sectionClass}>
        <div className={`${containerClass} max-w-4xl`}>
          <form
            className={`${surfaceClass} p-6 md:p-8`}
            onSubmit={submit}
            noValidate
          >
            <div className="mb-8">
              <span className={stepLabelClass}>طلب خدمة تنظيف</span>

              <h1 className="font-display mt-2 text-3xl font-bold text-[var(--color-text)]">
                اطلب خدمة تنظيف في الكويت
              </h1>

              <p className="mt-3 text-sm font-bold leading-7 text-[var(--color-muted)]">
                حدد المنطقة والخدمة، واترك بيانات التواصل، وفريق كينج كلين
                يتواصل معك لترتيب الموعد.
              </p>
            </div>

            {clientSession && (
              <div className={`${locationBoxClass} mb-6`}>
                <label className="flex items-start gap-3">
                  <input
                    className="mt-1 h-5 w-5 accent-[var(--color-primary)]"
                    type="checkbox"
                    checked={sendFromAccount}
                    onChange={(event) =>
                      setSendFromAccount(event.target.checked)
                    }
                  />

                  <span className="font-bold text-[var(--color-text)]">
                    إرسال الطلب من حسابي ({clientSession.client.email})
                  </span>
                </label>

                <p className="mb-0 mt-2 text-sm leading-7 text-[var(--color-muted)]">
                  عند التفعيل سيظهر الطلب داخل صفحة طلباتي ويمكنك رؤية رد
                  الإدارة عند توفره.
                </p>
              </div>
            )}

            {areas.isError ? (
              <ErrorState error={areas.error} retry={areas.refetch} compact />
            ) : (
              <div className={formGridClass}>
                <div className={fieldClass}>
                  <label className={fieldLabelClass} htmlFor="areaId">
                    المنطقة *
                  </label>

                  <select
                    id="areaId"
                    className={inputClass}
                    {...register("areaId", { valueAsNumber: true })}
                  >
                    <option value={0}>اختر المنطقة</option>

                    {areas.data?.map((area) => (
                      <option value={area.id} key={area.id}>
                        {area.name}
                      </option>
                    ))}
                  </select>

                  {errors.areaId && (
                    <span className={fieldErrorClass}>
                      {String(errors.areaId.message || "")}
                    </span>
                  )}
                </div>

                <div className={fieldClass}>
                  <label className={fieldLabelClass} htmlFor="serviceId">
                    الخدمة *
                  </label>

                  <select
                    id="serviceId"
                    className={inputClass}
                    disabled={!areaId || services.isLoading}
                    {...register("serviceId", { valueAsNumber: true })}
                  >
                    <option value={0}>
                      {!areaId ? "اختر المنطقة أولا" : "اختر الخدمة"}
                    </option>

                    {services.data?.map((service) => (
                      <option value={service.id} key={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>

                  {errors.serviceId && (
                    <span className={fieldErrorClass}>
                      {String(errors.serviceId.message || "")}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="my-8 border-t border-[var(--color-border)]" />

            <div className="mb-6">
              <span className={stepLabelClass}>بيانات التواصل</span>

              <h2 className="font-display mt-2 text-2xl font-bold text-[var(--color-text)]">
                كيف نتواصل معك؟
              </h2>
            </div>

            <div className={formGridClass}>
              <div className={fieldClass}>
                <label className={fieldLabelClass} htmlFor="phone">
                  رقم الهاتف *
                </label>

                <input
                  id="phone"
                  className={inputClass}
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="مثال: +965 0000 0000"
                  {...register("phone")}
                />

                {errors.phone && (
                  <span className={fieldErrorClass}>
                    {String(errors.phone.message || "")}
                  </span>
                )}
              </div>

              <div className={fieldClass}>
                <label className={fieldLabelClass} htmlFor="name">
                  الاسم (اختياري)
                </label>

                <input
                  id="name"
                  className={inputClass}
                  autoComplete="name"
                  {...register("name")}
                />

                {errors.name && (
                  <span className={fieldErrorClass}>
                    {String(errors.name.message || "")}
                  </span>
                )}
              </div>

              <div className={`${fieldClass} md:col-span-2`}>
                <label className={fieldLabelClass} htmlFor="address">
                  العنوان (اختياري)
                </label>

                <input
                  id="address"
                  className={inputClass}
                  autoComplete="street-address"
                  placeholder="القطعة، الشارع، المبنى"
                  {...register("address")}
                />

                {errors.address && (
                  <span className={fieldErrorClass}>
                    {String(errors.address.message || "")}
                  </span>
                )}
              </div>

              <div className={`${fieldClass} md:col-span-2`}>
                <label className={fieldLabelClass} htmlFor="notes">
                  ملاحظات (اختياري)
                </label>

                <textarea
                  id="notes"
                  className={textareaClass}
                  placeholder="أي تفاصيل تساعدنا في فهم احتياجك"
                  {...register("notes")}
                />

                {errors.notes && (
                  <span className={fieldErrorClass}>
                    {String(errors.notes.message || "")}
                  </span>
                )}
              </div>

              <div className={`${locationBoxClass} md:col-span-2`}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <strong className="text-[var(--color-text)]">
                      موقعك على الخريطة
                    </strong>

                    <p className="mb-0 mt-1 text-sm leading-7 text-[var(--color-muted)]">
                      اختياري، لن نطلب الإذن إلا عند الضغط.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {latitude != null && (
                      <button
                        type="button"
                        className={compactSecondaryButtonClass}
                        onClick={clearLocation}
                      >
                        <Trash2 size={16} /> مسح
                      </button>
                    )}

                    <button
                      type="button"
                      className={compactSecondaryButtonClass}
                      disabled={locating}
                      onClick={useLocation}
                    >
                      <LocateFixed size={17} />
                      {locating ? "جار التحديد..." : "استخدم موقعي"}
                    </button>
                  </div>
                </div>

                {locationMessage && (
                  <p className="mb-0 mt-3 text-sm font-bold text-[var(--color-accent)]">
                    {locationMessage}
                  </p>
                )}

                {errors.latitude && (
                  <p className={fieldErrorClass}>
                    {String(errors.latitude.message || "")}
                  </p>
                )}
              </div>
            </div>

            {mutation.isError && (
              <div className="mt-5">
                <ErrorState error={mutation.error} compact />
              </div>
            )}

            {clientMutation.isError && (
              <div className="mt-5">
                <ErrorState error={clientMutation.error} compact />
              </div>
            )}

            <button
              className={`${primaryButtonClass} mt-7 w-full`}
              disabled={
                mutation.isPending ||
                clientMutation.isPending ||
                areas.isLoading ||
                services.isLoading
              }
              type="submit"
            >
              {mutation.isPending || clientMutation.isPending ? (
                <InlineLoading />
              ) : (
                "إرسال طلب الخدمة"
              )}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}