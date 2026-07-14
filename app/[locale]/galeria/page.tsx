import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("gallery");

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold text-amber-800 mb-4">
        {t("title")}
      </h1>
      <p className="text-gray-600 mb-8">
        {t("description")}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-200 h-64 rounded-lg flex items-center justify-center text-gray-500">
            {t("placeholder", { number: i })}
          </div>
        ))}
      </div>
    </div>
  );
}