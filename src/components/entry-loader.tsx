"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const greetings = [
  "Hello.",
  "Hola.",
  "Bonjour.",
  "Ciao.",
  "Konnichiwa.",
  "Namaste.",
  "ArticulateX." // Added the period to match the editorial rhythm
];

export function EntryLoader() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (index === greetings.length - 1) {
      // Hold on the heavy brand mark, then fade the entire wall away
      const exitTimer = setTimeout(() => {
        setVisible(false);
      }, 1200);
      return () => clearTimeout(exitTimer);
    } else {
      // Very fast, sharp interval for the muted greetings
      const timer = setTimeout(() => {
        setIndex((prev) => prev + 1);
      }, 250); 
      return () => clearTimeout(timer);
    }
  }, [index]);

  const isLast = index === greetings.length - 1;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader-overlay"
          className="fixed inset-0 z-[999] flex items-center justify-center bg-[var(--bg)]"
          exit={{ 
            opacity: 0, 
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
          }}
        >
          <div className="relative flex h-[100px] w-full items-center justify-center overflow-hidden">
            <AnimatePresence mode="popLayout">
              <motion.h1
                key={greetings[index]}
                initial={{ opacity: 0, y: isLast ? 20 : 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ 
                  // The greetings snap fast; the final brand name lands with heavy physics
                  duration: isLast ? 0.8 : 0.2, 
                  ease: isLast ? [0.16, 1, 0.3, 1] : "easeOut" 
                }}
                className={`absolute font-sans text-[clamp(32px,5vw,72px)] tracking-tight ${
                  isLast 
                    ? "font-semibold text-[var(--ink)]" // The Highlight: Pure ink, heavier weight
                    : "font-medium text-[color:color-mix(in_srgb,var(--ink)_40%,transparent)]" // The Build-up: Muted, ghosted text
                }`}
              >
                {greetings[index]}
              </motion.h1>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}