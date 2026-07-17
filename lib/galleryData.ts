export type GalleryImage = {
  src: string;
  altKey: string;
  productUrl?: string;
};

export type GalleryCategory = {
  slug: string;
  translationKey: string;
  eshopUrl: string;
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
      { src: "/gallery/frezovaci-kotuc-v-praxi-uhlova-bruska.jpg", altKey: "img9" },
      { src: "/gallery/akko-frezovaci-kotuc-bocny-pohlad.jpg", altKey: "img10" },
      { src: "/gallery/frezovaci-kotuc-detail-rezbarska-praca.jpg", altKey: "img11" },
      {
        src: "/gallery/akko-asdm-rd1003-frezovaci-kotuc.jpg",
        altKey: "img12",
        productUrl: "https://eshop.marosko.sk/p/362/frezovaci-kotuc-profi-4-zuby-akko",
      },
    ],
  },
];

export function getGalleryCategory(slug: string) {
  return galleryCategories.find((category) => category.slug === slug);
}
