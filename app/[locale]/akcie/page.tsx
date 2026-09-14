import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { promos } from "@/lib/promosData";
import { buildMetadata } from "@/lib/seo";
import { buildBreadcrumbListSchema } from "@/lib/structuredData";
import StructuredData from "@/components/StructuredData";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.promotions" });
  return buildMetadata({ locale, path: "/akcie", title: t("title"), description: t("description") });
}

export default async function PromotionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("promotions");
  const tNav = await getTranslations("navigation");
  const breadcrumbSchema = buildBreadcrumbListSchema(locale, [
    { name: tNav("home"), path: "/" },
    { name: tNav("promotions"), path: "/akcie" },
  ]);

  return (
    <div className="py-8 max-w-5xl mx-auto">
      <StructuredData data={breadcrumbSchema} />
      <h1 className="text-4xl font-bold text-espresso-800 mb-4">{t("title")}</h1>
      <p className="text-gray-600 text-lg mb-10 max-w-2xl">{t("subtitle")}</p>

      {promos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {promos.map(({ slug, image, alt, productUrl }) => (
            <a
              key={slug}
              href={productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl overflow-hidden shadow-lg border border-transparent hover:border-amber-200 hover:shadow-xl transition-all"
            >
              <Image
                src={image}
                alt={alt}
                width={1200}
                height={628}
                unoptimized
                className="w-full h-auto"
              />
            </a>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 bg-white rounded-xl shadow-lg p-8 text-center">{t("empty")}</p>
      )}
    </div>
  );
}
