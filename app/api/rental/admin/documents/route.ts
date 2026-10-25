import { ensureContractNumber, getBooking, type Booking } from "@/lib/rental/bookings";
import { eshopUrl as toolEshopUrl, getCatalogTool, toolLabel, type CatalogTool } from "@/lib/rental/catalog";
import { getEshopProduct, type EshopProduct } from "@/lib/rental/eshopProduct";
import { isPreviewDeployment, LIVE_ADMIN_URL } from "@/lib/rental/preview";
import { getCurrentUser } from "@/lib/rental/users";

/** Printable rental documents for one booking: the contract (one copy for
 * each side), the handover protocol and the deposit receipt. A4 HTML that
 * opens the print dialog, where the shop prints it or saves it as PDF.
 * Tool details come from the eshop product page. Every blank is a field to
 * type into on the page (or to fill in by hand on paper); what is typed,
 * such as the ID document number, only lives in this page and is never sent
 * to the server. */

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

/** "60,00" – the amount without the € sign, for an editable field. */
function amount(n: number): string {
  return n.toFixed(2).replace(".", ",");
}


/** A line to type into on the page itself; left empty it prints as a blank
 * line to fill in by hand. Fields with the same name (the two contract
 * copies, the payment method on the contract and the receipt) stay in sync. */
const field = (name: string, width: string, value = "") =>
  `<input class="field" name="${name}" value="${escapeHtml(value)}" style="width:${width}" autocomplete="off">`;
function todaySk(): string {
  return new Date().toLocaleDateString("sk-SK", { timeZone: "Europe/Bratislava" });
}

/** A box that is ticked by clicking it. */
const check = (name: string) => `<input type="checkbox" class="check" name="${name}">`;
const payment = `${check("payCash")} hotovosť &nbsp; ${check("payCard")} platobná karta &nbsp; ${check("payTransfer")} bankový prevod`;

function signatures(left: string, right: string): string {
  return `<div class="signs"><div>${left}</div><div>${right}</div></div>`;
}

