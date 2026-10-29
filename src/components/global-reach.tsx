"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { usePalette } from "./theme-provider";

const World = dynamic(() => import("./ui/globe").then((module) => module.World), { ssr: false });
const destinations = [
  { lat: 51.5072, lng: -0.1276, altitude: .24 },
  { lat: 35.6762, lng: 139.6503, altitude: .2 },
  { lat: 40.7128, lng: -74.006, altitude: .35 },
  { lat: 1.3521, lng: 103.8198, altitude: .15 },
];

export function GlobalReach() {
  const reduced = useReducedMotion();
  const { activeTokens, palette } = usePalette();
  const routes = useMemo(() => reduced ? [] : destinations.map((place, index) => ({
    order: index + 1, startLat: 19.076, startLng: 72.8777,
    endLat: place.lat, endLng: place.lng, arcAlt: place.altitude,
    color: index % 2 ? activeTokens["--violet"] : activeTokens["--primary"],
  })), [activeTokens, reduced]);
  const config = useMemo(() => ({
    globeColor: palette.dark["--bg"], polygonColor: palette.dark["--muted"],
    emissive: palette.dark["--bg"], emissiveIntensity: .5, shininess: .1,
    showAtmosphere: true, atmosphereColor: activeTokens["--primary"], atmosphereAltitude: .11,
    ambientLight: "#ffffff", directionalLeftLight: "#ffffff", directionalTopLight: "#ffffff",
    pointLight: activeTokens["--primary"], pointSize: 1.2, arcTime: 2600,
    arcLength: .7, rings: 1, maxRings: 2, autoRotate: !reduced, autoRotateSpeed: .25,
  }), [activeTokens, palette.dark, reduced]);

  return (
    <section aria-labelledby="global-reach-heading" className="relative overflow-hidden bg-[var(--bg)] px-[clamp(24px,5vw,80px)] py-24 font-sans text-[var(--ink)] md:py-36">
      <div className="mx-auto max-w-7xl">
        <div className="relative grid items-center gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-16">
          <motion.div initial={reduced ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .8, ease: [0.16, 1, 0.3, 1] }} className="relative z-10 flex flex-col items-start">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] px-4 py-1.5 text-[13px] font-medium tracking-tight text-[var(--ink)]">
              Beyond the familiar
            </div>
            <h2 id="global-reach-heading" className="m-0 font-sans text-[clamp(48px,6vw,86px)] font-semibold leading-[.95] tracking-tighter text-[var(--ink)]">Your voice.<br /><span className="text-[color:color-mix(in_srgb,var(--ink)_40%,transparent)]">Everywhere.</span></h2>
            <p className="mt-8 max-w-[360px] text-balance text-[16px] leading-relaxed text-[var(--muted)]">Practise the pitches, presentations and conversations that take you further. A new audience. The same clear voice.</p>
            <a href="#courses" className="group mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--ink)] px-6 text-[13px] font-medium text-[var(--bg)] transition-all duration-300 hover:scale-[1.02] active:scale-[.98]">
              Explore our courses
              <ArrowUpRight size={16} strokeWidth={2} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </motion.div>
          <div className="relative mx-auto aspect-square w-full max-w-[600px] min-w-0 overflow-hidden rounded-[2rem] bg-[color:color-mix(in_srgb,var(--ink)_3%,transparent)]">
            <div aria-label="Animated globe illustrating connections from Mumbai" role="img" className="absolute inset-3 sm:inset-5">
              <World data={routes} globeConfig={config} />
            </div>
            <svg aria-hidden="true" viewBox="0 0 600 600" fill="none" className="pointer-events-none absolute inset-0 h-full w-full text-[var(--ink)]">
              <circle cx="300" cy="300" r="263" stroke="currentColor" strokeOpacity=".13" strokeDasharray="2 9" />
              <path d="M70 417 H130 L181 366" stroke="currentColor" strokeOpacity=".55" />
              <circle cx="181" cy="366" r="3" fill="currentColor" />
            </svg>
            <div className="pointer-events-none absolute bottom-[27%] left-4 rounded-full bg-[var(--surface)] px-4 py-2.5 text-[12px] font-medium tracking-tight text-[var(--ink)] sm:left-7">Mumbai · Worldwide</div>
            <p className="absolute bottom-6 left-0 right-0 text-center text-[11px] text-[var(--muted)]">Drag to explore · Illustrative connections</p>
          </div>
        </div>
      </div>
    </section>
  );
}
