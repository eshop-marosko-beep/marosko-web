"use client";

import { FormEvent, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/navigation";

const inputClass =
  "w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500";
const labelClass = "block text-sm font-semibold text-gray-700 mb-1";

/** "request": ask for a reset link by email. "confirm": set the new
 * password from the link (email and token come from its URL). */
export default function PasswordResetForm(
  props: { mode: "request" } | { mode: "confirm"; email: string; token: string }
) {
  const t = useTranslations("rental");
  const locale = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const errorText = (code: unknown) =>
    typeof code === "string" && t.has(`errors.${code}`) ? t(`errors.${code}`) : t("errors.generic");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const confirm = props.mode === "confirm";
      const res = await fetch(confirm ? "/api/rental/password-reset/confirm" : "/api/rental/password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(confirm ? { email: props.email, token: props.token, password } : { email, locale }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(errorText(data.error));
        setSending(false);
        return;
      }
      if (!confirm) {
        setSent(true);
        setSending(false);
        return;
      }
      router.push(data.isAdmin ? "/ucet/admin" : "/ucet");
      router.refresh();
    } catch {
      setError(t("errors.generic"));
      setSending(false);
    }
  };

  if (sent) {
    return <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 text-gray-700">{t("auth.forgotSent")}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 md:p-8 space-y-4">
      {props.mode === "request" ? (
        <div>
          <label htmlFor="reset-email" className={labelClass}>{t("auth.email")}</label>
          <input id="reset-email" type="email" required autoComplete="email" value={email}
            onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        </div>
      ) : (
        <div>
          <label htmlFor="reset-password" className={labelClass}>{t("auth.password")}</label>
          <input id="reset-password" type="password" required minLength={8} autoComplete="new-password" value={password}
            onChange={(e) => setPassword(e.target.value)} className={inputClass} />
          <p className="text-xs text-gray-500 mt-1">{t("auth.passwordHint")}</p>
        </div>
      )}
      {error && (
        <p className="text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-sm">
          {error}{" "}
          {props.mode === "confirm" && (
            <Link href="/ucet/zabudnute-heslo" className="underline font-semibold">{t("auth.forgotSubmit")}</Link>
          )}
        </p>
      )}
      <button type="submit" disabled={sending}
        className="w-full bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors disabled:opacity-60">
        {sending ? t("auth.sending") : props.mode === "request" ? t("auth.forgotSubmit") : t("auth.resetSubmit")}
      </button>
      <p className="text-sm text-center">
        <Link href="/ucet/prihlasenie" className="text-amber-700 font-semibold hover:underline">{t("auth.backToLogin")}</Link>
      </p>
    </form>
  );
}
