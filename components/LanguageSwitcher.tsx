"use client";

import NextLink from "next/link";
import { getPathname, usePathname } from "@/navigation";
import { routing } from "@/routing";

// next-intl's <Link locale="sk"> renders "/sk/..." which then 307-redirects to the
// unprefixed path. Link straight to the final URL instead (no redirect hop for crawlers).
export default function LanguageSwitcher() {
  const pathname = usePathname();

  return (
    <>
      {routing.locales.map((loc) => (
        <NextLink
          key={loc}
          href={getPathname({ href: pathname, locale: loc })}
          hrefLang={loc === "cz" ? "cs" : loc}
          className="text-sm border px-2 py-1 rounded hover:bg-gray-100"
        >
          {loc.toUpperCase()}
        </NextLink>
      ))}
    </>
  );
}
