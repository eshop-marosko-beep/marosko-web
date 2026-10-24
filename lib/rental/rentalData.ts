/** The tools the rental started with. Names and descriptions live in
 * messages.rental.tools.<translationKey>. Everything here is a default the
 * admin can change, and the admin can add more tools (lib/rental/catalog.ts). */
export type RentalTool = {
  slug: string;
  translationKey: string;
  /** Product photo, usually from eshop.marosko.sk. */
  image: string;
  /** The same tool for sale on the eshop, per site locale ("sk" is the
   * default). Left out for tools the eshop doesn't sell. */
  eshopUrlByLocale?: { sk: string } & Record<string, string>;
  /** Prices in € with VAT. */
  prices: { day: number; weekend: number; week: number };
  deposit: number;
  /** How many units can be out on rent at the same time. */
  units: number;
  /** Value of a new tool in € for the contract, for tools the eshop doesn't
   * sell (otherwise the eshop price is used). */
  value?: number;
  /** What the customer takes home, checked off on the handover protocol
   * (Slovak, the documents are for the shop). */
  accessories: string[];
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
    accessories: ["Uhlová brúska", "Excentrický nástavec Arbortech Contour Sander", "Brúsna podložka Ø 50 mm", "Montážny kľúč"],
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
    accessories: ["Uhlová brúska s nasadeným ramenom Manpa Basic", "Frézovací kotúč 70 mm", "Montážny kľúč"],
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
    accessories: ["Uhlová brúska", "Ramená Manpa 200, 270 a 348 mm", "Frézovacie kotúče 70 a 95 mm", "Montážny kľúč", "Kufor"],
  },
  {
    slug: "karcher-puzzi-10-1",
    translationKey: "karcherPuzzi",
    // Not sold on the eshop, so the photo is served from public/.
    image: "/pozicovna/karcher-puzzi-10-1.jpg",
    value: 1200,
    prices: { day: 15, weekend: 25, week: 60 },
    deposit: 150,
    units: 1,
    accessories: ["Tepovač Kärcher Puzzi 10/1", "Hadica s rozprašovacou rukoväťou", "Ručná hubica na čalúnenie"],
  },
];

/** Number of days in an inclusive "YYYY-MM-DD" range. */
export function rentalDays(from: string, to: string): number {
  const ms = Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`);
  return Math.round(ms / 86_400_000) + 1;
}

/** Indicative price for an inclusive "YYYY-MM-DD" range: the cheapest mix
 * of single days, weekends (any stretch from Friday or Saturday to Saturday,
 * Sunday or Monday of the same weekend) and weeks (up to 7 days in a row).
 * The final price is confirmed by the shop together with the booking. */
export function estimatePrice(tool: Pick<RentalTool, "prices">, from: string, to: string): number {
  const { day, weekend, week } = tool.prices;
  const start = Date.parse(`${from}T00:00:00Z`);
  const days = rentalDays(from, to);
  const weekday = (i: number) => new Date(start + i * 86_400_000).getUTCDay(); // 0 = Sunday
  // best[i] = cheapest price for the first i days.
  const best = [0];
  for (let i = 1; i <= days; i++) {
    let cost = Math.min(best[i - 1] + day, best[Math.max(0, i - 7)] + week);
    for (let len = 2; len <= Math.min(4, i); len++) {
      const first = weekday(i - len);
      const last = weekday(i - 1);
      if ((first === 5 || first === 6) && (last === 6 || last === 0 || last === 1)) {
        cost = Math.min(cost, best[i - len] + weekend);
      }
    }
    best.push(cost);
  }
  return Math.round(best[days] * 100) / 100;
}
