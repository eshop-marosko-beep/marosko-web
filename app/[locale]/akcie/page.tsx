import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getEshopPromos, getSaleCategoryUrl, type EshopPromo, type PromoLabel } from "@/lib/eshopPromos";
import { buildMetadata } from "@/lib/seo";
import { buildBreadcrumbListSchema } from "@/lib/structuredData";
import StructuredData from "@/components/StructuredData";
import type { Metadata } from "next";

// Products, prices and stock come live from the e-shop's sale category;
// re-render at most once an hour (matches PROMOS_REVALIDATE_SECONDS).
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.promotions" });
  const promos = await getEshopPromos(locale);
  const featured = promos && pickFeatured(promos.products);
  return buildMetadata({
    locale,
    path: "/akcie",
    title: t("title"),
    description: t("description"),
    ...(featured?.image ? { image: featured.image } : {}),
  });
}

/** The shop's "TOP produkt mesiaca", else its first sale product. */
function pickFeatured(products: EshopPromo[]): EshopPromo | undefined {
  return products.find((p) => p.isTopProduct) ?? products[0];
}

function Label({ label }: { label: PromoLabel }) {
  return (
    <span
      className="inline-block rounded px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide"
      style={{ backgroundColor: label.background ?? "#b7551f", color: label.color ?? "#fff" }}
    >
      {label.text}
    </span>
  );
}

function Stock({ product }: { product: EshopPromo }) {
  if (!product.stockStatus) return null;
  const inStock = /skladom|skladem|în stoc|ultima/i.test(product.stockStatus);
  return (
    <p className={`text-sm ${inStock ? "text-green-700" : "text-espresso-400"}`}>
      {product.stockStatus}
      {product.stockQuantity ? ` (${product.stockQuantity})` : ""}
    </p>
  );
}

function ProductImage({ product, sizes, priority }: { product: EshopPromo; sizes: string; priority?: boolean }) {
  if (!product.image) return <div className="aspect-square bg-cream-100" />;
  return (
    <div className="relative aspect-square bg-white">
      <Image
        src={product.image}
        alt={product.title}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized
        className="object-contain p-4 group-hover:scale-105 transition-transform"
      />
    </div>
  );
}

export default async function PromotionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("promotions");
  const tNav = await getTranslations("navigation");
  const breadcrumbSchema = buildBreadcrumbListSchema(locale, [
    { name: tNav("home"), path: "/" },
    { name: tNav("promotions"), path: "/akcie" },
  ]);

  const promos = await getEshopPromos(locale);
  const categoryUrl = promos?.categoryUrl ?? getSaleCategoryUrl(locale);
  const featured = promos ? pickFeatured(promos.products) : undefined;
  const others = promos?.products.filter((p) => p !== featured) ?? [];
  const save = (amount: string) => t("save", { amount: amount.replace(/^[-−]\s*/, "") });

  const viewAllButton = (
    <a
      href={categoryUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
    >
      {t("viewAll")} →
    </a>
  );

  return (
    <div className="py-8 max-w-6xl mx-auto">
      <StructuredData data={breadcrumbSchema} />
      <h1 className="text-4xl font-bold text-espresso-800 mb-4">{t("title")}</h1>
      <p className="text-gray-600 text-lg mb-10 max-w-2xl">{t("subtitle")}</p>

      {!promos ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <p className="text-gray-600 mb-6">{t("unavailable")}</p>
          {viewAllButton}
        </div>
      ) : !featured ? (
        <p className="text-gray-500 bg-white rounded-xl shadow-lg p-8 text-center">{t("empty")}</p>
      ) : (
        <>
          {/* Featured product — replaces the old hand-made banner image. */}
          <a
            href={featured.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group grid md:grid-cols-2 gap-6 md:gap-10 items-center bg-cream-50 rounded-2xl shadow-lg border border-transparent hover:border-amber-200 hover:shadow-xl transition-all p-4 md:p-8 mb-12"
          >
            <div className="relative rounded-xl overflow-hidden shadow">
              <ProductImage product={featured} sizes="(min-width: 768px) 560px, 100vw" priority />
              {featured.discountPercent && (
                <span className="absolute top-3 left-3 rounded-full bg-amber-600 text-white text-lg font-bold px-3 py-1 shadow">
                  −{featured.discountPercent}
                </span>
              )}
            </div>
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                {/* The shop's own "TOP produkt mesiaca" label already says this. */}
                {!featured.isTopProduct && (
                  <span className="inline-block rounded px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide bg-espresso-800 text-white">
                    {t("featured")}
                  </span>
                )}
                {featured.labels.map((label) => (
                  <Label key={label.text} label={label} />
                ))}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-espresso-800 mb-3">{featured.title}</h2>
              {featured.description && (
                <p className="text-gray-600 mb-5 line-clamp-4">{featured.description}</p>
              )}
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-2">
                {featured.originalPrice && (
                  <span className="text-xl text-espresso-300 line-through">{featured.originalPrice}</span>
                )}
                <span className="text-4xl font-bold text-amber-700">{featured.price}</span>
              </div>
              {featured.discountAmount && (
                <p className="text-amber-700 font-semibold mb-2">{save(featured.discountAmount)}</p>
              )}
              <Stock product={featured} />
              <span className="mt-6 inline-block bg-espresso-800 text-white px-6 py-3 rounded-lg font-semibold group-hover:bg-espresso-700 transition-colors">
                {t("buy")} →
              </span>
            </div>
          </a>

          {others.length > 0 && (
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
              {others.map((product) => (
                <li key={product.id}>
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group h-full bg-white rounded-xl shadow-lg overflow-hidden border border-transparent hover:border-amber-200 hover:shadow-xl transition-all flex flex-col"
                  >
                    <div className="relative">
                      <ProductImage product={product} sizes="(min-width: 1024px) 270px, (min-width: 768px) 33vw, 50vw" />
                      {product.discountPercent && (
                        <span className="absolute top-2 left-2 rounded-full bg-amber-600 text-white text-sm font-bold px-2 py-0.5">
                          −{product.discountPercent}
                        </span>
                      )}
                    </div>
                    <div className="p-3 md:p-4 flex flex-col flex-1">
                      {product.labels.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {product.labels.slice(0, 2).map((label) => (
                            <Label key={label.text} label={label} />
                          ))}
                        </div>
                      )}
                      <h3 className="text-sm md:text-base font-semibold text-espresso-800 line-clamp-3 mb-3">
                        {product.title}
                      </h3>
                      <div className="mt-auto">
                        <div className="flex flex-wrap items-baseline gap-x-2">
                          <span className="text-lg font-bold text-amber-700">{product.price}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-espresso-300 line-through">{product.originalPrice}</span>
                          )}
                        </div>
                        <Stock product={product} />
                      </div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}

          <div className="text-center">
            {viewAllButton}
            <p className="text-sm text-gray-500 mt-4">{t("priceNote")}</p>
          </div>
        </>
      )}
    </div>
  );
}
