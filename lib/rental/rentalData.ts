/** Tools offered for rent on /pozicovna. Names and descriptions live in
 * messages.rental.tools.<translationKey>. */
export type RentalTool = {
  slug: string;
  translationKey: string;
  /** Product photo from eshop.marosko.sk. */
  image: string;
  /** The same tool for sale on the eshop, per site locale ("sk" is the default). */
  eshopUrlByLocale: { sk: string } & Record<string, string>;
  /** Prices in € with VAT. */
  prices: { day: number; weekend: number; week: number };
  deposit: number;
  /** How many units can be out on rent at the same time. */
  units: number;
};

export const rentalTools: RentalTool[] = [
  {
    slug: "arbortech-contour-sander",
    translationKey: "contourSander",
    image: "https://eshop.marosko.sk/resize/e/1200/630/files/na-drevo/arbortech/contour-sander-sada/random-sander/arbortech-contour-sander-gallery-5.jpg",
    eshopUrlByLocale: {
      sk: "https://eshop.marosko.sk/p/370/smirkovaci-nastavec-contour-sander-sada-arbortech",
      cz: "https://eshop.marosko.sk/cz/p/370/arbortech-random-contour-sander-sada",
      ro: "https://eshop.marosko.sk/ro/p/370/sistem-excentric-slefuire-sculptura-lemn-arbortech",
    },
    prices: { day: 8, weekend: 12, week: 20 },
    deposit: 100,
    units: 1,
  },
  {
    slug: "manpa-multi-cutter-basic",
    translationKey: "manpaBasic",
    image: "https://eshop.marosko.sk/resize/e/1200/630/files/manpa/basic-kit/balenie-basic.jpg",
    eshopUrlByLocale: {
      sk: "https://eshop.marosko.sk/p/1027/frezovacie-rameno-manpa-s-nastavcom-kotucom-zakladna-verzia",
      cz: "https://eshop.marosko.sk/cz/p/1027/manpa-tools-nastavec-na-viceucelove-frezy-zakladni-sada",
      ro: "https://eshop.marosko.sk/ro/p/1027/manpa-multi-cutter-basic-kit-unealta-sculptura",
    },
    prices: { day: 15, weekend: 25, week: 45 },
    deposit: 300,
    units: 1,
  },
  {
    slug: "manpa-multi-cutter-master",
    translationKey: "manpaMaster",
    image: "https://eshop.marosko.sk/resize/e/1200/630/files/manpa/master/2.jpg",
    eshopUrlByLocale: {
      sk: "https://eshop.marosko.sk/p/1029/predlzovacie-rameno-s-predlzenim-frezovanie-manpa-multi-cutter-master",
      cz: "https://eshop.marosko.sk/cz/p/1029/manpa-multi-cutter-master-prodluzovaci-rameno-s-prodlouzenim-a-nahradni-frezkou",
      ro: "https://eshop.marosko.sk/ro/p/1029/manpa-multi-cutter-master-kit",
    },
    prices: { day: 18, weekend: 30, week: 55 },
    deposit: 350,
    units: 1,
  },
];

export function getRentalTool(slug: string): RentalTool | undefined {
  return rentalTools.find((tool) => tool.slug === slug);
}

export function rentalEshopUrl(tool: RentalTool, locale: string): string {
  return tool.eshopUrlByLocale[locale] ?? tool.eshopUrlByLocale.sk;
}

/** Number of days in an inclusive "YYYY-MM-DD" range. */
export function rentalDays(from: string, to: string): number {
  const ms = Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`);
  return Math.round(ms / 86_400_000) + 1;
}

/** Indicative price: whole weeks at the weekly rate, the remaining days at
 * the daily rate but never more than one more week. The final price is
 * confirmed by the shop together with the booking. */
export function estimatePrice(tool: RentalTool, days: number): number {
  const weeks = Math.floor(days / 7);
  const rest = days % 7;
  return weeks * tool.prices.week + Math.min(rest * tool.prices.day, tool.prices.week);
}
