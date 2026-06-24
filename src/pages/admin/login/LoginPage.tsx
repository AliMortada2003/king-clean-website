import { Seo } from "../../../components/Seo";
import { LoginForm } from "./components/LoginForm";
import { LoginHero } from "./components/LoginHero";
import { useLoginPage } from "./hooks/useLoginPage";

export function LoginPage() {
  const page = useLoginPage();

  return (
    <div className="min-h-screen bg-[var(--color-bg)] p-4 text-[var(--color-text)] md:p-8">
      <Seo
        title="دخول الإدارة | KING CLEAN"
        description="تسجيل دخول إدارة KING CLEAN"
        noIndex
      />

      <div className="mx-auto grid min-h-[calc(100vh-64px)] max-w-6xl overflow-hidden rounded-[30px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-strong)] lg:grid-cols-[0.9fr_1.1fr]">
        <LoginHero />

        <LoginForm
          register={page.form.register}
          errors={page.form.formState.errors}
          healthState={page.healthState}
          isLoggingIn={page.isLoggingIn}
          onSubmit={page.submit}
        />
      </div>
    </div>
  );
}