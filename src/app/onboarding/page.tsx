"use client";

import Link from "next/link";
import { useMounted } from "../hooks/useMounted";

// Lightweight CSS animations instead of heavy Framer Motion
const styles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideInLine {
    from { width: 0%; }
    to { width: 100%; }
  }
  @keyframes scaleIn {
    from { transform: scale(0); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
  .animate-scale-in { animation: scaleIn 0.6s ease-out forwards; }
  .animate-line { animation: slideInLine 1.2s ease-out 1.1s forwards; }
  .animate-fade-in-up-bg { animation: fadeInUp 0.8s ease-out forwards; }
  .delay-200 { animation-delay: 0.2s; }
  .delay-400 { animation-delay: 0.4s; }
  .delay-600 { animation-delay: 0.6s; }
  .delay-800 { animation-delay: 0.8s; }
  .delay-1000 { animation-delay: 1s; }
  .delay-1200 { animation-delay: 1.2s; }
  .delay-1400 { animation-delay: 1.4s; }
  .delay-1600 { animation-delay: 1.6s; }

  /* Disable background glow animations on mobile */
  @media (max-width: 768px) {
    .animate-fade-in-up-bg {
      animation: none;
      opacity: 0.3;
    }
  }
`;

export default function OnboardingPage() {
  const mounted = useMounted();

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="min-h-dvh bg-gradient-to-br from-off-white via-off-white/98 to-off-white/95 flex flex-col items-center justify-center px-4 py-4 md:py-8 relative overflow-hidden">

        {/* Lightweight decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-sage/30 to-sage/80 rounded-full blur-3xl opacity-0 animate-fade-in-up-bg delay-200" />
          <div className="absolute bottom-32 right-16 w-56 h-56 bg-gradient-to-br from-coral/25 to-coral/80 rounded-full blur-3xl opacity-0 animate-fade-in-up-bg delay-400" />
          <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-gradient-to-br from-charcoal/20 to-charcoal/20 rounded-full blur-2xl opacity-0 animate-fade-in-up-bg delay-600" />
        </div>

        <div className="w-full max-w-full px-6 md:max-w-4xl md:px-4 mx-auto relative z-10">
          {/* App Name */}
          <div className="text-center mb-8 md:mb-12 opacity-0 animate-fade-in-up delay-400">
            <div className="inline-block relative">
              <h1 className="font-urbanist text-xl md:text-2xl font-700 text-charcoal mb-1.5 relative tracking-tight">
                KLIO
              </h1>
            </div>
          </div>

          {/* Main Content */}
          <div className="text-center mb-10 md:mb-14">
            <div className="opacity-0 animate-fade-in-up delay-600">
              <h2 className="font-urbanist text-2xl md:text-4xl lg:text-5xl font-700 text-charcoal mb-5 md:mb-6 text-center leading-snug px-2 tracking-[0.01em]">
                Discover trusted local gems near you!
              </h2>
            </div>

            <div className="opacity-0 animate-fade-in-up delay-800">
              <p className="font-urbanist text-sm md:text-base font-400 text-charcoal/70 mb-10 md:mb-12 leading-relaxed px-4 max-w-lg md:max-w-2xl mx-auto">
                Let&apos;s find your new favourite spot and connect with authentic experiences in your community
              </p>
            </div>

            {/* CTAs */}
            <div className="space-y-4 md:space-y-5 max-w-xs md:max-w-md mx-auto">
              <div className="opacity-0 animate-fade-in-up delay-1000">
                <Link
                  href="/register"
                  className="group block w-full bg-gradient-to-r from-sage to-sage/90 hover:from-coral hover:to-coral/90 text-white font-urbanist text-sm sm:text-base font-600 py-3 sm:py-3.5 md:py-4 px-4 sm:px-6 md:px-8 rounded shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-sage/20 hover:focus:ring-coral/20 focus:ring-offset-1 relative overflow-hidden text-center hover:scale-[1.02] min-h-[44px]"
                >
                  <span className="relative z-10">Get Started</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-coral to-coral/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </div>

              <div className="opacity-0 animate-fade-in-up delay-1200">
                <Link
                  href="/login"
                  className="group block w-full text-coral hover:text-coral/80 font-urbanist text-sm sm:text-base font-600 py-3 sm:py-3.5 md:py-4 px-4 sm:px-6 md:px-8 rounded transition-all duration-300 focus:outline-none relative text-center hover:scale-[1.01] min-h-[44px]"
                >
                  <span className="relative z-10">Log in</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="flex justify-center items-center space-x-6 md:space-x-10 text-charcoal/60 text-center px-4">
            <div className="flex flex-col items-center space-y-1.5 md:space-y-2 opacity-0 animate-scale-in delay-1400">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-sage/10 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 md:w-5 md:h-5 bg-sage rounded-full" />
              </div>
              <span className="font-urbanist text-xs md:text-sm font-500 tracking-tight">Trusted</span>
            </div>

            <div className="flex flex-col items-center space-y-1.5 md:space-y-2 opacity-0 animate-scale-in delay-1600">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-coral/10 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 md:w-5 md:h-5 bg-coral rounded-full" />
              </div>
              <span className="font-urbanist text-xs md:text-sm font-500 tracking-tight">Local</span>
            </div>

            <div className="flex flex-col items-center space-y-1.5 md:space-y-2 opacity-0 animate-scale-in delay-1800">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-charcoal/10 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 md:w-5 md:h-5 bg-charcoal rounded-full" />
              </div>
              <span className="font-urbanist text-xs md:text-sm font-500 tracking-tight">Authentic</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}