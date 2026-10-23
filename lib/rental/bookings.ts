import { getJson, key, kv, kvPipeline } from "@/lib/rental/kv";
import { randomId } from "@/lib/rental/crypto";
import type { RentalTool } from "@/lib/rental/rentalData";

export type BookingStatus = "pending" | "confirmed" | "declined";

export type Booking = {
  id: string;
  toolSlug: string;
  email: string;
  name: string;
  phone: string;
  /** Inclusive "YYYY-MM-DD" range. */
  from: string;
  to: string;
  days: number;
  estimatedPrice: number;
  deposit: number;
  note: string;
  locale: string;
  status: BookingStatus;
  createdAt: string;
  decidedAt?: string;
};

/** A pending request already blocks its dates, so two customers can't both
 * ask for the same days while the shop hasn't answered yet. */
const BLOCKING: BookingStatus[] = ["pending", "confirmed"];

export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function overlaps(a: { from: string; to: string }, b: { from: string; to: string }): boolean {
  return a.from <= b.to && b.from <= a.to;
}

async function getBookings(ids: string[]): Promise<Booking[]> {
  if (ids.length === 0) return [];
  const raw = await kv<(string | null)[]>(["MGET", ...ids.map((id) => key("booking", id))]);
  return raw.filter((value): value is string => Boolean(value)).map((value) => JSON.parse(value) as Booking);
}

export async function getBooking(id: string): Promise<Booking | null> {
  return getJson<Booking>(key("booking", id));
}

/** Pending and confirmed bookings of a tool that haven't ended yet. */
export async function activeToolBookings(slug: string): Promise<Booking[]> {
  const ids = await kv<string[]>(["SMEMBERS", key("toolbookings", slug)]);
  const today = todayIso();
  return (await getBookings(ids))
    .filter((booking) => BLOCKING.includes(booking.status) && booking.to >= today)
    .sort((a, b) => a.from.localeCompare(b.from));
}

/** Days ("YYYY-MM-DD") on which every unit of the tool is taken. */
export function fullyBookedDays(bookings: Booking[], units: number): string[] {
  const perDay = new Map<string, number>();
  for (const booking of bookings) {
    for (let t = Date.parse(`${booking.from}T00:00:00Z`); t <= Date.parse(`${booking.to}T00:00:00Z`); t += 86_400_000) {
      const day = new Date(t).toISOString().slice(0, 10);
      perDay.set(day, (perDay.get(day) ?? 0) + 1);
    }
  }
  return [...perDay].filter(([, count]) => count >= units).map(([day]) => day).sort();
}

export async function userBookings(email: string): Promise<Booking[]> {
  const ids = await kv<string[]>(["LRANGE", key("userbookings", email), 0, 99]);
  return getBookings(ids);
}

export type CreateBookingResult = { ok: true; booking: Booking } | { ok: false; reason: "taken" | "busy" };

/** Creates a pending booking unless the range is already taken. A short
 * per-tool lock stops two simultaneous requests from both passing the
 * availability check. */
export async function createBooking(
  tool: RentalTool,
  input: Omit<Booking, "id" | "toolSlug" | "status" | "createdAt" | "deposit">
): Promise<CreateBookingResult> {
  const lockKey = key("lock", tool.slug);
  const locked = await kv<string | null>(["SET", lockKey, "1", "NX", "PX", 10_000]);
  if (locked !== "OK") return { ok: false, reason: "busy" };

  try {
    const existing = await activeToolBookings(tool.slug);
    const concurrent = existing.filter((booking) => overlaps(booking, input));
    // Each unit is free unless as many bookings as there are units overlap
    // the same day; checking per day keeps back-to-back bookings possible.
    if (fullyBookedDays(concurrent, tool.units).some((day) => day >= input.from && day <= input.to)) {
      return { ok: false, reason: "taken" };
    }

    const booking: Booking = {
      ...input,
      id: randomId(9),
      toolSlug: tool.slug,
      deposit: tool.deposit,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    await kvPipeline([
      ["SET", key("booking", booking.id), JSON.stringify(booking)],
      ["SADD", key("toolbookings", tool.slug), booking.id],
      ["LPUSH", key("userbookings", booking.email), booking.id],
    ]);
    return { ok: true, booking };
  } finally {
    await kv(["DEL", lockKey]);
  }
}

export async function setBookingStatus(id: string, status: BookingStatus): Promise<Booking | null> {
  const booking = await getBooking(id);
  if (!booking) return null;
  const updated: Booking = { ...booking, status, decidedAt: new Date().toISOString() };
  await kv(["SET", key("booking", id), JSON.stringify(updated)]);
  return updated;
}
