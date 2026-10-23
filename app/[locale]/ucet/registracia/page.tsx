import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "@/navigation";
import { buildMetadata } from "@/lib/seo";
import RentalAuthForm from "@/components/rental/RentalAuthForm";
import { safeNextPath } from "@/lib/rental/next";
import { getCurrentUser } from "@/lib/rental/users";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "rental.auth" });
  return {
    ...buildMetadata({ locale, path: "/ucet/registracia", title: `${t("registerTitle")} | Marosko`, description: t("registerSubtitle") }),
    robots: { index: false, follow: true },
  };
}

export default async function RegisterPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const next = safeNextPath((await searchParams).next);

  if (await getCurrentUser()) return redirect({ href: next, locale });

  const t = await getTranslations("rental.auth");
  return (
    <div className="py-8 max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-espresso-800 mb-2">{t("registerTitle")}</h1>
      <p className="text-gray-600 mb-6">{t("registerSubtitle")}</p>
      <RentalAuthForm mode="register" next={next} />
    </div>
  );
}
