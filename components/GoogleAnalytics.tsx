"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import {
  COOKIE_CONSENT_CHANGED_EVENT,
  readCookieConsent,
} from "@/lib/cookieConsent";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function GoogleAnalytics() {
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false);

  useEffect(() => {
    setAnalyticsAllowed(readCookieConsent()?.analytics ?? false);

    const handleChange = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setAnalyticsAllowed(Boolean(detail?.analytics));
    };
    window.addEventListener(COOKIE_CONSENT_CHANGED_EVENT, handleChange);
    return () => window.removeEventListener(COOKIE_CONSENT_CHANGED_EVENT, handleChange);
  }, []);

  if (!GA_ID || !analyticsAllowed) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
