export const COOKIE_CONSENT_STORAGE_KEY = "marosko-cookies-v1";
export const COOKIE_CONSENT_CHANGED_EVENT = "marosko-cookie-consent-changed";
export const OPEN_COOKIE_SETTINGS_EVENT = "marosko-open-cookie-settings";

export type CookieConsent = {
  necessary: true;
  analytics: boolean;
  preferences: boolean;
  updatedAt: string;
};

export function readCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CookieConsent;
  } catch {
    return null;
  }
}

export function writeCookieConsent(consent: Omit<CookieConsent, "necessary" | "updatedAt">) {
  if (typeof window === "undefined") return;
  const value: CookieConsent = {
    necessary: true,
    analytics: consent.analytics,
    preferences: consent.preferences,
    updatedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_CHANGED_EVENT, { detail: value }));
}

export function openCookieSettings() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT));
}
