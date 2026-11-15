"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Link } from "@/navigation";
import { useLocale, useTranslations } from "next-intl";

type FooterPromo = {
  id: string;
  title: string;
  url: string;
  image?: string;
  price: string;
  originalPrice?: string;
  discountPercent?: string;
};

/** "Top akcie" footer column: a few live sale products, loaded from
 * /api/top-promos/[locale] (hourly static JSON) after the page renders.
 * If the request fails, only the heading and the /akcie link show. */
export default function FooterPromos() {
  const t = useTranslations("footer");
  const locale = useLocale();
  const [products, setProducts] = useState<FooterPromo[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/top-promos/${locale}`)
      .then((res) => (res.ok ? res.json() : { products: [] }))
      .then((data: { products?: FooterPromo[] }) => {
        if (!cancelled) setProducts(data.products ?? []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [locale]);

  return (
    <div>
      <h3 className="font-bold text-white mb-3">{t("promotionsTitle")}</h3>
      {products.length > 0 && (
        <ul className="space-y-3 mb-4">
          {products.map((p) => (
            <li key={p.id}>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3"
              >
                <span className="relative shrink-0 w-14 h-14 rounded-lg bg-white overflow-hidden">
                  {p.image && (
                    <Image src={p.image} alt="" fill sizes="56px" unoptimized className="object-contain p-1" />
                  )}
                  {p.discountPercent && (
                    <span className="absolute bottom-0 inset-x-0 bg-amber-600 text-white text-[10px] font-bold text-center leading-4">
                      −{p.discountPercent}
                    </span>
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm text-cream-100/80 group-hover:text-white transition-colors line-clamp-2">
                    {p.title}
                  </span>
                  <span className="block text-sm">
                    <span className="font-semibold text-amber-300">{p.price}</span>
                    {p.originalPrice && (
                      <span className="ml-2 text-cream-100/50 line-through">{p.originalPrice}</span>
                    )}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
      <Link href="/akcie" className="text-sm font-semibold text-amber-300 hover:text-white transition-colors">
        {t("promotionsAll")} →
      </Link>
    </div>
  );
}
