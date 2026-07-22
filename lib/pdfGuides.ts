export type PdfGuide = {
  slug: string;
  fileUrl: string;
  fileSize: string;
  translationKey: string;
};

export const pdfGuides: PdfGuide[] = [
  {
    slug: "katalog-arbortech",
    fileUrl: "https://eshop.marosko.sk/files/elektricke-naradie/arbortech-katalog.pdf",
    fileSize: "2,2 MB",
    translationKey: "katalogArbortech",
  },
  {
    slug: "navod-arbortech-woodcarver-industrial",
    fileUrl:
      "https://eshop.marosko.sk/files/na-drevo/arbortech/industrial/arbortech-industrial-woodcarver-manual-indpkbook100.pdf",
    fileSize: "2,8 MB",
    translationKey: "navodArbortechWoodcarver",
  },
  {
    slug: "navod-arbortech-turbo-plane",
    fileUrl: "https://eshop.marosko.sk/files/dokumenty/turbo-plane-card-multilingual-010318-web-2.pdf",
    fileSize: "0,5 MB",
    translationKey: "navodArbortechTurboPlane",
  },
  {
    slug: "katalog-kirjes",
    fileUrl: "https://eshop.marosko.sk/files/kirjes/catalog-kirjes.pdf",
    fileSize: "14,6 MB",
    translationKey: "katalogKirjes",
  },
];
