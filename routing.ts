import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["sk", "cz", "en", "ro"],
  defaultLocale: "sk",
  localePrefix: "as-needed",
  // The primary market and domain (.sk) are Slovak — always serve Slovak on
  // unprefixed paths instead of auto-negotiating from the browser's
  // Accept-Language header. Visitors can still switch languages explicitly.
  localeDetection: false,
  // next-intl's own `Link` response header uses the raw locale codes
  // ("cz") instead of valid ISO 639-1 hreflang values ("cs"). The
  // <link rel="alternate" hreflang> tags in lib/seo.ts already handle
  // this correctly, so disable the redundant/incorrect header here.
  alternateLinks: false,
});
