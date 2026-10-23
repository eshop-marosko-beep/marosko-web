"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/navigation";

export default function LogoutButton() {
  const t = useTranslations("rental");
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await fetch("/api/rental/logout", { method: "POST" }).catch(() => null);
        router.push("/pozicovna");
        router.refresh();
      }}
      className="text-sm font-semibold text-gray-600 hover:text-amber-700 underline disabled:opacity-60"
    >
      {t("logout")}
    </button>
  );
}
