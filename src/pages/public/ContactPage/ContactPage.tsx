import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FaCheckCircle,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaRegTrashAlt,
  FaShieldAlt,
  FaWhatsapp,
} from "react-icons/fa";
import { MdMyLocation } from "react-icons/md";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import {
  useAreas,
  useCreateClientRequest,
  useCreateRequest,
  useServices,
  useSettings,
} from "../../../api/hooks";
import { useClientAuth } from "../../../auth/AuthProvider";
import { Seo } from "../../../components/Seo";
import {
  containerClass,
  fieldClass,
  fieldErrorClass,
  fieldLabelClass,
  formGridClass,
  inputClass,
  PageHero,
  primaryButtonClass,
  secondaryButtonClass,
  sectionClass,
  surfaceClass,
  textareaClass,
} from "../../../components/public/PublicPrimitives";
import { ErrorState, InlineLoading, PageLoading } from "../../../components/ui";
import { ApiError } from "../../../lib/api-client";
import { whatsAppUrl } from "../../../lib/format";
import { serviceRequestSchema } from "../../../lib/validation";

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

type SiteSettingsWithSocial = {
  phone?: string | null;
  whatsApp?: string | null;
  email?: string | null;
  workingHours?: string | null;
  facebook?: string | null;
  facebookUrl?: string | null;
  instagram?: string | null;
  instagramUrl?: string | null;
};

const companyAddress = [
  "السالمية",
  "شارع البحرين",
  "مجمع مريم",
  "الدور الأول - مكتب رقم 10",
];

const mapUrl = "https://maps.google.com/?q=29.330528,48.085529";
const mapEmbedUrl =
  "https://maps.google.com/maps?q=29.330528,48.085529&z=17&output=embed";

const stepLabelClass =
  "inline-flex rounded-full bg-[color-mix(in_srgb,var(--color-primary)_14%,transparent)] px-3 py-1 text-xs font-black text-[var(--color-primary-dark)] dark:text-[var(--color-primary)]";

const locationBoxClass =
  "rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-5";

const compactSecondaryButtonClass = `${secondaryButtonClass} min-h-10 rounded-xl px-4 text-xs`;

function getInstagramUrl(value?: string | null) {
  if (!value) return "";

  const clean = value.trim();
  if (!clean) return "";

  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    return clean;
  }

  return `https://www.instagram.com/${clean.replace(/^@/, "").replace(/^\/+/, "")}`;
}

function getFacebookUrl(value?: string | null) {
  if (!value) return "";

  const clean = value.trim();
  if (!clean) return "";

  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    return clean;
  }

  return `https://www.facebook.com/${clean.replace(/^@/, "").replace(/^\/+/, "")}`;
}

