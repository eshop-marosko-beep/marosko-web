import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/navigation";
import { buildMetadata } from "@/lib/seo";
import { videos, getVideo } from "@/lib/videoData";
import { buildSingleVideoObjectSchema } from "@/lib/structuredData";
import StructuredData from "@/components/StructuredData";
import ShareButtons from "@/components/ShareButtons";
import type { Metadata } from "next";

export function generateStaticParams() {
  return videos.map(({ slug }) => ({ video: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; video: string }>;
}): Promise<Metadata> {
  const { locale, video } = await params;
  const found = getVideo(video);
  if (!found) return {};

  const t = await getTranslations({ locale, namespace: "videos" });
  return buildMetadata({
    locale,
    path: `/navody/${video}`,
    title: t(`items.${found.translationKey}.title`),
    description: t(`items.${found.translationKey}.description`),
    image: `/videos/${found.file}.jpg`,
  });
}

export default async function VideoDetailPage({
  params,
}: {
  params: Promise<{ locale: string; video: string }>;
}) {
  const { locale, video } = await params;
  const found = getVideo(video);
  if (!found) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("videos");
  const title = t(`items.${found.translationKey}.title`);
  const description = t(`items.${found.translationKey}.description`);

  const schema = buildSingleVideoObjectSchema(found, { name: title, description });

  return (
    <div className="py-8 max-w-2xl mx-auto">
      <StructuredData data={schema} />

      <Link href="/navody" className="text-amber-700 font-semibold hover:underline mb-6 inline-block">
        ← {t("title")}
      </Link>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <video
          controls
          playsInline
          preload="metadata"
          poster={`/videos/${found.file}.jpg`}
          className="w-full aspect-video bg-black"
        >
          <source src={`/videos/${found.file}.mp4`} type="video/mp4" />
        </video>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-espresso-800 mb-2">{title}</h1>
          <p className="text-gray-600 leading-relaxed mb-6">{description}</p>

          {found.linkType === "internal" ? (
            <Link
              href={found.linkUrl}
              className="inline-block bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors mb-6"
            >
              {t("cta")} →
            </Link>
          ) : (
            <a
              href={found.linkUrl}
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
