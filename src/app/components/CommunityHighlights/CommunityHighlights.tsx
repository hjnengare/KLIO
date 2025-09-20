"use client";

import { useRouter } from "next/navigation";
import ReviewerCard from "../ReviewerCard/ReviewerCard";
import BusinessOfTheMonthCard from "../BusinessCard/BusinessOfTheMonthCard";
import ScrollableSection from "../ScrollableSection/ScrollableSection";
import { Review, Reviewer, BusinessOfTheMonth } from "../../data/communityHighlightsData";

interface CommunityHighlightsProps {
  title?: string;
  reviews: Review[];
  topReviewers: Reviewer[];
  businessesOfTheMonth?: BusinessOfTheMonth[];
  cta?: string;
  href?: string;
  variant?: "reviews" | "reviewers";
}

export default function CommunityHighlights({
  title = "Community Highlights",
  reviews,
  topReviewers,
  businessesOfTheMonth,
  cta = "See Leaderboard...",
  href = "/leaderboard",
  variant = "reviews"
}: CommunityHighlightsProps) {
  const router = useRouter();

  const handleSeeMore = () => {
    router.push(href);
  };

  const displayData = variant === "reviewers"
    ? topReviewers.map(reviewer => ({
      id: reviewer.id,
      reviewer,
      businessName: "",
      businessType: "",
      rating: reviewer.rating,
      reviewText: "",
      date: "",
      likes: 0
    }))
    : reviews;

  return (
    <section className="bg-gradient-to-b from-off-white/95 to-off-white relative" aria-label="community highlights" data-section>
      {/* Subtle section decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 right-20 w-32 h-32 bg-gradient-to-br from-sage/8 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-gradient-to-br from-coral/10 to-transparent rounded-full blur-xl" />
      </div>

      <div className="container mx-auto max-w-[1300px] px-4 sm:px-6 md:px-8 relative z-10 pt-2 sm:pt-6 pb-2">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-[18px]">
          <h2 className="font-urbanist text-xl font-800 text-charcoal relative">
            {title}
            <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-sage to-coral rounded-full" />
          </h2>
          <button
            onClick={handleSeeMore}
            className="group font-urbanist font-700 text-charcoal/70 transition-all duration-300 hover:text-sage text-base"
          >
            <span className="transition-transform duration-300 group-hover:translate-x-[-1px]">
              {cta}
            </span>
          </button>
        </div>

        {/* Top Reviewers Subsection */}
        <div>
          <div className="mb-4 sm:mb-8 flex flex-wrap items-center justify-between gap-[18px]">
            <h3 className="font-urbanist text-base font-700 text-charcoal relative">
              Top Reviewers This Month In Claremont
            </h3>
          </div>
          <ScrollableSection>
            <ul className="flex snap-x gap-4 sm:gap-5 md:gap-6">
              {topReviewers.map((reviewer) => (
                <div key={reviewer.id}>
                  <ReviewerCard
                    reviewer={reviewer}
                    variant="reviewer"
                  />
                </div>
              ))}
            </ul>
          </ScrollableSection>
        </div>

        {/* Businesses of the Month Subsection */}
        {businessesOfTheMonth && businessesOfTheMonth.length > 0 && (
          <div className="mt-8 sm:mt-14 md:mt-16">
            <div className="mb-4 sm:mb-8 flex flex-wrap items-center justify-between gap-[18px]">
              <h3 className="font-urbanist text-base font-700 text-charcoal relative">
                Businesses of the Month
              </h3>
            </div>

            <div className="mb-4 sm:mb-5 md:mb-6 text-center">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-coral/10 rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
                <ion-icon name="trophy" class="text-coral text-base sm:text-lg" />
                <span className="font-urbanist font-600 text-coral text-base">
                  September 2025 Winners
                </span>
              </div>
            </div>

            <ScrollableSection>
              <ul className="flex snap-x gap-4 sm:gap-5 md:gap-6">
                {businessesOfTheMonth.map((business) => (
                  <div key={business.id}>
                    <BusinessOfTheMonthCard business={business} />
                  </div>
                ))}
              </ul>
            </ScrollableSection>
          </div>
        )}
      </div>
    </section>
  );
}