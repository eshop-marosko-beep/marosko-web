import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import AboutSection from "@/components/home/AboutSection";
import Testimonials from "@/components/home/Testimonials";
import Faq from "@/components/home/Faq";
import ContactSection from "@/components/home/ContactSection";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="divide-y divide-amber-100">
      <Hero locale={locale} />
      <Categories locale={locale} />
      <AboutSection locale={locale} />
      <Testimonials />
      <Faq />
      <ContactSection />
    </div>
  );
}
