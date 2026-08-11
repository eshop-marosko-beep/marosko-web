"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export interface SpotlightProduct {
  key: string;
  src: string;
  productUrl: string;
}

export interface SpotlightTab {
  id: string;
  label: string;
  namespace: string;
  ctaUrl: string;
  products: readonly SpotlightProduct[];
}

function ProductImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-full w-full items-center justify-center p-3 text-center text-xs font-medium text-espresso-400">
        {alt}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized
      className="object-contain p-3 group-hover:scale-105 transition-transform"
      onError={() => setFailed(true)}
    />
  );
}

export default function BrandSpotlightTabs({ tabs }: { tabs: readonly SpotlightTab[] }) {
  const [activeId, setActiveId] = useState(tabs[0].id);
  const active = tabs.find((tab) => tab.id === activeId) ?? tabs[0];
  const t = useTranslations(active.namespace);

  return (
    <section className="py-16">
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveId(tab.id)}
            aria-pressed={tab.id === activeId}
            className={
              tab.id === activeId
                ? "rounded-full bg-amber-600 px-5 py-2 font-semibold text-white transition-colors"
                : "rounded-full border border-amber-200 bg-white px-5 py-2 font-semibold text-espresso-800 transition-colors hover:bg-amber-50"
            }
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-espresso-800 mb-4">
          {t("title")}
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          {t("subtitle")}
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        {active.products.map(({ key, src, productUrl }) => (
          <a
            key={key}
            href={productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white rounded-xl shadow-lg overflow-hidden border border-transparent hover:border-amber-200 hover:shadow-xl transition-all flex flex-col"
          >
            <div className="relative h-32 sm:h-36 bg-cream-100">
              <ProductImage src={src} alt={t(`products.${key}.name`)} />
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
          href={active.ctaUrl}
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
