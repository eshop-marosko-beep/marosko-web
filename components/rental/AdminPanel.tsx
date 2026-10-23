"use client";

import { useCallback, useEffect, useState } from "react";

/* Rental admin panel (Slovak only — it's for the shop). Reads everything from
 * GET /api/rental/admin and sends each change as POST { action, ... }. */

type Prices = { day: number; weekend: number; week: number };
type Tool = { slug: string; name: string; prices: Prices; deposit: number; units: number; active: boolean };
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
type State = { tools: Tool[]; groups: Group[]; customers: Customer[]; bookings: Booking[] };

const TABS = [
  ["bookings", "Rezervácie"],
  ["blocks", "Blokované termíny"],
  ["customers", "Zákazníci"],
  ["groups", "Skupiny"],
  ["tools", "Náradie a ceny"],
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
  invalid_customer: "Vyplňte meno a telefón zákazníka (e-mail je nepovinný, ale musí byť platný).",
};

const input = "border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500";
const button = "px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50";

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
    </div>
  );
}

type Act = (payload: Record<string, unknown>, success?: string) => Promise<Record<string, unknown> | null>;

function documentsUrl(id: string) {
  return `/api/rental/admin/documents?id=${encodeURIComponent(id)}`;
}

/** A customer standing at the counter: the booking is confirmed at once and
 * the documents open filled in with what was typed here. */
function ShopBookingForm({ tools, groups, busy, act }: { tools: Tool[]; groups: Group[]; busy: boolean; act: Act }) {
  const empty = { tool: tools[0]?.slug ?? "", from: today(), to: today(), name: "", phone: "", email: "", groupId: "bezny", note: "" };
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
      <label className="text-sm text-gray-700 flex flex-col gap-1">Poznámka
        <input value={form.note} onChange={set("note")} className={input} />
      </label>
      <p className="md:col-span-4 text-xs text-gray-500">
        Adresu a číslo dokladu totožnosti doplníte až v dokladoch – na webe sa neukladajú. Ak má zákazník účet, použije sa skupina z jeho účtu.
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

function ToolRow({ tool, busy, act }: { tool: Tool; busy: boolean; act: Act }) {
  const [t, setT] = useState<Tool>(tool);
  const price = (k: keyof Prices) => (
    <label className="flex flex-col gap-1">{{ day: "1 deň (€)", weekend: "Víkend (€)", week: "7 dní (€)" }[k]}
      <input type="number" min={0} step="0.5" value={t.prices[k]}
        onChange={(e) => setT({ ...t, prices: { ...t.prices, [k]: Number(e.target.value) } })} className={`${input} w-24`} />
    </label>
  );
  return (
    <form className="bg-white rounded-xl shadow p-4 text-sm text-gray-700 space-y-3"
      onSubmit={(e) => { e.preventDefault(); act({ action: "saveTool", ...t }, "Náradie uložené."); }}>
      <p className="font-semibold text-espresso-800 text-base">{t.name}</p>
      <div className="flex flex-wrap gap-3">
        {price("day")}{price("weekend")}{price("week")}
        <label className="flex flex-col gap-1">Plná záloha (€)
          <input type="number" min={0} value={t.deposit} onChange={(e) => setT({ ...t, deposit: Number(e.target.value) })} className={`${input} w-24`} />
        </label>
        <label className="flex flex-col gap-1">Počet kusov
          <input type="number" min={1} max={50} value={t.units} onChange={(e) => setT({ ...t, units: Number(e.target.value) })} className={`${input} w-20`} />
        </label>
      </div>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={t.active} onChange={(e) => setT({ ...t, active: e.target.checked })} />
        Zobrazovať v požičovni
      </label>
      <button type="submit" disabled={busy} className={`${button} bg-amber-600 text-white hover:bg-amber-700`}>Uložiť</button>
    </form>
  );
}

function ToolsTab({ tools, busy, act }: { tools: Tool[]; busy: boolean; act: Act }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Ceny sú plné (s DPH); zľavu a podiel zálohy určuje skupina zákazníka. Nové náradie (napr. tepovač) doplním do webu ja –
        potrebuje fotku a texty v 4 jazykoch.
      </p>
      {tools.map((tool) => <ToolRow key={`${tool.slug}-${JSON.stringify(tool)}`} tool={tool} busy={busy} act={act} />)}
    </div>
  );
}
