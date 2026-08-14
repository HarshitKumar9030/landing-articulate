"use client";

import { useRef, type MouseEvent as ReactMouseEvent, type ReactNode } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, Variants } from "framer-motion";
import { Play } from "lucide-react";
import { APP_CONTENT } from "@/constants";

// ----------------------------------------------------------------------
// Micro-interaction: Magnetic Physics Wrapper
// ----------------------------------------------------------------------
function Magnetic({ children, strength = 30 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.5 });

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const pullStrength = strength / 100;
    x.set((e.clientX - centerX) * pullStrength);
    y.set((e.clientY - centerY) * pullStrength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="flex items-center justify-center"
    >
      {children}
    </motion.div>
  );
}

// ----------------------------------------------------------------------
// Animation Variants for the "Lens Focus" Effect
// ----------------------------------------------------------------------
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // Fast, snappy stagger between words
      delayChildren: 0.2,
    },
  },
};

const wordVariants: Variants = {
  hidden: { 
    opacity: 0, 
    filter: "blur(16px)", 
    scale: 1.2,
    y: 20
  },
  visible: { 
    opacity: 1, 
    filter: "blur(0px)", 
    scale: 1,
    y: 0,
    transition: { 
      duration: 1, 
      ease: [0.16, 1, 0.3, 1] // Heavy, physical easing
    }
  },
};

export function QuoteSection() {
  const sectionRef = useRef<HTMLElement>(null);
  
  // Subtle parallax for the giant background quote mark
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  // Helper to split text into animated words while preserving spaces
  const AnimatedText = ({ text, className }: { text: string; className?: string }) => {
    return (
      <span className={className}>
        {text.split(" ").map((word, i) => (
          <span key={i} className="inline-block whitespace-nowrap">
            <motion.span variants={wordVariants} className="inline-block">
              {word}
            </motion.span>
            <span className="inline-block">&nbsp;</span>
          </span>
        ))}
      </span>
    );
  };

  return (
    <section 
      ref={sectionRef} 
      className="relative flex min-h-[90svh] w-full flex-col items-center justify-center overflow-hidden bg-[var(--bg)] px-[clamp(24px,5vw,80px)] py-32 text-center md:py-48"
    >
      {/* 
        Massive Typographic Watermark 
        Drifts slightly as you scroll to create depth
      */}
      <motion.div 
        style={{ y: backgroundY }}
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 select-none font-serif text-[clamp(250px,40vw,600px)] leading-[0.5] text-[color:color-mix(in_srgb,var(--ink)_2%,transparent)]"
      >
        &ldquo;
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }} // Triggers right before it centers
        className="relative z-10 flex w-full max-w-[1200px] flex-col items-center"
      >
        
        {/* The Lens-Focus Quote */}
        <h2 className="m-0 flex flex-wrap justify-center text-balance font-sans text-[clamp(40px,7vw,100px)] font-medium leading-[0.95] tracking-tighter text-[var(--ink)]">
          <AnimatedText text={APP_CONTENT.quote.lead} />
          {/* Accent words colored slightly differently */}
          <AnimatedText 
            text={APP_CONTENT.quote.accent} 
            className="text-[color:color-mix(in_srgb,var(--ink)_35%,transparent)]" 
          />
        </h2>

        {/* Attribution fading in smoothly */}
        <motion.p 
          variants={wordVariants}
          className="mt-12 font-mono text-[12px] font-medium uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--ink)_50%,transparent)] md:mt-16"
        >
          {APP_CONTENT.quote.attribution}
        </motion.p>

        {/* Magnetic CTA */}
        <motion.div variants={wordVariants} className="mt-16 md:mt-24">
          <Magnetic strength={20}>
            <button className="group flex h-14 cursor-pointer items-center justify-center gap-3 rounded-full bg-[color:color-mix(in_srgb,var(--ink)_3%,transparent)] px-8 font-sans text-[14px] font-medium text-[var(--ink)] no-underline transition-colors hover:bg-[color:color-mix(in_srgb,var(--ink)_6%,transparent)] active:scale-[0.98]">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--ink)] text-[var(--bg)] transition-transform duration-500 group-hover:scale-110">
                <Play fill="currentColor" className="ml-0.5 h-3 w-3" />
              </div>
              {APP_CONTENT.quote.cta}
            </button>
          </Magnetic>
        </motion.div>
        
      </motion.div>
    </section>
  );
}