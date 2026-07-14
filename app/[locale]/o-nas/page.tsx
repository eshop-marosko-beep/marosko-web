import { getTranslations, setRequestLocale } from "next-intl/server";

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
      <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
        <p>{t("intro")}</p>
        <p>{t("history")}</p>
        <p>{t("brands")}</p>
        <p>{t("philosophy")}</p>
        <p>{t("support")}</p>
      </div>
    </div>
  );
}