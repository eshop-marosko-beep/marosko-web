import { Link } from "@/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { videos } from "@/lib/videoData";
import { buildMetadata } from "@/lib/seo";
import { buildVideoObjectSchemas } from "@/lib/structuredData";
import StructuredData from "@/components/StructuredData";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.videos" });
  return buildMetadata({
    locale,
    path: "/navody",
    title: t("title"),
    description: t("description"),
    image: `/videos/${videos[0].file}.jpg`,
  });
}

export default async function VideosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("videos");

  const schemas = buildVideoObjectSchemas(
    videos.map(({ slug, translationKey }) => ({
      slug,
      name: t(`items.${translationKey}.title`),
      description: t(`items.${translationKey}.description`),
    }))
  );

  return (
    <div className="py-8 max-w-6xl mx-auto">
      {schemas.map((schema, i) => (
        <StructuredData key={i} data={schema} />
      ))}

      <h1 className="text-4xl font-bold text-espresso-800 mb-4">{t("title")}</h1>
      <p className="text-gray-600 text-lg mb-4 max-w-2xl">{t("subtitle")}</p>
      <p className="text-gray-600 leading-relaxed mb-10 max-w-2xl">{t("intro")}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map(({ slug, file, linkUrl, linkType, translationKey }) => (
          <div
            key={slug}
            className="bg-white rounded-xl shadow-lg overflow-hidden border border-transparent hover:border-amber-200 hover:shadow-xl transition-all flex flex-col"
          >
            <video
              controls
              playsInline
              preload="metadata"
              poster={`/videos/${file}.jpg`}
              className="w-full aspect-video bg-black"
            >
              <source src={`/videos/${file}.mp4`} type="video/mp4" />
            </video>
            <div className="p-6 flex flex-col flex-1">
              <h2 className="text-lg font-bold text-espresso-800 mb-2">
                {t(`items.${translationKey}.title`)}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">
                {t(`items.${translationKey}.description`)}
              </p>
              {linkType === "internal" ? (
                <Link
                  href={linkUrl}
                  className="mt-auto inline-flex items-center justify-center gap-1 bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-700 transition-colors text-sm"
                >
                  {t("cta")} →
                </Link>
              ) : (
                <a
                  href={linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center justify-center gap-1 bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-700 transition-colors text-sm"
                >
                  {t("cta")} →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
