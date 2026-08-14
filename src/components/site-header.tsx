"use client";

import { useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Moon, Sun, ArrowRight } from "lucide-react";

type SiteHeaderProps = {
  dark: boolean;
  menuOpen: boolean;
  onMenuToggle: () => void;
  onThemeToggle: () => void;
  onNavigate: () => void;
  onContactOpen: () => void;
};

const NAV_ITEMS = [
  { name: "Programs", href: "#programs" },
  { name: "Method", href: "#about" },
  { name: "Contact", href: "#contact" },
];

export function SiteHeader({ dark, menuOpen, onMenuToggle, onThemeToggle, onNavigate, onContactOpen }: SiteHeaderProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  // Smart Scroll States
  const { scrollY } = useScroll();
  const [isHidden, setIsHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    
    setIsScrolled(latest > 50);

    // Hide on scroll down, show on scroll up
    if (latest > 150 && latest > previous && !menuOpen) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
  });

  const handleThemeToggle = (e: React.MouseEvent) => {
    if (!document.startViewTransition) {
      onThemeToggle();
      return;
    }

    const x = e.clientX;
    const y = e.clientY;
    const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    const transition = document.startViewTransition(() => {
      onThemeToggle();
    });

    transition.ready.then(() => {
      const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];
      document.documentElement.animate(
        { clipPath },
        { duration: 700, easing: "cubic-bezier(0.16, 1, 0.3, 1)", pseudoElement: "::view-transition-new(root)" }
      );
    });
  };

  return (
    <>
      <motion.header 
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" }
        }}
        animate={isHidden ? "hidden" : "visible"}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 z-50 flex w-full justify-center px-4 pt-4 sm:px-6 md:px-8 md:pt-6"
      >
        {/* 
          Main Header Pill 
          Delicate frosted glass, no heavy shadows.
        */}
        <motion.div 
          layout
          className={`flex w-full max-w-5xl items-center justify-between rounded-full bg-[color:color-mix(in_srgb,var(--bg)_70%,transparent)] transition-all duration-500 backdrop-blur-2xl backdrop-saturate-150 ${
            isScrolled ? "h-14 px-5" : "h-16 px-6"
          }`}
        >
          {/* Left: Logo - Refined, un-bolded, medium weight */}
          <div className="flex flex-1 justify-start">
            <a 
              className="relative z-10 font-sans text-[17px] font-medium tracking-tight text-[var(--ink)] no-underline transition-opacity hover:opacity-70" 
              href="#top"
            >
              Articulate<span className="text-[color:color-mix(in_srgb,var(--ink)_40%,transparent)]">X</span>
            </a>
          </div>

          {/* Center: Dynamic Navigation - Airy and light */}
          <div className="hidden flex-none md:block">
            <nav 
              className="relative flex items-center p-1" 
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {NAV_ITEMS.map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(event) => { if (item.name === "Contact") { event.preventDefault(); onContactOpen(); } }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  className="relative z-10 px-5 py-2 font-sans text-[13.5px] font-medium text-[var(--muted)] no-underline transition-colors hover:text-[var(--ink)]"
                >
                  <AnimatePresence>
                    {hoveredIndex === index && (
                      <motion.div
                        layoutId="nav-hover-bg"
                        className="absolute inset-0 -z-10 rounded-full bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)]"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </AnimatePresence>
                  <span>{item.name}</span>
                </a>
              ))}
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex flex-1 items-center justify-end gap-3">
            <button
              aria-label="Toggle theme"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[var(--muted)] transition-colors hover:bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] hover:text-[var(--ink)]"
              onClick={handleThemeToggle}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={dark ? "dark" : "light"}
                  initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  {dark ? <Sun size={16} strokeWidth={1.5} /> : <Moon size={16} strokeWidth={1.5} />}
                </motion.div>
              </AnimatePresence>
            </button>

            {/* Clean CTA */}
            <a
              href="#contact"
              onClick={(event) => { event.preventDefault(); onContactOpen(); }}
              className="group hidden h-9 items-center justify-center gap-1.5 rounded-full bg-white pl-4 pr-3 font-sans text-[13px] font-medium text-black no-underline transition-all duration-300 hover:bg-neutral-50 active:scale-[0.97] lg:flex"
            >
              Get started
              <ArrowRight className="h-3.5 w-3.5 opacity-70 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
            </a>

            {/* Mobile Menu Toggle */}
            <button
              className="flex h-9 cursor-pointer items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] px-4 font-sans text-[13px] font-medium text-[var(--ink)] transition-colors hover:bg-[color:color-mix(in_srgb,var(--ink)_8%,transparent)] md:hidden"
              onClick={onMenuToggle}
            >
              {menuOpen ? "Close" : "Menu"}
            </button>
          </div>
        </motion.div>
      </motion.header>

      {/* Mobile Menu Overlay - Delicate glass, un-bolded typography */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-center gap-6 bg-[color:color-mix(in_srgb,var(--bg)_80%,transparent)] px-[clamp(24px,5vw,80px)] backdrop-blur-3xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {NAV_ITEMS.map((item, i) => (
              <motion.a
                key={item.name}
                initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                onClick={(event) => { onNavigate(); if (item.name === "Contact") { event.preventDefault(); onContactOpen(); } }}
                // Refined, medium weight instead of heavy/bold
                className="font-sans text-[clamp(40px,10vw,64px)] font-medium tracking-tight text-[var(--ink)] no-underline transition-colors hover:text-[color:color-mix(in_srgb,var(--ink)_50%,transparent)]"
                href={item.href}
              >
                {item.name}
              </motion.a>
            ))}
            
            <motion.a
              initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: NAV_ITEMS.length * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onClick={(event) => { event.preventDefault(); onNavigate(); onContactOpen(); }}
              className="mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-white px-8 font-sans text-[14px] font-medium text-black no-underline transition-colors hover:bg-neutral-50 active:scale-[0.98]"
              href="#contact"
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}