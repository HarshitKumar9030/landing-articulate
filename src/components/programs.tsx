"use client";

import { useState, useEffect } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "./reveal"; 
import { APP_CONTENT } from "@/constants"; 

// ----------------------------------------------------------------------
// Apple Music-Style Hyper-Vivid Shader Background
// ----------------------------------------------------------------------
function FluidShaderBackground({ variant }: { variant: number }) {
  const palettes = [
    ["#b30000", "#ffaa00", "#ffea00", "#ff3300"],
    ["#003377", "#00eeaa", "#00ffcc", "#0088ff"],
    ["#cc1144", "#ff88aa", "#ffeeee", "#ff0055"],
  ];
  const colors = palettes[variant % palettes.length];
  const motionProfiles = [
    { first: 12, second: 16, third: 20 },
    { first: 15, second: 11, third: 18 },
    { first: 10, second: 18, third: 14 },
  ];
  const profile = motionProfiles[variant % motionProfiles.length];

  return (
    <div 
      className="absolute inset-0 -z-10 overflow-hidden" 
      style={{ backgroundColor: colors[0] }}
    >
      <motion.div
        animate={{ x: ["-20%", "30%", "-10%", "-20%"], y: ["-20%", "10%", "30%", "-20%"], scale: [1, 1.4, 1.1, 1] }}
        transition={{ duration: profile.first, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-[20%] -top-[20%] h-[150%] w-[150%] rounded-full opacity-100 blur-[80px]"
        style={{ backgroundColor: colors[1] }}
      />
      <motion.div
        animate={{ x: ["30%", "-10%", "20%", "30%"], y: ["20%", "-30%", "10%", "20%"], scale: [1.2, 0.9, 1.3, 1.2] }}
        transition={{ duration: profile.second, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-[30%] -top-[10%] h-[150%] w-[150%] rounded-full opacity-100 blur-[90px]"
        style={{ backgroundColor: colors[2] }}
      />
      <motion.div
        animate={{ x: ["0%", "25%", "-20%", "0%"], y: ["20%", "-10%", "-30%", "20%"], scale: [1, 1.3, 1, 1] }}
        transition={{ duration: profile.third, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-[40%] -right-[10%] h-[150%] w-[150%] rounded-full opacity-100 blur-[70px]"
        style={{ backgroundColor: colors[3] }}
      />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.12] mix-blend-overlay" />
    </div>
  );
}

const cardRevealProfiles = [
  { x: -34, y: 58, rotate: -2.5, delay: 0.08, duration: 0.85 },
  { x: 18, y: 82, rotate: 1.5, delay: 0.28, duration: 1.05 },
  { x: 42, y: 42, rotate: -1, delay: 0.16, duration: 0.72 },
];

// ----------------------------------------------------------------------
// Main Programs Section
// ----------------------------------------------------------------------
export function Programs({ onContactOpen }: { onContactOpen: () => void }) {
  // Track which card is currently expanded
  const [activeCard, setActiveCard] = useState<number | null>(null);

  // Lock body scroll when a card is expanded
  useEffect(() => {
    if (activeCard !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [activeCard]);

  return (
    <section 
      id="programs" 
      className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-[var(--bg)] px-[clamp(24px,5vw,80px)] py-24 md:py-32"
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <Reveal>
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] px-4 py-1.5 font-sans text-[13px] font-medium tracking-tight text-[var(--ink)]">
            {APP_CONTENT.programs.eyebrow}
          </div>
          
          <h2 className="m-0 font-sans text-[clamp(48px,8vw,110px)] font-semibold leading-[0.9] tracking-tighter text-[var(--ink)]">
            {APP_CONTENT.programs.headlineLead}<br />
            <span className="relative inline-block text-[color:color-mix(in_srgb,var(--ink)_40%,transparent)]">
              {APP_CONTENT.programs.headlineAccent}
            </span>
          </h2>
        </Reveal>

        {/* Programs Grid */}
        <div className="mt-16 grid gap-6 md:mt-24 md:grid-cols-3">
          {APP_CONTENT.programs.items.map(({ number, title, description }, index) => (
            <motion.div
              key={`card-container-${index}`}
              initial={{ opacity: 0, x: cardRevealProfiles[index].x, y: cardRevealProfiles[index].y, rotate: cardRevealProfiles[index].rotate }}
              whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: cardRevealProfiles[index].duration, delay: cardRevealProfiles[index].delay, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                layoutId={`card-${index}`}
                onClick={() => setActiveCard(index)}
                whileHover="hover"
                whileTap="tap"
                variants={{ hover: { scale: 1.02 }, tap: { scale: 0.98 } }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="group relative flex aspect-[3/4] w-full cursor-pointer flex-col overflow-hidden rounded-[2rem] bg-transparent sm:aspect-square md:aspect-[3/4]"
              >
                <FluidShaderBackground variant={index} />

                <div className="relative z-10 flex h-full flex-col justify-between p-8 md:p-10">
                  <div className="flex w-full items-start justify-between">
                    <motion.span layoutId={`number-${index}`} className="font-mono text-[11px] font-bold tracking-[0.1em] text-white">
                      {number}
                    </motion.span>
                      <motion.div layoutId={`brand-${index}`} className="flex items-center gap-1 font-sans text-[12px] font-bold text-white">
                        <span className="opacity-80">{APP_CONTENT.brand.wordmark}</span>{APP_CONTENT.brand.mark}
                    </motion.div>
                  </div>

                  <motion.div layoutId={`title-container-${index}`} className="flex flex-1 items-center justify-center">
                    <motion.h3 layoutId={`title-${index}`} className="m-0 text-center font-sans text-[clamp(48px,5vw,72px)] font-bold leading-[0.9] tracking-tighter text-white">
                      {title}
                    </motion.h3>
                  </motion.div>

                  <div className="flex items-end justify-between gap-4">
                    <motion.p layoutId={`desc-${index}`} className="m-0 max-w-[200px] font-sans text-[13px] font-medium leading-relaxed text-white">
                      {description}
                    </motion.p>
                    
                    <motion.div 
                      layoutId={`icon-${index}`}
                      variants={{
                        rest: { backgroundColor: "rgba(255, 255, 255, 0.15)", color: "#ffffff", scale: 1 },
                        hover: { backgroundColor: "#ffffff", color: "#000000", scale: 1.1 },
                        tap: { scale: 0.9 }
                      }}
                      initial="rest"
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full backdrop-blur-md"
                    >
                      <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2.5} />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Global CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 flex justify-center md:mt-24"
        >
            <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group flex h-14 items-center justify-center gap-3 rounded-full bg-[var(--ink)] px-8 font-sans text-[14px] font-medium text-[var(--bg)] no-underline"
            href="#contact"
            onClick={(event) => { event.preventDefault(); onContactOpen(); }}
          >
            {APP_CONTENT.programs.cta}
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={2} />
          </motion.a>
        </motion.div>
      </div>

      {/* 
        Expanded Full-Screen Story View 
        Uses the exact same layoutIds to create the morphing effect.
      */}
      <AnimatePresence>
        {activeCard !== null && (
          <motion.div 
            className="fixed inset-0 z-[100] flex flex-col items-center overflow-y-auto overflow-x-hidden bg-[var(--bg)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            // Fix for Lenis smooth scrolling inside modal
            data-lenis-prevent="true"
          >
            <motion.div
              layoutId={`card-${activeCard}`}
              className="relative flex min-h-screen w-full flex-col overflow-hidden rounded-none"
            >
              {/* Background continues playing seamlessly */}
              <FluidShaderBackground variant={activeCard} />

              <div className="relative z-10 mx-auto flex h-full w-full max-w-4xl flex-col px-[clamp(24px,5vw,80px)] py-12 md:py-20">
                
                {/* Header Row */}
                <div className="flex w-full items-start justify-between">
                  <motion.span layoutId={`number-${activeCard}`} className="font-mono text-[13px] font-bold tracking-[0.1em] text-white/80">
                    {APP_CONTENT.programs.items[activeCard].number}
                  </motion.span>
                  
                  <div className="flex items-center gap-6">
                      <motion.div layoutId={`brand-${activeCard}`} className="hidden font-sans text-[13px] font-bold text-white/80 md:block">
                        <span className="opacity-80">{APP_CONTENT.brand.wordmark}</span>{APP_CONTENT.brand.mark}
                    </motion.div>
                    
                    {/* Close Button */}
                    <button 
                      onClick={() => setActiveCard(null)}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 active:scale-95"
                    >
                      <X size={20} strokeWidth={2} />
                    </button>
                  </div>
                </div>

                {/* Expanded Story Content */}
                <div className="mt-20 flex flex-1 flex-col justify-center">
                  
                  {/* Title moves from center of small card to top-left editorial position */}
                  <motion.div layoutId={`title-container-${activeCard}`} className="flex justify-start">
                    <motion.h3 layoutId={`title-${activeCard}`} className="m-0 font-sans text-[clamp(56px,8vw,120px)] font-bold leading-[0.9] tracking-tighter text-white">
                      {APP_CONTENT.programs.items[activeCard].title}
                    </motion.h3>
                  </motion.div>

                  {/* Fading in the story */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-12 max-w-2xl"
                  >
                    <motion.p layoutId={`desc-${activeCard}`} className="m-0 font-sans text-[clamp(20px,3vw,32px)] font-medium leading-[1.3] tracking-tight text-white/90">
                      {APP_CONTENT.programs.items[activeCard].description}
                    </motion.p>
                    
                    <p className="mt-8 font-sans text-[16px] leading-relaxed text-white/70 md:text-[18px]">
                      {APP_CONTENT.programs.items[activeCard].story}
                    </p>

                    <button 
                      onClick={() => { setActiveCard(null); setTimeout(onContactOpen, 500); }}
                      className="group mt-12 inline-flex items-center gap-3 font-mono text-[12px] font-medium uppercase tracking-[0.15em] text-white transition-opacity hover:opacity-70"
                    >
                      {APP_CONTENT.programs.detailCta}
                      <ArrowUpRight size={16} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}