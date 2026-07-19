import type { Metadata } from "next";
import { getPathname } from "@/navigation";
import { routing } from "@/routing";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://marosko-web.vercel.app";
export const DEFAULT_OG_IMAGE = "/gallery/frezovaci-kotuc-detail-rezbarska-praca.jpg";

/** Resolves a possibly-relative image path to an absolute URL. Leaves
 * already-absolute URLs (e.g. images hosted on eshop.marosko.sk) untouched. */
export function toAbsoluteImageUrl(src: string): string {
  return /^https?:\/\//.test(src) ? src : `${SITE_URL}${src}`;
}

export function buildMetadata({
  locale,
  path,
  title,
  description,
  image = DEFAULT_OG_IMAGE,
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
  image?: string;
}): Metadata {
  const href = path === "" ? "/" : path;
  const url = `${SITE_URL}${getPathname({ locale, href })}`;
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `${SITE_URL}${getPathname({ locale: l, href })}`])
  );
  const ogImage = toAbsoluteImageUrl(image);

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Marián s.r.o.",
      locale,
      type: "website",
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
