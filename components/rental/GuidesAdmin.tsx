"use client";

import { useState } from "react";
import { button, input, LANGS, uploadImage, type Act, type LocaleText } from "@/components/rental/adminUi";

/* Admin tabs for /navody: videos (YouTube links added here, plus the ones
 * from code) and simple written articles. Slovak only, like the rest of
 * the admin panel. */

export type AdminVideo = {
  slug: string;
  custom: boolean;
  source: "file" | "youtube";
  youtubeId?: string;
  poster: string;
  titles: LocaleText;
  descriptions: LocaleText;
  linkUrl: string;
  linkUrlByLocale: Record<string, string>;
  active: boolean;
};

export type AdminArticle = {
  slug: string;
  titles: LocaleText;
  descriptions: LocaleText;
  bodies: LocaleText;
  image: string;
  ctaUrl: string;
  active: boolean;
  createdAt: string;
};

const SITE = "https://www.marosko.sk";

function PhotoPicker({ image, onChange, emptyLabel }: { image: string; onChange: (url: string) => void; emptyLabel: string }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  return (
    <div className="space-y-2">
      <div className="relative w-full aspect-video bg-gray-50 border border-dashed border-gray-300 rounded-lg overflow-hidden flex items-center justify-center">
        {image
          ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={image} alt="" className="object-contain w-full h-full" />
          : <span className="text-gray-400 text-xs text-center px-2">{emptyLabel}</span>}
      </div>
      <label className={`${button} block text-center cursor-pointer bg-white border border-gray-300 text-gray-700 hover:bg-gray-50`}>
        {uploading ? "Nahrávam…" : image ? "Zmeniť fotku" : "Nahrať fotku"}
        <input type="file" accept="image/*" className="hidden" disabled={uploading}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file) return;
            setUploading(true);
            setError("");
            try {
              onChange(await uploadImage(file));
            } catch {
              setError("Fotku sa nepodarilo nahrať. Skúste iný obrázok (JPG, PNG alebo WebP).");
            } finally {
              setUploading(false);
            }
          }} />
      </label>
      {error && <p className="text-red-700 text-xs">{error}</p>}
    </div>
  );
}

/** Title + description (+ optional body) in Slovak, with translations folded away. */
function TextFields({
  titles, descriptions, bodies, onTitles, onDescriptions, onBodies, descriptionLabel,
}: {
  titles: LocaleText;
  descriptions: LocaleText;
  bodies?: LocaleText;
  onTitles: (t: LocaleText) => void;
  onDescriptions: (t: LocaleText) => void;
  onBodies?: (t: LocaleText) => void;
  descriptionLabel: string;
}) {
  const [showLangs, setShowLangs] = useState(false);
  return (
    <div className="space-y-3">
      <label className="flex flex-col gap-1">Nadpis *
        <input value={titles.sk} required onChange={(e) => onTitles({ ...titles, sk: e.target.value })} className={input} />
      </label>
      <label className="flex flex-col gap-1">{descriptionLabel} *
        <textarea value={descriptions.sk} required rows={3} onChange={(e) => onDescriptions({ ...descriptions, sk: e.target.value })} className={input} />
      </label>
      {bodies && onBodies && (
        <label className="flex flex-col gap-1">Text článku *
          <textarea value={bodies.sk} required rows={14} onChange={(e) => onBodies({ ...bodies, sk: e.target.value })} className={`${input} font-mono`} />
          <span className="text-xs text-gray-500">
            Prázdny riadok = nový odsek · riadok začínajúci „## “ = podnadpis · riadky začínajúce „- “ = odrážky
          </span>
        </label>
      )}
      <button type="button" onClick={() => setShowLangs(!showLangs)} className="text-amber-700 font-semibold hover:underline">
        {showLangs ? "▾" : "▸"} Preklady (CZ, EN, RO) – nepovinné, inak sa zobrazí slovenský text
      </button>
      {showLangs && LANGS.map(([code, label]) => (
        <div key={code} className="space-y-2 pl-3 border-l-2 border-amber-100">
          <label className="flex flex-col gap-1">Nadpis {label}
            <input value={titles[code] ?? ""} onChange={(e) => onTitles({ ...titles, [code]: e.target.value })} className={input} />
          </label>
          <label className="flex flex-col gap-1">{descriptionLabel} {label}
            <textarea value={descriptions[code] ?? ""} rows={2} onChange={(e) => onDescriptions({ ...descriptions, [code]: e.target.value })} className={input} />
          </label>
          {bodies && onBodies && (
            <label className="flex flex-col gap-1">Text článku {label}
              <textarea value={bodies[code] ?? ""} rows={6} onChange={(e) => onBodies({ ...bodies, [code]: e.target.value })} className={`${input} font-mono`} />
            </label>
          )}
        </div>
      ))}
    </div>
  );
}

