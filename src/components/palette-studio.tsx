"use client";

import { useState, useRef, type ReactNode, type MouseEvent as ReactMouseEvent } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { Dices, Palette, X } from "lucide-react";
import { PALETTES, type Palette as PaletteType, type PaletteTokens } from "@/constants";

// ----------------------------------------------------------------------
// Micro-interaction: Magnetic Physics Wrapper
// ----------------------------------------------------------------------
function Magnetic({ children, strength = 20 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * (strength / 100));
    y.set((e.clientY - centerY) * (strength / 100));
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
// Main Component
// ----------------------------------------------------------------------
type PaletteStudioProps = {
  activePalette: PaletteType;
  tokens: PaletteTokens;
  onPaletteChange: (palette: PaletteType) => void;
  onTokenChange: (token: keyof PaletteTokens, value: string) => void;
  onRandomize: () => void;
};

const editableTokens: Array<{ token: keyof PaletteTokens; label: string }> = [
  { token: "--bg", label: "Canvas" },
  { token: "--ink", label: "Ink" },
  { token: "--primary", label: "Accent" },
  { token: "--deep-bg", label: "Depth" },
];

export function PaletteStudio({ 
  activePalette, 
  tokens, 
  onPaletteChange, 
  onTokenChange, 
  onRandomize 
}: PaletteStudioProps) {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // --- NATIVE VIEW TRANSITION: Expanding Ripple Effect ---
  const handleThemeSwitch = (e: ReactMouseEvent<HTMLButtonElement>, callback: () => void) => {
    if (!document.startViewTransition) {
      callback();
      return;
    }

    const x = e.clientX;
    const y = e.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      callback();
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`
          ]
        },
        {
          duration: 700,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          pseudoElement: "::view-transition-new(root)"
        }
      );
    });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const, staggerChildren: 0.05, delayChildren: 0.1 },
    },
    exit: {
      opacity: 0,
      y: 15,
      scale: 0.96,
      transition: { duration: 0.3, ease: "easeOut" as const },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
  } as const;

  return (
    <>
      <style>{`
        ::view-transition-old(root),
        ::view-transition-new(root) {
          animation: none;
          mix-blend-mode: normal;
        }
        ::view-transition-old(root) { z-index: 1; }
        ::view-transition-new(root) { z-index: 2; }
      `}</style>

      <div className="fixed bottom-6 left-6 z-50 sm:bottom-8 sm:left-8">
        
        {/* The Open Modal */}
        <AnimatePresence>
          {open && (
            <motion.section 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute bottom-20 left-0 w-[min(340px,calc(100vw-48px))] overflow-hidden rounded-[2rem] bg-[var(--ink)] p-6 text-[var(--bg)]" 
            >
              <motion.div variants={itemVariants} className="mb-6 flex items-start justify-between">
                <div>
                  <h2 className="font-sans text-[28px] font-semibold leading-none tracking-tight text-[var(--bg)]">
                    Studio.
                  </h2>
                  <div className="mt-2 font-sans text-[14px] font-medium text-[color:color-mix(in_srgb,var(--bg)_60%,transparent)]">
                    Select your theme
                  </div>
                </div>
                
                <Magnetic strength={15}>
                  <button 
                    onClick={() => setOpen(false)} 
                    aria-label="Close palette studio" 
                    className="grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-[color:color-mix(in_srgb,var(--bg)_8%,transparent)] text-[var(--bg)] transition-colors hover:bg-[color:color-mix(in_srgb,var(--bg)_15%,transparent)] active:scale-90"
                  >
                    <X size={16} strokeWidth={2} />
                  </button>
                </Magnetic>
              </motion.div>

              <motion.div variants={itemVariants} className="grid grid-cols-1 gap-2">
                {PALETTES.map((palette) => {
                  const isActive = activePalette.id === palette.id;
                  return (
                    <button 
                      key={palette.id} 
                      onClick={(e) => handleThemeSwitch(e, () => onPaletteChange(palette))} 
                      className={`group flex w-full items-center justify-between rounded-2xl p-3 transition-all duration-300 ${
                        isActive 
                          ? "bg-[var(--bg)] text-[var(--ink)]" 
                          : "bg-[color:color-mix(in_srgb,var(--bg)_4%,transparent)] text-[var(--bg)] hover:bg-[color:color-mix(in_srgb,var(--bg)_8%,transparent)]"
                      }`}
                    >
                      <span className="font-sans text-[14px] font-medium tracking-tight transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
                        {palette.name}
                      </span>
                      <span className="flex -space-x-1">
                        {[palette.light["--bg"], palette.light["--ink"], palette.light["--primary"]].map((color, idx) => (
                          <i 
                            key={idx} 
                            className="relative z-10 h-5 w-5 rounded-full ring-2 ring-[var(--ink)] transition-transform duration-300 group-hover:scale-110" 
                            style={{ 
                              backgroundColor: color,
                              zIndex: 3 - idx,
                              transitionDelay: `${idx * 50}ms` 
                            }} 
                          />
                        ))}
                      </span>
                    </button>
                  );
                })}
              </motion.div>

              <motion.div variants={itemVariants} className="mt-8">
                <div className="mb-4 font-sans text-[14px] font-medium text-[color:color-mix(in_srgb,var(--bg)_60%,transparent)]">
                  Custom tokens
                </div>
                
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  {editableTokens.map(({ token, label }) => (
                    <label key={token} className="group flex cursor-pointer items-center justify-between gap-2 font-sans text-[13px] font-medium text-[var(--bg)]">
                      <span className="transition-opacity group-hover:opacity-70">{label}</span>
                      <div className="relative h-6 w-10 overflow-hidden rounded-full bg-[color:color-mix(in_srgb,var(--bg)_15%,transparent)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-125 group-active:scale-95">
                        <input 
                          aria-label={`${label} color`} 
                          type="color" 
                          value={tokens[token]} 
                          onChange={(event) => onTokenChange(token, event.target.value)} 
                          className="absolute -inset-4 h-14 w-20 cursor-pointer border-0 bg-transparent p-0 outline-none" 
                        />
                      </div>
                    </label>
                  ))}
                </div>
              </motion.div>

              <motion.button 
                variants={itemVariants}
                onClick={(e) => handleThemeSwitch(e, onRandomize)} 
                className="group mt-8 flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-full bg-[var(--bg)] font-sans text-[14px] font-medium text-[var(--ink)] transition-transform duration-300 active:scale-[0.98]"
              >
                <Dices size={16} strokeWidth={2} className="transition-transform duration-500 group-hover:rotate-180" /> 
                Randomize
              </motion.button>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Expanding Hover Dock Trigger */}
        {!dismissed && !open && (
          <motion.div 
            className="group flex items-center gap-2"
            initial={{ opacity: 0, y: 20, scale: 0.9 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <button 
              onClick={() => setOpen((prev) => !prev)} 
              className="flex h-14 cursor-pointer items-center justify-center rounded-full bg-[var(--ink)] p-2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02] active:scale-[0.96]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--bg)] text-[var(--ink)] transition-transform duration-500 group-hover:rotate-12">
                <Palette size={18} strokeWidth={1.5} />
              </div>
              
              {/* Expanding Label Container */}
              <div className="grid w-0 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-[70px]">
                <span className="truncate whitespace-nowrap pl-3 pr-2 font-sans text-[14px] font-medium tracking-tight text-[var(--bg)]">
                  Studio
                </span>
              </div>
            </button>

            {/* Hidden Dismiss Button that slides out on hover */}
            <div className="grid w-0 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-10">
              <button 
                onClick={(e) => { e.stopPropagation(); setDismissed(true); }}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--ink)_8%,transparent)] text-[var(--ink)] transition-colors hover:bg-[color:color-mix(in_srgb,var(--ink)_15%,transparent)]"
                aria-label="Dismiss dock"
              >
                <X size={16} strokeWidth={2} />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}