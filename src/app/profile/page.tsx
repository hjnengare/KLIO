"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../contexts/AuthContext";
import Header from "../components/Header/Header";
import { Ion } from "../components/Ion";
import { getBrowserSupabase } from "../lib/supabase/client";
import { useScrollReveal } from "../hooks/useScrollReveal";

// Dynamic imports
const BottomNav = dynamic(() => import("../components/Navigation/BottomNav"), { ssr: false });

// Types based on new database schema
interface UserProfile {
  user_id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  locale: string;
  onboarding_step: string;
  is_top_reviewer: boolean;
  reviews_count: number;
  badges_count: number;
  interests_count: number;
  last_interests_updated: string | null;
  created_at: string;
  updated_at: string;
}

interface UserInterest {
  interest_id: string;
  interests: {
    id: string;
    name: string;
  };
}

interface Review {
  id: string;
  business_name: string;
  rating: number;
  review_text: string | null;
  is_featured: boolean;
  created_at: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  category: string;
}

interface UserAchievement {
  achievement_id: string;
  earned_at: string;
  achievements: Achievement;
}

/** A robust avatar that:
 *  - Uses `profilePicture` if provided
 *  - Falls back to ionicon person placeholder
 *  - Handles image load errors and swaps to fallback gracefully
 */
function SafeAvatar({
  src,
  alt,
  username,
  size = 64,
  className = "",
}: {
  src?: string;
  alt: string;
  username: string;
  size?: number;
  className?: string;
}) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // If no src provided or image failed to load, show ionicon placeholder
  const showPlaceholder = !src || !src.trim() || imageError;

  if (showPlaceholder) {
    return (
      <div
        className={`${className} bg-sage/10 flex items-center justify-center border border-sage/20`}
        style={{ width: size, height: size }}
      >
        <Ion
          name="person"
          className={`text-sage text-[${Math.max(size * 0.5, 24)}px]`}
          label="Profile picture placeholder"
        />
      </div>
    );
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className={className}
        onError={() => setImageError(true)}
        onLoad={() => setImageLoaded(true)}
        placeholder="empty"
        // NOTE: if you are doing static export, use `unoptimized` here or set `images.unoptimized = true`
        // unoptimized
      />
      {/* Show ionicon while loading */}
      {!imageLoaded && !imageError && (
        <div
          className="absolute inset-0 bg-sage/10 flex items-center justify-center border border-sage/20"
          style={{ width: size, height: size }}
        >
          <Ion
            name="person"
            className={`text-sage text-[${Math.max(size * 0.5, 24)}px]`}
            label="Loading profile picture"
          />
        </div>
      )}
    </div>
  );
}

