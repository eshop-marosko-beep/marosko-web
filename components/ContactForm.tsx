"use client";

import { useLocale, useTranslations } from "next-intl";
import { FormEvent, useState } from "react";
import { getEshopUrl } from "@/lib/eshopUrl";

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  const t = useTranslations("home.contactCta");
  const tContact = useTranslations("contact");
  const locale = useLocale();
  const eshopUrl = getEshopUrl(locale);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message, subject: title, locale }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(typeof data.error === "string" ? data.error : t("errorMessage"));
        setStatus("error");
        return;
      }

      setStatus("success");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch {
      setErrorMessage(t("errorMessage"));
      setStatus("error");
    }
  };

  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-espresso-800 mb-4">
          {title}
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">{subtitle}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg p-6 md:p-8 space-y-4"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {t("nameLabel")}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("namePlaceholder")}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {t("emailLabel")}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("emailPlaceholder")}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {t("phoneLabel")}
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t("phonePlaceholder")}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {t("messageLabel")}
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("messagePlaceholder")}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === "sending" ? t("sending") : t("submit")}
          </button>
          {status === "success" && (
            <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
              {t("successMessage")}
            </p>
          )}
          {status === "error" && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
              {errorMessage || t("errorMessage")}
            </p>
          )}
          <p className="text-xs text-gray-400">{t("note")}</p>
        </form>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 md:p-8 space-y-4 text-gray-700 h-fit">
          <p>📍 {tContact("address")}</p>
          <p>📞 {tContact("phoneProducts")}</p>
          <p>📦 {tContact("phoneShipping")}</p>
          <p>✉️ {tContact("email")}</p>
          <p className="pt-2">
            🛒{" "}
            <a
              href={eshopUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-700 font-bold hover:underline"
            >
              {tContact("eshop")}
            </a>
          </p>
          <div className="rounded-lg overflow-hidden border border-amber-200">
            <iframe
              title={tContact("mapTitle")}
              src="https://www.google.com/maps?q=48.825509,17.188902&z=15&output=embed"
              width="100%"
              height="220"
              style={{ border: 0, pointerEvents: "none" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <a
            href="https://www.google.com/maps?cid=3771718462339881731"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-amber-700 font-semibold hover:underline"
          >
            {tContact("openInMaps")} →
          </a>
        </div>
      </div>
    </section>
  );
}
