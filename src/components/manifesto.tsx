"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, cubicBezier } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./reveal";
import { APP_CONTENT } from "@/constants";

export function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);

  // Hook into scroll for high-end parallax and continuous physics
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Calculate smooth parallax movements based purely on scroll progress
  const gridY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const orbY = useTransform(scrollYProgress, [0, 1], ["-10%", "20%"]);
  
  // Doodle transforms dynamically as you scroll (no hover needed)
  const doodleY = useTransform(scrollYProgress, [0, 1], ["-20%", "60%"]);
  const doodleRotate = useTransform(scrollYProgress, [0, 1], [-20, 120]);

  // Image internal parallax (moves in the opposite direction of the scroll)
  const imageY = useTransform(scrollYProgress, [0, 1], ["-15%", "10%"]);

  // Bespoke cinematic stagger for the headline
  const headlineVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 40, filter: "blur(12px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const },
    },
  } as const;

  return (
    <section
      ref={sectionRef}
      id="about"
      className="manifesto relative flex min-h-[90svh] w-full flex-col justify-center overflow-hidden px-[clamp(24px,5vw,80px)] py-24 md:py-32"
    >
      {/* Scroll-driven Parallax Grid Background (Clean, no shadows) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <motion.div
          style={{ y: gridY }}
          className="absolute inset-0 h-[150%] w-full bg-[linear-gradient(to_right,color-mix(in_srgb,var(--ink)_6%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_srgb,var(--ink)_6%,transparent)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_30%,#000_10%,transparent_100%)]"
        />
      </div>

      {/* Orb matches the GSAP target '.orb-one' - Tied to scroll instead of static */}
      <motion.div
        style={{ y: orbY }}
        className="orb-one pointer-events-none absolute right-[-10%] top-[10%] -z-10 h-[50vw] w-[50vw] max-w-[600px] rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--ink)_5%,transparent)_0%,transparent_60%)] blur-3xl"
      />

      {/* Floating Doodle (Driven entirely by scroll progress, zero hover reliance) */}
      <motion.div
        style={{ y: doodleY, rotate: doodleRotate }}
        className="absolute left-[8%] top-[15%] hidden text-[color-mix(in_srgb,var(--ink)_10%,transparent)] lg:block z-20"
      >
        <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 10 Q 50 50 90 50 Q 50 50 50 90 Q 50 50 10 50 Q 50 50 50 10 Z" fill="currentColor" />
        </svg>
      </motion.div>

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        
        {/* Eyebrow */}
        <Reveal>
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-[color-mix(in_srgb,var(--ink)_4%,transparent)] px-4 py-1.5 font-sans text-[13px] font-medium tracking-tight text-[var(--ink)] backdrop-blur-md">
            
            {APP_CONTENT.manifesto.eyebrow}
          </div>
        </Reveal>

        {/* Scroll-triggered staggered headline reveal */}
        <motion.h2 
          variants={headlineVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="m-0 max-w-[800px] font-sans text-[clamp(48px,8vw,110px)] font-semibold leading-[0.9] tracking-tighter text-[var(--ink)]"
        >
          <motion.span variants={wordVariants} className="inline-block">
            {APP_CONTENT.manifesto.headlineLead}
          </motion.span>{" "}
          <motion.span variants={wordVariants} className="inline-block text-[color-mix(in_srgb,var(--ink)_45%,transparent)]">
            {APP_CONTENT.manifesto.headlineAccent}
          </motion.span>
          <br />
          <motion.span variants={wordVariants} className="inline-block">
            {APP_CONTENT.manifesto.headlineEnd}
          </motion.span>
        </motion.h2>

        <div className="mt-20 grid grid-cols-1 items-end gap-16 md:mt-32 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
          <Reveal>
            <div className="flex h-full flex-col justify-end lg:pb-8">
              <p className="mb-10 max-w-[460px] text-balance font-sans text-[17px] leading-relaxed text-[var(--muted)] md:text-[20px]">
                {APP_CONTENT.manifesto.copy}
              </p>

              <a
                className="group relative inline-flex w-fit items-center gap-2 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--ink)_4%,transparent)] px-8 py-3.5 font-sans text-[14px] font-medium text-[var(--ink)] no-underline backdrop-blur-md transition-all duration-300 hover:bg-[color-mix(in_srgb,var(--ink)_8%,transparent)] hover:pr-6 active:scale-[0.98]"
                href="#programs"
              >
                <span className="relative z-10">{APP_CONTENT.manifesto.approachCta}</span>
                <ArrowUpRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={2} />
              </a>
            </div>
          </Reveal>

          {/* Clean Cinematic Image Container - No borders or shadows */}
          <div className="portrait-image relative w-full overflow-hidden rounded-[2.5rem] bg-[color-mix(in_srgb,var(--ink)_2%,transparent)]">
            
            {/* Dramatic Clip-Path Reveal + Scroll Parallax */}
            <motion.div
              initial={{ 
                clipPath: "inset(20% 15% 20% 15% round 2.5rem)", 
                filter: "blur(10px)",
                scale: 1.1
              }}
              whileInView={{ 
                clipPath: "inset(0% 0% 0% 0% round 2.5rem)", 
                filter: "blur(0px)",
                scale: 1
              }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: "-50px" }}
              className="relative h-[60vh] min-h-[400px] w-full"
            >
              <motion.div 
                className="absolute inset-0 h-[120%] w-full bg-cover bg-center"
                style={{ 
                  backgroundImage: "url('/your-image-path.jpg')",
                  y: imageY 
                }}
              />

            
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}