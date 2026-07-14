"use client";

import { useTranslations } from "next-intl";
import { FormEvent, useState } from "react";

export default function ContactSection() {
  const t = useTranslations("home.contactCta");
  const tContact = useTranslations("contact");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`${t("title")} - ${name}`);
    const body = encodeURIComponent(`${name}\n${email}\n${phone}\n\n${message}`);
    window.location.href = `mailto:eshop.marosko@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <section id="kontakt" className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-espresso-800 mb-4">
          {t("title")}
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          {t("subtitle")}
        </p>
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
            className="w-full bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
          >
            {t("submit")}
          </button>
          <p className="text-xs text-gray-400">{t("note")}</p>
        </form>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 md:p-8 space-y-4 text-gray-700 h-fit">
          <p>📍 {tContact("address")}</p>
          <p>📞 {tContact("phone")}</p>
          <p>✉️ {tContact("email")}</p>
          <p className="pt-4">
            🛒{" "}
            <a
              href="https://eshop.marosko.sk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-700 font-bold hover:underline"
            >
              {tContact("eshop")}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
