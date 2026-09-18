"use client";

import { useState, Suspense, useRef, type ReactNode, type MouseEvent as ReactMouseEvent } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, useMotionValue, useSpring, type Variants } from "framer-motion";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";

// ----------------------------------------------------------------------
// Micro-interaction: Magnetic Physics Wrapper
// ----------------------------------------------------------------------
function Magnetic({ children, strength = 20 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * (strength / 100));
    y.set((e.clientY - centerY) * (strength / 100));
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="flex w-fit items-center justify-center"
    >
      {children}
    </motion.div>
  );
}

// ----------------------------------------------------------------------
// Form Component
// ----------------------------------------------------------------------
function RegisterForm() {
  const searchParams = useSearchParams();
  const isVerifyRequest = searchParams.get("verifyRequest") === "1";
  const callbackUrl = searchParams.get("callbackUrl") || "/onboarding";
  
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("email", { email, callbackUrl, redirect: false });
      
      if (res?.error) {
        setError("Unable to send link. Please check your email and try again.");
      } else if (res?.ok) {
        setSuccess(true);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  if (isVerifyRequest || success) {
    return (
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col items-center text-center"
      >
        <motion.div variants={itemVariants} className="mb-8 flex size-20 items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] text-[var(--ink)]">
          <Mail size={32} strokeWidth={1.5} />
        </motion.div>
        
        <motion.h2 variants={itemVariants} className="font-sans text-[clamp(40px,5vw,56px)] font-bold leading-[0.9] tracking-tighter text-[var(--ink)]">
          Check your inbox.
        </motion.h2>
        
        <motion.p variants={itemVariants} className="mt-6 max-w-[320px] text-balance font-sans text-[16px] font-medium leading-relaxed text-[color:color-mix(in_srgb,var(--ink)_60%,transparent)]">
          A secure access link has been dispatched to <strong className="font-semibold text-[var(--ink)]">{email || "your email"}</strong>.
        </motion.p>

        <motion.div variants={itemVariants} className="mt-12">
          <Link href="/" className="group flex items-center gap-2 font-sans text-[15px] font-medium text-[color:color-mix(in_srgb,var(--ink)_60%,transparent)] transition-colors hover:text-[var(--ink)]">
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Return to Index
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.form 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      onSubmit={handleSubmit} 
      className="flex w-full flex-col items-center"
    >
      <motion.h1 
        variants={itemVariants}
        className="font-sans text-[clamp(48px,8vw,80px)] font-bold leading-[0.9] tracking-tighter text-[var(--ink)] text-center"
      >
        Gain <span className="text-[color:color-mix(in_srgb,var(--ink)_35%,transparent)]">access.</span>
      </motion.h1>

      <motion.p 
        variants={itemVariants}
        className="mt-6 max-w-[320px] text-center font-sans text-[16px] font-medium leading-relaxed text-[color:color-mix(in_srgb,var(--ink)_60%,transparent)]"
      >
        Enter your email address to receive a secure login link.
      </motion.p>

      <div className="mt-14 w-full max-w-[400px]">
        <motion.div variants={itemVariants} className="group relative">
          {/* Adjusted label to tight, standard uppercase instead of tracking-[0.2em] */}
          <label htmlFor="email" className="absolute -top-7 left-0 font-mono text-[11px] font-bold uppercase tracking-wide text-[color:color-mix(in_srgb,var(--ink)_50%,transparent)] transition-colors group-focus-within:text-[var(--ink)]">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full bg-transparent pb-3 pt-4 font-sans text-[24px] font-medium text-[var(--ink)] outline-none transition-colors placeholder:text-[color:color-mix(in_srgb,var(--ink)_15%,transparent)] md:text-[32px]"
          />
          <div className="absolute bottom-0 left-0 h-px w-full origin-left bg-[color:color-mix(in_srgb,var(--ink)_15%,transparent)]" />
          <div className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[var(--ink)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-focus-within:scale-x-100" />
        </motion.div>

        {error && (
          <motion.p 
            initial={{ opacity: 0, y: 5 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mt-6 text-[15px] font-medium text-red-500"
          >
            {error}
          </motion.p>
        )}

        <motion.div variants={itemVariants} className="mt-16 flex w-full justify-center">
          <Magnetic strength={15}>
            <button
              type="submit"
              disabled={loading}
              className="group inline-flex h-14 items-center gap-3 rounded-full bg-[var(--ink)] px-8 font-sans text-[15px] font-semibold text-[var(--bg)] shadow-[0_20px_40px_color-mix(in_srgb,var(--ink)_10%,transparent)] transition-all hover:scale-[1.03] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? "Transmitting..." : "Send Secure Link"}
              {!loading && <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />}
            </button>
          </Magnetic>
        </motion.div>
      </div>
    </motion.form>
  );
}

// ----------------------------------------------------------------------
// Main Page Layout
// ----------------------------------------------------------------------
export default function RegisterPage() {
  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[var(--bg)] px-[clamp(24px,5vw,80px)] text-[var(--ink)]">
      
      {/* Cinematic Noise Overlay */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.06] mix-blend-overlay" />
      
      {/* Ambient Radial Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-20 h-[80vw] w-[80vw] max-w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--ink)_4%,transparent)_0%,transparent_60%)] blur-[100px]" />

      {/* Massive Hollow Background Watermark */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 flex -translate-x-1/2 -translate-y-1/2 select-none items-center justify-center"
      >
        <span className="font-sans text-[clamp(180px,28vw,600px)] font-bold leading-none tracking-tighter text-[var(--ink)] text-transparent opacity-10 [-webkit-text-stroke:2px_currentColor]">
          AUTH
        </span>
      </motion.div>

      {/* Top Navigation */}
      <div className="absolute left-[clamp(24px,5vw,80px)] top-[clamp(24px,5vw,64px)] z-20">
        <Link 
          href="/" 
          className="group flex items-center gap-2 font-sans text-[15px] font-medium text-[color:color-mix(in_srgb,var(--ink)_60%,transparent)] transition-colors hover:text-[var(--ink)]"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          Return to Index
        </Link>
      </div>

      {/* Core Content */}
      <div className="relative z-10 w-full max-w-2xl">
        <Suspense fallback={<div className="font-sans text-[15px] font-medium text-[color:color-mix(in_srgb,var(--ink)_50%,transparent)] text-center">Establishing Connection...</div>}>
          <RegisterForm />
        </Suspense>
      </div>

    </main>
  );
}