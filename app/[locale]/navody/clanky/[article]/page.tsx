import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/navigation";
import { buildMetadata } from "@/lib/seo";
import { guideArticles, getGuideArticle } from "@/lib/guideArticles";
import { buildBreadcrumbListSchema } from "@/lib/structuredData";
import StructuredData from "@/components/StructuredData";
import ShareButtons from "@/components/ShareButtons";
import type { Metadata } from "next";

type GuideLink = { labelKey: string; href: string };

type GuideStep = {
  title: string;
  body: string;
  relatedLinks?: GuideLink[];
};

type GuideSection = {
  title: string;
  body: string;
};

type GuideItem = {
  title: string;
  cardDescription: string;
  eyebrow: string;
  intro: string;
  steps?: GuideStep[];
  sections?: GuideSection[];
  factsTitle?: string;
  facts?: string[];
  ctaLabel?: string;
  contextBody?: string;
  contextLinkLabel?: string;
  closingBody?: string;
  closingLinks?: GuideLink[];
};

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
  if (!found) return {};

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
  setRequestLocale(locale);

  const t = await getTranslations("guideArticles");
  const tLinks = await getTranslations("guideArticles.relatedLinkLabels");
  const tNav = await getTranslations("navigation");
  const key = found.translationKey;
  const item = t.raw(`items.${key}`) as GuideItem;

  const breadcrumbSchema = buildBreadcrumbListSchema(locale, [
    { name: tNav("home"), path: "/" },
    { name: tNav("videos"), path: "/navody" },
    { name: item.title, path: `/navody/clanky/${article}` },
  ]);

  return (
    <div className="py-8 max-w-3xl mx-auto">
      <StructuredData data={breadcrumbSchema} />

      <Link href="/navody" className="text-amber-700 font-semibold hover:underline mb-6 inline-block">
        ← {t("backToGuides")}
      </Link>

      <p className="text-sm font-semibold text-amber-700 uppercase tracking-wide mb-2">{item.eyebrow}</p>
      <h1 className="text-4xl font-bold text-espresso-800 mb-6">{item.title}</h1>

      <div
        className={`relative rounded-xl overflow-hidden mb-6 bg-cream-100 ${
          found.imageIsCover ? "h-64 w-48 mx-auto" : "h-64 md:h-80"
        }`}
      >
        <Image
          src={found.image}
          alt={item.title}
          fill
          unoptimized
          className={found.imageIsCover ? "object-contain" : "object-cover"}
          priority
        />
      </div>

      <p className="text-gray-600 text-lg leading-relaxed mb-10">{item.intro}</p>

      {item.steps && item.steps.length > 0 && (
        <>
          <h2 className="text-2xl font-bold text-espresso-800 mb-6">{t("stepsTitle")}</h2>
          <div className="space-y-8 mb-10">
            {item.steps.map((step, i) => (
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
        </>
      )}

      {item.sections && item.sections.length > 0 && (
        <div className="space-y-8 mb-10">
          {item.sections.map((section, i) => (
            <div key={i}>
              <h2 className="text-2xl font-bold text-espresso-800 mb-3">{section.title}</h2>
              <p className="text-gray-600 leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>
      )}

      {item.facts && item.facts.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-10">
          {item.factsTitle && (
            <h2 className="text-lg font-bold text-espresso-800 mb-3">{item.factsTitle}</h2>
          )}
          <ul className="space-y-1.5">
            {item.facts.map((fact, i) => (
              <li key={i} className="text-gray-600 text-sm">
                {fact}
              </li>
            ))}
          </ul>
        </div>
      )}

      {found.primaryCta && item.ctaLabel && (
        <a
          href={found.primaryCta.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors mb-10"
        >
          {item.ctaLabel} →
        </a>
      )}

      {item.contextBody && (
        <>
          <h2 className="text-2xl font-bold text-espresso-800 mb-4">{t("contextTitle")}</h2>
          <p className="text-gray-600 leading-relaxed mb-2">{item.contextBody}</p>
          {item.contextLinkLabel && (
            <a
              href="https://eshop.marosko.sk/b/Andrej+Ir%C5%A1a+-+a+-+studio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-700 font-semibold hover:underline text-sm"
            >
              {item.contextLinkLabel} →
            </a>
          )}
        </>
      )}

      {item.closingBody && (
        <div className="mt-10 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-espresso-800 mb-3">{t("closingTitle")}</h2>
          <p className="text-gray-600 leading-relaxed mb-4">{item.closingBody}</p>
          {item.closingLinks && item.closingLinks.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {item.closingLinks.map(({ labelKey, href }) => (
                <Link key={href} href={href} className="text-amber-700 font-semibold hover:underline text-sm">
                  {tLinks(labelKey)} →
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-10 pt-6 border-t border-amber-100">
        <ShareButtons variant="compact" url={`/navody/clanky/${article}`} title={item.title} />
      </div>
    </div>
  );
}