/* ---------- Videos ---------- */

type VideoForm = {
  slug: string;
  custom: boolean;
  source: "file" | "youtube";
  youtube: string;
  poster: string;
  titles: LocaleText;
  descriptions: LocaleText;
  linkUrl: string;
  linkUrlCz: string;
  linkUrlRo: string;
  active: boolean;
};

const NEW_VIDEO: VideoForm = {
  slug: "", custom: true, source: "youtube", youtube: "", poster: "",
  titles: { sk: "" }, descriptions: { sk: "" }, linkUrl: "", linkUrlCz: "", linkUrlRo: "", active: true,
};

function videoForm(v: AdminVideo): VideoForm {
  return {
    slug: v.slug,
    custom: v.custom,
    source: v.source,
    youtube: v.youtubeId ? `https://www.youtube.com/watch?v=${v.youtubeId}` : "",
    poster: v.poster,
    titles: v.titles,
    descriptions: v.descriptions,
    linkUrl: v.linkUrl,
    linkUrlCz: v.linkUrlByLocale.cz ?? "",
    linkUrlRo: v.linkUrlByLocale.ro ?? "",
    active: v.active,
  };
}

function VideoEditor({ initial, busy, act, onDone }: { initial: VideoForm; busy: boolean; act: Act; onDone: () => void }) {
  const [f, setF] = useState(initial);
  const isNew = !initial.slug;
  return (
    <form className="bg-white rounded-xl shadow p-4 text-sm text-gray-700 space-y-4 border-2 border-amber-200"
      onSubmit={async (e) => {
        e.preventDefault();
        const data = await act({ action: "saveVideo", ...f }, isNew ? "Video pridané do návodov." : "Video uložené.");
        if (data) onDone();
      }}>
      <p className="font-semibold text-espresso-800 text-base">{isNew ? "Nové video" : `Upraviť: ${initial.titles.sk}`}</p>

      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4">
        <div className="space-y-2">
          {f.source === "youtube" ? (
            <>
              <PhotoPicker image={f.poster} onChange={(poster) => setF({ ...f, poster })}
                emptyLabel="Náhľad sa vezme z YouTube, alebo nahrajte fotku produktu" />
              {f.poster && (
                <button type="button" onClick={() => setF({ ...f, poster: "" })} className="text-xs text-gray-500 hover:underline">
                  Použiť náhľad z YouTube
                </button>
              )}
            </>
          ) : (
            <p className="text-xs text-gray-500">Vlastné video nahraté na webe – dá sa meniť text a odkazy.</p>
          )}
        </div>
        <div className="space-y-3">
          {f.source === "youtube" && (
            <label className="flex flex-col gap-1">Odkaz na video z YouTube *
              <input value={f.youtube} required placeholder="https://www.youtube.com/watch?v=…"
                onChange={(e) => setF({ ...f, youtube: e.target.value })} className={input} />
            </label>
          )}
          <TextFields titles={f.titles} descriptions={f.descriptions} descriptionLabel="Popis"
            onTitles={(titles) => setF({ ...f, titles })} onDescriptions={(descriptions) => setF({ ...f, descriptions })} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <label className="flex flex-col gap-1">Odkaz na produkt (tlačidlo „Zobraziť produkty“)
          <input value={f.linkUrl} placeholder="https://eshop.marosko.sk/p/…" onChange={(e) => setF({ ...f, linkUrl: e.target.value })} className={input} />
        </label>
        <label className="flex flex-col gap-1">Ten istý produkt v CZ e-shope (nepovinné)
          <input value={f.linkUrlCz} placeholder="https://eshop.marosko.sk/cz/p/…" onChange={(e) => setF({ ...f, linkUrlCz: e.target.value })} className={input} />
        </label>
        <label className="flex flex-col gap-1">Ten istý produkt v RO e-shope (nepovinné)
          <input value={f.linkUrlRo} placeholder="https://eshop.marosko.sk/ro/p/…" onChange={(e) => setF({ ...f, linkUrlRo: e.target.value })} className={input} />
        </label>
      </div>

      <label className="flex items-center gap-2">
        <input type="checkbox" checked={f.active} onChange={(e) => setF({ ...f, active: e.target.checked })} />
        Zobrazovať v návodoch
      </label>

      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={busy} className={`${button} bg-amber-600 text-white hover:bg-amber-700`}>{isNew ? "Pridať video" : "Uložiť"}</button>
        <button type="button" onClick={onDone} className={`${button} bg-white border border-gray-300 text-gray-700 hover:bg-gray-50`}>Zrušiť</button>
      </div>
    </form>
  );
}

