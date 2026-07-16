import type { Metadata } from "next";
import { getPathname } from "@/navigation";
import { routing } from "@/routing";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://marosko-web.vercel.app";
export const DEFAULT_OG_IMAGE = "/gallery/frezovaci-kotuc-detail-rezbarska-praca.jpg";

export function buildMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
}): Metadata {
  const href = path === "" ? "/" : path;
  const url = `${SITE_URL}${getPathname({ locale, href })}`;
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `${SITE_URL}${getPathname({ locale: l, href })}`])
  );

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
      images: [{ url: DEFAULT_OG_IMAGE }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}
