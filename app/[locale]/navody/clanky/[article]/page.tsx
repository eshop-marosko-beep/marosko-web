import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/navigation";
import { buildMetadata } from "@/lib/seo";
import { guideArticles, getGuideArticle } from "@/lib/guideArticles";
import ShareButtons from "@/components/ShareButtons";
import type { Metadata } from "next";

type GuideStep = {
  title: string;
  body: string;
  relatedLinks?: { labelKey: string; href: string }[];
};

// Written guides are Slovak-only for now — no translated copy exists yet for cz/en/ro.
function assertSlovak(locale: string) {
  if (locale !== "sk") notFound();
}

export function generateStaticParams() {
  return guideArticles.map(({ slug }) => ({ article: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; article: string }>;
}): Promise<Metadata> {
  const { locale, article } = await params;
  const found = getGuideArticle(article);
  if (!found || locale !== "sk") return {};

  const t = await getTranslations({ locale, namespace: "guideArticles" });
  return buildMetadata({
    locale,
    path: `/navody/clanky/${article}`,
    title: t(`items.${found.translationKey}.title`),
    description: t(`items.${found.translationKey}.cardDescription`),
    image: found.image,
  });
}

export default async function GuideArticlePage({
  params,
}: {
  params: Promise<{ locale: string; article: string }>;
}) {
  const { locale, article } = await params;
  const found = getGuideArticle(article);
  if (!found) notFound();
  assertSlovak(locale);
  setRequestLocale(locale);

  const t = await getTranslations("guideArticles");
  const tLinks = await getTranslations("guideArticles.relatedLinkLabels");
  const key = found.translationKey;
  const steps = t.raw(`items.${key}.steps`) as GuideStep[];

  return (
    <div className="py-8 max-w-3xl mx-auto">
      <Link href="/navody" className="text-amber-700 font-semibold hover:underline mb-6 inline-block">
        ← {t("backToGuides")}
      </Link>

      <p className="text-sm font-semibold text-amber-700 uppercase tracking-wide mb-2">
        {t(`items.${key}.eyebrow`)}
      </p>
      <h1 className="text-4xl font-bold text-espresso-800 mb-6">{t(`items.${key}.title`)}</h1>

      <div className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-6 bg-cream-100">
        <Image
          src={found.image}
          alt={t(`items.${key}.title`)}
          fill
          sizes="(min-width: 768px) 768px, 100vw"
          className="object-cover"
          priority
        />
      </div>

      <p className="text-gray-600 text-lg leading-relaxed mb-10">{t(`items.${key}.intro`)}</p>

      <h2 className="text-2xl font-bold text-espresso-800 mb-6">{t("stepsTitle")}</h2>
      <div className="space-y-8 mb-10">
        {steps.map((step, i) => (
          <div key={i}>
            <h3 className="text-lg font-bold text-espresso-800 mb-2">{step.title}</h3>
            <p className="text-gray-600 leading-relaxed">{step.body}</p>
            {step.relatedLinks && step.relatedLinks.length > 0 && (
              <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="text-xs font-semibold text-amber-800 uppercase tracking-wide">
                  {t("relatedLabel")}
                </span>
                {step.relatedLinks.map(({ labelKey, href }) => (
                  <Link key={href} href={href} className="text-amber-700 font-semibold hover:underline text-sm">
                    {tLinks(labelKey)} →
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-espresso-800 mb-4">{t("contextTitle")}</h2>
      <p className="text-gray-600 leading-relaxed mb-2">{t(`items.${key}.contextBody`)}</p>
      <a
        href="https://eshop.marosko.sk/b/Andrej+Ir%C5%A1a+-+a+-+studio"
        target="_blank"
        rel="noopener noreferrer"
        className="text-amber-700 font-semibold hover:underline text-sm"
      >
        {t(`items.${key}.contextLinkLabel`)} →
      </a>

      <div className="mt-10 bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-espresso-800 mb-3">{t("closingTitle")}</h2>
        <p className="text-gray-600 leading-relaxed mb-4">{t(`items.${key}.closingBody`)}</p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/kategorie/listy-carvingove-vytvarnicke"
            className="text-amber-700 font-semibold hover:underline text-sm"
          >
            {tLinks("carvingoveListy")} →
          </Link>
          <Link
            href="/kategorie/brusne-vyseky-brusny-papier-platno"
            className="text-amber-700 font-semibold hover:underline text-sm"
          >
            {tLinks("brusneVyseky")} →
          </Link>
          <Link
            href="/kategorie/prislusenstva-do-priamej-brusky-frezky"
            className="text-amber-700 font-semibold hover:underline text-sm"
          >
            {tLinks("priamaBruska")} →
          </Link>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-amber-100">
        <ShareButtons variant="compact" url={`/navody/clanky/${article}`} title={t(`items.${key}.title`)} />
      </div>
    </div>
  );
}
