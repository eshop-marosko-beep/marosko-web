import { SITE_URL, toAbsoluteImageUrl } from "@/lib/seo";
import { socialLinks } from "@/lib/socialLinks";
import { videos } from "@/lib/videoData";
import { getPathname } from "@/navigation";
import {
  COMPANY_NAME,
  COMPANY_STREET_ADDRESS,
  COMPANY_POSTAL_CODE,
  COMPANY_ADDRESS_LOCALITY,
  COMPANY_VAT_ID,
  COMPANY_TAX_ID,
  COMPANY_IDENTIFIER,
  COMPANY_PHONE_SALES,
  COMPANY_PHONE_SERVICE,
  COMPANY_EMAIL,
} from "@/lib/companyInfo";

const LOGO_URL = `${SITE_URL}/brand/marian-logo.webp`;

const ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: COMPANY_STREET_ADDRESS,
  postalCode: COMPANY_POSTAL_CODE,
  addressLocality: COMPANY_ADDRESS_LOCALITY,
  addressCountry: "SK",
} as const;

const GEO = {
  "@type": "GeoCoordinates",
  latitude: 48.825509,
  longitude: 17.188902,
} as const;

/** Canonical link to the verified Google Business Profile listing (via its
 * permanent CID, not the name/coordinate-based URL, which can drift). */
const MAPS_URL = "https://www.google.com/maps?cid=3771718462339881731";

const ORGANIZATION_ID = `${SITE_URL}/#organization`;

const OPENING_HOURS = [
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "08:00",
    closes: "14:00",
  },
] as const;

/** Combines what used to be separate Organization and LocalBusiness schemas
 * into one node. Both described the same company under the same @id, which
 * search engines can treat as a conflicting duplicate node — a single
 * node with both types in `@type` is the correct way to say "this one
 * entity is both of these things". */
export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": ORGANIZATION_ID,
    name: COMPANY_NAME,
    url: SITE_URL,
    logo: LOGO_URL,
    image: LOGO_URL,
    foundingDate: "2013",
    address: ADDRESS,
    geo: GEO,
    hasMap: MAPS_URL,
    telephone: COMPANY_PHONE_SALES,
    email: COMPANY_EMAIL,
    openingHoursSpecification: OPENING_HOURS,
    priceRange: "€1–€1500",
    vatID: COMPANY_VAT_ID,
    taxID: COMPANY_TAX_ID,
    identifier: COMPANY_IDENTIFIER,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: COMPANY_PHONE_SALES,
        contactType: "sales",
        email: COMPANY_EMAIL,
        areaServed: "SK",
        availableLanguage: ["Slovak", "Czech", "English", "Romanian"],
      },
      {
        "@type": "ContactPoint",
        telephone: COMPANY_PHONE_SERVICE,
        contactType: "customer service",
        areaServed: "SK",
        availableLanguage: ["Slovak", "Czech", "English", "Romanian"],
      },
    ],
    sameAs: [
      "https://eshop.marosko.sk",
      "https://vercajch.eu",
      "https://rezbarskenaradie.sk",
      MAPS_URL,
      ...socialLinks.map(({ url }) => url),
    ],
  };
}

function buildVideoObjectSchema(
  { file, duration }: { file: string; duration: string },
  { name, description }: { name: string; description: string }
) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name,
    description,
    thumbnailUrl: [`${SITE_URL}/videos/${file}.webp`],
    contentUrl: `${SITE_URL}/videos/${file}.mp4`,
    // No real per-video upload date is tracked anywhere in this codebase —
    // `uploadDate` is a recommended, not required, VideoObject field, so it's
    // left out rather than filled with a fabricated (and previously
    // identical-across-all-videos) placeholder date.
    duration,
    publisher: {
      "@type": "Organization",
      name: "Marián s.r.o.",
      logo: { "@type": "ImageObject", url: LOGO_URL },
    },
  };
}

export function buildFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  };
}

/** Generic "this page lists these other pages" schema, used instead of
 * duplicating each linked page's own full markup (VideoObject, Product, ...)
 * on the listing page itself. */
export function buildItemListSchema(
  locale: string,
  entries: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: entries.map(({ name, path }, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}${getPathname({ locale, href: path })}`,
      name,
    })),
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
  return buildItemListSchema(
    locale,
    videos.map((video) => {
      const entry = entries.find((e) => e.slug === video.slug)!;
      return { name: entry.name, path: `/navody/${video.slug}` };
    })
  );
}

/** Breadcrumb trail for a page, shown by Google in search results in place
 * of the raw URL. `items` excludes the current/home page framing — pass the
 * full trail from home downward, e.g. [Home, Gallery, "Frézovacie kotúče"]. */
export function buildBreadcrumbListSchema(
  locale: string,
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(({ name, path }, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: `${SITE_URL}${getPathname({ locale, href: path })}`,
    })),
  };
}

export function buildSingleVideoObjectSchema(
  video: { file: string; duration: string },
  entry: { name: string; description: string }
) {
  return buildVideoObjectSchema(video, entry);
}

/** No real publish date is tracked for blog posts anywhere in this
 * codebase, so `datePublished`/`dateModified` are left out rather than
 * filled with a guessed value — both are recommended, not required,
 * BlogPosting fields. */
export function buildBlogPostingSchema({
  locale,
  path,
  headline,
  description,
  image,
}: {
  locale: string;
  path: string;
  headline: string;
  description?: string;
  image?: string;
}) {
  const url = `${SITE_URL}${getPathname({ locale, href: path })}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline,
    ...(description ? { description } : {}),
    ...(image ? { image: [toAbsoluteImageUrl(image)] } : {}),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Organization", name: COMPANY_NAME, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: COMPANY_NAME,
      logo: { "@type": "ImageObject", url: LOGO_URL },
    },
  };
}

/** Gallery product pages have no reliable price/availability data in this
 * codebase (GalleryImage.price is defined in the type but unset on every
 * entry) — `offers` is only added when a price is actually present, and
 * `availability` is never guessed, since a wrong value there is an actively
 * misleading signal to search engines rather than just an absent one. */
export function buildProductSchema({
  locale,
  path,
  name,
  description,
  image,
  url,
  price,
}: {
  locale: string;
  path: string;
  name: string;
  description?: string;
  image: string;
  url?: string;
  price?: string;
}) {
  const pageUrl = `${SITE_URL}${getPathname({ locale, href: path })}`;
  const numericPrice = price ? price.replace(/[^\d,.-]/g, "").replace(",", ".") : undefined;
  const offers =
    numericPrice && !Number.isNaN(Number(numericPrice))
      ? {
          "@type": "Offer",
          price: numericPrice,
          priceCurrency: "EUR",
          url: url ?? pageUrl,
        }
      : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    ...(description ? { description } : {}),
    image: [toAbsoluteImageUrl(image)],
    url: pageUrl,
    ...(offers ? { offers } : {}),
  };
}
