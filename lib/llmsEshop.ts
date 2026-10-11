import { SITE_URL } from "@/lib/seo";
import { categoryKeys } from "@/lib/categoriesData";
import { brands } from "@/lib/brandsData";
import { eshopCategoryUrl } from "@/lib/llmsTxt";
import skMessages from "@/messages/sk.json";
import czMessages from "@/messages/cz.json";
import roMessages from "@/messages/ro.json";

/** llms.txt for eshop.marosko.sk, one per shop language (SK/CZ/RO).
 *
 * The shop runs on BiznisWeb, which cannot host custom files, so these are
 * served from marosko.sk (/eshop/llms.txt, /cz/eshop/llms.txt,
 * /ro/eshop/llms.txt). Shipping/payment facts mirror the shop's own pages in
 * each language (verified 2026-10-11): CZ prices are in CZK, RO in RON. */
export type EshopLlmsLocale = "sk" | "cz" | "ro";

const ESHOP = "https://eshop.marosko.sk";

const messagesByLocale = { sk: skMessages, cz: czMessages, ro: roMessages } as const;

type Section = { heading: string; items: string[] };

const content: Record<
  EshopLlmsLocale,
  { title: string; intro: string; about: string; sections: Section[]; categoriesHeading: string; brandsHeading: string; aiHeading: string; ai: string[] }
