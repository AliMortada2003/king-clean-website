import {
  ArrowRight,
  Clock3,
  ExternalLink,
  Mail,
  MapPin,
  MessageSquareText,
} from "lucide-react";

import { Seo } from "../../../components/Seo";
import { ErrorState, PageLoading } from "../../../components/ui";
import { formatDate } from "../../../lib/format";
import { requestStatuses } from "../../../lib/status";
import { AccountBadge, ReplyBadge, RequestStatusBadge, RequestsPanel } from "./components/requestsUi";
import { useRequestDetailsPage } from "./hooks/useRequestDetailsPage";
import { requestStatusLabels } from "./utils/requestConstants";

const fieldClass = "grid gap-2";
const labelClass = "text-sm font-black text-[var(--color-text)]";
const inputClass =
  "min-h-12 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm font-bold text-[var(--color-text)] outline-none focus:border-[var(--color-gold)] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--color-gold)_18%,transparent)]";
const textareaClass = `${inputClass} min-h-28 py-3`;
const buttonPrimary =
  "inline-flex min-h-11 items-center justify-center rounded-2xl bg-[var(--color-gold)] px-5 text-sm font-black text-[var(--color-navy)] disabled:cursor-not-allowed disabled:opacity-60";
const buttonSecondary =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 text-sm font-black text-[var(--color-text)] transition hover:border-[var(--color-gold)]";

