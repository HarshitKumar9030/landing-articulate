"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, MoveUpRight } from "lucide-react";
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
    <section aria-labelledby="global-reach-heading" className="relative overflow-hidden bg-[var(--bg)] px-6 py-20 font-sans text-[var(--ink)] sm:px-12 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[.16em] text-[var(--muted)]">
          <span className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" /> Beyond the familiar</span>
          <span className="hidden sm:block">19.0760° N &nbsp; 72.8777° E</span>
        </div>
        <div className="relative mt-10 grid items-center lg:mt-6 lg:grid-cols-[1fr_1.1fr]">
          <motion.div initial={reduced ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .65 }} className="relative z-10 pb-8 lg:py-12">
            <h2 id="global-reach-heading" className="font-sans text-[clamp(44px,5.8vw,82px)] font-medium leading-[1.02] tracking-[-.06em]">Your voice,<br /><span className="text-[var(--primary)]">without<br className="hidden lg:block" /> borders.</span></h2>
            <p className="mt-7 max-w-[330px] text-[15px] leading-7 text-[var(--muted)]">The room changes. Your confidence stays.<br />Practise the pitches, presentations and conversations that take you further.</p>
            <a href="#courses" className="group mt-8 inline-flex items-center gap-4 text-[14px] font-medium">
              Find your next step
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--ink)] text-[var(--bg)] transition-transform duration-300 group-hover:rotate-45"><ArrowUpRight size={18} /></span>
            </a>
          </motion.div>
          <div className="relative mx-auto aspect-square w-full max-w-[600px] min-w-0">
            <div aria-label="Animated globe illustrating connections from Mumbai" role="img" className="absolute inset-0">
              <World data={routes} globeConfig={config} />
            </div>
            <svg aria-hidden="true" viewBox="0 0 600 600" fill="none" className="pointer-events-none absolute inset-0 h-full w-full text-[var(--primary)]">
              <circle cx="300" cy="300" r="263" stroke="currentColor" strokeOpacity=".13" strokeDasharray="2 9" />
              <path d="M70 417 H130 L181 366" stroke="currentColor" strokeOpacity=".55" />
              <circle cx="181" cy="366" r="3" fill="currentColor" />
              <path d="M500 125 H532 M516 109 V141" stroke="currentColor" strokeOpacity=".5" />
            </svg>
            <div className="pointer-events-none absolute bottom-[27%] left-0 rounded-full bg-[var(--surface)] px-4 py-2.5 text-[11px] font-medium text-[var(--ink)]">Made in Mumbai <span className="ml-2 text-[var(--primary)]">↗</span></div>
            <p className="absolute bottom-0 right-2 font-mono text-[9px] uppercase tracking-[.12em] text-[var(--muted)]">Illustrative connections / Drag to explore</p>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-4 text-[12px] text-[var(--muted)] lg:mt-3">
          {["A clearer pitch", "A stronger presentation", "A conversation that connects"].map((label, index) => (
            <span key={label} className="flex items-center gap-3"><span className="font-mono text-[9px] opacity-60">0{index + 1}</span>{label}<MoveUpRight size={12} className="text-[var(--primary)]" /></span>
          ))}
        </div>
      </div>
    </section>
  );
}
