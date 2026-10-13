import { localeSitemapResponse } from "@/lib/sitemap";

export async function GET() {
  return localeSitemapResponse("sk");
}
