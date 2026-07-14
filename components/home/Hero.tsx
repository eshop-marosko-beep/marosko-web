import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Hero({ locale }: { locale: string }) {
  const t = useTranslations("home.hero");

  return (
    <section className="text-center py-16 md:py-24">
      <h1 className="text-4xl md:text-6xl font-bold text-espresso-800 mb-6">
        {t("title")}
      </h1>
      <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
        {t("subtitle")}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href={`/${locale}/kategorie`}
          className="bg-amber-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-amber-700 transition-colors"
        >
          {t("ctaPrimary")}
        </Link>
        <a
          href="https://eshop.marosko.sk"
          target="_blank"
          rel="noopener noreferrer"
          className="border-2 border-amber-600 text-amber-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-amber-50 transition-colors"
        >
          {t("ctaSecondary")}
        </a>
      </div>
    </section>
  );
}
