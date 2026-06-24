import type { SettingsFieldGroup } from "../types";

export const generalSettingsFields: SettingsFieldGroup = {
  title: "الإعدادات العامة",
  description: "اسم الموقع ومحتوى الواجهة والنص التعريفي.",
  fields: [
    { name: "siteName", label: "اسم الموقع" },
    { name: "heroTitle", label: "عنوان الواجهة", span: true },
    {
      name: "heroSubtitle",
      label: "وصف الواجهة",
      span: true,
      textarea: true,
    },
    { name: "aboutText", label: "نص من نحن", span: true, textarea: true },
  ],
};

export const contactSettingsFields: SettingsFieldGroup = {
  title: "بيانات التواصل",
  description: "أرقام التواصل والعنوان وساعات العمل.",
  fields: [
    { name: "phone", label: "رقم الهاتف" },
    { name: "whatsApp", label: "رقم واتساب" },
    { name: "email", label: "البريد الإلكتروني", type: "email" },
    { name: "address", label: "العنوان", span: true },
    { name: "workingHours", label: "ساعات العمل", span: true },
  ],
};

export const socialSettingsFields: SettingsFieldGroup = {
  title: "روابط التواصل الاجتماعي",
  description: "روابط المنصات المعروضة في الموقع العام.",
  fields: [
    { name: "facebookUrl", label: "رابط فيسبوك", type: "url" },
    { name: "instagramUrl", label: "رابط إنستغرام", type: "url" },
    { name: "tikTokUrl", label: "رابط تيك توك", type: "url" },
  ],
};

export const seoSettingsFields: SettingsFieldGroup = {
  title: "إعدادات SEO الافتراضية",
  description: "العنوان والوصف الافتراضيان لمحركات البحث.",
  fields: [
    { name: "metaTitle", label: "عنوان SEO الافتراضي", span: true },
    {
      name: "metaDescription",
      label: "وصف SEO الافتراضي",
      span: true,
      textarea: true,
    },
  ],
};
