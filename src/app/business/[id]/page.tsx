"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useToast } from "../../contexts/ToastContext";
import { useBusiness } from "../../hooks/useBusinesses";

// Dynamic imports for premium animations
const FadeInUp = dynamic(() => import("../../components/Animations/FadeInUp"), {
  ssr: false,
});

const PremiumHover = dynamic(() => import("../../components/Animations/PremiumHover"), {
  ssr: false,
});

export default function BusinessProfilePage() {
  const params = useParams();
  const { showToast } = useToast();
  const { business, loading, error } = useBusiness(params?.id as string);

  const handleWriteReviewClick = () => {
    showToast("Opening review form... Get ready to share your experience! ✨", "sage", 3000);
  };

  if (loading) {
    return (
      <div className="min-h-dvh bg-gradient-to-br from-off-white via-off-white/98 to-off-white/95 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="w-12 h-12 mx-auto mb-4">
            <div className="w-full h-full border-4 border-sage border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h1 className="font-urbanist text-xl font-700 text-charcoal mb-2">
            Loading Business
          </h1>
          <p className="font-urbanist text-sm font-400 text-charcoal/70">
            Please wait while we fetch the details...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-dvh bg-gradient-to-br from-off-white via-off-white/98 to-off-white/95 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-coral/20 rounded-full flex items-center justify-center">
            <ion-icon name="business" style={{ fontSize: '2rem', color: 'var(--coral)' }} />
          </div>
          <h1 className="font-urbanist text-xl font-700 text-charcoal mb-2">
            Business Not Found
          </h1>
          <p className="font-urbanist text-sm font-400 text-charcoal/70 mb-6">
            {error || "The business you're looking for doesn't exist."}
          </p>
          <Link
            href="/home"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-sage to-sage/90 text-white font-urbanist text-sm font-600 py-3 px-6 rounded-full hover:shadow-lg transition-all duration-300"
          >
            <ion-icon name="arrow-back-outline" size="small" />
            <span>Back to Home</span>
          </Link>
        </motion.div>
      </div>
    );
  }

  // Mock reviews for now - will be replaced with real review data later
  const mockReviews = [
    {
      id: 1,
      author: "Jess",
      rating: 5,
      text: "Loved the experience, staff were so friendly. Service was fast & trustworthy. @on time @friendly",
      date: "Feb 2023",
      tags: ["trustworthy", "on time", "friendly"]
    },
    {
      id: 2,
      author: "Hilario",
      rating: 4,
      text: "Great place but could be better. Food came fast though. @on time",
      date: "March 2023",
      tags: ["on time"]
    }
  ];

  return (
    <div className="min-h-dvh bg-gradient-to-br from-off-white via-off-white/98 to-off-white/95 relative overflow-hidden">
      {/* Ambient background elements */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-sage/30 to-sage/10 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 1, scale: 0.8 }}
          transition={{ duration: 3, delay: 1, repeat: Infinity, repeatType: "reverse" }}
          className="absolute bottom-32 right-16 w-40 h-40 bg-gradient-to-br from-coral/20 to-coral/5 rounded-full blur-3xl"
        />
      </div>

      {/* Premium Header */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 bg-gradient-to-br from-off-white via-off-white/98 to-off-white/95 backdrop-blur-xl border-b border-sage/10 px-4 py-6 shadow-sm"
      >
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/home" className="text-charcoal/60 hover:text-charcoal transition-colors duration-300 p-2 hover:bg-charcoal/5 rounded-full">
              <ion-icon name="arrow-back-outline" size="small"></ion-icon>
            </Link>
          </motion.div>

          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-urbanist text-xl font-700 text-transparent bg-clip-text bg-gradient-to-r from-charcoal via-sage to-charcoal"
          >
            {business.name}
          </motion.h1>

          <div className="w-10"></div>
        </div>
      </motion.header>

      <div className="w-full max-w-full px-4 md:max-w-4xl md:px-4 mx-auto py-4 md:py-6 relative z-10">
        {/* Premium Business Header */}
        <FadeInUp delay={0.2}>
          <PremiumHover scale={1.02} shadowIntensity="light" duration={0.4}>
            <div className="bg-off-white rounded shadow-sm border border-sage/10 p-4 md:p-6 mb-4 md:mb-6 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sage/10 to-transparent rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-coral/10 to-transparent rounded-full blur-2xl"></div>

              <div className="relative z-10">
                <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                  {/* Business Photo/Icon Section */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="flex-shrink-0"
                  >
                    <div className="relative group">
                      {business.image ? (
                        <div className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded overflow-hidden ring-2 ring-sage/20 group-hover:ring-sage/40 transition-all duration-500">
                          <Image
                            src={business.image}
                            alt={`${business.name} photo`}
                            width={224}
                            height={224}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            priority
                          />
                          {/* Shimmer overlay on hover */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 group-hover:translate-x-full"></div>
                        </div>
                      ) : (
                        <div className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded bg-gradient-to-br from-sage/20 to-coral/20 flex items-center justify-center ring-2 ring-sage/20 group-hover:ring-sage/40 transition-all duration-500">
                          <motion.div
                            whileHover={{ rotate: 10, scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ion-icon name="business" style={{ fontSize: '3rem', color: 'var(--sage)' }} />
                          </motion.div>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Business Info */}
                  <div className="flex-1 text-center md:text-left">
                    <motion.h2
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                      className="font-urbanist text-lg md:text-xl lg:text-2xl font-700 text-transparent bg-clip-text bg-gradient-to-r from-charcoal via-sage to-charcoal mb-3 md:mb-4"
                    >
                      {business.name}
                    </motion.h2>

                    {/* Rating */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.6 }}
                      className="flex items-center justify-center md:justify-start space-x-2 mb-4 md:mb-6"
                    >
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full shadow-lg"
                      >
                        <ion-icon name="star" style={{ color: 'var(--white)', fontSize: '18px' }} />
                      </motion.div>
                      <span className="font-urbanist text-base font-700 text-charcoal">{business.rating}</span>
                    </motion.div>

                    {/* Trust Metrics */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.7, duration: 0.6 }}
                      className="grid grid-cols-3 gap-3 md:gap-6"
                    >
                      {[
                        { label: "Trust", value: business.trust, color: "sage" },
                        { label: "Punctuality", value: business.punctuality, color: "coral" },
                        { label: "Friendliness", value: business.friendliness, color: "sage" }
                      ].map((metric, index) => (
                        <motion.div
                          key={metric.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 + (index * 0.1), duration: 0.5 }}
                          whileHover={{ scale: 1.05, y: -5 }}
                          className="text-center group"
                        >
                          <div className={`w-10 h-10 mx-auto mb-3 rounded-full bg-gradient-to-br ${
                            metric.color === 'sage' ? 'from-sage/20 to-sage/10' : 'from-coral/20 to-coral/10'
                          } flex items-center justify-center group-hover:shadow-lg transition-shadow duration-300`}>
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                              className={`font-urbanist text-base font-700 ${
                                metric.color === 'sage' ? 'text-sage' : 'text-coral'
                              }`}
                            >
                              {metric.value}%
                            </motion.div>
                          </div>
                          <span className="font-urbanist text-sm font-500 text-charcoal/70 capitalize">
                            {metric.label}
                          </span>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </PremiumHover>
        </FadeInUp>

        {/* Specials & Events */}
        <FadeInUp delay={0.4}>
          <PremiumHover scale={1.01} shadowIntensity="light" duration={0.3}>
            <div className="bg-off-white rounded shadow-sm border border-sage/10 p-4 md:p-6 mb-4 md:mb-6 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-coral/10 to-transparent rounded-full blur-2xl"></div>

              <div className="relative z-10">
                <motion.h3
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="font-urbanist text-lg md:text-xl font-600 text-charcoal mb-4 md:mb-6 flex items-center"
                >
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                    className="w-8 h-8 bg-gradient-to-br from-coral/20 to-coral/10 rounded-full flex items-center justify-center mr-3"
                  >
                    <ion-icon name="calendar-outline" style={{ color: 'var(--coral)', fontSize: '18px' }} />
                  </motion.div>
                  Specials & Events
                </motion.h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {business.specials.map((special, index) => (
                    <motion.div
                      key={special.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + (index * 0.1), duration: 0.5 }}
                      whileHover={{ scale: 1.03, y: -5 }}
                      className="bg-off-white rounded p-4 md:p-6 border border-sage/10 group hover:border-sage/30 transition-all duration-300"
                    >
                      <div className="flex items-center space-x-4">
                        <motion.div
                          whileHover={{ rotate: [0, -10, 10, 0] }}
                          transition={{ duration: 0.6 }}
                          className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-sage/20 to-sage/10 rounded flex items-center justify-center group-hover:shadow-lg transition-shadow duration-300"
                        >
                          <ion-icon
                            name={special.icon}
                            style={{ color: 'var(--sage)', fontSize: '28px' }}
                          />
                        </motion.div>
                        <div>
                          <h4 className="font-urbanist text-base font-600 text-charcoal mb-1 group-hover:text-sage transition-colors duration-300">
                            {special.name}
                          </h4>
                          <p className="font-urbanist text-sm font-400 text-charcoal/70">
                            {special.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </PremiumHover>
        </FadeInUp>

        {/* Reviews */}
        <FadeInUp delay={0.6}>
          <PremiumHover scale={1.01} shadowIntensity="light" duration={0.3}>
            <div className="bg-off-white rounded shadow-sm border border-sage/10 p-4 md:p-6 mb-4 md:mb-6 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-sage/10 to-transparent rounded-full blur-2xl"></div>

              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-6 space-y-4 md:space-y-0">
                  <motion.h3
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    className="font-urbanist text-lg md:text-xl font-600 text-charcoal flex items-center"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      className="w-8 h-8 bg-gradient-to-br from-sage/20 to-sage/10 rounded-full flex items-center justify-center mr-3"
                    >
                      <ion-icon name="chatbubbles-outline" style={{ color: 'var(--sage)', fontSize: '18px' }} />
                    </motion.div>
                    Reviews
                  </motion.h3>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={`/business/${business.slug || business.id}/review`}
                      onClick={handleWriteReviewClick}
                      className="inline-flex items-center space-x-2 bg-gradient-to-r from-sage to-sage/90 text-white font-urbanist text-sm font-600 py-3 px-6 rounded-full hover:shadow-lg transition-all duration-300 group"
                    >
                      <ion-icon name="create-outline" size="small" />
                      <span>Write a Review</span>
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="ml-auto"
                      >
                        <ion-icon name="arrow-forward-outline" size="small" />
                      </motion.div>
                    </Link>
                  </motion.div>
                </div>

                <div className="space-y-4 md:space-y-6">
                  {mockReviews.map((review, index) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 + (index * 0.1), duration: 0.5 }}
                      whileHover={{ scale: 1.01, x: 10 }}
                      className="bg-off-white rounded p-4 md:p-6 border border-sage/10 hover:border-sage/30 transition-all duration-300 group"
                    >
                      <div className="flex items-start space-x-4">
                        {/* Avatar */}
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.3 }}
                          className="w-12 h-12 bg-gradient-to-br from-sage/20 to-sage/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:shadow-lg transition-shadow duration-300"
                        >
                          <span className="font-urbanist text-lg font-700 text-sage">
                            {review.author[0]}
                          </span>
                        </motion.div>

                        <div className="flex-1">
                          {/* Header */}
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 space-y-2 md:space-y-0">
                            <div className="flex items-center space-x-3">
                              <span className="font-urbanist text-lg font-600 text-charcoal group-hover:text-sage transition-colors duration-300">
                                {review.author}
                              </span>
                              <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 1 + (index * 0.1) + (i * 0.05), duration: 0.3 }}
                                  >
                                    <ion-icon
                                      name={i < review.rating ? "star" : "star-outline"}
                                      style={{
                                        color: i < review.rating ? "var(--coral)" : "#9ca3af",
                                        fontSize: '16px'
                                      }}
                                    />
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                            <span className="font-urbanist text-sm font-400 text-charcoal/60">
                              {review.date}
                            </span>
                          </div>

                          {/* Review Text */}
                          <p className="font-urbanist text-base font-400 text-charcoal/90 leading-relaxed mb-4">
                            {review.text}
                          </p>

                          {/* Tags */}
                          {review.tags && review.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {review.tags.map((tag, tagIndex) => (
                                <motion.span
                                  key={tag}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 1.1 + (index * 0.1) + (tagIndex * 0.05), duration: 0.3 }}
                                  whileHover={{ scale: 1.05 }}
                                  className="inline-flex items-center px-3 py-1 bg-sage/10 text-sage text-sm font-500 rounded-full border border-sage/20 hover:bg-sage/20 transition-colors duration-300"
                                >
                                  <span className="mr-1">@</span>
                                  {tag}
                                </motion.span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </PremiumHover>
        </FadeInUp>
      </div>
    </div>
  );
}