function contract(b: Booking, name: string, lateDay: number, product: EshopProduct | null, value: number | null, copy: string): string {
  const e = escapeHtml;
  return `<section class="page">
  <p class="copy">${copy}</p>
  <h1>Zmluva o krátkodobom nájme hnuteľnej veci č. ${e(b.contractNo ?? b.id)}</h1>
  <p class="center">uzavretá podľa § 721 a nasl. zákona č. 40/1964 Zb. Občiansky zákonník</p>

  <div class="parties">
    <div><strong>Prenajímateľ:</strong><br>${LESSOR.name}<br>${LESSOR.address}<br>${LESSOR.ids}<br>${LESSOR.email}</div>
    <div><strong>Nájomca:</strong><br>${e(b.name)}<br>tel.: ${e(b.phone)}<br>${b.email ? `${e(b.email)}<br>` : ""}
      Adresa: ${field("address", "17em")}<br>Číslo dokladu totožnosti: ${field("idNumber", "9em")}</div>
  </div>

  <h2>1. Predmet nájmu</h2>
  <p>Prenajímateľ prenecháva nájomcovi do dočasného užívania <strong>${e(name)}</strong>${
    product ? ` (${e(product.title)}${product.code ? `, kód ${e(product.code)}` : ""})` : ""
  } vrátane príslušenstva uvedeného v odovzdávacom a preberacom protokole, ktorý je súčasťou tejto zmluvy.
  Hodnota predmetu nájmu (cena nového vrátane DPH): <strong>${field("value", "6em", value ? amount(value) : "")} €</strong>.</p>

  <h2>2. Doba nájmu</h2>
  <p>Nájom sa uzatvára na dobu od <strong>${skDate(b.from)}</strong> do <strong>${skDate(b.to)}</strong> (${b.days} ${b.days === 1 ? "deň" : b.days < 5 ? "dni" : "dní"}).
  Nájomca vráti vec v posledný deň nájmu v sídle prenajímateľa vo Vrádišti (Vrádište 138), v pondelok až piatok od 9:00 do 17:00, ak sa strany nedohodnú inak.</p>

  <h2>3. Nájomné a záloha</h2>
  <p>Nájomné za dobu nájmu je <strong>${field("rent", "5em", amount(b.estimatedPrice))} €</strong> vrátane DPH. Nájomca zaplatí pri prevzatí veci vratnú zálohu
  <strong>${field("deposit", "5em", amount(b.deposit))} €</strong>. Prenajímateľ zálohu vráti po vrátení kompletnej a nepoškodenej veci. Prenajímateľ je oprávnený
  zo zálohy uhradiť nájomné za omeškanie a náhradu škody podľa čl. 5.</p>
  <p>Spôsob platby: ${payment}</p>

  <h2>4. Práva a povinnosti</h2>
  <p>Prenajímateľ odovzdáva vec v stave spôsobilom na riadne užívanie. Nájomca potvrdzuje, že bol oboznámený s obsluhou veci
  a s bezpečnostnými pokynmi. Nájomca je povinný užívať vec riadne, v súlade s návodom a len na účel, na ktorý je určená,
  chrániť ju pred poškodením, stratou a odcudzením a neprenechať ju tretej osobe. Poruchu alebo poškodenie oznámi prenajímateľovi
  bez zbytočného odkladu a vec sám neopravuje. Spotrebný materiál nie je súčasťou nájmu.</p>

  <h2>5. Omeškanie a zodpovednosť za škodu</h2>
  <p>Za každý začatý deň omeškania s vrátením veci zaplatí nájomca nájomné vo výške dennej sadzby <strong>${field("lateDay", "4em", amount(lateDay))} €</strong>.
  Nájomca zodpovedá za poškodenie, stratu alebo odcudzenie veci, za chýbajúce príslušenstvo a za opotrebenie nad rámec bežného
  používania (napr. poškodené zuby kotúča). Pri strate alebo zničení veci uhradí nájomca jej hodnotu podľa čl. 1. Prenajímateľ nezodpovedá za škodu spôsobenú nesprávnym použitím veci.</p>

  <h2>6. Záverečné ustanovenia</h2>
  <p>Zmluva je vyhotovená v dvoch rovnopisoch, každá strana dostane jeden. Nájomca súhlasí s podmienkami požičovne zverejnenými
  na www.marosko.sk/pozicovna. Spracúvanie osobných údajov sa riadi zásadami na www.marosko.sk/gdpr.</p>

  <p class="place">Vo Vrádišti dňa ${field("contractDate", "8em", todaySk())}</p>
  ${signatures("Prenajímateľ", "Nájomca")}
</section>`;
}

function protocol(b: Booking, name: string, tool: CatalogTool): string {
  const e = escapeHtml;
  const rows = [...tool.accessories, "", ""]
    .map((item, i) => `<tr><td>${field(`accName${i}`, "100%", item)}</td><td class="c">${check(`accOut${i}`)}</td><td class="c">${check(`accBack${i}`)}</td></tr>`)
    .join("");
  return `<section class="page">
  <h1>Odovzdávací a preberací protokol</h1>
  <p class="center">k zmluve o krátkodobom nájme č. ${e(b.contractNo ?? b.id)} · ${e(name)} · ${skDate(b.from)} – ${skDate(b.to)}</p>
  <p><strong>Nájomca:</strong> ${e(b.name)}, tel.: ${e(b.phone)}</p>

  <table>
    <thead><tr><th>Príslušenstvo</th><th class="c">Odovzdané</th><th class="c">Vrátené</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>

  <h2>Odovzdanie nájomcovi</h2>
  <p>Dátum a čas: ${field("outTime", "12em")}</p>
  <p>${check("outWorking")} vec je funkčná, bez poškodenia &nbsp; ${check("outTested")} vec bola vyskúšaná pri odovzdaní</p>
  <p>Poznámky k stavu: ${field("outNote1", "30em")}</p>
  <p>${field("outNote2", "100%")}</p>
  ${signatures("Odovzdal (prenajímateľ)", "Prevzal (nájomca)")}

  <h2 class="gap">Vrátenie prenajímateľovi</h2>
  <p>Dátum a čas: ${field("backTime", "12em")} &nbsp; ${check("backOnTime")} včas &nbsp; ${check("backLate")} s omeškaním ${field("lateDays", "3em")} dní</p>
  <p>${check("backComplete")} kompletné &nbsp; ${check("backUndamaged")} bez poškodenia &nbsp; ${check("backDefects")} zistené nedostatky:</p>
  <p>${field("defects1", "100%")}</p>
  <p>${field("defects2", "100%")}</p>
  <p>Doplatok (omeškanie, škoda): ${field("extraCharge", "6em")} €</p>
  ${signatures("Prevzal (prenajímateľ)", "Odovzdal (nájomca)")}
</section>`;
}

