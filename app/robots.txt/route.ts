import { SITE_URL } from "@/lib/seo";

export async function GET() {
  const body = [
    "User-Agent: *",
    "Allow: /",
    "",
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    `Sitemap: ${SITE_URL}/imagesitemap.xml`,
    `Sitemap: ${SITE_URL}/videositemap.xml`,
    "",
    "# llms.txt (info for AI/LLM agents) — one per language:",
    `# SK: ${SITE_URL}/llms.txt`,
    `# CZ: ${SITE_URL}/cz/llms.txt`,
    `# EN: ${SITE_URL}/en/llms.txt`,
    `# RO: ${SITE_URL}/ro/llms.txt`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
