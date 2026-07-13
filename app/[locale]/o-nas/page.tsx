import { useTranslations } from "next-intl";

export default function AboutPage() {
  const t = useTranslations("about");

  return (
    <div className="py-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-amber-800 mb-6">
        {t("title")}
      </h1>
      <p className="text-gray-700 text-lg leading-relaxed">
        {t("content")}
      </p>
    </div>
  );
}