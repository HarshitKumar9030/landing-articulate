"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { APP_CONTENT } from "@/constants";
import { Reveal } from "./reveal";
import { cn } from "@/lib/utils";

export function FocusAreas({ onContactOpen }: { onContactOpen: () => void }) {
  return (
    <section className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-[var(--bg)] px-[clamp(20px,5vw,80px)] py-24 md:py-40">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col">
        
        {/* --- HEADER SECTION --- */}
        <Reveal>
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-[color:color-mix(in_srgb,var(--ink)_5%,transparent)] px-4 py-1.5 font-sans text-[12px] font-medium tracking-tight text-[var(--ink)] ring-1 ring-[color:color-mix(in_srgb,var(--ink)_10%,transparent)]">
            {APP_CONTENT.focusAreas.eyebrow}
          </div>
          
          <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end md:gap-16">
            <h2 className="max-w-4xl font-sans text-[clamp(40px,6vw,90px)] font-medium leading-[0.95] tracking-tighter text-[var(--ink)]">
              {APP_CONTENT.focusAreas.headlineLead}{" "}
              <span className="text-[color:color-mix(in_srgb,var(--ink)_30%,transparent)]">
                {APP_CONTENT.focusAreas.headlineAccent}
              </span>
            </h2>
            <div className="flex flex-col items-start gap-6 md:pb-2">
              <p className="max-w-[300px] text-balance font-sans text-[15px] leading-relaxed text-[var(--muted)]">
                {APP_CONTENT.focusAreas.supportingText}
              </p>
              
              <button 
                onClick={onContactOpen} 
                className="group flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--ink)] px-6 font-sans text-[13px] font-medium text-[var(--bg)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                {APP_CONTENT.focusAreas.cta}
                <ArrowUpRight 
                  className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" 
                  strokeWidth={2} 
                />
              </button>
            </div>
          </div>
        </Reveal>

        {/* --- FLUID ACCORDION STAGE --- */}
        <div className="group/stage mt-16 flex h-[800px] w-full flex-col gap-4 md:mt-24 md:h-[600px] md:flex-row">
          {APP_CONTENT.focusAreas.items.map(({ number, title, copy }, index) => (
            <motion.article 
              key={number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                // Base layout
                "group/panel relative flex flex-1 cursor-pointer flex-col justify-between overflow-hidden rounded-[2rem] bg-[color:color-mix(in_srgb,var(--ink)_3%,transparent)] p-6 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:p-8",
                // Hover Expansion Mechanics
                "hover:bg-[color:color-mix(in_srgb,var(--ink)_6%,transparent)] md:hover:flex-[3]"
              )}
            >
              {/* Top: Number & Icon */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-[12px] font-medium tracking-[0.15em] text-[color:color-mix(in_srgb,var(--ink)_40%,transparent)]">
                  {number}
                </span>
                
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--ink)_5%,transparent)] text-[var(--ink)] opacity-0 transition-all duration-500 group-hover/panel:opacity-100">
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover/panel:-translate-y-0.5 group-hover/panel:translate-x-0.5" strokeWidth={2} />
                </div>
              </div>

              {/* Bottom: Title & Hidden Copy */}
              <div className="relative flex flex-col justify-end">
                {/* Title */}
                <h3 className="font-sans text-[clamp(28px,3vw,40px)] font-medium leading-[1.1] tracking-tight text-[var(--ink)] md:whitespace-nowrap">
                  {title}
                </h3>
                
                {/* 
                  Copy: Hidden by default, reveals on hover. 
                  On mobile (flex-col), we just show it since expansion mechanics are tricky with touch.
                */}
                <div className="grid grid-rows-[1fr] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:grid-rows-[0fr] md:opacity-0 md:group-hover/panel:grid-rows-[1fr] md:group-hover/panel:opacity-100 md:group-hover/panel:pt-4">
                  <div className="overflow-hidden">
                    <p className="max-w-[400px] font-sans text-[15px] leading-relaxed text-[var(--muted)] md:transform md:transition-transform md:duration-700 md:group-hover/panel:translate-y-0">
                      {copy}
                    </p>
                  </div>
                </div>
              </div>

            </motion.article>
          ))}
        </div>
        
      </div>
    </section>
  );
}