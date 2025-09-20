"use client";

import { useRouter } from "next/navigation";
import EventCard from "../EventCard/EventCard";
import { Event } from "../../data/eventsData";
import ScrollableSection from "../ScrollableSection/ScrollableSection";
import { useScrollReveal } from "../../hooks/useScrollReveal";

export default function EventsSpecials({
  title = "Events & Specials",
  events,
  cta = "See More...",
  href = "/events",
}: {
  title?: string;
  events: Event[];
  cta?: string;
  href?: string;
}) {
  const router = useRouter();
  const titleRef = useScrollReveal({ className: 'scroll-reveal-right' });
  const sectionRef = useScrollReveal({ className: 'scroll-reveal' });

  const handleSeeMore = () => {
    router.push(href);
  };

  return (
    <section ref={sectionRef} className="bg-gradient-to-b from-off-white to-off-white/95 relative" aria-label="events and specials" data-section>
      {/* Subtle section decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-20 w-32 h-32 bg-gradient-to-br from-coral/10 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-br from-sage/8 to-transparent rounded-full blur-xl" />
      </div>
      
      <div className="container mx-auto max-w-[1300px] px-4 relative z-10 pt-2 sm:pt-6 pb-6 sm:pb-8">
        <div ref={titleRef} className="mb-6 sm:mb-12 flex flex-wrap items-center justify-between gap-[18px]">
          <h2 className="font-urbanist text-xl font-800 text-charcoal relative">
            {title}
            <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-sage to-coral rounded-full" />
          </h2>
          <button
            onClick={handleSeeMore}
            className="group font-urbanist font-700 text-charcoal/70 transition-all duration-300 hover:text-sage text-base premium-hover"
          >
            <span className="transition-transform duration-300 group-hover:translate-x-[-1px]">
              {cta}
            </span>
          </button>
        </div>

        <ScrollableSection className="gap-6">
          <div className="flex snap-x gap-6">
            {events.map((event, index) => (
              <div
                key={event.id}
                className={`premium-hover card-entrance card-entrance-${Math.min(index + 1, 6)}`}
                data-scroll-reveal
              >
                <EventCard event={event} />
              </div>
            ))}
          </div>
        </ScrollableSection>
      </div>
    </section>
  );
}