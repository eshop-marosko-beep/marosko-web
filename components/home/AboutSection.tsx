import Link from "next/link";
import { useTranslations } from "next-intl";

export default function AboutSection({ locale }: { locale: string }) {
  const t = useTranslations("home.aboutSection");

  return (
    <section
      id="o-nas"
      className="py-16 bg-espresso-900 rounded-xl shadow-lg px-6 md:px-12"
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-cream-50 mb-6">
          {t("title")}
        </h2>
        <p className="text-espresso-100 text-lg leading-relaxed mb-8">
          {t("text")}
        </p>
        <Link
          href={`/${locale}/o-nas`}
          className="text-amber-400 font-semibold hover:text-amber-300 hover:underline"
        >
          {t("cta")} →
        </Link>
      </div>
    </section>
  );
}
