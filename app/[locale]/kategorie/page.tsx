import { getTranslations, setRequestLocale } from "next-intl/server";

const categoryKeys = [
  "angleGrinder",
  "drill",
  "straightGrinder",
  "miniMill",
  "powerTools",
  "cordless",
  "customAbrasive",
  "handTools",
  "coatings",
  "protective",
  "spareParts",
  "stands",
  "misc",
  "carvingBlanks",
  "shankTools",
] as const;

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("services");

  return (
    <div className="py-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-espresso-800 mb-4">{t("title")}</h1>
      <p className="text-gray-600 text-lg mb-10 max-w-2xl">{t("subtitle")}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryKeys.map((key) => (
          <div
            key={key}
            className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between border border-transparent hover:border-amber-200 transition-colors"
          >
            <div>
              <h2 className="text-xl font-bold text-espresso-800 mb-2">
                {t(`categories.${key}.name`)}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {t(`categories.${key}.description`)}
              </p>
            </div>
            <a
              href="https://eshop.marosko.sk"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-amber-700 font-semibold hover:underline"
            >
              {t("cta")} →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
