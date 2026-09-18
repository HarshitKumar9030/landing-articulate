"use client";

import { useEffect, useRef, type ReactNode, type MouseEvent as ReactMouseEvent } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate, type Variants } from "framer-motion";
import { ArrowLeft } from "lucide-react";

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

export default function NotFound() {
  // Mouse tracking for Spotlight and Parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const xPct = useMotionValue(0);
  const yPct = useMotionValue(0);

  // Smooth springs for the parallax drift
  const springXPct = useSpring(xPct, { stiffness: 40, damping: 20 });
  const springYPct = useSpring(yPct, { stiffness: 40, damping: 20 });

  // Move the background 404 in the opposite direction of the mouse
  const parallaxX = useTransform(springXPct, [-1, 1], [60, -60]);
  const parallaxY = useTransform(springYPct, [-1, 1], [60, -60]);

  // Center the spotlight on mount to avoid hydration mismatch
  useEffect(() => {
    mouseX.set(window.innerWidth / 2);
    mouseY.set(window.innerHeight / 2);
  }, [mouseX, mouseY]);

  function handleMouseMove(e: ReactMouseEvent<HTMLElement>) {
    // Exact pixels for the spotlight
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);

    // -1 to 1 percentages for the parallax physics
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    xPct.set(x * 2);
    yPct.set(y * 2);
  }

  // Create the dynamic CSS radial gradient spotlight
  const spotlightBackground = useMotionTemplate`radial-gradient(800px circle at ${mouseX}px ${mouseY}px, color-mix(in_srgb, var(--ink) 8%, transparent), transparent 80%)`;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <main 
      onMouseMove={handleMouseMove}
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[var(--bg)] px-[clamp(24px,5vw,80px)] text-[var(--ink)]"
    >
      {/* 1. Cinematic Noise Overlay */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
      
      {/* 2. Interactive Spotlight */}
      <motion.div 
        className="pointer-events-none absolute inset-0 -z-20"
        style={{ background: spotlightBackground }}
      />

      {/* 3. Deep Cinematic Alert Orb (Subtle pulsing red/orange glow) */}
      <motion.div 
        animate={{ scale: [1, 1.05, 1], opacity: [0.03, 0.06, 0.03] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-1/2 top-1/2 -z-20 h-[60vw] w-[60vw] max-w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF3300] blur-[100px]"
      />

      {/* 4. Massive Parallax "404" (Fixed to never block text) */}
      <motion.div 
        style={{ x: parallaxX, y: parallaxY }}
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 flex -translate-x-1/2 -translate-y-1/2 select-none items-center justify-center opacity-5"
      >
        <span className="font-sans text-[clamp(200px,35vw,700px)] font-bold leading-none tracking-tighter text-[var(--ink)]">
          404
        </span>
      </motion.div>

      {/* 5. Foreground Content */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col items-center text-center"
      >
        <motion.div variants={itemVariants} className="mb-8 inline-flex items-center gap-2 rounded-full border border-[color:color-mix(in_srgb,var(--ink)_10%,transparent)] bg-[color:color-mix(in_srgb,var(--ink)_2%,transparent)] px-4 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--ink)] backdrop-blur-md">
          Error 0404
        </motion.div>

        <motion.h1 
          variants={itemVariants}
          className="font-sans text-[clamp(56px,8vw,120px)] font-bold leading-[0.9] tracking-tighter drop-shadow-sm"
        >
          You’ve lost<br />
          <span className="text-[color:color-mix(in_srgb,var(--ink)_40%,transparent)]">the room.</span>
        </motion.h1>

        <motion.p 
          variants={itemVariants}
          className="mt-8 max-w-[420px] text-balance font-sans text-[18px] font-medium leading-relaxed text-[color:color-mix(in_srgb,var(--ink)_60%,transparent)]"
        >
          This link is a dead end, or the page has been moved. Let’s get you back on stage.
        </motion.p>

        {/* 6. Guaranteed High-Contrast Pill Button */}
        <motion.div variants={itemVariants} className="mt-14">
          <Magnetic strength={15}>
            <Link 
              href="/"
              className="group flex h-14 items-center justify-center gap-3 rounded-full bg-[var(--ink)] px-8 font-sans text-[14px] font-semibold text-[var(--bg)] shadow-[0_10px_30px_color-mix(in_srgb,var(--ink)_20%,transparent)] transition-all hover:scale-[1.03] active:scale-[0.97]"
            >
              <ArrowLeft size={16} strokeWidth={2.5} className="opacity-80 transition-transform duration-300 group-hover:-translate-x-1 group-hover:opacity-100" />
              Return to start
            </Link>
          </Magnetic>
        </motion.div>
      </motion.div>

    </main>
  );
}