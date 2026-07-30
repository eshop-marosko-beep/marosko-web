import Image from "next/image";
import { Link } from "@/navigation";
import { useLocale, useTranslations } from "next-intl";
import { getEshopUrl } from "@/lib/eshopUrl";

export default function Hero() {
  const t = useTranslations("home.hero");
  const eshopUrl = getEshopUrl(useLocale());

  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[420px] md:h-[560px]">
        <Image
          src="/gallery/frezovaci-kotuc-detail-rezbarska-praca.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso-900/95 via-espresso-900/80 to-espresso-900/65" />
        <div className="hidden sm:block absolute bottom-6 right-6 z-10 h-24 w-24 md:h-28 md:w-28">
          <Image
            src="/brand/marosko-share-logo.jpg"
            alt="MAROSKO.SK"
            fill
            className="object-contain rounded-full shadow-lg ring-2 ring-white/80"
          />
        </div>
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            {t("title")}
          </h1>
          <p className="text-xl md:text-2xl text-cream-100 max-w-3xl mx-auto mb-10 leading-relaxed drop-shadow">
            {t("subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/kategorie"
              className="bg-amber-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-amber-700 transition-colors"
            >
              {t("ctaPrimary")}
            </Link>
            <a
              href={eshopUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white/10 transition-colors"
            >
              {t("ctaSecondary")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
