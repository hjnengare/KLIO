"use client";

import Link from "next/link";
import { useEffect } from "react";
import confetti from "canvas-confetti";
import { useAuth } from "../contexts/AuthContext";
import { useReducedMotion } from "../utils/useReducedMotion";

// CSS animations for decorative elements
const styles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes float {
    0% { transform: translateY(0) scale(.95); opacity: 0; }
    10% { opacity: 1; }
    50% { transform: translateY(-40%) scale(1); }
    90% { opacity: 1; }
    100% { transform: translateY(-90%) scale(.95); opacity: 0; }
  }
  .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
  .float-anim { animation: float 4s ease-in-out infinite; }
  .float-anim.delay-400 { animation-delay: .4s; }
  .float-anim.delay-800 { animation-delay: .8s; }
  .delay-200 { animation-delay: 0.2s; }
  .delay-400 { animation-delay: 0.4s; }
  .delay-600 { animation-delay: 0.6s; }

  @media (prefers-reduced-motion: reduce) {
    .animate-fade-in-up, .float-anim { animation: none !important; }
  }
`;

export default function CompletePage() {
  const { updateUser, user } = useAuth();
  const reducedMotion = useReducedMotion();
  
  useEffect(() => {
    // Mark onboarding as complete
    updateUser({
      profile: {
        ...user?.profile,
        onboarding_complete: true,
        onboarding_step: 'complete',
        interests: user?.profile?.interests || [],
        sub_interests: user?.profile?.sub_interests || [],
        dealbreakers: user?.profile?.dealbreakers || [],
        created_at: user?.profile?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        id: user?.id || ''
      }
    });

    // Rain confetti effect on mount (respect reduced motion)
    if (!reducedMotion) {
      let cancelled = false;
      const duration = 2 * 1000; // 2 seconds
      const end = Date.now() + duration;

      (function frame() {
        if (cancelled) return;

        // left side
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["var(--coral)", "var(--sage)", "var(--charcoal)", "var(--off-white)"],
        });
        // right side
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["var(--coral)", "var(--sage)", "var(--charcoal)", "var(--off-white)"],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();

      return () => { cancelled = true; };
    }
  }, [updateUser, reducedMotion]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div
        className="min-h-dvh bg-gradient-to-br from-off-white via-off-white/98 to-off-white/95 flex flex-col items-center justify-center px-4 py-14 relative overflow-hidden"
        style={{
          // CSS variables for consistent design tokens
          "--coral": "hsl(16, 100%, 66%)",
          "--sage": "hsl(148, 20%, 38%)",
          "--charcoal": "hsl(0, 0%, 25%)",
          "--off-white": "hsl(0, 0%, 98%)",
        } as React.CSSProperties}
      >
      {/* Lightweight decorative elements */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-sage/30 to-sage/80 rounded-full blur-3xl opacity-0 animate-fade-in-up delay-200" />
        <div className="absolute bottom-32 right-16 w-56 h-56 bg-gradient-to-br from-coral/25 to-coral/80 rounded-full blur-3xl opacity-0 animate-fade-in-up delay-400" />
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-gradient-to-br from-charcoal/20 to-charcoal/20 rounded-full blur-2xl opacity-0 animate-fade-in-up delay-600" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-off-white/30 via-transparent to-off-white/20 pointer-events-none" />

      <div className="w-[90%] max-w-[700px] mx-auto relative z-10 text-center">
        {/* Headline & subhead */}
        <h1 className="font-urbanist text-2 md:text-5xl lg:text-5xl font-700 text-charcoal mb-4" aria-live="polite">
          You&apos;re all set!
        </h1>
        <p className="font-urbanist text-6 md:text-5 font-400 text-charcoal/70 mb-12">
          Time to discover what&apos;s out there.
        </p>

        {/* Small moving graphic */}
        <div className="relative mx-auto mb-14 h-28 w-full max-w-[420px]" aria-hidden="true">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute bottom-0 left-[15%] w-14 h-14 rounded-full bg-off-white border-2 border-coral flex items-center justify-center float-anim">
              <ion-icon name="happy-outline" style={{ fontSize: 22, color: "var(--charcoal)" }} aria-hidden="true" />
            </div>
            <div className="absolute bottom-0 left-[45%] w-14 h-14 rounded-full bg-off-white border-2 border-sage flex items-center justify-center float-anim delay-400">
              <ion-icon name="sparkles-outline" style={{ fontSize: 22, color: "var(--charcoal)" }} aria-hidden="true" />
            </div>
            <div className="absolute bottom-0 left-[75%] w-14 h-14 rounded-full bg-off-white border-2 border-coral flex items-center justify-center float-anim delay-800">
              <ion-icon name="checkmark-outline" style={{ fontSize: 22, color: "var(--charcoal)" }} aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* CTA */}
        <Link
          href="/home"
          data-testid="onboarding-complete-cta"
          aria-label="Go to Home"
          className="group inline-block w-full md:w-1/4 bg-sage text-white font-urbanist text-6 md:text-5 font-600 py-5 md:py-6 px-8 md:px-10 rounded shadow-lg transition-[transform,background-color,box-shadow] duration-300 hover:scale-[1.03] hover:bg-coral focus:bg-coral focus:outline-none focus:ring-4 focus:ring-coral/30 focus:ring-offset-2"
        >
          Go to Home
        </Link>
      </div>
      </div>

    </>
  );
}
