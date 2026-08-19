"use client";

import { useEffect, useState } from "react";
import type { MotionValue, Transition } from "framer-motion";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, X } from "lucide-react";
import { MacbookScroll } from "@/components/ui/macbook";
import { CloudShader } from "./cloud-shader";
import { PlaneGame } from "./plane-game";

type HeroProps = {
  orbit: MotionValue<number>;
  dark?: boolean;
};

// Hardcoded edge cities to keep the center completely clear for typography
const EDGE_CITIES = [
  { name: "London", top: "18%", left: "8%" },
  { name: "Tokyo", top: "22%", right: "10%" },
  { name: "New York", bottom: "30%", left: "12%" },
  { name: "Dubai", bottom: "25%", right: "15%" },
];

function flightTransition(duration: number, delay: number, times: number[]): Transition {
  return { duration, delay, repeat: Infinity, ease: "easeInOut", times };
}

// Flight paths for 4 distinct planes to create a dynamic, living airspace.
// The new plane SVG points perfectly to the Right (0 degrees). 
// Math: Moving Right = 0 to +/- 45deg. Moving Left = 135 to 225deg.
const FLIGHT_PATHS = [
  {
    id: "flight-1",
    // Primary mid-altitude pass (Left to Right)
    animate: {
      x: ["-20vw", "30vw", "75vw", "120vw"],
      y: ["40vh", "5vh", "-10vh", "30vh"],
      // Banking up, leveling out, then banking down
      rotate: [-20, -15, 0, 25],
      scale: [0.5, 1.2, 0.8, 0.4],
      opacity: [0, 1, 0.8, 0],
    },
    transition: flightTransition(28, 0, [0, 0.35, 0.65, 1]),
    className: "w-14 sm:w-16 lg:w-[80px] z-20",
  },
  {
    id: "flight-2",
    // High-altitude background pass (Right to Left)
    animate: {
      x: ["120vw", "70vw", "20vw", "-20vw"],
      y: ["-10vh", "-20vh", "-5vh", "15vh"],
      // Pointing left (180deg), banking up slightly then down
      rotate: [195, 185, 165, 150], 
      scale: [0.3, 0.5, 0.4, 0.2],
      opacity: [0, 0.5, 0.4, 0],
    },
    transition: flightTransition(42, 5, [0, 0.3, 0.7, 1]),
    className: "w-10 sm:w-12 lg:w-[50px] z-10",
  },
  {
    id: "flight-3",
    // Fast, low-altitude pass (Left to Right)
    animate: {
      x: ["-20vw", "40vw", "80vw", "120vw"],
      y: ["70vh", "60vh", "50vh", "30vh"],
      // Consistently banking upward
      rotate: [-10, -15, -20, -25],
      scale: [0.8, 1.5, 1.2, 0.7],
      opacity: [0, 0.8, 0.8, 0],
    },
    transition: flightTransition(22, 12, [0, 0.4, 0.6, 1]),
    className: "w-16 sm:w-20 lg:w-[100px] z-30",
  },
  {
    id: "flight-4",
    // Steep descent (Right to Left)
    animate: {
      x: ["120vw", "60vw", "10vw", "-20vw"],
      y: ["10vh", "40vh", "60vh", "80vh"],
      // Pointing left (180deg) and angled heavily downward
      rotate: [160, 155, 150, 145],
      scale: [0.4, 0.8, 1.1, 0.6],
      opacity: [0, 0.7, 0.9, 0],
    },
    transition: flightTransition(32, 2, [0, 0.35, 0.65, 1]),
    className: "w-12 sm:w-14 lg:w-[70px] z-20",
  }
];

