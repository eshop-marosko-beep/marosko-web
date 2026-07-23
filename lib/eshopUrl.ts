const ESHOP_BASE_URL = "https://eshop.marosko.sk";

/** eshop.marosko.sk only has SK/CZ/RO language versions. Locales without an
 * entry here (currently "en") fall back to the Slovak root. */
const ESHOP_LOCALE_PATHS: Record<string, string> = {
  cz: "/cz",
  ro: "/ro",
};

/** Maps the current site locale to the matching eshop.marosko.sk language
 * version, so links to the shop always land on the right language instead
 * of always pointing at the Slovak root. */
export function getEshopUrl(locale: string): string {
  return `${ESHOP_BASE_URL}${ESHOP_LOCALE_PATHS[locale] ?? ""}`;
}
