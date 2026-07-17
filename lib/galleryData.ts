export type GalleryImage = {
  src: string;
  altKey: string;
  productUrl?: string;
  /** Price shown on product-style cards (cardStyle: "product"). */
  price?: string;
  /** Original (pre-discount) price, shown struck through next to `price`. */
  originalPrice?: string;
  /** Key into gallery.badges.<badge> for a small label like "TOP produkt mesiaca". */
  badge?: "top" | "sale" | "topSale";
};

export type GalleryCategory = {
  slug: string;
  translationKey: string;
  eshopUrl: string;
  /** "product" renders full product cards (image, title, description, price, CTA) instead of plain thumbnails. */
  cardStyle?: "thumbnail" | "product";
  images: GalleryImage[];
};

export const galleryCategories: GalleryCategory[] = [
  {
    slug: "frezovacie-kotuce",
    translationKey: "milling",
    eshopUrl:
      "https://eshop.marosko.sk/c/nastroje-do-uhlovej-brusky/nastroje-do-uhlovych-brusiek-na-drevo/frezovacie-naradie-do-uhlovych-brusok",
    images: [
      {
        src: "/gallery/arbortech-industrial-woodcarver.jpg",
        altKey: "img1",
        productUrl: "https://eshop.marosko.sk/p/156/arbortech-industrial-wodcarver-profi-industrial-frezovanie",
      },
      {
        src: "/gallery/pirana-prano-frezovaci-kotuc.jpg",
        altKey: "img2",
        productUrl: "https://eshop.marosko.sk/p/807/frezovaci-kotuc-pirana-110-mm",
      },
      {
        src: "/gallery/presny-frezovaci-kotuc-8mm.jpg",
        altKey: "img3",
        productUrl: "https://eshop.marosko.sk/p/1237/4-zuba-freza-s-8-mm-gulatym-profilom-priemer-95-mm",
      },
      {
        src: "/gallery/manpa-vymenitelne-noze-95mm.jpg",
        altKey: "img4",
        productUrl: "https://eshop.marosko.sk/p/722/4-zuba-freza-s-10-mm-stvorcovym-profilom-priemer-95-mm",
      },
      {
        src: "/gallery/manpa-frezovaci-kotuc-70mm.jpg",
        altKey: "img5",
        productUrl: "https://eshop.marosko.sk/p/718/3-zuba-freza-s-12-mm-gulatym-profilom-manpa",
      },
      { src: "/gallery/manpa-sada-velkosti-a.jpg", altKey: "img6" },
      { src: "/gallery/manpa-sada-velkosti-b.jpg", altKey: "img7" },
      {
        src: "/gallery/akko-frezovaci-kotuc-vymenitelne-noze.jpg",
        altKey: "img8",
        productUrl: "https://eshop.marosko.sk/p/975/3-zuba-freza-s-10-mm-stvorcovym-profilom-zuba-priemer-70mm",
      },
      {
        src: "/gallery/frezovaci-kotuc-v-praxi-uhlova-bruska.jpg",
        altKey: "img9",
        productUrl: "https://eshop.marosko.sk/p/722/4-zuba-freza-s-10-mm-stvorcovym-profilom-priemer-95-mm",
      },
      { src: "/gallery/akko-frezovaci-kotuc-bocny-pohlad.jpg", altKey: "img10" },
      {
        src: "/gallery/frezovaci-kotuc-detail-rezbarska-praca.jpg",
        altKey: "img11",
        productUrl: "https://eshop.marosko.sk/p/721/3-zuba-freza-s-12-mm-trojuholnikovym-profilom-priemer-70-mm",
      },
      {
        src: "/gallery/akko-asdm-rd1003-frezovaci-kotuc.jpg",
        altKey: "img12",
        productUrl: "https://eshop.marosko.sk/p/362/frezovaci-kotuc-profi-4-zuby-akko",
      },
    ],
  },
  {
    slug: "hoblovacie-naradie",
    translationKey: "planing",
    eshopUrl:
      "https://eshop.marosko.sk/c/nastroje-do-uhlovej-brusky/nastroje-do-uhlovych-brusiek-na-drevo/hoblovacie-naradie",
    cardStyle: "product",
    images: [
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/na-drevo/arbortech/gulicka-ball-gouge-orez.jpg",
        altKey: "arbortechBallGouge",
        productUrl: "https://eshop.marosko.sk/p/255/tvarovacia-gulicka-arbortech-ball-gouge",
        price: "163 €",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/na-drevo/do-uhlovych-brusok/hoblovacie/arbortech-turbo-plane-.jpg",
        altKey: "arbortechTurboPlane",
        productUrl: "https://eshop.marosko.sk/p/163/hoblovaci-kotuc-arbortech-turbo-plane",
        price: "180 €",
        originalPrice: "187 €",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/na-drevo/arbortech/frezovaci-kotuc-industrial.jpg",
        altKey: "arbortechWoodcarverProfiIndustrial",
        productUrl: "https://eshop.marosko.sk/p/156/arbortech-industrial-wodcarver-profi-industrial-frezovanie",
        price: "164 €",
        badge: "top",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/na-drevo/do-uhlovych-brusok/arbortech-01.jpg",
        altKey: "arbortechWoodcarverProfiIndustrialKryt",
        productUrl: "https://eshop.marosko.sk/p/1313/frezovaci-kotuc-arbortech-profi-industrial-s-krytom-woodcarver",
        price: "183,50 €",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/na-drevo/do-uhlovych-brusok/frezovacie/akko-kotuc.jpg",
        altKey: "akkoFrezovaciKotuc",
        productUrl: "https://eshop.marosko.sk/p/362/frezovaci-kotuc-profi-4-zuby-akko",
        price: "170 €",
        originalPrice: "175 €",
        badge: "sale",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/na-drevo/arbortech/precision-carving-system-sada/precizion-carving-system.jpg",
        altKey: "arbortechPrecisionCarvingSystem",
        productUrl: "https://eshop.marosko.sk/p/978/rezbarsky-system-precision-carving-system-sada",
        price: "178 €",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/na-drevo/arbortech/arbortech-skrabka/arbortech-turbo-scraper-complet.jpg",
        altKey: "arbortechTurboScraper",
        productUrl: "https://eshop.marosko.sk/p/1303/arbortech-turbo-scraper-100-mm",
        price: "158 €",
        originalPrice: "173 €",
        badge: "sale",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/na-drevo/arbortech/sphero-plane/arbortech-spheroplane-gallery-1.jpg",
        altKey: "arbortechSpheroPlane",
        productUrl: "https://eshop.marosko.sk/p/1338/arbortech-sphero-plane-frezovaci-nastavec",
        price: "360 €",
        badge: "topSale",
      },
    ],
  },
];

export function getGalleryCategory(slug: string) {
  return galleryCategories.find((category) => category.slug === slug);
}
