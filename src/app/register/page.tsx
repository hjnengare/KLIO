"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { motion } from "framer-motion";
import FadeInUp from "../components/Animations/FadeInUp";
import PremiumHover from "../components/Animations/PremiumHover";
import { usePrefersReducedMotion } from "../utils/hooks/usePrefersReducedMotion";

// CSS styles for consistent button radius
const styles = `
`;

export default function RegisterPage() {
  const prefersReduced = usePrefersReducedMotion();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [consent, setConsent] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: "",
    checks: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false
    }
  });

  const { register, isLoading, error: authError } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const containerRef = useRef(null);

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

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    if (password.length < 8) return "🔐 Password must be at least 8 characters long";
    if (!/(?=.*[a-z])/.test(password)) return "🔐 Password must contain at least one lowercase letter";
    if (!/(?=.*[A-Z])/.test(password)) return "🔐 Password must contain at least one uppercase letter";
    if (!/(?=.*\d)/.test(password)) return "🔐 Password must contain at least one number";
    return null;
  };

  const checkPasswordStrength = (password: string) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /(?=.*[A-Z])/.test(password),
      lowercase: /(?=.*[a-z])/.test(password),
      number: /(?=.*\d)/.test(password)
    };

    // Additional security checks
    const emailName = email.split('@')[0].toLowerCase();
    const commonPasswords = ['password', '123456', 'qwerty', 'abc123', 'password123'];
    const hasCommonWord = commonPasswords.some(common => password.toLowerCase().includes(common));
    const usesEmailName = emailName.length > 2 && password.toLowerCase().includes(emailName);

    let score = Object.values(checks).filter(Boolean).length;
    let feedback = "";
    let color = "";

    // Penalize common patterns
    if (hasCommonWord) {
      score = Math.max(0, score - 1);
      feedback = "Avoid common passwords";
      color = "text-red-500";
    } else if (usesEmailName) {
      score = Math.max(0, score - 1);
      feedback = "Don't use your email name";
      color = "text-orange-500";
    } else if (password.length === 0) {
      feedback = "";
      color = "";
    } else if (score === 1) {
      feedback = "Weak - Add more requirements";
      color = "text-red-500";
    } else if (score === 2) {
      feedback = "Fair - Getting better";
      color = "text-orange-500";
    } else if (score === 3) {
      feedback = "Good - Almost there";
      color = "text-yellow-500";
    } else if (score === 4) {
      feedback = "Strong - Perfect! 🎉";
      color = "text-sage";
    }

    return { score, feedback, checks, color };
  };

  const getEmailError = () => {
    if (!emailTouched) return "";
    if (!email) return "Email is required";
    if (!validateEmail(email)) return "Please enter a valid email address";
    return "";
  };

  const getPasswordError = () => {
    if (!passwordTouched) return "";
    if (!password) return "Password is required";
    const validation = validatePassword(password);
    return validation;
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setEmailError("");
    if (!emailTouched) setEmailTouched(true);

    if (value.length > 0 && !validateEmail(value)) {
      setEmailError("📧 Please enter a valid email address");
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (!passwordTouched) setPasswordTouched(true);
    const strength = checkPasswordStrength(value);
    setPasswordStrength(strength);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent double submission
    if (submitting || isLoading) return;

    setError("");
    setSubmitting(true);

    try {
      // Enhanced validation
      if (!email?.trim() || !password?.trim()) {
        setError("Please fill in all fields");
        showToast("Please fill in all fields", 'sage', 3000);
        setSubmitting(false);
        return;
      }

      if (!validateEmail(email.trim())) {
        setError("Please enter a valid email address");
        showToast("Please enter a valid email address", 'sage', 3000);
        setSubmitting(false);
        return;
      }

      // Check consent
      if (!consent) {
        setError("Please accept the Terms and Privacy Policy");
        showToast("Please accept the Terms and Privacy Policy", 'sage', 3000);
        setSubmitting(false);
        return;
      }

      const passwordError = validatePassword(password);
      if (passwordError) {
        setError(passwordError);
        showToast(passwordError, 'sage', 4000);
        setSubmitting(false);
        return;
      }

      // Check password strength
      const strength = checkPasswordStrength(password);
      if (strength.score < 3) {
        setError("Please create a stronger password");
        showToast("Please create a stronger password", 'sage', 3000);
        setSubmitting(false);
        return;
      }

      // Check offline status
      if (!isOnline) {
        setError("You're offline. Please check your connection and try again.");
        showToast("You're offline. Please check your connection and try again.", 'sage', 4000);
        setSubmitting(false);
        return;
      }

      // Attempt registration
      const success = await register(email.trim().toLowerCase(), password);

      if (success) {
        // Clear form
        setEmail("");
        setPassword("");
        setPasswordStrength({
          score: 0,
          feedback: "",
          checks: {
            length: false,
            uppercase: false,
            lowercase: false,
            number: false
          }
        });

        // Show success toast with celebration
        showToast("🎉 Welcome to KLIO! Your account has been created successfully!", 'success', 4000);

        // Navigate to interests page after short delay
        setTimeout(() => {
          showToast("Let's personalize your experience! 🌟", 'info', 2000);
          router.replace("/interests?from=register");
        }, 1500);
      } else {
        // Handle registration failure
        if (authError) {
          if (authError.includes('fetch') || authError.includes('network')) {
            setError('Connection error. Please check your internet connection and try again.');
            showToast('Connection error. Please check your internet connection and try again.', 'sage', 4000);
          } else if (authError.includes('already registered') || authError.includes('already exists')) {
            setError('This email is already registered. Try logging in instead.');
            showToast('This email is already registered. Try logging in instead.', 'sage', 4000);
          } else {
            setError(authError);
            showToast(authError, 'sage', 4000);
          }
        } else {
          setError("Registration failed. Please try again.");
          showToast("Registration failed. Please try again.", 'sage', 4000);
        }
      }
    } catch (error: unknown) {
      console.error('Registration error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      showToast(errorMessage, 'sage', 4000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div ref={containerRef} data-reduced={prefersReduced} className="min-h-dvh bg-gradient-to-br from-off-white via-off-white/98 to-off-white/95 flex flex-col px-4 py-6 pb-24 sm:py-8 sm:pb-20 md:pb-16 relative overflow-hidden">
      {/* Back button with entrance animation */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20"
      >
        <PremiumHover scale={1.1} duration={0.2}>
          <Link href="/onboarding" className="text-charcoal/60 hover:text-charcoal transition-colors duration-300 p-3 hover:bg-charcoal/5 rounded-full block">
            <ion-icon name="arrow-back-outline" size="small"></ion-icon>
          </Link>
        </PremiumHover>
      </motion.div>

      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto relative z-10 flex-1 flex flex-col justify-center py-8 sm:py-12">
        {/* Header with premium styling and animations */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <FadeInUp delay={0.4} duration={1} distance={60}>
            <div className="inline-block relative mb-6">
              <h2 className="font-urbanist text-xl sm:text-2xl md:text-4xl lg:text-5xl font-700 text-charcoal mb-3 sm:mb-4 md:mb-6 text-center leading-snug px-2 tracking-[0.01em]">
                Create your account
              </h2>
            </div>
          </FadeInUp>
          <FadeInUp delay={0.7} duration={0.8} distance={30}>
            <p className="font-urbanist text-sm md:text-base font-400 text-charcoal/70 mb-6 sm:mb-8 md:mb-10 leading-relaxed px-2 max-w-lg mx-auto">
              Join KLIO and discover places real locals love
            </p>
          </FadeInUp>
        </div>

        {/* Demo Credentials Info with animation */}
        <FadeInUp delay={1.0} duration={0.6} distance={20}>
          <motion.div
            className="bg-sage/5 border border-sage/20 p-3 sm:p-4 mb-4 sm:mb-6 text-center"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <p className="font-urbanist text-[14px] font-600 text-sage mb-2">Registration Requirements</p>
            <p className="font-urbanist text-xs text-charcoal/70">
              Password must be at least 8 characters with uppercase, lowercase, and number
            </p>
          </motion.div>
        </FadeInUp>

        {/* Form Card */}
        <div className="bg-off-white/95 backdrop-blur-lg shadow-xl p-4 sm:p-8 md:p-10 lg:p-12 mb-4 sm:mb-6 relative overflow-hidden">

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6 relative z-10">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                <p className="font-urbanist text-[14px] font-600 text-red-600">{error}</p>
              </div>
            )}

            {/* Offline Message */}
            {!isOnline && !error && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
                <p className="font-urbanist text-[14px] font-600 text-orange-600">You&apos;re offline. We&apos;ll try again when you&apos;re back online.</p>
              </div>
            )}

            {/* Email with icon */}
            <div className="relative group">
              <div className={`absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2 transition-colors duration-300 z-10 ${
                getEmailError() ? 'text-red-500' :
                email && !getEmailError() && emailTouched ? 'text-sage' :
                'text-charcoal/40 group-focus-within:text-sage'
              }`}>
                <ion-icon name={
                  getEmailError() ? "alert-circle" :
                  email && !getEmailError() && emailTouched ? "checkmark-circle" :
                  "mail-outline"
                } size="small"></ion-icon>
              </div>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                onBlur={() => setEmailTouched(true)}
                className={`w-full bg-cultured-1/50 border pl-12 sm:pl-14 pr-4 py-3 sm:py-4 md:py-5 font-urbanist text-sm sm:text-base font-400 text-charcoal placeholder-charcoal/50 focus:outline-none focus:ring-2 transition-all duration-300 hover:border-sage/50 ${
                  getEmailError() ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' :
                  email && !getEmailError() && emailTouched ? 'border-sage/40 focus:border-sage focus:ring-sage/20' :
                  'border-light-gray/50 focus:ring-sage/30 focus:border-sage focus:bg-white'
                }`}
                disabled={submitting || isLoading}
              />
            </div>

            {/* Email validation feedback */}
            {getEmailError() && (
              <p className="text-xs text-red-600 flex items-center gap-1 mt-1" role="alert">
                <ion-icon name="alert-circle" style={{ fontSize: '12px' }} />
                {getEmailError()}
              </p>
            )}
            {email && !getEmailError() && emailTouched && (
              <p className="text-xs text-sage flex items-center gap-1 mt-1" role="status">
                <ion-icon name="checkmark-circle" style={{ fontSize: '12px' }} />
                Email looks good!
              </p>
            )}

            {/* Password with enhanced styling */}
            <div className="relative group">
              <div className={`absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2 transition-colors duration-300 z-10 ${
                passwordStrength.score >= 3 && passwordTouched ? 'text-sage' :
                passwordStrength.score > 0 && passwordStrength.score < 3 ? 'text-orange-500' :
                'text-charcoal/40 group-focus-within:text-sage'
              }`}>
                <ion-icon name={
                  passwordStrength.score >= 3 && passwordTouched ? "checkmark-circle" :
                  passwordStrength.score > 0 && passwordStrength.score < 3 ? "alert-circle" :
                  "lock-closed-outline"
                } size="small"></ion-icon>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                onBlur={() => setPasswordTouched(true)}
                className={`w-full bg-cultured-1/50 border pl-12 sm:pl-14 pr-12 sm:pr-16 py-3 sm:py-4 md:py-5 font-urbanist text-sm sm:text-base font-400 text-charcoal placeholder-charcoal/50 focus:outline-none focus:ring-2 transition-all duration-300 hover:border-sage/50 ${
                  passwordStrength.score >= 3 && passwordTouched ? 'border-sage/40 focus:border-sage focus:ring-sage/20' :
                  passwordStrength.score > 0 && passwordStrength.score < 3 ? 'border-orange-300 focus:border-orange-500 focus:ring-orange-500/20' :
                  'border-light-gray/50 focus:ring-sage/30 focus:border-sage focus:bg-white'
                }`}
                disabled={submitting || isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 sm:right-5 top-1/2 transform -translate-y-1/2 text-charcoal/40 hover:text-charcoal transition-colors duration-300 p-1 z-10"
                disabled={submitting || isLoading}
              >
                <ion-icon
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size="small"
                ></ion-icon>
              </button>
            </div>

            {/* Password strength indicator */}
            {password.length > 0 && (
              <div className="h-5 mt-1 flex items-center gap-2">
                <div className="flex-1 flex gap-1" role="progressbar" aria-valuenow={passwordStrength.score} aria-valuemin={0} aria-valuemax={4}>
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 transition-all duration-300 ${
                        level <= passwordStrength.score
                          ? level === 1
                            ? 'bg-red-400'
                            : level === 2
                            ? 'bg-orange-400'
                            : level === 3
                            ? 'bg-yellow-400'
                            : 'bg-sage'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                {passwordStrength.feedback && (
                  <span className={`text-xs font-500 ${passwordStrength.color}`}>
                    {passwordStrength.feedback}
                  </span>
                )}
              </div>
            )}

            {/* Terms consent */}
            <div className="pt-2">
              <label className="flex items-start gap-3 text-xs text-charcoal/70 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 w-4 h-4 border-gray-300 text-sage focus:ring-sage/30 focus:ring-offset-0"
                />
                <span className="flex-1 leading-relaxed">
                  I agree to the{" "}
                  <Link href="/terms" className="underline text-sage hover:text-coral transition-colors">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="underline text-sage hover:text-coral transition-colors">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            {/* Sign Up Button with premium effects */}
            <div className="pt-2 sm:pt-4 flex justify-center">
              <div className="w-full">
                <PremiumHover scale={1.02} shadowIntensity="strong">
                  <motion.button
                    type="submit"
                    disabled={submitting || isLoading || !consent || passwordStrength.score < 3 || !email || !password || !validateEmail(email)}
                    className={`group block w-full font-urbanist text-sm sm:text-base font-600 py-3 sm:py-3.5 md:py-4 px-4 sm:px-6 md:px-8 rounded shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-1 relative overflow-hidden text-center min-h-[44px] whitespace-nowrap ${
                      submitting || isLoading || !consent || passwordStrength.score < 3 || !email || !password || !validateEmail(email)
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                        : 'bg-gradient-to-r from-sage to-sage/90 hover:from-coral hover:to-coral/90 text-white focus:ring-sage/20 hover:focus:ring-coral/20 hover:scale-[1.02]'
                    }`}
                    whileTap={{ scale: submitting || isLoading ? 1 : 0.98 }}
                    transition={{ duration: 0.1 }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {(submitting || isLoading) && (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      )}
                      {submitting || isLoading ? "Creating account..." : "Create account"}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-coral to-coral/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </motion.button>
                </PremiumHover>
              </div>
            </div>

            {/* Registration progress indicator */}
            <div className="text-center space-y-2 pt-2">
              <div className="flex items-center justify-center gap-4 text-xs">
                <div className={`flex items-center gap-1 ${email && !getEmailError() ? 'text-sage' : 'text-gray-400'}`}>
                  <ion-icon name={email && !getEmailError() ? "checkmark-circle" : "ellipse-outline"} style={{ fontSize: '14px' }}></ion-icon>
                  <span>Email</span>
                </div>
                <div className={`flex items-center gap-1 ${passwordStrength.score >= 3 ? 'text-sage' : 'text-gray-400'}`}>
                  <ion-icon name={passwordStrength.score >= 3 ? "checkmark-circle" : "ellipse-outline"} style={{ fontSize: '14px' }}></ion-icon>
                  <span>Strong Password</span>
                </div>
                <div className={`flex items-center gap-1 ${consent ? 'text-sage' : 'text-gray-400'}`}>
                  <ion-icon name={consent ? "checkmark-circle" : "ellipse-outline"} style={{ fontSize: '14px' }}></ion-icon>
                  <span>Terms</span>
                </div>
              </div>
              <p className="text-xs text-charcoal/60">
                Next: pick your interests
              </p>
            </div>

            {/* Divider */}
            <div className="relative my-4 sm:my-5 md:my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-light-gray/50"></div>
              </div>
              <div className="relative flex justify-center text-[14px]">
                <span className="px-4 bg-off-white/90 text-charcoal/60 font-urbanist text-7 font-400">or continue with</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <button
                type="button"
                className="flex items-center justify-center bg-white border border-light-gray/50 px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 font-urbanist text-xs sm:text-sm md:text-base font-500 text-charcoal hover:border-sage/50 hover:bg-sage/5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sage/30 group min-h-[44px]"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="group-hover:text-sage transition-colors duration-300">Google</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center bg-white border border-light-gray/50 px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 font-urbanist text-xs sm:text-sm md:text-base font-500 text-charcoal hover:border-sage/50 hover:bg-sage/5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sage/30 group min-h-[44px]"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <span className="group-hover:text-sage transition-colors duration-300">Apple</span>
              </button>
            </div>
          </form>

          {/* Enhanced footer */}
          <div className="text-center mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-light-gray/30">
            <div className="font-urbanist text-sm sm:text-base font-400 text-charcoal/70">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-coral font-600 hover:text-coral/80 transition-colors duration-300 relative group"
              >
                <span>Log in</span>
                <div className="absolute inset-x-0 -bottom-1 h-0.5 bg-coral/30 group-hover:bg-coral/60 transition-colors duration-300 rounded-full"></div>
              </Link>
            </div>
          </div>
        </div>

        {/* Premium Trust Indicators with spring animations */}
        <div className="flex justify-center items-center space-x-4 sm:space-x-6 md:space-x-8 lg:space-x-12 text-charcoal/60 text-center pt-4 sm:pt-6">
          <FadeInUp delay={1.5} duration={0.6} distance={20}>
            <PremiumHover scale={1.1} duration={0.3}>
              <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.7, type: "spring", stiffness: 300 }}
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-sage/10 rounded-full flex items-center justify-center"
                >
                  <ion-icon name="shield-checkmark-outline" style={{ color: "#749176" }} size="small"></ion-icon>
                </motion.div>
                <span className="font-urbanist text-xs sm:text-sm md:text-base font-500">Secure</span>
              </div>
            </PremiumHover>
          </FadeInUp>

          <FadeInUp delay={1.7} duration={0.6} distance={20}>
            <PremiumHover scale={1.1} duration={0.3}>
              <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.9, type: "spring", stiffness: 300 }}
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-coral/10 rounded-full flex items-center justify-center"
                >
                  <ion-icon name="people-outline" style={{ color: "#d67469" }} size="small"></ion-icon>
                </motion.div>
                <span className="font-urbanist text-xs sm:text-sm md:text-base font-500">Community</span>
              </div>
            </PremiumHover>
          </FadeInUp>

          <FadeInUp delay={1.9} duration={0.6} distance={20}>
            <PremiumHover scale={1.1} duration={0.3}>
              <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 2.1, type: "spring", stiffness: 300 }}
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-charcoal/10 rounded-full flex items-center justify-center"
                >
                  <ion-icon name="star-outline" style={{ color: "#211e1d" }} size="small"></ion-icon>
                </motion.div>
                <span className="font-urbanist text-xs sm:text-sm md:text-base font-500">Quality</span>
              </div>
            </PremiumHover>
          </FadeInUp>
        </div>
      </div>
      </div>
    </>
  );
}