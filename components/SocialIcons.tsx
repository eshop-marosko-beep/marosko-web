import { socialLinks } from "@/lib/socialLinks";

function IconGlyph({ name }: { name: string }) {
  switch (name) {
    case "Facebook":
      return <span className="font-serif font-bold text-base leading-none">f</span>;
    case "LinkedIn":
      return <span className="font-bold text-[13px] leading-none">in</span>;
    case "Pinterest":
      return <span className="font-serif font-bold text-base leading-none">P</span>;
    case "X":
      return <span className="font-bold text-sm leading-none">X</span>;
    case "Instagram":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
        </svg>
      );
    case "YouTube":
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4">
          <polygon points="9,7 9,17 17,12" fill="currentColor" />
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
    default:
      return null;
  }
}

export default function SocialIcons() {
  return (
    <div className="flex items-center gap-3">
      {socialLinks.map(({ name, url }) => (
        <a
          key={name}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={name}
          title={name}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-cream-100/40 text-cream-100/80 hover:border-amber-400 hover:text-amber-400 transition-colors"
        >
          <IconGlyph name={name} />
        </a>
      ))}
    </div>
  );
}
