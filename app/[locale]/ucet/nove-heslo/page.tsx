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
    ...buildMetadata({ locale, path: "/ucet/nove-heslo", title: `${t("resetTitle")} | Marosko`, description: t("resetTitle") }),
    robots: { index: false, follow: false },
  };
}

function param(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

export default async function NewPasswordPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const query = await searchParams;
  const email = param(query.email).slice(0, 200);
  const token = param(query.token).slice(0, 100);
  const t = await getTranslations("rental.auth");
  return (
    <div className="py-8 max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-espresso-800 mb-2">{t("resetTitle")}</h1>
      <p className="text-gray-600 mb-6">{t("resetSubtitle", { email })}</p>
      <PasswordResetForm mode="confirm" email={email} token={token} />
    </div>
  );
}
