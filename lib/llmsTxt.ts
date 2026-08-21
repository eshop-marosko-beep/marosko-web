import { SITE_URL } from "@/lib/seo";
import { getPathname } from "@/navigation";
import skMessages from "@/messages/sk.json";
import czMessages from "@/messages/cz.json";
import enMessages from "@/messages/en.json";
import roMessages from "@/messages/ro.json";

const messagesByLocale = {
  sk: skMessages,
  cz: czMessages,
  en: enMessages,
  ro: roMessages,
} as const;

export type LlmsLocale = keyof typeof messagesByLocale;

/** eshop.marosko.sk has its own SK/CZ/RO sections; there is no English
 * checkout yet, so the English llms.txt falls back to the Slovak shop with
 * an explanatory note (see messages/en.json's llms.shopNote). */
const ESHOP_URL_BY_LOCALE: Record<LlmsLocale, string> = {
  sk: "https://eshop.marosko.sk/",
  cz: "https://eshop.marosko.sk/cz",
  ro: "https://eshop.marosko.sk/ro",
  en: "https://eshop.marosko.sk/",
};

/** Mirrors the primary header navigation (see messages/*.json's `navigation`
 * namespace) so llms.txt never drifts from the site's actual main pages. */
const MAIN_PAGES: { navKey: keyof (typeof skMessages)["navigation"]; path: string }[] = [
  { navKey: "home", path: "/" },
  { navKey: "services", path: "/kategorie" },
  { navKey: "brands", path: "/znacky" },
  { navKey: "gallery", path: "/galeria" },
  { navKey: "videos", path: "/navody" },
  { navKey: "blog", path: "/blog" },
  { navKey: "shops", path: "/obchody" },
  { navKey: "about", path: "/o-nas" },
  { navKey: "contact", path: "/kontakt" },
];

export function buildLlmsTxt(locale: LlmsLocale): string {
  const { llms, navigation } = messagesByLocale[locale];

  const lines: string[] = [
    `# ${llms.title}`,
    "",
    `> ${llms.tagline}`,
    "",
    `## ${llms.shopHeading}`,
    `- [${llms.shopLinkLabel}](${ESHOP_URL_BY_LOCALE[locale]})`,
  ];

  if ("shopNote" in llms && llms.shopNote) {
    lines.push(`  ${llms.shopNote}`);
  }

  lines.push("", `## ${llms.pagesHeading}`);
  for (const { navKey, path } of MAIN_PAGES) {
    const label = navigation[navKey];
    const url = `${SITE_URL}${getPathname({ locale, href: path })}`;
    lines.push(`- [${label}](${url})`);
  }
  lines.push("");

  return lines.join("\n");
}
