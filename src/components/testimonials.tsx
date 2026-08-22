"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { APP_CONTENT } from "@/constants";
import { Reveal } from "./reveal";

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative overflow-hidden bg-[var(--bg)] px-[clamp(24px,5vw,80px)] py-24 text-[var(--ink)] md:py-36">
      
      {/* Ambient noise texture for an editorial print feel */}
      <div className="pointer-events-none absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.06] mix-blend-overlay" />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        <Reveal>
          <div className="mb-16 flex flex-col gap-6 md:mb-24 md:flex-row md:items-end md:justify-between">
            <div>
              {/* Editorial Eyebrow */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] px-4 py-1.5 font-sans text-[13px] font-medium tracking-tight text-[var(--ink)] backdrop-blur-md">
                {APP_CONTENT.testimonials.eyebrow}
              </div>
              
              <h2 className="mt-5 max-w-4xl font-sans text-[clamp(42px,6vw,96px)] font-semibold leading-[0.9] tracking-tighter text-[var(--ink)]">
                {APP_CONTENT.testimonials.headlineLead}<br />
                <span className="text-[color:color-mix(in_srgb,var(--ink)_40%,transparent)]">
                  {APP_CONTENT.testimonials.headlineAccent}
                </span>
              </h2>
            </div>
            
            <p className="max-w-xs text-balance font-sans text-[16px] leading-relaxed text-[color:color-mix(in_srgb,var(--ink)_60%,transparent)] lg:mb-3">
              A few reflections from people who chose to make their thinking easier to hear.
            </p>
          </div>
        </Reveal>

        {/* Interactive Roster Layout */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
          
          {/* Left Side: The Cinematic Quote Display */}
          <div className="relative flex min-h-[300px] flex-col justify-center lg:col-span-7">
            {/* Massive Hollow Background Quote Mark */}
            <div className="pointer-events-none absolute -left-8 -top-12 select-none font-serif text-[clamp(140px,18vw,240px)] font-bold leading-none tracking-tighter text-[color:color-mix(in_srgb,var(--ink)_4%,transparent)]">
              “
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(12px)" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10"
              >
                <blockquote className="font-sans text-[clamp(28px,4vw,48px)] font-semibold leading-[1.15] tracking-tight text-[var(--ink)]">
                  {APP_CONTENT.testimonials.items[activeIndex].quote}
                </blockquote>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Side: The Interactive Client Roster */}
          <div className="lg:col-span-5">
            <div className="flex flex-col overflow-hidden rounded-[2rem] border border-[color:color-mix(in_srgb,var(--ink)_10%,transparent)] bg-[color:color-mix(in_srgb,var(--ink)_2%,transparent)]">
              
              {APP_CONTENT.testimonials.items.map((testimonial, index) => {
                const isActive = activeIndex === index;
                const isLast = index === APP_CONTENT.testimonials.items.length - 1;
                
                return (
                  <button
                    key={index}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => setActiveIndex(index)}
                    className={`group relative flex w-full items-center justify-between px-6 py-8 text-left transition-colors duration-300 sm:px-8 sm:py-10 ${
                      !isLast ? 'border-b border-[color:color-mix(in_srgb,var(--ink)_10%,transparent)]' : ''
                    } ${isActive ? 'text-[var(--bg)]' : 'text-[var(--ink)]'}`}
                  >
                    {/* Active State Shared Background (Framer Motion Magic) */}
                    {isActive && (
                      <motion.div
                        layoutId="active-testimonial-bg"
                        className="absolute inset-0 bg-[var(--ink)]"
                        initial={false}
                        transition={{ type: "spring", stiffness: 400, damping: 35 }}
                      />
                    )}
                    
                    {/* Inactive Hover Highlight */}
                    {!isActive && (
                      <div className="absolute inset-0 bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    )}
                    
                    {/* Roster Content */}
                    <div className="relative z-10 flex flex-col gap-1.5">
                      <span className="font-sans text-[20px] font-bold tracking-tight">
                        {testimonial.name}
                      </span>
                      <span 
                        className={`font-sans text-[14px] font-medium transition-colors duration-300 ${
                          isActive 
                            ? 'text-[color:color-mix(in_srgb,var(--bg)_70%,transparent)]' 
                            : 'text-[color:color-mix(in_srgb,var(--ink)_50%,transparent)]'
                        }`}
                      >
                        {testimonial.context}
                      </span>
                    </div>

                    {/* Arrow Indicator */}
                    <div className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full bg-[color:color-mix(in_srgb,currentColor_10%,transparent)]">
                      <ArrowRight 
                        strokeWidth={2.5}
                        className={`size-5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          isActive 
                            ? 'translate-x-0 opacity-100' 
                            : '-translate-x-2 opacity-40 group-hover:-translate-x-0 group-hover:opacity-100'
                        }`} 
                      />
                    </div>
                  </button>
                )
              })}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}