export function Hero({ orbit, dark = false }: HeroProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isGameOpen, setIsGameOpen] = useState(false);

  // Lock the main body scroll when the cinematic modal is open
  useEffect(() => {
    if (isVideoOpen || isGameOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isGameOpen, isVideoOpen]);

  return (
    <>
      <section
        id="top"
        className="relative isolate flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-[clamp(20px,5vw,80px)] pb-16 pt-24 text-center md:pb-12 md:pt-32"
      >
        <CloudShader
          speed={0.8}
          count={6}
          cloudColor={dark ? "#dce8ed" : "#fff7e8"}
          skyTopColor={dark ? "#17263b" : "#b7d3f2"}
          skyBottomColor={dark ? "#3f6178" : "#f4c3a4"}
          className="pointer-events-none absolute inset-0 z-0 opacity-85"
        />

        {/* Scattered Edge Pointers (Kept strictly to the periphery) */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[2] opacity-70">
          {EDGE_CITIES.map((city) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, delay: Math.random() * 0.5, ease: "easeOut" }}
              key={city.name}
              className="absolute flex items-center gap-2 font-mono text-[9px] font-medium uppercase tracking-[0.15em] text-[color:color-mix(in_srgb,var(--ink)_60%,transparent)] sm:text-[10px]"
              style={{ top: city.top, bottom: city.bottom, left: city.left, right: city.right }}
            >
              <span className="relative flex h-3 w-3 items-center justify-center rounded-full border border-[color:color-mix(in_srgb,var(--ink)_30%,transparent)] bg-[color:color-mix(in_srgb,var(--bg)_20%,transparent)]">
                <span className="h-1 w-1 rounded-full bg-[color:color-mix(in_srgb,var(--ink)_50%,transparent)]" />
              </span>
              {city.name}
            </motion.div>
          ))}
        </div>

        {/* Background glow - Immersive breathing/pulsing animation */}
        <motion.div
          animate={{
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--ink)_4%,transparent)_0%,transparent_70%)] blur-3xl md:w-[60vw]"
        />

        {/* 4 distinct aircraft passing through the scene */}
        {FLIGHT_PATHS.map((flight) => (
          <motion.div
            key={flight.id}
            animate={flight.animate}
            transition={flight.transition}
            className={`pointer-events-auto absolute left-0 top-0 text-[color:color-mix(in_srgb,var(--ink)_40%,transparent)] ${flight.className}`}
          >
            {/* Inner div handles the hover scaling without breaking the flight path physics */}
            <motion.div
              whileHover={{ 
                scale: 1.25,
                cursor: "pointer", 
                filter: "drop-shadow(0px 10px 20px color-mix(in_srgb, var(--ink) 25%, transparent))" 
              }}
              onClick={() => setIsGameOpen(true)}
              role="button"
              tabIndex={0}
              aria-label="Open Fly the message game"
              onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setIsGameOpen(true); } }}
              className="h-full w-full"
            >
              {/* Perfect top-down silhouette. Natively points Right (0deg). */}
              <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
                <path d="M 21.9 11.1 L 16.5 11.1 L 11 2 L 8 2 L 12 11.1 L 5 11.1 L 2.5 8 L 1.5 8 L 3 12 L 1.5 16 L 2.5 16 L 5 12.9 L 12 12.9 L 8 22 L 11 22 L 16.5 12.9 L 21.9 12.9 C 23.1 12.9 24 12.5 24 12 C 24 11.5 23.1 11.1 21.9 11.1 Z" />
              </svg>
            </motion.div>
          </motion.div>
        ))}

        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6 flex items-center justify-center gap-2 rounded-full bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] px-4 py-1.5 font-sans text-[12px] font-medium tracking-tight text-[var(--ink)] backdrop-blur-sm ring-1 ring-[color:color-mix(in_srgb,var(--ink)_6%,transparent)] md:mb-8 md:text-[13px]"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--ink)] opacity-40"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--ink)] opacity-80"></span>
          </span>
          Mumbai · Worldwide
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
          className="relative z-10 mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row md:mt-10 md:gap-4"
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
            className="group flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] px-8 font-sans text-[14px] font-medium text-[var(--ink)] no-underline backdrop-blur-sm transition-all hover:bg-[color:color-mix(in_srgb,var(--ink)_8%,transparent)] active:scale-[0.98] sm:w-auto"
          >
            <Play className="h-4 w-4 fill-current opacity-70 transition-opacity group-hover:opacity-100" />
            Watch Introduction
          </button>
        </motion.div>
      </section>

      <PlaneGame open={isGameOpen} onClose={() => setIsGameOpen(false)} />

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
            {/* Sticky Close Button */}
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