export function ContactPage() {
  const settings = useSettings();
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

  const siteSettings = settings.data as SiteSettingsWithSocial | undefined;

  const wa = whatsAppUrl(siteSettings?.whatsApp);
  const facebookUrl = getFacebookUrl(
    siteSettings?.facebookUrl || siteSettings?.facebook,
  );
  const instagramUrl = getInstagramUrl(
    siteSettings?.instagramUrl || siteSettings?.instagram,
  );

  const socialLinks = [
    wa
      ? {
          label: "تواصل عبر واتساب",
          href: wa,
          icon: FaWhatsapp,
          className: "bg-[#16835f] hover:bg-[#12714f]",
        }
      : null,
    instagramUrl
      ? {
          label: "تابعنا على إنستجرام",
          href: instagramUrl,
          icon: FaInstagram,
          className:
            "bg-[linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)] hover:brightness-110",
        }
      : null,
    facebookUrl
      ? {
          label: "تابعنا على فيسبوك",
          href: facebookUrl,
          icon: FaFacebookF,
          className: "bg-[#1877f2] hover:bg-[#0f65d8]",
        }
      : null,
  ].filter(Boolean) as {
    label: string;
    href: string;
    icon: typeof FaWhatsapp;
    className: string;
  }[];

  const contactCards = [
    {
      title: "الهاتف",
      value: siteSettings?.phone || "غير متاح",
      href: siteSettings?.phone ? `tel:${siteSettings.phone}` : "",
      Icon: FaPhoneAlt,
      iconClass: "bg-sky-500/10 text-sky-500 ring-sky-500/20",
    },
    {
      title: "واتساب",
      value: siteSettings?.whatsApp || "غير متاح",
      href: wa || "",
      Icon: FaWhatsapp,
      iconClass: "bg-emerald-500/10 text-emerald-500 ring-emerald-500/20",
      external: true,
    },
    {
      title: "البريد الإلكتروني",
      value: siteSettings?.email || "غير متاح",
      href: siteSettings?.email ? `mailto:${siteSettings.email}` : "",
      Icon: FaEnvelope,
      iconClass: "bg-amber-500/10 text-amber-500 ring-amber-500/20",
    },
  ];

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
      areaId: 0,
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

  const selectedArea = useMemo(
    () => areas.data?.find((area) => area.id === Number(areaId)),
    [areas.data, areaId],
  );

  const services = useServices(selectedArea?.slug);

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
        setLocationMessage("تم تحديد موقعك. يمكنك مسحه قبل الإرسال إذا رغبت.");
      },
      (error) => {
        setLocating(false);
        setLocationMessage(
          error.code === error.PERMISSION_DENIED
            ? "لم يتم منح إذن الموقع. الموقع اختياري ويمكنك متابعة الطلب."
            : "تعذر تحديد الموقع حاليا. حاول مرة أخرى أو اكتب العنوان.",
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 60_000,
      },
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
          setError(field as keyof FormValues, {
            message: messages[0],
          }),
        );
      }

      toast.error(error instanceof Error ? error.message : "تعذر إرسال الطلب.");
    }
  });

  return (
    <>
      <Seo
        title="تواصل مع KING CLEAN"
        description="تواصل مع KING CLEAN أو ابدأ طلب خدمة تنظيف في الكويت."
      />

      <PageHero
        title="تواصل معنا"
        description="نحن هنا لمساعدتك في اختيار الخدمة المناسبة وترتيب طلب تنظيفك بسهولة."
      />

      <section className={sectionClass}>
        <div className={`${containerClass} space-y-8`}>
          {settings.isLoading ? (
            <PageLoading />
          ) : settings.isError ? (
            <ErrorState error={settings.error} retry={settings.refetch} />
          ) : (
            <>
              <div className="grid gap-5 md:grid-cols-3">
                {contactCards.map(
                  ({ title, value, href, Icon, iconClass, external }) => {
                    const content = (
                      <>
                        <span
                          className={`mb-5 grid h-12 w-12 place-items-center rounded-2xl ring-1 ${iconClass}`}
                        >
                          <Icon className="text-xl" />
                        </span>

                        <h2 className="font-display text-lg font-black text-[var(--color-text)]">
                          {title}
                        </h2>

                        <p className="mt-2 break-words text-sm font-bold leading-7 text-[var(--color-muted)]">
                          {value}
                        </p>
                      </>
                    );

                    return href ? (
                      <a
                        key={title}
                        className={`${surfaceClass} group p-6 transition hover:-translate-y-1 hover:border-[var(--color-primary)] hover:shadow-strong`}
                        href={href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noreferrer" : undefined}
                      >
                        {content}
                      </a>
                    ) : (
                      <div key={title} className={`${surfaceClass} p-6 opacity-80`}>
                        {content}
                      </div>
                    );
                  },
                )}
              </div>

              <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
                <aside className="space-y-5">
                  <div className="relative overflow-hidden rounded-[30px] bg-[var(--color-navy)] p-7 text-white shadow-strong sm:p-8">
                    <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-[var(--color-primary)]/25 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-20 right-8 h-64 w-64 rounded-full bg-[var(--color-teal)]/20 blur-3xl" />

                    <div className="relative z-10">
                      <span className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-[var(--color-primary)]">
                        <FaMapMarkerAlt className="text-2xl" />
                      </span>

                      <h2 className="font-display text-2xl font-black leading-tight text-white sm:text-3xl">
                        عنوان KING CLEAN
                      </h2>

                      <div className="mt-4 space-y-1 text-sm font-bold leading-7 text-white/80 sm:text-base">
                        {companyAddress.map((line) => (
                          <p key={line}>{line}</p>
                        ))}
                      </div>

                      <p className="mt-4 text-sm font-bold leading-7 text-white/70">
                        {siteSettings?.workingHours ||
                          "تواصل معنا لمعرفة ساعات العمل وترتيب الموعد المناسب."}
                      </p>

                      <div className="mt-6 flex flex-wrap items-center gap-3">
                        <Link
                          className={`${primaryButtonClass} min-h-12 px-5`}
                          to="/request-service"
                        >
                          ابدأ طلب الخدمة
                        </Link>

                        <a
                          href={mapUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-5 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-white/15"
                        >
                          فتح الخريطة
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className={`${surfaceClass} overflow-hidden p-0`}>
                    <div className="p-6">
                      <h3 className="font-display text-xl font-black text-[var(--color-text)]">
                        موقعنا على الخريطة
                      </h3>

                      <p className="mt-2 text-sm font-bold leading-7 text-[var(--color-muted)]">
                        السالمية - شارع البحرين - مجمع مريم.
                      </p>
                    </div>

                    <iframe
                      title="موقع KING CLEAN على الخريطة"
                      src={mapEmbedUrl}
                      className="h-72 w-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                    />
                  </div>

                  <div className={`${surfaceClass} p-6`}>
                    <h3 className="font-display text-xl font-black text-[var(--color-text)]">
                      تواصل معنا مباشرة
                    </h3>

                    <p className="mt-2 text-sm font-bold leading-7 text-[var(--color-muted)]">
                      تابعنا أو ابعتلنا رسالة من خلال قنوات التواصل.
                    </p>

                    <div className="mt-5 flex flex-wrap gap-3">
                      {socialLinks.map(({ label, href, icon: Icon, className }) => (
                        <a
                          key={label}
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={label}
                          title={label}
                          className={`grid h-13 w-13 place-items-center rounded-full text-white shadow-lg shadow-black/10 transition hover:-translate-y-1 ${className}`}
                        >
                          <Icon className="text-2xl" />
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className={`${surfaceClass} p-6`}>
                    <div className="flex gap-3">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20">
                        <FaShieldAlt />
                      </span>

                      <div>
                        <h3 className="font-display text-lg font-black text-[var(--color-text)]">
                          بياناتك آمنة
                        </h3>

                        <p className="mt-2 text-sm font-bold leading-7 text-[var(--color-muted)]">
                          بنستخدم بياناتك للتواصل بخصوص الطلب فقط، والموقع
                          اختياري بالكامل.
                        </p>
                      </div>
                    </div>
                  </div>
                </aside>

                <div>
                  {result ? (
                    <div className={`${surfaceClass} p-8 text-center md:p-12`}>
                      <FaCheckCircle className="mx-auto mb-5 text-6xl text-emerald-500" />

                      <h2 className="font-display text-3xl font-black text-[var(--color-text)]">
                        {result.message}
                      </h2>

                      <p className="mt-3 text-lg font-bold text-[var(--color-muted)]">
                        رقم الطلب:{" "}
                        <strong className="text-[var(--color-text)]">
                          #{result.id}
                        </strong>
                      </p>

                      <p className="mt-2 text-sm font-bold text-[var(--color-muted)]">
                        الحالة الحالية: جديد
                      </p>

                      {result.fromClient && (
                        <p className="mt-2 text-sm font-bold text-[var(--color-muted)]">
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
                          <Link
                            className={secondaryButtonClass}
                            to="/client/requests"
                          >
                            عرض طلباتي
                          </Link>
                        )}

                        <Link className={secondaryButtonClass} to="/">
                          العودة للرئيسية
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <form
                      className={`${surfaceClass} p-6 md:p-8`}
                      onSubmit={submit}
                      noValidate
                    >
                      <div className="mb-8">
                        <span className={stepLabelClass}>طلب خدمة سريع</span>

                        <h2 className="font-display mt-2 text-2xl font-black text-[var(--color-text)]">
                          اترك بياناتك وهنكلمك
                        </h2>

                        <p className="mt-2 text-sm font-bold leading-7 text-[var(--color-muted)]">
                          اختار المنطقة والخدمة، وسيقوم فريق KING CLEAN
                          بالتواصل معك لتأكيد التفاصيل.
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
                            عند التفعيل سيظهر الطلب داخل صفحة طلباتي ويمكنك رؤية
                            رد الإدارة عند توفره.
                          </p>
                        </div>
                      )}

                      {areas.isError ? (
                        <ErrorState
                          error={areas.error}
                          retry={areas.refetch}
                          compact
                        />
                      ) : (
                        <div className={formGridClass}>
                          <div className={fieldClass}>
                            <label className={fieldLabelClass} htmlFor="areaId">
                              المنطقة *
                            </label>

                            <select
                              id="areaId"
                              className={inputClass}
                              disabled={areas.isLoading}
                              {...register("areaId", { valueAsNumber: true })}
                            >
                              <option value={0}>
                                {areas.isLoading
                                  ? "جار تحميل المناطق..."
                                  : "اختر المنطقة"}
                              </option>

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
                            <label
                              className={fieldLabelClass}
                              htmlFor="serviceId"
                            >
                              الخدمة *
                            </label>

                            <select
                              id="serviceId"
                              className={inputClass}
                              disabled={!areaId || services.isLoading}
                              {...register("serviceId", { valueAsNumber: true })}
                            >
                              <option value={0}>
                                {!areaId
                                  ? "اختر المنطقة أولا"
                                  : services.isLoading
                                    ? "جار تحميل الخدمات..."
                                    : "اختر الخدمة"}
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
                              الاسم اختياري
                            </label>

                            <input
                              id="name"
                              className={inputClass}
                              autoComplete="name"
                              placeholder="اسمك"
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
                              العنوان اختياري
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
                              ملاحظات اختيارية
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
                                    <FaRegTrashAlt />
                                    مسح
                                  </button>
                                )}

                                <button
                                  type="button"
                                  className={compactSecondaryButtonClass}
                                  disabled={locating}
                                  onClick={useLocation}
                                >
                                  <MdMyLocation className="text-base" />
                                  {locating ? "جار التحديد..." : "استخدم موقعي"}
                                </button>
                              </div>
                            </div>

                            {locationMessage && (
                              <p className="mb-0 mt-3 text-sm font-bold text-[var(--color-teal)]">
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
                      )}

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
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}