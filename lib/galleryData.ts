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
  {
    slug: "prislusenstvo-priamej-brusky",
    translationKey: "directGrinder",
    eshopUrl:
      "https://eshop.marosko.sk/c/prislusenstva-do-priamej-brusky-frezky",
    cardStyle: "product",
    images: [
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/manpa/vypalovacie-frezky/img-20210513-080948-01.jpeg",
        altKey: "p994",
        productUrl: "https://eshop.marosko.sk/p/994/stopkove-frezky-na-oci-vypalovacie",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/nastroje-do-priamej-brusky/tuson.jpg",
        altKey: "p738",
        productUrl: "https://eshop.marosko.sk/p/738/ohybny-bovden-tuson-nahradny",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/rebriky-podstavce/ohybny-bovden-extol-/218-extol-ohybny-bovden-nahradny.jpg",
        altKey: "p705",
        productUrl: "https://eshop.marosko.sk/p/705/ohybny-bovden-extol-nahradny",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/rucne-naradie/218-p.jpg",
        altKey: "p1049",
        productUrl: "https://eshop.marosko.sk/p/1049/ohybny-bovden-extol-nahradny",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/silverline/teleskopicky-drziak-priamej-brusky/240271-enwnmpro1-72691311772021.webp",
        altKey: "p704",
        productUrl: "https://eshop.marosko.sk/p/704/teleskopicky-drziak-priamej-brusky",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/na-drevo/do-uhlovych-brusok/frezovacie/kartacovacia-hriadel/rotacna-hrana.jpg",
        altKey: "p305",
        productUrl: "https://eshop.marosko.sk/p/305/frezka-rotacna-hrana-priemer-9-5-mm-stopka-2-4-mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/nastroje-do-priamej-brusky/stopka-3-2mm/pucik/18bud14/18bud14.jpg",
        altKey: "p310",
        productUrl: "https://eshop.marosko.sk/p/310/ihlickova-frezka-pucik-6-4-mm-stopka-3-2-mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/nastroje-do-priamej-brusky/18c14/18c14-40-%281%29-02.jpeg",
        altKey: "p564",
        productUrl: "https://eshop.marosko.sk/p/564/tvar-valec-s-cinnym-celom-priemer-6-4-mm-stopka-3-2mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/nastroje-do-priamej-brusky/tvar-valec-s-hladkym-celom-pr3-2mm.jpg",
        altKey: "p820",
        productUrl: "https://eshop.marosko.sk/p/820/valec-s-hladkym-vrcholom-priemer-nastroja-3-2-mm-stopka-3-2-mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/nastroje-do-priamej-brusky/stopka-3-2mm/valec/valec-zaobleny-okraj/18c12r2.jpg",
        altKey: "p316",
        productUrl: "https://eshop.marosko.sk/p/316/frezka-tvar-valec-s-oblou-hranou-pr-13-mm-stopka-3-2-mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/nastroje-do-priamej-brusky/18c12.jpg",
        altKey: "p1285",
        productUrl: "https://eshop.marosko.sk/p/1285/valec-s-cinnym-celom-priemer-13-mm-stopka-3-2-mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/nastroje-do-priamej-brusky/stopka-3-2mm/valec/valec-spicaty-vrch/18ec38-32-01.jpeg",
        altKey: "p323",
        productUrl: "https://eshop.marosko.sk/p/323/frezka-spicaty-valec-9-5-mm-stopka-3-2-mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/na-drevo/do-uhlovych-brusok/frezovacie/kartacovacia-hriadel/9.jpg",
        altKey: "p317",
        productUrl: "https://eshop.marosko.sk/p/317/tvar-vnutorny-radius-s-cinnym-celom-6-4-mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/na-drevo/do-uhlovych-brusok/frezovacie/kartacovacia-hriadel/9.jpg",
        altKey: "p977",
        productUrl: "https://eshop.marosko.sk/p/977/stopkova-frezka-vnutorny-radius-s-cinnym-celom-priemer-6-4-mm-stopka-2-4-mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/nastroje-do-priamej-brusky/3-3-2mm/vnutorny-radius/102020-09-01-19-07-35.jpg",
        altKey: "p821",
        productUrl: "https://eshop.marosko.sk/p/821/tvar-vnutorny-radius-s-cinnym-celom-6-4-mm-stopka-3-2-mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/nastroje-do-priamej-brusky/stopka-3-2mm/kuzel-18t18l/18t18l.jpg",
        altKey: "p339",
        productUrl: "https://eshop.marosko.sk/p/339/frezka-kuzel-predlzeny-priemer-3-2-mm-stopka-3-2mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/nastroje-do-priamej-brusky/stopka-3-2mm/vnutorny-radius/18cc38-32-01.jpeg",
        altKey: "p319",
        productUrl: "https://eshop.marosko.sk/p/319/frezka-valcek-zaobleny-vnutorny-radius-s-cinnym-celom-pr-9-5-mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/nastroje-do-priamej-brusky/rybina.jpg",
        altKey: "p321",
        productUrl: "https://eshop.marosko.sk/p/321/tvar-rybina-priemer-9-5-mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/na-drevo/do-uhlovych-brusok/frezovacie/kartacovacia-hriadel/gula.jpg",
        altKey: "p703",
        productUrl: "https://eshop.marosko.sk/p/703/tvrdokovova-rotacna-ihlickova-gulicka-6-4-mm-stopka-3-2mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/nastroje-do-priamej-brusky/tvar-valec-s-hladkym-celom-pr3-2mm.jpg",
        altKey: "p569",
        productUrl: "https://eshop.marosko.sk/p/569/tvar-valec-s-hladkym-celom-priemer-3-2-mm-stopka-3-mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/na-drevo/do-uhlovych-brusok/frezovacie/kartacovacia-hriadel/7.jpg",
        altKey: "p570",
        productUrl: "https://eshop.marosko.sk/p/570/frezka-valec-s-hladkym-celom-priemer-13-mm-stopka-3-mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/na-drevo/do-uhlovych-brusok/frezovacie/kartacovacia-hriadel/8.jpg",
        altKey: "p571",
        productUrl: "https://eshop.marosko.sk/p/571/tvar-valec-s-oblou-hranou-priemer-13-mm-stopka-3-mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/na-drevo/do-uhlovych-brusok/frezovacie/kartacovacia-hriadel/picaty.jpg",
        altKey: "p573",
        productUrl: "https://eshop.marosko.sk/p/573/stopkova-frezka-spicateho-valca-9-5mm-priemer-3-mm-stopka",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/rasple-sabur-usa/salkova-44-5mm/cr134-90.jpg",
        altKey: "p412",
        productUrl: "https://eshop.marosko.sk/p/412/ihlickova-raspla-salkova-hruba-priemer-44-5-mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/rasple-sabur-usa/salkova-44-5mm/cr134-125.jpg",
        altKey: "p405",
        productUrl: "https://eshop.marosko.sk/p/405/ihlickova-raspla-salkova-extra-hruba-priemer-44-5-mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/rasple-sabur-usa/salkova-44-5mm/cr134-70.jpg",
        altKey: "p411",
        productUrl: "https://eshop.marosko.sk/p/411/ihlickova-raspla-salkova-drsna-priemer-44-5-mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/rasple-sabur-usa/salkova-50mm/cr2-70.jpg",
        altKey: "p406",
        productUrl: "https://eshop.marosko.sk/p/406/ihlickova-raspla-salkova-drsna-priemer-50-mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/rasple-sabur-usa/salkova-50mm/cr290.jpg",
        altKey: "p409",
        productUrl: "https://eshop.marosko.sk/p/409/ihlickova-raspla-salkova-hruba-priemer-50-mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/nastroje-do-priamej-brusky/stopka-6mm/plamen-19mm16mm.jpg",
        altKey: "p499",
        productUrl: "https://eshop.marosko.sk/p/499/ihlickova-raspla-tvar-plamen-priemer-16-mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/nastroje-do-priamej-brusky/stopka-6mm/plamen-16-16mm.jpg",
        altKey: "p560",
        productUrl: "https://eshop.marosko.sk/p/560/ihlickova-raspla-tvar-plamen-pr-16mm-hruba-stopka-6mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/nastroje-do-priamej-brusky/stopka-6mm/plamen-19-16mm.jpg",
        altKey: "p561",
        productUrl: "https://eshop.marosko.sk/p/561/ihlickova-raspla-tvar-plamen-priemer-19-mm-extra-hruba-stopka-6-mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/nastroje-do-priamej-brusky/stopka-6mm/plamen-19-16mm.jpg",
        altKey: "p631",
        productUrl: "https://eshop.marosko.sk/p/631/ihlickova-raspla-tvar-plamen-pr-19-mm-extra-hruba-stopka-6-mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/nastroje-do-priamej-brusky/stopka-6mm/rotacne-hrany/rotosaw---6rs2z.jpg",
        altKey: "p550",
        productUrl: "https://eshop.marosko.sk/p/550/freza-rotacna-hrana-priemer-51-mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/nastroje-do-priamej-brusky/stopka-6mm/rotacne-hrany/6rs34/6rs34.jpg",
        altKey: "p830",
        productUrl: "https://eshop.marosko.sk/p/830/frezka-rotacna-hrana-19-mm-stopka-6-mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/nastroje-do-priamej-brusky/stopka-6mm/valec-z-hladkym-celom-pr--6-4-mm-stopka-6mm/cylinder---6c14se-hadke-celo.jpg",
        altKey: "p341",
        productUrl: "https://eshop.marosko.sk/p/341/valec-hladke-celo-priemer-6-4mm-stopka-6mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/nastroje-do-priamej-brusky/stopka-6mm/cylinder---6c14.jpg",
        altKey: "p641",
        productUrl: "https://eshop.marosko.sk/p/641/frezka-valec-cinne-celo-priemer-6-4-mm-stopka-6mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/nastroje-do-priamej-brusky/stopka-6mm/ball-nose---6bn14-.2019-02-14-11-26-01.jpg",
        altKey: "p640",
        productUrl: "https://eshop.marosko.sk/p/640/valec-z-gulatym-vrchom-pr-6-4-mm-stopka-6mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/nastroje-do-priamej-brusky/stopka-6mm/valec-z-hladkym-celom-pr--6-4-mm-stopka-6mm/cylinder---6c12se-hladke-celo.jpg",
        altKey: "p634",
        productUrl: "https://eshop.marosko.sk/p/634/frezka-valec-hladke-celo-13-mm-stopka-6mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/nastroje-do-priamej-brusky/stopka-3-2mm/valec/valec-gulaty-vrch/18bn14.jpg",
        altKey: "p503",
        productUrl: "https://eshop.marosko.sk/p/503/frezka-tvar-valec-s-gulatym-vrchom-6-4mm-stopka-3-2-mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/nastroje-do-priamej-brusky/stopka-6mm/tvar-valec-s-cinnym-celom-pr--13-stopka-6mm-/cylinder---6c12-cinne-celo.jpg",
        altKey: "p643",
        productUrl: "https://eshop.marosko.sk/p/643/frezka-valec-s-cinnym-celom-13-stopka-6mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/nastroje-do-priamej-brusky/stopka-6mm/tvar-valec-s-cinnym-celom-pr--13-stopka-6mm-/6c12x2/6c12x2se-3.jpg",
        altKey: "p832",
        productUrl: "https://eshop.marosko.sk/p/832/predlzeny-valec-s-cinnym-celom-pr-13-mm-stopka-6-mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/nastroje-do-priamej-brusky/stopka-6mm/6bn-12.jpg",
        altKey: "p642",
        productUrl: "https://eshop.marosko.sk/p/642/frezka-valec-s-gulatym-vrcholom-priemer-13-stopka-6mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/nastroje-do-priamej-brusky/stopka-6mm/valec-z-gulatym-vrcholom/285267753-1456481934816696-1042810986216125923-n.jpg",
        altKey: "p636",
        productUrl: "https://eshop.marosko.sk/p/636/frezka-valec-dlhy-s-gulatym-vrcholom-priemer-13mm-stopka-6mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/nastroje-do-priamej-brusky/stopka-6mm/tvar-valec-s-cinnym-celom-pr--13-stopka-6mm-/cylinder---6c58-cinne-16mm.jpg",
        altKey: "p637",
        productUrl: "https://eshop.marosko.sk/p/637/frezka-valec-cinne-celo-16-mm-stopka-6mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/nastroje-do-priamej-brusky/stopka-6mm/tvar-valec-s-cinnym-celom-pr--13-stopka-6mm-/6c34/6c34-3.jpg",
        altKey: "p836",
        productUrl: "https://eshop.marosko.sk/p/836/frezka-valec-s-cinnym-celom-priemer-19-mm-stopka-6-mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/nastroje-do-priamej-brusky/stopka-6mm/ball-nose---6bn58.jpg",
        altKey: "p644",
        productUrl: "https://eshop.marosko.sk/p/644/frezka-valec-s-gulatym-vrcholom-priemer-16-mm-stopka-6-mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/nastroje-do-priamej-brusky/stopka-6mm/mega-giga-/ball-nose---6bn34.jpg",
        altKey: "p815",
        productUrl: "https://eshop.marosko.sk/p/815/tvar-valec-s-gulatym-vrcholom-pr-19-mm-stopka-6-mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/nastroje-do-priamej-brusky/stopka-6mm/valec-z-gulatym-vrcholom/6bn34.jpg",
        altKey: "p835",
        productUrl: "https://eshop.marosko.sk/p/835/frezka-valec-s-gulatym-vrcholom-priemer-19-mm-stopka-6-mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/nastroje-do-priamej-brusky/stopka-6mm/valec-z-hladkym-celom-pr--6-4-mm-stopka-6mm/6c1r2.jpg",
        altKey: "p825",
        productUrl: "https://eshop.marosko.sk/p/825/frezka-valec-zaoblena-hrana-pr-25-4mm-stopka-6mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/nastroje-do-priamej-brusky/stopka-6mm/valec-z-hladkym-celom-pr--6-4-mm-stopka-6mm/6c1r2t.jpg",
        altKey: "p827",
        productUrl: "https://eshop.marosko.sk/p/827/frezka-valec-cinne-celo-zaoblena-hrana-priemer-25-4-mm-stopka-6-mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/nastroje-do-priamej-brusky/stopka-6mm/valec-z-hladkym-celom-pr--6-4-mm-stopka-6mm/6c1se.jpg",
        altKey: "p834",
        productUrl: "https://eshop.marosko.sk/p/834/valec-hladke-celo-priemer-25-4-mm-stopka-6-mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/vymenne-pridavne-nahradne-diely/upinac-obvodovych-raspli.jpg",
        altKey: "p638",
        productUrl: "https://eshop.marosko.sk/p/638/upinaci-trn-pre-obvodove-rasple-saburr",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/nastroje-do-priamej-brusky/stopka-6mm/6s12.jpg",
        altKey: "p687",
        productUrl: "https://eshop.marosko.sk/p/687/frezka-gulicka-pr-13-mm-stopka-6mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/nastroje-do-priamej-brusky/stopka-6mm/6f78.jpg",
        altKey: "p688",
        productUrl: "https://eshop.marosko.sk/p/688/frezka-gulicka-priemer-22-mm-stopka-6mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/nastroje-do-priamej-brusky/stopka-6mm/mega-giga-/6s78.jpg",
        altKey: "p822",
        productUrl: "https://eshop.marosko.sk/p/822/frezka-gulicka-22-mm-extremny-uber-stopka-6-mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/nastroje-do-priamej-brusky/stopka-6mm/6f78.jpg",
        altKey: "p686",
        productUrl: "https://eshop.marosko.sk/p/686/frezka-gulicka-25-mm-stopka-6mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/nastroje-do-priamej-brusky/stopka-6mm/kuzele-6mm/taper---6t14.jpg",
        altKey: "p689",
        productUrl: "https://eshop.marosko.sk/p/689/frezka-tvar-kuzel-pr-6-4-mm-stopka-6mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/nastroje-do-priamej-brusky/stopka-6mm/kuzele-6mm/taper---6t34.jpg",
        altKey: "p756",
        productUrl: "https://eshop.marosko.sk/p/756/frezka-kuzel-13-mm-stopka-6-mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/nastroje-do-priamej-brusky/stopka-6mm/kuzele-6mm/6t34se.jpg",
        altKey: "p824",
        productUrl: "https://eshop.marosko.sk/p/824/frezka-kuzel-13-mm-hladky-koniec-stopka-6-mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/nastroje-do-priamej-brusky/stopka-6mm/kuzele-6mm/6t34se.jpg",
        altKey: "p757",
        productUrl: "https://eshop.marosko.sk/p/757/frezka-tvar-kuzel-pr-19-mm-stopka-6-mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/na-drevo/do-vrtacky/mini-unasac-smirglov-na-suchy-zips/brusne-teliesko-pr.7-mm.jpg",
        altKey: "p691",
        productUrl: "https://eshop.marosko.sk/p/691/brusne-teliesko-priemer-7-mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/nastroje-do-priamej-brusky/3-3-2mm/sada-kalnnych-frezok.jpg",
        altKey: "p762",
        productUrl: "https://eshop.marosko.sk/p/762/sada-kalenych-frezok-6-ks",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/nastroje-do-priamej-brusky/3-3-2mm/silverline-3-2-diamantove-frezky.jpg",
        altKey: "p767",
        productUrl: "https://eshop.marosko.sk/p/767/diamond-burr-set-diamantove-frezky-sada-30ks",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/nastroje-do-priamej-brusky/stopky-2-5-mm/839879-pkg1.jpg",
        altKey: "p856",
        productUrl: "https://eshop.marosko.sk/p/856/diamond-burr-set-diamantove-frezky-sada-30-ks",
      },
    ],
  },
  {
    slug: "ihlickove-brusne-kotuce",
    translationKey: "needleDiscs",
    eshopUrl:
      "https://eshop.marosko.sk/c/nastroje-do-uhlovej-brusky/nastroje-do-uhlovych-brusiek-na-drevo/brusne-kotuce-na-drevo/ihlickove-brusne-kotuce",
    cardStyle: "product",
    images: [
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/na-drevo/do-uhlovych-brusok/brusne/rasple/sd770.jpg",
        altKey: "p998",
        productUrl: "https://eshop.marosko.sk/p/998/ihlickova-raspla-sikma-obla-bez-otvorov-180-mm-drsna",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/na-drevo/do-uhlovych-brusok/brusne/rasple/ihlickova-raspla-plocha-rovna-extra-hruba100mm.jpg",
        altKey: "p438",
        productUrl: "https://eshop.marosko.sk/p/438/ihlickova-raspla-plocha-rovna-priemer-100-mm-extra-hruby-uber",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/na-drevo/do-uhlovych-brusok/brusne/saburr-usa/jemna-obla-sabur.jpg",
        altKey: "p1167",
        productUrl: "https://eshop.marosko.sk/p/1167/ihlickova-raspla-gulata-bez-otvorov-priemer-100mm-jemna-velmi",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/vrtaky/bodlinova-raspla-gulata-drsna.jpg",
        altKey: "p506",
        productUrl: "https://eshop.marosko.sk/p/506/ihlickova-raspla-gulata-bez-otvorov-priemer-100mm-hruba",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/na-drevo/do-uhlovych-brusok/brusne/rasple/raspla-obla-z-otvorama-pr.125mm-jemna.jpg",
        altKey: "p476",
        productUrl: "https://eshop.marosko.sk/p/476/ihlickova-raspla-obla-priemer-100-mm-jemna-priehladne-otvory",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/rasple-sabur-usa/oble-bez-otvorov/sd490-78.jpg",
        altKey: "p618",
        productUrl: "https://eshop.marosko.sk/p/618/ihlickova-raspla-sikma-obla-bez-otvorov-priemer-100mm-hruba",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/rasple-sabur-usa/ihlickova-raspla-sikma-obla-bez-otvorov-100mm.jpg",
        altKey: "p619",
        productUrl: "https://eshop.marosko.sk/p/619/ihlickova-raspla-sikma-obla-bez-otvorov-priemer-100mm-extra-hruba",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/rasple-sabur-usa/salkova-50mm/cr2-70.jpg",
        altKey: "p406",
        productUrl: "https://eshop.marosko.sk/p/406/ihlickova-raspla-salkova-drsna-priemer-50-mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/rasple-sabur-usa/salkova-50mm/cr290.jpg",
        altKey: "p409",
        productUrl: "https://eshop.marosko.sk/p/409/ihlickova-raspla-salkova-hruba-priemer-50-mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/rasple-sabur-usa/salkova-44-5mm/cr134-70.jpg",
        altKey: "p411",
        productUrl: "https://eshop.marosko.sk/p/411/ihlickova-raspla-salkova-drsna-priemer-44-5-mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/rasple-sabur-usa/salkova-44-5mm/cr134-90.jpg",
        altKey: "p412",
        productUrl: "https://eshop.marosko.sk/p/412/ihlickova-raspla-salkova-hruba-priemer-44-5-mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/rasple-sabur-usa/salkova-44-5mm/cr134-125.jpg",
        altKey: "p405",
        productUrl: "https://eshop.marosko.sk/p/405/ihlickova-raspla-salkova-extra-hruba-priemer-44-5-mm",
      },
    ],
  },
  {
    slug: "frezovacie-nastroje-do-vrtacky",
    translationKey: "drillMilling",
    eshopUrl:
      "https://eshop.marosko.sk/c/nastroje-do-vrtacky/frezovacie-nastroje-do-vrtacky",
    cardStyle: "product",
    images: [
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/kirjes/d4174dc3-5908-44eb-9884-1b7f97a4ffe5.jpeg",
        altKey: "p1472",
        productUrl: "https://eshop.marosko.sk/p/1472/orbi-cut-dlabacia-gulocka-na-stopke-40mm-nahradne-noze-ostriaca-karta",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/nastroje-do-vrtacky-/orbi-cut/orbi-cut.jpg",
        altKey: "p813",
        productUrl: "https://eshop.marosko.sk/p/813/dlabacia-gulocka-na-stopke-orbi-cut",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/manpa/vypalovacie-frezky/img-20210513-080948-01.jpeg",
        altKey: "p994",
        productUrl: "https://eshop.marosko.sk/p/994/stopkove-frezky-na-oci-vypalovacie",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/manpa/6mm-stopka-gulata/scr-main-features1-orig.jpg",
        altKey: "p981",
        productUrl: "https://eshop.marosko.sk/p/981/mini-gulata-16-mm-frezovacia-stopka-6mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/manpa/6mm-stopka-trojuholnikova/sct-main-features-1-orig.jpg",
        altKey: "p982",
        productUrl: "https://eshop.marosko.sk/p/982/mini-trojuholnikova-16-mm-frezovacia-stopka-6-mm-sct",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/manpa/stopkove-frezky/hranata-6mm-torx.jpg",
        altKey: "p1108",
        productUrl: "https://eshop.marosko.sk/p/1108/mini-trojuholnikova-16-mm-frezovacia-stopka-6-mm-sct",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/manpa/6mm-stopka-trojuholnikova/sct-main-features-1-orig.jpg",
        altKey: "p1277",
        productUrl: "https://eshop.marosko.sk/p/1277/mini-trojuholnikova-16-mm-frezovacia-stopka-6-4-mm-sct",
      },
    ],
  },
  {
    slug: "mini-kotuce-pre-mini-frezky",
    translationKey: "miniDiscs",
    eshopUrl:
      "https://eshop.marosko.sk/c/mini-kotuce-pre-mini-frezky-50",
    cardStyle: "product",
    images: [
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/vymenne-pridavne-nahradne-diely/predlzovaci-nadstavec.jpg",
        altKey: "p413",
        productUrl: "https://eshop.marosko.sk/p/413/predlzovaci-nastavec-m-14-9-5-mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/mini-frezky/sada-smirglovych-kotucov/brusn-kotuce.jpg",
        altKey: "p855",
        productUrl: "https://eshop.marosko.sk/p/855/sada-brusnych-kotucikov-3-kusov-priemer-50-mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/na-kov/diamantovy-do-mini-frezky/diamantova-mini-frezka.jpg",
        altKey: "p1018",
        productUrl: "https://eshop.marosko.sk/p/1018/diamantovy-brusny-kotucik-do-mini-frezky-51-mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/mini-raspla.jpg",
        altKey: "p368",
        productUrl: "https://eshop.marosko.sk/p/368/kotucova-raspla-50-mm-pre-brusky-dlhym-krkom",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/mini-frezky/mini-raspla-gulata-z-otvormi/dw250h.jpg",
        altKey: "p590",
        productUrl: "https://eshop.marosko.sk/p/590/ihlickova-mini-raspla-gulata-50mm-jemna-s-otvormi",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/vymenne-pridavne-nahradne-diely/arbortech-kotuciky-do-mini-grindra-/nahradne-smirglove-kotuciky-do-minigrindra.jpg",
        altKey: "p469",
        productUrl: "https://eshop.marosko.sk/p/469/sada-nahradnych-kotucov-pre-mini-carver-d-120",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/vymenne-pridavne-nahradne-diely/arbortech-kotuciky-do-mini-grindra-/nahradne-smirglove-kotuciky-do-minigrindra.jpg",
        altKey: "p610",
        productUrl: "https://eshop.marosko.sk/p/610/sada-nahradnych-kotucov-pre-mini-carver-mix",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/vymenne-pridavne-nahradne-diely/257-merlin-retaz.jpg",
        altKey: "p609",
        productUrl: "https://eshop.marosko.sk/p/609/nahradna-retaz-merlin-8-zubova",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/na-drevo/arbortech/4zubova-minifrezka-merlin.jpg",
        altKey: "p608",
        productUrl: "https://eshop.marosko.sk/p/608/mini-frezka-merlin-4-zubova-retazova-50mm",
      },
    ],
  },
  {
    slug: "manpa-predlzovacie-rameno",
    translationKey: "manpaArm",
    eshopUrl:
      "https://eshop.marosko.sk/c/nastroje-do-uhlovej-brusky/manpa-predlzovacie-rameno-naradie",
    cardStyle: "product",
    images: [
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/na-drevo/do-uhlovych-brusok/predlzovaci-rameno-/pasova-bruska/3-154.jpg",
        altKey: "p765",
        productUrl: "https://eshop.marosko.sk/p/765/predlzovacie-rameno-s-pasovou-bruskou",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/manpa/master/2.jpg",
        altKey: "p1029",
        productUrl: "https://eshop.marosko.sk/p/1029/predlzovacie-rameno-s-predlzenim-frezovanie-manpa-multi-cutter-master",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/manpa/basic-kit/basic.jpeg",
        altKey: "p1027",
        productUrl: "https://eshop.marosko.sk/p/1027/frezovacie-rameno-manpa-s-nastavcom-kotucom-zakladna-verzia",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/na-drevo/do-uhlovych-brusok/predlzovaci-rameno-/multi-cutter-mp21-bez-frezky.jpeg",
        altKey: "p789",
        productUrl: "https://eshop.marosko.sk/p/789/predlzovacie-rameno-s-viacucelovym-nadstavcom-manpa",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/na-drevo/do-uhlovych-brusok/predlzovaci-rameno-/718-.jpg",
        altKey: "p768",
        productUrl: "https://eshop.marosko.sk/p/768/sada-predlzovacich-segmentov-k-ramenu",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/manpa/nahradne-brusne-pasy/nahradne-pasy.jpg",
        altKey: "p837",
        productUrl: "https://eshop.marosko.sk/p/837/brusne-pasy-na-pasovu-brusku-manpa-30-620mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/manpa/zvonkove-/zvonkova-freza-na-uhlovu-brusku-60-mm.jpg",
        altKey: "p915",
        productUrl: "https://eshop.marosko.sk/p/915/hlbiaca-zvonkova-freza-priemer-60-mm-manpa",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/vymenne-pridavne-nahradne-diely/m14-m10/m-14---10-prechodka-.jpg",
        altKey: "p797",
        productUrl: "https://eshop.marosko.sk/p/797/predlzovacia-prechodka-m14-m-10-16-mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/manpa/zuby-na-manpu.jpg",
        altKey: "p803",
        productUrl: "https://eshop.marosko.sk/p/803/nahradne-vymenne-zuby-na-frezu-manpa",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/manpa/zuby-na-manpu.jpg",
        altKey: "p1284",
        productUrl: "https://eshop.marosko.sk/p/1284/nahradne-vymenne-zuby-na-frezovacie-kotuce-manpa",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/manpa/frezovacie-kotuce/trojuholnikovy-70mm/trojuholnikovy-kotuc.jpg",
        altKey: "p721",
        productUrl: "https://eshop.marosko.sk/p/721/3-zuba-freza-s-12-mm-trojuholnikovym-profilom-priemer-70-mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/manpa/4-zuba.jpeg",
        altKey: "p720",
        productUrl: "https://eshop.marosko.sk/p/720/4-zuba-freza-s-8-mm-gulatym-profilom-priemer-95-mm-upnutie-m10",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/manpa/unasac-smirglov/flexibilny-unasac.jpeg",
        altKey: "p792",
        productUrl: "https://eshop.marosko.sk/p/792/unasac-smirglov-velmi-ohybny-95-mm",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/manpa/unasac-smirglov/85mm.jpeg",
        altKey: "p793",
        productUrl: "https://eshop.marosko.sk/p/793/flexibilny-unasac-smirglov-80mm-zipsovy",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/manpa/unasac-smirglov/50mm.jpeg",
        altKey: "p794",
        productUrl: "https://eshop.marosko.sk/p/794/flexibilny-unasac-smirglov-50-mm-zipsovy",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/manpa/vrstvy-manpa-.jpg",
        altKey: "p799",
        productUrl: "https://eshop.marosko.sk/p/799/molitanova-medzivrstva-suchy-zips-75-100-120",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/manpa/980.jpg",
        altKey: "p1022",
        productUrl: "https://eshop.marosko.sk/p/1022/nahradne-klinove-remene-k-ramenu-manpa",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/manpa/priruby/img-20220913-100149-01.jpeg",
        altKey: "p932",
        productUrl: "https://eshop.marosko.sk/p/932/priruby-s-osadenim-16-mm-pre-kotuce-manpa",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/na-drevo/do-uhlovych-brusok/predlzovaci-rameno-/prechodky/predlzenie-hriadela-m14-m10.jpg",
        altKey: "p1015",
        productUrl: "https://eshop.marosko.sk/p/1015/predlzenie-hriadela-uhlovej-brusky-zavit-m-10-m-10",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/manpa/vypalovacie-frezky/img-20210513-080948-01.jpeg",
        altKey: "p994",
        productUrl: "https://eshop.marosko.sk/p/994/stopkove-frezky-na-oci-vypalovacie",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/manpa/grinder-holder-/grinder--holder.jpg",
        altKey: "p917",
        productUrl: "https://eshop.marosko.sk/p/917/predlzovaci-drziak-uhlovej-brusky",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/manpa/brusny-valec/brusny-valec.jpg",
        altKey: "p1112",
        productUrl: "https://eshop.marosko.sk/p/1112/brusny-valec-na-uhlovu-brusku-manpa",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/manpa/unasaci-prst/manpa-vrtula-unasacia-.jpg",
        altKey: "p1185",
        productUrl: "https://eshop.marosko.sk/p/1185/unasaci-prst-vrtula-kuzel",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/manpa/upnutie-salovych-raspli-manpa.jpg",
        altKey: "p1204",
        productUrl: "https://eshop.marosko.sk/p/1204/predlzenie-na-salkove-rasple-na-rameno-manpa",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/manpa/predlzovacia-hriadel-do-vrtacky/sklucovadlo-na-hriadel/-vyrp13-8624--keyless-chuck---features-1.jpg",
        altKey: "p1350",
        productUrl: "https://eshop.marosko.sk/p/1350/rychloupinacie-sklucovadlo-na-hriadel-zavit-m10",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/manpa/predlzovacia-hriadel-do-vrtacky/s402289862919970660-p86-i2-w1280.jpeg",
        altKey: "p1348",
        productUrl: "https://eshop.marosko.sk/p/1348/predlzovacia-hriadel-do-vrtacky",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/manpa/lamelova-turbina-ez-sander-20/s402289862919970660-p124-i1-w604.jpeg",
        altKey: "p1352",
        productUrl: "https://eshop.marosko.sk/p/1352/manpa-lamelova-brusna-stopka-ez-sander-brusny-vejar-22",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/manpa/brusny-vejar-42/s402289862919970660-p120-i1-w604-%281%29.jpeg",
        altKey: "p1353",
        productUrl: "https://eshop.marosko.sk/p/1353/manpa-5-lamelova-brusna-stopka-ez-sander-brusny-vejar-42",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/manpa/kefove-nahrady-manpa/77263596-7e82-4f77-9c4c-3148012f27f5-900x900.jpg",
        altKey: "p1361",
        productUrl: "https://eshop.marosko.sk/p/1361/kefove-nahradne-vlakna-pre-vejar-manpa",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/manpa/prechodky-m10-na-m14/m10-m14-zavitova-prechodka.jpeg",
        altKey: "p1410",
        productUrl: "https://eshop.marosko.sk/p/1410/skrutka-matica-adapter-m10-na-m14-pre-manpa-system",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/lancelot-kotuce/14-mm-14-zub-sguire.jpg",
        altKey: "p382",
        productUrl: "https://eshop.marosko.sk/p/382/retazovy-kotuc-12-zubov-14-mm-otvor-king-arthur",
      },
      {
        src: "https://eshop.marosko.sk/resize/e/440/440/files/kamenorezba/diamantovy-kotucik/80mm/361323-enwnmpro1.webp",
        altKey: "p1415",
        productUrl: "https://eshop.marosko.sk/p/1415/diamantovy-rezny-kotuc-85mm",
      },
    ],
  },
];

export function getGalleryCategory(slug: string) {
  return galleryCategories.find((category) => category.slug === slug);
}
