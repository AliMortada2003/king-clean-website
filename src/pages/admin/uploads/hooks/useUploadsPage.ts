import { useState } from "react";
import { toast } from "sonner";

import { adminApi } from "../../../../api/endpoints";
import type { UploadAsset, UploadProgress } from "../types";
import {
  getUploadValidationError,
  sanitizeUploadFolder,
} from "../utils/uploadValidation";

export function useUploadsPage() {
  const [asset, setAsset] = useState<UploadAsset | null>(null);
  const [lookupId, setLookupId] = useState("");
  const [folder, setFolderValue] = useState("general");
  const [progress, setProgress] = useState<UploadProgress>(null);
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const setFolder = (value: string) => {
    setFolderValue(sanitizeUploadFolder(value));
  };

  const upload = async (file?: File) => {
    if (!file) return;

    const validationError = getUploadValidationError(file);

    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      setBusy(true);
      setProgress(0);

      const result = await adminApi.upload(file, folder, setProgress);

      setAsset(result);
      setLookupId(String(result.id));
      toast.success("تم رفع الملف بنجاح.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "تعذر رفع الملف.",
      );
    } finally {
      setBusy(false);
      setProgress(null);
    }
  };

  const lookup = async () => {
    const id = Number(lookupId);

    if (!id) {
      toast.error("من فضلك أدخل رقم ملف صحيح.");
      return;
    }

    try {
      setBusy(true);

      const result = await adminApi.uploadById(id);

      setAsset(result);
    } catch (error) {
      setAsset(null);
      toast.error(
        error instanceof Error ? error.message : "الملف غير موجود.",
      );
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!asset) return;

    try {
      setBusy(true);

      await adminApi.deleteUpload(asset.id);

      toast.success("تم حذف الملف نهائيًا.");
      setAsset(null);
      setLookupId("");
      setConfirmDelete(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "تعذر حذف الملف.",
      );
    } finally {
      setBusy(false);
    }
  };

  return {
    asset,
    lookupId,
    folder,
    progress,
    busy,
    confirmDelete,
    setLookupId,
    setFolder,
    setConfirmDelete,
    upload,
    lookup,
    remove,
  };
}