function ProfileContent() {
  const { user, logout } = useAuth();
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userInterests, setUserInterests] = useState<UserInterest[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all user data from database
  useEffect(() => {
    const loadProfileData = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        setError(null);
        const supabase = getBrowserSupabase();

        // Fetch user profile with all fields
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select(`
            user_id,
            username,
            display_name,
            avatar_url,
            locale,
            onboarding_step,
            is_top_reviewer,
            reviews_count,
            badges_count,
            interests_count,
            last_interests_updated,
            created_at,
            updated_at
          `)
          .eq('user_id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          setError('Failed to load profile data');
          return;
        }

        // Fetch user interests with interest details
        const { data: interestsData, error: interestsError } = await supabase
          .from('user_interests')
          .select(`
            interest_id,
            interests(id, name)
          `)
          .eq('user_id', user.id);

        // Fetch user reviews
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('id, business_name, rating, review_text, is_featured, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        // Fetch user achievements with achievement details
        const { data: achievementsData, error: achievementsError } = await supabase
          .from('user_achievements')
          .select(`
            achievement_id,
            earned_at,
            achievements(id, name, description, icon, category)
          `)
          .eq('user_id', user.id);

        if (interestsError) {
          console.error('Error fetching interests:', interestsError);
        }
        if (reviewsError) {
          console.error('Error fetching reviews:', reviewsError);
        }
        if (achievementsError) {
          console.error('Error fetching achievements:', achievementsError);
        }

        setProfile(profileData);
        setUserInterests(interestsData || []);
        setReviews(reviewsData || []);
        setAchievements(achievementsData || []);
      } catch (err) {
        console.error('Unexpected error loading profile:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [user?.id]);

  // IMPORTANT: pass tokens separately to avoid DOMTokenList InvalidCharacterError
  const headerRef = useScrollReveal({ className: ["scroll-reveal"] });
  const statsRef = useScrollReveal({ className: ["scroll-reveal", "stagger-1"] });
  const contributionsRef = useScrollReveal({ className: ["scroll-reveal", "stagger-2"] });
  const achievementsRef = useScrollReveal({ className: ["scroll-reveal", "stagger-3"] });
  const settingsRef = useScrollReveal({ className: ["scroll-reveal", "stagger-4"] });

  const handleLogout = () => {
    logout();
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Ion
        key={index}
        name={index < rating ? "star" : "star-outline"}
        className={index < rating ? "text-coral text-[14px]" : "text-gray-300 text-[14px]"}
        label={index === 0 ? `Rating: ${rating} out of 5` : undefined}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  };

  const formatMemberSince = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(-2);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    }) + " '" + year;
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-dvh bg-gradient-to-br from-off-white via-off-white/98 to-off-white relative">
        <Header />
        <div className="pt-4 pb-32 sm:pb-28 md:pb-6 relative z-10">
          <div className="px-4 sm:px-6 md:px-8">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-off-white/90 backdrop-blur-sm p-6 border border-sage/10 shadow-sm">
                <div className="animate-pulse">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-6 bg-gray-200 rounded w-48"></div>
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="text-center">
                        <div className="h-8 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  // Show error state
  if (error || !profile) {
    return (
      <div className="min-h-dvh bg-gradient-to-br from-off-white via-off-white/98 to-off-white relative">
        <Header />
        <div className="pt-4 pb-32 sm:pb-28 md:pb-6 relative z-10">
          <div className="px-4 sm:px-6 md:px-8">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-off-white/90 backdrop-blur-sm p-6 border border-red-200 shadow-sm text-center">
                <Ion name="alert-circle" className="text-red-500 text-[48px] mb-4" />
                <h2 className="font-urbanist text-xl font-600 text-charcoal mb-2">
                  {error || 'Profile not found'}
                </h2>
                <p className="text-charcoal/60 mb-4">
                  Please try refreshing the page or contact support if the problem persists.
                </p>
                <Link
                  href="/home"
                  className="inline-flex items-center space-x-2 bg-sage text-white px-6 py-3 rounded font-urbanist font-600 hover:bg-sage/90 transition-colors"
                >
                  <Ion name="chevron-back" className="text-[16px]" />
                  <span>Back to Home</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-gradient-to-br from-off-white via-off-white/98 to-off-white relative">
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-sage/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-br from-coral/8 to-transparent rounded-full blur-2xl" />
      </div>

      {/* Header */}
      <Header />

      {/* Main content */}
      <div className="pt-4 pb-32 sm:pb-28 md:pb-6 relative z-10">
        <div className="px-4 sm:px-6 md:px-8">
          <div className="max-w-4xl mx-auto space-y-6">

            {/* Profile Header Card */}
            <div ref={headerRef} className="bg-off-white/90 backdrop-blur-sm p-6 border border-sage/10 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-sage/20">
                      <SafeAvatar
                        src={profile.avatar_url}
                        alt="Profile picture"
                        username={profile.username || profile.display_name || 'User'}
                        size={64}
                        className="w-16 h-16 object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h1 className="font-urbanist text-xl font-700 text-charcoal">
                        @{profile.username || profile.display_name || 'User'}
                      </h1>

                    </div>
                    {profile.is_top_reviewer && (
                      <div className="flex items-center space-x-1 mb-2">
                        <Ion name="trophy" className="text-coral text-[16px]" />
                        <span className="text-sm font-600 text-coral">
                          Top Reviewer in Cape Town this Month
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Edit profile"
                  className="w-8 h-8 bg-sage/10 hover:bg-sage/20 rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <Ion name="create-outline" className="text-sage text-[16px]" />
                </button>
              </div>
            </div>

            {/* Stats Overview */}
            <div ref={statsRef} className="bg-off-white/90 backdrop-blur-sm p-5 border border-sage/10 shadow-sm">
              <h2 className="font-urbanist text-lg font-600 text-charcoal mb-4">Stats Overview</h2>
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <div className="text-center px-1">
                  <div className="flex flex-col items-center mb-2">
                    <Ion name="star" className="text-coral text-[18px] mb-1" />
                    <span className="font-urbanist text-base font-700 text-charcoal leading-tight">
                      {profile.reviews_count}
                    </span>
                  </div>
                  <span className="text-base text-charcoal/60 leading-tight">reviews</span>
                </div>
                <div className="text-center px-1">
                  <div className="flex flex-col items-center mb-2">
                    <Ion name="trophy" className="text-sage text-[18px] mb-1" />
                    <span className="font-urbanist text-base font-700 text-charcoal leading-tight">
                      {profile.badges_count}
                    </span>
                  </div>
                  <span className="text-base text-charcoal/60 leading-tight">badges</span>
                </div>
                <div className="text-center px-1">
                  <div className="flex flex-col items-center mb-2">
                    <Ion name="calendar" className="text-sage text-[18px] mb-1" />
                    <span className="font-urbanist text-base font-600 text-charcoal leading-tight">
                      {formatMemberSince(profile.created_at)}
                    </span>
                  </div>
                  <span className="text-base text-charcoal/60 leading-tight">member since</span>
                </div>
              </div>
            </div>

            {/* Your Contributions */}
            <div ref={contributionsRef} className="bg-off-white/90 backdrop-blur-sm p-5 border border-sage/10 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-urbanist text-lg font-600 text-charcoal">Your Contributions</h2>
                <button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="text-sm text-coral font-500 hover:text-coral/80 transition-colors duration-200 flex items-center space-x-1"
                >
                  <span>{showAllReviews ? "Hide" : "See all reviews"}</span>
                  <Ion name={showAllReviews ? "chevron-up" : "chevron-forward"} className="text-[14px]" />
                </button>
              </div>
              <div className="space-y-3">
                {reviews.slice(0, showAllReviews ? undefined : 2).map((review) => (
                  <div key={review.id} className="flex items-center justify-between py-3 border-b border-sage/10 last:border-b-0">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-urbanist text-base font-600 text-charcoal">
                          {review.business_name}
                        </span>
                        <div className="flex items-center space-x-1">
                          {renderStars(review.rating)}
                        </div>
                        {review.is_featured && (
                          <span className="text-xs text-coral font-500">
                            (Featured)
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-charcoal/60">
                        {formatDate(review.created_at)}
                      </span>
                    </div>
                    <div className="text-right">
                      <button className="text-coral text-sm font-500 hover:text-coral/80 transition-colors duration-200">
                        Click to see
                      </button>
                      <div className="text-xs text-charcoal/50 mt-1">
                        full review
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Your Achievements */}
            <div ref={achievementsRef} className="bg-off-white/90 backdrop-blur-sm p-5 border border-sage/10 shadow-sm">
              <h2 className="font-urbanist text-lg font-600 text-charcoal mb-4">Your Achievements</h2>
              <div className="space-y-3">
                {achievements.map((userAchievement) => (
                  <div
                    key={userAchievement.achievement_id}
                    className="flex items-center space-x-3 p-3 transition-all duration-200 bg-sage/10 border border-sage/20"
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-sage/20">
                      <Ion
                        name={userAchievement.achievements.icon}
                        className="text-[20px] text-sage"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="font-urbanist text-base font-600 text-charcoal">
                        {userAchievement.achievements.name}
                      </span>
                      <p className="text-sm text-charcoal/60 mt-1">
                        {userAchievement.achievements.description}
                      </p>
                    </div>
                    <Ion name="checkmark-circle" className="text-sage text-[18px]" />
                  </div>
                ))}
              </div>
            </div>

            {/* Account Settings */}
            <div ref={settingsRef} className="bg-off-white/90 backdrop-blur-sm p-5 border border-sage/10 shadow-sm">
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-4 hover:bg-sage/5 transition-colors duration-200 group">
                  <div className="flex items-center space-x-3">
                    <Ion name="settings-outline" className="text-gray-500 text-[20px]" />
                    <span className="font-urbanist text-base font-500 text-charcoal group-hover:text-sage transition-colors duration-200">
                      Account Settings
                    </span>
                  </div>
                  <Ion name="chevron-forward" className="text-gray-400 text-[16px]" />
                </button>

                <button className="w-full flex items-center justify-between p-4 hover:bg-sage/5 transition-colors duration-200 group">
                  <div className="flex items-center space-x-3">
                    <Ion name="notifications-outline" className="text-gray-500 text-[20px]" />
                    <span className="font-urbanist text-base font-500 text-charcoal group-hover:text-sage transition-colors duration-200">
                      Notifications
                    </span>
                  </div>
                  <Ion name="chevron-forward" className="text-gray-400 text-[16px]" />
                </button>

                <button className="w-full flex items-center justify-between p-4 hover:bg-sage/5 transition-colors duration-200 group">
                  <div className="flex items-center space-x-3">
                    <Ion name="lock-closed-outline" className="text-gray-500 text-[20px]" />
                    <span className="font-urbanist text-base font-500 text-charcoal group-hover:text-sage transition-colors duration-200">
                      Privacy & Data
                    </span>
                  </div>
                  <Ion name="chevron-forward" className="text-gray-400 text-[16px]" />
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between p-4 hover:bg-coral/5 transition-colors duration-200 group"
                >
                  <div className="flex items-center space-x-3">
                    <Ion name="log-out-outline" className="text-coral text-[20px]" />
                    <span className="font-urbanist text-base font-500 text-coral group-hover:text-coral/80 transition-colors duration-200">
                      Log Out
                    </span>
                  </div>
                  <Ion name="chevron-forward" className="text-coral text-[16px]" />
                </button>
              </div>
            </div>

            {/* Back Button */}
            <div className="pt-4">
              <Link
                href="/home"
                className="w-full bg-sage/10 hover:bg-sage/15 p-4 font-urbanist text-base font-600 text-sage hover:text-sage/80 transition-all duration-300 flex items-center justify-center space-x-2 border border-sage/20"
              >
                <Ion name="chevron-back" className="text-[18px]" />
                <span>Back</span>
              </Link>
            </div>

          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

export default function ProfilePage() {
  return <ProfileContent />;
}
