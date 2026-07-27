import Image from "next/image";
import { useTranslations } from "next-intl";

const products = [
  {
    key: "p1013",
    src: "https://eshop.marosko.sk/resize/e/800/800/files/na-drevo/do-uhlovych-brusok/brusne/saburr-usa/50mm-priemer/sikma-obla/oble-50mm.jpg",
    productUrl: "https://eshop.marosko.sk/p/1013/ihlickova-mini-raspla-sikma-obla-50mm",
  },
  {
    key: "p405",
    src: "https://eshop.marosko.sk/resize/e/800/800/files/rasple-sabur-usa/salkova-44-5mm/cr134-125.jpg",
    productUrl: "https://eshop.marosko.sk/p/405/ihlickova-raspla-salkova-extra-hruba-priemer-44-5-mm",
  },
  {
    key: "p590",
    src: "https://eshop.marosko.sk/resize/e/800/800/files/mini-frezky/mini-raspla-gulata-z-otvormi/dw250h.jpg",
    productUrl: "https://eshop.marosko.sk/p/590/ihlickova-mini-raspla-gulata-50mm-jemna-s-otvormi",
  },
  {
    key: "p591",
    src: "https://eshop.marosko.sk/resize/e/800/800/files/mini-frezky/mini-raspla-gulata-z-otvormi/dw270h.jpg",
    productUrl: "https://eshop.marosko.sk/p/591/ihlickova-mini-raspla-gulata-50mm-hruba-s-otvormi",
  },
  {
    key: "p587",
    src: "https://eshop.marosko.sk/resize/e/800/800/files/mini-frezky/mini-rasple/-vyr-445fd290-o-vyrez.jpg",
    productUrl: "https://eshop.marosko.sk/p/587/ihlickova-mini-raspla-extra-hruba-50-mm",
  },
] as const;

export default function SaburrtoothSpotlight() {
  const t = useTranslations("home.saburrtooth");

  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-espresso-800 mb-4">
          {t("title")}
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          {t("subtitle")}
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        {products.map(({ key, src, productUrl }) => (
          <a
            key={key}
            href={productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white rounded-xl shadow-lg overflow-hidden border border-transparent hover:border-amber-200 hover:shadow-xl transition-all flex flex-col"
          >
            <div className="relative h-32 sm:h-36 bg-cream-100">
              <Image
                src={src}
                alt={t(`products.${key}.name`)}
                fill
                sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                className="object-contain p-3 group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="p-3 text-center">
              <p className="text-sm font-semibold text-espresso-800">
                {t(`products.${key}.name`)}
              </p>
            </div>
          </a>
        ))}
      </div>
      <div className="text-center">
        <a
          href="https://eshop.marosko.sk/c/mini-kotuce-pre-mini-frezky-50/ihlickove-rasple-saburrtooth-usa"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
        >
          {t("cta")} →
        </a>
      </div>
    </section>
  );
}
