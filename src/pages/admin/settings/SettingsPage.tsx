import { Seo } from "../../../components/Seo";
import { ErrorState, PageLoading } from "../../../components/ui";
import {
  contactSettingsFields,
  generalSettingsFields,
  seoSettingsFields,
  socialSettingsFields,
} from "./utils/settingsFieldGroups";
import { ContactSettingsForm } from "./components/ContactSettingsForm";
import { GeneralSettingsForm } from "./components/GeneralSettingsForm";
import { SeoSettingsForm } from "./components/SeoSettingsForm";
import { SettingsPageHeader } from "./components/SettingsPageHeader";
import { SettingsSaveBar } from "./components/SettingsSaveBar";
import { SocialSettingsForm } from "./components/SocialSettingsForm";
import { useSettingsPage } from "./hooks/useSettingsPage";

export function SettingsPage() {
  const page = useSettingsPage();

  console.log(page.query.data)
  return (
    <>
      <Seo
        title="إعدادات الموقع | KING CLEAN"
        description="إدارة إعدادات الموقع"
        noIndex
      />

      <SettingsPageHeader />

      {page.query.isLoading ? (
        <PageLoading />
      ) : page.query.isError ? (
        <ErrorState
          error={page.query.error}
          retry={() => void page.query.refetch()}
        />
      ) : (
        <form className="grid gap-5" onSubmit={page.submit}>
          <GeneralSettingsForm
            errors={page.form.formState.errors}
            group={generalSettingsFields}
            register={page.form.register}
          />
          <ContactSettingsForm
            errors={page.form.formState.errors}
            group={contactSettingsFields}
            register={page.form.register}
          />
          <SocialSettingsForm
            errors={page.form.formState.errors}
            group={socialSettingsFields}
            register={page.form.register}
          />
          <SeoSettingsForm
            errors={page.form.formState.errors}
            group={seoSettingsFields}
            register={page.form.register}
          />
          <SettingsSaveBar
            isDirty={page.form.formState.isDirty}
            isPending={page.mutation.isPending}
          />
        </form>
      )}
    </>
  );
}
