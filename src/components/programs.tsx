"use client";

import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./reveal";
import { APP_CONTENT } from "@/constants";

export function Programs({ onContactOpen }: { onContactOpen: () => void }) {
  return (
    <section 
      id="programs" 
      className="relative flex w-full flex-col items-center justify-center overflow-hidden px-[clamp(24px,5vw,80px)] py-24 md:py-32"
    >
      {/* 
        Fluid Parallax Orb 
        Replaced the hardcoded opacity/blur with a soft radial color-mix gradient 
      */}
      <div className="orb-two pointer-events-none absolute bottom-[10%] left-[-10%] -z-10 h-[50vw] w-[50vw] max-w-[600px] rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--ink)_6%,transparent)_0%,transparent_60%)] blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <Reveal>
          {/* Eyebrow - Remorphed to Pill Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] px-4 py-1.5 font-sans text-[13px] font-medium tracking-tight text-[var(--ink)] ring-1 ring-[color:color-mix(in_srgb,var(--ink)_6%,transparent)]">
            {APP_CONTENT.programs.eyebrow}
          </div>
          
          <h2 className="m-0 font-sans text-[clamp(48px,8vw,110px)] font-semibold leading-[0.9] tracking-tighter text-[var(--ink)]">
            {APP_CONTENT.programs.headlineLead}<br />
            <span className="relative inline-block text-[color:color-mix(in_srgb,var(--ink)_40%,transparent)]">
              {APP_CONTENT.programs.headlineAccent}
            </span>
          </h2>
        </Reveal>

        {/* 
          List Container 
          Removed all hard borders. Using fluid gaps and rounded containers instead. 
        */}
        <div className="mt-16 flex flex-col gap-3 md:mt-24 md:gap-4">
          {APP_CONTENT.programs.items.map(({ number, title, description }) => (
            <a
              key={number}
              href="#contact"
              onClick={(event) => { event.preventDefault(); onContactOpen(); }}
              className="program-row group relative flex w-full cursor-pointer items-center justify-between gap-6 rounded-[2rem] bg-[color:color-mix(in_srgb,var(--ink)_2%,transparent)] p-6 no-underline transition-all duration-500 hover:bg-[color:color-mix(in_srgb,var(--ink)_5%,transparent)] md:p-8 md:pr-10"
            >
              <div className="flex items-center gap-6 md:gap-12">
                <span className="font-mono text-[11px] font-medium tracking-[0.1em] text-[color:color-mix(in_srgb,var(--ink)_40%,transparent)]">
                  {number}
                </span>
                <h3 className="m-0 font-sans text-[clamp(24px,3.5vw,48px)] font-medium tracking-tight text-[var(--ink)]">
                  {title}
                </h3>
              </div>
              
              <div className="flex items-center gap-10">
                <p className="hidden font-sans text-[15px] text-[var(--muted)] md:block">
                  {description}
                </p>
                {/* Smooth circular icon wrapper on hover */}
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--ink)_0%,transparent)] transition-colors duration-500 group-hover:bg-[color:color-mix(in_srgb,var(--ink)_8%,transparent)]">
                  <ArrowUpRight 
                    className="h-5 w-5 text-[var(--ink)] transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" 
                    strokeWidth={1.5} 
                  />
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* 
          CTA Button 
          Removed the harsh linear-gradient, shimmer, and drop-shadow. 
          Replaced with our signature deep contrast pill button. 
        */}
        <div className="mt-12 flex md:mt-16">
          <a
            className="group flex h-14 items-center justify-center gap-2 rounded-full bg-[var(--ink)] px-8 font-sans text-[14px] font-medium text-[var(--bg)] no-underline transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            href="#contact"
            onClick={(event) => { event.preventDefault(); onContactOpen(); }}
          >
            {APP_CONTENT.programs.cta}
            <ArrowUpRight 
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" 
              strokeWidth={2} 
            />
          </a>
        </div>
      </div>
    </section>
  );
}
