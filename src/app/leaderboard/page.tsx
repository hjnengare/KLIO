"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import FallbackImage from "../components/FallbackImage/FallbackImage";

const BottomNav = dynamic(() => import("../components/Navigation/BottomNav"));
const Footer = dynamic(() => import("../components/Footer/Footer"), {
  loading: () => null,
  ssr: false,
});

interface LeaderboardUser {
  rank: number;
  username: string;
  reviews: number;
  badge?: string;
  avatar: string;
  totalRating: number;
}

const topReviewers: LeaderboardUser[] = [
  { rank: 1, username: "Observer", reviews: 25, badge: "🥇", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150", totalRating: 4.9 },
  { rank: 2, username: "Ghost", reviews: 20, badge: "🥈", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150", totalRating: 4.8 },
  { rank: 3, username: "Reviewer", reviews: 15, badge: "🥉", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150", totalRating: 4.7 },
  { rank: 4, username: "LocalGuru", reviews: 12, avatar: "https://images.unsplash.com/photo-1494790108755-2616b332e234?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150", totalRating: 4.6 },
  { rank: 5, username: "TasteExplorer", reviews: 10, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150", totalRating: 4.5 },
  { rank: 6, username: "CityScout", reviews: 8, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150", totalRating: 4.4 },
  { rank: 7, username: "GemHunter", reviews: 7, avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150", totalRating: 4.3 },
  { rank: 8, username: "ReviewMaster", reviews: 6, avatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150", totalRating: 4.2 }
];

interface BusinessOfMonth {
  name: string;
  rating: number;
  category: string;
  image: string;
  location: string;
  ownerName: string;
  ownerAvatar: string;
  reviews: number;
}

const businessOfMonth: BusinessOfMonth[] = [
  {
    name: "Mama's Kitchen",
    rating: 4.9,
    category: "Restaurant",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    location: "Downtown",
    ownerName: "Maria Santos",
    ownerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    reviews: 127
  },
  {
    name: "Bella's Hair",
    rating: 4.8,
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    location: "Arts District",
    ownerName: "Isabella Chen",
    ownerAvatar: "https://images.unsplash.com/photo-1494790108755-2616b332e234?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    reviews: 89
  },
  {
    name: "Fresh Flowers",
    rating: 4.9,
    category: "Florist",
    image: "https://images.unsplash.com/photo-1463320726281-696a485928c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    location: "Riverside",
    ownerName: "David Green",
    ownerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    reviews: 156
  },
  {
    name: "Ocean Kloof",
    rating: 4.9,
    category: "Restaurant",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    location: "Old Town",
    ownerName: "James Wilson",
    ownerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    reviews: 203
  },
  {
    name: "Apple Store",
    rating: 4.5,
    category: "Tech",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    location: "Westside",
    ownerName: "Sarah Johnson",
    ownerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    reviews: 74
  },
  {
    name: "Pet Store A",
    rating: 4.9,
    category: "Pets",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    location: "Main Street",
    ownerName: "Michael Brown",
    ownerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
    reviews: 342
  }
];

export default function LeaderboardPage() {
  return (
    <div className="min-h-dvh bg-gradient-to-br from-off-white via-off-white/98 to-off-white/95 pb-24 md:pb-6 relative overflow-hidden">
      {/* Premium background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-sage/8 via-sage/4 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-coral/6 via-coral/3 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-charcoal/3 via-charcoal/1 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="bg-off-white/80 backdrop-blur-xl border-b border-sage/10 px-4 py-6 shadow-sm relative z-10"
      >
        <div className="flex items-center justify-between max-w-[1300px] mx-auto">
          {/* Back button */}
          <Link href="/home" className="group flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-charcoal/10 to-charcoal/5 hover:from-sage/20 hover:to-sage/10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-charcoal/5 hover:border-sage/20 mr-4">
              <ion-icon name="arrow-back" class="text-xl text-charcoal/70 group-hover:text-sage transition-colors duration-300" />
            </div>
            <motion.h1
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="font-urbanist text-xl font-700 text-transparent bg-clip-text bg-gradient-to-r from-sage via-sage/90 to-charcoal transition-all duration-300 group-hover:from-sage/90 group-hover:to-sage relative"
            >
              Community Highlights
            </motion.h1>
          </Link>

          {/* Profile button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 bg-gradient-to-br from-charcoal/10 to-charcoal/5 hover:from-sage/20 hover:to-sage/10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-charcoal/5 hover:border-sage/20"
          >
            <ion-icon name="person-outline" class="text-base text-charcoal/70 hover:text-sage transition-colors duration-300" />
          </motion.button>
        </div>
      </motion.header>

      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12 relative z-10">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-urbanist text-base font-700 text-charcoal mb-4">
            Top Contributors This Month
          </h2>
          <p className="font-urbanist text-base font-400 text-charcoal/70 max-w-2xl mx-auto">
            Celebrating our community&apos;s most valued reviewers and featured businesses
          </p>
        </motion.div>

        {/* Top Reviewers Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="bg-off-white/95 backdrop-blur-xl shadow-xl border border-white/30 p-6 md:p-8 mb-12 relative overflow-hidden"
        >
          {/* Card decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sage/10 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-coral/10 to-transparent rounded-full blur-2xl"></div>

          <div className="relative z-10">
            <h3 className="font-urbanist text-base font-700 text-charcoal mb-8 text-center flex items-center justify-center gap-3">
              <ion-icon name="trophy" class="text-base text-sage" />
              Top Reviewers
            </h3>

            {/* Top 3 Podium - Responsive */}
            <div className="flex flex-col sm:flex-row justify-center items-center sm:items-end gap-4 sm:gap-6 mb-8 sm:mb-12 px-2">
              {/* 1st Place - Mobile First */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-center group cursor-pointer order-1 sm:order-2"
              >
                <div className="relative mb-4">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 relative rounded-full overflow-hidden border-4 border-sage mx-auto group-hover:scale-110 transition-transform duration-300 shadow-xl">
                    <FallbackImage
                      src={topReviewers[0].avatar}
                      alt={topReviewers[0].username}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 96px, 112px"
                      fallbackType="profile"
                    />
                  </div>
                  <div className="absolute -top-3 -right-3 text-2xl sm:text-3xl animate-pulse">{topReviewers[0].badge}</div>
                </div>
                <div className="bg-off-white rounded-[6px] p-4 sm:p-5 min-w-[140px] sm:min-w-[160px] shadow-xl border-2 border-sage/30 group-hover:shadow-2xl transition-all duration-300">
                  <div className="font-urbanist text-lg sm:text-xl font-700 text-charcoal mb-1 group-hover:text-sage transition-colors duration-300">@{topReviewers[0].username}</div>
                  <div className="font-urbanist text-sm text-charcoal/70 mb-3">{topReviewers[0].reviews} reviews</div>
                  <div className="bg-gradient-to-r from-sage/20 to-sage/10 backdrop-blur-sm px-3 py-2 rounded-full shadow-sm border border-sage/20 flex items-center justify-center gap-1 mx-auto w-fit">
                    <ion-icon name="star" class="text-base text-sage" />
                    <span className="font-urbanist text-base font-700 text-charcoal">{topReviewers[0].totalRating}</span>
                  </div>
                </div>
              </motion.div>

              {/* 2nd Place */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-center group cursor-pointer order-2 sm:order-1"
              >
                <div className="relative mb-4">
                  <div className="w-18 h-18 sm:w-20 sm:h-20 relative rounded-full overflow-hidden border-4 border-coral/30 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <FallbackImage
                      src={topReviewers[1].avatar}
                      alt={topReviewers[1].username}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 72px, 80px"
                      fallbackType="profile"
                    />
                  </div>
                  <div className="absolute -top-2 -right-2 text-xl sm:text-2xl animate-bounce">{topReviewers[1].badge}</div>
                </div>
                <div className="bg-off-white rounded-[6px] p-3 sm:p-4 min-w-[120px] sm:min-w-[140px] shadow-lg border border-white/50 group-hover:shadow-xl transition-all duration-300">
                  <div className="font-urbanist text-sm sm:text-base md:text-lg font-700 text-charcoal mb-1 group-hover:text-coral transition-colors duration-300">@{topReviewers[1].username}</div>
                  <div className="font-urbanist text-xs sm:text-sm text-charcoal/70 mb-2">{topReviewers[1].reviews} reviews</div>
                  <div className="bg-white/50 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm border border-white/30 flex items-center justify-center gap-1 mx-auto w-fit">
                    <ion-icon name="star" class="text-xs sm:text-sm text-coral" />
                    <span className="font-urbanist text-xs sm:text-sm font-600 text-charcoal">{topReviewers[1].totalRating}</span>
                  </div>
                </div>
              </motion.div>


              {/* 3rd Place */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="text-center group cursor-pointer order-3 sm:order-3"
              >
                <div className="relative mb-4">
                  <div className="w-18 h-18 sm:w-20 sm:h-20 relative rounded-full overflow-hidden border-4 border-charcoal/30 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <FallbackImage
                      src={topReviewers[2].avatar}
                      alt={topReviewers[2].username}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 72px, 80px"
                      fallbackType="profile"
                    />
                  </div>
                  <div className="absolute -top-2 -right-2 text-xl sm:text-2xl animate-bounce" style={{ animationDelay: "0.5s" }}>{topReviewers[2].badge}</div>
                </div>
                <div className="bg-off-white rounded-[6px] p-3 sm:p-4 min-w-[120px] sm:min-w-[140px] shadow-lg border border-white/50 group-hover:shadow-xl transition-all duration-300">
                  <div className="font-urbanist text-sm sm:text-base md:text-lg font-700 text-charcoal mb-1 group-hover:text-charcoal/80 transition-colors duration-300">@{topReviewers[2].username}</div>
                  <div className="font-urbanist text-xs sm:text-sm text-charcoal/70 mb-2">{topReviewers[2].reviews} reviews</div>
                  <div className="bg-white/50 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm border border-white/30 flex items-center justify-center gap-1 mx-auto w-fit">
                    <ion-icon name="star" class="text-xs sm:text-sm text-charcoal/60" />
                    <span className="font-urbanist text-xs sm:text-sm font-600 text-charcoal">{topReviewers[2].totalRating}</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Rest of Rankings */}
            <div className="space-y-3">
              {topReviewers.slice(3).map((user, index) => (
                <motion.div
                  key={user.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                  className="group bg-off-white rounded-[6px] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.01] cursor-pointer"
                >
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-charcoal/10 to-charcoal/5 rounded-full flex items-center justify-center font-urbanist text-sm font-600 text-charcoal/70 shadow-sm">
                        {user.rank}
                      </div>
                      <div className="w-12 h-12 relative rounded-full overflow-hidden border-2 border-white shadow-md group-hover:scale-105 transition-transform duration-300">
                        <Image
                          src={user.avatar}
                          alt={user.username}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div>
                        <div className="font-urbanist text-base font-600 text-charcoal group-hover:text-sage transition-colors duration-300">@{user.username}</div>
                        <div className="font-urbanist text-sm text-charcoal/60">{user.reviews} reviews</div>
                      </div>
                    </div>
                    <div className="bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border border-white/30 flex items-center gap-1">
                      <ion-icon name="star" class="text-sm text-coral" />
                      <span className="font-urbanist text-sm font-600 text-charcoal">{user.totalRating}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8">
              <button className="font-urbanist text-base font-600 text-sage hover:text-sage/80 transition-colors duration-300 px-6 py-2 hover:bg-sage/5 rounded-full">
                View Full Leaderboard →
              </button>
            </div>
          </div>
        </motion.div>

        {/* Businesses of the Month */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="bg-off-white/95 backdrop-blur-xl  shadow-xl border border-white/30 p-6 md:p-8 mb-8 relative overflow-hidden"
        >
          {/* Card decorative elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-coral/10 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tr from-sage/10 to-transparent rounded-full blur-2xl"></div>

          <div className="relative z-10">
            <h3 className="font-urbanist text-lg md:text-xl font-700 text-charcoal mb-8 text-center flex items-center justify-center gap-3">
              <ion-icon name="diamond" class="text-xl text-coral" />
              Featured Businesses
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {businessOfMonth.map((business, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                  className="group bg-off-white rounded-[6px] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.03] cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-t-[6px]">
                    <div className="relative">
                      <FallbackImage
                        src={business.image}
                        alt={business.name}
                        width={400}
                        height={240}
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="h-[200px] w-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-t-[6px]"
                        fallbackType="business"
                      />

                      {/* Rating badge - exactly matching BusinessCard style */}
                      <span className="absolute right-2 top-2 z-20 inline-flex items-center gap-1 rounded bg-white/50 backdrop-blur-sm px-2 py-1 text-charcoal shadow-lg">
                        <ion-icon name="star" class="text-coral text-sm drop-shadow-sm" />
                        <span className="font-urbanist text-sm font-700">{business.rating.toFixed(1)}</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    {/* Business name - matching BusinessCard typography */}
                    <div className="mb-1">
                      <h3 className="font-urbanist text-base font-600 text-charcoal transition-colors duration-200 group-hover:text-sage">
                        {business.name}
                      </h3>
                    </div>

                    {/* Category and location line */}
                    <p className="mb-3 font-urbanist text-sm font-400 text-charcoal/70 transition-colors duration-200 group-hover:text-charcoal/80">
                      {business.category} - {business.location}
                    </p>

                    {/* Owner information */}
                    <div className="flex items-center gap-2 mb-3">
                      <FallbackImage
                        src={business.ownerAvatar}
                        alt={business.ownerName}
                        width={24}
                        height={24}
                        className="rounded-full ring-1 ring-white/50 shadow-sm"
                        sizes="24px"
                        fallbackType="profile"
                      />
                      <div className="flex items-center gap-1 text-sm font-urbanist text-charcoal/60">
                        <span>by {business.ownerName}</span>
                        <span>•</span>
                        <span>{business.reviews} reviews</span>
                      </div>
                    </div>

                    {/* Rating display matching BusinessCard style */}
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <ion-icon
                            key={i}
                            name={i < Math.floor(business.rating) ? "star" : business.rating > i ? "star-half" : "star-outline"}
                            class={`text-sm ${i < business.rating ? "text-coral" : "text-charcoal/30"}`}
                          />
                        ))}
                      </div>
                      <p className="font-urbanist text-sm font-400 leading-none text-charcoal/70 transition-colors duration-200">Featured</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8">
              <button className="font-urbanist text-base font-600 text-coral hover:text-coral/80 transition-colors duration-300 px-6 py-2 hover:bg-coral/5 rounded-full">
                Explore All Businesses →
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer - only on larger screens */}
      <Footer />

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}