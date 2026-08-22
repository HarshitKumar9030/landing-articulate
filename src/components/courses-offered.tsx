"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Clock3, X, ArrowRight } from "lucide-react";
import { APP_CONTENT } from "@/constants";
import { Reveal } from "./reveal";

// Bento Box Grid Sizing
const bentoLayout = [
  "md:col-span-7 md:row-span-2", 
  "md:col-span-5",               
  "md:col-span-5",               
  "md:col-span-4",               
  "md:col-span-8",               
];

// Pure, flat, high-contrast colors
const cardTone: Record<string, { bg: string; text: string; muted: string }> = {
  signal: { bg: "bg-[#FF3300]", text: "text-white", muted: "text-white/70" },
  violet: { bg: "bg-[#4A00FF]", text: "text-white", muted: "text-white/70" },
  ink: { bg: "bg-[var(--ink)]", text: "text-[var(--bg)]", muted: "text-[var(--bg)]/70" },
  tint: { bg: "bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)]", text: "text-[var(--ink)]", muted: "text-[var(--ink)]/60" },
  line: { bg: "bg-transparent ring-1 ring-inset ring-[color:color-mix(in_srgb,var(--ink)_15%,transparent)]", text: "text-[var(--ink)]", muted: "text-[var(--ink)]/60" },
};

