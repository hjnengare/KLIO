"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import Stars from "../Stars/Stars";
import VerifiedBadge from "../VerifiedBadge/VerifiedBadge";
import { BusinessOfTheMonth } from "../../data/communityHighlightsData";

export default function BusinessOfTheMonthCard({ business }: { business: BusinessOfTheMonth }) {
  const idForSnap = useMemo(() => `business-month-${business.id}`, [business.id]);
  const [imgError, setImgError] = useState(false);
  
  const getBadgeStyle = (badge: string) => {
    switch (badge) {
      case "winner":
        return "bg-gradient-to-r from-amber-500 to-yellow-600 text-white";
      case "runner-up":
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white";
      case "featured":
        return "bg-gradient-to-r from-sage to-sage/80 text-white";
      default:
        return "bg-sage/10 text-sage";
    }
  };

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case "winner":
        return "🏆";
      case "runner-up":
        return "🥈";
      case "featured":
        return "⭐";
      default:
        return "";
    }
  };

  return (
    <li id={idForSnap} className="snap-start w-[280px] sm:w-[320px] flex-shrink-0">
      <div className="bg-off-white rounded-[6px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] group cursor-pointer">
        <div className="relative overflow-hidden rounded-t-[6px]">
          {!imgError ? (
            <Image
              src={business.image}
              alt={business.alt}
              width={400}
              height={320}
              className="h-[200px] w-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-t-[6px]"
              priority={false}
              loading="lazy"
              quality={85}
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="h-[200px] w-full flex items-center justify-center bg-sage/10 text-sage rounded-t-[6px]">
              <ion-icon
                name="image-outline"
                class="text-4xl md:text-5xl text-sage/70"
              />
            </div>
          )}
          
          {/* Subtle overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Silver shimmer effect on hover */}
          <div className="absolute inset-0 -left-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform skew-x-12 group-hover:left-full transition-transform duration-700 ease-out" />
          
          {/* Achievement badge - positioned above image */}
          <div className="absolute left-2 top-2 z-20">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[14px] font-urbanist font-700 shadow-xl ${getBadgeStyle(business.badge)}`}>
              <span>{getBadgeIcon(business.badge)}</span>
              <span className="drop-shadow-sm">{business.monthAchievement}</span>
            </span>
          </div>
          
          {/* Instagram-style verified badge */}
          {business.verified && (
            <div className="absolute left-2 bottom-2 z-20">
              <VerifiedBadge />
            </div>
          )}
          
          {/* Numeric rating badge - positioned above image */}
          <span className="absolute right-2 top-2 z-20 inline-flex items-center gap-1 rounded bg-white/50 backdrop-blur-sm px-2 py-1 text-charcoal shadow-lg">
            <ion-icon name="star" class="text-coral text-[14px] drop-shadow-sm" />
            <span className="font-urbanist text-9 font-700">{business.totalRating.toFixed(1)}</span>
          </span>

          {/* Card Actions - slide in from right on hover - hidden on mobile */}
          <div className="hidden sm:flex absolute right-2 bottom-2 z-20 flex-col gap-2 transform translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out">
            <button className="w-8 h-8 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-200">
              <ion-icon name="create-outline" class="text-charcoal" style={{fontSize: '24px'}} />
            </button>
            <button className="w-8 h-8 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-200">
              <ion-icon name="bookmark-outline" class="text-charcoal" style={{fontSize: '24px'}} />
            </button>
            <button className="w-8 h-8 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-200">
              <ion-icon name="share-outline" class="text-charcoal" style={{fontSize: '24px'}} />
            </button>
          </div>
        </div>

        <div className="p-5 relative">
          {/* Business name - left aligned as in wireframe */}
          <div className="mb-1">
            <h3 className="font-urbanist text-base md:text-lg font-600 text-charcoal transition-colors duration-200 group-hover:text-sage">
              <Link href={business.href || "#"} className="hover:underline decoration-2 underline-offset-2">
                {business.name}
              </Link>
            </h3>
          </div>

          {/* Category line - left aligned and subtle */}
          <p className="mb-3 font-urbanist text-sm font-400 text-charcoal/70 transition-colors duration-200 group-hover:text-charcoal/80">
            {business.category} • {business.location}
          </p>

          {/* Stars + reviews - left aligned */}
          <div className="mb-4 flex items-center gap-2">
            <Stars value={business.rating} />
            <p className="font-urbanist text-sm font-400 leading-none text-charcoal/70 transition-colors duration-200">{business.reviews} reviews</p>
          </div>

          {/* Month achievement at bottom */}
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 rounded-full bg-coral/10 text-coral text-xs font-urbanist font-600">
              September Winner
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}