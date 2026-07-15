import { getTranslations, setRequestLocale } from "next-intl/server";
import { shops } from "@/lib/shopsData";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.shops" });
  return buildMetadata({ locale, path: "/obchody", title: t("title"), description: t("description") });
}

export default async function ShopsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("shops");

  return (
    <div className="py-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-espresso-800 mb-4">{t("title")}</h1>
      <p className="text-gray-600 text-lg mb-10 max-w-2xl">{t("subtitle")}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {shops.map(({ slug, translationKey, url, primary }) => (
          <div
            key={slug}
            className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between border border-transparent hover:border-amber-200 transition-colors"
          >
            <div>
              {primary && (
                <span className="inline-block bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full mb-3">
                  {t("primaryBadge")}
                </span>
              )}
              <h2 className="text-xl font-bold text-espresso-800 mb-2">
                {t(`${translationKey}.name`)}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {t(`${translationKey}.description`)}
              </p>
            </div>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-amber-700 font-semibold hover:underline"
            >
              {t(`${translationKey}.cta`)} →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
