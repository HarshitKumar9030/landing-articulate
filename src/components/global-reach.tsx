"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";

const Globe = dynamic(() => import("./ui/3d-globe").then((module) => module.Globe3D), { ssr: false });

/** Aceternity's 3D Globe with local textures and an SVG communications orbit. */
export function GlobalReach() {
  const reducedMotion = useReducedMotion();
  return (
    <section aria-labelledby="global-reach-heading" className="relative overflow-hidden bg-[var(--bg)] px-[clamp(24px,5vw,80px)] py-16 md:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-6 lg:grid-cols-2 lg:gap-20">
        <div className="relative z-10">
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[.18em] text-[var(--muted)]">Mumbai · Worldwide</p>
          <h2 id="global-reach-heading" className="max-w-xl text-balance text-[clamp(40px,5vw,72px)] font-semibold leading-[.98] tracking-tighter text-[var(--ink)]">Your ideas deserve<br /><span className="text-[var(--muted)]">a wider audience.</span></h2>
          <p className="mt-7 max-w-md text-[16px] leading-relaxed text-[var(--muted)]">A pitch across the table. A presentation across time zones. Practise speaking clearly and connecting with the people listening.</p>
          <a href="#courses" className="mt-8 inline-flex items-center gap-3 text-[14px] font-medium text-[var(--ink)] transition-transform hover:translate-x-1">Find your course <span aria-hidden="true">↗</span></a>
        </div>
        <div aria-hidden="true" className="pointer-events-none relative mx-auto aspect-square w-full max-w-[460px]">
      <Globe className="!h-full" config={{ textureUrl: "/images/globe/earth.jpg", bumpMapUrl: "/images/globe/topology.png", bumpScale: 0.04, autoRotateSpeed: reducedMotion ? 0 : 0.55, globeColor: "#8aabd3", ambientIntensity: 1.3, pointLightIntensity: 1.2, initialRotation: { x: 0.1, y: 1.3 } }} />
      <svg viewBox="0 0 230 230" className="absolute inset-0 h-full w-full overflow-visible text-[var(--ink)]" fill="none">
        <ellipse cx="115" cy="115" rx="108" ry="38" transform="rotate(-25 115 115)" stroke="currentColor" strokeOpacity=".2" strokeDasharray="3 6" />
        <g className="hero-orbit-dot"><circle cx="18" cy="157" r="4" fill="var(--primary)" /><circle cx="18" cy="157" r="9" stroke="var(--primary)" strokeOpacity=".25" /></g>
        <path d="M160 183 L177 202 H220" stroke="currentColor" strokeOpacity=".35" />
      </svg>
      <p className="absolute bottom-2 right-2 font-mono text-[9px] uppercase tracking-[.15em] text-[var(--ink)]">Your voice. Worldwide.</p>
        </div>
      </div>
    </section>
  );
}
