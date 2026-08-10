import { SITE_URL } from "@/lib/seo";
import { socialLinks } from "@/lib/socialLinks";
import { videos } from "@/lib/videoData";
import { getPathname } from "@/navigation";

const LOGO_URL = `${SITE_URL}/brand/marian-logo.jpg`;

const ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "Vrádište 138",
  postalCode: "908 49",
  addressLocality: "Vrádište",
  addressCountry: "SK",
} as const;

const GEO = {
  "@type": "GeoCoordinates",
  latitude: 48.825509,
  longitude: 17.188902,
} as const;

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Marián s.r.o.",
    url: SITE_URL,
    logo: LOGO_URL,
    foundingDate: "2013",
    address: ADDRESS,
    vatID: "SK2023992916",
    taxID: "2023992916",
    identifier: "47546298",
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+421915723250",
        contactType: "sales",
        email: "eshop.marosko@gmail.com",
        areaServed: "SK",
        availableLanguage: ["Slovak", "Czech", "English", "Romanian"],
      },
      {
        "@type": "ContactPoint",
        telephone: "+421949584525",
        contactType: "customer service",
        areaServed: "SK",
        availableLanguage: ["Slovak", "Czech", "English", "Romanian"],
      },
    ],
    sameAs: [
      "https://eshop.marosko.sk",
      "https://vercajch.eu",
      "https://rezbarskenaradie.sk",
      ...socialLinks.map(({ url }) => url),
    ],
  };
}

export function buildLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Marián s.r.o.",
    image: LOGO_URL,
    url: SITE_URL,
    telephone: "+421915723250",
    email: "eshop.marosko@gmail.com",
    address: ADDRESS,
    geo: GEO,
    priceRange: "€1–€1500",
  };
}

/** Upload date for the video library, kept in one place so it's easy to bump
 * when new videos are added. */
const VIDEOS_UPLOAD_DATE = "2026-07-20";

function buildVideoObjectSchema(
  { file, duration }: { file: string; duration: string },
  { name, description }: { name: string; description: string }
) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name,
    description,
    thumbnailUrl: [`${SITE_URL}/videos/${file}.jpg`],
    contentUrl: `${SITE_URL}/videos/${file}.mp4`,
    uploadDate: VIDEOS_UPLOAD_DATE,
    duration,
    publisher: {
      "@type": "Organization",
      name: "Marián s.r.o.",
      logo: { "@type": "ImageObject", url: LOGO_URL },
    },
  };
}

/** Listing pages that show multiple videos should not duplicate the full
 * VideoObject markup for each one — that's already on each video's own
 * page (see [video]/page.tsx), which is also what the video sitemap
 * declares as that video's canonical URL. An ItemList just points to
 * those pages instead of duplicating their VideoObject data. */
export function buildVideoListSchema(
  locale: string,
  entries: { slug: string; name: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: videos.map((video, index) => {
      const entry = entries.find((e) => e.slug === video.slug)!;
      return {
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}${getPathname({ locale, href: `/navody/${video.slug}` })}`,
        name: entry.name,
      };
    }),
  };
}

export function buildSingleVideoObjectSchema(
  video: { file: string; duration: string },
  entry: { name: string; description: string }
) {
  return buildVideoObjectSchema(video, entry);
}
