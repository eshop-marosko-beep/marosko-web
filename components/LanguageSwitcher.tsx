"use client";

import { Link, usePathname } from "@/navigation";
import { routing } from "@/routing";

export default function LanguageSwitcher() {
  const pathname = usePathname();

  return (
    <>
      {routing.locales.map((loc) => (
        <Link
          key={loc}
          href={pathname}
          locale={loc}
          className="text-sm border px-2 py-1 rounded hover:bg-gray-100"
        >
          {loc.toUpperCase()}
        </Link>
      ))}
    </>
  );
}
