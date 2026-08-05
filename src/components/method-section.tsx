"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Plus } from "lucide-react";
import { Reveal } from "./reveal";

const steps = [
  {
    number: "01",
    title: "Find the signal",
    copy: "We reduce the noise and name the one thing your audience should remember.",
    details: "We dissect your raw material—notes, ramblings, previous decks—and distill it into a singular, undeniable thesis. No jargon. No fluff. Just the core truth of what you need to say."
  },
  {
    number: "02",
    title: "Build the shape",
    copy: "We structure language, rhythm, and visuals around the way people actually listen.",
    details: "Great ideas die in dense paragraphs. We pace your delivery, map out the emotional arcs, and build visual anchors so your audience stays with you from the first breath to the final pause."
  },
  {
    number: "03",
    title: "Make it yours",
    copy: "We rehearse until the message feels less performed and more like you on your best day.",
    details: "This isn't about memorizing a script. We pressure-test your delivery in a studio setting, stripping away the 'speaker voice' and adjusting the rhythm until the words feel completely natural."
  }
];

export function MethodSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative overflow-hidden bg-[var(--bg)] px-[clamp(24px,5vw,80px)] py-24 md:py-36">
      
      {/* Ambient Background Depth */}
      <div className="pointer-events-none absolute left-[-10%] top-[20%] -z-10 h-[50vw] w-[50vw] max-w-[600px] rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--ink)_4%,transparent)_0%,transparent_60%)] blur-3xl" />

      {/* 
        Grid setup with items-start is crucial here. 
        It allows the left column to be sticky without stretching to the full height of the right column.
      */}
      <div className="relative z-10 mx-auto grid max-w-7xl items-start gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
        
        {/* Left Column: Context (Sticky) */}
        <div className="sticky top-32 flex flex-col items-start lg:pb-24">
          <Reveal>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] px-4 py-1.5 font-sans text-[13px] font-medium tracking-tight text-[var(--ink)] ring-1 ring-[color:color-mix(in_srgb,var(--ink)_6%,transparent)]">
              The practice loop
            </div>
            
            <h2 className="mt-2 font-sans text-[clamp(48px,6vw,86px)] font-semibold leading-[0.9] tracking-tighter text-[var(--ink)]">
              A method that leaves room for{" "}
              <span className="text-[color:color-mix(in_srgb,var(--ink)_40%,transparent)]">
                your voice.
              </span>
            </h2>
            
            <p className="mt-8 max-w-[360px] text-balance font-sans text-[16px] leading-relaxed text-[var(--muted)]">
              Clear thinking gets more useful when it has a repeatable way to become clear language.
            </p>
          </Reveal>
        </div>

        {/* Right Column: Interactive Accordion Cards */}
        <div className="flex flex-col gap-4 pt-4 lg:pt-0">
          {steps.map((step, index) => (
            <StepCard
              key={step.number}
              step={step}
              index={index}
              isOpen={openIndex === index}
              setOpenIndex={setOpenIndex}
            />
          ))}
        </div>
        
      </div>
    </section>
  );
}

// Extracted into a sub-component so each card can track its own scroll position
function StepCard({ 
  step, 
  index, 
  isOpen, 
  setOpenIndex 
}: { 
  step: typeof steps[0], 
  index: number, 
  isOpen: boolean, 
  setOpenIndex: (index: number | null) => void 
}) {
  const ref = useRef<HTMLElement>(null);
  
  // Triggers when the element crosses the middle 40% of the viewport height
  const isCenter = useInView(ref, { margin: "-30% 0px -30% 0px" });

  useEffect(() => {
    // Automatically open the card if it scrolls into the center zone
    if (isCenter) {
      setOpenIndex(index);
    }
  }, [isCenter, index, setOpenIndex]);

  return (
    <motion.article 
      ref={ref}
      onClick={() => setOpenIndex(isOpen ? null : index)}
      className={`group flex cursor-pointer flex-col gap-6 rounded-[2rem] p-6 transition-all duration-500 sm:p-8 md:p-10 ${
        isOpen 
          ? "bg-[color:color-mix(in_srgb,var(--ink)_5%,transparent)]" 
          : "bg-[color:color-mix(in_srgb,var(--ink)_2%,transparent)] hover:bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)]"
      }`}
      // The entrance animation still runs once when it simply enters the screen
      initial={{ opacity: 0, y: 25 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true, margin: "-50px" }} 
      transition={{ delay: index * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-start justify-between gap-6">
        
        {/* Title & Base Copy */}
        <div className="flex items-start gap-6 sm:gap-8">
          <span className={`mt-1 shrink-0 font-mono text-[11px] font-medium tracking-[0.1em] transition-colors duration-500 ${isOpen ? "text-[var(--ink)]" : "text-[color:color-mix(in_srgb,var(--ink)_40%,transparent)]"}`}>
            {step.number}
          </span>
          
          <div>
            <h3 className="font-sans text-2xl font-medium tracking-tight text-[var(--ink)]">
              {step.title}
            </h3>
            <p className="mt-3 max-w-[360px] text-balance font-sans text-[15px] leading-relaxed text-[var(--muted)]">
              {step.copy}
            </p>
          </div>
        </div>
        
        {/* Interactive Plus/Cross Icon */}
        <div className={`hidden h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-500 sm:flex ${isOpen ? "bg-[color:color-mix(in_srgb,var(--ink)_10%,transparent)] text-[var(--ink)]" : "bg-[color:color-mix(in_srgb,var(--ink)_0%,transparent)] text-[color:color-mix(in_srgb,var(--ink)_40%,transparent)] group-hover:bg-[color:color-mix(in_srgb,var(--ink)_8%,transparent)] group-hover:text-[var(--ink)]"}`}>
          <Plus 
            size={16} 
            strokeWidth={2} 
            className={`block origin-center transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "rotate-45" : "rotate-0"}`} 
          />
        </div>
      </div>

      {/* Expanded Content with Clip-Path Reveal */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, clipPath: "inset(0% 0 100% 0)" }}
            animate={{ height: "auto", opacity: 1, clipPath: "inset(0% 0 0% 0)" }}
            exit={{ height: 0, opacity: 0, clipPath: "inset(0% 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="pt-2 sm:pl-[4.5rem]">
              <div className="h-px w-full bg-[color:color-mix(in_srgb,var(--ink)_8%,transparent)]" />
              <p className="mt-6 max-w-[420px] font-sans text-[14px] leading-relaxed text-[var(--muted)]">
                {step.details}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </motion.article>
  );
}