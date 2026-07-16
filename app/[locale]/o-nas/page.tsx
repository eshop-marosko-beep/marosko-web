import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import StatsBar from "@/components/StatsBar";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.about" });
  return buildMetadata({ locale, path: "/o-nas", title: t("title"), description: t("description") });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("about");

  return (
    <div className="py-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-espresso-800 mb-6">
        {t("title")}
      </h1>
      <p className="text-gray-700 text-lg leading-relaxed">{t("intro")}</p>

      <StatsBar />

      <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
        <p>{t("history")}</p>
        <p>{t("brands")}</p>
        <p>{t("philosophy")}</p>
        <p>{t("support")}</p>
      </div>
    </div>
  );
}