import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/navigation";
import { buildMetadata } from "@/lib/seo";
import { getGuideVideo, guideLinkUrl, localized } from "@/lib/guidesCatalog";
import { buildSingleVideoObjectSchema, buildBreadcrumbListSchema } from "@/lib/structuredData";
import StructuredData from "@/components/StructuredData";
import ShareButtons from "@/components/ShareButtons";
import YouTubePlayer from "@/components/YouTubePlayer";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; video: string }>;
}): Promise<Metadata> {
  const { locale, video } = await params;
  const found = await getGuideVideo(video);
  if (!found) return {};

  return {
    ...buildMetadata({
      locale,
      path: `/navody/${video}`,
      title: localized(found.titles, locale),
      description: localized(found.descriptions, locale),
      image: found.poster,
    }),
    ...(found.active ? {} : { robots: { index: false, follow: false } }),
  };
}

export default async function VideoDetailPage({
  params,
}: {
  params: Promise<{ locale: string; video: string }>;
}) {
  const { locale, video } = await params;
  const found = await getGuideVideo(video);
  if (!found || !found.active) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("videos");
  const tNav = await getTranslations("navigation");
  const title = localized(found.titles, locale);
  const description = localized(found.descriptions, locale);
  const linkUrl = guideLinkUrl(found, locale);

  const schema = buildSingleVideoObjectSchema(found, { name: title, description });
  const breadcrumbSchema = buildBreadcrumbListSchema(locale, [
    { name: tNav("home"), path: "/" },
    { name: tNav("videos"), path: "/navody" },
    { name: title, path: `/navody/${video}` },
  ]);

  return (
    <div className="py-8 max-w-2xl mx-auto">
      <StructuredData data={schema} />
      <StructuredData data={breadcrumbSchema} />

      <Link href="/navody" className="text-amber-700 font-semibold hover:underline mb-6 inline-block">
        ← {t("title")}
      </Link>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {found.source === "youtube" && found.youtubeId ? (
          <YouTubePlayer
            youtubeId={found.youtubeId}
            poster={found.poster}
            title={title}
            playLabel={t("play")}
          />
        ) : (
          <video
            controls
            playsInline
            preload="metadata"
            poster={found.poster}
            className="w-full aspect-video bg-black"
          >
            <source src={`/videos/${found.file}.mp4`} type="video/mp4" />
          </video>
        )}
        <div className="p-6">
          <h1 className="text-2xl font-bold text-espresso-800 mb-2">{title}</h1>
          <p className="text-gray-600 leading-relaxed mb-6 whitespace-pre-line">{description}</p>

          {!linkUrl ? null : linkUrl.startsWith("/") ? (
            <Link
              href={linkUrl}
              className="inline-block bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors mb-6"
            >
              {t("cta")} →
            </Link>
          ) : (
            <a
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors mb-6"
            >
              {t("cta")} →
            </a>
          )}

          <div className="pt-4 border-t border-amber-100">
            <ShareButtons variant="compact" url={`/navody/${video}`} title={title} />
          </div>
        </div>
      </div>
    </div>
  );
}
