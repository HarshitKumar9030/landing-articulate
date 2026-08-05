"use client";

import { ArrowUpRight } from "lucide-react";

export function SiteFooter({ onContactOpen }: { onContactOpen: () => void }) {
  return (
    <footer 
      id="contact" 
      // Soft background tint instead of a hard top border
      className="relative w-full overflow-hidden bg-[color:color-mix(in_srgb,var(--ink)_2%,transparent)] px-[clamp(24px,5vw,80px)] pb-10 pt-20 md:pt-24"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-16">
        
        {/* Top Row: Brand & Links */}
        <div className="flex flex-col justify-between gap-12 md:flex-row md:items-end">
          
          {/* Brand Column */}
          <div className="flex max-w-[300px] flex-col items-start">
            <a 
              className="font-sans text-2xl font-bold tracking-tighter text-[var(--ink)] no-underline" 
              href="#top"
            >
              ARTICULATE<span className="text-[color:color-mix(in_srgb,var(--ink)_35%,transparent)]">X</span>
            </a>
            <p className="mt-4 text-balance font-sans text-[15px] leading-relaxed text-[var(--muted)]">
              Ideas deserve a voice with gravitational pull.
            </p>
            
            {/* 
              Remorphed CTA Button: 
              Removed the hard border and replaced it with our solid, fluid primary pill 
            */}
            <button 
              onClick={onContactOpen} 
              className="group mt-8 flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-[var(--ink)] px-6 font-sans text-[13px] font-medium text-[var(--bg)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              Start a conversation 
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={2} />
            </button>
          </div>

          {/* Links Column */}
          <div className="flex flex-col items-start gap-5 md:items-end">
            {/* Email remorphed into an interactive Pill Badge */}
            <a 
              className="group inline-flex items-center gap-2 rounded-full bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] px-5 py-2.5 font-sans text-[13px] font-medium text-[var(--ink)] no-underline transition-colors hover:bg-[color:color-mix(in_srgb,var(--ink)_8%,transparent)] active:scale-[0.98]" 
              href="mailto:hello@articulatex.in"
            >
              hello@articulatex.in
              <ArrowUpRight className="h-3.5 w-3.5 opacity-70 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
            </a>
            
            {/* Social Links */}
            <div className="flex items-center gap-6 px-1 md:justify-end">
              <a 
                className="font-sans text-[13px] font-medium text-[var(--muted)] no-underline transition-colors hover:text-[var(--ink)]" 
                href="#top"
              >
                Instagram
              </a>
              <a 
                className="font-sans text-[13px] font-medium text-[var(--muted)] no-underline transition-colors hover:text-[var(--ink)]" 
                href="#top"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Row: Copyright */}
        <div className="flex flex-col items-start justify-between gap-4 font-sans text-[12px] text-[color:color-mix(in_srgb,var(--ink)_40%,transparent)] md:flex-row md:items-center">
          <p className="m-0">© 2026 ArticulateX</p>
          <p className="m-0">Made for the memorable.</p>
        </div>

      </div>
    </footer>
  );
}