export function CoursesOffered({ onContactOpen }: { onContactOpen: () => void }) {
  const [activeCourse, setActiveCourse] = useState<number | null>(null);

  useEffect(() => {
    if (activeCourse !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [activeCourse]);

  return (
    <section id="courses" className="relative overflow-hidden bg-[var(--bg)] px-[clamp(24px,5vw,80px)] py-24 md:py-36">
      
      <div className="relative z-10 mx-auto max-w-[1400px]">
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-[1fr_0.78fr] lg:items-end">
            <div>
              {/* Editorial Eyebrow */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] px-4 py-1.5 font-sans text-[13px] font-medium tracking-tight text-[var(--ink)]">
                {APP_CONTENT.courses.eyebrow}
              </div>
              
              <h2 className="mt-5 max-w-4xl font-sans text-[clamp(42px,6vw,96px)] font-semibold leading-[0.9] tracking-tighter text-[var(--ink)]">
                {APP_CONTENT.courses.headlineLead}<br />
                <span className="text-[color:color-mix(in_srgb,var(--ink)_40%,transparent)]">
                  {APP_CONTENT.courses.headlineAccent}
                </span>
              </h2>
            </div>
            
            <p className="max-w-md text-balance font-sans text-[16px] leading-relaxed text-[color:color-mix(in_srgb,var(--ink)_60%,transparent)] lg:mb-3 lg:justify-self-end">
              {APP_CONTENT.courses.copy}
            </p>
          </div>
        </Reveal>

        {/* Bento Grid */}
        <div className="mt-16 grid auto-rows-[minmax(280px,auto)] gap-4 md:mt-24 md:grid-cols-12 md:gap-6">
          {APP_CONTENT.courses.items.map((course, index) => {
            const theme = cardTone[course.accent as keyof typeof cardTone] || cardTone.ink;

            return (
              <motion.div
                key={course.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={bentoLayout[index]}
              >
                <motion.div
                  layoutId={`course-card-${index}`}
                  onClick={() => setActiveCourse(index)}
                  whileHover="hover"
                  whileTap="tap"
                  variants={{ hover: { scale: 1.02 }, tap: { scale: 0.98 } }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className={`group relative flex h-full w-full cursor-pointer flex-col justify-between overflow-hidden rounded-[2rem] p-8 md:rounded-[2.5rem] md:p-10 ${theme.bg} ${theme.text}`}
                >
                  {/* 
                    Hollow Outline Background Typography
                    Uses -webkit-text-stroke to create an outline, leaving the inside transparent 
                    so the foreground text is never obscured.
                  */}
                  <motion.div 
                    variants={{
                      rest: { x: "15%", y: "20%", scale: 1, opacity: 0.15 },
                      hover: { x: "10%", y: "15%", scale: 1.05, opacity: 0.3 }
                    }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="pointer-events-none absolute bottom-0 right-0 select-none font-sans text-[clamp(160px,18vw,280px)] font-bold leading-none tracking-tighter text-transparent [-webkit-text-stroke:2px_currentColor]"
                  >
                    {course.code}
                  </motion.div>
                  
                  {/* Top Row: Code */}
                  <motion.div layoutId={`course-code-${index}`} className="relative z-10 flex items-center justify-between">
                    <span className={`font-mono text-[11px] font-bold uppercase tracking-[0.2em] ${theme.muted}`}>
                      {course.code}
                    </span>
                  </motion.div>
                  
                  {/* Center/Bottom Content */}
                  <motion.div 
                    variants={{ rest: { y: 0 }, hover: { y: -8 } }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 mt-16 flex flex-1 flex-col justify-end"
                  >
                    <motion.h3 layoutId={`course-title-${index}`} className="max-w-xl font-sans text-[clamp(32px,3.5vw,56px)] font-bold leading-[0.95] tracking-tighter">
                      {course.title}
                    </motion.h3>
                    <motion.p layoutId={`course-desc-${index}`} className={`mt-5 max-w-md font-sans text-[15px] font-medium leading-relaxed ${theme.muted}`}>
                      {course.description}
                    </motion.p>
                    
                    {/* Footer Row: Format & Elegant Arrow */}
                    <div className="mt-10 flex items-center justify-between gap-3">
                      <span className={`inline-flex items-center gap-2.5 font-sans text-[13px] font-semibold tracking-tight ${theme.muted}`}>
                        <Clock3 strokeWidth={2} className="size-4" />
                        {course.format}
                      </span>
                      
                      <div className="flex items-center gap-2 overflow-hidden font-mono text-[10px] font-bold uppercase tracking-[0.1em] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        Read Syllabus <ArrowRight size={14} />
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Global CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true, margin: "-50px" }} 
          transition={{ duration: 0.6, delay: 0.3 }} 
          className="mt-16 flex justify-center md:justify-end"
        >
          <button 
            type="button" 
            onClick={onContactOpen} 
            className="group inline-flex h-14 items-center gap-3 rounded-full bg-[var(--ink)] px-8 font-sans text-[14px] font-medium text-[var(--bg)] transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            {APP_CONTENT.courses.cta}
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={2} />
          </button>
        </motion.div>
      </div>

      {/* Expanded Popup Modal */}
      <AnimatePresence>
        {activeCourse !== null && (
          <motion.div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
            initial={{ backgroundColor: "rgba(0,0,0,0)" }}
            animate={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(16px)" }}
            exit={{ backgroundColor: "rgba(0,0,0,0)", backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.5 }}
            onClick={() => setActiveCourse(null)}
            data-lenis-prevent="true"
          >
            {(() => {
              const course = APP_CONTENT.courses.items[activeCourse];
              const theme = cardTone[course.accent as keyof typeof cardTone] || cardTone.ink;

              return (
                <motion.div
                  layoutId={`course-card-${activeCourse}`}
                  onClick={(e) => e.stopPropagation()}
                  className={`relative flex h-full max-h-[800px] w-full max-w-[1000px] flex-col overflow-hidden rounded-[2rem] sm:rounded-[3rem] ${theme.bg} ${theme.text}`}
                >
                  {/* Decorative Hollow Background inside Modal */}
                  <div className="pointer-events-none absolute -bottom-[10%] -right-[5%] select-none font-sans text-[clamp(200px,25vw,400px)] font-bold leading-none tracking-tighter text-transparent opacity-10 [-webkit-text-stroke:2px_currentColor]">
                    {course.code}
                  </div>

                  {/* Modal Header */}
                  <div className="flex items-center justify-between p-8 sm:px-12 sm:py-10">
                    <motion.span layoutId={`course-code-${activeCourse}`} className={`relative z-10 font-mono text-[13px] font-bold uppercase tracking-[0.2em] ${theme.muted}`}>
                      {course.code}
                    </motion.span>
                    <button 
                      onClick={() => setActiveCourse(null)}
                      className={`relative z-10 grid size-12 place-items-center rounded-full bg-[color:color-mix(in_srgb,currentColor_10%,transparent)] transition-colors hover:bg-[color:color-mix(in_srgb,currentColor_20%,transparent)]`}
                    >
                      <X size={20} strokeWidth={2} />
                    </button>
                  </div>

                  {/* Modal Scrollable Content */}
                  <div className="relative z-10 flex-1 overflow-y-auto px-8 pb-12 sm:px-12 sm:pb-16" data-lenis-prevent="true">
                    <motion.h3 layoutId={`course-title-${activeCourse}`} className="max-w-2xl font-sans text-[clamp(48px,6vw,80px)] font-bold leading-[0.9] tracking-tighter">
                      {course.title}
                    </motion.h3>
                    
                    <motion.p layoutId={`course-desc-${activeCourse}`} className={`mt-8 max-w-xl font-sans text-[clamp(18px,2vw,24px)] font-medium leading-relaxed ${theme.muted}`}>
                      {course.description}
                    </motion.p>

                    {/* Extended Syllabus / Details Fade-in */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="mt-12 max-w-2xl"
                    >
                      <div className={`mb-8 h-px w-full bg-[color:color-mix(in_srgb,currentColor_15%,transparent)]`} />
                      
                      <h4 className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.15em] opacity-60">Syllabus Overview</h4>
                      <p className="font-sans text-[16px] leading-relaxed opacity-90 sm:text-[18px]">
                        This comprehensive module breaks down the exact frameworks required to master the stage. We will explore deep narrative structures, audience psychology, and physical presence mechanics. 
                        By the end of this course, you will no longer just speak—you will control the room's energy entirely.
                      </p>

                      <div className="mt-12 flex flex-wrap gap-4">
                        <button 
                          onClick={() => { setActiveCourse(null); setTimeout(onContactOpen, 400); }}
                          className={`group flex h-14 items-center gap-3 rounded-full bg-[color:color-mix(in_srgb,currentColor_10%,transparent)] px-8 font-sans text-[14px] font-semibold transition-colors hover:bg-currentColor hover:text-[var(--bg)]`}
                        >
                          Enroll in {course.code}
                          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                        </button>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}