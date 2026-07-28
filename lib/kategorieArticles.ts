export type KategorieSubcategoryProduct = {
  /** Matches a `products.<id>` translation key under kategorieSubcategoryDetail. */
  id: string;
  url: string;
  image: string;
};

export type KategorieSubcategory = {
  translationKey: string;
  /** Slugs into /galeria/[slug] for subcategories we already cover with a dedicated gallery page. */
  galleryLinks?: string[];
  /** Representative product photo for this subcategory, sourced from eshop.marosko.sk. */
  image?: string;
  /**
   * URL slug for this subcategory's own detail page at
   * /kategorie/[articleSlug]/[slug]. Only set for subcategories that have
   * one — the heading links there instead of staying plain text.
   */
  slug?: string;
  /** Direct eshop.marosko.sk URL for this specific subcategory (used as the detail page's CTA). */
  eshopUrl?: string;
  /** Featured products shown on the subcategory detail page. */
  products?: KategorieSubcategoryProduct[];
};

export type KategorieArticle = {
  slug: string;
  translationKey: string;
  eshopUrl: string;
  /** Hero photo for the article, sourced from eshop.marosko.sk. */
  image?: string;
  subcategories: KategorieSubcategory[];
};

export const kategorieArticles: KategorieArticle[] = [
  {
    slug: "nastroje-do-uhlovej-brusky",
    translationKey: "nastrojeDoUhlovejBrusky",
    eshopUrl: "https://eshop.marosko.sk/c/nastroje-do-uhlovej-brusky",
    image:
      "https://eshop.marosko.sk/resize/e/1600/1600/files/na-drevo/do-uhlovych-brusok/hoblovacie/turbo-plane2019-12-12-11-49-47.jpg",
    subcategories: [
      {
        translationKey: "naDrevo",
        slug: "na-drevo",
        galleryLinks: ["frezovacie-kotuce", "hoblovacie-naradie", "ihlickove-brusne-kotuce"],
        image: "https://eshop.marosko.sk/resize/e/800/800/files/na-drevo/arbortech/frezovaci-kotuc-industrial.jpg",
        eshopUrl: "https://eshop.marosko.sk/c/nastroje-do-uhlovej-brusky/nastroje-do-uhlovych-brusiek-na-drevo",
        products: [
          {
            id: "p156",
            url: "https://eshop.marosko.sk/p/156/arbortech-industrial-wodcarver-profi-industrial-frezovanie",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/na-drevo/arbortech/frezovaci-kotuc-industrial.jpg",
          },
          {
            id: "p163",
            url: "https://eshop.marosko.sk/p/163/hoblovaci-kotuc-arbortech-turbo-plane",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/na-drevo/do-uhlovych-brusok/hoblovacie/arbortech-turbo-plane-.jpg",
          },
          {
            id: "p255",
            url: "https://eshop.marosko.sk/p/255/tvarovacia-gulicka-arbortech-ball-gouge",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/na-drevo/arbortech/gulicka-ball-gouge-orez.jpg",
          },
          {
            id: "p1303",
            url: "https://eshop.marosko.sk/p/1303/arbortech-turbo-scraper-100-mm",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/na-drevo/arbortech/arbortech-skrabka/arbortech-turbo-scraper-complet.jpg",
          },
        ],
      },
      {
        translationKey: "manpaRameno",
        slug: "manpa-rameno",
        galleryLinks: ["manpa-predlzovacie-rameno"],
        image: "https://eshop.marosko.sk/resize/e/800/800/files/manpa/master/2.jpg",
        eshopUrl: "https://eshop.marosko.sk/c/nastroje-do-uhlovej-brusky/manpa-predlzovacie-rameno-naradie",
        products: [
          {
            id: "p1029",
            url: "https://eshop.marosko.sk/p/1029/predlzovacie-rameno-s-predlzenim-frezovanie-manpa-multi-cutter-master",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/manpa/master/2.jpg",
          },
          {
            id: "p765",
            url: "https://eshop.marosko.sk/p/765/predlzovacie-rameno-s-pasovou-bruskou",
            image:
              "https://eshop.marosko.sk/resize/e/800/800/files/na-drevo/do-uhlovych-brusok/predlzovaci-rameno-/pasova-bruska/3-154.jpg",
          },
          {
            id: "p1027",
            url: "https://eshop.marosko.sk/p/1027/frezovacie-rameno-manpa-s-nastavcom-kotucom-zakladna-verzia",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/manpa/basic-kit/basic.jpeg",
          },
          {
            id: "p796",
            url: "https://eshop.marosko.sk/p/796/mini-drazkovacia-frezovacia-stopka-12-mm",
            image:
              "https://eshop.marosko.sk/resize/e/800/800/files/manpa/mini-drazkovacia-frezovacia-stopka---12-mm/mini-frezovaci-nastavec.jpeg",
          },
        ],
      },
      {
        translationKey: "diamantoveKotuce",
        slug: "diamantove-kotuce",
        image:
          "https://eshop.marosko.sk/resize/e/800/800/files/na-kov/brusne-diamantove-kotuce-diclear/drazkovy-diamantovy-kotuc-brusny.jpg",
        eshopUrl: "https://eshop.marosko.sk/c/nastroje-do-uhlovej-brusky/diamantove-ostriace-kotuce",
        products: [
          {
            id: "p258",
            url: "https://eshop.marosko.sk/p/258/diamantovy-brusny-kotuc-drazkovy-126-126",
            image:
              "https://eshop.marosko.sk/resize/e/800/800/files/na-kov/brusne-diamantove-kotuce-diclear/drazkovy-diamantovy-kotuc-brusny.jpg",
          },
          {
            id: "p415",
            url: "https://eshop.marosko.sk/p/415/diamantovy-brusny-kotuc-drazkovy-126-39",
            image:
              "https://eshop.marosko.sk/resize/e/800/800/files/na-kov/brusne-diamantove-kotuce-diclear/diamantovy-kotuc-ostriaci-do-uhlovej-brusky-univerzalny.jpg",
          },
          {
            id: "p159",
            url: "https://eshop.marosko.sk/p/159/diamantovy-brusny-kotuc-do-uhlovej-brusky-181-76",
            image:
              "https://eshop.marosko.sk/resize/e/800/800/files/na-kov/brusne-diamantove-kotuce-diclear/19848-466--vyrp11-2002-web2-cisty.jpg",
          },
          {
            id: "p239",
            url: "https://eshop.marosko.sk/p/239/univerzalny-rezny-kotuc-multidisc-125mm",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/na-drevo/do-uhlovych-brusok/rezne/leja-tools/multidisk-lejatools.jpg",
          },
        ],
      },
      {
        translationKey: "nadstavce",
        slug: "nadstavce",
        image: "https://eshop.marosko.sk/resize/e/800/800/files/na-drevo/do-uhlovych-brusok/unasac-s-drazkami-chladiaci-efekt-.jpg",
        eshopUrl: "https://eshop.marosko.sk/c/nastroje-do-uhlovej-brusky/nadstavce-do-uhlovych-brusiek",
        products: [
          {
            id: "p1258",
            url: "https://eshop.marosko.sk/p/1258/nosic-fibrovych-smirglov-pre-uhlovu-brusku-s-chladiacimi-drazkami-115-mm",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/na-drevo/do-uhlovych-brusok/unasac-s-drazkami-chladiaci-efekt-.jpg",
          },
          {
            id: "p1307",
            url: "https://eshop.marosko.sk/p/1307/stojan-pre-uhlovou-brusku",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/vymenne-pridavne-nahradne-diely/stojan-na-uhlovu-brusku.jpg",
          },
          {
            id: "p1350",
            url: "https://eshop.marosko.sk/p/1350/rychloupinacie-sklucovadlo-na-hriadel-zavit-m10",
            image:
              "https://eshop.marosko.sk/resize/e/800/800/files/manpa/predlzovacia-hriadel-do-vrtacky/sklucovadlo-na-hriadel/-vyrp13-8624--keyless-chuck---features-1.jpg",
          },
          {
            id: "p1370",
            url: "https://eshop.marosko.sk/p/1370/diamantova-brusna-matica-valcek-50mm-m14",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/priruba-/brusna-matica/brusna-matica.jpg",
          },
        ],
      },
      {
        translationKey: "kamenTehla",
        slug: "kamen-tehla",
        image: "https://eshop.marosko.sk/resize/e/800/800/files/na-drevo/do-uhlovych-brusok/rezne/rezny-diamantovy-kotuc.jpg",
        eshopUrl: "https://eshop.marosko.sk/c/nastroje-do-uhlovej-brusky/nastroje-kamen-tehla",
        products: [
          {
            id: "p221",
            url: "https://eshop.marosko.sk/p/221/diamantovy-rezny-kotuc-turbo",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/na-drevo/do-uhlovych-brusok/rezne/rezny-diamantovy-kotuc.jpg",
          },
          {
            id: "p481",
            url: "https://eshop.marosko.sk/p/481/diamantovy-duty-vrtak-22-mm-zavit-m-14-na-uhlovu-brusku",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/vrtaky/diamantovy-duty-vrtak-22mm-uhlovka.jpg",
          },
          {
            id: "p1178",
            url: "https://eshop.marosko.sk/p/1178/sada-dutych-diamantovych-vrtakov-priemer-22-35-40-55-68-mm",
            image:
              "https://eshop.marosko.sk/resize/e/800/800/files/kamenorezba/diamantove-dute-vrtaky/-vyrp11-7647-5-modra-velka-krab-vodo.jpg",
          },
          {
            id: "p1330",
            url: "https://eshop.marosko.sk/p/1330/diamantovy-brusny-kotuc-150-mm-turbo",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/kamenorezba/475281-1.jpeg",
          },
        ],
      },
      {
        translationKey: "plastoveKompozity",
        slug: "plastove-kompozity",
        image: "https://eshop.marosko.sk/resize/e/800/800/files/na-drevo/do-uhlovych-brusok/rezne/125-diamant-na-zelezobeton.jpg",
        eshopUrl: "https://eshop.marosko.sk/c/nastroje-do-uhlovej-brusky/obrabanie-brusenie-plastovych-kompozitov",
        products: [
          {
            id: "p693",
            url: "https://eshop.marosko.sk/p/693/univerzalny-diamantovy-rezny-kotuc",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/na-drevo/do-uhlovych-brusok/rezne/125-diamant-na-zelezobeton.jpg",
          },
          {
            id: "p435",
            url: "https://eshop.marosko.sk/p/435/brusny-kotuc-s-tvrdokovom-115mm-stredne-hruby-s-hranou",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/na-drevo/brusne/115-tvrdokov-/hrana-115mm-stredne-hruby-.jpg",
          },
          {
            id: "p175",
            url: "https://eshop.marosko.sk/p/175/brusny-kotuc-s-tvrdo-kovom-o-115-mm-stredne-hruby",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/na-drevo/brusne/115-tvrdokov-/stredne-hruby-115mm-.jpg",
          },
          {
            id: "p486",
            url: "https://eshop.marosko.sk/p/486/brusny-kotuc-s-tvrdokovom-125mm-hruby-plochy-rovny",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/na-drevo/brusne/115-tvrdokov-/125mm-hruby-kotuc-.jpg",
          },
        ],
      },
    ],
  },
  {
    slug: "nastroje-do-vrtacky",
    translationKey: "nastrojeDoVrtacky",
    eshopUrl: "https://eshop.marosko.sk/c/nastroje-do-vrtacky",
    image: "https://eshop.marosko.sk/resize/e/1600/1600/files/vrtaky/-vyrn-192sada-4.jpg",
    subcategories: [
      {
        translationKey: "frezovanie",
        slug: "frezovanie",
        galleryLinks: ["frezovacie-nastroje-do-vrtacky"],
        image: "https://eshop.marosko.sk/resize/e/800/800/files/nastroje-do-vrtacky-/orbi-cut/orbi-cut.jpg",
        eshopUrl: "https://eshop.marosko.sk/c/nastroje-do-vrtacky/frezovacie-nastroje-do-vrtacky",
        products: [
          {
            id: "p813",
            url: "https://eshop.marosko.sk/p/813/dlabacia-gulocka-na-stopke-orbi-cut",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/nastroje-do-vrtacky-/orbi-cut/orbi-cut.jpg",
          },
          {
            id: "p1472",
            url: "https://eshop.marosko.sk/p/1472/orbi-cut-dlabacia-gulocka-na-stopke-40mm-nahradne-noze-ostriaca-karta",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/kirjes/d4174dc3-5908-44eb-9884-1b7f97a4ffe5.jpeg",
          },
          {
            id: "p994",
            url: "https://eshop.marosko.sk/p/994/stopkove-frezky-na-oci-vypalovacie",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/manpa/vypalovacie-frezky/img-20210513-080948-01.jpeg",
          },
          {
            id: "p981",
            url: "https://eshop.marosko.sk/p/981/mini-gulata-16-mm-frezovacia-stopka-6mm",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/manpa/6mm-stopka-gulata/scr-main-features1-orig.jpg",
          },
        ],
      },
      {
        translationKey: "brusenie",
        slug: "brusenie",
        image: "https://eshop.marosko.sk/resize/e/800/800/files/nastroje-do-vrtacky-/sada-brusnych-bubnovych-valcov-20-dielov.jpg",
        eshopUrl: "https://eshop.marosko.sk/c/nastroje-do-vrtacky/brusne-nastroje-do-vrtacky",
        products: [
          {
            id: "p805",
            url: "https://eshop.marosko.sk/p/805/sada-brusnych-bubnovych-valcov-20-dielov",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/nastroje-do-vrtacky-/sada-brusnych-bubnovych-valcov-20-dielov.jpg",
          },
          {
            id: "p1353",
            url: "https://eshop.marosko.sk/p/1353/manpa-5-lamelova-brusna-stopka-ez-sander-brusny-vejar-42",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/manpa/brusny-vejar-42/s402289862919970660-p120-i1-w604-%281%29.jpeg",
          },
          {
            id: "p744",
            url: "https://eshop.marosko.sk/p/744/brusny-hribik-na-dokoncovanie",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/nastroje-do-priamej-brusky/brusny-hrib/brusny-hribik.jpg",
          },
          {
            id: "p913",
            url: "https://eshop.marosko.sk/p/913/kompetna-brusna-suprava-kirjes-101",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/kirjes/komplatna-sada-101.png",
          },
        ],
      },
      {
        translationKey: "ostrenie",
        slug: "ostrenie",
        image:
          "https://eshop.marosko.sk/resize/e/800/800/files/na-kov/brusne-diamantove-kotuce-diclear/drazkovy-diamantovy-kotuc-brusny.jpg",
        eshopUrl: "https://eshop.marosko.sk/c/nastroje-do-vrtacky/ostriace-kotuce-diamantove",
        products: [
          {
            id: "p258",
            url: "https://eshop.marosko.sk/p/258/diamantovy-brusny-kotuc-drazkovy-126-126",
            image:
              "https://eshop.marosko.sk/resize/e/800/800/files/na-kov/brusne-diamantove-kotuce-diclear/drazkovy-diamantovy-kotuc-brusny.jpg",
          },
          {
            id: "p1203",
            url: "https://eshop.marosko.sk/p/1203/diamantova-ostriaca-karta-kirjes",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/vymenne-pridavne-nahradne-diely/desticka-brusna-na-orbi-cut.jpeg",
          },
          {
            id: "p330",
            url: "https://eshop.marosko.sk/p/330/diamantovy-pilnik-na-carvingove-retezy-pil-3-2-mm",
            image:
              "https://eshop.marosko.sk/resize/e/800/800/files/na-drevo/do-uhlovych-brusok/frezovacie/kartacovacia-hriadel/pilnik.jpg",
          },
          {
            id: "p691",
            url: "https://eshop.marosko.sk/p/691/brusne-teliesko-priemer-7-mm",
            image:
              "https://eshop.marosko.sk/resize/e/800/800/files/na-drevo/do-vrtacky/mini-unasac-smirglov-na-suchy-zips/brusne-teliesko-pr.7-mm.jpg",
          },
        ],
      },
      {
        translationKey: "nastavce",
        slug: "nastavce",
        image:
          "https://eshop.marosko.sk/resize/e/800/800/files/kirjes/86975972-1082513778764906-7550116197820268544-n.jpg",
        eshopUrl: "https://eshop.marosko.sk/c/nastroje-do-vrtacky/pridavne-nastavce-do-vrtacky",
        products: [
          {
            id: "p814",
            url: "https://eshop.marosko.sk/p/814/ohybna-hriadel-kirjes-so-sklucovadlom-do-10-mm",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/kirjes/86975972-1082513778764906-7550116197820268544-n.jpg",
          },
          {
            id: "p1319",
            url: "https://eshop.marosko.sk/p/1319/ohybna-hriadel-so-sklucovadlom-do-6mm",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/nastroje-do-vrtacky-/sklucovadla/hriadel-do-6mm.jpg",
          },
          {
            id: "p1350",
            url: "https://eshop.marosko.sk/p/1350/rychloupinacie-sklucovadlo-na-hriadel-zavit-m10",
            image:
              "https://eshop.marosko.sk/resize/e/800/800/files/manpa/predlzovacia-hriadel-do-vrtacky/sklucovadlo-na-hriadel/-vyrp13-8624--keyless-chuck---features-1.jpg",
          },
          {
            id: "p930",
            url: "https://eshop.marosko.sk/p/930/adapter-do-vrtacky-na-unasace-kotucov-so-zavitom-m-14",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/nastroje-do-vrtacky-/nadstavce-/redukcna.jpg",
          },
        ],
      },
      {
        translationKey: "vrtaky",
        slug: "vrtaky",
        image:
          "https://eshop.marosko.sk/resize/e/800/800/files/na-drevo/do-vrtacky/465-sada-dlabacich-vrtakov-/dlabaci-vrtak-stvorcove-otvory.jpg",
        eshopUrl: "https://eshop.marosko.sk/c/nastroje-do-vrtacky/vrtacie-nastroje-do-vrtacky",
        products: [
          {
            id: "p761",
            url: "https://eshop.marosko.sk/p/761/dlabacie-vrtaky-stvorcove-4-dielna-sada",
            image:
              "https://eshop.marosko.sk/resize/e/800/800/files/na-drevo/do-vrtacky/465-sada-dlabacich-vrtakov-/dlabaci-vrtak-stvorcove-otvory.jpg",
          },
          {
            id: "p265",
            url: "https://eshop.marosko.sk/p/265/diamantove-dute-vrtaky-4-dielna-sada",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/vrtaky/-vyrn-192sada-4.jpg",
          },
          {
            id: "p267",
            url: "https://eshop.marosko.sk/p/267/diamantovy-duty-vrtak-pr6-mm-stopka-do-vrtacky",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/vrtaky/duty-vrtak-do-vrtacky-diamantovy.jpg",
          },
          {
            id: "p212",
            url: "https://eshop.marosko.sk/p/212/4-dielna-sada-vrtaku-zlata-artu",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/vrtaky/4-dielna-sada-vrtakov.zlata.jpg",
          },
        ],
      },
    ],
  },
  {
    slug: "prislusenstva-do-priamej-brusky-frezky",
    translationKey: "nastrojeDoPriamejBrusky",
    eshopUrl: "https://eshop.marosko.sk/c/prislusenstva-do-priamej-brusky-frezky",
    image: "https://eshop.marosko.sk/resize/e/1600/1600/files/nastroje-do-priamej-brusky/stopka-6mm/6s38.jpg",
    subcategories: [
      {
        translationKey: "stopky24mm",
        slug: "stopky-24mm",
        image: "https://eshop.marosko.sk/resize/e/800/800/files/saburr-tooth-32t18/32f18-50.jpg",
        eshopUrl: "https://eshop.marosko.sk/c/prislusenstva-do-priamej-brusky-frezky/stopky-2-4-mm",
        products: [
          {
            id: "p1502",
            url: "https://eshop.marosko.sk/p/1502/tvar-plamen-zeleny-priemer-3-2-mm-stopka-2-4-mm",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/saburr-tooth-32t18/32f18-50.jpg",
          },
          {
            id: "p305",
            url: "https://eshop.marosko.sk/p/305/frezka-rotacna-hrana-priemer-9-5-mm-stopka-2-4-mm",
            image:
              "https://eshop.marosko.sk/resize/e/800/800/files/na-drevo/do-uhlovych-brusok/frezovacie/kartacovacia-hriadel/rotacna-hrana.jpg",
          },
          {
            id: "p977",
            url: "https://eshop.marosko.sk/p/977/stopkova-frezka-vnutorny-radius-s-cinnym-celom-priemer-6-4-mm-stopka-2-4-mm",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/na-drevo/do-uhlovych-brusok/frezovacie/kartacovacia-hriadel/9.jpg",
          },
          {
            id: "p778",
            url: "https://eshop.marosko.sk/p/778/stopka-proxxon-micromot-system-pilove-kotucky-stopka",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/nastroje-do-priamej-brusky/proxon/rezne-kotuce-28830.jpg",
          },
        ],
      },
      {
        translationKey: "stopky3mm",
        slug: "stopky-3mm",
        image:
          "https://eshop.marosko.sk/resize/e/800/800/files/na-drevo/do-uhlovych-brusok/frezovacie/kartacovacia-hriadel/picaty.jpg",
        eshopUrl: "https://eshop.marosko.sk/c/prislusenstva-do-priamej-brusky-frezky/stopky-3-mm-do-priamej-brusky",
        products: [
          {
            id: "p573",
            url: "https://eshop.marosko.sk/p/573/stopkova-frezka-spicateho-valca-9-5mm-priemer-3-mm-stopka",
            image:
              "https://eshop.marosko.sk/resize/e/800/800/files/na-drevo/do-uhlovych-brusok/frezovacie/kartacovacia-hriadel/picaty.jpg",
          },
          {
            id: "p738",
            url: "https://eshop.marosko.sk/p/738/ohybny-bovden-tuson-nahradny",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/nastroje-do-priamej-brusky/tuson.jpg",
          },
          {
            id: "p1221",
            url: "https://eshop.marosko.sk/p/1221/radialne-stetinove-kefky-25-mm-suprava-52-ks",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/nastroje-do-priamej-brusky/stopka-3mm/extol/stetinky-extol.jpeg",
          },
          {
            id: "p1444",
            url: "https://eshop.marosko.sk/p/1444/karbidove-frezky-10-kusov-stopka-3-mm",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/nastroje-do-priamej-brusky/karbid-3mm/set-karbidove-frezky.jpg",
          },
        ],
      },
      {
        translationKey: "stopky32mm",
        slug: "stopky-32mm",
        image:
          "https://eshop.marosko.sk/resize/e/800/800/files/nastroje-do-priamej-brusky/stopka-3-2mm/valec/valec-gulaty-vrch/18bn14.jpg",
        eshopUrl: "https://eshop.marosko.sk/c/prislusenstva-do-priamej-brusky-frezky/frezovacie-stopky-3-2-mm",
        products: [
          {
            id: "p503",
            url: "https://eshop.marosko.sk/p/503/frezka-tvar-valec-s-gulatym-vrchom-6-4mm-stopka-3-2-mm",
            image:
              "https://eshop.marosko.sk/resize/e/800/800/files/nastroje-do-priamej-brusky/stopka-3-2mm/valec/valec-gulaty-vrch/18bn14.jpg",
          },
          {
            id: "p310",
            url: "https://eshop.marosko.sk/p/310/ihlickova-frezka-pucik-6-4-mm-stopka-3-2-mm",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/nastroje-do-priamej-brusky/stopka-3-2mm/pucik/18bud14/18bud14.jpg",
          },
          {
            id: "p767",
            url: "https://eshop.marosko.sk/p/767/diamond-burr-set-diamantove-frezky-sada-30ks",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/nastroje-do-priamej-brusky/3-3-2mm/silverline-3-2-diamantove-frezky.jpg",
          },
          {
            id: "p762",
            url: "https://eshop.marosko.sk/p/762/sada-kalenych-frezok-6-ks",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/nastroje-do-priamej-brusky/3-3-2mm/sada-kalnnych-frezok.jpg",
          },
        ],
      },
      {
        translationKey: "stopky6mm",
        slug: "stopky-6mm",
        galleryLinks: ["prislusenstvo-priamej-brusky"],
        image: "https://eshop.marosko.sk/resize/e/800/800/files/nastroje-do-priamej-brusky/stopka-6mm/6s38.jpg",
        eshopUrl: "https://eshop.marosko.sk/c/prislusenstva-do-priamej-brusky-frezky/frezka-do-priamej-brusky-6-mm-stopkou",
        products: [
          {
            id: "p795",
            url: "https://eshop.marosko.sk/p/795/frezka-tvar-plamen-priemer-9-5-mm-stopka-6-mm",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/nastroje-do-priamej-brusky/stopka-6mm/6s38.jpg",
          },
          {
            id: "p981",
            url: "https://eshop.marosko.sk/p/981/mini-gulata-16-mm-frezovacia-stopka-6mm",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/manpa/6mm-stopka-gulata/scr-main-features1-orig.jpg",
          },
          {
            id: "p560",
            url: "https://eshop.marosko.sk/p/560/ihlickova-raspla-tvar-plamen-pr-16mm-hruba-stopka-6mm",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/nastroje-do-priamej-brusky/stopka-6mm/plamen-16-16mm.jpg",
          },
          {
            id: "p830",
            url: "https://eshop.marosko.sk/p/830/frezka-rotacna-hrana-19-mm-stopka-6-mm",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/nastroje-do-priamej-brusky/stopka-6mm/rotacne-hrany/6rs34/6rs34.jpg",
          },
        ],
      },
      {
        translationKey: "stopky64mm",
        slug: "stopky-64mm",
        image: "https://eshop.marosko.sk/resize/e/800/800/files/manpa/6mm-stopka-trojuholnikova/sct-main-features-1-orig.jpg",
        eshopUrl:
          "https://eshop.marosko.sk/c/prislusenstva-do-priamej-brusky-frezky/stopky-do-priamej-brusky-vrtackam-o-priemere-6-4-mm",
        products: [
          {
            id: "p1277",
            url: "https://eshop.marosko.sk/p/1277/mini-trojuholnikova-16-mm-frezovacia-stopka-6-4-mm-sct",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/manpa/6mm-stopka-trojuholnikova/sct-main-features-1-orig.jpg",
          },
          {
            id: "p1036",
            url: "https://eshop.marosko.sk/p/1036/dlhy-unasaci-valec-pre-navliekacie-rasple",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/nastroje-do-vrtacky-/saburr-prstence-navliekacie-/trn.jpg",
          },
          {
            id: "p1166",
            url: "https://eshop.marosko.sk/p/1166/ihlickova-raspla-dlha-prstencova-priemer-25-4-mm-brusna",
            image:
              "https://eshop.marosko.sk/resize/e/800/800/files/rasple-sabur-usa/valeckove-rasple/279373504-565437854813128-913794035515776408-n.jpg",
          },
          {
            id: "p595",
            url: "https://eshop.marosko.sk/p/595/kratky-unasaci-valec-pre-navliekacie-rasple",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/rasple-sabur-usa/ssm34slkratky.jpg",
          },
        ],
      },
    ],
  },
  {
    slug: "mini-kotuce-pre-mini-frezky-50",
    translationKey: "nastrojeDoMiniFrezky",
    eshopUrl: "https://eshop.marosko.sk/c/mini-kotuce-pre-mini-frezky-50",
    image:
      "https://eshop.marosko.sk/resize/e/1600/1600/files/na-drevo/do-uhlovych-brusok/brusne/saburr-usa/50mm-priemer/sikma-obla/oble-50mm.jpg",
    subcategories: [
      {
        translationKey: "arbortech",
        slug: "arbortech",
        image: "https://eshop.marosko.sk/resize/e/800/800/files/na-drevo/arbortech/mini-pro/arbortech-mini-pro-balenie.jpg",
        eshopUrl: "https://eshop.marosko.sk/c/mini-kotuce-pre-mini-frezky-50/arbortech-doplnky-pre-mini-carver",
        products: [
          {
            id: "p1295",
            url: "https://eshop.marosko.sk/p/1295/maly-frezovaci-kotucik-mini-pro-priemer-50mm",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/na-drevo/arbortech/mini-pro/arbortech-mini-pro-balenie.jpg",
          },
          {
            id: "p453",
            url: "https://eshop.marosko.sk/p/453/diamantovy-frezovaci-kotucik-priemer-50-mm",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/kamenorezba/diamantovy-kotucik/arbortech-mini-diamond-disc.jpg",
          },
          {
            id: "p855",
            url: "https://eshop.marosko.sk/p/855/sada-brusnych-kotucikov-3-kusov-priemer-50-mm",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/mini-frezky/sada-smirglovych-kotucov/brusn-kotuce.jpg",
          },
          {
            id: "p610",
            url: "https://eshop.marosko.sk/p/610/sada-nahradnych-kotucov-pre-mini-carver-mix",
            image:
              "https://eshop.marosko.sk/resize/e/800/800/files/vymenne-pridavne-nahradne-diely/arbortech-kotuciky-do-mini-grindra-/nahradne-smirglove-kotuciky-do-minigrindra.jpg",
          },
        ],
      },
      {
        translationKey: "ideaImport",
        slug: "idea-import",
        image:
          "https://eshop.marosko.sk/resize/e/800/800/files/na-drevo/do-uhlovych-brusok/brusne/rucne-sekane-rasple/rucne-sekane-rasple/036-rasplovy-sekany-kotucik-50mm.jpg",
        eshopUrl: "https://eshop.marosko.sk/c/mini-kotuce-pre-mini-frezky-50/idea-import-ante-cesky-vyrobca",
        products: [
          {
            id: "p368",
            url: "https://eshop.marosko.sk/p/368/kotucova-raspla-50-mm-pre-brusky-dlhym-krkom",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/mini-raspla.jpg",
          },
          {
            id: "p788",
            url: "https://eshop.marosko.sk/p/788/mini-kotuc-pre-arbortech-mini-carver-a-merlin-50-mm",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/mini-frezky/maly-frezovaci-kotucek-profi-50mm.jpg",
          },
          {
            id: "p750",
            url: "https://eshop.marosko.sk/p/750/kotucova-sekana-raspla-pre-arbortech-mini-grinder-a-merlin-50-mm",
            image:
              "https://eshop.marosko.sk/resize/e/800/800/files/na-drevo/do-uhlovych-brusok/brusne/rucne-sekane-rasple/rucne-sekane-rasple/036-rasplovy-sekany-kotucik-50mm.jpg",
          },
        ],
      },
      {
        translationKey: "saburrtooth",
        slug: "saburrtooth",
        galleryLinks: ["mini-kotuce-pre-mini-frezky"],
        image: "https://eshop.marosko.sk/resize/e/800/800/files/rasple-sabur-usa/salkova-50mm/cr2-70.jpg",
        eshopUrl: "https://eshop.marosko.sk/c/mini-kotuce-pre-mini-frezky-50/ihlickove-rasple-saburrtooth-usa",
        products: [
          {
            id: "p1013",
            url: "https://eshop.marosko.sk/p/1013/ihlickova-mini-raspla-sikma-obla-50mm",
            image:
              "https://eshop.marosko.sk/resize/e/800/800/files/na-drevo/do-uhlovych-brusok/brusne/saburr-usa/50mm-priemer/sikma-obla/oble-50mm.jpg",
          },
          {
            id: "p409",
            url: "https://eshop.marosko.sk/p/409/ihlickova-raspla-salkova-hruba-priemer-50-mm",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/rasple-sabur-usa/salkova-50mm/cr290.jpg",
          },
          {
            id: "p590",
            url: "https://eshop.marosko.sk/p/590/ihlickova-mini-raspla-gulata-50mm-jemna-s-otvormi",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/mini-frezky/mini-raspla-gulata-z-otvormi/dw250h.jpg",
          },
          {
            id: "p591",
            url: "https://eshop.marosko.sk/p/591/ihlickova-mini-raspla-gulata-50mm-hruba-s-otvormi",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/mini-frezky/mini-raspla-gulata-z-otvormi/dw270h.jpg",
          },
        ],
      },
      {
        translationKey: "manpa",
        slug: "manpa",
        image:
          "https://eshop.marosko.sk/resize/e/800/800/files/manpa/ihlickove/manpa-50mm/s402289862919970660-p5-i4-w640.jpeg",
        eshopUrl: "https://eshop.marosko.sk/c/mini-kotuce-pre-mini-frezky-50/manpa-frezky-50-mm",
        products: [
          {
            id: "p1106",
            url: "https://eshop.marosko.sk/p/1106/3-zubova-kruhova-frezka-45-mm-priemer-zuba-6-mm",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/mini-frezky/manpa/gulata/gulata-mini-frezka-50mm.jpg",
          },
          {
            id: "p1032",
            url: "https://eshop.marosko.sk/p/1032/3-zuba-trojuholnikova-frezka-priemer-45-mm",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/mini-frezky/manpa/trojuholnikova/trojuholnikova-45mm.jpg",
          },
          {
            id: "p1033",
            url: "https://eshop.marosko.sk/p/1033/3-zuba-frezka-stvorcovy-profil-zubu-45-mm",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/mini-frezky/manpa/hranata/hranata-45mm-frezka.jpg",
          },
          {
            id: "p1183",
            url: "https://eshop.marosko.sk/p/1183/ihlickovy-brusny-kotucik-manpa-50-mm",
            image:
              "https://eshop.marosko.sk/resize/e/800/800/files/manpa/ihlickove/manpa-50mm/s402289862919970660-p5-i4-w640.jpeg",
          },
        ],
      },
      {
        translationKey: "merlin",
        slug: "merlin",
        image: "https://eshop.marosko.sk/resize/e/800/800/files/na-drevo/arbortech/4zubova-minifrezka-merlin.jpg",
        eshopUrl: "https://eshop.marosko.sk/c/mini-kotuce-pre-mini-frezky-50/merlin-mini-rasple-a-retazove-frezky",
        products: [
          {
            id: "p608",
            url: "https://eshop.marosko.sk/p/608/mini-frezka-merlin-4-zubova-retazova-50mm",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/na-drevo/arbortech/4zubova-minifrezka-merlin.jpg",
          },
          {
            id: "p609",
            url: "https://eshop.marosko.sk/p/609/nahradna-retaz-merlin-8-zubova",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/vymenne-pridavne-nahradne-diely/257-merlin-retaz.jpg",
          },
          {
            id: "p607",
            url: "https://eshop.marosko.sk/p/607/nahradna-retaz-merlin-8-zubova-nahradna",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/vymenne-pridavne-nahradne-diely/oregon-8-zubova.jpg",
          },
          {
            id: "p1191",
            url: "https://eshop.marosko.sk/p/1191/tvrdokovova-miniraspla-merlin-plocha-priemer-50mm-jemna",
            image:
              "https://eshop.marosko.sk/resize/e/800/800/files/mini-frezky/minifrezka-merlin/tvrdokovova/10012-merlin-2---2in-vedge-carbide-flat-green-png--65093.png",
          },
        ],
      },
    ],
  },
  {
    slug: "brusne-vyseky-brusny-papier-platno",
    translationKey: "brusneVysekyNaMieru",
    eshopUrl: "https://eshop.marosko.sk/c/brusne-vyseky-brusny-papier-platno",
    image: "https://eshop.marosko.sk/resize/e/1600/1600/files/brusne-vyseky/12268.jpg",
    subcategories: [
      {
        translationKey: "maleVyseky",
        slug: "male-vyseky",
        image: "https://eshop.marosko.sk/resize/e/800/800/files/brusne-vyseky/50/smirgle-50mm.jpg",
        eshopUrl: "https://eshop.marosko.sk/c/brusne-vyseky-brusny-papier-platno/priemer-50-mm-brusny-papier-vysek",
        products: [
          {
            id: "p1210",
            url: "https://eshop.marosko.sk/p/1210/5-ks-balenie-brusne-vyseky-priemer-50-mm-suchy-zips",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/brusne-vyseky/50/smirgle-50mm.jpg",
          },
          {
            id: "p1052",
            url: "https://eshop.marosko.sk/p/1052/5x-korund-smirkovy-vysek-k-priemer-80-mm",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/brusne-vyseky/smirgle-80mm.jpg",
          },
          {
            id: "p973",
            url: "https://eshop.marosko.sk/p/973/smirglove-papiere-so-suchym-zipsom-vysek-125-mm",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/na-drevo/do-uhlovych-brusok/brusne/smirgle.jpg",
          },
          {
            id: "p1334",
            url: "https://eshop.marosko.sk/p/1334/silverline-samolepiace-brusne-kotuce-150-mm-10-kusov",
            image:
              "https://eshop.marosko.sk/resize/e/800/800/files/silverline/samolepiaci-brusny-papier-150mm/a1vyptnemcl.-ac-sl1500-.jpg",
          },
        ],
      },
      {
        translationKey: "strednePriemery",
        slug: "stredne-priemery",
        image: "https://eshop.marosko.sk/resize/e/800/800/files/brusne-vyseky/brusny-papier-300mm/brusny-vysek-silverline.png",
        eshopUrl: "https://eshop.marosko.sk/c/brusne-vyseky-brusny-papier-platno/brusivo-priemer-200-mm",
        products: [
          {
            id: "p1251",
            url: "https://eshop.marosko.sk/p/1251/brusny-papier-so-suchym-zipsom-vysek-180-mm-balenie-10ks",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/brusne-vyseky/brusny-papier-300mm/brusny-vysek-silverline.png",
          },
          {
            id: "p1401",
            url: "https://eshop.marosko.sk/p/1401/brusny-papier-o-200-mm-d100-suchy-zips",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/brusne-vyseky/d-100/275706138-657230568730538-3383061403559715100-n.jpg",
          },
          {
            id: "p1450",
            url: "https://eshop.marosko.sk/p/1450/brusny-papier-250mm-d120-suchy-zips",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/brusne-vyseky/250mm/brusny-vysek-drsnost-120.png",
          },
          {
            id: "p1155",
            url: "https://eshop.marosko.sk/p/1155/brusny-papier-priemer-300-mm-drsnost-40-suchy-zips",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/brusne-vyseky/d-40/275761262-483372716706575-7748692713818970183-n.jpg",
          },
        ],
      },
      {
        translationKey: "velkePriemery",
        slug: "velke-priemery",
        image: "https://eshop.marosko.sk/resize/e/800/800/files/brusne-vyseky/d-40/275785076-1589923531385968-7179285543427780534-n.jpg",
        eshopUrl: "https://eshop.marosko.sk/c/brusne-vyseky-brusny-papier-platno/priemer-370-mm",
        products: [
          {
            id: "p1417",
            url: "https://eshop.marosko.sk/p/1417/brusny-papier-o-370-mm-d40",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/brusne-vyseky/d-40/vysek-370mm.jpg",
          },
          {
            id: "p864",
            url: "https://eshop.marosko.sk/p/864/brusny-papier-brusny-papier-priemer-400-mm-drsnost-60",
            image:
              "https://eshop.marosko.sk/resize/e/800/800/files/brusne-vyseky/d-60/275877207-270373588628344-5496163316779070496-n.jpg",
          },
          {
            id: "p1071",
            url: "https://eshop.marosko.sk/p/1071/brusny-papier-450-mm-drsnost-80",
            image:
              "https://eshop.marosko.sk/resize/e/800/800/files/brusne-vyseky/d-80/276167879-1408251319608919-2254401481016750233-n.jpg",
          },
          {
            id: "p1144",
            url: "https://eshop.marosko.sk/p/1144/brusny-papier-600-mm-drsnost-40-suchy-zips",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/brusne-vyseky/d-40/275785076-1589923531385968-7179285543427780534-n.jpg",
          },
        ],
      },
      {
        translationKey: "papier115mm",
        slug: "papier-115mm",
        image: "https://eshop.marosko.sk/resize/e/800/800/files/na-drevo/do-uhlovych-brusok/brusne/smirgle.jpg",
        eshopUrl: "https://eshop.marosko.sk/c/brusne-vyseky-brusny-papier-platno/brusny-papier-115-mm-suchy-zips",
        products: [
          {
            id: "p1316",
            url: "https://eshop.marosko.sk/p/1316/brusny-papier-so-suchym-zipsom-vysek-115-mm",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/na-drevo/do-uhlovych-brusok/brusne/smirgle.jpg",
          },
          {
            id: "p875",
            url: "https://eshop.marosko.sk/p/875/fibrovy-brusny-vysek-priemer-115-mm",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/brusne-vyseky/fibrovy/fibrovy-vysek-120.jpg",
          },
          {
            id: "p1069",
            url: "https://eshop.marosko.sk/p/1069/nosic-fibrovych-smirglov-pre-uhlovu-brusku-hladky-115-mm",
            image:
              "https://eshop.marosko.sk/resize/e/800/800/files/na-drevo/do-uhlovych-brusok/brusne/univerzalne/plochy-unasac-fibrovych-smirglov.jpg",
          },
        ],
      },
      {
        translationKey: "podlozky",
        slug: "podlozky",
        image: "https://eshop.marosko.sk/resize/e/800/800/files/brusne-vyseky/molitanove-/molitanove-medzipodlozky.jpg",
        eshopUrl: "https://eshop.marosko.sk/c/brusne-vyseky-brusny-papier-platno/molitanove-medzi-podlozky",
        products: [
          {
            id: "p1138",
            url: "https://eshop.marosko.sk/p/1138/molitanova-medzivrstva-suchy-zips-vlies-115-mm",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/brusne-vyseky/molitanove-/molitanove-medzipodlozky.jpg",
          },
          {
            id: "p1136",
            url: "https://eshop.marosko.sk/p/1136/molitanova-medzivrstva-suchy-zips-vlies-125-mm",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/brusne-vyseky/molitanove-/molitanove-medzipodlozky.jpg",
          },
          {
            id: "p799",
            url: "https://eshop.marosko.sk/p/799/molitanova-medzivrstva-suchy-zips-75-100-120",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/manpa/vrstvy-manpa-.jpg",
          },
          {
            id: "p1080",
            url: "https://eshop.marosko.sk/p/1080/podlozka-hackova-samolepiaca-suchy-zips",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/brusne-vyseky/samolepiace-podlozky/img-20210924-120931-03.jpeg",
          },
        ],
      },
    ],
  },
  {
    slug: "elektricke-naradie-pre-rezbarov",
    translationKey: "elektrickeNaradie",
    eshopUrl: "https://eshop.marosko.sk/c/elektricke-naradie-pre-rezbarov",
    image: "https://eshop.marosko.sk/resize/e/1600/1600/files/elektricke-naradie/mini-grindr.jpg",
    subcategories: [
      {
        translationKey: "arbortech",
        slug: "arbortech",
        image: "https://eshop.marosko.sk/resize/e/800/800/files/elektricke-naradie/arbortech-novinka/sada-power-chisel.jpg",
        eshopUrl: "https://eshop.marosko.sk/c/elektricke-naradie-pre-rezbarov/arbortech-naradie",
        products: [
          {
            id: "p838",
            url: "https://eshop.marosko.sk/p/838/elektricke-dlato-arbortech-power-chisel-7-dielna-sada",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/elektricke-naradie/arbortech-novinka/sada-power-chisel.jpg",
          },
          {
            id: "p196",
            url: "https://eshop.marosko.sk/p/196/elektricka-frezka-arbortech-mini-carver",
            image:
              "https://eshop.marosko.sk/resize/e/800/800/files/elektricke-naradie/arbortech-novinka/mini-carver/mini-carver-nova-1000w.png",
          },
          {
            id: "p1396",
            url: "https://eshop.marosko.sk/p/1396/arbortech-allsaw-as200x-stenova-pila",
            image:
              "https://eshop.marosko.sk/resize/e/800/800/files/elektricke-naradie/arbortech-allsaw-as200/arbortech-allsaw-as200x-masonry-saw-gallery-1a.jpg",
          },
          {
            id: "p846",
            url: "https://eshop.marosko.sk/p/846/elektricka-frezka-mini-grinder-trade-sada-remeslo",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/elektricke-naradie/arbortech-novinka/arbortech-novinka-remeslo-.png",
          },
        ],
      },
      {
        translationKey: "extolPremium",
        slug: "extol-premium",
        image: "https://eshop.marosko.sk/resize/e/800/800/files/elektricke-naradie/priama-bruska-6mm-vyrez.jpg",
        eshopUrl: "https://eshop.marosko.sk/c/elektricke-naradie-pre-rezbarov/extol-craft-premium",
        products: [
          {
            id: "p398",
            url: "https://eshop.marosko.sk/p/398/priama-bruska-500w",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/elektricke-naradie/priama-bruska-6mm-vyrez.jpg",
          },
          {
            id: "p1492",
            url: "https://eshop.marosko.sk/p/1492/extol-craft-priama-bruska-135w-210ks-set-kufor",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/extol-craft/404117/135w-210-kusov-404117.jpeg",
          },
          {
            id: "p931",
            url: "https://eshop.marosko.sk/p/931/uhlova-bruska-125-mm-s-regulaciou-otacok-1400-w",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/elektricke-naradie/extol/uhlova-bruska.jpg",
          },
          {
            id: "p1213",
            url: "https://eshop.marosko.sk/p/1213/aku-priama-bruska-3-6v-li-ion-1300mah-12-dielov",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/elektricke-naradie/extol/aku-priama-bruska.jpg",
          },
        ],
      },
      {
        translationKey: "kirjes",
        slug: "kirjes",
        image: "https://eshop.marosko.sk/resize/e/800/800/files/kirjes/kirjes.jpg",
        eshopUrl: "https://eshop.marosko.sk/c/elektricke-naradie-pre-rezbarov/naradie-kirjes",
        products: [
          {
            id: "p897",
            url: "https://eshop.marosko.sk/p/897/zakladny-brusny-system-kirjes-140k-23",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/kirjes/kirjes.jpg",
          },
          {
            id: "p881",
            url: "https://eshop.marosko.sk/p/881/pohonna-jednotka-kirjes-913k-23",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/elektricke-naradie/kirjes/pohonna-jednotka-300w.jpg",
          },
          {
            id: "p1095",
            url: "https://eshop.marosko.sk/p/1095/kompletni-brusny-system-kirjes-101k-23",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/elektricke-naradie/kirjes/-vyr-6262-komplet-baleni.jpg",
          },
          {
            id: "p814",
            url: "https://eshop.marosko.sk/p/814/ohybna-hriadel-kirjes-so-sklucovadlom-do-10-mm",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/kirjes/86975972-1082513778764906-7550116197820268544-n.jpg",
          },
        ],
      },
      {
        translationKey: "tusonPriamaBruska",
        slug: "tuson",
        image: "https://eshop.marosko.sk/resize/e/800/800/files/elektricke-naradie/priame-brusky/tuson/tuson-priama-bruska.jpg",
        eshopUrl: "https://eshop.marosko.sk/c/elektricke-naradie-pre-rezbarov/priama-bruska-tuson",
        products: [
          {
            id: "p736",
            url: "https://eshop.marosko.sk/p/736/priama-bruska-z-ohybnym-bovdanom-170-w-210",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/elektricke-naradie/priame-brusky/tuson/tuson-priama-bruska.jpg",
          },
          {
            id: "p738",
            url: "https://eshop.marosko.sk/p/738/ohybny-bovden-tuson-nahradny",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/nastroje-do-priamej-brusky/tuson.jpg",
          },
          {
            id: "p1503",
            url: "https://eshop.marosko.sk/p/1503/tuson-excentricka-bruska-125mm-430w",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/elektricke-naradie/tuson/tuson.jpeg",
          },
        ],
      },
      {
        translationKey: "proxxon",
        slug: "proxxon",
        image: "https://eshop.marosko.sk/resize/e/800/800/files/elektricke-naradie/proxxon/uhlova-bruska-s-dlhym-krkom-lhw/28547.png",
        eshopUrl: "https://eshop.marosko.sk/c/elektricke-naradie-pre-rezbarov/proxon-nahradne-smirgle",
        products: [
          {
            id: "p1044",
            url: "https://eshop.marosko.sk/p/1044/uhlova-bruska-proxxon-s-dlhym-krkom-lhw",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/elektricke-naradie/proxxon/uhlova-bruska-s-dlhym-krkom-lhw/28547.png",
          },
          {
            id: "p1399",
            url: "https://eshop.marosko.sk/p/1399/elektricke-dlato-proxxon-msg-28644-p",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/elektricke-naradie/proxxon/proxon-dlato/254190005833-1.jpg",
          },
          {
            id: "p964",
            url: "https://eshop.marosko.sk/p/964/5-ks-nahradne-smirglove-pasy-zrnitost-mix-proxxon",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/elektricke-naradie/silverline/nahradne-smirge-na-pasovu-brusku.jpg",
          },
          {
            id: "p960",
            url: "https://eshop.marosko.sk/p/960/5-ks-nahradne-smirglove-pasy-40-pasovej-brusky",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/elektricke-naradie/silverline/nahradne-smirge-na-pasovu-brusku.jpg",
          },
        ],
      },
      {
        translationKey: "silverline",
        slug: "silverline",
        image: "https://eshop.marosko.sk/resize/e/800/800/files/elektricke-naradie/silverline/lesticka-1200w-180mm/264569-enwnmpro13.jpg",
        eshopUrl: "https://eshop.marosko.sk/c/elektricke-naradie-pre-rezbarov/silverline-naradie",
        products: [
          {
            id: "p1268",
            url: "https://eshop.marosko.sk/p/1268/bruska-lesticka-180-mm-1200-w",
            image:
              "https://eshop.marosko.sk/resize/e/800/800/files/elektricke-naradie/silverline/lesticka-1200w-180mm/264569-enwnmpro13.jpg",
          },
          {
            id: "p1332",
            url: "https://eshop.marosko.sk/p/1332/silverline-priama-bruska-135w",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/elektricke-naradie/silverline/silverine-priama-bruska-.jpg",
          },
          {
            id: "p704",
            url: "https://eshop.marosko.sk/p/704/teleskopicky-drziak-priamej-brusky",
            image:
              "https://eshop.marosko.sk/resize/e/800/800/files/silverline/teleskopicky-drziak-priamej-brusky/240271-enwnmpro1-72691311772021.webp",
          },
          {
            id: "p716",
            url: "https://eshop.marosko.sk/p/716/5-ks-nahradne-smirglove-pasy-40-silverline",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/elektricke-naradie/silverline/nahradne-smirge-na-pasovu-brusku.jpg",
          },
        ],
      },
      {
        translationKey: "total",
        slug: "total",
        image: "https://eshop.marosko.sk/resize/e/800/800/files/elektricke-naradie/total/total-pila.jpg",
        eshopUrl: "https://eshop.marosko.sk/c/elektricke-naradie-pre-rezbarov/total-naradie",
        products: [
          {
            id: "p1308",
            url: "https://eshop.marosko.sk/p/1308/pokosova-stolna-pila-1400-w",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/elektricke-naradie/total/total-pila.jpg",
          },
          {
            id: "p1315",
            url: "https://eshop.marosko.sk/p/1315/elektricky-hoblik-1050-w",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/elektricke-naradie/total/total-elektricky-hoblik.jpg",
          },
          {
            id: "p1366",
            url: "https://eshop.marosko.sk/p/1366/aku-uhlova-bruska-total-20-v-li-ion",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/elektricke-naradie/total/uhlova-bruska-aku/-vyr-841tagli201258-d1.jpg",
          },
          {
            id: "p1406",
            url: "https://eshop.marosko.sk/p/1406/aku-excentricka-bruska-pr-125-mm",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/elektricke-naradie/total/excentricka-bruska-total.jpg",
          },
        ],
      },
    ],
  },
  {
    slug: "akumulatorove-naradie",
    translationKey: "akumulatoroveNaradie",
    eshopUrl: "https://eshop.marosko.sk/c/akumulatorove-naradie",
    subcategories: [{ translationKey: "bruskyAku" }, { translationKey: "pilyAku" }],
  },
  {
    slug: "rucne-naradie",
    translationKey: "rucneNaradie",
    eshopUrl: "https://eshop.marosko.sk/c/rucne-naradie",
    image: "https://eshop.marosko.sk/resize/e/1600/1600/files/dlata-m-stein-/m-stein.jpg",
    subcategories: [
      {
        translationKey: "pilniky",
        slug: "pilniky",
        image: "https://eshop.marosko.sk/resize/e/800/800/files/rucne-naradie/diamantovy-blok.jpg",
        eshopUrl: "https://eshop.marosko.sk/c/rucne-naradie/pilniky",
        products: [
          {
            id: "p774",
            url: "https://eshop.marosko.sk/p/774/diamantovy-ostriaci-blok-v-stojane-obojstranny",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/rucne-naradie/diamantovy-blok.jpg",
          },
          {
            id: "p261",
            url: "https://eshop.marosko.sk/p/261/obtahovacie-diamantove-dosticky-3-ks-180-260-360",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/rucne-naradie/brusny-kamen.jpg",
          },
          {
            id: "p692",
            url: "https://eshop.marosko.sk/p/692/4-stranny-diamantovy-obtahovaci-kvader-brusny",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/rucne-naradie/4-stranny-kvader.jpg",
          },
          {
            id: "p696",
            url: "https://eshop.marosko.sk/p/696/rucna-plocha-raspla-s-tvrdokovom-150-mm-jemna",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/rucne-naradie/rucne-rasple/raspla-plocha-.jpeg",
          },
        ],
      },
      {
        translationKey: "dlata",
        slug: "dlata",
        image: "https://eshop.marosko.sk/resize/e/800/800/files/dlata-m-stein-/m-stein-/dlato-vr1-10.jpeg",
        eshopUrl: "https://eshop.marosko.sk/c/rucne-naradie/rezbarske-dlata-m-stein",
        products: [
          {
            id: "p1238",
            url: "https://eshop.marosko.sk/p/1238/dlato-m-stein-rovne",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/dlata-m-stein-/m-stein-/dlato-vr1-10.jpeg",
          },
          {
            id: "p1240",
            url: "https://eshop.marosko.sk/p/1240/dlato-mstein-rovne-profil-8",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/dlata-m-stein-/m-stein-/vr815.jpeg",
          },
          {
            id: "p1239",
            url: "https://eshop.marosko.sk/p/1239/dlato-mstein-rovne-profil-10",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/dlata-m-stein-/m-stein-/vr10-8.jpeg",
          },
          {
            id: "p1431",
            url: "https://eshop.marosko.sk/p/1431/dlata-stubai-zaciatocnik-4-dielna-sada",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/rucne-naradie/stubai/s520001-stubai-/stubai-zaciatocnik-4-dielna-sada.jpg",
          },
        ],
      },
      {
        translationKey: "noze",
        slug: "noze",
        image: "https://eshop.marosko.sk/resize/e/800/800/files/dlata-m-stein-/rezbarsky-noz/rezbarska-noz-profil-1.png",
        eshopUrl: "https://eshop.marosko.sk/c/rucne-naradie/rezbarske-noze",
        products: [
          {
            id: "p1241",
            url: "https://eshop.marosko.sk/p/1241/rezbarsky-noz-cepel-plochy-1",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/dlata-m-stein-/rezbarsky-noz/rezbarska-noz-profil-1.png",
          },
          {
            id: "p1386",
            url: "https://eshop.marosko.sk/p/1386/rezbarsky-noz-cepel-2-plochy",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/dlata-m-stein-/rezbarsky-noz/rezbarsky-noz-cepel-2.png",
          },
          {
            id: "p1433",
            url: "https://eshop.marosko.sk/p/1433/rezbarsky-noz-stubai-510601",
            image:
              "https://eshop.marosko.sk/resize/e/800/800/files/rucne-naradie/stubai/rezbarske-noze/rezbarsky-noz-5106/510601-9002793505558-1.jpg",
          },
        ],
      },
      {
        translationKey: "rydla",
        slug: "rydla",
        image: "https://eshop.marosko.sk/resize/e/800/800/files/dlata-m-stein-/rydla/rydlo-profil-8/rydlo-hruskova-rukovaet-u-profil-8.png",
        eshopUrl: "https://eshop.marosko.sk/c/rucne-naradie/rydla-linoryt-drevorezba",
        products: [
          {
            id: "p1305",
            url: "https://eshop.marosko.sk/p/1305/rydlo-s-hruskovou-rukovatou-na-linoryt-profil-8",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/dlata-m-stein-/rydla/rydlo-profil-8/rydlo-hruskova-rukovaet-u-profil-8.png",
          },
          {
            id: "p1304",
            url: "https://eshop.marosko.sk/p/1304/rydlo-s-hruskovou-rukovatou-na-linoryt-profil-11",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/dlata-m-stein-/rydlo-priemer-11mm-.jpg",
          },
          {
            id: "p1390",
            url: "https://eshop.marosko.sk/p/1390/rydlo-na-linoryt-s-pozdlznou-rukovaetou-profil-10",
            image:
              "https://eshop.marosko.sk/resize/e/800/800/files/dlata-m-stein-/m-stein-/rydlo-profil-10/0017849-lo10-04jpg-768x512.jpeg",
          },
          {
            id: "p1389",
            url: "https://eshop.marosko.sk/p/1389/rydlo-na-linoryt-s-pozdlznou-rukovatou-profil-11",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/dlata-m-stein-/m-stein-/rydlo-profil-11/rydlo11-03.jpeg",
          },
        ],
      },
      {
        translationKey: "tesarskeDlata",
        slug: "tesarske-dlata",
        image: "https://eshop.marosko.sk/resize/e/800/800/files/rucne-naradie/triton-naradie/ploche-dlato-13mm/748070-enwnmpro2.webp",
        eshopUrl: "https://eshop.marosko.sk/c/rucne-naradie/tesarske-dlata",
        products: [
          {
            id: "p1271",
            url: "https://eshop.marosko.sk/p/1271/ploche-dlato-13mm",
            image:
              "https://eshop.marosko.sk/resize/e/800/800/files/rucne-naradie/triton-naradie/ploche-dlato-13mm/748070-enwnmpro2.webp",
          },
          {
            id: "p1262",
            url: "https://eshop.marosko.sk/p/1262/ploche-dlato-38mm",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/triton/triton-dlato-.jpg",
          },
          {
            id: "p1238",
            url: "https://eshop.marosko.sk/p/1238/dlato-m-stein-rovne",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/dlata-m-stein-/m-stein-/dlato-vr1-10.jpeg",
          },
          {
            id: "p1432",
            url: "https://eshop.marosko.sk/p/1432/rovne-dlato-ploche-profil-1-seria-s52",
            image: "https://eshop.marosko.sk/resize/e/800/800/files/rucne-naradie/stubai/profil-1-s52/5201.png",
          },
        ],
      },
    ],
  },
  {
    slug: "lak-selak-natery-tmely-brusiva-pripravky-na-drevo",
    translationKey: "nateryTmelyBrusiva",
    eshopUrl: "https://eshop.marosko.sk/c/lak-selak-natery-tmely-brusiva-pripravky-na-drevo",
    subcategories: [
      { translationKey: "pozlacovanie" },
      { translationKey: "protiCervotocom" },
      { translationKey: "riedenie" },
      { translationKey: "selakyMoridla" },
      { translationKey: "vosky", galleryLinks: ["selaky-vosky-natery-na-drevo"] },
      { translationKey: "zivice" },
    ],
  },
  {
    slug: "ochranne-pomocky-pri-praci",
    translationKey: "ochrannePomocky",
    eshopUrl: "https://eshop.marosko.sk/c/ochranne-pomocky-pri-praci",
    subcategories: [
      { translationKey: "obuv" },
      { translationKey: "ruky" },
      { translationKey: "telo" },
      { translationKey: "tvarDychanieSluch" },
    ],
  },
  {
    slug: "nahradne-noze-nastrojov-diely-arbortech",
    translationKey: "nahradneDiely",
    eshopUrl: "https://eshop.marosko.sk/c/nahradne-noze-nastrojov-diely-arbortech",
    subcategories: [{ translationKey: "arbortechDiely" }, { translationKey: "manpaDiely" }],
  },
  {
    slug: "zveraky-svorky-drziaky-vrtacky-naradie",
    translationKey: "podstavceZveraky",
    eshopUrl: "https://eshop.marosko.sk/c/zveraky-svorky-drziaky-vrtacky-naradie",
    subcategories: [],
  },
  {
    slug: "rezbarske-prislusenstvo-doplnky",
    translationKey: "drobnySortiment",
    eshopUrl: "https://eshop.marosko.sk/c/rezbarske-prislusenstvo-doplnky",
    subcategories: [],
  },
  {
    slug: "listy-carvingove-vytvarnicke",
    translationKey: "carvingoveListy",
    eshopUrl: "https://eshop.marosko.sk/c/listy-carvingove-vytvarnicke",
    subcategories: [],
  },
  {
    slug: "stopkove-nastroje",
    translationKey: "stopkoveNastroje",
    eshopUrl: "https://eshop.marosko.sk/c/stopkove-nastroje",
    subcategories: [],
  },
];

export function getKategorieArticle(slug: string) {
  return kategorieArticles.find((article) => article.slug === slug);
}

export function getKategorieSubcategory(articleSlug: string, subcategorySlug: string) {
  const article = getKategorieArticle(articleSlug);
  if (!article) return undefined;
  const subcategory = article.subcategories.find((sub) => sub.slug === subcategorySlug);
  if (!subcategory) return undefined;
  return { article, subcategory };
}
