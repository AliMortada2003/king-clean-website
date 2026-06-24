export const dateFormatter = new Intl.DateTimeFormat("ar-KW", {
  timeZone: "Asia/Kuwait",
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});
export const shortDateFormatter = new Intl.DateTimeFormat("ar-KW", {
  timeZone: "Asia/Kuwait",
  year: "numeric",
  month: "short",
  day: "numeric",
});
export const currencyFormatter = new Intl.NumberFormat("ar-KW", {
  style: "currency",
  currency: "KWD",
  maximumFractionDigits: 3,
});
export const numberFormatter = new Intl.NumberFormat("ar-KW");

function parseApiDate(value: string) {
  const normalized = /(?:z|[+-]\d{2}:?\d{2})$/i.test(value)
    ? value
    : `${value}Z`;
  return new Date(normalized);
}

export function formatDate(value?: string | null, short = false) {
  if (!value) return "—";
  const date = parseApiDate(value);
  if (Number.isNaN(date.getTime())) return "—";
  return (short ? shortDateFormatter : dateFormatter).format(date);
}

export function toDateTimeLocal(value?: string | null) {
  if (!value) return "";
  const date = parseApiDate(value);
  if (Number.isNaN(date.getTime())) return "";
  const kuwait = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Kuwait",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
  return kuwait.replace(" ", "T");
}

export function fromKuwaitDateTimeLocal(value?: string | null) {
  if (!value) return null;
  return new Date(`${value}:00+03:00`).toISOString();
}

export function normalizePhone(value: string) {
  return value.replace(/[^\d+]/g, "");
}

export function whatsAppUrl(
  phone?: string | null,
  message = "مرحباً، أرغب في طلب خدمة تنظيف",
) {
  if (!phone) return "";
  return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}
