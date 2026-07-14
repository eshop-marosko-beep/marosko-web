import Link from "next/link";
import { useTranslations } from "next-intl";

export default function AboutSection({ locale }: { locale: string }) {
  const t = useTranslations("home.aboutSection");

  return (
    <section
      id="o-nas"
      className="py-16 bg-white rounded-xl shadow-lg px-6 md:px-12"
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-amber-800 mb-6">
          {t("title")}
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed mb-8">
          {t("text")}
        </p>
        <Link
          href={`/${locale}/o-nas`}
          className="text-amber-700 font-semibold hover:underline"
        >
          {t("cta")} →
        </Link>
      </div>
    </section>
  );
}
