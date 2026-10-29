"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const World = dynamic(() => import("./ui/globe").then((module) => module.World), { ssr: false });
const routes = [
  { order: 1, startLat: 19.076, startLng: 72.8777, endLat: 51.5072, endLng: -0.1276, arcAlt: .24, color: "#b7baff" },
  { order: 2, startLat: 19.076, startLng: 72.8777, endLat: 35.6762, endLng: 139.6503, arcAlt: .2, color: "#92d8e6" },
  { order: 3, startLat: 19.076, startLng: 72.8777, endLat: 40.7128, endLng: -74.006, arcAlt: .35, color: "#b7baff" },
  { order: 4, startLat: 19.076, startLng: 72.8777, endLat: 1.3521, endLng: 103.8198, arcAlt: .15, color: "#92d8e6" },
];

export function GlobalReach() {
  const reduced = useReducedMotion();
  return (
    <section aria-labelledby="global-reach-heading" className="bg-[var(--bg)] px-5 py-16 md:px-12 md:py-24">
      <div className="relative mx-auto grid max-w-7xl overflow-hidden rounded-[32px] bg-[#111525] text-[#f4f4ff] lg:min-h-[520px] lg:grid-cols-[1fr_1.15fr]">
        <div className="relative z-10 flex flex-col items-start justify-center px-8 pt-12 sm:px-12 lg:py-16 lg:pl-16 lg:pr-0">
          <p className="mb-8 font-mono text-[10px] uppercase tracking-[.22em] text-[#a6abc4]">Rooted in Mumbai. Ready for the world.</p>
          <h2 id="global-reach-heading" className="max-w-md font-sans text-[clamp(38px,4.4vw,64px)] font-medium leading-[1.03] tracking-[-.05em]">New audience.<br /><span className="text-[#b7baff]">Same clear voice.</span></h2>
          <p className="mt-6 max-w-[330px] font-sans text-[15px] leading-7 text-[#a6abc4]">From your first team presentation to your next investor pitch. Build a message you can deliver with confidence.</p>
          <a href="#courses" className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#f4f4ff] px-6 py-3.5 font-sans text-[13px] font-medium text-[#111525] transition-colors hover:bg-[#b7baff]">Explore our courses <ArrowUpRight size={16} /></a>
        </div>
        <div aria-hidden="true" className="relative h-[360px] sm:h-[460px] lg:h-full lg:min-h-[520px]">
          <div className="absolute inset-x-[-12%] inset-y-0">
            <World data={reduced ? [] : routes} globeConfig={{ globeColor: "#151c36", polygonColor: "rgba(179,190,231,0.65)", emissive: "#111525", emissiveIntensity: .4, shininess: .4, showAtmosphere: true, atmosphereColor: "#8699dd", atmosphereAltitude: .12, ambientLight: "#ffffff", directionalLeftLight: "#b7baff", directionalTopLight: "#ffffff", pointLight: "#92d8e6", pointSize: 1.5, arcTime: 2400, arcLength: .7, rings: 1, maxRings: 2, autoRotate: !reduced, autoRotateSpeed: .35 }} />
          </div>
          <div className="absolute bottom-7 left-0 right-0 text-center font-mono text-[9px] uppercase tracking-[.2em] text-[#a6abc4]">Illustrating connection across borders</div>
        </div>
      </div>
    </section>
  );
}