export function VideosTab({ videos, busy, act }: { videos: AdminVideo[]; busy: boolean; act: Act }) {
  const [editing, setEditing] = useState<string | null>(null);
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Videá na stránke <a href={`${SITE}/navody`} target="_blank" rel="noopener" className="underline">Návody</a>.
        Nové videá sa pridávajú odkazom z YouTube a zobrazia sa navrchu. Polia s * sú povinné.
      </p>
      {editing === "" ? (
        <VideoEditor initial={NEW_VIDEO} busy={busy} act={act} onDone={() => setEditing(null)} />
      ) : (
        <button type="button" onClick={() => setEditing("")} className={`${button} bg-amber-600 text-white hover:bg-amber-700`}>+ Pridať video</button>
      )}
      {videos.map((v) =>
        editing === v.slug ? (
          <VideoEditor key={v.slug} initial={videoForm(v)} busy={busy} act={act} onDone={() => setEditing(null)} />
        ) : (
          <div key={v.slug} className={`bg-white rounded-xl shadow p-3 flex items-center gap-4 text-sm text-gray-700 ${v.active ? "" : "opacity-60"}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={v.poster} alt="" className="w-28 aspect-video object-cover rounded bg-gray-100 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-espresso-800">{v.titles.sk}{!v.active && " (skryté)"}</p>
              <p className="truncate text-gray-500">{v.source === "youtube" ? "YouTube" : "Vlastné video"}{v.linkUrl ? ` · ${v.linkUrl}` : ""}</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-end">
              {v.active && (
                <a href={`${SITE}/navody/${v.slug}`} target="_blank" rel="noopener"
                  className={`${button} bg-white border border-gray-300 text-gray-700 hover:bg-gray-50`}>Zobraziť</a>
              )}
              <button type="button" onClick={() => setEditing(v.slug)}
                className={`${button} bg-white border border-gray-300 text-gray-700 hover:bg-gray-50`}>Upraviť</button>
              {v.custom && (
                <button type="button" disabled={busy}
                  onClick={() => confirm(`Odstrániť video „${v.titles.sk}“ z návodov?`) && act({ action: "deleteVideo", slug: v.slug }, "Video odstránené.")}
                  className={`${button} bg-white border border-red-300 text-red-700 hover:bg-red-50`}>Odstrániť</button>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
}

/* ---------- Articles ---------- */

type ArticleForm = Omit<AdminArticle, "createdAt">;

const NEW_ARTICLE: ArticleForm = {
  slug: "", titles: { sk: "" }, descriptions: { sk: "" }, bodies: { sk: "" }, image: "", ctaUrl: "", active: true,
};

function ArticleEditor({ initial, busy, act, onDone }: { initial: ArticleForm; busy: boolean; act: Act; onDone: () => void }) {
  const [f, setF] = useState(initial);
  const isNew = !initial.slug;
  return (
    <form className="bg-white rounded-xl shadow p-4 text-sm text-gray-700 space-y-4 border-2 border-amber-200"
      onSubmit={async (e) => {
        e.preventDefault();
        const data = await act({ action: "saveArticle", ...f }, isNew ? "Článok pridaný do návodov." : "Článok uložený.");
        if (data) onDone();
      }}>
      <p className="font-semibold text-espresso-800 text-base">{isNew ? "Nový článok" : `Upraviť: ${initial.titles.sk}`}</p>
      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4">
        <PhotoPicker image={f.image} onChange={(image) => setF({ ...f, image })} emptyLabel="Hlavná fotka článku *" />
        <TextFields titles={f.titles} descriptions={f.descriptions} bodies={f.bodies} descriptionLabel="Krátky popis (na kartičku a pre Google)"
          onTitles={(titles) => setF({ ...f, titles })} onDescriptions={(descriptions) => setF({ ...f, descriptions })}
          onBodies={(bodies) => setF({ ...f, bodies })} />
      </div>
      <label className="flex flex-col gap-1">Odkaz na produkt pod článkom (nepovinné)
        <input value={f.ctaUrl} placeholder="https://eshop.marosko.sk/p/…" onChange={(e) => setF({ ...f, ctaUrl: e.target.value })} className={input} />
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={f.active} onChange={(e) => setF({ ...f, active: e.target.checked })} />
        Zobrazovať v návodoch
      </label>
      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={busy || !f.image} className={`${button} bg-amber-600 text-white hover:bg-amber-700`}>{isNew ? "Pridať článok" : "Uložiť"}</button>
        <button type="button" onClick={onDone} className={`${button} bg-white border border-gray-300 text-gray-700 hover:bg-gray-50`}>Zrušiť</button>
        {!f.image && <span className="text-xs text-gray-500 self-center">Najprv nahrajte fotku.</span>}
      </div>
    </form>
  );
}

export function ArticlesTab({ articles, busy, act }: { articles: AdminArticle[]; busy: boolean; act: Act }) {
  const [editing, setEditing] = useState<string | null>(null);
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Písané návody na stránke <a href={`${SITE}/navody`} target="_blank" rel="noopener" className="underline">Návody</a>.
        Dva pôvodné dlhé návody (socha motorovou pilou, kniha) ostávajú bez zmeny; nové články sa zobrazia pred nimi.
      </p>
      {editing === "" ? (
        <ArticleEditor initial={NEW_ARTICLE} busy={busy} act={act} onDone={() => setEditing(null)} />
      ) : (
        <button type="button" onClick={() => setEditing("")} className={`${button} bg-amber-600 text-white hover:bg-amber-700`}>+ Pridať článok</button>
      )}
      {articles.length === 0 && editing !== "" && <p className="text-gray-600">Zatiaľ žiadne pridané články.</p>}
      {articles.map((a) =>
        editing === a.slug ? (
          <ArticleEditor key={a.slug} initial={a} busy={busy} act={act} onDone={() => setEditing(null)} />
        ) : (
          <div key={a.slug} className={`bg-white rounded-xl shadow p-3 flex items-center gap-4 text-sm text-gray-700 ${a.active ? "" : "opacity-60"}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={a.image} alt="" className="w-28 aspect-video object-cover rounded bg-gray-100 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-espresso-800">{a.titles.sk}{!a.active && " (skryté)"}</p>
              <p className="truncate text-gray-500">{a.descriptions.sk}</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-end">
              {a.active && (
                <a href={`${SITE}/navody/clanky/${a.slug}`} target="_blank" rel="noopener"
                  className={`${button} bg-white border border-gray-300 text-gray-700 hover:bg-gray-50`}>Zobraziť</a>
              )}
              <button type="button" onClick={() => setEditing(a.slug)}
                className={`${button} bg-white border border-gray-300 text-gray-700 hover:bg-gray-50`}>Upraviť</button>
              <button type="button" disabled={busy}
                onClick={() => confirm(`Odstrániť článok „${a.titles.sk}“?`) && act({ action: "deleteArticle", slug: a.slug }, "Článok odstránený.")}
                className={`${button} bg-white border border-red-300 text-red-700 hover:bg-red-50`}>Odstrániť</button>
            </div>
          </div>
        )
      )}
    </div>
  );
}
