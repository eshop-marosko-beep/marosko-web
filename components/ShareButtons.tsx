"use client";

import { usePathname } from "@/navigation";
import { useTranslations } from "next-intl";

function IconGlyph({ name }: { name: string }) {
  switch (name) {
    case "Facebook":
      return <span className="font-serif font-bold text-base leading-none">f</span>;
    case "X":
      return <span className="font-bold text-sm leading-none">X</span>;
    case "LinkedIn":
      return <span className="font-bold text-[13px] leading-none">in</span>;
    case "Pinterest":
      return <span className="font-serif font-bold text-base leading-none">P</span>;
    case "WhatsApp":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
          <path
            d="M6 4c-1 0-2 1-2 2 0 8 6 14 14 14 1 0 2-1 2-2l-.6-3.4-4-.6c-2-1-4.4-3.4-5.4-5.4l-.6-4L6 4z"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "Telegram":
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4">
          <path d="M3 11.5L20 4l-4 16-5-4-3 3-1-5-4-2.5z" fill="currentColor" />
        </svg>
      );
    case "Reddit":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
          <circle cx="12" cy="13" r="7" />
          <circle cx="9.5" cy="13" r="0.8" fill="currentColor" stroke="none" />
          <circle cx="14.5" cy="13" r="0.8" fill="currentColor" stroke="none" />
          <path d="M9 16c1 .8 5 .8 6 0" strokeLinecap="round" />
          <path d="M12 6v3" strokeLinecap="round" />
          <circle cx="12" cy="5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "Email":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M4 7l8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

const platforms = [
  {
    name: "Facebook",
    buildUrl: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: "X",
    buildUrl: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    name: "WhatsApp",
    buildUrl: (url: string, title: string) =>
      `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} ${url}`)}`,
  },
  {
    name: "LinkedIn",
    buildUrl: (url: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    name: "Reddit",
    buildUrl: (url: string, title: string) =>
      `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  },
  {
    name: "Telegram",
    buildUrl: (url: string, title: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    name: "Pinterest",
    buildUrl: (url: string, title: string) =>
      `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(title)}`,
  },
  {
    name: "Email",
    buildUrl: (url: string, title: string) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
  },
] as const;

export default function ShareButtons() {
  const pathname = usePathname();
  const t = useTranslations("share");

  if (pathname === "/") return null;

  const handleShare = (name: string, buildUrl: (url: string, title: string) => string) => {
    const url = window.location.href;
    const title = document.title;
    const target = buildUrl(url, title);

    if (name === "Email") {
      window.location.assign(target);
    } else {
      window.open(target, "_blank", "noopener,noreferrer,width=600,height=550");
    }
  };

  return (
    <div className="border-t border-amber-100">
      <div className="container mx-auto px-4 py-6 flex flex-wrap items-center gap-3">
        <span className="text-sm font-semibold text-espresso-800">{t("label")}</span>
        {platforms.map(({ name, buildUrl }) => (
          <button
            key={name}
            type="button"
            onClick={() => handleShare(name, buildUrl)}
            aria-label={`${t("shareOn")} ${name}`}
            title={name}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-amber-300 text-espresso-700 hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-colors"
          >
            <IconGlyph name={name} />
          </button>
        ))}
      </div>
    </div>
  );
}
