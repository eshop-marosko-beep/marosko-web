import { SITE_URL } from "@/lib/seo";
import { socialLinks } from "@/lib/socialLinks";

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
    geo: GEO,
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
  };
}
