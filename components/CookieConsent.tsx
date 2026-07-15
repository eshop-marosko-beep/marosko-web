"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  COOKIE_CONSENT_CHANGED_EVENT,
  OPEN_COOKIE_SETTINGS_EVENT,
  readCookieConsent,
  writeCookieConsent,
} from "@/lib/cookieConsent";

export default function CookieConsent() {
  const t = useTranslations("cookies");
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [preferences, setPreferences] = useState(true);

  useEffect(() => {
    const existing = readCookieConsent();
    if (!existing) {
      setVisible(true);
    } else {
      setAnalytics(existing.analytics);
      setPreferences(existing.preferences);
    }

    const handleOpen = () => {
      const current = readCookieConsent();
      if (current) {
        setAnalytics(current.analytics);
        setPreferences(current.preferences);
      }
      setShowDetails(true);
      setVisible(true);
    };
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, handleOpen);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, handleOpen);
  }, []);

  const acceptAll = () => {
    writeCookieConsent({ analytics: true, preferences: true });
    setAnalytics(true);
    setPreferences(true);
    setVisible(false);
    setShowDetails(false);
  };

  const rejectAll = () => {
    writeCookieConsent({ analytics: false, preferences: false });
    setAnalytics(false);
    setPreferences(false);
    setVisible(false);
    setShowDetails(false);
  };

  const saveCustom = () => {
    writeCookieConsent({ analytics, preferences });
    setVisible(false);
    setShowDetails(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4">
      <div className="mx-auto max-w-4xl bg-white border border-amber-200 rounded-xl shadow-2xl p-6">
        <p className="text-gray-700 mb-4">{t("banner.text")}</p>

        {showDetails && (
          <div className="space-y-3 mb-4 border-t border-b border-amber-100 py-4">
            <label className="flex items-start gap-3">
              <input type="checkbox" checked disabled className="mt-1" />
              <span>
                <span className="block font-semibold text-espresso-800">
                  {t("categories.necessary.title")}
                </span>
                <span className="block text-sm text-gray-600">
                  {t("categories.necessary.description")}
                </span>
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="mt-1"
              />
              <span>
                <span className="block font-semibold text-espresso-800">
                  {t("categories.analytics.title")}
                </span>
                <span className="block text-sm text-gray-600">
                  {t("categories.analytics.description")}
                </span>
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={preferences}
                onChange={(e) => setPreferences(e.target.checked)}
                className="mt-1"
              />
              <span>
                <span className="block font-semibold text-espresso-800">
                  {t("categories.preferences.title")}
                </span>
                <span className="block text-sm text-gray-600">
                  {t("categories.preferences.description")}
                </span>
              </span>
            </label>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          {!showDetails && (
            <button
              onClick={() => setShowDetails(true)}
              className="text-amber-700 font-semibold hover:underline text-left"
            >
              {t("banner.customize")}
            </button>
          )}
          <div className="flex flex-col sm:flex-row gap-3 sm:ml-auto">
            <button
              onClick={rejectAll}
              className="border-2 border-gray-300 text-gray-700 px-5 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              {t("banner.rejectAll")}
            </button>
            {showDetails && (
              <button
                onClick={saveCustom}
                className="border-2 border-amber-600 text-amber-700 px-5 py-2 rounded-lg font-semibold hover:bg-amber-50 transition-colors"
              >
                {t("banner.saveChoice")}
              </button>
            )}
            <button
              onClick={acceptAll}
              className="bg-amber-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
            >
              {t("banner.acceptAll")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
