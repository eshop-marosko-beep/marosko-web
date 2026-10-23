import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/navigation";
import { buildMetadata } from "@/lib/seo";
import { buildBreadcrumbListSchema } from "@/lib/structuredData";
import StructuredData from "@/components/StructuredData";
import LogoutButton from "@/components/rental/LogoutButton";
import { getRentalContext } from "@/lib/rental/access";
import { rentalEshopUrl, rentalTools } from "@/lib/rental/rentalData";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.rental" });
  return buildMetadata({
    locale,
    path: "/pozicovna",
    title: t("title"),
    description: t("description"),
    image: rentalTools[0].image,
  });
}

const STEPS = ["step1", "step2", "step3", "step4"] as const;
const CONDITIONS = ["c1", "c2", "c3", "c4", "c5", "c6"] as const;

export default async function RentalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("rental");
  const tNav = await getTranslations("navigation");
  const { user, group, tools } = await getRentalContext();

  const breadcrumbSchema = buildBreadcrumbListSchema(locale, [
    { name: tNav("home"), path: "/" },
    { name: tNav("rental"), path: "/pozicovna" },
  ]);

  return (
    <div className="py-8 max-w-6xl mx-auto">
      <StructuredData data={breadcrumbSchema} />

      <h1 className="text-4xl font-bold text-espresso-800 mb-4">{t("title")}</h1>
      <p className="text-gray-600 text-lg mb-4 max-w-2xl">{t("subtitle")}</p>
      <p className="text-gray-600 leading-relaxed mb-8 max-w-2xl">{t("intro")}</p>

      {user ? (
        <div className="flex flex-wrap items-center gap-4 bg-white rounded-xl shadow p-4 mb-10">
          <span className="text-gray-700">{t("signedInAs", { name: user.name })}</span>
          {group && group.discountPercent > 0 && !user.blocked && (
            <span className="text-sm bg-green-100 text-green-800 font-semibold px-3 py-1 rounded-full">
              {t("discountBadge", { percent: group.discountPercent })}
            </span>
          )}
          <Link href="/ucet" className="text-amber-700 font-semibold hover:underline">{t("myAccount")}</Link>
          {user.isAdmin && (
            <Link href="/ucet/admin" className="text-amber-700 font-semibold hover:underline">{t("account.adminLink")}</Link>
          )}
          <LogoutButton />
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-10">
          <p className="text-espresso-800 font-semibold mb-4">{t("lockedNote")}</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/ucet/registracia"
              className="bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors">
              {t("registerCta")}
            </Link>
            <Link href="/ucet/prihlasenie"
              className="px-6 py-3 rounded-lg font-semibold text-amber-700 border border-amber-300 hover:bg-amber-100 transition-colors">
              {t("loginCta")}
            </Link>
          </div>
        </div>
      )}

      {user?.blocked && (
        <p className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 mb-10">{t("blockedNote")}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {tools.map((tool) => (
          <div key={tool.slug} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
            <div className="relative h-48 bg-white">
              <Image src={tool.image} alt={t(`tools.${tool.translationKey}.name`)} fill unoptimized
                className="object-contain p-4" />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <h2 className="text-lg font-bold text-espresso-800 mb-2">{t(`tools.${tool.translationKey}.name`)}</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">
                {t(`tools.${tool.translationKey}.description`)}
              </p>
              {tool.pricing ? (
                <>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-700 mb-4">
                    <dt>{t("priceDay")}</dt><dd className="font-semibold text-right">{tool.pricing.prices.day} €</dd>
                    <dt>{t("priceWeekend")}</dt><dd className="font-semibold text-right">{tool.pricing.prices.weekend} €</dd>
                    <dt>{t("priceWeek")}</dt><dd className="font-semibold text-right">{tool.pricing.prices.week} €</dd>
                    <dt>{t("deposit")}</dt><dd className="font-semibold text-right">{tool.pricing.deposit} €</dd>
                  </dl>
                  <Link href={`/pozicovna/${tool.slug}`}
                    className="inline-flex justify-center bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-700 transition-colors text-sm">
                    {t("reserveCta")} →
                  </Link>
                </>
              ) : user ? null : (
                <p className="text-sm text-gray-500 italic">{t("pricesAfterLogin")}</p>
              )}
              <a href={rentalEshopUrl(tool, locale)} target="_blank" rel="noopener noreferrer"
                className="mt-3 text-sm text-amber-700 font-semibold hover:underline">
                {t("buyNew")} →
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section>
          <h2 className="text-3xl font-bold text-espresso-800 mb-6">{t("howTitle")}</h2>
          <ol className="space-y-4">
            {STEPS.map((step, i) => (
              <li key={step} className="flex gap-4">
                <span className="shrink-0 w-8 h-8 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <p className="text-gray-700 pt-1">{t(`how.${step}`)}</p>
              </li>
            ))}
          </ol>
        </section>
        <section id="podmienky">
          <h2 className="text-3xl font-bold text-espresso-800 mb-6">{t("conditionsTitle")}</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            {CONDITIONS.map((item) => <li key={item}>{t(`conditions.${item}`)}</li>)}
          </ul>
        </section>
      </div>
    </div>
  );
}
