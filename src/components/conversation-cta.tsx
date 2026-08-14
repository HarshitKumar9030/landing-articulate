"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./reveal";
import { CTA_EYEBROW } from "@/constants";

export function ConversationCta({ onContactOpen }: { onContactOpen: () => void }) {
  // We split the text into words so we can apply the focus-pull hover effect individually
  const sentence = "Bring us the room, the message, or the deadline.";
  const words = sentence.split(" ");

  return (
    <section className="relative w-full overflow-hidden bg-[var(--bg)] px-[clamp(24px,5vw,80px)] py-32 md:py-48">
      <div className="mx-auto w-full max-w-[1600px]">

        {/* Editorial Eyebrow - Sharp, confident copy */}
        <Reveal>
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-[color-mix(in_srgb,var(--ink)_4%,transparent)] px-4 py-1.5 font-sans text-[13px] font-medium tracking-tight text-[var(--ink)] backdrop-blur-md">

            {CTA_EYEBROW}
          </div>
        </Reveal>

        {/* 
          The Massive Inline Typographic CTA
          The entire H1 acts as the button. 
        */}
        <button
          onClick={onContactOpen}
          className="group w-full cursor-pointer text-left font-sans text-[clamp(48px,8.5vw,160px)] font-semibold leading-[0.85] tracking-tighter text-[var(--ink)] transition-transform duration-300 active:scale-[0.99]"
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              // Lens-focus reveal sequence
              initial={{ opacity: 0, filter: "blur(12px)", y: 20 }}
              whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
              // Focus pull interaction: words dim when the sentence is hovered
              className="inline-block transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-20"
            >
              {word}&nbsp;
            </motion.span>
          ))}

          {/* 
            The Inline Pill 
            Uses 'em' units so it scales perfectly relative to the massive font size across all devices
          */}
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: words.length * 0.04, ease: [0.16, 1, 0.3, 1] }}
            className="ml-[0.1em] mt-[0.1em] inline-flex items-center gap-[0.2em] whitespace-nowrap rounded-full bg-[var(--ink)] px-[0.4em] pb-[0.1em] pt-[0.15em] align-middle text-[var(--bg)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
          >
            <span>Start</span>

            {/* Arrow Container */}
            <span className="flex h-[0.7em] w-[0.7em] items-center justify-center rounded-full bg-[var(--bg)] text-[var(--ink)]">
              <ArrowUpRight
                className="h-[0.45em] w-[0.45em] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[0.05em] group-hover:translate-x-[0.05em]"
                strokeWidth={2.5}
              />
            </span>

          </motion.span>
        </button>

      </div>
    </section>
  );
}