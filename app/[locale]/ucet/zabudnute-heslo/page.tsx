import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import PasswordResetForm from "@/components/rental/PasswordResetForm";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "rental.auth" });
  return {
    ...buildMetadata({ locale, path: "/ucet/zabudnute-heslo", title: `${t("forgotTitle")} | Marosko`, description: t("forgotSubtitle") }),
    robots: { index: false, follow: false },
  };
}

export default async function ForgotPasswordPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("rental.auth");
  return (
    <div className="py-8 max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-espresso-800 mb-2">{t("forgotTitle")}</h1>
      <p className="text-gray-600 mb-6">{t("forgotSubtitle")}</p>
      <PasswordResetForm mode="request" />
    </div>
  );
}
