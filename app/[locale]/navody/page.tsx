import Image from "next/image";
import { Link } from "@/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { videos } from "@/lib/videoData";
import { pdfGuides } from "@/lib/pdfGuides";
import { guideArticles } from "@/lib/guideArticles";
import { buildMetadata } from "@/lib/seo";
import { buildVideoListSchema } from "@/lib/structuredData";
import StructuredData from "@/components/StructuredData";
import ShareButtons from "@/components/ShareButtons";
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
  const tGuides = await getTranslations("guideArticles");

  const videoListSchema = buildVideoListSchema(
    locale,
    videos.map(({ slug, translationKey }) => ({
      slug,
      name: t(`items.${translationKey}.title`),
    }))
  );

  return (
    <div className="py-8 max-w-6xl mx-auto">
      <StructuredData data={videoListSchema} />

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
              className="w-full aspect-video bg-black object-contain"
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
              <div className="mt-4 pt-4 border-t border-amber-100">
                <ShareButtons
                  variant="compact"
                  url={`/navody/${slug}`}
                  title={t(`items.${translationKey}.title`)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {guideArticles.length > 0 && (
        <>
          <h2 className="text-3xl font-bold text-espresso-800 mt-16 mb-4">{tGuides("title")}</h2>
          <p className="text-gray-600 text-lg mb-10 max-w-2xl">{tGuides("subtitle")}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guideArticles.map(({ slug, translationKey, image, imageIsCover }) => (
              <Link
                key={slug}
                href={`/navody/clanky/${slug}`}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-transparent hover:border-amber-200 hover:shadow-xl transition-all flex flex-col"
              >
                <div className="relative h-44 bg-cream-100">
                  <Image
                    src={image}
                    alt={tGuides(`items.${translationKey}.title`)}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className={imageIsCover ? "object-contain p-4" : "object-cover"}
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-espresso-800 mb-2">
                    {tGuides(`items.${translationKey}.title`)}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">
                    {tGuides(`items.${translationKey}.cardDescription`)}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-1 text-amber-700 font-semibold text-sm">
                    {tGuides("readMore")} →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      <h2 className="text-3xl font-bold text-espresso-800 mt-16 mb-4">{t("pdfGuides.title")}</h2>
      <p className="text-gray-600 text-lg mb-10 max-w-2xl">{t("pdfGuides.subtitle")}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pdfGuides.map(({ slug, fileUrl, fileUrlByLocale, fileSize, translationKey }) => (
          <a
            key={slug}
            href={fileUrlByLocale?.[locale] ?? fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-xl shadow-lg p-6 flex flex-col border border-transparent hover:border-amber-200 hover:shadow-xl transition-all"
          >
            <div className="flex items-start gap-3 mb-3">
              <span className="shrink-0 bg-amber-50 text-amber-700 text-xs font-bold px-2 py-1 rounded">
                PDF
              </span>
              <h3 className="text-lg font-bold text-espresso-800">
                {t(`pdfGuides.items.${translationKey}.title`)}
              </h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">
              {t(`pdfGuides.items.${translationKey}.description`)}
            </p>
            <span className="mt-auto inline-flex items-center gap-1 text-amber-700 font-semibold text-sm">
              {t("pdfGuides.downloadLabel")} ({fileSize}) →
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
