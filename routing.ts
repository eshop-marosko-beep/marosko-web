import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["sk", "cz", "en", "ro"],
  defaultLocale: "sk",
  localePrefix: "as-needed",
  // The primary market and domain (.sk) are Slovak — always serve Slovak on
  // unprefixed paths instead of auto-negotiating from the browser's
  // Accept-Language header. Visitors can still switch languages explicitly.
  localeDetection: false,
});
