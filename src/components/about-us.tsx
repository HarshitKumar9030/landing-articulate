"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  },
};

export function AboutUs() {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Tie animations directly to the scroll progress of this specific section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "end 20%"],
  });

  // The horizontal line will draw itself from 0% to 100% as the user scrolls
  const lineWidth = useTransform(scrollYProgress, [0.2, 0.6], ["0%", "100%"]);
  // Subtle parallax on the right column
  const rightColY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section 
      id="about-us" 
      ref={sectionRef}
      className="relative overflow-hidden bg-[var(--bg)] px-[clamp(20px,5vw,80px)] py-24 md:py-40"
    >
      <div className="mx-auto grid max-w-[1400px] items-start gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
        
        {/* Left Column - Sticky Editorial Anchor */}
        <div className="top-32 flex flex-col items-start lg:sticky">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            // Added a subtle interactive hover state to the pill
            className="mb-8 inline-flex cursor-default items-center rounded-full bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] px-4 py-1.5 font-sans text-[13px] font-medium tracking-tight text-[var(--ink)] transition-all duration-300 hover:bg-[color:color-mix(in_srgb,var(--ink)_8%,transparent)]"
          >
            About ArticulateX
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[280px] text-balance font-sans text-[16px] leading-relaxed text-[var(--muted)]"
          >
            A speaking studio for people whose ideas deserve precision, presence, and a room that listens.
          </motion.p>
        </div>

        {/* Right Column - Scrolling Content */}
        <motion.div 
          style={{ y: rightColY }}
          className="flex flex-col"
        >
          {/* Staggered Headline Reveal */}
          <motion.h2 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-4xl text-balance font-sans text-[clamp(36px,6vw,72px)] font-medium leading-[0.95] tracking-tighter text-[var(--ink)]"
          >
            <motion.span variants={itemVariants} className="block">
              We turn considered thinking
            </motion.span>
            <motion.span variants={itemVariants} className="block">
              into communication people
            </motion.span>
            <motion.span variants={itemVariants} className="block text-[color:color-mix(in_srgb,var(--ink)_35%,transparent)]">
              can carry with them.
            </motion.span>
          </motion.h2>

          <div className="relative mt-16 pt-12 sm:mt-24 sm:pt-16">
            
            {/* Scroll-Linked Soft Divider */}
            <motion.div 
              style={{ width: lineWidth }}
              className="absolute left-0 top-0 h-px bg-[color:color-mix(in_srgb,var(--ink)_8%,transparent)]" 
            />
            
            {/* The group/grid wrapper allows us to fade out non-hovered items */}
            <div className="group/grid grid gap-10 sm:grid-cols-3 sm:gap-8">
              {[
                ["Listen", "The real message starts beneath the first draft."], 
                ["Shape", "We make structure serve attention and trust."], 
                ["Rehearse", "So the final delivery still sounds like you."]
              ].map(([title, copy], index) => (
                <motion.div 
                  key={title} 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true, margin: "-50px" }} 
                  transition={{ delay: 0.2 + (index * 0.15), duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  // Focus-pull hover mechanics
                  className="group/item relative flex flex-col pl-4 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:translate-x-2 sm:pl-5 sm:hover:!opacity-100 sm:group-hover/grid:opacity-40"
                >
                  {/* Animated Vertical Stroke - Draws down on hover */}
                  <div className="absolute left-0 top-1.5 h-0 w-[1.5px] bg-[var(--ink)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/item:h-[calc(100%-12px)]" />

                  <div className="flex items-center gap-2">
                    <h3 className="font-sans text-[18px] font-medium tracking-tight text-[var(--ink)] transition-colors duration-500">
                      {title}
                    </h3>
                    {/* Hidden Arrow - Glides in on hover */}
                    <ArrowRight 
                      size={16} 
                      strokeWidth={2}
                      className="text-[var(--ink)] opacity-0 -translate-x-3 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/item:translate-x-0 group-hover/item:opacity-100" 
                    />
                  </div>
                  
                  <p className="mt-3 max-w-[220px] text-balance font-sans text-[15px] leading-relaxed text-[var(--muted)] transition-colors duration-500 group-hover/item:text-[var(--ink)]">
                    {copy}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
        
      </div>
    </section>
  );
}
