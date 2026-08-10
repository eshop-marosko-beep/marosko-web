import Image from "next/image";
import { useTranslations } from "next-intl";

export interface SpotlightProduct {
  key: string;
  src: string;
  productUrl: string;
}

interface CategorySpotlightProps {
  namespace: string;
  ctaUrl: string;
  products: readonly SpotlightProduct[];
}

export default function CategorySpotlight({ namespace, ctaUrl, products }: CategorySpotlightProps) {
  const t = useTranslations(namespace);

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
          href={ctaUrl}
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
