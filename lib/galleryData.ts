export type GalleryImage = {
  src: string;
  altKey: string;
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
      { src: "/gallery/arbortech-industrial-woodcarver.jpg", altKey: "img1" },
      { src: "/gallery/pirana-prano-frezovaci-kotuc.jpg", altKey: "img2" },
      { src: "/gallery/presny-frezovaci-kotuc-8mm.jpg", altKey: "img3" },
      { src: "/gallery/manpa-vymenitelne-noze-95mm.jpg", altKey: "img4" },
      { src: "/gallery/manpa-frezovaci-kotuc-70mm.jpg", altKey: "img5" },
      { src: "/gallery/manpa-sada-velkosti-a.jpg", altKey: "img6" },
      { src: "/gallery/manpa-sada-velkosti-b.jpg", altKey: "img7" },
    ],
  },
];

export function getGalleryCategory(slug: string) {
  return galleryCategories.find((category) => category.slug === slug);
}
