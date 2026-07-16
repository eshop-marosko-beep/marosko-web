"use client";

import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { openCookieSettings } from "@/lib/cookieConsent";
import SocialIcons from "@/components/SocialIcons";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-espresso-900 text-cream-100 mt-12">
      <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-bold text-white mb-3">{t("companyTitle")}</h3>
          <p className="text-sm text-cream-100/80 leading-relaxed">
            Marián s.r.o.
            <br />
            Vrádište 138, 908 49 Vrádište
            <br />
            IČO: 47546298
            <br />
            DIČ: 2023992916
            <br />
            IČ DPH: SK2023992916
          </p>
        </div>

        <div>
          <h3 className="font-bold text-white mb-3">{t("contactTitle")}</h3>
          <p className="text-sm text-cream-100/80 leading-relaxed">
            {t("productInquiries")}: +421 915 723 250
            <br />
            {t("shipping")}: +421 949 584 525
            <br />
            Email: eshop.marosko@gmail.com
          </p>
        </div>

        <div>
          <h3 className="font-bold text-white mb-3">{t("linksTitle")}</h3>
          <ul className="text-sm space-y-2">
            <li>
              <Link href="/gdpr" className="text-cream-100/80 hover:text-white transition-colors">
                {t("gdprLink")}
              </Link>
            </li>
            <li>
              <button
                onClick={openCookieSettings}
                className="text-cream-100/80 hover:text-white transition-colors text-left"
              >
                {t("cookieSettingsLink")}
              </button>
            </li>
            <li>
              <a
                href="https://eshop.marosko.sk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream-100/80 hover:text-white transition-colors"
              >
                eshop.marosko.sk
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 flex flex-col items-center gap-4">
        <SocialIcons />
        <p className="text-center text-sm text-cream-100/70">
          © {new Date().getFullYear()} Marián s.r.o. – {t("rights")}
        </p>
      </div>
    </footer>
  );
}
