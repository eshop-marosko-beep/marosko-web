import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/seo";
import { getPathname } from "@/navigation";
import { routing } from "@/routing";
import { sitemapPaths } from "@/lib/sitemap";

// IndexNow (Bing, Yandex, Seznam, ...): tells search engines which URLs to
// (re)crawl. The key is public by design and is also served from
// /public/<key>.txt so the engines can verify we own the host.
const INDEXNOW_KEY = "b2292bbf0ef5b7f00fc5e9c56b5605a7";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

export async function GET(request: Request) {
  // Vercel Cron sends this header automatically when CRON_SECRET is set.
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only production serves the real host; previews must not submit.
  if (process.env.VERCEL_ENV !== "production") {
    return NextResponse.json({ skipped: true, reason: "Odosiela sa len z produkcie" });
  }
  const host = new URL(SITE_URL).host;

  const urlList = routing.locales.flatMap((locale) =>
    sitemapPaths().map((href) => `${SITE_URL}${getPathname({ locale, href })}`)
  );

  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList,
    }),
  });

  return NextResponse.json(
    { status: res.status, submitted: urlList.length, response: await res.text() },
    { status: res.ok ? 200 : 502 }
  );
}
