"use client";

import { FormEvent, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/navigation";

const inputClass =
  "w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500";
const labelClass = "block text-sm font-semibold text-gray-700 mb-1";

export default function RentalAuthForm({ mode, next }: { mode: "register" | "login"; next: string }) {
  const t = useTranslations("rental");
  const locale = useLocale();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [verifySent, setVerifySent] = useState(false);

  const errorText = (code: unknown) =>
    typeof code === "string" && t.has(`errors.${code}`) ? t(`errors.${code}`) : t("errors.generic");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch(`/api/rental/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "register" ? { name, email, phone, password, consent, locale } : { email, password }
        ),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(errorText(data.error));
        setSending(false);
        return;
      }
      if (data.verifyEmail) {
        // Admin address: the account is created once the emailed link is opened.
        setVerifySent(true);
        setSending(false);
        return;
      }
      // Signing in from the site menu goes to the account; an admin lands in the admin panel.
      router.push(data.isAdmin && next === "/ucet" ? "/ucet/admin" : next);
      router.refresh();
    } catch {
      setError(t("errors.generic"));
      setSending(false);
    }
  };

  const nextQuery = next === "/pozicovna" ? {} : { next };

  if (verifySent) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 text-gray-700">{t("auth.adminVerifySent")}</div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 md:p-8 space-y-4">
      {mode === "register" && (
        <>
          <div>
            <label htmlFor="rental-name" className={labelClass}>{t("auth.name")}</label>
            <input id="rental-name" type="text" required autoComplete="name" value={name}
              onChange={(e) => setName(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="rental-phone" className={labelClass}>{t("auth.phone")}</label>
            <input id="rental-phone" type="tel" required autoComplete="tel" value={phone}
              onChange={(e) => setPhone(e.target.value)} className={inputClass} />
          </div>
        </>
      )}
      <div>
        <label htmlFor="rental-email" className={labelClass}>{t("auth.email")}</label>
        <input id="rental-email" type="email" required autoComplete="email" value={email}
          onChange={(e) => setEmail(e.target.value)} className={inputClass} />
      </div>
      <div>
        <label htmlFor="rental-password" className={labelClass}>{t("auth.password")}</label>
        <input id="rental-password" type="password" required minLength={mode === "register" ? 8 : undefined}
          autoComplete={mode === "register" ? "new-password" : "current-password"} value={password}
          onChange={(e) => setPassword(e.target.value)} className={inputClass} />
        {mode === "register" && <p className="text-xs text-gray-500 mt-1">{t("auth.passwordHint")}</p>}
        {mode === "login" && (
          <p className="text-sm mt-2 text-right">
            <Link href="/ucet/zabudnute-heslo" className="text-amber-700 hover:underline">{t("auth.forgotLink")}</Link>
          </p>
        )}
      </div>
      {mode === "register" && (
        <label className="flex items-start gap-2 text-sm text-gray-700">
          <input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)}
            className="mt-1" />
          <span>
            {t.rich("auth.consent", {
              gdpr: (chunks) => (
                <Link href="/gdpr" target="_blank" className="text-amber-700 underline">{chunks}</Link>
              ),
              terms: (chunks) => (
                <Link href="/pozicovna#podmienky" target="_blank" className="text-amber-700 underline">{chunks}</Link>
              ),
            })}
          </span>
        </label>
      )}
      {error && <p className="text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-sm">{error}</p>}
      <button type="submit" disabled={sending}
        className="w-full bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors disabled:opacity-60">
        {sending ? t("auth.sending") : mode === "register" ? t("auth.submitRegister") : t("auth.submitLogin")}
      </button>
      <p className="text-sm text-gray-600 text-center">
        {mode === "register" ? t("auth.haveAccount") : t("auth.noAccount")}{" "}
        <Link
          href={{ pathname: mode === "register" ? "/ucet/prihlasenie" : "/ucet/registracia", query: nextQuery }}
          className="text-amber-700 font-semibold hover:underline"
        >
          {mode === "register" ? t("auth.loginLink") : t("auth.registerLink")}
        </Link>
      </p>
    </form>
  );
}
