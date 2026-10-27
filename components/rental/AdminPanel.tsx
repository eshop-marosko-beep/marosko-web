"use client";

import { useCallback, useEffect, useState } from "react";
import { button, input, LANGS, uploadImage, type Act, type LocaleText } from "@/components/rental/adminUi";
import { ArticlesTab, VideosTab, type AdminArticle, type AdminVideo } from "@/components/rental/GuidesAdmin";

/* Rental admin panel (Slovak only — it's for the shop). Reads everything from
 * GET /api/rental/admin and sends each change as POST { action, ... }. */

type Prices = { day: number; weekend: number; week: number };
type Tool = {
  slug: string;
  name: string;
  /** Added in the admin panel, so it can be deleted (code tools can only be hidden). */
  custom: boolean;
  names: LocaleText;
  descriptions: LocaleText;
  image: string;
  eshopUrl: string;
  value: number | null;
  accessories: string[];
  prices: Prices;
  deposit: number;
  units: number;
  active: boolean;
};
type Group = {
  id: string;
  name: string;
  discountPercent: number;
  depositPercent: number;
  autoConfirm: boolean;
  allowedTools: string[] | null;
};
type Customer = {
  email: string;
  name: string;
  phone: string;
  groupId: string;
  blocked: boolean;
  isAdmin: boolean;
  createdAt: string;
};
type Booking = {
  id: string;
  kind?: "booking" | "block";
  source?: "web" | "shop";
  toolSlug: string;
  email: string;
  name: string;
  phone: string;
  from: string;
  to: string;
  days: number;
  estimatedPrice: number;
  deposit: number;
  groupId?: string;
  note: string;
  status: "pending" | "confirmed" | "declined" | "cancelled";
  createdAt: string;
  contractNo?: string;
};
type State = { tools: Tool[]; groups: Group[]; customers: Customer[]; bookings: Booking[]; videos: AdminVideo[]; articles: AdminArticle[] };

const TABS = [
  ["bookings", "Rezervácie"],
  ["blocks", "Blokované termíny"],
  ["customers", "Zákazníci"],
  ["groups", "Skupiny"],
  ["tools", "Náradie a ceny"],
  ["videos", "Návody – videá"],
  ["articles", "Návody – články"],
] as const;
type Tab = (typeof TABS)[number][0];

const STATUS_LABEL: Record<Booking["status"], string> = {
  pending: "Čaká na potvrdenie",
  confirmed: "Potvrdená",
  declined: "Zamietnutá",
  cancelled: "Zrušená",
};
const STATUS_STYLE: Record<Booking["status"], string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-green-100 text-green-800",
  declined: "bg-gray-200 text-gray-700",
  cancelled: "bg-gray-200 text-gray-700",
};
const ERRORS: Record<string, string> = {
  forbidden: "Nemáte oprávnenie správcu.",
  dates_taken: "V tomto termíne už je rezervácia alebo blokácia. Najprv ju zrušte.",
  invalid_dates: "Neplatný termín.",
  invalid_fields: "Vyplňte prosím názov a kód skupiny.",
  try_again: "Práve prebieha iná rezervácia, skúste to o chvíľu.",
  tool_name: "Vyplňte názov náradia (slovensky).",
  tool_description: "Vyplňte popis náradia (slovensky).",
  tool_image: "Nahrajte fotku náradia.",
  tool_image_upload: "Fotku sa nepodarilo nahrať. Skúste iný obrázok (JPG, PNG alebo WebP).",
  tool_eshop: "Odkaz na e-shop musí začínať https://",
  tool_prices: "Vyplňte cenu za deň, víkend, týždeň a zálohu.",
  tool_units: "Počet kusov musí byť 1 až 50.",
  tool_has_bookings: "Náradie má rezervácie, preto sa nedá odstrániť. Skryte ho – odškrtnite „Zobrazovať v požičovni“.",
  unknown_tool: "Náradie sa nenašlo.",
  guide_title: "Vyplňte nadpis (slovensky).",
  guide_description: "Vyplňte popis (slovensky).",
  guide_body: "Vyplňte text článku (slovensky).",
  guide_image: "Nahrajte fotku.",
  guide_link: "Odkaz musí začínať https:// alebo / (stránka na marosko.sk).",
  guide_youtube: "Vložte odkaz na video z YouTube (napr. https://www.youtube.com/watch?v=…).",
  guide_unknown: "Návod sa nenašiel.",
  invalid_customer: "Vyplňte meno a telefón zákazníka (e-mail je nepovinný, ale musí byť platný).",
};


