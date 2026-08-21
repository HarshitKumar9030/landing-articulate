"use client";

import { useState, useEffect } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "./reveal"; 
import { APP_CONTENT } from "@/constants"; 

// ----------------------------------------------------------------------
// Hardware-Accelerated CSS Keyframes (Offloads infinite loops to GPU)
// ----------------------------------------------------------------------
const ShaderStyles = () => (
  <style dangerouslySetInnerHTML={{__html: `
    @keyframes orb-float-1 {
      0%, 100% { transform: translate3d(-12%, -10%, 0) scale(1); }
      33% { transform: translate3d(18%, 12%, 0) scale(1.05); }
      66% { transform: translate3d(-8%, -6%, 0) scale(0.95); }
    }
    @keyframes orb-float-2 {
      0%, 100% { transform: translate3d(14%, 12%, 0) scale(1); }
      33% { transform: translate3d(-12%, -14%, 0) scale(0.95); }
      66% { transform: translate3d(10%, 16%, 0) scale(1.05); }
    }
    .animate-orb-1 { animation: orb-float-1 infinite ease-in-out; }
    .animate-orb-2 { animation: orb-float-2 infinite ease-in-out; }
  `}} />
);

// ----------------------------------------------------------------------
// Apple Music-Style Hyper-Vivid Shader Background
// ----------------------------------------------------------------------
function FluidShaderBackground({ variant }: { variant: number }) {
  // Perfected palettes matched exactly to image_68e609.jpg
  // Base is the bright center, Orb 1 is the dark top-left, Orb 2 is the vibrant bottom-right
  const palettes = [
    // 01: The Voice - Bright Yellow center, Deep Red/Burnt Orange edges
    ["#FFD100", "#8A0000", "#E65C00"],
    // 02: The Story - Bright Mint center, Deep Navy/Teal edges
    ["#00E08A", "#001845", "#009E8E"],
    // 03: The Room - Soft Pale Pink center, Deep Magenta/Rose edges
    ["#FFD6E0", "#9E0031", "#E8487A"],
  ];
  
  const colors = palettes[variant % palettes.length];
  const motionProfiles = [
    { first: 18, second: 24 },
    { first: 22, second: 16 },
    { first: 16, second: 26 },
  ];
  const profile = motionProfiles[variant % motionProfiles.length];

  return (
    <div 
      className="absolute inset-0 -z-10 overflow-hidden" 
      // Force hardware acceleration layering to prevent layout thrash during expansion
      style={{ backgroundColor: colors[0], transform: "translateZ(0)" }}
    >
      <div
        className="animate-orb-1 absolute -left-[12%] -top-[14%] h-[118%] w-[118%] rounded-full opacity-100 blur-[40px]"
        style={{ backgroundColor: colors[1], animationDuration: `${profile.first}s` }}
      />
      <div
        className="animate-orb-2 absolute -right-[16%] -bottom-[12%] h-[112%] w-[112%] rounded-full opacity-100 blur-[40px]"
        style={{ backgroundColor: colors[2], animationDuration: `${profile.second}s` }}
      />
      {/* Subtle darkening vignette to ensure white text remains legible on bright centers */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,rgba(0,0,0,0.15)_100%)]" />
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
  const [activeCard, setActiveCard] = useState<number | null>(null);

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
      <ShaderStyles />
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
                // Added transform: translateZ(0) to force hardware layer rendering
                style={{ transform: "translateZ(0)" }}
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
                    <motion.h3 
                      layoutId={`title-${index}`} 
                      className="m-0 text-center font-sans text-[clamp(48px,5vw,72px)] font-bold leading-[0.9] tracking-tighter text-white drop-shadow-sm"
                    >
                      {title}
                    </motion.h3>
                  </motion.div>

                  <div className="flex items-end justify-between gap-4">
                    <motion.p 
                      layoutId={`desc-${index}`} 
                      className="m-0 max-w-[200px] font-sans text-[13px] font-medium leading-relaxed text-white drop-shadow-sm"
                    >
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

      <AnimatePresence>
        {activeCard !== null && (
          <motion.div 
            className="fixed inset-0 z-[100] flex flex-col items-center overflow-y-auto overflow-x-hidden bg-[var(--bg)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            data-lenis-prevent="true"
          >
            <motion.div
              layoutId={`card-${activeCard}`}
              className="relative flex min-h-screen w-full flex-col overflow-hidden rounded-none"
              style={{ transform: "translateZ(0)" }} // Hardware acceleration during modal morph
            >
              <FluidShaderBackground variant={activeCard} />

              <div className="relative z-10 mx-auto flex h-full w-full max-w-4xl flex-col px-[clamp(24px,5vw,80px)] py-12 md:py-20">
                
                <div className="flex w-full items-start justify-between">
                  <motion.span layoutId={`number-${activeCard}`} className="font-mono text-[13px] font-bold tracking-[0.1em] text-white/80">
                    {APP_CONTENT.programs.items[activeCard].number}
                  </motion.span>
                  
                  <div className="flex items-center gap-6">
                      <motion.div layoutId={`brand-${activeCard}`} className="hidden font-sans text-[13px] font-bold text-white/80 md:block">
                        <span className="opacity-80">{APP_CONTENT.brand.wordmark}</span>{APP_CONTENT.brand.mark}
                    </motion.div>
                    
                    <button 
                      onClick={() => setActiveCard(null)}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 active:scale-95"
                    >
                      <X size={20} strokeWidth={2} />
                    </button>
                  </div>
                </div>

                <div className="mt-20 flex flex-1 flex-col justify-center">
                  
                  <motion.div layoutId={`title-container-${activeCard}`} className="flex justify-start">
                    <motion.h3 
                      layoutId={`title-${activeCard}`} 
                      className="m-0 font-sans text-[clamp(56px,8vw,120px)] font-bold leading-[0.9] tracking-tighter text-white drop-shadow-sm"
                    >
                      {APP_CONTENT.programs.items[activeCard].title}
                    </motion.h3>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-12 max-w-2xl"
                  >
                    <motion.p 
                      layoutId={`desc-${activeCard}`} 
                      className="m-0 font-sans text-[clamp(20px,3vw,32px)] font-medium leading-[1.3] tracking-tight text-white/90 drop-shadow-sm"
                    >
                      {APP_CONTENT.programs.items[activeCard].description}
                    </motion.p>
                    
                    <p className="mt-8 font-sans text-[16px] leading-relaxed text-white/80 md:text-[18px]">
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