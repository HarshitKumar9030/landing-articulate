"use client";

import { motion } from "framer-motion";
import { APP_CONTENT } from "@/constants";

export function Ticker() {
  return (
    /* 
      Zero borders. 
      We rely purely on the stark contrast between var(--ink) background 
      and var(--bg) text to create the section break. 
    */
    <div
      className="relative flex w-full overflow-hidden py-5"
      style={{ backgroundColor: "var(--deep-bg)", color: "var(--deep-ink)" }}
    >
      <motion.div
        className="flex w-max items-center font-mono text-[12px] font-medium uppercase tracking-[0.2em]"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 30, // Smooth, unhurried pace
        }}
      >
        {/* 
          Rendering 4 identical sets ensures the -50% translation 
          loops perfectly without visual snapping or whitespace.
        */}
        {[...APP_CONTENT.ticker, ...APP_CONTENT.ticker, ...APP_CONTENT.ticker, ...APP_CONTENT.ticker].map((word, idx) => (
          <div key={idx} className="flex items-center">
            <span>{word}</span>
            {/* Organic, color-mixed separator instead of hardcoded hex */}
            <div className="mx-8 h-1.5 w-1.5 rounded-full bg-(--deep-dot)" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
