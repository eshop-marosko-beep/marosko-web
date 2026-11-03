"use client";

import { useCallback, useEffect, useState } from "react";
import { button, input } from "@/components/rental/adminUi";

/* Posting the shop's own videos and eshop product photos to TikTok. The form follows TikTok's
 * Content Posting API UX rules: show the connected creator, privacy chosen
 * by the user (no default), interaction toggles off by default and disabled
 * when the creator turned them off, commercial content disclosure, and the
 * consent line before posting. */

type Creator = {
  creator_avatar_url: string;
  creator_username: string;
  creator_nickname: string;
  privacy_level_options: string[];
  comment_disabled: boolean;
  duet_disabled: boolean;
  stitch_disabled: boolean;
  max_video_post_duration_sec: number;
};

type Video = { title: string; url: string; poster: string };

type Product = { id: string; title: string; link: string; shortLink: string; images: string[]; price: string };

type State = {
  configured: boolean;
  connected: boolean;
  user?: { display_name: string; avatar_url: string };
  creator?: Creator;
  videos: Video[];
};

const PRIVACY: Record<string, string> = {
  PUBLIC_TO_EVERYONE: "Verejné (všetci)",
  MUTUAL_FOLLOW_FRIENDS: "Priatelia (vzájomní sledujúci)",
  FOLLOWER_OF_CREATOR: "Sledujúci",
  SELF_ONLY: "Len ja (súkromné)",
};

const ERRORS: Record<string, string> = {
  not_configured: "Na serveri chýbajú TIKTOK_CLIENT_KEY a TIKTOK_CLIENT_SECRET.",
  forbidden: "Na toto treba byť prihlásený ako administrátor.",
  bad_state: "Prihlásenie vypršalo alebo bolo prerušené. Skúste to znova.",
  access_denied: "Prihlásenie do TikToku bolo zrušené.",
  login_failed: "Prihlásenie do TikToku sa nepodarilo.",
  token_failed: "TikTok neprijal prihlásenie (skontrolujte Client key/secret a Redirect URI).",
  mute_unavailable: "Bez zvuku sa dá poslať len video vybrané zo zoznamu videí webu.",
  bad_video_url: "Video musí byť na adrese marosko.sk (overená doména).",
  bad_photo_url: "Fotky musia byť z eshop.marosko.sk (…/files/…jpg, png alebo webp).",
  photos_required: "Vyberte aspoň jednu fotku.",
  too_many_photos: "TikTok berie najviac 35 fotiek v jednom príspevku.",
  unknown_product: "Produkt sa v eshope nenašiel.",
  description_too_long: "Popis je dlhší ako 4000 znakov.",
  privacy_required: "Vyberte, kto uvidí video.",
  spam_risk_too_many_posts: "TikTok dočasne nepovoľuje ďalšie príspevky (príliš veľa za deň).",
  spam_risk_user_banned_from_posting: "Tento účet má od TikToku zakázané zverejňovanie.",
  privacy_level_option_mismatch: "Zvolené súkromie TikTok pre tento účet nepovoľuje.",
  unaudited_client_can_only_post_to_private_accounts:
    "Kým TikTok aplikáciu neschváli, dá sa zverejňovať len ako „Len ja (súkromné)“ a účet musí byť súkromný.",
  url_ownership_unverified: "Doména videa nie je v TikTok aplikácii overená.",
  access_token_invalid: "Prepojenie s TikTokom vypršalo. Prepojte účet znova.",
  scope_not_authorized: "Účet nedal aplikácii potrebné povolenia. Prepojte ho znova.",
};

function errorText(code?: string, message?: string) {
  return (code && ERRORS[code]) || message || code || "Akcia sa nepodarila.";
}

