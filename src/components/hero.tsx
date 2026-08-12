"use client";

import { useState, useEffect } from "react";
import type { MotionValue } from "framer-motion";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, X } from "lucide-react";
import { MacbookScroll } from "@/components/ui/macbook";

type HeroProps = {
  orbit: MotionValue<number>;
};

export function Hero({ orbit }: HeroProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // Lock the main body scroll when the cinematic modal is open
  useEffect(() => {
    if (isVideoOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isVideoOpen]);

  return (
    <>
      <section
        id="top"
        className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-[clamp(20px,5vw,80px)] pb-16 pt-24 text-center md:pb-12 md:pt-32"
      >
        {/* Background glow to prevent emptiness */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--ink)_4%,transparent)_0%,transparent_70%)] blur-3xl md:w-[60vw]" />

        {/* Floating Doodle 1: Abstract loop (Top Left) */}
        <motion.div
          initial={{ opacity: 0, rotate: -20, scale: 0.8 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
          style={{ rotate: orbit }}
          className="absolute left-[-2%] top-[10%] w-12 text-[color:color-mix(in_srgb,var(--ink)_15%,transparent)] sm:left-[2%] md:left-[10%] sm:w-16 lg:left-[15%] lg:top-[25%] lg:w-20"
        >
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
            <path d="M20 80 C 20 20, 80 20, 80 80 C 80 120, 20 60, 40 40" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>

        {/* Floating Doodle 2: Speech Bubble (Mid Left) */}
        <motion.div
          initial={{ opacity: 0, x: -30, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ delay: 0.7, duration: 1, ease: "easeOut" }}
          className="absolute left-[-5%] top-[75%] w-16 text-[color:color-mix(in_srgb,var(--ink)_12%,transparent)] sm:left-[-2%] md:left-[2%] sm:w-24 lg:left-[5%] lg:top-[50%] lg:w-[120px]"
        >
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
            <path d="M10 50 C 10 20, 90 20, 90 50 C 90 80, 50 80, 30 90 L 30 75 C 15 70, 10 60, 10 50 Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>

        {/* Floating Doodle 3: Aircraft Landing (Right) */}
        <motion.div
          initial={{ opacity: 0, x: 50, y: -60, rotate: -15 }}
          animate={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
          transition={{ delay: 0.9, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute right-[-4%] top-[18%] w-14 text-[color:color-mix(in_srgb,var(--ink)_20%,transparent)] sm:right-[2%] md:right-[5%] sm:w-20 lg:right-[8%] lg:top-[38%] lg:w-[110px]"
        >
          <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" className="h-full w-full -rotate-12">
            <path d="M18.752 16.038c-.097.266-.822 1.002-6.029-.878l-5.105-1.843C5.841 12.676 3.34 11.668 2.36 11.1c-.686-.397-.836-1.282-.836-1.282s-.163-2.956-.263-3.684c-.1-.728.095-.853.796-.492.436.225 1.865 2.562 2.464 3.567 1.512.381 2.862.761 3.493.949-.257-1.717-.74-4.928-.913-5.933-.166-.963.55-.535.55-.535.331.19.983.661 1.206 1.002 1.522 2.326 3.672 6.6 3.836 6.928.896.28 2.277.733 3.102 1.03 2.156.779 3.087 3.034 2.957 3.388z" />
          </svg>
        </motion.div>

        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6 flex items-center justify-center gap-2 rounded-full bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] px-4 py-1.5 font-sans text-[12px] font-medium tracking-tight text-[var(--ink)] ring-1 ring-[color:color-mix(in_srgb,var(--ink)_6%,transparent)] md:mb-8 md:text-[13px]"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--ink)] opacity-40"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--ink)] opacity-80"></span>
          </span>
          New Delhi · Worldwide
        </motion.div>

        {/* Main Headline */}
        <div className="relative z-10 flex max-w-[900px] flex-col items-center">
          <motion.p
            className="mb-3 font-sans text-[15px] font-medium tracking-tight text-[var(--muted)] sm:text-lg md:mb-4 md:text-xl"
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ delay: 0.1, duration: 0.8 }}
          >
            Speak with clarity. Lead with presence.
          </motion.p>

          <motion.h1
            className="relative m-0 font-sans text-[clamp(40px,11vw,140px)] font-semibold leading-[0.9] tracking-tighter text-[var(--ink)]"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            Make your message{" "}
            <span className="relative inline-block whitespace-nowrap">
              land.
              {/* Doodle 4: Hand-drawn Underline */}
              <svg
                className="absolute -bottom-1 left-0 w-full text-[var(--ink)] opacity-30 md:-bottom-2"
                viewBox="0 0 200 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
              >
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
                  d="M5 10 Q 50 2 100 8 T 195 10"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="mt-6 max-w-[500px] text-balance font-sans text-[15px] leading-relaxed text-[var(--muted)] md:mt-8 md:text-[17px]"
          >
            ArticulateX is a professional speaking studio tailored for leaders with something meaningful to say.
          </motion.p>
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row md:mt-10 md:gap-4"
        >
          <a
            href="#about"
            className="group flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--ink)] px-8 font-sans text-[14px] font-medium text-[var(--bg)] no-underline transition-all hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
          >
            Explore Method
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>

          <button
            onClick={() => setIsVideoOpen(true)}
            className="group flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] px-8 font-sans text-[14px] font-medium text-[var(--ink)] no-underline transition-all hover:bg-[color:color-mix(in_srgb,var(--ink)_8%,transparent)] active:scale-[0.98] sm:w-auto"
          >
            <Play className="h-4 w-4 fill-current opacity-70 transition-opacity group-hover:opacity-100" />
            Watch Introduction
          </button>
        </motion.div>
      </section>

      {/* Cinematic MacBook Scroll Overlay */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] h-[100svh] w-full overflow-y-auto overflow-x-hidden bg-[color:color-mix(in_srgb,var(--bg)_95%,transparent)] backdrop-blur-3xl backdrop-saturate-150"
          >
            {/* Sticky Close Button - Optimized for mobile touch target */}
            <button
              onClick={() => setIsVideoOpen(false)}
              className="fixed right-4 top-4 z-[110] flex h-12 w-12 items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--ink)_8%,transparent)] text-[var(--ink)] backdrop-blur-md transition-colors hover:bg-[color:color-mix(in_srgb,var(--ink)_12%,transparent)] md:right-10 md:top-10"
            >
              <X size={20} strokeWidth={2} />
            </button>

            {/* The Macbook Scroll Component */}
            <div className="relative flex w-full flex-col items-center justify-center pb-24 pt-16 md:pb-32 md:pt-20">
              <MacbookScroll
                title={
                  <span className="font-sans text-[clamp(20px,4vw,36px)] font-medium tracking-tight text-[var(--ink)]">
                    Scroll down to unpack <br className="hidden sm:block" /> the method.
                  </span>
                }
                src={`https://ixl4i8iv3r.ufs.sh/f/GKvLvib9Pvzivad34YOmtnSov1OQC95WM4PUyHfDq3LslxYJ`}
                showGradient={false}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Peerlist logo exactly as provided
