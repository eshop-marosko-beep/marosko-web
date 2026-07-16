import { getTranslations, setRequestLocale } from "next-intl/server";
import ContactForm from "@/components/ContactForm";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.contact" });
  return buildMetadata({ locale, path: "/kontakt", title: t("title"), description: t("description") });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("contact");

  return (
    <div className="py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-espresso-800 mb-6">
          {t("title")}
        </h1>

        <div className="bg-white shadow-lg rounded-lg p-6 space-y-6 text-gray-700">
          <div>
            <h2 className="text-lg font-bold text-espresso-800 mb-2">
              {t("companyInfoTitle")}
            </h2>
            <div className="space-y-1">
              <p>📍 {t("address")}</p>
              <p>{t("ico")}</p>
              <p>{t("dic")}</p>
              <p>{t("icDph")}</p>
              <p>{t("authority")}</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-espresso-800 mb-2">
              {t("contactInfoTitle")}
            </h2>
            <div className="space-y-1">
              <p>📞 {t("phoneProducts")}</p>
              <p>📦 {t("phoneShipping")}</p>
              <p>✉️ {t("email")}</p>
            </div>
          </div>

          <p className="text-sm text-gray-500">{t("shippingNote")}</p>

          <p className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            🛒{" "}
            <a
              href="https://eshop.marosko.sk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-700 font-bold hover:underline"
            >
              {t("eshop")}
            </a>
          </p>
        </div>

        <div className="mt-6 rounded-lg overflow-hidden shadow-lg border border-gray-200">
          <iframe
            title={t("mapTitle")}
            src="https://www.google.com/maps?q=Mari%C3%A1n+s.r.o.%2C+Vr%C3%A1di%C5%A1te+138%2C+908+49+Vr%C3%A1di%C5%A1te&output=embed"
            width="100%"
            height="350"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      <ContactForm title={t("formTitle")} subtitle={t("formSubtitle")} />
    </div>
  );
}