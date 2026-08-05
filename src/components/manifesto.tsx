"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./reveal";
import { APP_CONTENT } from "@/constants";

export function Manifesto() {
  return (
    <section
      id="about"
      // Added 'manifesto' class so GSAP ScrollTrigger can hook onto it
      className="manifesto relative flex min-h-[90svh] w-full flex-col justify-center overflow-hidden px-[clamp(24px,5vw,80px)] py-24 md:py-32"
    >
      {/* Orb matches the GSAP target '.orb-one' */}
      <div className="orb-one pointer-events-none absolute right-[-10%] top-[10%] -z-10 h-[50vw] w-[50vw] max-w-[600px] rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--ink)_6%,transparent)_0%,transparent_60%)] blur-3xl" />

      <motion.div
        initial={{ opacity: 0, rotate: -20, scale: 0.8 }}
        whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute left-[8%] top-[15%] hidden text-[color-mix(in_srgb,var(--ink)_10%,transparent)] lg:block"
      >
        <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 10 Q 50 50 90 50 Q 50 50 50 90 Q 50 50 10 50 Q 50 50 50 10 Z" fill="currentColor" />
        </svg>
      </motion.div>

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <Reveal>
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-[color-mix(in_srgb,var(--ink)_4%,transparent)] px-4 py-1.5 font-sans text-[13px] font-medium tracking-tight text-[var(--ink)] ring-1 ring-[color-mix(in_srgb,var(--ink)_6%,transparent)]">
            {APP_CONTENT.manifesto.eyebrow}
          </div>

          <h2 className="m-0 max-w-[800px] font-sans text-[clamp(48px,8vw,110px)] font-semibold leading-[0.9] tracking-tighter text-[var(--ink)]">
            {APP_CONTENT.manifesto.headlineLead}{" "}
            <span className="relative inline-block text-[color-mix(in_srgb,var(--ink)_50%,transparent)]">
              {APP_CONTENT.manifesto.headlineAccent}
            </span>
            <br />
            {APP_CONTENT.manifesto.headlineEnd}
          </h2>
        </Reveal>

        <div className="mt-20 grid grid-cols-1 items-end gap-16 md:mt-32 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
          <Reveal>
            <div className="flex h-full flex-col justify-end lg:pb-8">
              <p className="mb-10 max-w-[460px] text-balance font-sans text-[17px] leading-relaxed text-[var(--muted)] md:text-[20px]">
                {APP_CONTENT.manifesto.copy}
              </p>

              <a
                className="group inline-flex w-fit items-center gap-2 rounded-full bg-[color-mix(in_srgb,var(--ink)_4%,transparent)] px-6 py-3 font-sans text-[14px] font-medium text-[var(--ink)] no-underline transition-colors hover:bg-[color-mix(in_srgb,var(--ink)_8%,transparent)] active:scale-[0.98]"
                href="#programs"
              >
                {APP_CONTENT.manifesto.approachCta}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={2} />
              </a>
            </div>
          </Reveal>

          <div className="portrait-image relative w-full overflow-hidden rounded-[2.5rem] bg-[color-mix(in_srgb,var(--ink)_2%,transparent)]">
            <motion.div
              className="relative h-[60vh] min-h-[400px] w-full bg-cover bg-center"
              initial={{ y: "20%", scale: 1.1 }}
              whileInView={{ y: "0%", scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ backgroundImage: "url('/your-image-path.jpg')" }}
            >
              <div className="absolute bottom-6 left-6 inline-flex items-center rounded-full bg-[color-mix(in_srgb,var(--bg)_80%,transparent)] px-4 py-2 font-mono text-[11px] font-medium tracking-[0.1em] text-[var(--ink)] backdrop-blur-md">
                {APP_CONTENT.manifesto.imageLabel}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
