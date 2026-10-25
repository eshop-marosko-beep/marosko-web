"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { estimatePrice, rentalDays, type RentalTool } from "@/lib/rental/rentalData";

const MAX_DAYS = 30;
const MAX_DAYS_AHEAD = 180;
/** Intl locale per site locale ("cz" is the URL prefix, Czech is "cs"). */
const INTL_LOCALE: Record<string, string> = { sk: "sk-SK", cz: "cs-CZ", en: "en-GB", ro: "ro-RO" };

function iso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function utcDate(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month, day));
}

function addDays(day: string, n: number): string {
  return iso(new Date(Date.parse(`${day}T00:00:00Z`) + n * 86_400_000));
}

type Status = "idle" | "sending" | "success" | "confirmed";

export default function BookingCalendar({
  toolSlug,
  prices,
  deposit,
  signedIn,
  canBook,
  initialFrom,
  initialTo,
}: {
  toolSlug: string;
  /** Prices and deposit for this customer's group (discount already applied). */
  prices: RentalTool["prices"];
  deposit: number;
  signedIn: boolean;
  /** Signed in and not blocked; otherwise dates can be picked but not sent. */
  canBook: boolean;
  /** Dates picked before signing in, brought back through the URL. */
  initialFrom: string | null;
  initialTo: string | null;
}) {
  const t = useTranslations("rental");
  const locale = useLocale();
  const intlLocale = INTL_LOCALE[locale] ?? "sk-SK";

  const today = iso(new Date());
  const lastDay = addDays(today, MAX_DAYS_AHEAD);
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return utcDate(now.getUTCFullYear(), now.getUTCMonth(), 1);
  });
  const [booked, setBooked] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);
  const [from, setFrom] = useState<string | null>(() => (initialFrom && initialFrom >= today ? initialFrom : null));
  const [to, setTo] = useState<string | null>(() =>
    initialFrom && initialFrom >= today && initialTo && initialTo >= initialFrom ? initialTo : null
  );
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  /** Error code from messages.rental.errors, translated when rendered. */
  const [error, setError] = useState<string | null>(null);

  const loadAvailability = useCallback(async () => {
    try {
      const res = await fetch(`/api/rental/availability?tool=${encodeURIComponent(toolSlug)}`, { cache: "no-store" });
      const data = await res.json();
      if (res.ok && data.success) setBooked(new Set(data.bookedDays as string[]));
      else setError(typeof data.error === "string" ? data.error : "generic");
    } catch {
      setError("generic");
    } finally {
      setLoaded(true);
    }
  }, [toolSlug]);

  useEffect(() => {
    loadAvailability();
  }, [loadAvailability]);

  const weekdays = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(intlLocale, { weekday: "short", timeZone: "UTC" });
    // 2024-01-01 was a Monday.
    return Array.from({ length: 7 }, (_, i) => fmt.format(utcDate(2024, 0, 1 + i)));
  }, [intlLocale]);

  const monthLabel = new Intl.DateTimeFormat(intlLocale, { month: "long", year: "numeric", timeZone: "UTC" }).format(month);
  const year = month.getUTCFullYear();
  const monthIndex = month.getUTCMonth();
  const daysInMonth = utcDate(year, monthIndex + 1, 0).getUTCDate();
  const leadingBlanks = (utcDate(year, monthIndex, 1).getUTCDay() + 6) % 7;

  const isDisabled = (day: string) => day < today || day > lastDay || booked.has(day);
  const inRange = (day: string) => from !== null && day >= from && day <= (to ?? from);

  const rangeHasBookedDay = (start: string, end: string) => {
    for (let day = start; day <= end; day = addDays(day, 1)) if (booked.has(day)) return true;
    return false;
  };

  const handleDayClick = (day: string) => {
    setError(null);
    setStatus("idle");
    if (!from || to || day < from) {
      setFrom(day);
      setTo(null);
      return;
    }
    if (rangeHasBookedDay(from, day)) {
      setError("dates_taken");
      setFrom(day);
      setTo(null);
      return;
    }
    if (rentalDays(from, day) > MAX_DAYS) {
      setError("too_long");
      return;
    }
    setTo(day);
  };

  const end = to ?? from;
  const days = from && end ? rentalDays(from, end) : 0;
  const price = from && end ? estimatePrice({ prices }, from, end) : 0;
  const formatDay = (day: string) =>
    new Intl.DateTimeFormat(intlLocale, { day: "numeric", month: "numeric", year: "numeric", timeZone: "UTC" }).format(
      new Date(`${day}T00:00:00Z`)
    );

  const firstMonth = utcDate(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1);
  const canGoBack = month.getTime() > firstMonth.getTime();
  const canGoForward = utcDate(year, monthIndex + 1, 1).getTime() <= Date.parse(`${lastDay}T00:00:00Z`);

  const submit = async () => {
    if (!from || !end) return;
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/rental/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: toolSlug, from, to: end, note, locale }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(typeof data.error === "string" ? data.error : "generic");
        setStatus("idle");
        await loadAvailability();
        return;
      }
      setStatus(data.status === "confirmed" ? "confirmed" : "success");
      setFrom(null);
      setTo(null);
      setNote("");
      await loadAvailability();
    } catch {
      setError("generic");
      setStatus("idle");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl font-bold text-espresso-800 mb-1">{t("calendar.title")}</h2>
      <p className="text-gray-600 text-sm mb-6">{from && !to ? t("calendar.pickEnd") : t("calendar.pickStart")}</p>

      <div className="flex items-center justify-between mb-3">
        <button type="button" disabled={!canGoBack} onClick={() => setMonth(utcDate(year, monthIndex - 1, 1))}
          className="px-3 py-1 rounded-lg border border-gray-300 disabled:opacity-30" aria-label={t("calendar.prev")}>
          ←
        </button>
        <span className="font-semibold text-espresso-800 capitalize">{monthLabel}</span>
        <button type="button" disabled={!canGoForward} onClick={() => setMonth(utcDate(year, monthIndex + 1, 1))}
          className="px-3 py-1 rounded-lg border border-gray-300 disabled:opacity-30" aria-label={t("calendar.next")}>
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-1">
        {weekdays.map((name) => <div key={name}>{name}</div>)}
      </div>
      <div className={`grid grid-cols-7 gap-1 ${loaded ? "" : "opacity-40"}`}>
        {Array.from({ length: leadingBlanks }, (_, i) => <div key={`blank-${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = iso(utcDate(year, monthIndex, i + 1));
          const disabled = !loaded || isDisabled(day);
          const selected = inRange(day);
          const isBooked = booked.has(day) && day >= today;
          return (
            <button key={day} type="button" disabled={disabled} onClick={() => handleDayClick(day)}
              aria-pressed={selected}
              title={isBooked ? t("calendar.legendBooked") : undefined}
              className={[
                "aspect-square rounded-lg text-sm font-medium transition-colors",
                selected ? "bg-amber-600 text-white"
                  : isBooked ? "bg-red-100 text-red-400 line-through cursor-not-allowed"
                  : disabled ? "text-gray-300 cursor-not-allowed"
                  : "bg-cream-50 text-espresso-800 hover:bg-amber-100",
              ].join(" ")}>
              {i + 1}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-gray-600 mt-3">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-cream-50 border border-gray-300" />{t("calendar.legendFree")}</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-100" />{t("calendar.legendBooked")}</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-600" />{t("calendar.legendSelected")}</span>
      </div>

      {from && end && (
        <div className="mt-6 border-t border-amber-100 pt-6 space-y-4">
          <div className="text-gray-700 space-y-1">
            <p><strong>{t("calendar.selected")}:</strong> {formatDay(from)} – {formatDay(end)} ({t("calendar.days", { count: days })})</p>
            <p><strong>{t("calendar.estimate")}:</strong> {price} € · <strong>{t("deposit")}:</strong> {deposit} €</p>
            <p className="text-xs text-gray-500">{t("calendar.priceNote")}</p>
          </div>
          {!canBook ? (
            signedIn ? null : (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
                <p className="text-sm text-espresso-800">{t("calendar.loginToBook")}</p>
                <div className="flex flex-wrap gap-3">
                  <Link href={{ pathname: "/ucet/registracia", query: { next: `/pozicovna/${toolSlug}?from=${from}&to=${end}` } }}
                    className="bg-amber-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-amber-700 transition-colors">
                    {t("registerCta")}
                  </Link>
                  <Link href={{ pathname: "/ucet/prihlasenie", query: { next: `/pozicovna/${toolSlug}?from=${from}&to=${end}` } }}
                    className="px-5 py-2 rounded-lg font-semibold text-amber-700 border border-amber-300 hover:bg-amber-100 transition-colors">
                    {t("loginCta")}
                  </Link>
                </div>
              </div>
            )
          ) : (<>
          <div>
            <label htmlFor="rental-note" className="block text-sm font-semibold text-gray-700 mb-1">{t("calendar.note")}</label>
            <textarea id="rental-note" rows={3} maxLength={1000} value={note} onChange={(e) => setNote(e.target.value)}
              placeholder={t("calendar.notePlaceholder")}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={submit} disabled={status === "sending"}
              className="bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors disabled:opacity-60">
              {status === "sending" ? t("calendar.sending") : t("calendar.submit")}
            </button>
            <button type="button" onClick={() => { setFrom(null); setTo(null); setError(null); }}
              className="px-6 py-3 rounded-lg font-semibold text-gray-600 hover:text-amber-700">
              {t("calendar.clear")}
            </button>
          </div>
          </>)}
        </div>
      )}

      {error && (
        <p className="mt-4 text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-sm">
          {t.has(`errors.${error}`) ? t(`errors.${error}`) : t("errors.generic")}
        </p>
      )}
      {(status === "success" || status === "confirmed") && (
        <div className="mt-4 text-green-800 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm">
          {status === "confirmed" ? t("calendar.successConfirmed") : t("calendar.success")}{" "}
          <Link href="/ucet" className="font-semibold underline">{t("calendar.successLink")}</Link>
        </div>
      )}
    </div>
  );
}
