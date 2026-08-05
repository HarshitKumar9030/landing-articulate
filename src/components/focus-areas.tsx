"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./reveal";
import { APP_CONTENT } from "@/constants";

export function FocusAreas({ onContactOpen }: { onContactOpen: () => void }) {
  return (
    <section
      className="relative flex w-full flex-col items-center justify-center overflow-hidden px-[clamp(24px,5vw,80px)] py-24 md:py-32"
      style={{ backgroundColor: "var(--deep-bg)", color: "var(--deep-ink)" }}
    >
      <div className="mx-auto w-full max-w-7xl">
        <Reveal>
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-[color-mix(in_srgb,var(--deep-ink)_8%,transparent)] px-4 py-1.5 font-sans text-[12px] font-medium tracking-tight text-(--deep-ink) ring-1 ring-[color-mix(in_srgb,var(--deep-ink)_10%,transparent)]">
            {APP_CONTENT.focusAreas.eyebrow}
          </div>
          
          <div className="mt-5 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <h2 className="max-w-3xl font-sans text-[clamp(48px,7vw,96px)] font-semibold leading-[0.9] tracking-tighter text-(--deep-ink)">
              {APP_CONTENT.focusAreas.headlineLead}{" "}
              <span className="text-[color-mix(in_srgb,var(--deep-ink)_40%,transparent)]">{APP_CONTENT.focusAreas.headlineAccent}</span>
            </h2>
            <p className="max-w-[270px] text-balance font-sans text-[15px] leading-relaxed text-[color-mix(in_srgb,var(--deep-ink)_62%,transparent)] md:pb-2">
              {APP_CONTENT.focusAreas.supportingText}
            </p>
          </div>
        </Reveal>

        {/* 
          Cards Grid 
          Removed the 1px gap hack (bg-white/15). 
          Using proper spatial gaps and deeply rounded cards instead.
        */}
        <div className="mt-16 grid gap-4 md:mt-24 md:grid-cols-3">
          {APP_CONTENT.focusAreas.items.map(({ number, title, copy }, index) => (
            <motion.article 
              key={number} 
              className="group relative flex min-h-[300px] cursor-pointer flex-col justify-between rounded-[2rem] bg-[color-mix(in_srgb,var(--deep-ink)_3%,transparent)] p-8 transition-colors duration-500 hover:bg-[color-mix(in_srgb,var(--deep-ink)_6%,transparent)] md:p-10"
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true, amount: 0.2 }} 
              transition={{ delay: index * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <div>
                <p className="font-mono text-[11px] font-medium tracking-[0.1em] text-[color-mix(in_srgb,var(--deep-ink)_40%,transparent)]">
                  {number}
                </p>
                <h3 className="mt-10 font-sans text-2xl font-medium tracking-tight text-(--deep-ink)">
                  {title}
                </h3>
                <p className="mt-4 max-w-[240px] font-sans text-[14px] leading-relaxed text-[color-mix(in_srgb,var(--deep-ink)_55%,transparent)]">
                  {copy}
                </p>
              </div>
              
              {/* Soft circular icon wrapper on hover instead of raw floating icon */}
              <div className="mt-10 flex h-12 w-12 items-center justify-center rounded-full bg-transparent transition-colors duration-500 group-hover:bg-[color-mix(in_srgb,var(--deep-ink)_10%,transparent)]">
                <ArrowUpRight 
                  className="h-5 w-5 text-(--deep-ink) transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" 
                  strokeWidth={1.5} 
                />
              </div>
            </motion.article>
          ))}
        </div>

        {/* 
          CTA Button 
          Removed the transparent bordered style. Upgraded to a solid, high-contrast pill.
        */}
        <div className="mt-12 flex md:mt-16">
          <button 
            onClick={onContactOpen} 
            className="group flex h-14 items-center justify-center gap-2 rounded-full bg-(--deep-ink) px-8 font-sans text-[14px] font-medium text-(--deep-bg) transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            {APP_CONTENT.focusAreas.cta}
            <ArrowUpRight 
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" 
              strokeWidth={2} 
            />
          </button>
        </div>
      </div>
    </section>
  );
}
