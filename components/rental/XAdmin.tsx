"use client";

import { useCallback, useEffect, useState } from "react";
import { button, input } from "@/components/rental/adminUi";

/* Posting to the shop's X account: text, up to 4 eshop product photos, an
 * optional product link, and replies to an earlier post (threads). */

type Product = { id: string; title: string; link: string; shortLink: string; images: string[]; price: string };

type State = {
  configured: boolean;
  connected: boolean;
  user?: { name: string; username: string; profile_image_url?: string };
};

type Posted = { id: string; url: string; text: string };

const MAX_PHOTOS = 4;

const ERRORS: Record<string, string> = {
  not_configured: "Na serveri chýbajú X_CLIENT_ID a X_CLIENT_SECRET.",
  forbidden: "Na toto treba byť prihlásený ako administrátor.",
  bad_state: "Prihlásenie vypršalo alebo bolo prerušené. Skúste to znova.",
  access_denied: "Prihlásenie do X bolo zrušené.",
  login_failed: "Prihlásenie do X sa nepodarilo.",
  token_failed: "X neprijal prihlásenie (skontrolujte Client ID/Secret a Callback URI).",
  bad_photo_url: "Fotky musia byť z eshop.marosko.sk (…/files/…jpg, png alebo webp).",
  too_many_photos: "X berie najviac 4 fotky v jednom príspevku.",
  photo_fetch_failed: "Niektorú fotku sa nepodarilo načítať.",
  unknown_product: "Produkt sa v eshope nenašiel.",
  text_required: "Napíšte text alebo pridajte fotku.",
  bad_reply_to: "Odpoveď na: zadajte číslo príspevku alebo jeho adresu.",
  unauthorized: "Prepojenie s X vypršalo. Prepojte účet znova.",
  payment_required: "X API pre túto aplikáciu nemá kredit / platený prístup (developer.x.com → Billing).",
  x_forbidden: "X príspevok odmietol (napr. duplicitný text alebo chýbajúce povolenie aplikácie Read and write).",
  rate_limited: "X dočasne nepovoľuje ďalšie príspevky (limit). Skúste neskôr.",
};

function errorText(code?: string, message?: string) {
  const known = code && ERRORS[code];
  if (known && message && message !== code) return `${known} (${message})`;
  return known || message || code || "Akcia sa nepodarila.";
}

/** Approximate X length: links count 23, emoji and CJK 2. */
function weightedLength(text: string): number {
  const urls = text.match(/https?:\/\/\S+/g) ?? [];
  let length = urls.length * 23;
  for (const ch of text.replace(/https?:\/\/\S+/g, "")) {
    const cp = ch.codePointAt(0) ?? 0;
    length += cp <= 0x10ff || (cp >= 0x2000 && cp <= 0x201f) ? 1 : 2;
  }
  return length;
}

function postId(value: string): string {
  const trimmed = value.trim();
  return /\/status\/(\d+)/.exec(trimmed)?.[1] ?? trimmed;
}