const Badge = ({ className }: { className?: string }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M56 28C56 43.464 43.464 56 28 56C12.536 56 0 43.464 0 28C0 12.536 12.536 0 28 0C43.464 0 56 12.536 56 28Z"
        fill="#00AA45"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M28 54C42.3594 54 54 42.3594 54 28C54 13.6406 42.3594 2 28 2C13.6406 2 2 13.6406 2 28C2 42.3594 13.6406 54 28 54ZM28 56C43.464 56 56 43.464 56 28C56 12.536 43.464 0 28 0C12.536 0 0 12.536 0 28C0 43.464 12.536 56 28 56Z"
        fill="#219653"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27.0769 12H15V46H24.3846V38.8889H27.0769C34.7305 38.8889 41 32.9048 41 25.4444C41 17.984 34.7305 12 27.0769 12ZM24.3846 29.7778V21.1111H27.0769C29.6194 21.1111 31.6154 23.0864 31.6154 25.4444C31.6154 27.8024 29.6194 29.7778 27.0769 29.7778H24.3846Z"
        fill="#24292E"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 11H29.0769C36.2141 11 42 16.5716 42 23.4444C42 30.3173 36.2141 35.8889 29.0769 35.8889H25.3846V43H18V11ZM25.3846 28.7778H29.0769C32.1357 28.7778 34.6154 26.39 34.6154 23.4444C34.6154 20.4989 32.1357 18.1111 29.0769 18.1111H25.3846V28.7778Z"
        fill="white"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17 10H29.0769C36.7305 10 43 15.984 43 23.4444C43 30.9048 36.7305 36.8889 29.0769 36.8889H26.3846V44H17V10ZM19 12V42H24.3846V34.8889H29.0769C35.6978 34.8889 41 29.7298 41 23.4444C41 17.1591 35.6978 12 29.0769 12H19ZM24.3846 17.1111H29.0769C32.6521 17.1111 35.6154 19.9114 35.6154 23.4444C35.6154 26.9775 32.6521 29.7778 29.0769 29.7778H24.3846V17.1111ZM26.3846 19.1111V27.7778H29.0769C31.6194 27.7778 33.6154 25.8024 33.6154 23.4444C33.6154 21.0864 31.6194 19.1111 29.0769 19.1111H26.3846Z"
        fill="#24292E"
      ></path>
    </svg>
  );
};