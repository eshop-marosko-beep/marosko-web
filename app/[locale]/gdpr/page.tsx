import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function GdprPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("gdpr");
  const sectionKeys = [
    "controller",
    "purposes",
    "retention",
    "recipients",
    "transfers",
    "rights",
    "complaint",
    "cookiesTech",
  ] as const;

  return (
    <div className="py-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-espresso-800 mb-4">{t("title")}</h1>
      <p className="text-gray-600 mb-10 leading-relaxed">{t("intro")}</p>

      <div className="space-y-8">
        {sectionKeys.map((key) => (
          <section key={key}>
            <h2 className="text-xl font-bold text-espresso-800 mb-2">
              {t(`sections.${key}.title`)}
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {t(`sections.${key}.text`)}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
