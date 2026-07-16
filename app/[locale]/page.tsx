import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import AboutSection from "@/components/home/AboutSection";
import Testimonials from "@/components/home/Testimonials";
import Faq from "@/components/home/Faq";
import ContactSection from "@/components/home/ContactSection";
import StructuredData from "@/components/StructuredData";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { buildOrganizationSchema, buildLocalBusinessSchema } from "@/lib/structuredData";
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

  return (
    <div className="divide-y divide-amber-100">
      <StructuredData data={buildOrganizationSchema()} />
      <StructuredData data={buildLocalBusinessSchema()} />
      <Hero />
      <Categories />
      <AboutSection />
      <Testimonials locale={locale} />
      <Faq />
      <ContactSection />
    </div>
  );
}
