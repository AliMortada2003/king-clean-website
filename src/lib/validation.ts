import { z } from "zod";

const optionalText = (max: number) =>
  z.string().trim().max(max).optional().or(z.literal(""));
const requiredText = (max: number, message: string) =>
  z.string().trim().min(1, message).max(max);

export const loginSchema = z.object({
  email: z.string().trim().email("أدخل بريداً إلكترونياً صحيحاً."),
  password: z.string().min(1, "كلمة المرور مطلوبة."),
});

const gmailEmail = z
  .string()
  .trim()
  .email("أدخل بريداً إلكترونياً صحيحاً.")
  .refine((value) => value.toLowerCase().endsWith("@gmail.com"), {
    message: "التسجيل متاح ببريد Gmail فقط.",
  });

export const clientLoginSchema = z.object({
  email: gmailEmail,
  password: z.string().min(1, "كلمة المرور مطلوبة."),
});

export const clientRegisterSchema = z
  .object({
    fullName: requiredText(150, "الاسم الكامل مطلوب."),
    email: gmailEmail,
    password: z.string().min(8, "كلمة المرور يجب ألا تقل عن 8 أحرف.").max(100),
    confirmPassword: z.string().min(1, "أكد كلمة المرور."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمة المرور وتأكيدها غير متطابقين.",
    path: ["confirmPassword"],
  });

export const clientResendConfirmationSchema = z.object({
  email: gmailEmail,
});

export const adminReplySchema = z.object({
  message: requiredText(2000, "رسالة الرد مطلوبة."),
});

export const serviceRequestSchema = z
  .object({
    name: optionalText(150),
    phone: z
      .string()
      .trim()
      .min(6, "رقم الهاتف يجب ألا يقل عن 6 خانات.")
      .max(30),
    areaId: z.coerce.number().int().positive("اختر المنطقة."),
    serviceId: z.coerce.number().int().positive("اختر الخدمة."),
    notes: optionalText(1000),
    address: optionalText(500),
    latitude: z.coerce.number().min(-90).max(90).nullable().optional(),
    longitude: z.coerce.number().min(-180).max(180).nullable().optional(),
  })
  .refine((data) => (data.latitude == null) === (data.longitude == null), {
    message: "يجب تحديد إحداثيات الموقع كاملة.",
    path: ["latitude"],
  });

export const resourceSchemas = {
  services: z.object({
    name: requiredText(150, "اسم الخدمة مطلوب."),
    slug: requiredText(180, "الرابط مطلوب."),
    shortDescription: requiredText(500, "الوصف المختصر مطلوب."),
    description: requiredText(4000, "الوصف مطلوب."),
    imageUrl: optionalText(500),
    icon: optionalText(100),
    isActive: z.boolean(),
    displayOrder: z.coerce.number().int().min(0),
    metaTitle: requiredText(200, "عنوان SEO مطلوب."),
    metaDescription: requiredText(500, "وصف SEO مطلوب."),
    areaIds: z.array(z.number()),
  }),
  areas: z.object({
    name: requiredText(150, "اسم المنطقة مطلوب."),
    slug: requiredText(180, "الرابط مطلوب."),
    description: requiredText(1500, "الوصف مطلوب."),
    isActive: z.boolean(),
    displayOrder: z.coerce.number().int().min(0),
    metaTitle: requiredText(200, "عنوان SEO مطلوب."),
    metaDescription: requiredText(500, "وصف SEO مطلوب."),
    serviceIds: z.array(z.number()),
  }),
  gallery: z.object({
    title: requiredText(200, "العنوان مطلوب."),
    description: requiredText(1000, "الوصف مطلوب."),
    imageUrl: requiredText(500, "الصورة مطلوبة."),
    serviceId: z.coerce.number().positive(),
    areaId: z.coerce.number().positive().nullable().optional(),
    isFeatured: z.boolean(),
    isActive: z.boolean(),
    displayOrder: z.coerce.number().int().min(0),
  }),
  videos: z.object({
    title: requiredText(200, "العنوان مطلوب."),
    description: requiredText(1000, "الوصف مطلوب."),
    videoUrl: requiredText(500, "رابط الفيديو مطلوب."),
    thumbnailUrl: optionalText(500),
    serviceId: z.coerce.number().positive(),
    areaId: z.coerce.number().positive().nullable().optional(),
    isFeatured: z.boolean(),
    isActive: z.boolean(),
    displayOrder: z.coerce.number().int().min(0),
  }),
  reviews: z.object({
    customerName: requiredText(150, "اسم العميل مطلوب."),
    rating: z.coerce.number().int().min(1).max(5),
    comment: requiredText(1000, "التعليق مطلوب."),
    isActive: z.boolean(),
    displayOrder: z.coerce.number().int().min(0),
  }),
  sections: z.object({
    key: requiredText(120, "المفتاح مطلوب."),
    page: requiredText(80, "الصفحة مطلوبة."),
    title: requiredText(250, "العنوان مطلوب."),
    subtitle: optionalText(500),
    body: optionalText(4000),
    imageUrl: optionalText(500),
    videoUrl: optionalText(500),
    ctaText: optionalText(150),
    ctaUrl: optionalText(500),
    payloadJson: optionalText(4000).refine((value) => {
      if (!value) return true;
      try {
        JSON.parse(value);
        return true;
      } catch {
        return false;
      }
    }, "صيغة JSON غير صالحة."),
    isActive: z.boolean(),
    displayOrder: z.coerce.number().int().min(0),
  }),
};

export const settingsSchema = z.object({
  siteName: requiredText(120, "اسم الموقع مطلوب."),
  phone: requiredText(30, "الهاتف مطلوب."),
  whatsApp: requiredText(30, "واتساب مطلوب."),
  email: z.string().trim().email().max(150),
  address: requiredText(300, "العنوان مطلوب."),
  workingHours: requiredText(200, "ساعات العمل مطلوبة."),
  facebookUrl: optionalText(500),
  instagramUrl: optionalText(500),
  tikTokUrl: optionalText(500),
  heroTitle: requiredText(200, "عنوان الواجهة مطلوب."),
  heroSubtitle: requiredText(500, "وصف الواجهة مطلوب."),
  aboutText: requiredText(2000, "نص من نحن مطلوب."),
  metaTitle: requiredText(200, "عنوان SEO مطلوب."),
  metaDescription: requiredText(500, "وصف SEO مطلوب."),
});