export default function TikTokAdmin() {
  const [state, setState] = useState<State | null>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [kind, setKind] = useState<"video" | "photo">("video");

  const [videoUrl, setVideoUrl] = useState("");
  const [title, setTitle] = useState("");
  const [direct, setDirect] = useState(true);
  const [mute, setMute] = useState(false);
  const [privacy, setPrivacy] = useState("");
  const [allowComment, setAllowComment] = useState(false);
  const [allowDuet, setAllowDuet] = useState(false);
  const [allowStitch, setAllowStitch] = useState(false);
  const [commercial, setCommercial] = useState(false);
  const [yourBrand, setYourBrand] = useState(false);
  const [branded, setBranded] = useState(false);
  const [publishId, setPublishId] = useState("");
  const [status, setStatus] = useState("");

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [extraPhotos, setExtraPhotos] = useState("");
  const [cover, setCover] = useState(0);
  const [description, setDescription] = useState("");
  const [addLink, setAddLink] = useState(true);
  const [autoMusic, setAutoMusic] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch("/api/tiktok", { cache: "no-store" });
    const data = await res.json();
    if (res.ok && data.success) setState(data as State);
    else setMessage({ ok: false, text: errorText(data.error, data.message) });
  }, []);

  useEffect(() => {
    (async () => {
      await load();
      // Result of the TikTok login (see /api/tiktok/callback), shown once.
      const params = new URLSearchParams(window.location.search);
      const error = params.get("error");
      if (error) setMessage({ ok: false, text: errorText(error) });
      else if (params.get("connected")) setMessage({ ok: true, text: "TikTok účet je prepojený." });
      if (error || params.get("connected")) window.history.replaceState(null, "", window.location.pathname);
    })();
  }, [load]);

  async function post(payload: Record<string, unknown>) {
    const res = await fetch("/api/tiktok", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(errorText(data.error, data.message));
    return data;
  }

  async function checkStatus(id: string) {
    try {
      const data = await post({ action: "status", publishId: id });
      setStatus(data.fail_reason ? `${data.status} – ${data.fail_reason}` : data.status);
    } catch (e) {
      setStatus((e as Error).message);
    }
  }

  async function search() {
    setBusy(true);
    try {
      const data = await post({ action: "products", q: query });
      setResults(data.products);
      if (!data.products.length) setMessage({ ok: false, text: "Žiadny produkt sa nenašiel." });
      else setMessage(null);
    } catch (e) {
      setMessage({ ok: false, text: (e as Error).message });
    } finally {
      setBusy(false);
    }
  }

  function chooseProduct(p: Product) {
    setProduct(p);
    setPhotos(p.images);
    setCover(0);
    setTitle(p.title.slice(0, 90));
    setResults([]);
  }

  const photoList = [
    ...photos,
    ...extraPhotos.split(/\s+/).map((u) => u.trim()).filter(Boolean),
  ];
  const coverIndex = cover < photoList.length ? cover : 0;

  async function submit() {
    setBusy(true);
    setMessage(null);
    setStatus("");
    try {
      const shared = {
        direct,
        privacyLevel: privacy,
        disableComment: !allowComment,
        brandOrganic: commercial && yourBrand,
        brandContent: commercial && branded,
      };
      const data = kind === "photo"
        ? await post({
            action: "photo",
            ...shared,
            productId: product?.id ?? "",
            photoUrls: photoList,
            coverIndex,
            title,
            description,
            addLink,
            autoAddMusic: autoMusic,
          })
        : await post({
        action: "post",
        videoUrl,
        mute,
        title,
        direct,
        privacyLevel: privacy,
        disableComment: !allowComment,
        disableDuet: !allowDuet,
        disableStitch: !allowStitch,
        brandOrganic: commercial && yourBrand,
        brandContent: commercial && branded,
      });
      setPublishId(data.publishId);
      setMessage({
        ok: true,
        text: direct
          ? `${kind === "photo" ? "Fotky sa odoslali" : "Video sa odoslalo"} na TikTok. Spracovanie môže trvať niekoľko minút.`
          : `${kind === "photo" ? "Fotky sa odoslali" : "Video sa odoslalo"} do TikToku ako koncept. Dokončite ${kind === "photo" ? "príspevok" : "ho"} v aplikácii TikTok (upozornenie v schránke).`,
      });
      setTimeout(() => checkStatus(data.publishId), 5000);
    } catch (e) {
      setMessage({ ok: false, text: (e as Error).message });
    } finally {
      setBusy(false);
    }
  }

  async function disconnect() {
    if (!confirm("Naozaj odpojiť TikTok účet?")) return;
    setBusy(true);
    try {
      await post({ action: "disconnect" });
      setMessage({ ok: true, text: "TikTok účet bol odpojený." });
      await load();
    } catch (e) {
      setMessage({ ok: false, text: (e as Error).message });
    } finally {
      setBusy(false);
    }
  }

  if (!state) return <p className="text-gray-600">{message?.text ?? "Načítavam…"}</p>;

  const creator = state.creator;
  const brandedNeedsPublic = commercial && branded && privacy === "SELF_ONLY";
  const hasMedia = kind === "photo" ? photoList.length > 0 && photoList.length <= 35 : Boolean(videoUrl);
  const canPost =
    !busy && hasMedia && (!direct || (privacy && !brandedNeedsPublic && (!commercial || yourBrand || branded)));

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
          <button type="button" onClick={() => window.location.assign("/api/tiktok/login")}
            className={`${button} bg-black text-white hover:bg-gray-800`}>
            Prihlásiť sa cez TikTok
          </button>
        )}
        {state.connected && creator && (
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={creator.creator_avatar_url} alt="" className="h-12 w-12 rounded-full" />
            <div className="flex-1">
              <p className="font-semibold">{creator.creator_nickname}</p>
              <p className="text-sm text-gray-600">@{creator.creator_username}</p>
            </div>
            <button type="button" disabled={busy} onClick={disconnect} className={`${button} border border-gray-300 hover:bg-gray-50`}>
              Odpojiť
            </button>
          </div>
        )}
      </section>

      {state.connected && creator && (
        <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h2 className="font-bold text-lg">{kind === "photo" ? "Nové fotky" : "Nové video"}</h2>
            <div className="flex gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input type="radio" checked={kind === "video"} onChange={() => setKind("video")} /> Video
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" checked={kind === "photo"} onChange={() => setKind("photo")} /> Fotky z eshopu
              </label>
            </div>
          </div>

          {kind === "photo" && (
            <>
              <div className="text-sm">
                <span className="font-semibold">Produkt</span>
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
                  <p className="mt-2">
                    Vybraný: <a className="underline" href={product.link} target="_blank" rel="noopener noreferrer">{product.title}</a>{" "}
                    <button type="button" className="text-gray-500 underline ml-2" onClick={() => { setProduct(null); setPhotos([]); }}>
                      zrušiť
                    </button>
                  </p>
                )}
              </div>

              {photos.length > 0 && (
                <div className="text-sm">
                  <span className="font-semibold">Fotky produktu</span>{" "}
                  <span className="text-gray-500">(kliknutím odoberiete)</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {photos.map((u) => (
                      <button type="button" key={u} title="Odobrať" onClick={() => setPhotos(photos.filter((x) => x !== u))}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={u} alt="" className="h-24 w-24 object-contain border border-gray-200 rounded" />
                      </button>
                    ))}
                  </div>
                  {product && photos.length < product.images.length && (
                    <button type="button" className="underline text-gray-600 mt-1" onClick={() => setPhotos(product.images)}>
                      vrátiť všetky fotky
                    </button>
                  )}
                </div>
              )}

              <label className="block text-sm">
                <span className="font-semibold">Ďalšie fotky</span>{" "}
                <span className="text-gray-500">(adresy z eshop.marosko.sk, každá na nový riadok)</span>
                <textarea className={`${input} w-full mt-1`} rows={2} value={extraPhotos}
                  onChange={(e) => setExtraPhotos(e.target.value)} placeholder="https://eshop.marosko.sk/files/….jpg" />
              </label>

              {photoList.length > 1 && (
                <label className="block text-sm">
                  <span className="font-semibold">Titulná fotka</span>
                  <select className={`${input} w-full mt-1`} value={coverIndex} onChange={(e) => setCover(Number(e.target.value))}>
                    {photoList.map((u, i) => (
                      <option key={`${i}-${u}`} value={i}>{i + 1}. {u.split("/").pop()}</option>
                    ))}
                  </select>
                </label>
              )}
              <p className="text-xs text-gray-500">
                {photoList.length} / 35 fotiek. Na TikTok sa pošlú cez www.marosko.sk ako JPEG (najviac 1080 px).
              </p>
            </>
          )}

          {kind === "video" && (<>
          <label className="block text-sm">
            <span className="font-semibold">Video</span>
            <select className={`${input} w-full mt-1`} value={state.videos.some((v) => v.url === videoUrl) ? videoUrl : ""}
              onChange={(e) => setVideoUrl(e.target.value)}>
              <option value="">– vyberte video z webu –</option>
              {state.videos.map((v) => (
                <option key={v.url} value={v.url}>{v.title}</option>
              ))}
            </select>
            <input className={`${input} w-full mt-2`} placeholder="alebo adresa videa https://www.marosko.sk/…mp4"
              value={videoUrl} onChange={(e) => setVideoUrl(e.target.value.trim())} />
          </label>
          {videoUrl && (
            <video src={videoUrl} controls muted={mute} className="max-h-80 rounded-lg bg-black" />
          )}
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={mute} onChange={(e) => setMute(e.target.checked)} />
            Bez zvuku (pôvodný zvuk videa sa odstráni)
          </label>
          <p className="text-xs text-gray-500">
            Maximálna dĺžka videa pre tento účet: {Math.round(creator.max_video_post_duration_sec / 60)} min.
          </p>
          </>)}

          <div className="flex gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input type="radio" checked={direct} onChange={() => setDirect(true)} /> Zverejniť priamo
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" checked={!direct} onChange={() => setDirect(false)} /> Poslať ako koncept do appky
            </label>
          </div>

          {kind === "photo" && (
            <>
              <label className="block text-sm">
                <span className="font-semibold">Nadpis</span>
                <input className={`${input} w-full mt-1`} maxLength={90} value={title} onChange={(e) => setTitle(e.target.value)} />
              </label>
              <label className="block text-sm">
                <span className="font-semibold">Popis</span>
                <textarea className={`${input} w-full mt-1`} rows={4} maxLength={3900} value={description}
                  onChange={(e) => setDescription(e.target.value)} placeholder="#rezba #drevo …" />
              </label>
              {product && (
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={addLink} onChange={(e) => setAddLink(e.target.checked)} />
                  Pridať na koniec popisu „🛒 {product.shortLink}“ (TikTok odkazy v popise nerobí klikateľné)
                </label>
              )}
            </>
          )}

          {direct && (
            <>
              {kind === "video" && (
              <label className="block text-sm">
                <span className="font-semibold">Popis</span>
                <textarea className={`${input} w-full mt-1`} rows={4} maxLength={2200} value={title}
                  onChange={(e) => setTitle(e.target.value)} placeholder="#nastroje #rezba …" />
              </label>
              )}

              <label className="block text-sm">
                <span className="font-semibold">Kto uvidí {kind === "photo" ? "príspevok" : "video"}</span>
                <select className={`${input} w-full mt-1`} value={privacy} onChange={(e) => setPrivacy(e.target.value)}>
                  <option value="">– vyberte –</option>
                  {creator.privacy_level_options.map((p) => (
                    <option key={p} value={p} disabled={commercial && branded && p === "SELF_ONLY"}>
                      {PRIVACY[p] ?? p}
                    </option>
                  ))}
                </select>
              </label>

              <fieldset className="text-sm space-y-1">
                <legend className="font-semibold mb-1">Povoliť ostatným</legend>
                <label className="flex items-center gap-2">
                  <input type="checkbox" disabled={creator.comment_disabled} checked={allowComment && !creator.comment_disabled}
                    onChange={(e) => setAllowComment(e.target.checked)} /> Komentáre
                </label>
                {kind === "video" && (<>
                <label className="flex items-center gap-2">
                  <input type="checkbox" disabled={creator.duet_disabled} checked={allowDuet && !creator.duet_disabled}
                    onChange={(e) => setAllowDuet(e.target.checked)} /> Duet
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" disabled={creator.stitch_disabled} checked={allowStitch && !creator.stitch_disabled}
                    onChange={(e) => setAllowStitch(e.target.checked)} /> Stitch
                </label>
                </>)}
              </fieldset>

              {kind === "photo" && (
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={autoMusic} onChange={(e) => setAutoMusic(e.target.checked)} />
                  Automaticky pridať hudbu od TikToku
                </label>
              )}

              <fieldset className="text-sm space-y-1">
                <label className="flex items-center gap-2 font-semibold">
                  <input type="checkbox" checked={commercial} onChange={(e) => setCommercial(e.target.checked)} />
                  Komerčný obsah (propagácia značky, produktu alebo služby)
                </label>
                {commercial && (
                  <div className="pl-6 space-y-1">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={yourBrand} onChange={(e) => setYourBrand(e.target.checked)} />
                      Vaša značka – propagujete vlastný obchod (označí sa „Propagačný obsah“)
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={branded} onChange={(e) => setBranded(e.target.checked)} />
                      Značkový obsah – spolupráca s inou značkou (označí sa „Platené partnerstvo“)
                    </label>
                    {!yourBrand && !branded && <p className="text-amber-700">Vyberte aspoň jednu možnosť.</p>}
                    {brandedNeedsPublic && <p className="text-red-700">Značkový obsah nemôže byť súkromný.</p>}
                  </div>
                )}
              </fieldset>
            </>
          )}

          <p className="text-xs text-gray-600">
            Odoslaním súhlasíte s{" "}
            {commercial && branded && (
              <>
                <a className="underline" href="https://www.tiktok.com/legal/page/global/bc-policy/en" target="_blank" rel="noopener noreferrer">
                  Branded Content Policy
                </a>{" "}
                a{" "}
              </>
            )}
            <a className="underline" href="https://www.tiktok.com/legal/page/global/music-usage-confirmation/en" target="_blank" rel="noopener noreferrer">
              Music Usage Confirmation
            </a>{" "}
            TikToku. Spracovanie {kind === "photo" ? "príspevku" : "videa"} po odoslaní môže trvať niekoľko minút.
          </p>

          <button type="button" disabled={!canPost} onClick={submit} className={`${button} bg-amber-600 text-white hover:bg-amber-700`}>
            {busy ? "Odosielam…" : direct ? "Zverejniť na TikTok" : "Poslať do TikToku"}
          </button>

          {publishId && (
            <div className="text-sm text-gray-700">
              Stav: <strong>{status || "spracúva sa…"}</strong>{" "}
              <button type="button" onClick={() => checkStatus(publishId)} className="underline ml-2">obnoviť</button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
