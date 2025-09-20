"use client";

import Link from "next/link";
import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

// CSS styles for consistent button radius
const styles = `
`;

interface DealBreaker {
  id: string;
  label: string;
  icon: string; // Ionicon name
}


export default function DealBreakersPage() {
  const [catalog, setCatalog] = useState<DealBreaker[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const { user, updateUser } = useAuth();

  // Load catalog and user selections on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Load catalog
        const catalogRes = await fetch('/api/deal-breakers');
        if (catalogRes.ok) {
          const catalogData = await catalogRes.json();
          setCatalog(catalogData.dealBreakers ?? []);
        }

        // Load user selections
        const userRes = await fetch('/api/user/deal-breakers');
        if (userRes.ok) {
          const userData = await userRes.json();
          setSelected(userData.dealBreakers ?? []);
        }
      } catch (error) {
        console.error('Error loading deal-breakers data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Save selections to API
  const saveSelections = useCallback(async (selections: string[]) => {
    try {
      await fetch('/api/user/deal-breakers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selections })
      });
    } catch (error) {
      console.error('Error saving deal-breakers:', error);
    }
  }, []);

  const toggle = useCallback((id: string) => {
    setSelected(prev => {
      const on = prev.includes(id);
      const next = on
        ? prev.filter(x => x !== id)
        : prev.length >= 3
          ? prev  // pick 2–3 max
          : [...prev, id];

      // Optimistically save selections
      saveSelections(next);
      return next;
    });
  }, [saveSelections]);

  const canContinue = useMemo(() =>
    selected.length >= 2 && selected.length <= 3,
    [selected.length]
  );

  const handleNext = useCallback(() => {
    if (!canContinue || !user) return;

    // Optimistic navigation - navigate immediately
    router.push("/complete");

    // Update user data asynchronously
    updateUser({ dealBreakers: selected });
  }, [canContinue, user, router, selected, updateUser]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="min-h-dvh bg-gradient-to-br from-off-white via-off-white/98 to-off-white/95 flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
        {/* Back button - top left */}
        <div className="absolute top-6 left-6 z-20">
          <Link
            href="/subcategories"
            className="text-charcoal/60 hover:text-charcoal transition-colors duration-300 p-2 hover:bg-charcoal/5 rounded-full"
          >
            <ion-icon name="arrow-back-outline" size="small"></ion-icon>
          </Link>
        </div>

        {/* Decorative background blobs */}
        <div className="absolute inset-0 opacity-4">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-sage/20 to-sage/85 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-32 right-16 w-40 h-40 bg-gradient-to-br from-coral/15 to-coral/85 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-br from-charcoal/10 to-charcoal/3 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        {/* Mesh overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-off-white/30 via-transparent to-off-white/20 pointer-events-none"></div>

        <div className="w-[90%] max-w-[700px] mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block relative mb-6">
              <h2 className="font-urbanist text-2xl md:text-4xl lg:text-5xl font-700 text-charcoal mb-5 md:mb-6 text-center leading-snug px-2 tracking-[0.01em]">
                Your deal-breakers
              </h2>

            </div>
            <p className="font-urbanist text-sm md:text-base font-400 text-charcoal/70 mb-10 md:mb-12 leading-relaxed px-4 max-w-lg md:max-w-2xl mx-auto">
              (Pick 2–3 that matter most to you)
            </p>
          </div>

          {/* Deal Breakers Grid */}
          <div className="grid grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12 justify-items-center">
            {loading ? (
              // Loading state
              <div className="col-span-2 text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage mx-auto mb-4"></div>
                <p className="font-urbanist text-charcoal/70">Loading deal-breakers...</p>
              </div>
            ) : (
              catalog.map((item) => {
                const isOn = selected.includes(item.id);

                return (
                  <button
                    key={item.id}
                    onClick={() => toggle(item.id)}
                    aria-pressed={isOn}
                    className="relative w-full max-w-[260px] aspect-square rounded-full transform-gpu transition-transform duration-500 ease-out"
                    style={{ perspective: "1200px" }}
                  >
                    {/* Flipper */}
                    <div
                      className="relative w-full h-full rounded-full transition-transform duration-500 ease-out"
                      style={{
                        transformStyle: "preserve-3d",
                        transform: isOn ? "rotateY(180deg)" : "",
                      }}
                    >
                      {/* FRONT (unselected) — SAGE circle with label */}
                      <div
                        className="absolute inset-0 flex items-center justify-center rounded-md bg-sage text-white font-urbanist"
                        style={{ backfaceVisibility: "hidden" }}
                      >
                        <span className="text-6 md:text-5 font-600">{item.label}</span>
                      </div>

                      {/* BACK (selected) — CORAL circle with icon */}
                      <div
                        className="absolute inset-0 flex items-center justify-center rounded-md bg-coral"
                        style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
                      >
                        <ion-icon
                          name={item.icon}
                          style={{ fontSize: "56px", color: "var(--charcoal)" }}
                        />
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Continue button */}
          <div className="pt-6">
            <button
              onClick={handleNext}
              disabled={!canContinue}
              className={`group block w-full py-3 md:w-1/4 px-8 md:px-10 rounded text-center font-urbanist text-6 md:text-5 font-600 transition-all duration-300 relative overflow-hidden
                        ${canContinue
                  ? "bg-gradient-to-r from-sage to-sage/90 text-white hover:scale-105 shadow-lg  focus:outline-none focus:ring-4 focus:ring-sage/30 focus:ring-offset-2"
                  : "bg-light-gray/50 text-charcoal/40 cursor-not-allowed"}`}
            >
              <span className="relative z-10">Continue</span>
              {canContinue && (
                <div className="absolute inset-0 bg-gradient-to-r from-sage/80 to-sage opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              )}
            </button>
          </div>

          <div className="text-center mt-4">
            <Link
              href="/complete"
              className="inline-block font-urbanist text-sm text-charcoal/60 hover:text-charcoal transition-colors duration-300 focus:outline-none focus:underline underline decoration-dotted"
              aria-label="Skip deal-breakers for now"
            >
              Skip for now
            </Link>
            <div className="mt-1 text-xs text-charcoal/50 max-w-sm mx-auto">
              <span>You can set deal-breakers later in your profile</span>
            </div>
          </div>



          {/* Progress indicator */}
          <div className="flex justify-center items-center space-x-2 mt-6 mb-4">
            <div className="w-3 h-3 bg-sage/40 rounded-full"></div>
            <div className="w-3 h-3 bg-sage/40 rounded-full"></div>
            <div className="w-3 h-3 bg-sage rounded-full"></div>
            <div className="w-3 h-3 bg-charcoal/20 rounded-full"></div>
          </div>

          <div className="text-center">
            <p className="font-urbanist text-8 font-400 text-charcoal/50">Step 3 of 4</p>
          </div>
        </div>
      </div>
    </>
  );
}
