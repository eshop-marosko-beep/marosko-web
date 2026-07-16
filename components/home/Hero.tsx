import Image from "next/image";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("home.hero");

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
        <div className="absolute inset-0 bg-gradient-to-t from-espresso-900/90 via-espresso-900/60 to-espresso-900/30" />
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
              href="https://eshop.marosko.sk"
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