function depositReceipt(b: Booking, name: string): string {
  const e = escapeHtml;
  return `<section class="page">
  <h1>Potvrdenie o prijatí zálohy</h1>
  <p class="center">k zmluve o krátkodobom nájme č. ${e(b.contractNo ?? b.id)} · ${e(name)}</p>
  <p>${LESSOR.name}, ${LESSOR.address}, ${LESSOR.ids}, potvrdzuje, že od nájomcu <strong>${e(b.name)}</strong>
  prijal vratnú zálohu vo výške <strong>${field("deposit", "5em", amount(b.deposit))} €</strong>. Záloha nie je platbou za nájom, prenajímateľ ju má len v úschove
  a vráti ju podľa čl. 3 zmluvy.</p>
  <p>${payment}</p>
  <p class="place">Vo Vrádišti dňa ${field("depositDate", "8em", todaySk())}</p>
  ${signatures("Prijal (prenajímateľ)", "")}

  <h1 class="gap">Potvrdenie o vrátení zálohy</h1>
  <p>Vrátená suma: ${field("returned", "6em")} € &nbsp; Zadržaná suma: ${field("kept", "6em")} €</p>
  <p>Dôvod zadržania: ${field("keptReason", "30em")}</p>
  <p class="place">Vo Vrádišti dňa ${field("returnDate", "8em")}</p>
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
.field { font: inherit; color: inherit; border: 0; border-bottom: 1px solid #000; background: #fff8e6; padding: 0 2px; height: 1.35em; vertical-align: bottom; max-width: 100%; }
.field:focus { outline: 2px solid #d97706; background: #fff; }
.check { width: 13px; height: 13px; margin: 0 3px 0 0; vertical-align: -2px; accent-color: #111; cursor: pointer; }
td .field { width: 100%; border-bottom: 0; }
.place { margin-top: 14px; }
.signs { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 34px; }
.signs div { border-top: 1px solid #000; padding-top: 3px; text-align: center; font-size: 9pt; min-height: 1em; }
.signs div:empty { border-top: 0; }
.gap { margin-top: 26px; }
table { width: 100%; border-collapse: collapse; margin: 10px 0; }
th, td { border: 1px solid #000; padding: 5px 6px; text-align: left; }
.c { text-align: center; width: 6.5em; }
.toolbar { position: sticky; top: 0; background: #3b2a1e; color: #fff; padding: 10px 16px; display: flex; gap: 12px; align-items: center; justify-content: center; font-size: 14px; }
.toolbar button { background: #d97706; color: #fff; border: 0; padding: 8px 16px; border-radius: 6px; font-size: 14px; cursor: pointer; }
@media print {
  body { background: #fff; }
  .toolbar { display: none; }
  .field, .field:focus { background: transparent; outline: none; }
  .page { margin: 0; width: auto; min-height: 0; padding: 0; }
}`;

function page(body: string, status = 200) {
  return new Response(
    `<!doctype html><html lang="sk"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Doklady k prenájmu</title><style>${STYLE}</style></head><body>${body}</body></html>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } }
  );
}

export async function GET(request: Request) {
  if (isPreviewDeployment()) return page(`<h1>Doklady sa tlačia na <a href="${LIVE_ADMIN_URL}">www.marosko.sk</a></h1>`, 403);
  const user = await getCurrentUser();
  if (!user?.isAdmin) return page("<h1>Prístup len pre správcu</h1>", 403);

  const id = new URL(request.url).searchParams.get("id") ?? "";
  const found = id ? await getBooking(id) : null;
  if (!found || found.kind === "block") return page("<h1>Rezervácia neexistuje</h1>", 404);
  const booking = await ensureContractNumber(found);
  const tool = await getCatalogTool(booking.toolSlug);
  if (!tool) return page("<h1>Náradie neexistuje</h1>", 404);

  const name = toolLabel(tool);
  const eshopUrl = toolEshopUrl(tool, "sk");
  const product = eshopUrl ? await getEshopProduct(eshopUrl) : null;
  const value = product?.price ?? tool.value ?? null;
  const lateDay = Math.round(tool.prices.day * (100 - (booking.discountPercent ?? 0))) / 100;

  return page(`<div class="toolbar">
  <span>Doklady k zmluve č. ${escapeHtml(booking.contractNo ?? booking.id)} – kliknite do žltých riadkov a políčok a doplňte, čo treba. Prázdne ostanú na ručné vypísanie.</span>
  <span id="saveStatus" aria-live="polite"></span>
  <button type="button" onclick="window.print()">Tlačiť / uložiť ako PDF</button></div>
${contract(booking, name, lateDay, product, value, "Rovnopis pre prenajímateľa")}
${contract(booking, name, lateDay, product, value, "Rovnopis pre nájomcu")}
${protocol(booking, name, tool)}
${depositReceipt(booking, name)}
<script>
// Same-named fields (both contract copies, payment method) mirror each other.
document.addEventListener("input", function (event) {
  var source = event.target;
  if (!source.name) return;
  document.querySelectorAll('input[name="' + source.name + '"]').forEach(function (el) {
    if (el === source) return;
    if (el.type === "checkbox") el.checked = source.checked;
    else el.value = source.value;
  });
});
// A changed rent or deposit is saved to the booking, so the admin panel and
// the next printout show the agreed amounts.
var saveStatus = document.getElementById("saveStatus");
document.addEventListener("change", function (event) {
  var name = event.target.name;
  if (name !== "rent" && name !== "deposit") return;
  var rent = document.querySelector('input[name="rent"]');
  var deposit = document.querySelector('input[name="deposit"]');
  saveStatus.textContent = "Ukladám nájomné a zálohu…";
  fetch("/api/rental/admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "setBookingPrice", id: ${JSON.stringify(booking.id)}, price: rent.value, deposit: deposit.value })
  })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (!data.success) throw new Error(data.error);
      document.querySelectorAll('input[name="rent"], input[name="deposit"]').forEach(function (el) { el.defaultValue = el.value; });
      saveStatus.textContent = "✓ Nájomné a záloha uložené k rezervácii";
    })
    .catch(function () {
      saveStatus.textContent = "⚠ Nepodarilo sa uložiť – skontrolujte sumu (napr. 25,00)";
    });
});
// The browser keeps typed values when the page is reloaded; start clean.
window.addEventListener("pageshow", function () {
  document.querySelectorAll("input").forEach(function (el) {
    if (el.type === "checkbox") el.checked = false;
    else el.value = el.defaultValue;
  });
});
// No text cursor on paper.
window.addEventListener("beforeprint", function () {
  if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
});
var first = document.querySelector('input[name="address"]');
if (first) first.focus();
</script>`);
}
