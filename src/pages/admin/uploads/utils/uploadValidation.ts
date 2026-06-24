const imageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const videoTypes = ["video/mp4", "video/webm", "video/quicktime"];

export function sanitizeUploadFolder(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "");
}

export function getUploadValidationError(file: File) {
  const image = imageTypes.includes(file.type);
  const video = videoTypes.includes(file.type);

  if (!image && !video) {
    return "نوع الملف غير مدعوم.";
  }

  if (
    (image && file.size > 5 * 1024 * 1024) ||
    (video && file.size > 50 * 1024 * 1024)
  ) {
    return "حجم الملف يتجاوز الحد المسموح.";
  }

  return null;
}