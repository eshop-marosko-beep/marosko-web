"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Nav({ locale }: { locale: string }) {
  const t = useTranslations("navigation");
  const [open, setOpen] = useState(false);

  const links = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/o-nas`, label: t("about") },
    { href: `/${locale}/kategorie`, label: t("services") },
    { href: `/${locale}/galeria`, label: t("gallery") },
    { href: `/${locale}/blog`, label: t("blog") },
    { href: `/${locale}/obchody`, label: t("shops") },
    { href: `/${locale}/kontakt`, label: t("contact") },
  ];

  return (
    <nav className="bg-white shadow-lg p-4 border-b-2 border-amber-100">
      <div className="container mx-auto flex justify-between items-center">
        <Link href={`/${locale}`} className="flex items-center hover:opacity-80 transition-opacity">
          <Image
            src="/brand/marian-logo.jpg"
            alt="Marián s.r.o."
            width={220}
            height={70}
            priority
            className="h-12 w-auto md:h-14"
          />
        </Link>

        <div className="hidden lg:flex items-center space-x-6">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-amber-700">
              {link.label}
            </Link>
          ))}
          <a
            href="https://eshop.marosko.sk"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
          >
            🛒 E-shop
          </a>
          <LanguageSwitcher />
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Zavrieť menu" : "Otvoriť menu"}
          aria-expanded={open}
          className="lg:hidden p-2 -mr-2 text-espresso-800"
        >
          {open ? (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div className="lg:hidden container mx-auto mt-4 flex flex-col space-y-3 pb-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="hover:text-amber-700"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://eshop.marosko.sk"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors text-center"
          >
            🛒 E-shop
          </a>
          <LanguageSwitcher />
        </div>
      )}
    </nav>
  );
}
