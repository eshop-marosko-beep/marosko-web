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
    "# llms.txt for eshop.marosko.sk (one per shop language):",
    `# SK: ${SITE_URL}/eshop/llms.txt`,
    `# CZ: ${SITE_URL}/cz/eshop/llms.txt`,
    `# RO: ${SITE_URL}/ro/eshop/llms.txt`,
    "",
    "# Product feeds (JSON) for AI shopping agents:",
    `# SK (EUR): ${SITE_URL}/agent-feed.json`,
    `# CZ (CZK): ${SITE_URL}/cz/agent-feed.json`,
    `# RO (RON): ${SITE_URL}/ro/agent-feed.json`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