export function RequestDetailsPage() {
  const page = useRequestDetailsPage();
  const request = page.request.data;
  const details = page.detailsForm;
  const reply = page.replyForm;

  if (page.request.isLoading) return <PageLoading />;

  if (page.request.isError || !request) {
    return (
      <ErrorState
        error={page.request.error}
        retry={() => void page.request.refetch()}
      />
    );
  }

  return (
    <>
      <Seo
        title={`الطلب #${page.id} | KING CLEAN`}
        description="تفاصيل طلب الخدمة"
        noIndex
      />

      <header className="mb-6 flex flex-col gap-4 border-b border-[var(--color-border)] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <button
            className="mb-3 inline-flex items-center gap-2 text-sm font-black text-[var(--color-teal)]"
            type="button"
            onClick={() => page.navigate(-1)}
          >
            <ArrowRight size={16} />
            العودة للطلبات
          </button>
          <h1 className="m-0 font-display text-3xl font-black text-[var(--color-text)]">
            طلب الخدمة #{page.id}
          </h1>
          <p className="mt-2 text-sm font-bold text-[var(--color-muted)]">
            أنشئ في {page.formattedCreatedAt}
            {page.formattedUpdatedAt
              ? ` · آخر تحديث ${page.formattedUpdatedAt}`
              : ""}
          </p>
        </div>
        <RequestStatusBadge status={request.status} />
      </header>

      <section className="mb-6 grid gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-soft sm:grid-cols-2 xl:grid-cols-4">
        <div>
          <span className="text-xs font-black text-[var(--color-muted)]">
            الطلب
          </span>
          <strong className="mt-1 block text-[var(--color-text)]">#{page.id}</strong>
        </div>
        <div>
          <span className="text-xs font-black text-[var(--color-muted)]">
            العميل
          </span>
          <strong className="mt-1 block text-[var(--color-text)]">
            {request.name || "بدون اسم"}
          </strong>
        </div>
        <div>
          <span className="text-xs font-black text-[var(--color-muted)]">
            الهاتف
          </span>
          <a className="mt-1 block font-black text-[var(--color-text)]" href={`tel:${request.phone}`} dir="ltr">
            {request.phone}
          </a>
        </div>
        <div>
          <span className="text-xs font-black text-[var(--color-muted)]">
            نوع الحساب
          </span>
          <div className="mt-1">
            <AccountBadge clientEmail={request.clientEmail} />
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.75fr)]">
        <RequestsPanel className="p-5 sm:p-6">
          <form onSubmit={page.saveDetails}>
            <h2 className="m-0 font-display text-xl font-black text-[var(--color-text)]">
              بيانات الطلب
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className={fieldClass}>
                <label className={labelClass} htmlFor="request-name">
                  اسم العميل
                </label>
                <input
                  className={inputClass}
                  id="request-name"
                  maxLength={150}
                  {...details.register("name")}
                />
              </div>

              <div className={fieldClass}>
                <label className={labelClass} htmlFor="request-phone">
                  الهاتف *
                </label>
                <input
                  className={inputClass}
                  id="request-phone"
                  minLength={6}
                  maxLength={30}
                  required
                  {...details.register("phone")}
                />
              </div>

              <div className={fieldClass}>
                <label className={labelClass} htmlFor="request-area">
                  المنطقة *
                </label>
                <select
                  className={inputClass}
                  id="request-area"
                  required
                  {...details.register("areaId", { valueAsNumber: true })}
                >
                  {page.areas.data?.map((area) => (
                    <option value={area.id} key={area.id}>
                      {area.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={fieldClass}>
                <label className={labelClass} htmlFor="request-service">
                  الخدمة *
                </label>
                <select
                  className={inputClass}
                  id="request-service"
                  required
                  {...details.register("serviceId", { valueAsNumber: true })}
                >
                  {page.serviceOptions.map((service) => (
                    <option value={service.id} key={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={`${fieldClass} md:col-span-2`}>
                <label className={labelClass} htmlFor="request-address">
                  العنوان
                </label>
                <input
                  className={inputClass}
                  id="request-address"
                  maxLength={500}
                  {...details.register("address")}
                />
              </div>

              <div className={`${fieldClass} md:col-span-2`}>
                <label className={labelClass} htmlFor="request-notes">
                  ملاحظات العميل
                </label>
                <textarea
                  className={textareaClass}
                  id="request-notes"
                  maxLength={1000}
                  {...details.register("notes")}
                />
              </div>

              <div className={fieldClass}>
                <label className={labelClass} htmlFor="scheduledAt">
                  الموعد المجدول
                </label>
                <input
                  className={inputClass}
                  id="scheduledAt"
                  type="datetime-local"
                  {...details.register("scheduledAt")}
                />
              </div>

              <div className={fieldClass}>
                <label className={labelClass} htmlFor="finalPrice">
                  السعر النهائي (د.ك)
                </label>
                <input
                  className={inputClass}
                  id="finalPrice"
                  type="number"
                  min={0}
                  step="0.001"
                  {...details.register("finalPrice", {
                    setValueAs: (value) =>
                      value === "" ? null : Number(value),
                  })}
                />
              </div>

              <div className={`${fieldClass} md:col-span-2`}>
                <label className={labelClass} htmlFor="internalNotes">
                  ملاحظات الإدارة
                </label>
                <textarea
                  className={textareaClass}
                  id="internalNotes"
                  maxLength={2000}
                  {...details.register("internalNotes")}
                />
              </div>
            </div>

            <button
              className={`${buttonPrimary} mt-6`}
              disabled={page.mutations.update.isPending}
              type="submit"
            >
              {page.mutations.update.isPending
                ? "جاري الحفظ..."
                : "حفظ التعديلات"}
            </button>
          </form>
        </RequestsPanel>

        <aside className="grid gap-5">
          <RequestsPanel className="p-5">
            <h2 className="m-0 font-display text-lg font-black text-[var(--color-text)]">
              حساب العميل والرد
            </h2>

            {request.clientUserId && request.clientEmail ? (
              <div className="mt-4 grid gap-4">
                <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4">
                  <div className="flex items-center gap-2 font-black text-[var(--color-text)]">
                    <Mail size={18} className="text-[var(--color-gold-dark)]" />
                    طلب مرتبط بحساب عميل
                  </div>
                  <p className="mb-0 mt-2 break-all text-sm font-bold text-[var(--color-muted)]" dir="ltr">
                    {request.clientEmail}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <ReplyBadge isReplied={page.hasReply} />
                  {request.adminRepliedAt && (
                    <span className="text-sm font-bold text-[var(--color-muted)]">
                      {formatDate(request.adminRepliedAt)}
                    </span>
                  )}
                </div>

                {request.adminReplyMessage && (
                  <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4">
                    <div className="mb-2 flex items-center gap-2 font-black">
                      <MessageSquareText
                        size={18}
                        className="text-[var(--color-gold-dark)]"
                      />
                      الرد الحالي
                    </div>
                    <p className="m-0 leading-8 text-[var(--color-muted)]">
                      {request.adminReplyMessage}
                    </p>
                  </div>
                )}

                <form className="grid gap-3" onSubmit={page.saveReply}>
                  <div className={fieldClass}>
                    <label className={labelClass} htmlFor="admin-reply">
                      رسالة الرد للعميل
                    </label>
                    <textarea
                      className={textareaClass}
                      id="admin-reply"
                      maxLength={2000}
                      placeholder="اكتب ردًا واضحًا للعميل..."
                      {...reply.register("message")}
                    />
                    {reply.formState.errors.message && (
                      <span className="text-sm font-bold text-[var(--color-danger)]">
                        {reply.formState.errors.message.message}
                      </span>
                    )}
                  </div>
                  <button
                    className={buttonPrimary}
                    disabled={page.mutations.reply.isPending}
                    type="submit"
                  >
                    {page.mutations.reply.isPending
                      ? "جاري إرسال الرد..."
                      : page.hasReply
                        ? "تحديث الرد"
                        : "إرسال الرد"}
                  </button>
                </form>
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-soft)] p-5">
                <Clock3 className="mb-3 text-[var(--color-gold-dark)]" size={30} />
                <strong className="text-[var(--color-text)]">
                  طلب بدون حساب عميل
                </strong>
                <p className="mb-0 mt-2 leading-8 text-[var(--color-muted)]">
                  هذا الطلب غير مرتبط بحساب عميل، ويتم التواصل معه خارج المنصة عبر رقم الهاتف.
                </p>
              </div>
            )}
          </RequestsPanel>

          <RequestsPanel className="p-5">
            <h2 className="m-0 font-display text-lg font-black text-[var(--color-text)]">
              حالة الطلب
            </h2>
            <select
              className={`${inputClass} mt-4`}
              value={page.status}
              onChange={(event) => page.setStatusFromValue(event.target.value)}
            >
              {requestStatuses.map((item) => (
                <option value={item} key={item}>
                  {requestStatusLabels[item]}
                </option>
              ))}
            </select>
            <button
              className={`${buttonPrimary} mt-4 w-full`}
              disabled={
                page.mutations.status.isPending || page.status === request.status
              }
              type="button"
              onClick={page.saveStatus}
            >
              تحديث الحالة
            </button>
          </RequestsPanel>

          <RequestsPanel className="p-5">
            <h2 className="m-0 font-display text-lg font-black text-[var(--color-text)]">
              الموقع
            </h2>
            {request.locationUrl ? (
              <a
                className={`${buttonSecondary} mt-4 w-full`}
                href={request.locationUrl}
                target="_blank"
                rel="noreferrer"
              >
                <MapPin size={18} />
                فتح الخريطة
                <ExternalLink size={15} />
              </a>
            ) : (
              <p className="mt-3 text-sm font-bold text-[var(--color-muted)]">
                لم يحدد العميل موقعًا جغرافيًا.
              </p>
            )}
          </RequestsPanel>
        </aside>
      </div>
    </>
  );
}
