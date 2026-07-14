"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

const questions = ["q1", "q2", "q3", "q4"] as const;

export default function Faq() {
  const t = useTranslations("home.faq");
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <section id="faq" className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-amber-800 mb-4">
          {t("title")}
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          {t("subtitle")}
        </p>
      </div>
      <div className="max-w-3xl mx-auto space-y-4">
        {questions.map((key) => {
          const isOpen = openKey === key;
          return (
            <div
              key={key}
              className="bg-white rounded-lg shadow border border-amber-100"
            >
              <button
                type="button"
                onClick={() => setOpenKey(isOpen ? null : key)}
                className="w-full flex justify-between items-center text-left px-6 py-4 font-semibold text-amber-800"
                aria-expanded={isOpen}
              >
                <span>{t(`${key}.question`)}</span>
                <span className="text-2xl leading-none ml-4">
                  {isOpen ? "−" : "+"}
                </span>
              </button>
              {isOpen && (
                <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                  {t(`${key}.answer`)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
