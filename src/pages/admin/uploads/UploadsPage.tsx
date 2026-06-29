import { Seo } from "../../../components/Seo";
import { ConfirmDialog } from "../../../components/ui";
import { UploadAssetPreview } from "./components/UploadAssetPreview";
import { UploadControlPanel } from "./components/UploadControlPanel";
import { UploadsPageHeader } from "./components/UploadsPageHeader";
import { useUploadsPage } from "./hooks/useUploadsPage";

export function UploadsPage() {
  
  const page = useUploadsPage();
  return (
    <>
      <Seo
        title="إدارة الملفات | KING CLEAN"
        description="رفع وإدارة ملفات KING CLEAN"
        noIndex
      />

      <UploadsPageHeader />

      <div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
        <UploadControlPanel
          folder={page.folder}
          lookupId={page.lookupId}
          progress={page.progress}
          busy={page.busy}
          onFolderChange={page.setFolder}
          onLookupIdChange={page.setLookupId}
          onLookup={() => void page.lookup()}
          onUpload={(file) => void page.upload(file)}
        />

        <UploadAssetPreview
          asset={page.asset}
          onDelete={() => page.setConfirmDelete(true)}
        />
      </div>

      {page.confirmDelete && page.asset && (
        <ConfirmDialog
          title="حذف الملف نهائيًا"
          message="سيتم حذف الملف من التخزين وسجل الملفات. قد تتوقف الصور أو الفيديوهات المرتبطة بهذا الرابط عن الظهور."
          confirmLabel="حذف نهائي"
          busy={page.busy}
          onConfirm={() => void page.remove()}
          onClose={() => page.setConfirmDelete(false)}
        />
      )}
    </>
  );
}