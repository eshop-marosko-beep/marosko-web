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
    subcategories: [
      { translationKey: "maleVyseky" },
      { translationKey: "strednePriemery" },
      { translationKey: "velkePriemery" },
      { translationKey: "papier115mm" },
      { translationKey: "podlozky" },
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
    subcategories: [
      { translationKey: "pilniky" },
      { translationKey: "dlata" },
      { translationKey: "noze" },
      { translationKey: "rydla" },
      { translationKey: "tesarskeDlata" },
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
