"use client";

import { useRef } from "react";
import ReviewCard from "./ReviewCard";
import type { HeurekaReview } from "@/lib/heurekaReviews";

export default function ReviewsCarousel({
  reviews,
  anonymousLabel,
  ratingLabel,
  badgeLabel,
  prevLabel,
  nextLabel,
}: {
  reviews: HeurekaReview[];
  anonymousLabel: string;
  ratingLabel: (rating: number) => string;
  badgeLabel: string;
  prevLabel: string;
  nextLabel: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.firstElementChild as HTMLElement | null;
    const amount = (card?.offsetWidth ?? 320) + 32;
    track.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => scrollByCard(-1)}
        aria-label={prevLabel}
        className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg text-espresso-800 text-xl hover:bg-amber-50"
      >
        ‹
      </button>
      <div
        ref={trackRef}
        className="flex gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {reviews.map((review) => (
          <div
            key={review.id}
            className="snap-start shrink-0 w-[85%] sm:w-[45%] lg:w-[31%]"
          >
            <ReviewCard
              name={review.name ?? anonymousLabel}
              text={review.text}
              rating={review.rating}
              ratingLabel={ratingLabel(review.rating)}
              badgeLabel={badgeLabel}
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => scrollByCard(1)}
        aria-label={nextLabel}
        className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg text-espresso-800 text-xl hover:bg-amber-50"
      >
        ›
      </button>
    </div>
  );
}
