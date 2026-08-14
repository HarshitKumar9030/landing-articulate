"use client";

import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";

export function SiteFooter({ onContactOpen }: { onContactOpen: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track mouse coordinates relative to the interactive container
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Apply fluid spring physics to the mouse movement for that heavy, premium feel
  const springConfig = { damping: 25, stiffness: 120, mass: 0.5 };
  const smX = useSpring(mouseX, springConfig);
  const smY = useSpring(mouseY, springConfig);

  // Normalize mouse position (-1 to 1) inside the interactive area
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / (width / 2);
    const y = (e.clientY - top - height / 2) / (height / 2);
    mouseX.set(x);
    mouseY.set(y);
  };

  // Gently return to center when the mouse leaves the canvas
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Multipliers dictating how far each slice drifts on hover
  const layer1X = useTransform(smX, [-1, 1], [-15, 15]);
  const layer1Y = useTransform(smY, [-1, 1], [-15, 15]);

  const layer2X = useTransform(smX, [-1, 1], [-35, 35]);
  const layer2Y = useTransform(smY, [-1, 1], [-20, 20]);

  // Invert the X movement for chaotic contrast
  const layer3X = useTransform(smX, [-1, 1], [30, -30]); 
  const layer3Y = useTransform(smY, [-1, 1], [-40, 40]);
  
  // High-contrast geometric shapes floating in the background
  const layer4X = useTransform(smX, [-1, 1], [-60, 60]);
  
  // The repeating, heavily-tracked text block to be fractured
  const TextLockup = () => (
    <div className="flex w-full flex-col items-center justify-center font-sans text-[clamp(64px,12vw,140px)] font-bold uppercase leading-[0.85] tracking-tighter">
      <span>Articulate</span>
      <span className="text-[color:color-mix(in_srgb,currentColor_35%,transparent)]">Studio</span>
      <span>Worldwide</span>
    </div>
  );

  return (
    <footer 
      id="contact" 
      className="relative w-full bg-[var(--bg)] text-[var(--ink)] selection:bg-[var(--ink)] selection:text-[var(--bg)]"
    >
      <div className="mx-auto flex max-w-[1600px] flex-col gap-12 px-[clamp(24px,5vw,80px)] py-20 lg:flex-row lg:items-stretch lg:justify-between lg:gap-20 lg:py-32">
        
        {/* Left Column: Brand & Content (From your provided snippet) */}
        <div className="z-10 flex w-full shrink-0 flex-col justify-between lg:w-[400px]">
          <div>
            <a 
              className="font-sans text-2xl font-bold tracking-tighter text-[var(--ink)] no-underline" 
              href="#top"
            >
              Articulate<span className="text-[color:color-mix(in_srgb,var(--ink)_35%,transparent)]">X</span>
            </a>
            
            <p className="mt-6 text-balance font-sans text-[16px] leading-relaxed text-[var(--muted)]">
              Ideas deserve a voice with gravitational pull.
            </p>
            
            <button 
              onClick={onContactOpen} 
              className="group mt-10 flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[var(--ink)] px-8 font-sans text-[14px] font-medium text-[var(--bg)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
            >
              Start a conversation 
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={2} />
            </button>
            
            <div className="mt-12 flex flex-col items-start gap-5">
              <a 
                className="group inline-flex items-center gap-2 rounded-full bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] px-5 py-2.5 font-sans text-[13px] font-medium text-[var(--ink)] no-underline transition-colors hover:bg-[color:color-mix(in_srgb,var(--ink)_8%,transparent)] active:scale-[0.98]" 
                href="mailto:hello@articulatex.in"
              >
                hello@articulatex.in
                <ArrowUpRight className="h-3.5 w-3.5 opacity-70 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
              </a>
              
              <div className="flex items-center gap-6 px-2">
                <a 
                  className="font-sans text-[13px] font-medium text-[var(--muted)] no-underline transition-colors hover:text-[var(--ink)]" 
                  href="#top"
                >
                  Instagram
                </a>
                <a 
                  className="font-sans text-[13px] font-medium text-[var(--muted)] no-underline transition-colors hover:text-[var(--ink)]" 
                  href="https://www.linkedin.com/company/articulatex"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-20 flex flex-col gap-2 font-sans text-[12px] font-medium tracking-tight text-[var(--muted)] sm:flex-row sm:items-center sm:gap-6">
            <p className="m-0">© {new Date().getFullYear()} ArticulateX</p>
            <p className="m-0 sm:before:mr-6 sm:before:content-['|'] sm:before:text-[color:color-mix(in_srgb,var(--ink)_10%,transparent)]">Made for the memorable.</p>
          </div>
        </div>

        {/* Right Column: Interactive Kinetic Canvas */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="group relative flex min-h-[500px] w-full flex-1 cursor-crosshair items-center justify-center overflow-hidden rounded-[2.5rem] bg-[color:color-mix(in_srgb,var(--ink)_3%,transparent)] ring-1 ring-[color:color-mix(in_srgb,var(--ink)_5%,transparent)] lg:min-h-auto"
        >
          {/* Base Layer - Static, slightly dimmed out */}
          <div className="absolute inset-0 flex items-center justify-center text-[var(--ink)] opacity-10">
            <TextLockup />
          </div>

          {/* Sliced Layer 1: Top section */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center text-[var(--ink)]"
            style={{ 
              x: layer1X, 
              y: layer1Y,
              clipPath: 'polygon(0 0, 100% 0, 100% 33%, 0 33%)' 
            }}
          >
            <TextLockup />
          </motion.div>

          {/* Sliced Layer 2: Middle section - Outlined style for contrast */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center text-transparent"
            style={{ 
              x: layer2X, 
              y: layer2Y,
              clipPath: 'polygon(0 33%, 100% 33%, 100% 66%, 0 66%)',
              WebkitTextStroke: '1px var(--ink)'
            }}
          >
            <TextLockup />
          </motion.div>

          {/* Sliced Layer 3: Bottom section - Moves in opposite direction */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center text-[var(--ink)]"
            style={{ 
              x: layer3X, 
              y: layer3Y,
              clipPath: 'polygon(0 66%, 100% 66%, 100% 100%, 0 100%)' 
            }}
          >
            <TextLockup />
          </motion.div>

          {/* Abstract Overlays - Uses CSS mix-blend-difference to invert the text it passes over */}
          <motion.div 
            className="pointer-events-none absolute left-1/4 top-1/4 h-32 w-16 bg-[var(--ink)] mix-blend-difference"
            style={{ x: layer4X, y: layer1Y }}
          />
          <motion.div 
            className="pointer-events-none absolute bottom-1/4 right-1/3 h-12 w-48 border-2 border-[var(--ink)] mix-blend-difference"
            style={{ x: layer1X, y: layer3Y }}
          />
          
        </div>
      </div>
    </footer>
  );
}