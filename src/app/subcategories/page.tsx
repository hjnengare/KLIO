"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { useOnboarding } from "../contexts/OnboardingContext";
import { useToast } from "../contexts/ToastContext";

// Lightweight CSS animations
const styles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes scaleIn {
    from { transform: scale(0); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  @keyframes microBounce {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20% { transform: translateX(-2px); }
    40% { transform: translateX(2px); }
    60% { transform: translateX(-2px); }
    80% { transform: translateX(2px); }
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.02); opacity: 0.9; }
  }
  .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
  .animate-scale-in { animation: scaleIn 0.4s ease-out forwards; }
  .animate-micro-bounce { animation: microBounce 0.3s ease-out; }
  .animate-shake { animation: shake 0.4s ease; }
  .animate-pulse-soft { animation: pulse 2s ease-in-out infinite; }
  .delay-100 { animation-delay: 0.1s; }
  .delay-200 { animation-delay: 0.2s; }
  .delay-300 { animation-delay: 0.3s; }
  .delay-400 { animation-delay: 0.4s; }
`;

interface SubcategoryItem {
  id: string;
  label: string;
  interest_id: string;
}

interface GroupedSubcategories {
  [interestId: string]: {
    title: string;
    items: SubcategoryItem[];
  };
}

// Interest titles mapping
const INTEREST_TITLES: Record<string, string> = {
  "food-drink": "Food & Drink",
  "arts-culture": "Arts & Culture",
  "beauty-wellness": "Beauty & Wellness",
  "home-services": "Home & Services",
  "outdoors-adventure": "Outdoors & Adventure",
  "nightlife-entertainment": "Nightlife & Entertainment",
  "family-pets": "Family & Pets",
  "shopping-lifestyle": "Shopping & Lifestyle",
};

// Detect reduced motion preference
const prefersReduced = typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Prevent hydration mismatch: true only after first client render */
function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

function SubcategoriesContent() {
  const mounted = useMounted();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { selectedSubInterests, setSelectedSubInterests, loadSubInterests, subInterests, isLoading } = useOnboarding();

  // State
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [animatingIds, setAnimatingIds] = useState<Set<string>>(new Set());
  const [hasLoadedSubcategories, setHasLoadedSubcategories] = useState(false);

  // Constants for min/max selection
  const MIN_SELECTIONS = 3;
  const MAX_SELECTIONS = 12;

  // Get selected interests from URL or user profile
  const selectedInterests = useMemo(() => {
    const fromUrl = searchParams?.get("interests")?.split(",").filter(Boolean) || [];
    const fromProfile = user?.profile?.interests || [];
    return fromUrl.length > 0 ? fromUrl : fromProfile;
  }, [searchParams, user?.profile?.interests]);

  // Typing animation effect
  useEffect(() => {
    if (!mounted) return;

    const fullText = "Tell us more...";
    let index = 0;

    const typeText = () => {
      if (index < fullText.length) {
        setDisplayedText(fullText.slice(0, index + 1));
        index++;
        setTimeout(typeText, 80);
      } else {
        setShowCursor(true);
      }
    };

    const timer = setTimeout(typeText, 300);

    // Cursor blinking effect
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    return () => {
      clearTimeout(timer);
      clearInterval(cursorTimer);
    };
  }, [mounted]);

  // Route protection - redirect if not authenticated
  useEffect(() => {
    if (mounted && !user) {
      router.replace('/login?redirect=/subcategories');
    }
  }, [mounted, user, router]);

  // Offline detection
  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  // Load subcategories based on selected interests
  useEffect(() => {
    if (!hasLoadedSubcategories) {
      setHasLoadedSubcategories(true);
      // Load subcategories filtered by selectedInterests (or all if empty)
      loadSubInterests(selectedInterests);
    }
  }, [selectedInterests, hasLoadedSubcategories, loadSubInterests]);

  // Load user's existing subcategory selections
  useEffect(() => {
    const loadUserSubcategories = async () => {
      if (!user || selectedSubInterests.length > 0) return;

      try {
        const response = await fetch('/api/user/subcategories');
        if (response.ok) {
          const data = await response.json();
          if (data.subcategories && data.subcategories.length > 0) {
            setSelectedSubInterests(data.subcategories);
          }
        }
      } catch (error) {
        console.error('Error loading user subcategories:', error);
      }
    };

    loadUserSubcategories();
  }, [user, selectedSubInterests.length, setSelectedSubInterests]);

  // Group subcategories by interest
  const groupedSubcategories: GroupedSubcategories = useMemo(() => {
    const grouped: GroupedSubcategories = {};

    subInterests.forEach(sub => {
      if (!grouped[sub.interest_id]) {
        grouped[sub.interest_id] = {
          title: INTEREST_TITLES[sub.interest_id] || sub.interest_id,
          items: []
        };
      }
      grouped[sub.interest_id].items.push(sub);
    });

    return grouped;
  }, [subInterests]);

  // Animation trigger helper
  const triggerMicroBounce = useCallback((id: string) => {
    if (prefersReduced) return;

    setAnimatingIds(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    setTimeout(() => {
      setAnimatingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 300);
  }, []);

  // Handle subcategory toggle
  const handleSubcategoryToggle = useCallback(async (subcategoryId: string) => {
    const isCurrentlySelected = selectedSubInterests.includes(subcategoryId);

    // Trigger micro-bounce animation
    triggerMicroBounce(subcategoryId);

    // If trying to select but already at max, prevent with feedback
    if (!isCurrentlySelected && selectedSubInterests.length >= MAX_SELECTIONS) {
      showToast(`Maximum ${MAX_SELECTIONS} subcategories allowed`, 'warning', 2000);
      // Add visual shake effect
      const button = document.querySelector(`[data-subcategory-id="${subcategoryId}"]`);
      if (button) {
        button.classList.add('animate-shake');
        setTimeout(() => button.classList.remove('animate-shake'), 400);
      }
      return;
    }

    // Calculate new selection
    const newSelection = isCurrentlySelected
      ? selectedSubInterests.filter(id => id !== subcategoryId)
      : [...selectedSubInterests, subcategoryId];

    // Optimistic update
    setSelectedSubInterests(newSelection);

    // Show contextual feedback
    if (!isCurrentlySelected) {
      if (newSelection.length === MIN_SELECTIONS) {
        showToast('🎉 Great! You can continue now', 'sage', 2000);
      } else if (newSelection.length === MAX_SELECTIONS) {
        showToast('✨ Perfect selection!', 'sage', 2000);
      }
    }

    // Save to API
    try {
      const response = await fetch('/api/user/subcategories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selections: newSelection }),
      });

      if (!response.ok) {
        showToast('Failed to save subcategories', 'error', 3000);
      }
    } catch (error) {
      console.error('Error saving subcategories:', error);
      showToast('Failed to save subcategories', 'error', 3000);
    }
  }, [selectedSubInterests, setSelectedSubInterests, showToast, triggerMicroBounce]);

  // Check if user can proceed
  const canProceed = useMemo(() => {
    return selectedSubInterests.length >= MIN_SELECTIONS && !isNavigating && !!user;
  }, [selectedSubInterests.length, isNavigating, user]);

  // Handle next step
  const handleNext = useCallback(async () => {
    if (!canProceed || isLoading) return;
    setIsNavigating(true);

    try {
      // Show success message
      showToast(`Moving to next step with ${selectedSubInterests.length} subcategories!`, 'success', 2000);

      // Navigate to next step
      router.push('/deal-breakers');
    } catch (error) {
      console.error("Error proceeding to next step:", error);
      setIsNavigating(false);
      showToast('Failed to proceed. Please try again.', 'error', 3000);
    }
  }, [canProceed, isLoading, selectedSubInterests.length, router, showToast]);

  // Don't render anything if not authenticated
  if (!user) {
    return (
      <div className="min-h-dvh bg-gradient-to-br from-off-white via-off-white/98 to-off-white/95 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-sage/20 border-t-sage rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-urbanist text-base text-charcoal/70">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Hydration-safe selections
  const hydratedSelected = mounted ? selectedSubInterests : [];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div className="min-h-dvh bg-gradient-to-br from-off-white via-off-white/98 to-off-white/95 flex flex-col px-4 py-6 pb-24 sm:py-8 sm:pb-20 md:pb-16 relative overflow-hidden">

        {/* Back button */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20">
          <Link href="/interests" className="text-charcoal/60 hover:text-charcoal transition-colors duration-300 p-2 hover:bg-charcoal/5 rounded-full">
            <ion-icon name="arrow-back-outline" size="small"></ion-icon>
          </Link>
        </div>

        {/* Offline indicator */}
        {!isOnline && (
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
            <div className="bg-orange-100 border border-orange-200 rounded-full px-3 py-1 flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="font-urbanist text-xs font-600 text-orange-700">Offline</span>
            </div>
          </div>
        )}

        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto relative z-10 flex-1 flex flex-col justify-center py-8 sm:py-12">

          {/* Header */}
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <div className="inline-block relative mb-6">
              <h2 className="font-urbanist text-xl sm:text-2xl md:text-4xl lg:text-5xl font-700 text-charcoal mb-3 sm:mb-4 md:mb-6 text-center leading-snug px-2 tracking-[0.01em]">
                <span className="relative">
                  {displayedText}
                  <span
                    className={`inline-block w-1 md:w-2 h-6 md:h-12 bg-sage ml-1 transition-opacity duration-100 ${showCursor ? "opacity-100" : "opacity-0"}`}
                    style={{ animation: showCursor ? "blink 1s infinite" : "none" }}
                  />
                </span>
              </h2>
            </div>
            <p className="font-urbanist text-sm md:text-base font-400 text-charcoal/70 mb-6 sm:mb-8 md:mb-10 leading-relaxed px-2 max-w-lg mx-auto">
              Pick at least {MIN_SELECTIONS} across any sections to personalize your experience
            </p>
          </div>

          {/* Selection Counter */}
          <div className="text-center mb-6">
            <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 mb-3 transition-colors duration-300 ${hydratedSelected.length >= MIN_SELECTIONS
              ? 'bg-sage/10 border border-sage/30'
              : 'bg-sage/10 border border-sage/20'
              }`}>
              <span
                className={`font-urbanist text-sm font-600 ${hydratedSelected.length >= MIN_SELECTIONS ? 'text-sage' : 'text-sage'
                  }`}
                aria-live="polite"
                aria-atomic="true"
              >
                {hydratedSelected.length} of {MIN_SELECTIONS}-{MAX_SELECTIONS} selected
              </span>
              {hydratedSelected.length >= MIN_SELECTIONS && (
                <ion-icon name="checkmark-circle" style={{ color: "hsl(148, 20%, 38%)" }} size="small" />
              )}
            </div>
            <p
              className="font-urbanist text-xs text-charcoal/60"
              aria-live="polite"
            >
              {hydratedSelected.length < MIN_SELECTIONS
                ? `Select ${MIN_SELECTIONS - hydratedSelected.length} more to continue`
                : hydratedSelected.length === MAX_SELECTIONS
                  ? "Perfect! You've selected the maximum"
                  : "Great! You can continue or select more"
              }
            </p>
          </div>

          {/* Loading */}
          {isLoading && Object.keys(groupedSubcategories).length === 0 ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-sage/20 border-t-sage rounded-full animate-spin mx-auto mb-4"></div>
              <p className="font-urbanist text-base text-charcoal/70">Loading subcategories...</p>
            </div>
          ) : (
            <>
              {/* Sections: subheading + 3-per-row animated pills */}
              <div className="space-y-8 mb-8">
                {Object.entries(groupedSubcategories).map(([interestId, section], sectionIndex) => (
                  <section key={interestId} className="animate-fade-in-up" style={{ animationDelay: `${sectionIndex * 100}ms` }}>
                    <h3 className="font-urbanist text-lg md:text-xl font-600 text-charcoal mb-4 px-1">
                      {section.title}
                    </h3>

                    <div className="grid grid-cols-3 gap-3 md:gap-4">
                      {section.items.map((subcategory, idx) => {
                        const isSelected = hydratedSelected.includes(subcategory.id);
                        const isDisabled = !isSelected && hydratedSelected.length >= MAX_SELECTIONS;

                        return (
                          <button
                            key={subcategory.id}
                            data-subcategory-id={subcategory.id}
                            onClick={() => handleSubcategoryToggle(subcategory.id)}
                            disabled={isDisabled}
                            aria-pressed={isSelected}
                            aria-label={`${subcategory.label}${isSelected ? ' (selected)' : isDisabled ? ' (maximum reached)' : ''}`}
                            className={`
                                  relative w-full py-3 md:py-4 px-3 md:px-4
                                  font-urbanist text-xs md:text-sm font-600 text-center
                                  transition-all duration-200 ease-out
                                  min-h-[44px]
                                  rounded-full
                                  focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2
                                  disabled:cursor-not-allowed disabled:opacity-60
                                  ${animatingIds.has(subcategory.id) ? 'animate-micro-bounce' : ''}

                                  ${isSelected
                                ? [

                                  "text-white shadow-md",
                                  "bg-gradient-to-r from-sage to-coral",
                                  "border-0",
                                  "ring-1 ring-white/20",
                                  "hover:from-sage/90 hover:to-coral/90"
                                ].join(" ")
                                : isDisabled
                                  ? [

                                    "bg-gray-100 border-2 border-gray-200 text-gray-400"
                                  ].join(" ")
                                  : [
                                    "bg-white border-2 border-sage text-charcoal",
                                    "hover:border-sage hover:bg-sage/5 hover:scale-[1.02]"
                                  ].join(" ")
                              }
  `}
                            style={{ animationDelay: `${(idx % 3) * 50}ms` }}
                          >
                            <span className="truncate">{subcategory.label}</span>

                            {isSelected && (
                              <div className="absolute top-1 right-1">
                                <ion-icon
                                  name="checkmark-circle"
                                  size="small"
                                  style={{ filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.15))" }}
                                />
                              </div>
                            )}
                          </button>

                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>

              {/* Continue Button */}
              <div className="pt-6">
                <button
                  className={`
                    group block w-full text-white font-urbanist text-sm sm:text-base font-600 py-3 sm:py-3.5 md:py-4 px-4 sm:px-6 md:px-8 rounded shadow-lg transition-all duration-300 relative text-center min-h-[44px] whitespace-nowrap
                    ${canProceed
                      ? "bg-gradient-to-r from-sage to-sage/90 hover:from-coral hover:to-coral/90 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-sage/30 focus:ring-offset-2 animate-pulse-soft"
                      : "bg-off-white/90 text-charcoal/40 cursor-not-allowed"
                    }
                  `}
                  onClick={handleNext}
                  disabled={!canProceed}
                  aria-label={`Continue with ${hydratedSelected.length} selected subcategories`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {(isNavigating || isLoading) && (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                    Continue {hydratedSelected.length > 0 && `(${hydratedSelected.length} selected)`}
                    <ion-icon name="arrow-forward" size="small" />
                  </span>
                  {canProceed && (
                    <span className="pointer-events-none absolute inset-0 rounded bg-gradient-to-r from-coral to-coral/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                </button>
              </div>

              {/* Skip Option */}
              <div className="text-center mt-4">
                <Link
                  href="/deal-breakers"
                  className="inline-block font-urbanist text-sm text-charcoal/60 hover:text-charcoal transition-colors duration-300 focus:outline-none focus:underline underline decoration-dotted"
                  aria-label="Skip subcategory selection for now"
                >
                  Skip for now
                </Link>
                <div className="mt-1 text-xs text-charcoal/50 max-w-sm mx-auto">
                  {hydratedSelected.length < MIN_SELECTIONS ? (
                    <span>We'll suggest popular options instead</span>
                  ) : (
                    <span>You can always update your preferences later</span>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Progress Stepper */}
          <div className="flex justify-center items-center space-x-2 mt-8 mb-4">
            <div className="w-3 h-3 bg-sage/40 rounded-full" />
            <div className="w-3 h-3 bg-sage rounded-full" />
            <div className="w-3 h-3 bg-charcoal/20 rounded-full" />
            <div className="w-3 h-3 bg-charcoal/20 rounded-full" />
          </div>

          <div className="text-center">
            <p className="font-urbanist text-xs font-400 text-charcoal/50">Step 2 of 4</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default function SubcategoriesPage() {
  return <SubcategoriesContent />;
}