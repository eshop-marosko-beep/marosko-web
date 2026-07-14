import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("contact");

  return (
    <div className="py-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-espresso-800 mb-6">
        {t("title")}
      </h1>

      <div className="bg-white shadow-lg rounded-lg p-6 space-y-3 text-gray-700">
        <p>📍 {t("address")}</p>
        <p>📞 {t("phone")}</p>
        <p>✉️ {t("email")}</p>

        <p className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
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
    </div>
  );
}