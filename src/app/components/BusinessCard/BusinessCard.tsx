"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useMemo, useState, useEffect, memo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useToast } from "../../contexts/ToastContext";
import Stars from "../Stars/Stars";
import PercentileChip from "../PercentileChip/PercentileChip";
import VerifiedBadge from "../VerifiedBadge/VerifiedBadge";
import PremiumHover from "../Animations/PremiumHover";

type Percentiles = {
  service: number;
  price: number;
  ambience: number;
};

type Business = {
  id: string;
  name: string;
  image: string;
  alt: string;
  category: string;
  location: string;
  rating: number;
  totalRating: number;
  reviews: number;
  badge?: string;
  href?: string;
  percentiles?: Percentiles;
  verified?: boolean;
  distance?: string;
  priceRange?: string;
};

function BusinessCard({ business }: { business: Business }) {
  const router = useRouter();
  const { showToast } = useToast();
  const idForSnap = useMemo(() => `business-${business.id}`, [business.id]);

  const [showActions, setShowActions] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Preload the review route
  const reviewRoute = useMemo(() => {
    const businessSlug = business.name.toLowerCase().replace(/[^a-z0-9]/g, "");
    return `/business/${businessSlug}/review`;
  }, [business.name]);

  useEffect(() => {
    const checkIsDesktop = () => setIsDesktop(window.innerWidth >= 640);
    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop);

    router.prefetch(reviewRoute);

    return () => window.removeEventListener("resize", checkIsDesktop);
  }, [router, reviewRoute]);

  useEffect(() => {
    if (!isDesktop && showActions) {
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest(`#${idForSnap}`)) {
          setShowActions(false);
        }
      };
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showActions, isDesktop, idForSnap]);

  const toggleActions = () => {
    if (!isDesktop) setShowActions(!showActions);
  };

  const handleWriteReview = () => {
    showToast(`Opening review form for ${business.name}... 📝`, "sage", 3000);
    router.push(reviewRoute);
  };
  const handleBookmark = () => console.log("Bookmark clicked:", business.name);
  const handleShare = () => console.log("Share clicked:", business.name);

  return (
    <li
      id={idForSnap}
      className="snap-start snap-always w-[calc(100vw-2rem)] sm:w-auto sm:min-w-[52%] md:min-w-[36%] xl:min-w-[22%] flex-shrink-0"
    >
      <PremiumHover scale={1.03} shadowIntensity="light" duration={0.4}>
        <div className="bg-off-white rounded-[6px] overflow-hidden shadow-sm group cursor-pointer">
          <div
            className="relative overflow-hidden rounded-t-[6px]"
            onClick={toggleActions}
          >
            <motion.div
              animate={{ scale: showActions ? 1.05 : 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative"
            >
              {!imgError ? (
                <Image
                  src={business.image}
                  alt={business.alt || business.name}
                  width={400}
                  height={320}
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="h-[360px] md:h-[320px] lg:h-[280px] w-full object-cover transition-transform duration-500 md:group-hover:scale-105 rounded-t-[6px]"
                  priority={false}
                  loading="lazy"
                  quality={85}
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="h-[360px] md:h-[320px] lg:h-[280px] w-full flex items-center justify-center bg-sage/10 text-sage rounded-t-[6px]">
                  <ion-icon
                    name="image-outline"
                    class="text-4xl md:text-5xl lg:text-6xl text-sage/70"
                  />
                </div>
              )}
            </motion.div>

            {/* overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 via-transparent to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />

            {/* shimmer effect */}
            <div className="absolute inset-0 -left-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform skew-x-12 md:group-hover:left-full transition-transform duration-700 ease-out" />

            {/* verified badge */}
            {business.verified && (
              <div className="absolute left-2 top-2 z-20">
                <VerifiedBadge />
              </div>
            )}

            {/* rating badge */}
            <span className="absolute right-2 top-2 z-20 inline-flex items-center gap-1 rounded bg-white/50 backdrop-blur-sm px-2 py-1 text-charcoal shadow-lg">
              <ion-icon name="star" class="text-coral text-sm drop-shadow-sm" />
              <span className="font-urbanist text-sm font-700">
                {business.totalRating.toFixed(1)}
              </span>
            </span>

            {/* actions */}
            <div
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 z-20 flex flex-col gap-2 transition-all duration-300 ease-out
            ${isDesktop
                ? "hidden sm:flex translate-x-12 opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100"
                : showActions
                ? "flex translate-x-0 opacity-100"
                : "flex translate-x-12 opacity-0 pointer-events-none"
              }`}
            >
              <button
                className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg md:hover:bg-white md:hover:scale-110 transition-all duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  handleWriteReview();
                }}
              >
                <ion-icon name="create-outline" class="text-base text-charcoal" />
              </button>
              <button
                className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg md:hover:bg-white md:hover:scale-110 transition-all duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBookmark();
                }}
              >
                <ion-icon name="heart-outline" class="text-base text-charcoal" />
              </button>
              <button
                className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg md:hover:bg-white md:hover:scale-110 transition-all duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare();
                }}
              >
                <ion-icon name="share-social-outline" class="text-base text-charcoal" />
              </button>
            </div>
          </div>

          <div className="p-5 relative">
            <div className="mb-1">
              <h3 className="font-urbanist text-base md:text-lg font-600 text-charcoal transition-colors duration-200 md:group-hover:text-sage">
                <Link
                  href={business.href || "#"}
                  prefetch={true}
                  className="md:hover:underline decoration-2 underline-offset-2"
                >
                  {business.name}
                </Link>
              </h3>
            </div>

            <p className="mb-3 font-urbanist text-sm font-400 text-charcoal/70 transition-colors duration-200 md:group-hover:text-charcoal/80">
              {business.category} - {business.location}
            </p>

            <div className="mb-4 flex items-center gap-2">
              <Stars value={business.rating} />
              <p className="font-urbanist text-sm font-400 leading-none text-charcoal/70">
                {business.reviews} reviews
              </p>
            </div>

            {business.percentiles && (
              <div className="flex items-center gap-2">
                <PercentileChip
                  label="Speed"
                  value={business.percentiles.service}
                />
                <PercentileChip
                  label="Hospitality"
                  value={business.percentiles.price}
                />
                <PercentileChip
                  label="Quality"
                  value={business.percentiles.ambience}
                />
              </div>
            )}
          </div>
        </div>
      </PremiumHover>
    </li>
  );
}

export default memo(BusinessCard);
export type { Business };
