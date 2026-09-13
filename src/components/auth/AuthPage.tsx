import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  ShieldCheck,
  Check,
  AlertCircle,
  X,
  HeartPulse,
  IdCard,
} from 'lucide-react';
import { MediKioskLogo, MediKioskGlassBadge } from '../SvgIllustrations';

export interface AuthSuccessPayload {
  name: string;
  emailOrPhone: string;
  isNewUser: boolean;
  abhaId?: string;
}

interface AuthPageProps {
  onLoginSuccess: (payload: AuthSuccessPayload) => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onLoginSuccess,
  initialMode = 'signin',
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);

  // Sign In Form States
  const [signInIdentifier, setSignInIdentifier] = useState('rahul.verma@example.com');
  const [signInPassword, setSignInPassword] = useState('Password@123');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Create Account Form States
  const [signUpName, setSignUpName] = useState('');
  const [signUpIdentifier, setSignUpIdentifier] = useState('');
  const [signUpAbhaId, setSignUpAbhaId] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Status & Feedback States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Modals
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Handle Sign In submission
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!signInIdentifier.trim()) {
      setErrorMessage('Please enter your email or mobile number.');
      return;
    }

    if (!signInPassword.trim()) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);

    // Simulate authenticating against MediKiosk secure vault
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        name: signInIdentifier.includes('@') ? signInIdentifier.split('@')[0] : 'Rahul Verma',
        emailOrPhone: signInIdentifier,
        isNewUser: false,
      });
    }, 850);
  };

  // Handle Create Account submission
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!signUpName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!signUpIdentifier.trim()) {
      setErrorMessage('Please enter an email or mobile number.');
      return;
    }

    if (signUpPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    if (!agreedToTerms) {
      setErrorMessage('Please accept the Terms & Privacy Policy to create an account.');
      return;
    }

    setIsLoading(true);

    // Simulate account registration
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        name: signUpName.trim(),
        emailOrPhone: signUpIdentifier.trim(),
        abhaId: signUpAbhaId.trim() || undefined,
        isNewUser: true,
      });
    }, 950);
  };

  // Handle Google Sign In
  const handleGoogleAuth = () => {
    setIsLoading(true);
    setErrorMessage(null);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        name: 'Rahul Verma',
        emailOrPhone: 'rahul.verma@gmail.com',
        isNewUser: mode === 'signup',
      });
    }, 700);
  };

  // Quick fill demo user
  const handleQuickDemoFill = () => {
    setSignInIdentifier('rahul.verma@example.com');
    setSignInPassword('Password@123');
    setErrorMessage(null);
    setSuccessNotice('Demo credentials populated. Click "Sign In" to enter.');
    setTimeout(() => setSuccessNotice(null), 3500);
  };

  return (
    <div
      id="medikiosk-auth-page"
      className="h-screen w-full flex flex-col md:grid md:grid-cols-2 lg:grid-cols-[60%_40%] bg-[#F2F1FA] text-[#2E2C3A] selection:bg-[#4C499E]/20 overflow-hidden"
    >
      {/* =========================================================================
          LEFT SECTION: FULL-HEIGHT FULL-WIDTH VISUAL HERO PANEL (auth.png)
          - Occupies exactly 60% (60vw) on large screens (lg: and above)
          - Occupies 50% on medium tablet screens (md:)
          - Full 100vh height, fixed/static viewport panel
          - Full bleed: stretches from top->bottom and left->60% divider
          - No centered or max-width wrapper, no horizontal gaps
          ========================================================================= */}
      <section
        id="auth-visual-hero-panel"
        className="hidden md:block w-full h-screen h-full relative overflow-hidden bg-[#3E3A88] select-none flex-shrink-0"
      >
        {/* MediKiosk Glassmorphism Branding Box Overlay (anchored to top-left of the left illustration panel) */}
        <div
          id="medikiosk-left-logo-overlay"
          className="absolute top-6 left-6 sm:top-7 sm:left-7 lg:top-8 lg:left-8 z-20 pointer-events-none select-none transition-all duration-200"
        >
          <MediKioskGlassBadge />
        </div>

        <img
          src="/assets/auth.png"
          alt="MediKiosk Healthcare Illustration"
          className="w-full h-full object-cover object-left-bottom md:object-[left_bottom] lg:object-[left_bottom] 2xl:object-[0%_98%] pointer-events-none select-none block"
          loading="eager"
        />
        {/* Clean intentional vertical dividing boundary at 60% */}
        <div className="absolute top-0 right-0 bottom-0 w-px bg-black/10 pointer-events-none" />
      </section>

      {/* =========================================================================
          RIGHT SECTION: AUTHENTICATION WORKSPACE (40vw on desktop)
          - Top: Centered MediKiosk brand header (compact)
          - Center: Expanded authentication card utilizing available 40% width
          - Card width: min(90%, 760px) with comfortable 32-48px column padding
          - Bottom: Security & compliance footer
          - Fits comfortably within 100vh viewport without unnecessary scrolling
          - Independently scrollable when viewport height is restricted (overflow-y-auto)
          ========================================================================= */}
      <section
        id="auth-form-panel"
        className="w-full h-screen h-full overflow-y-auto overflow-x-hidden flex flex-col items-center justify-start px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 pt-6 sm:pt-7 lg:pt-8 pb-8 sm:pb-10"
      >
        <div className="w-full max-w-[min(90%,760px)] flex flex-col items-center">
          {/* 1. TOP BRANDING - Fixed visual anchor (remains stationary when switching modes) */}
          <div className="flex flex-col items-center justify-center text-center mb-3 sm:mb-4 select-none shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4C499E] to-[#605CB8] flex items-center justify-center text-white shadow-[0_4px_14px_rgba(76,73,158,0.22)]">
                <MediKioskLogo className="w-4.5 h-4.5 drop-shadow-xs" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-[#2E2C3A] tracking-tight">
                  MediKiosk
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#EFEBFA] text-[#4C499E] px-2 py-0.5 rounded-full border border-[#DFDAF5]">
                  Healthcare
                </span>
              </div>
            </div>
          </div>

          {/* 2. AUTHENTICATION CARD */}
          <motion.div
            id="auth-card"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
            className="w-full bg-white/98 backdrop-blur-md rounded-[24px] sm:rounded-[28px] border border-[#E4E0F4] shadow-[0_12px_36px_rgba(50,45,115,0.06)] p-5 sm:p-6 md:p-7 lg:p-8 transition-all duration-200"
          >
            {/* ── SEGMENTED AUTHENTICATION TOGGLE ── */}
            <div
              id="auth-toggle-segmented-control"
              className="w-full bg-[#ECE8F7]/85 p-1 rounded-xl flex items-center relative border border-[#DFDAF2] mb-5 select-none"
            >
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMessage(null);
                }}
                className={`relative z-10 flex-1 h-9 sm:h-9.5 flex items-center justify-center text-xs sm:text-[13.5px] rounded-lg transition-colors duration-200 text-center cursor-pointer ${
                  mode === 'signin'
                    ? 'text-white font-semibold'
                    : 'text-[#68638F] hover:text-[#3B3770] font-medium hover:bg-white/40'
                }`}
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMessage(null);
                }}
                className={`relative z-10 flex-1 h-9 sm:h-9.5 flex items-center justify-center text-xs sm:text-[13.5px] rounded-lg transition-colors duration-200 text-center cursor-pointer ${
                  mode === 'signup'
                    ? 'text-white font-semibold'
                    : 'text-[#68638F] hover:text-[#3B3770] font-medium hover:bg-white/40'
                }`}
              >
                Create Account
              </button>

              {/* Smooth sliding pill indicator with soft shadow & subtle inner highlight */}
              <motion.div
                layout
                transition={{ type: 'spring', stiffness: 450, damping: 36 }}
                className={`absolute top-1 bottom-1 rounded-lg bg-gradient-to-r from-[#4C499E] via-[#5551AC] to-[#6763BF] shadow-[0_2px_8px_rgba(76,73,158,0.28),inset_0_1px_0_rgba(255,255,255,0.22)] ${
                  mode === 'signin' ? 'left-1 w-[calc(50%-4px)]' : 'left-[calc(50%+1px)] w-[calc(50%-4px)]'
                }`}
              />
            </div>

            {/* Notification / Error Banner */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="mb-4 p-2.5 rounded-xl bg-[#FFF2F5] border border-[#FED7E2] text-[#C52243] text-xs flex items-start gap-2 shadow-2xs"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#C52243]" />
                  <span className="flex-1">{errorMessage}</span>
                  <button
                    type="button"
                    onClick={() => setErrorMessage(null)}
                    className="text-[#C52243]/70 hover:text-[#C52243] cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              )}

              {successNotice && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="mb-4 p-2.5 rounded-xl bg-[#F0FAF5] border border-[#D1F2E0] text-[#1E7E4E] text-xs flex items-center gap-2 shadow-2xs"
                >
                  <Check className="w-4 h-4 text-[#1E7E4E]" />
                  <span>{successNotice}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── FORM CONTENT AREA ── */}
            <AnimatePresence mode="wait">
              {mode === 'signin' ? (
                /* =========================================================
                   SIGN IN VIEW
                   ========================================================= */
                <motion.div
                  key="signin-view"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Refined Section Greeting: Compact, 600 weight, Deep Navy/Indigo */}
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, ease: 'easeOut' }}
                    className="mb-4 sm:mb-4.5 text-left"
                  >
                    <h2 className="text-[21px] sm:text-[22px] md:text-[23px] font-semibold text-[#1F1B44] tracking-[-0.025em] leading-snug flex items-center gap-1.5">
                      <span>Welcome back</span>
                      <span className="inline-block text-[18px] sm:text-[19px] select-none opacity-90 hover:opacity-100 hover:rotate-12 transition-transform duration-200">
                        👋
                      </span>
                    </h2>
                  </motion.div>

                  <form onSubmit={handleSignIn} className="space-y-4">
                    {/* Field 1: Email or Mobile */}
                    <div className="text-left">
                      <label
                        htmlFor="signin-identifier"
                        className="block text-[13px] sm:text-[13.5px] font-medium text-[#322E58] tracking-tight mb-1.5"
                      >
                        Email or Mobile Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7F7B9F]">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          id="signin-identifier"
                          type="text"
                          value={signInIdentifier}
                          onChange={(e) => setSignInIdentifier(e.target.value)}
                          placeholder="e.g. rahul.verma@example.com or 9876543210"
                          className="w-full pl-10 pr-3.5 h-11 sm:h-11.5 bg-[#FAF9FD] hover:bg-white focus:bg-white text-[#221F45] text-[14.5px] sm:text-[15px] rounded-xl border border-[#DCD8F0] focus:border-[#4C499E] focus:ring-4 focus:ring-[#4C499E]/10 outline-none transition-all duration-200 placeholder:text-[#A7A3C4]"
                        />
                      </div>
                    </div>

                    {/* Field 2: Password */}
                    <div className="text-left">
                      <label
                        htmlFor="signin-password"
                        className="block text-[13px] sm:text-[13.5px] font-medium text-[#322E58] tracking-tight mb-1.5"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7F7B9F]">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          id="signin-password"
                          type={showSignInPassword ? 'text' : 'password'}
                          value={signInPassword}
                          onChange={(e) => setSignInPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="w-full pl-10 pr-10 h-11 sm:h-11.5 bg-[#FAF9FD] hover:bg-white focus:bg-white text-[#221F45] text-[14.5px] sm:text-[15px] rounded-xl border border-[#DCD8F0] focus:border-[#4C499E] focus:ring-4 focus:ring-[#4C499E]/10 outline-none transition-all duration-200 placeholder:text-[#A7A3C4]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignInPassword(!showSignInPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#7F7B9F] hover:text-[#4C499E] transition-colors cursor-pointer"
                          aria-label={showSignInPassword ? 'Hide password' : 'Show password'}
                        >
                          {showSignInPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Remember me & Forgot password - Balanced Baseline */}
                    <div className="flex items-center justify-between pt-0.5">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 rounded border-[#D2CEEC] text-[#4C499E] focus:ring-[#4C499E]/30 cursor-pointer accent-[#4C499E]"
                        />
                        <span className="text-xs sm:text-[12.5px] text-[#5E5A84] font-medium">
                          Remember me
                        </span>
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          setForgotPasswordEmail(signInIdentifier);
                          setShowForgotPasswordModal(true);
                        }}
                        className="text-xs sm:text-[12.5px] font-medium sm:font-semibold text-[#4C499E] hover:text-[#38347A] hover:underline transition-colors cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>

                    {/* Primary Sign In Button */}
                    <button
                      id="auth-sign-in-submit-button"
                      type="submit"
                      disabled={isLoading}
                      className="group w-full h-11 sm:h-11.5 px-5 rounded-xl bg-gradient-to-r from-[#4C499E] via-[#5753AF] to-[#6662BF] hover:from-[#43408E] hover:to-[#5753AF] text-white text-xs sm:text-sm font-semibold shadow-[0_4px_16px_rgba(76,73,158,0.25)] hover:shadow-[0_6px_22px_rgba(76,73,158,0.34)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:pointer-events-none mt-1"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          <span>Signing in...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Alternative OR Divider */}
                  <div className="relative flex items-center justify-center my-3.5 sm:my-4">
                    <div className="w-full border-t border-[#EAE6F5]" />
                    <span className="absolute bg-white px-3 py-0.5 rounded-full border border-[#EFEBF7] text-[10.5px] font-semibold text-[#8F8CAE] uppercase tracking-wider">
                      OR
                    </span>
                  </div>

                  {/* Google OAuth Option */}
                  <button
                    id="auth-google-sign-in-button"
                    type="button"
                    onClick={handleGoogleAuth}
                    disabled={isLoading}
                    className="w-full h-11 sm:h-11.5 px-4 rounded-xl bg-white hover:bg-[#F9F8FD] text-[#2E2B4B] text-xs sm:text-sm font-medium sm:font-semibold border border-[#DCD8F0] hover:border-[#CDC8EA] shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_2px_8px_rgba(76,73,158,0.06)] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer"
                  >
                    {/* Google Multicolor 'G' */}
                    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  {/* Demo Quick-Fill Pill */}
                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={handleQuickDemoFill}
                      className="text-[11px] font-medium text-[#7C78A4] hover:text-[#4C499E] bg-[#F5F3FC] hover:bg-[#EBE7F9] px-3 py-1 rounded-full border border-[#DFDAF4] transition-all cursor-pointer"
                    >
                      💡 Quick Demo Fill: Rahul Verma
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* =========================================================
                   CREATE ACCOUNT VIEW
                   ========================================================= */
                <motion.div
                  key="signup-view"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Refined Section Heading: Compact, 600 weight, Deep Navy/Indigo */}
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, ease: 'easeOut' }}
                    className="mb-4 sm:mb-4.5 text-left"
                  >
                    <h2 className="text-[21px] sm:text-[22px] md:text-[23px] font-semibold text-[#1F1B44] tracking-[-0.025em] leading-snug flex items-center gap-1.5">
                      <span>Create Account</span>
                      <span className="inline-block text-[18px] sm:text-[19px] select-none opacity-90">
                        ✨
                      </span>
                    </h2>
                  </motion.div>

                  <form onSubmit={handleSignUp} className="space-y-2.5">
                    {/* Full Name */}
                    <div className="text-left">
                      <label
                        htmlFor="signup-name"
                        className="block text-[13px] sm:text-[13.5px] font-medium text-[#322E58] tracking-tight mb-1"
                      >
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7F7B9F]">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          id="signup-name"
                          type="text"
                          value={signUpName}
                          onChange={(e) => setSignUpName(e.target.value)}
                          placeholder="e.g. Rahul Verma"
                          className="w-full pl-10 pr-3.5 h-10.5 sm:h-11 bg-[#FAF9FD] hover:bg-white focus:bg-white text-[#221F45] text-[14px] sm:text-[14.5px] rounded-xl border border-[#DCD8F0] focus:border-[#4C499E] focus:ring-4 focus:ring-[#4C499E]/10 outline-none transition-all duration-200 placeholder:text-[#A7A3C4]"
                        />
                      </div>
                    </div>

                    {/* Email or Mobile Number */}
                    <div className="text-left">
                      <label
                        htmlFor="signup-identifier"
                        className="block text-[13px] sm:text-[13.5px] font-medium text-[#322E58] tracking-tight mb-1"
                      >
                        Email or Mobile Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7F7B9F]">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          id="signup-identifier"
                          type="text"
                          value={signUpIdentifier}
                          onChange={(e) => setSignUpIdentifier(e.target.value)}
                          placeholder="e.g. rahul.verma@example.com or 9876543210"
                          className="w-full pl-10 pr-3.5 h-10.5 sm:h-11 bg-[#FAF9FD] hover:bg-white focus:bg-white text-[#221F45] text-[14px] sm:text-[14.5px] rounded-xl border border-[#DCD8F0] focus:border-[#4C499E] focus:ring-4 focus:ring-[#4C499E]/10 outline-none transition-all duration-200 placeholder:text-[#A7A3C4]"
                        />
                      </div>
                    </div>

                    {/* ABHA ID */}
                    <div className="text-left">
                      <label
                        htmlFor="signup-abha"
                        className="block text-[13px] sm:text-[13.5px] font-medium text-[#322E58] tracking-tight mb-1"
                      >
                        ABHA ID
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7F7B9F]">
                          <IdCard className="w-4 h-4" />
                        </div>
                        <input
                          id="signup-abha"
                          type="text"
                          value={signUpAbhaId}
                          onChange={(e) => setSignUpAbhaId(e.target.value)}
                          placeholder="Enter your ABHA ID"
                          className="w-full pl-10 pr-3.5 h-10.5 sm:h-11 bg-[#FAF9FD] hover:bg-white focus:bg-white text-[#221F45] text-[14px] sm:text-[14.5px] rounded-xl border border-[#DCD8F0] focus:border-[#4C499E] focus:ring-4 focus:ring-[#4C499E]/10 outline-none transition-all duration-200 placeholder:text-[#A7A3C4]"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="text-left">
                      <label
                        htmlFor="signup-password"
                        className="block text-[13px] sm:text-[13.5px] font-medium text-[#322E58] tracking-tight mb-1"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7F7B9F]">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          id="signup-password"
                          type={showSignUpPassword ? 'text' : 'password'}
                          value={signUpPassword}
                          onChange={(e) => setSignUpPassword(e.target.value)}
                          placeholder="Create strong password (min. 6 chars)"
                          className="w-full pl-10 pr-10 h-10.5 sm:h-11 bg-[#FAF9FD] hover:bg-white focus:bg-white text-[#221F45] text-[14px] sm:text-[14.5px] rounded-xl border border-[#DCD8F0] focus:border-[#4C499E] focus:ring-4 focus:ring-[#4C499E]/10 outline-none transition-all duration-200 placeholder:text-[#A7A3C4]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#7F7B9F] hover:text-[#4C499E] transition-colors cursor-pointer"
                          aria-label={showSignUpPassword ? 'Hide password' : 'Show password'}
                        >
                          {showSignUpPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="text-left">
                      <label
                        htmlFor="signup-confirm-password"
                        className="block text-[13px] sm:text-[13.5px] font-medium text-[#322E58] tracking-tight mb-1"
                      >
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7F7B9F]">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          id="signup-confirm-password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={signUpConfirmPassword}
                          onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                          placeholder="Confirm your password"
                          className="w-full pl-10 pr-10 h-10.5 sm:h-11 bg-[#FAF9FD] hover:bg-white focus:bg-white text-[#221F45] text-[14px] sm:text-[14.5px] rounded-xl border border-[#DCD8F0] focus:border-[#4C499E] focus:ring-4 focus:ring-[#4C499E]/10 outline-none transition-all duration-200 placeholder:text-[#A7A3C4]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#7F7B9F] hover:text-[#4C499E] transition-colors cursor-pointer"
                          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Agree to Terms Checkbox */}
                    <div className="pt-0.5 text-left">
                      <label className="flex items-start gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={agreedToTerms}
                          onChange={(e) => setAgreedToTerms(e.target.checked)}
                          className="w-4 h-4 mt-0.5 rounded border-[#D2CEEC] text-[#4C499E] focus:ring-[#4C499E]/30 cursor-pointer accent-[#4C499E]"
                        />
                        <span className="text-xs text-[#5E5A84] leading-relaxed">
                          I agree to{' '}
                          <button
                            type="button"
                            onClick={() => setShowTermsModal(true)}
                            className="font-medium sm:font-semibold text-[#4C499E] hover:underline"
                          >
                            Terms
                          </button>{' '}
                          &{' '}
                          <button
                            type="button"
                            onClick={() => setShowTermsModal(true)}
                            className="font-medium sm:font-semibold text-[#4C499E] hover:underline"
                          >
                            Privacy Policy
                          </button>
                        </span>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      id="auth-create-account-submit-button"
                      type="submit"
                      disabled={isLoading}
                      className="group w-full h-11 sm:h-11.5 px-5 rounded-xl bg-gradient-to-r from-[#4C499E] via-[#5753AF] to-[#6662BF] hover:from-[#43408E] hover:to-[#5753AF] text-white text-xs sm:text-sm font-semibold shadow-[0_4px_16px_rgba(76,73,158,0.25)] hover:shadow-[0_6px_22px_rgba(76,73,158,0.34)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:pointer-events-none mt-1"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          <span>Creating Account...</span>
                        </>
                      ) : (
                        <>
                          <span>Create Account</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Switch to Sign In */}
                  <div className="pt-2 text-center text-xs text-[#68638F]">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signin');
                        setErrorMessage(null);
                      }}
                      className="font-semibold text-[#4C499E] hover:text-[#38347A] hover:underline cursor-pointer transition-colors"
                    >
                      Sign In
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* 3. FOOTER SECURITY & HELPLINE */}
          <footer className="mt-3 sm:mt-4 text-center text-xs text-[#9B97B5] space-y-1 select-none">
            <div className="flex items-center justify-center gap-2 text-[11px] text-[#7A7699]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2E8B57]" />
              <span className="font-medium">ABDM & ABHA Verified Platform</span>
              <span>•</span>
              <span>256-Bit Encrypted</span>
            </div>
            <p className="text-[10.5px] text-[#A6A2BF]">
              © 2026 MediKiosk Health Systems. Need clinical assistance? Call 1800-MEDIKIOSK
            </p>
          </footer>
        </div>
      </section>

      {/* =========================================================================
          MODAL 1: FORGOT PASSWORD
          ========================================================================= */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1B4B]/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 border border-[#DFDAF5] shadow-2xl space-y-4 relative">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="w-10 h-10 rounded-xl bg-[#EFEBFA] text-[#4C499E] flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#2E2C3A] pt-1">
                  Reset your password
                </h3>
                <p className="text-xs text-[#7B779A]">
                  Enter your registered email address or mobile number to receive a secure recovery code.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowForgotPasswordModal(false);
                  setForgotPasswordSent(false);
                }}
                className="w-8 h-8 rounded-full bg-[#F5F3FB] hover:bg-[#EAE6F8] flex items-center justify-center text-[#747094] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {forgotPasswordSent ? (
              <div className="py-4 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#EAF5EF] text-[#2E8B57] flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-sm text-[#2E2C3A]">
                  Recovery instructions sent!
                </h4>
                <p className="text-xs text-[#7B779A]">
                  We have sent a verification code to <span className="font-medium text-[#4C499E]">{forgotPasswordEmail}</span>. Follow the link in the message to reset your password.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPasswordModal(false);
                    setForgotPasswordSent(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#4C499E] text-white text-xs font-semibold hover:bg-[#3E3A85] transition"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (forgotPasswordEmail.trim()) {
                    setForgotPasswordSent(true);
                  }
                }}
                className="space-y-3 pt-2"
              >
                <div className="space-y-1 text-left">
                  <label className="text-xs font-semibold text-[#444166]">
                    Email or Mobile Number
                  </label>
                  <input
                    type="text"
                    required
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    placeholder="e.g. rahul.verma@example.com"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF9FD] rounded-xl border border-[#DCD8F0] focus:border-[#4C499E] focus:ring-2 focus:ring-[#4C499E]/15 outline-none"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotPasswordModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-[#F4F2FB] hover:bg-[#EAE6F8] text-[#55517E] text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#4C499E] hover:bg-[#3E3A85] text-white text-xs font-semibold shadow-xs"
                  >
                    Send Recovery Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: TERMS OF SERVICE & PRIVACY POLICY
          ========================================================================= */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1B4B]/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg max-h-[85vh] bg-white rounded-3xl p-6 sm:p-7 border border-[#DFDAF5] shadow-2xl flex flex-col space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFEBF9]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#EFEBFA] text-[#4C499E] flex items-center justify-center">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#2E2C3A] text-base">
                    MediKiosk Health Terms & Privacy
                  </h3>
                  <p className="text-xs text-[#8480A2]">
                    Compliant with National Digital Health Mission (ABDM)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="w-8 h-8 rounded-full bg-[#F5F3FB] hover:bg-[#EAE6F8] flex items-center justify-center text-[#747094] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 text-xs text-[#58547A] space-y-3 leading-relaxed">
              <p>
                <strong>1. Data Confidentiality:</strong> Your clinical data, prescriptions, diagnostic reports, and medical consultations are encrypted using AES-256 standard encryption both at rest and in transit.
              </p>
              <p>
                <strong>2. ABHA Integration:</strong> MediKiosk syncs with your Ayushman Bharat Health Account (ABHA) only under explicit electronic consent for verifiable continuity of care.
              </p>
              <p>
                <strong>3. AI Clinical Triaging:</strong> Intake questionnaires and symptom assessments are utilized solely to assist attending physicians and clinical kiosks, not as autonomous final medical diagnoses.
              </p>
              <p>
                <strong>4. Patient Rights:</strong> You retain the full right to export, redact, or request deletion of your session history and uploaded documents at any time via your Profile Settings.
              </p>
            </div>

            <div className="pt-2 border-t border-[#EFEBF9] flex justify-end">
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="px-5 py-2.5 rounded-xl bg-[#4C499E] hover:bg-[#3E3A85] text-white text-xs font-semibold transition cursor-pointer"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
