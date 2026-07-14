"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const locales = ["sk", "cz", "en", "ro"] as const;

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const rest = pathname.split("/").slice(2).join("/");

  return (
    <>
      {locales.map((loc) => (
        <Link
          key={loc}
          href={`/${loc}${rest ? `/${rest}` : ""}`}
          className="text-sm border px-2 py-1 rounded hover:bg-gray-100"
        >
          {loc.toUpperCase()}
        </Link>
      ))}
    </>
  );
}
