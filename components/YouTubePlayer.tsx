"use client";

import { useState } from "react";
import Image from "next/image";
import { youTubeEmbedUrl } from "@/lib/videoData";

/** Shows the poster with a play button and only loads the YouTube iframe
 * once the visitor clicks it — keeps the page light and sends nothing to
 * YouTube until the visitor actually wants to watch. */
export default function YouTubePlayer({
  youtubeId,
  poster,
  title,
  playLabel,
}: {
  youtubeId: string;
  poster: string;
  title: string;
  playLabel: string;
}) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        src={`${youTubeEmbedUrl(youtubeId)}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full aspect-video bg-black"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="relative block w-full aspect-video bg-black group"
      aria-label={`${playLabel}: ${title}`}
    >
      <Image src={poster} alt={title} fill unoptimized className="object-contain" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
          <svg viewBox="0 0 24 24" className="w-7 h-7 text-espresso-800 translate-x-0.5" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
    </button>
  );
}
