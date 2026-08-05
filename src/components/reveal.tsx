"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <motion.div className={className} initial={false} whileInView={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}
