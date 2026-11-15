import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";
import PromoCard from "@/components/PromoCard";
import { getEshopPromos, pickTopPromos } from "@/lib/eshopPromos";

const COUNT = 4;

/** "Top deals" teaser on the home page: a few live products from the
 * e-shop's sale category, linking on to /akcie. Renders nothing when the
 * shop can't be read or has no promotions, so the home page never shows
 * an empty or broken block. */
export default async function HomePromos({ locale }: { locale: string }) {
  const promos = await getEshopPromos(locale);
  const products = promos ? pickTopPromos(promos.products, COUNT) : [];
  if (!products.length) return null;

  const t = await getTranslations({ locale, namespace: "home.promotions" });

  return (
    <section id="akcie" className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-espresso-800 mb-4">{t("title")}</h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">{t("subtitle")}</p>
      </div>
      <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
        {products.map((product) => (
          <li key={product.id}>
            <PromoCard product={product} sizes="(min-width: 1024px) 300px, 50vw" />
          </li>
        ))}
      </ul>
      <div className="text-center">
        <Link
          href="/akcie"
          className="inline-block bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
        >
          {t("cta", { count: promos!.products.length })} →
        </Link>
      </div>
    </section>
  );
}
