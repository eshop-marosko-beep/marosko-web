"use client";

import { useEffect, useState } from "react";
import { Link, usePathname } from "@/navigation";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { getEshopUrl } from "@/lib/eshopUrl";

export default function Nav() {
  const t = useTranslations("navigation");
  const locale = useLocale();
  const eshopUrl = getEshopUrl(locale);
  const [open, setOpen] = useState(false);
  // Signed-in state comes from the browser, so pages stay cacheable.
  const [me, setMe] = useState<{ signedIn: boolean; isAdmin?: boolean } | null>(null);
  // Checked again on every page change, so signing in or out shows up at once.
  const pathname = usePathname();
  useEffect(() => {
    fetch("/api/rental/me", { cache: "no-store" })
      .then((res) => res.json())
      .then(setMe)
      .catch(() => setMe({ signedIn: false }));
  }, [pathname]);
  const account = !me
    ? null
    : me.signedIn
      ? { href: me.isAdmin ? "/ucet/admin" : "/ucet", label: me.isAdmin ? t("admin") : t("account") }
      : { href: "/ucet/prihlasenie?next=%2Fucet", label: t("login") };

  const links = [
    { href: "/", label: t("home") },
    { href: "/o-nas", label: t("about") },
    { href: "/kategorie", label: t("services") },
    { href: "/znacky", label: t("brands") },
    { href: "/galeria", label: t("gallery") },
    { href: "/navody", label: t("videos") },
    { href: "/blog", label: t("blog") },
    { href: "/obchody", label: t("shops") },
    { href: "/kontakt", label: t("contact") },
  ];

  return (
    <nav className="bg-white shadow-lg p-4 border-b-2 border-amber-100">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
          <Image
            src="/brand/marian-logo.webp"
            alt="Marián s.r.o."
            width={220}
            height={70}
            priority
            unoptimized
            className="h-12 w-auto md:h-14"
          />
        </Link>

        <div className="hidden xl:flex items-center space-x-5">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="whitespace-nowrap hover:text-amber-700">
              {link.label}
            </Link>
          ))}
          {account && (
            <Link href={account.href} className="whitespace-nowrap flex items-center gap-1 hover:text-amber-700">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {account.label}
            </Link>
          )}
          <a
            href={eshopUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
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
          className="xl:hidden p-2 -mr-2 text-espresso-800"
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
        <div className="xl:hidden container mx-auto mt-4 flex flex-col space-y-3 pb-2">
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
          {account && (
            <Link href={account.href} onClick={() => setOpen(false)} className="hover:text-amber-700 font-semibold">
              {account.label}
            </Link>
          )}
          <a
            href={eshopUrl}
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
