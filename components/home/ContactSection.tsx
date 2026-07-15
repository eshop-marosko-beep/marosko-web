"use client";

import { useTranslations } from "next-intl";
import ContactForm from "@/components/ContactForm";

export default function ContactSection() {
  const t = useTranslations("home.contactCta");

  return (
    <div id="kontakt">
      <ContactForm title={t("title")} subtitle={t("subtitle")} />
    </div>
  );
}
