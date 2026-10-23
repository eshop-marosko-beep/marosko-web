import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link, redirect } from "@/navigation";
import { buildMetadata } from "@/lib/seo";
import BookingCalendar from "@/components/rental/BookingCalendar";
import { getRentalTool, rentalEshopUrl } from "@/lib/rental/rentalData";
import { getCurrentUser } from "@/lib/rental/users";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; tool: string }>;
}): Promise<Metadata> {
  const { locale, tool: slug } = await params;
  const tool = getRentalTool(slug);
  if (!tool) return {};
  const t = await getTranslations({ locale, namespace: "rental" });
  return {
    ...buildMetadata({
      locale,
      path: `/pozicovna/${slug}`,
      title: `${t(`tools.${tool.translationKey}.name`)} – ${t("title")}`,
      description: t(`tools.${tool.translationKey}.description`),
      image: tool.image,
    }),
    // Only reachable when signed in; nothing here for search engines.
    robots: { index: false, follow: false },
  };
}

export default async function RentalToolPage({
  params,
}: {
  params: Promise<{ locale: string; tool: string }>;
}) {
  const { locale, tool: slug } = await params;
  setRequestLocale(locale);

  const tool = getRentalTool(slug);
  if (!tool) notFound();

  const user = await getCurrentUser();
  if (!user) {
    return redirect({ href: { pathname: "/ucet/prihlasenie", query: { next: `/pozicovna/${slug}` } }, locale });
  }

  const t = await getTranslations("rental");
  const name = t(`tools.${tool.translationKey}.name`);

  return (
    <div className="py-8 max-w-5xl mx-auto">
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
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{t(`tools.${tool.translationKey}.description`)}</p>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-700">
                <dt>{t("priceDay")}</dt><dd className="font-semibold text-right">{tool.prices.day} €</dd>
                <dt>{t("priceWeekend")}</dt><dd className="font-semibold text-right">{tool.prices.weekend} €</dd>
                <dt>{t("priceWeek")}</dt><dd className="font-semibold text-right">{tool.prices.week} €</dd>
                <dt>{t("deposit")}</dt><dd className="font-semibold text-right">{tool.deposit} €</dd>
              </dl>
              <a href={rentalEshopUrl(tool, locale)} target="_blank" rel="noopener noreferrer"
                className="mt-4 inline-block text-sm text-amber-700 font-semibold hover:underline">
                {t("buyNew")} →
              </a>
            </div>
          </div>
          <Link href="/pozicovna#podmienky" className="block text-sm text-gray-600 hover:text-amber-700 underline">
            {t("conditionsTitle")}
          </Link>
        </div>
        <div className="lg:col-span-3">
          <BookingCalendar toolSlug={tool.slug} />
        </div>
      </div>
    </div>
  );
}