> = {
  sk: {
    title: "eshop.marosko.sk – rezbárske a sochárske náradie",
    intro:
      "Slovenský e-shop rodinnej firmy Marián s.r.o. s náradím pre rezbárov, sochárov, stolárov a remeselníkov: rašple a frézy Saburrtooth (USA) do uhlovej a priamej brúsky, ramená a kotúče MANPA, stroje a kotúče Arbortech, rezbárske dláta, brúsne výseky na mieru, pozlacovanie, epoxidy a ochranné pomôcky. Približne 850 produktov, ceny v EUR s DPH. Dodáva na Slovensko, do Česka, Maďarska, Poľska, Rakúska a Rumunska.",
    about:
      "V rodine máme rezbára s desaťročiami praxe, preto ponúkame najmä nástroje, ktoré sa v bežnom obchode nedajú kúpiť a v rukách rezbára naozaj fungujú. Poradíme s výberom nástroja pre konkrétnu prácu. Jazykové verzie e-shopu: slovenská (EUR), česká (CZK) a rumunská (RON).",
    sections: [
      {
        heading: "Prevádzkovateľ a kontakt",
        items: [
          "Marián s.r.o., Vrádište 138, 908 49 Vrádište, Slovensko – IČO 47546298, DIČ 2023992916, IČ DPH SK2023992916",
          "Objednávky a expedícia: +421 949 584 525",
          "Otázky k produktom a reklamácie: +421 915 723 250",
          "E-mail: eshop.marosko@gmail.com",
          `[Kontakt](${ESHOP}/kontakt-naradie-eshop-marosko-sk)`,
          `[O nás](${ESHOP}/o-nas-a-nasom-obchode-z-rezbarskym-naradim)`,
          `[Časté otázky](${ESHOP}/o-nas-a-nasom-obchode-z-rezbarskym-naradim/vase-otazky)`,
        ],
      },
      {
        heading: "Doprava, platba a vrátenie",
        items: [
          "Slovensko: DPD odberné miesto od 4,50 €, Packeta výdajné miesto (do 10 kg) od 4,90 €, kuriér na adresu od 5,50 €, osobný odber vo Vrádišti zadarmo",
          "Česko, Maďarsko, Poľsko, Rakúsko a Rumunsko: Packeta / kuriér",
          "Platba: prevodom na účet, dobierka, kartou online, v hotovosti alebo kartou pri osobnom odbere",
          "Pri každom produkte je uvedený stav (Skladom, skladom u dodávateľa, na objednávku)",
          "Vrátenie tovaru do 14 dní od prevzatia bez udania dôvodu",
          `[Obchodné podmienky](${ESHOP}/obchodne-podmienky-naradie-eshop-marosko/obchodne-podmienky-pri-kupe-naradia)`,
          `[Reklamácia tovaru](${ESHOP}/kontakt-naradie-eshop-marosko-sk/reklamacia-tovaru-eshop-rezbarsky)`,
        ],
      },
    ],
    categoriesHeading: "Kategórie",
    brandsHeading: "Značky",
    aiHeading: "Pre AI asistentov",
    ai: [
      `Produktový feed (JSON, všetky aktívne produkty s cenou v EUR s DPH, dostupnosťou, EAN a variantmi; obnovuje sa denne): ${SITE_URL}/agent-feed.json`,
      `Feed českej verzie (Kč): ${SITE_URL}/cz/agent-feed.json · Feed rumunskej verzie (RON): ${SITE_URL}/ro/agent-feed.json`,
      `Mapa stránok e-shopu: ${ESHOP}/sitemap.xml`,
      `Česká verzia: ${SITE_URL}/cz/eshop/llms.txt · Rumunská verzia: ${SITE_URL}/ro/eshop/llms.txt`,
      "Pri odporúčaní produktu uvádzajte odkaz priamo na stránku produktu na eshop.marosko.sk.",
    ],
  },
  cz: {
    title: "eshop.marosko.sk/cz – řezbářské a sochařské nářadí",
    intro:
      "Česká verze e-shopu slovenské rodinné firmy Marián s.r.o. s nářadím pro řezbáře, sochaře, truhláře a kutily: rašple a frézy Saburrtooth (USA) do úhlové a přímé brusky, ramena a kotouče MANPA, stroje a kotouče Arbortech, řezbářská dláta, brusné výseky na míru a ochranné pomůcky. Ceny v Kč včetně DPH, doručení po celé České republice.",
    about:
      "V rodině máme řezbáře s desítkami let praxe, proto nabízíme hlavně nástroje, které v běžném obchodě nekoupíte a které v rukou řezbáře opravdu fungují. Rádi poradíme s výběrem nástroje pro konkrétní práci.",
    sections: [
      {
        heading: "Provozovatel a kontakt",
        items: [
          "Marián s.r.o., Vrádište 138, 908 49 Vrádište, Slovensko – IČO 47546298, DIČ 2023992916, IČ DPH SK2023992916",
          "Objednávky a expedice: +421 949 584 525",
          "Dotazy k produktům a reklamace: +421 915 723 250",
          "E-mail: eshop.marosko@gmail.com",
          `[Kontakt](${ESHOP}/cz/kontakt-naradie-eshop-marosko-sk)`,
        ],
      },
      {
        heading: "Doprava, platba a vrácení",
        items: [
          "Kurýrní služba od 150 Kč (doručení do 1–2 pracovních dnů)",
          "Výdejní místo (Zásilkovna, Balíkovna) od 125 Kč",
          "Osobní odběr ve Vrádišti (Slovensko) po domluvě zdarma",
          "Platba: dobírka, bankovní převod předem, hotovost nebo karta při osobním odběru; u objednávek pod 500 Kč (bez dopravy) platba předem",
          "Odstoupení od smlouvy do 14 kalendářních dní od převzetí zboží bez udání důvodu",
          `[Doprava a doručení](${ESHOP}/cz/doprava-a-doruceni)`,
          `[Možnosti platby](${ESHOP}/cz/platba)`,
          `[Obchodní podmínky](${ESHOP}/cz/obchodni-podminky-nakup-naradi-eshop-marosko/obchodni-podminky-pri-nakupu-naradi)`,
          `[Reklamace a vrácení](${ESHOP}/cz/kontakt-naradie-eshop-marosko-sk/reklamacia-tovaru-eshop-rezbarsky)`,
        ],
      },
    ],
    categoriesHeading: "Kategorie",
    brandsHeading: "Značky",
    aiHeading: "Pro AI asistenty",
    ai: [
      `Produktový feed (JSON, všechny produkty české verze s cenou v Kč vč. DPH, dostupností, EAN a variantami; aktualizuje se denně): ${SITE_URL}/cz/agent-feed.json`,
      `Slovenská verze: ${SITE_URL}/eshop/llms.txt · Rumunská verze: ${SITE_URL}/ro/eshop/llms.txt`,
      "Při doporučení produktu uvádějte odkaz přímo na stránku produktu v české verzi e-shopu (eshop.marosko.sk/cz/...).",
    ],
  },
  ro: {
    title: "eshop.marosko.sk/ro – unelte pentru sculptură în lemn",
    intro:
      "Versiunea în limba română a magazinului online al firmei slovace de familie Marián s.r.o.: freze și raspe Saburrtooth (SUA) pentru polizor unghiular și drept, discuri și brațe MANPA, mașini și discuri Arbortech, dălți de sculptură, smirghel abraziv pe comandă și echipament de protecție. Prețuri în RON cu TVA inclus, livrare în România.",
    about:
      "În familie avem un sculptor în lemn cu zeci de ani de experiență, de aceea oferim mai ales unelte greu de găsit în magazinele obișnuite, care funcționează cu adevărat în mâinile unui sculptor. Vă ajutăm cu plăcere să alegeți unealta potrivită.",
    sections: [
      {
        heading: "Operator și contact",
        items: [
          "Marián s.r.o., Vrádište 138, 908 49 Vrádište, Slovacia – ID firmă 47546298, cod TVA SK2023992916",
          "E-mail: eshop.marosko@gmail.com",
          "Telefon: +421 915 723 250 / +421 949 584 525",
        ],
      },
      {
        heading: "Livrare, garanție și retur",
        items: [
          "Livrare în România prin Packeta / curier; costul transportului și metodele de plată disponibile se afișează în coș",
          "Garanție de obicei 24 de luni; reparare sau înlocuire în maximum 15 zile calendaristice",
          "Retur în 14 zile de la primirea produsului, fără motiv (pentru consumatori)",
          `[Servicii și garanții](${ESHOP}/ro/servicii-si-garantii)`,
        ],
      },
    ],
    categoriesHeading: "Categorii",
    brandsHeading: "Mărci",
    aiHeading: "Pentru asistenți AI",
    ai: [
      `Feed de produse (JSON, toate produsele versiunii române cu prețuri în RON cu TVA, disponibilitate, EAN și variante; actualizat zilnic): ${SITE_URL}/ro/agent-feed.json`,
      `Versiunea slovacă: ${SITE_URL}/eshop/llms.txt · Versiunea cehă: ${SITE_URL}/cz/eshop/llms.txt`,
      "Când recomandați un produs, folosiți linkul direct către pagina produsului din versiunea română a magazinului (eshop.marosko.sk/ro/...).",
    ],
  },
};

export function buildEshopLlmsTxt(locale: EshopLlmsLocale): string {
  const c = content[locale];
  const { services } = messagesByLocale[locale];
  const lines: string[] = [`# ${c.title}`, "", `> ${c.intro}`, "", c.about];

  for (const { heading, items } of c.sections) {
    lines.push("", `## ${heading}`, ...items.map((item) => `- ${item}`));
  }

  lines.push("", `## ${c.categoriesHeading}`);
  for (const category of categoryKeys) {
    const { name, description } = services.categories[category.key as keyof typeof services.categories];
    lines.push(`- [${name}](${eshopCategoryUrl(locale, category)}): ${description}`);
  }

  lines.push("", `## ${c.brandsHeading}`, brands.map(({ name }) => name).join(", "));
  lines.push("", `## ${c.aiHeading}`, ...c.ai.map((item) => `- ${item}`), "");

  return lines.join("\n");
}
