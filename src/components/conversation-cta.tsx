"use client";

import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./reveal";

export function ConversationCta({ onContactOpen }: { onContactOpen: () => void }) {
  return (
    <section className="px-[clamp(24px,5vw,80px)] pb-24 pt-10 md:pb-32">
      <div className="relative w-full overflow-hidden rounded-[2.5rem] bg-(--deep-bg) px-8 py-16 text-(--deep-ink) sm:px-12 sm:py-20 md:p-24">
        
        {/* 
          Organic Depth Elements 
          Replaced the hard-bordered circles with soft color-mix layers and a radial blur 
        */}
        <div className="pointer-events-none absolute right-[-10%] top-[-20%] z-0 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--deep-ink)_4%,transparent)_0%,transparent_60%)] blur-3xl" />
        <div className="pointer-events-none absolute right-[-5%] top-[-10%] z-0 h-[300px] w-[300px] rounded-full bg-[color-mix(in_srgb,var(--deep-ink)_3%,transparent)]" />
        <div className="pointer-events-none absolute right-[5%] top-[10%] z-0 h-[120px] w-[120px] rounded-full bg-[color-mix(in_srgb,var(--deep-ink)_2%,transparent)]" />

        <div className="relative z-10 max-w-4xl">
          <Reveal>
            {/* Eyebrow - Remorphed to Pill Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-[color-mix(in_srgb,var(--deep-ink)_8%,transparent)] px-4 py-1.5 font-sans text-[13px] font-medium tracking-tight text-(--deep-ink) ring-1 ring-[color-mix(in_srgb,var(--deep-ink)_10%,transparent)]">
              A good place to start
            </div>
            
            <h2 className="m-0 font-sans text-[clamp(48px,7vw,100px)] font-semibold leading-[0.9] tracking-tighter text-(--deep-ink)">
              Bring us the room, the message, or the{" "}
              <span className="text-[color-mix(in_srgb,var(--deep-ink)_40%,transparent)]">
                deadline.
              </span>
            </h2>
          </Reveal>

          {/* 
            CTA Button 
            Replaced color-shift hover with fluid scale and smooth arrow slide 
          */}
          <Reveal>
            <button 
              onClick={onContactOpen} 
              className="group mt-12 flex h-14 items-center justify-center gap-2 rounded-full bg-(--deep-ink) px-8 font-sans text-[14px] font-medium text-(--deep-bg) transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              Start a conversation 
              <ArrowUpRight 
                size={18} 
                strokeWidth={2}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" 
              />
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}