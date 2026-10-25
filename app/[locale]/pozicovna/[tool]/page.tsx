import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPathname, Link, redirect } from "@/navigation";
import { buildMetadata, excerptForMetaDescription, SITE_URL, toAbsoluteImageUrl } from "@/lib/seo";
import { buildBreadcrumbListSchema } from "@/lib/structuredData";
import StructuredData from "@/components/StructuredData";
import BookingCalendar from "@/components/rental/BookingCalendar";
import { getRentalContext } from "@/lib/rental/access";
import { eshopUrl, getCatalogTool, localized, toolLabel } from "@/lib/rental/catalog";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; tool: string }>;
}): Promise<Metadata> {
  const { locale, tool: slug } = await params;
  const tool = await getCatalogTool(slug);
  if (!tool) return {};
  const t = await getTranslations({ locale, namespace: "rental" });
  return {
    ...buildMetadata({
      locale,
      path: `/pozicovna/${slug}`,
      title: `${toolLabel(tool, locale)} – ${t("title")}`,
      description: excerptForMetaDescription(localized(tool.descriptions, locale)),
      image: tool.image,
    }),
    // Hidden tools stay out of search results.
    ...(tool.active ? {} : { robots: { index: false, follow: false } }),
  };
}

function dateParam(value: string | string[] | undefined): string | null {
  const v = Array.isArray(value) ? value[0] : value;
  return v && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null;
}

export default async function RentalToolPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; tool: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale, tool: slug } = await params;
  setRequestLocale(locale);

  const found = await getCatalogTool(slug);
  if (!found || !found.active) notFound();

  // Prices and free dates are public; the calendar asks for an account only
  // when the booking is sent. A signed-in customer whose group can't rent
  // this tool goes back to the overview.
  const { user, tools, canBook } = await getRentalContext();
  const tool = tools.find((t) => t.slug === slug);
  if (!tool) return redirect({ href: "/pozicovna", locale });
  const pricing = tool.pricing;
  // Dates picked before signing in come back in the URL.
  const query = await searchParams;

  const t = await getTranslations("rental");
  const tNav = await getTranslations("navigation");
  const name = toolLabel(tool, locale);
  const path = `/pozicovna/${slug}`;
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${name} – ${t("title")}`,
    description: localized(tool.descriptions, locale),
    image: [toAbsoluteImageUrl(tool.image)],
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}${getPathname({ locale, href: path })}`,
      priceCurrency: "EUR",
      price: pricing.prices.day,
      availability: "https://schema.org/InStock",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: pricing.prices.day,
        priceCurrency: "EUR",
        unitCode: "DAY",
        referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "DAY" },
      },
      seller: { "@type": "Organization", name: "Marián s.r.o." },
    },
  };
  const breadcrumbSchema = buildBreadcrumbListSchema(locale, [
    { name: tNav("home"), path: "/" },
    { name: t("title"), path: "/pozicovna" },
    { name, path },
  ]);

  return (
    <div className="py-8 max-w-5xl mx-auto">
      <StructuredData data={productSchema} />
      <StructuredData data={breadcrumbSchema} />
      <Link href="/pozicovna" className="text-amber-700 font-semibold hover:underline mb-6 inline-block">
        ← {t("title")}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="relative h-56">
              <Image src={tool.image} alt={name} fill unoptimized className="object-contain p-4" />
            </div>
            <div className="p-6">
              <h1 className="text-2xl font-bold text-espresso-800 mb-2">{name}</h1>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 whitespace-pre-line">{localized(tool.descriptions, locale)}</p>
              {pricing.discountPercent > 0 && (
                <p className="text-sm text-green-800 font-semibold mb-2">
                  {t("discountBadge", { percent: pricing.discountPercent })}
                </p>
              )}
              <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-700">
                <dt>{t("priceDay")}</dt><dd className="font-semibold text-right">{pricing.prices.day} €</dd>
                <dt>{t("priceWeekend")}</dt><dd className="font-semibold text-right">{pricing.prices.weekend} €</dd>
                <dt>{t("priceWeek")}</dt><dd className="font-semibold text-right">{pricing.prices.week} €</dd>
                <dt>{t("deposit")}</dt><dd className="font-semibold text-right">{pricing.deposit} €</dd>
              </dl>
              {tool.eshopUrlByLocale && (
                <a href={eshopUrl(tool, locale)} target="_blank" rel="noopener noreferrer"
                  className="mt-4 inline-block text-sm text-amber-700 font-semibold hover:underline">
                  {t("buyNew")} →
                </a>
              )}
            </div>
          </div>
          <Link href="/pozicovna#podmienky" className="block text-sm text-gray-600 hover:text-amber-700 underline">
            {t("conditionsTitle")}
          </Link>
        </div>
        <div className="lg:col-span-3">
          {user?.blocked && (
            <p className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 mb-4 text-sm">{t("blockedNote")}</p>
          )}
          <BookingCalendar toolSlug={tool.slug} prices={pricing.prices} deposit={pricing.deposit}
            signedIn={Boolean(user)} canBook={canBook}
            initialFrom={dateParam(query.from)} initialTo={dateParam(query.to)} />
        </div>
      </div>
    </div>
  );
}
