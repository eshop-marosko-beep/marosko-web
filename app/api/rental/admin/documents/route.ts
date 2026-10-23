import { getBooking, type Booking } from "@/lib/rental/bookings";
import { getCatalogTool, type CatalogTool } from "@/lib/rental/catalog";
import { getEshopProduct, type EshopProduct } from "@/lib/rental/eshopProduct";
import { toolName } from "@/lib/rental/notify";
import { rentalEshopUrl } from "@/lib/rental/rentalData";
import { getCurrentUser } from "@/lib/rental/users";

/** Printable rental documents for one booking: the contract (one copy for
 * each side), the handover protocol and the deposit receipt. A4 HTML that
 * opens the print dialog, where the shop prints it or saves it as PDF.
 * Tool details come from the eshop product page. The customer's address and
 * ID document number are typed into the toolbar (or written in by hand)
 * and only ever live in this page, never on the server. */

const LESSOR = {
  name: "Marián s.r.o.",
  address: "Vrádište 138, 908 49 Vrádište",
  ids: "IČO: 47546298, DIČ: 2023992916",
  email: "eshop.marosko@gmail.com",
};

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function skDate(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${Number(d)}. ${Number(m)}. ${y}`;
}

function eur(n: number): string {
  return `${n.toFixed(2).replace(".", ",")} €`;
}

const blank = (width = "14em") => `<span class="blank" style="min-width:${width}"></span>`;
/** A blank the toolbar fields write into, e.g. the customer's address. */
const fill = (field: string, width: string) => `<span class="blank" data-fill="${field}" style="min-width:${width}"></span>`;
const box = `<span class="box"></span>`;

function signatures(left: string, right: string): string {
  return `<div class="signs"><div>${left}</div><div>${right}</div></div>`;
}

function contract(b: Booking, name: string, lateDay: number, product: EshopProduct | null, copy: string): string {
  const e = escapeHtml;
  const discount = b.discountPercent ? ` (po zľave ${b.discountPercent} %)` : "";
  return `<section class="page">
  <p class="copy">${copy}</p>
  <h1>Zmluva o krátkodobom nájme hnuteľnej veci č. ${e(b.id)}</h1>
  <p class="center">uzavretá podľa § 721 a nasl. zákona č. 40/1964 Zb. Občiansky zákonník</p>

  <div class="parties">
    <div><strong>Prenajímateľ:</strong><br>${LESSOR.name}<br>${LESSOR.address}<br>${LESSOR.ids}<br>${LESSOR.email}</div>
    <div><strong>Nájomca:</strong><br>${e(b.name)}<br>tel.: ${e(b.phone)}<br>${b.email ? `${e(b.email)}<br>` : ""}
      Adresa: ${fill("address", "16em")}<br>Číslo dokladu totožnosti: ${fill("idNumber", "10em")}</div>
  </div>

  <h2>1. Predmet nájmu</h2>
  <p>Prenajímateľ prenecháva nájomcovi do dočasného užívania <strong>${e(name)}</strong>${
    product ? ` (${e(product.title)}${product.code ? `, kód ${e(product.code)}` : ""})` : ""
  } vrátane príslušenstva uvedeného v odovzdávacom a preberacom protokole, ktorý je súčasťou tejto zmluvy.
  Hodnota predmetu nájmu (cena nového vrátane DPH): ${product?.price ? `<strong>${eur(product.price)}</strong>` : `${blank("6em")} €`}.</p>

  <h2>2. Doba nájmu</h2>
  <p>Nájom sa uzatvára na dobu od <strong>${skDate(b.from)}</strong> do <strong>${skDate(b.to)}</strong> (${b.days} ${b.days === 1 ? "deň" : b.days < 5 ? "dni" : "dní"}).
  Nájomca vráti vec v posledný deň nájmu v predajni prenajímateľa vo Vrádišti, v pondelok až piatok od 9:00 do 17:00, ak sa strany nedohodnú inak.</p>

  <h2>3. Nájomné a záloha</h2>
  <p>Nájomné za dobu nájmu je <strong>${eur(b.estimatedPrice)}</strong> vrátane DPH${discount}. Nájomca zaplatí pri prevzatí veci vratnú zálohu
  <strong>${eur(b.deposit)}</strong>. Prenajímateľ zálohu vráti po vrátení kompletnej a nepoškodenej veci. Prenajímateľ je oprávnený
  zo zálohy uhradiť nájomné za omeškanie a náhradu škody podľa čl. 5.</p>
  <p>Spôsob platby: ${box} hotovosť &nbsp; ${box} platobná karta &nbsp; ${box} bankový prevod</p>

  <h2>4. Práva a povinnosti</h2>
  <p>Prenajímateľ odovzdáva vec v stave spôsobilom na riadne užívanie. Nájomca potvrdzuje, že bol oboznámený s obsluhou veci
  a s bezpečnostnými pokynmi. Nájomca je povinný užívať vec riadne, v súlade s návodom a len na účel, na ktorý je určená,
  chrániť ju pred poškodením, stratou a odcudzením a neprenechať ju tretej osobe. Poruchu alebo poškodenie oznámi prenajímateľovi
  bez zbytočného odkladu a vec sám neopravuje. Spotrebný materiál nie je súčasťou nájmu.</p>

  <h2>5. Omeškanie a zodpovednosť za škodu</h2>
  <p>Za každý začatý deň omeškania s vrátením veci zaplatí nájomca nájomné vo výške dennej sadzby <strong>${eur(lateDay)}</strong>.
  Nájomca zodpovedá za poškodenie, stratu alebo odcudzenie veci, za chýbajúce príslušenstvo a za opotrebenie nad rámec bežného
  používania (napr. poškodené zuby kotúča). Pri strate alebo zničení veci uhradí nájomca jej hodnotu podľa čl. 1. Prenajímateľ nezodpovedá za škodu spôsobenú nesprávnym použitím veci.</p>

  <h2>6. Záverečné ustanovenia</h2>
  <p>Zmluva je vyhotovená v dvoch rovnopisoch, každá strana dostane jeden. Nájomca súhlasí s podmienkami požičovne zverejnenými
  na www.marosko.sk/pozicovna. Spracúvanie osobných údajov sa riadi zásadami na www.marosko.sk/gdpr.</p>

  <p class="place">Vo Vrádišti dňa ${blank("8em")}</p>
  ${signatures("Prenajímateľ", "Nájomca")}
</section>`;
}

function protocol(b: Booking, name: string, tool: CatalogTool): string {
  const e = escapeHtml;
  const rows = [...tool.accessories, "", ""]
    .map((item) => `<tr><td>${item ? e(item) : "&nbsp;"}</td><td class="c">${box}</td><td class="c">${box}</td></tr>`)
    .join("");
  return `<section class="page">
  <h1>Odovzdávací a preberací protokol</h1>
  <p class="center">k zmluve o krátkodobom nájme č. ${e(b.id)} · ${e(name)} · ${skDate(b.from)} – ${skDate(b.to)}</p>
  <p><strong>Nájomca:</strong> ${e(b.name)}, tel.: ${e(b.phone)}</p>

  <table>
    <thead><tr><th>Príslušenstvo</th><th class="c">Odovzdané</th><th class="c">Vrátené</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>

  <h2>Odovzdanie nájomcovi</h2>
  <p>Dátum a čas: ${blank("12em")}</p>
  <p>${box} vec je funkčná, bez poškodenia &nbsp; ${box} vec bola vyskúšaná pri odovzdaní</p>
  <p>Poznámky k stavu: ${blank("30em")}</p>
  <p>${blank("40em")}</p>
  ${signatures("Odovzdal (prenajímateľ)", "Prevzal (nájomca)")}

  <h2 class="gap">Vrátenie prenajímateľovi</h2>
  <p>Dátum a čas: ${blank("12em")} &nbsp; ${box} včas &nbsp; ${box} s omeškaním ${blank("3em")} dní</p>
  <p>${box} kompletné &nbsp; ${box} bez poškodenia &nbsp; ${box} zistené nedostatky:</p>
  <p>${blank("40em")}</p>
  <p>${blank("40em")}</p>
  <p>Doplatok (omeškanie, škoda): ${blank("6em")} €</p>
  ${signatures("Prevzal (prenajímateľ)", "Odovzdal (nájomca)")}
</section>`;
}

function depositReceipt(b: Booking, name: string): string {
  const e = escapeHtml;
  return `<section class="page">
  <h1>Potvrdenie o prijatí zálohy</h1>
  <p class="center">k zmluve o krátkodobom nájme č. ${e(b.id)} · ${e(name)}</p>
  <p>${LESSOR.name}, ${LESSOR.address}, ${LESSOR.ids}, potvrdzuje, že od nájomcu <strong>${e(b.name)}</strong>
  prijal vratnú zálohu vo výške <strong>${eur(b.deposit)}</strong>. Záloha nie je platbou za nájom, prenajímateľ ju má len v úschove
  a vráti ju podľa čl. 3 zmluvy.</p>
  <p>${box} hotovosť &nbsp; ${box} platobná karta &nbsp; ${box} bankový prevod</p>
  <p class="place">Vo Vrádišti dňa ${blank("8em")}</p>
  ${signatures("Prijal (prenajímateľ)", "")}

  <h1 class="gap">Potvrdenie o vrátení zálohy</h1>
  <p>Vrátená suma: ${blank("6em")} € &nbsp; Zadržaná suma: ${blank("6em")} €</p>
  <p>Dôvod zadržania: ${blank("30em")}</p>
  <p class="place">Vo Vrádišti dňa ${blank("8em")}</p>
  ${signatures("Vrátil (prenajímateľ)", "Prevzal (nájomca)")}
</section>`;
}

const STYLE = `
@page { size: A4; margin: 14mm 16mm; }
* { box-sizing: border-box; }
body { font-family: system-ui, Arial, sans-serif; font-size: 10pt; line-height: 1.4; color: #111; margin: 0; background: #eee; }
.page { background: #fff; width: 210mm; min-height: 297mm; margin: 12px auto; padding: 14mm 16mm; break-after: page; }
.page:last-child { break-after: auto; }
h1 { font-size: 14pt; text-align: center; margin: 0 0 2px; }
h2 { font-size: 10.5pt; margin: 10px 0 2px; }
p { margin: 3px 0; }
.center { text-align: center; color: #444; margin-bottom: 10px; }
.copy { text-align: right; font-size: 8.5pt; color: #666; margin: 0 0 4px; }
.parties { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 8px 0; }
.blank { display: inline-block; border-bottom: 1px solid #000; height: 1.1em; vertical-align: bottom; }
.box { display: inline-block; width: 11px; height: 11px; border: 1px solid #000; vertical-align: -1px; margin-right: 2px; }
.place { margin-top: 14px; }
.signs { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 34px; }
.signs div { border-top: 1px solid #000; padding-top: 3px; text-align: center; font-size: 9pt; min-height: 1em; }
.signs div:empty { border-top: 0; }
.gap { margin-top: 26px; }
table { width: 100%; border-collapse: collapse; margin: 10px 0; }
th, td { border: 1px solid #000; padding: 5px 6px; text-align: left; }
.c { text-align: center; width: 6.5em; }
.toolbar { position: sticky; top: 0; background: #3b2a1e; color: #fff; padding: 10px 16px; display: flex; gap: 12px; align-items: center; justify-content: center; font-size: 14px; }
.toolbar input { padding: 6px 8px; border-radius: 6px; border: 0; font-size: 14px; width: 16em; }
.toolbar button { background: #d97706; color: #fff; border: 0; padding: 8px 16px; border-radius: 6px; font-size: 14px; cursor: pointer; }
@media print {
  body { background: #fff; }
  .toolbar { display: none; }
  .page { margin: 0; width: auto; min-height: 0; padding: 0; }
}`;

function page(body: string, status = 200) {
  return new Response(
    `<!doctype html><html lang="sk"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Doklady k prenájmu</title><style>${STYLE}</style></head><body>${body}</body></html>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } }
  );
}

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user?.isAdmin) return page("<h1>Prístup len pre správcu</h1>", 403);

  const id = new URL(request.url).searchParams.get("id") ?? "";
  const booking = id ? await getBooking(id) : null;
  if (!booking || booking.kind === "block") return page("<h1>Rezervácia neexistuje</h1>", 404);
  const tool = await getCatalogTool(booking.toolSlug);
  if (!tool) return page("<h1>Náradie neexistuje</h1>", 404);

  const name = toolName(tool.slug, tool.translationKey);
  const eshopUrl = rentalEshopUrl(tool, "sk");
  const product = eshopUrl ? await getEshopProduct(eshopUrl) : null;
  const lateDay = Math.round(tool.prices.day * (100 - (booking.discountPercent ?? 0))) / 100;

  return page(`<form class="toolbar" onsubmit="event.preventDefault(); window.print();" autocomplete="off">
  <span>Doklady k rezervácii ${escapeHtml(booking.id)}</span>
  <input name="address" placeholder="Adresa nájomcu (nepovinné)" aria-label="Adresa nájomcu">
  <input name="idNumber" placeholder="Číslo dokladu totožnosti" aria-label="Číslo dokladu totožnosti">
  <button type="submit">Tlačiť / uložiť ako PDF</button></form>
${contract(booking, name, lateDay, product, "Rovnopis pre prenajímateľa")}
${contract(booking, name, lateDay, product, "Rovnopis pre nájomcu")}
${protocol(booking, name, tool)}
${depositReceipt(booking, name)}
<script>
document.querySelectorAll(".toolbar input").forEach(function (input) {
  input.addEventListener("input", function () {
    document.querySelectorAll('[data-fill="' + input.name + '"]').forEach(function (el) { el.textContent = input.value; });
  });
});
document.querySelector(".toolbar input").focus();
</script>`);
}
