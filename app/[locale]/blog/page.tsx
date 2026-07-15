import { getTranslations, setRequestLocale } from "next-intl/server";
import { blogPosts } from "@/lib/blogData";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("blog");

  return (
    <div className="py-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-espresso-800 mb-4">{t("title")}</h1>
      <p className="text-gray-600 text-lg mb-4 max-w-2xl">{t("subtitle")}</p>
      <p className="text-gray-600 leading-relaxed mb-10 max-w-2xl">{t("intro")}</p>
      <ul className="space-y-3">
        {blogPosts.map(({ slug, title, url }) => (
          <li key={slug}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white rounded-lg shadow p-4 text-espresso-800 font-semibold hover:text-amber-700 hover:shadow-md transition-all"
            >
              {title} →
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