function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function AdminPanel() {
  const [state, setState] = useState<State | null>(null);
  const [tab, setTab] = useState<Tab>("bookings");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/rental/admin", { cache: "no-store" });
    const data = await res.json();
    if (res.ok && data.success) setState(data as State);
    else setMessage({ ok: false, text: ERRORS[data.error] ?? "Nepodarilo sa načítať údaje." });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const act: Act = async (payload, success = "Uložené.") => {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/rental/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      const ok = res.ok && data.success;
      setMessage(ok ? { ok: true, text: success } : { ok: false, text: ERRORS[data.error] ?? "Akcia sa nepodarila." });
      await load();
      return ok ? data : null;
    } catch {
      setMessage({ ok: false, text: "Akcia sa nepodarila." });
      return null;
    } finally {
      setBusy(false);
    }
  };

  if (!state) return <p className="text-gray-600">{message?.text ?? "Načítavam…"}</p>;

  const toolName = (slug: string) => state.tools.find((t) => t.slug === slug)?.name ?? slug;
  const groupName = (id: string | undefined) => state.groups.find((g) => g.id === id)?.name ?? id ?? "–";
  const pendingCount = state.bookings.filter((b) => b.kind !== "block" && b.status === "pending").length;

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map(([id, label]) => (
          <button key={id} type="button" onClick={() => setTab(id)}
            className={`${button} ${tab === id ? "bg-amber-600 text-white" : "bg-white text-gray-700 border border-gray-300 hover:bg-amber-50"}`}>
            {label}
            {id === "bookings" && pendingCount > 0 && (
              <span className="ml-2 bg-red-600 text-white rounded-full px-2 text-xs">{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      {message && (
        <p className={`mb-4 rounded-lg px-4 py-2 text-sm border ${message.ok ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}>
          {message.text}
        </p>
      )}

      {tab === "bookings" && (
        <>
          <ShopBookingForm tools={state.tools} groups={state.groups} busy={busy} act={act} />
          <BookingsTab bookings={state.bookings.filter((b) => b.kind !== "block")} toolName={toolName}
            groupName={groupName} busy={busy} act={act} />
        </>
      )}
      {tab === "blocks" && (
        <BlocksTab tools={state.tools} blocks={state.bookings.filter((b) => b.kind === "block")}
          toolName={toolName} busy={busy} act={act} />
      )}
      {tab === "customers" && <CustomersTab customers={state.customers} groups={state.groups} busy={busy} act={act} />}
      {tab === "groups" && <GroupsTab groups={state.groups} tools={state.tools} busy={busy} act={act} />}
      {tab === "tools" && <ToolsTab tools={state.tools} busy={busy} act={act} />}
      {tab === "videos" && <VideosTab videos={state.videos} busy={busy} act={act} />}
      {tab === "articles" && <ArticlesTab articles={state.articles} busy={busy} act={act} />}
    </div>
  );
}


function documentsUrl(id: string) {
  return `/api/rental/admin/documents?id=${encodeURIComponent(id)}`;
}

/** A customer standing at the counter: the booking is confirmed at once and
 * the documents open filled in with what was typed here. */
function ShopBookingForm({ tools, groups, busy, act }: { tools: Tool[]; groups: Group[]; busy: boolean; act: Act }) {
  const empty = { tool: tools[0]?.slug ?? "", from: today(), to: today(), name: "", phone: "", email: "", groupId: "bezny", note: "", price: "", deposit: "" };
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [created, setCreated] = useState<string | null>(null);
  const set = (field: keyof typeof empty) => (e: { target: { value: string } }) => setForm({ ...form, [field]: e.target.value });

  if (!open) {
    return (
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => { setOpen(true); setCreated(null); }}
          className={`${button} bg-amber-600 text-white hover:bg-amber-700`}>+ Zákazník v sídle spoločnosti</button>
        {created && (
          <a href={documentsUrl(created)} target="_blank" rel="noopener"
            className={`${button} bg-green-600 text-white hover:bg-green-700`}>Tlačiť doklady k novej rezervácii</a>
        )}
      </div>
    );
  }

  return (
    <form className="bg-white rounded-xl shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-3"
      onSubmit={async (e) => {
        e.preventDefault();
        const data = await act({ action: "addShopBooking", ...form }, "Rezervácia zapísaná a potvrdená.");
        if (data && typeof data.id === "string") {
          setCreated(data.id);
          setForm(empty);
          setOpen(false);
          window.open(documentsUrl(data.id), "_blank", "noopener");
        }
      }}>
      <p className="md:col-span-4 font-semibold text-espresso-800">Zákazník v sídle spoločnosti</p>
      <label className="text-sm text-gray-700 flex flex-col gap-1">Náradie
        <select value={form.tool} onChange={set("tool")} className={input}>
          {tools.map((t) => <option key={t.slug} value={t.slug}>{t.name}</option>)}
        </select>
      </label>
      <label className="text-sm text-gray-700 flex flex-col gap-1">Od
        <input type="date" value={form.from} onChange={set("from")} className={input} required />
      </label>
      <label className="text-sm text-gray-700 flex flex-col gap-1">Do
        <input type="date" value={form.to} min={form.from} onChange={set("to")} className={input} required />
      </label>
      <label className="text-sm text-gray-700 flex flex-col gap-1">Skupina
        <select value={form.groupId} onChange={set("groupId")} className={input}>
          {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
      </label>
      <label className="text-sm text-gray-700 flex flex-col gap-1">Meno a priezvisko
        <input value={form.name} onChange={set("name")} className={input} required />
      </label>
      <label className="text-sm text-gray-700 flex flex-col gap-1">Telefón
        <input type="tel" value={form.phone} onChange={set("phone")} className={input} required />
      </label>
      <label className="text-sm text-gray-700 flex flex-col gap-1">E-mail (nepovinný)
        <input type="email" value={form.email} onChange={set("email")} className={input} />
      </label>
      <label className="text-sm text-gray-700 flex flex-col gap-1">Dohodnuté nájomné € (nepovinné)
        <input inputMode="decimal" value={form.price} onChange={set("price")} placeholder="podľa cenníka" className={input} />
      </label>
      <label className="text-sm text-gray-700 flex flex-col gap-1">Dohodnutá záloha € (nepovinné)
        <input inputMode="decimal" value={form.deposit} onChange={set("deposit")} placeholder="podľa cenníka" className={input} />
      </label>
      <label className="text-sm text-gray-700 flex flex-col gap-1">Poznámka
        <input value={form.note} onChange={set("note")} className={input} />
      </label>
      <p className="md:col-span-4 text-xs text-gray-500">
        Adresu a číslo dokladu totožnosti doplníte až v dokladoch – na webe sa neukladajú. Ak má zákazník účet, použije sa skupina z jeho účtu. Nájomné a zálohu nechajte prázdne, ak platí cenník – v dokladoch sa dajú ešte prepísať.
      </p>
      <div className="md:col-span-4 flex gap-2">
        <button type="submit" disabled={busy} className={`${button} bg-amber-600 text-white hover:bg-amber-700`}>Zapísať a otvoriť doklady</button>
        <button type="button" onClick={() => setOpen(false)} className={`${button} bg-white border border-gray-300 text-gray-700 hover:bg-gray-50`}>Zrušiť</button>
      </div>
    </form>
  );
}

function BookingsTab({
  bookings, toolName, groupName, busy, act,
}: { bookings: Booking[]; toolName: (s: string) => string; groupName: (id?: string) => string; busy: boolean; act: Act }) {
  const [filter, setFilter] = useState<"active" | "all">("active");
  const now = today();
  const shown = bookings.filter((b) => filter === "all" || ((b.status === "pending" || b.status === "confirmed") && b.to >= now));

  return (
    <div>
      <label className="text-sm text-gray-700 mb-3 flex items-center gap-2">
        Zobraziť:
        <select value={filter} onChange={(e) => setFilter(e.target.value as "active" | "all")} className={input}>
          <option value="active">Aktuálne (čakajúce a potvrdené)</option>
          <option value="all">Všetky</option>
        </select>
      </label>
      {shown.length === 0 ? (
        <p className="text-gray-600">Žiadne rezervácie.</p>
      ) : (
        <ul className="space-y-3">
          {shown.map((b) => (
            <li key={b.id} className="bg-white rounded-xl shadow p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="text-sm text-gray-700 space-y-0.5">
                  <p className="font-semibold text-espresso-800 text-base">{toolName(b.toolSlug)}</p>
                  <p>{b.from} – {b.to} ({b.days} d.) · {b.estimatedPrice} € · záloha {b.deposit} €</p>
                  <p>{b.name}{b.email && <> · <a className="underline" href={`mailto:${b.email}`}>{b.email}</a></>} · <a className="underline" href={`tel:${b.phone}`}>{b.phone}</a>
                    {b.source === "shop" && <span className="ml-2 text-xs bg-amber-100 text-amber-800 rounded-full px-2 py-0.5">v sídle spoločnosti</span>}</p>
                  <p className="text-gray-500">Skupina: {groupName(b.groupId)} · vytvorená {b.createdAt.slice(0, 16).replace("T", " ")}
                    {b.contractNo && <> · zmluva č. {b.contractNo}</>}</p>
                  {b.note && <p className="italic">„{b.note}“</p>}
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_STYLE[b.status]}`}>{STATUS_LABEL[b.status]}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {b.status === "pending" && (
                  <>
                    <button type="button" disabled={busy} onClick={() => act({ action: "setBookingStatus", id: b.id, status: "confirmed" }, "Rezervácia potvrdená.")}
                      className={`${button} bg-green-600 text-white hover:bg-green-700`}>Potvrdiť</button>
                    <button type="button" disabled={busy} onClick={() => act({ action: "setBookingStatus", id: b.id, status: "declined" }, "Rezervácia zamietnutá.")}
                      className={`${button} bg-red-600 text-white hover:bg-red-700`}>Zamietnuť</button>
                  </>
                )}
                {(b.status === "pending" || b.status === "confirmed") && (
                  <button type="button" disabled={busy}
                    onClick={() => confirm("Zrušiť rezerváciu a uvoľniť termín?") && act({ action: "setBookingStatus", id: b.id, status: "cancelled" }, "Rezervácia zrušená, termín je voľný.")}
                    className={`${button} bg-white border border-gray-300 text-gray-700 hover:bg-gray-50`}>Zrušiť</button>
                )}
                {b.status === "confirmed" && (
                  <a href={documentsUrl(b.id)} target="_blank" rel="noopener"
                    className={`${button} bg-amber-600 text-white hover:bg-amber-700`}>Tlačiť doklady</a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function BlocksTab({
  tools, blocks, toolName, busy, act,
}: { tools: Tool[]; blocks: Booking[]; toolName: (s: string) => string; busy: boolean; act: Act }) {
  const [tool, setTool] = useState(tools[0]?.slug ?? "");
  const [from, setFrom] = useState(today());
  const [to, setTo] = useState(today());
  const [reason, setReason] = useState("");
  const now = today();
  const active = blocks.filter((b) => b.status === "confirmed" && b.to >= now).sort((a, b) => a.from.localeCompare(b.from));

  return (
    <div className="space-y-6">
      <form className="bg-white rounded-xl shadow p-4 flex flex-wrap items-end gap-3"
        onSubmit={(e) => { e.preventDefault(); act({ action: "addBlock", tool, from, to, reason }, "Termín zablokovaný."); }}>
        <label className="text-sm text-gray-700 flex flex-col gap-1">Náradie
          <select value={tool} onChange={(e) => setTool(e.target.value)} className={input}>
            {tools.map((t) => <option key={t.slug} value={t.slug}>{t.name}</option>)}
          </select>
        </label>
        <label className="text-sm text-gray-700 flex flex-col gap-1">Od
          <input type="date" value={from} min={now} onChange={(e) => setFrom(e.target.value)} className={input} required />
        </label>
        <label className="text-sm text-gray-700 flex flex-col gap-1">Do
          <input type="date" value={to} min={from} onChange={(e) => setTo(e.target.value)} className={input} required />
        </label>
        <label className="text-sm text-gray-700 flex flex-col gap-1 flex-1 min-w-48">Dôvod (vidíte len vy)
          <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="napr. servis, dovolenka" className={input} />
        </label>
        <button type="submit" disabled={busy} className={`${button} bg-amber-600 text-white hover:bg-amber-700`}>Zablokovať</button>
      </form>
      {active.length === 0 ? (
        <p className="text-gray-600">Žiadne zablokované termíny.</p>
      ) : (
        <ul className="space-y-2">
          {active.map((b) => (
            <li key={b.id} className="bg-white rounded-xl shadow p-3 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-700">
              <span><strong>{toolName(b.toolSlug)}</strong> · {b.from} – {b.to}{b.note ? ` · ${b.note}` : ""}</span>
              <button type="button" disabled={busy} onClick={() => act({ action: "setBookingStatus", id: b.id, status: "cancelled" }, "Blokácia zrušená.")}
                className={`${button} bg-white border border-gray-300 text-gray-700 hover:bg-gray-50`}>Odblokovať</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CustomersTab({ customers, groups, busy, act }: { customers: Customer[]; groups: Group[]; busy: boolean; act: Act }) {
  const [search, setSearch] = useState("");
  const q = search.trim().toLowerCase();
  const shown = customers.filter((c) => !q || `${c.name} ${c.email} ${c.phone}`.toLowerCase().includes(q));

  return (
    <div>
      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Hľadať meno, e-mail, telefón…"
        className={`${input} w-full max-w-md mb-4`} />
      <p className="text-sm text-gray-500 mb-3">Spolu {customers.length} zákazníkov.</p>
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-cream-50 text-left">
            <tr><th className="p-3">Zákazník</th><th className="p-3">Kontakt</th><th className="p-3">Skupina</th><th className="p-3">Stav</th></tr>
          </thead>
          <tbody>
            {shown.map((c) => (
              <tr key={c.email} className="border-t border-gray-100">
                <td className="p-3">
                  <p className="font-semibold">{c.name}{c.isAdmin && <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 rounded-full">správca</span>}</p>
                  <p className="text-xs text-gray-500">od {c.createdAt.slice(0, 10)}</p>
                </td>
                <td className="p-3"><p>{c.email}</p><p>{c.phone}</p></td>
                <td className="p-3">
                  <select value={c.groupId} disabled={busy}
                    onChange={(e) => act({ action: "setCustomer", email: c.email, groupId: e.target.value }, "Skupina zmenená.")}
                    className={input}>
                    {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                </td>
                <td className="p-3">
                  {c.isAdmin ? "–" : (
                    <button type="button" disabled={busy}
                      onClick={() => act({ action: "setCustomer", email: c.email, blocked: !c.blocked }, c.blocked ? "Zákazník odblokovaný." : "Zákazník zablokovaný.")}
                      className={`${button} ${c.blocked ? "bg-red-100 text-red-800" : "bg-white border border-gray-300 text-gray-700"}`}>
                      {c.blocked ? "Zablokovaný – odblokovať" : "Aktívny – zablokovať"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const EMPTY_GROUP: Group = { id: "", name: "", discountPercent: 0, depositPercent: 100, autoConfirm: false, allowedTools: null };

function GroupForm({ initial, tools, busy, act, isNew }: { initial: Group; tools: Tool[]; busy: boolean; act: Act; isNew: boolean }) {
  const [g, setG] = useState<Group>(initial);
  const allTools = g.allowedTools === null;
  const toggleTool = (slug: string) => {
    const current = g.allowedTools ?? tools.map((t) => t.slug);
    setG({ ...g, allowedTools: current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug] });
  };

  return (
    <form className="bg-white rounded-xl shadow p-4 space-y-3 text-sm text-gray-700"
      onSubmit={(e) => { e.preventDefault(); act({ action: "saveGroup", group: g }, "Skupina uložená.").then(() => isNew && setG(EMPTY_GROUP)); }}>
      <div className="flex flex-wrap gap-3">
        <label className="flex flex-col gap-1">Názov
          <input value={g.name} onChange={(e) => setG({ ...g, name: e.target.value })} className={input} required />
        </label>
        <label className="flex flex-col gap-1">Kód {isNew && <span className="text-xs text-gray-500">(malé písmená, bez medzier)</span>}
          <input value={g.id} disabled={!isNew} onChange={(e) => setG({ ...g, id: e.target.value })} className={input} required />
        </label>
        <label className="flex flex-col gap-1">Zľava na nájomné (%)
          <input type="number" min={0} max={100} value={g.discountPercent}
            onChange={(e) => setG({ ...g, discountPercent: Number(e.target.value) })} className={`${input} w-24`} />
        </label>
        <label className="flex flex-col gap-1">Záloha (% z plnej)
          <input type="number" min={0} max={100} value={g.depositPercent}
            onChange={(e) => setG({ ...g, depositPercent: Number(e.target.value) })} className={`${input} w-24`} />
        </label>
      </div>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={g.autoConfirm} onChange={(e) => setG({ ...g, autoConfirm: e.target.checked })} />
        Rezervácie potvrdiť automaticky
      </label>
      <div>
        <label className="flex items-center gap-2 mb-1">
          <input type="checkbox" checked={allTools}
            onChange={(e) => setG({ ...g, allowedTools: e.target.checked ? null : tools.map((t) => t.slug) })} />
          Prístup ku všetkému náradiu
        </label>
        {!allTools && (
          <div className="flex flex-wrap gap-3 pl-6">
            {tools.map((t) => (
              <label key={t.slug} className="flex items-center gap-1">
                <input type="checkbox" checked={g.allowedTools?.includes(t.slug) ?? false} onChange={() => toggleTool(t.slug)} />
                {t.name}
              </label>
            ))}
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={busy} className={`${button} bg-amber-600 text-white hover:bg-amber-700`}>
          {isNew ? "Pridať skupinu" : "Uložiť"}
        </button>
        {!isNew && g.id !== "bezny" && (
          <button type="button" disabled={busy}
            onClick={() => confirm(`Zmazať skupinu „${g.name}“? Jej zákazníci prejdú do skupiny Bežný zákazník.`) && act({ action: "deleteGroup", id: g.id }, "Skupina zmazaná.")}
            className={`${button} bg-white border border-gray-300 text-gray-700 hover:bg-gray-50`}>Zmazať</button>
        )}
      </div>
    </form>
  );
}

function GroupsTab({ groups, tools, busy, act }: { groups: Group[]; tools: Tool[]; busy: boolean; act: Act }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Noví zákazníci sa po registrácii zaradia do skupiny <strong>Bežný zákazník</strong>. Do inej skupiny ich preradíte v záložke Zákazníci.
      </p>
      {groups.map((g) => (
        <GroupForm key={`${g.id}-${JSON.stringify(g)}`} initial={g} tools={tools} busy={busy} act={act} isNew={false} />
      ))}
      <h2 className="text-lg font-bold text-espresso-800 pt-4">Nová skupina</h2>
      <GroupForm initial={EMPTY_GROUP} tools={tools} busy={busy} act={act} isNew />
    </div>
  );
}


type ToolForm = {
  slug: string;
  names: LocaleText;
  descriptions: LocaleText;
  image: string;
  eshopUrl: string;
  value: string;
  accessories: string;
  prices: { day: string; weekend: string; week: string };
  deposit: string;
  units: string;
  active: boolean;
};

const NEW_TOOL: ToolForm = {
  slug: "",
  names: { sk: "" },
  descriptions: { sk: "" },
  image: "",
  eshopUrl: "",
  value: "",
  accessories: "",
  prices: { day: "", weekend: "", week: "" },
  deposit: "",
  units: "1",
  active: true,
};

function toForm(tool: Tool): ToolForm {
  return {
    slug: tool.slug,
    names: tool.names,
    descriptions: tool.descriptions,
    image: tool.image,
    eshopUrl: tool.eshopUrl,
    value: tool.value === null ? "" : String(tool.value),
    accessories: tool.accessories.join("\n"),
    prices: { day: String(tool.prices.day), weekend: String(tool.prices.weekend), week: String(tool.prices.week) },
    deposit: String(tool.deposit),
    units: String(tool.units),
    active: tool.active,
  };
}


function ToolEditor({ initial, busy, act, onDone }: { initial: ToolForm; busy: boolean; act: Act; onDone: () => void }) {
  const [f, setF] = useState<ToolForm>(initial);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [showLangs, setShowLangs] = useState(false);
  const isNew = !initial.slug;

  const upload = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const url = await uploadImage(file);
      setF((current) => ({ ...current, image: url }));
    } catch {
      setUploadError(ERRORS.tool_image_upload);
    } finally {
      setUploading(false);
    }
  };

  const price = (k: keyof ToolForm["prices"], label: string) => (
    <label className="flex flex-col gap-1">{label}
      <input inputMode="decimal" value={f.prices[k]} required
        onChange={(e) => setF({ ...f, prices: { ...f.prices, [k]: e.target.value } })} className={`${input} w-24`} />
    </label>
  );

  return (
    <form className="bg-white rounded-xl shadow p-4 text-sm text-gray-700 space-y-4 border-2 border-amber-200"
      onSubmit={async (e) => {
        e.preventDefault();
        const data = await act({
          action: "saveTool",
          ...f,
          accessories: f.accessories.split("\n").map((a) => a.trim()).filter(Boolean),
        }, isNew ? "Náradie pridané do požičovne." : "Náradie uložené.");
        if (data) onDone();
      }}>
      <p className="font-semibold text-espresso-800 text-base">{isNew ? "Nové náradie" : `Upraviť: ${initial.names.sk}`}</p>

      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4">
        <div className="space-y-2">
          <div className="relative w-full aspect-square bg-gray-50 border border-dashed border-gray-300 rounded-lg overflow-hidden flex items-center justify-center">
            {f.image
              ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={f.image} alt="" className="object-contain w-full h-full" />
              : <span className="text-gray-400 text-xs text-center px-2">Zatiaľ bez fotky</span>}
          </div>
          <label className={`${button} block text-center cursor-pointer bg-white border border-gray-300 text-gray-700 hover:bg-gray-50`}>
            {uploading ? "Nahrávam…" : f.image ? "Zmeniť fotku" : "Nahrať fotku"}
            <input type="file" accept="image/*" className="hidden" disabled={uploading}
              onChange={(e) => { upload(e.target.files?.[0]); e.target.value = ""; }} />
          </label>
          {uploadError && <p className="text-red-700 text-xs">{uploadError}</p>}
        </div>

        <div className="space-y-3">
          <label className="flex flex-col gap-1">Názov *
            <input value={f.names.sk} required onChange={(e) => setF({ ...f, names: { ...f.names, sk: e.target.value } })} className={input} />
          </label>
          <label className="flex flex-col gap-1">Popis *
            <textarea value={f.descriptions.sk} required rows={4}
              onChange={(e) => setF({ ...f, descriptions: { ...f.descriptions, sk: e.target.value } })} className={input} />
          </label>
          <button type="button" onClick={() => setShowLangs(!showLangs)} className="text-amber-700 font-semibold hover:underline">
            {showLangs ? "▾" : "▸"} Preklady (CZ, EN, RO) – nepovinné, inak sa zobrazí slovenský text
          </button>
          {showLangs && LANGS.map(([code, label]) => (
            <div key={code} className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-3 border-l-2 border-amber-100">
              <label className="flex flex-col gap-1">Názov {label}
                <input value={f.names[code] ?? ""} onChange={(e) => setF({ ...f, names: { ...f.names, [code]: e.target.value } })} className={input} />
              </label>
              <label className="flex flex-col gap-1">Popis {label}
                <textarea value={f.descriptions[code] ?? ""} rows={2}
                  onChange={(e) => setF({ ...f, descriptions: { ...f.descriptions, [code]: e.target.value } })} className={input} />
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {price("day", "1 deň (€) *")}{price("weekend", "Víkend pi–po (€) *")}{price("week", "7 dní (€) *")}
        <label className="flex flex-col gap-1">Plná záloha (€) *
          <input inputMode="decimal" value={f.deposit} required onChange={(e) => setF({ ...f, deposit: e.target.value })} className={`${input} w-24`} />
        </label>
        <label className="flex flex-col gap-1">Počet kusov *
          <input type="number" min={1} max={50} value={f.units} required onChange={(e) => setF({ ...f, units: e.target.value })} className={`${input} w-20`} />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="flex flex-col gap-1">Odkaz na produkt v e-shope (nepovinné)
          <input type="url" value={f.eshopUrl} placeholder="https://eshop.marosko.sk/p/…"
            onChange={(e) => setF({ ...f, eshopUrl: e.target.value })} className={input} />
          <span className="text-xs text-gray-500">Z e-shopu sa do zmluvy načíta presný názov, kód a cena nového.</span>
        </label>
        <label className="flex flex-col gap-1">Hodnota náradia (€, nepovinné)
          <input inputMode="decimal" value={f.value} onChange={(e) => setF({ ...f, value: e.target.value })} className={`${input} w-32`} />
          <span className="text-xs text-gray-500">Do zmluvy, ak náradie nie je v e-shope.</span>
        </label>
      </div>

      <label className="flex flex-col gap-1">Príslušenstvo do protokolu (každá položka na nový riadok)
        <textarea value={f.accessories} rows={4} onChange={(e) => setF({ ...f, accessories: e.target.value })} className={input} />
      </label>

      <label className="flex items-center gap-2">
        <input type="checkbox" checked={f.active} onChange={(e) => setF({ ...f, active: e.target.checked })} />
        Zobrazovať v požičovni
      </label>

      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={busy || uploading} className={`${button} bg-amber-600 text-white hover:bg-amber-700`}>
          {isNew ? "Pridať náradie" : "Uložiť"}
        </button>
        <button type="button" onClick={onDone} className={`${button} bg-white border border-gray-300 text-gray-700 hover:bg-gray-50`}>Zrušiť</button>
      </div>
    </form>
  );
}

function ToolsTab({ tools, busy, act }: { tools: Tool[]; busy: boolean; act: Act }) {
  const [editing, setEditing] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Ceny sú plné (s DPH); zľavu a podiel zálohy určuje skupina zákazníka. Polia s * sú povinné.
      </p>
      {editing === "" ? (
        <ToolEditor initial={NEW_TOOL} busy={busy} act={act} onDone={() => setEditing(null)} />
      ) : (
        <button type="button" onClick={() => setEditing("")} className={`${button} bg-amber-600 text-white hover:bg-amber-700`}>
          + Pridať náradie
        </button>
      )}
      {tools.map((tool) =>
        editing === tool.slug ? (
          <ToolEditor key={tool.slug} initial={toForm(tool)} busy={busy} act={act} onDone={() => setEditing(null)} />
        ) : (
          <div key={tool.slug} className={`bg-white rounded-xl shadow p-3 flex items-center gap-4 text-sm text-gray-700 ${tool.active ? "" : "opacity-60"}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={tool.image} alt="" className="w-16 h-16 object-contain rounded bg-gray-50 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-espresso-800">{tool.name}{!tool.active && " (skryté)"}</p>
              <p>{tool.prices.day} € deň · {tool.prices.weekend} € víkend · {tool.prices.week} € týždeň · záloha {tool.deposit} € · {tool.units} ks</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-end">
              <button type="button" onClick={() => setEditing(tool.slug)}
                className={`${button} bg-white border border-gray-300 text-gray-700 hover:bg-gray-50`}>Upraviť</button>
              {tool.custom && (
                <button type="button" disabled={busy}
                  onClick={() => confirm(`Odstrániť „${tool.name}“ z požičovne?`) && act({ action: "deleteTool", slug: tool.slug }, "Náradie odstránené.")}
                  className={`${button} bg-white border border-red-300 text-red-700 hover:bg-red-50`}>Odstrániť</button>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
}