export default function XAdmin() {
  const [state, setState] = useState<State | null>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const [text, setText] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [addLink, setAddLink] = useState(true);
  const [photos, setPhotos] = useState<string[]>([]);
  const [extraPhotos, setExtraPhotos] = useState("");
  const [replyTo, setReplyTo] = useState("");
  const [posted, setPosted] = useState<Posted[]>([]);

  const load = useCallback(async () => {
    const res = await fetch("/api/x", { cache: "no-store" });
    const data = await res.json();
    if (res.ok && data.success) setState(data as State);
    else setMessage({ ok: false, text: errorText(data.error, data.message) });
  }, []);

  useEffect(() => {
    (async () => {
      await load();
      // Result of the X login (see /api/x/callback), shown once.
      const params = new URLSearchParams(window.location.search);
      const error = params.get("error");
      if (error) setMessage({ ok: false, text: errorText(error) });
      else if (params.get("connected")) setMessage({ ok: true, text: "X účet je prepojený." });
      if (error || params.get("connected")) window.history.replaceState(null, "", window.location.pathname);
    })();
  }, [load]);

  async function post(payload: Record<string, unknown>) {
    const res = await fetch("/api/x", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(errorText(data.error, data.message));
    return data;
  }

  async function search() {
    setBusy(true);
    try {
      const data = await post({ action: "products", q: query });
      setResults(data.products);
      setMessage(data.products.length ? null : { ok: false, text: "Žiadny produkt sa nenašiel." });
    } catch (e) {
      setMessage({ ok: false, text: (e as Error).message });
    } finally {
      setBusy(false);
    }
  }

  function chooseProduct(p: Product) {
    setProduct(p);
    setPhotos(p.images.slice(0, 1));
    setResults([]);
  }

  function togglePhoto(url: string) {
    setPhotos((list) => (list.includes(url) ? list.filter((u) => u !== url) : [...list, url]));
  }

  const photoList = [...photos, ...extraPhotos.split(/\s+/).map((u) => u.trim()).filter(Boolean)];
  const finalText = product && addLink && !text.includes(product.link) ? (text ? `${text}\n\n${product.link}` : product.link) : text;
  const length = weightedLength(finalText);

  async function submit() {
    setBusy(true);
    setMessage(null);
    try {
      const data = await post({
        action: "post",
        text,
        productId: product?.id ?? "",
        addLink,
        photoUrls: photoList,
        replyTo: replyTo ? postId(replyTo) : "",
      });
      setPosted((list) => [{ id: data.id, url: data.url, text: data.text }, ...list]);
      setMessage({ ok: true, text: "Príspevok je zverejnený na X." });
      setText("");
      setReplyTo("");
    } catch (e) {
      setMessage({ ok: false, text: (e as Error).message });
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Naozaj zmazať tento príspevok z X?")) return;
    setBusy(true);
    try {
      await post({ action: "delete", id });
      setPosted((list) => list.filter((p) => p.id !== id));
      setMessage({ ok: true, text: "Príspevok bol zmazaný." });
    } catch (e) {
      setMessage({ ok: false, text: (e as Error).message });
    } finally {
      setBusy(false);
    }
  }

  async function disconnect() {
    if (!confirm("Naozaj odpojiť X účet?")) return;
    setBusy(true);
    try {
      await post({ action: "disconnect" });
      setMessage({ ok: true, text: "X účet bol odpojený." });
      await load();
    } catch (e) {
      setMessage({ ok: false, text: (e as Error).message });
    } finally {
      setBusy(false);
    }
  }

  if (!state) return <p className="text-gray-600">{message?.text ?? "Načítavam…"}</p>;

  const canPost = !busy && (finalText.trim() || photoList.length) && photoList.length <= MAX_PHOTOS;

  return (
    <div className="space-y-6">
      {message && (
        <p className={`rounded-lg px-4 py-2 text-sm border ${message.ok ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}>
          {message.text}
        </p>
      )}

      <section className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-bold text-lg mb-3">Účet</h2>
        {!state.configured && <p className="text-sm text-red-700">{ERRORS.not_configured}</p>}
        {state.configured && !state.connected && (
          <button type="button" onClick={() => window.location.assign("/api/x/login")}
            className={`${button} bg-black text-white hover:bg-gray-800`}>
            Prihlásiť sa cez X
          </button>
        )}
        {state.connected && state.user && (
          <div className="flex items-center gap-3">
            {state.user.profile_image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={state.user.profile_image_url} alt="" className="h-12 w-12 rounded-full" />
            )}
            <div className="flex-1">
              <p className="font-semibold">{state.user.name}</p>
              <a className="text-sm text-gray-600 underline" href={`https://x.com/${state.user.username}`} target="_blank" rel="noopener noreferrer">
                @{state.user.username}
              </a>
            </div>
            <button type="button" disabled={busy} onClick={disconnect} className={`${button} border border-gray-300 hover:bg-gray-50`}>
              Odpojiť
            </button>
          </div>
        )}
      </section>

      {state.connected && (
        <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-bold text-lg">Nový príspevok</h2>

          <div className="text-sm">
            <span className="font-semibold">Produkt z eshopu</span> <span className="text-gray-500">(nepovinné)</span>
            <form className="flex gap-2 mt-1" onSubmit={(e) => { e.preventDefault(); search(); }}>
              <input className={`${input} flex-1`} placeholder="hľadať v eshope, napr. arbortech" value={query}
                onChange={(e) => setQuery(e.target.value)} />
              <button type="submit" disabled={busy || !query.trim()} className={`${button} border border-gray-300 hover:bg-gray-50`}>
                Hľadať
              </button>
            </form>
            {results.length > 0 && (
              <ul className="mt-2 border border-gray-200 rounded-lg divide-y max-h-72 overflow-y-auto">
                {results.map((p) => (
                  <li key={p.id}>
                    <button type="button" onClick={() => chooseProduct(p)} className="flex items-center gap-3 w-full text-left p-2 hover:bg-gray-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {p.images[0] && <img src={p.images[0]} alt="" className="h-10 w-10 object-contain" />}
                      <span className="flex-1">{p.title}</span>
                      <span className="text-gray-500 whitespace-nowrap">{p.price}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {product && (
              <>
                <p className="mt-2">
                  Vybraný: <a className="underline" href={product.link} target="_blank" rel="noopener noreferrer">{product.title}</a>{" "}
                  <button type="button" className="text-gray-500 underline ml-2" onClick={() => { setProduct(null); setPhotos([]); }}>
                    zrušiť
                  </button>
                </p>
                <label className="flex items-center gap-2 mt-1">
                  <input type="checkbox" checked={addLink} onChange={(e) => setAddLink(e.target.checked)} />
                  Pridať na koniec odkaz na produkt
                </label>
                <p className="mt-2 text-gray-500">Fotky produktu (kliknutím vyberiete, najviac 4):</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {product.images.map((u) => (
                    <button type="button" key={u} onClick={() => togglePhoto(u)}
                      className={`rounded border-2 ${photos.includes(u) ? "border-amber-500" : "border-transparent opacity-60"}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={u} alt="" className="h-20 w-20 object-contain" />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <label className="block text-sm">
            <span className="font-semibold">Ďalšie fotky</span>{" "}
            <span className="text-gray-500">(adresy z eshop.marosko.sk, každá na nový riadok)</span>
            <textarea className={`${input} w-full mt-1`} rows={2} value={extraPhotos}
              onChange={(e) => setExtraPhotos(e.target.value)} placeholder="https://eshop.marosko.sk/files/….jpg" />
          </label>
          <p className={`text-xs ${photoList.length > MAX_PHOTOS ? "text-red-700" : "text-gray-500"}`}>
            {photoList.length} / {MAX_PHOTOS} fotiek.
          </p>

          <label className="block text-sm">
            <span className="font-semibold">Text</span>
            <textarea className={`${input} w-full mt-1`} rows={5} value={text} onChange={(e) => setText(e.target.value)}
              placeholder="Nový nástroj na rezbu… #rezba #drevo" />
          </label>
          <p className={`text-xs ${length > 280 ? "text-amber-700" : "text-gray-500"}`}>
            {length} / 280 znakov{product && addLink ? " (vrátane odkazu, ten sa počíta ako 23)" : ""}.
            {length > 280 && " Dlhší text prejde len s X Premium."}
          </p>

          <label className="block text-sm">
            <span className="font-semibold">Odpoveď na príspevok</span>{" "}
            <span className="text-gray-500">(nepovinné – adresa alebo číslo príspevku, na vlákno)</span>
            <input className={`${input} w-full mt-1`} value={replyTo} onChange={(e) => setReplyTo(e.target.value)}
              placeholder="https://x.com/…/status/123…" />
          </label>

          <button type="button" disabled={!canPost} onClick={submit} className={`${button} bg-amber-600 text-white hover:bg-amber-700`}>
            {busy ? "Odosielam…" : "Zverejniť na X"}
          </button>

          {posted.length > 0 && (
            <ul className="text-sm space-y-2 border-t pt-3">
              {posted.map((p) => (
                <li key={p.id} className="flex items-start gap-3">
                  <a className="flex-1 underline whitespace-pre-line" href={p.url} target="_blank" rel="noopener noreferrer">{p.text}</a>
                  <button type="button" className="text-gray-600 underline" onClick={() => setReplyTo(p.url)}>odpovedať</button>
                  <button type="button" disabled={busy} className="text-red-700 underline" onClick={() => remove(p.id)}>zmazať</button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
