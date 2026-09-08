import Hero from "@/components/home/Hero";
import StatsBar from "@/components/StatsBar";
import Categories from "@/components/home/Categories";
import BrandSpotlightTabs from "@/components/home/BrandSpotlightTabs";
import AboutSection from "@/components/home/AboutSection";
import Testimonials from "@/components/home/Testimonials";
import Faq from "@/components/home/Faq";
import ContactSection from "@/components/home/ContactSection";
import StructuredData from "@/components/StructuredData";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { buildOrganizationSchema, buildLocalBusinessSchema, buildFaqSchema } from "@/lib/structuredData";
import { spotlightTabs } from "@/lib/spotlightData";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.home" });
  return buildMetadata({ locale, path: "", title: t("title"), description: t("description") });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tFaq = await getTranslations({ locale, namespace: "home.faq" });
  const faqKeys = ["q1", "q2", "q3", "q4"] as const;
  const faqSchema = buildFaqSchema(
    faqKeys.map((key) => ({
      question: tFaq(`${key}.question`),
      answer: tFaq(`${key}.answer`),
    }))
  );

  return (
    <div className="divide-y divide-amber-100">
      <StructuredData data={buildOrganizationSchema()} />
      <StructuredData data={buildLocalBusinessSchema()} />
      <StructuredData data={faqSchema} />
      <Hero />
      <StatsBar />
      <Categories />
      <BrandSpotlightTabs tabs={spotlightTabs} />
      <AboutSection />
      <Testimonials locale={locale} />
      <Faq />
      <ContactSection />
    </div>
  );
}
