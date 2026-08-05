"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Dices, Palette, SlidersHorizontal, X } from "lucide-react";
import { PALETTES, type Palette as PaletteType, type PaletteTokens } from "@/constants";

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

  return (
    <div className="fixed bottom-6 left-6 z-50 sm:bottom-8 sm:left-8">
      <AnimatePresence>
        {open && (
          <motion.section 
            className="absolute bottom-20 left-0 w-[min(340px,calc(100vw-48px))] overflow-hidden rounded-[2rem] bg-[color:color-mix(in_srgb,var(--bg)_85%,transparent)] p-6 backdrop-blur-3xl backdrop-saturate-150 ring-1 ring-inset ring-[color:color-mix(in_srgb,var(--ink)_10%,transparent)] shadow-[0_40px_80px_color-mix(in_srgb,var(--ink)_10%,transparent)]" 
            initial={{ opacity: 0, y: 20, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 15, scale: 0.95 }} 
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="mb-2 inline-flex items-center rounded-full bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] px-3 py-1 font-sans text-[11px] font-medium tracking-tight text-[var(--ink)]">
                  Palette Studio
                </div>
                <h2 className="font-sans text-[22px] font-medium tracking-tight text-[var(--ink)]">
                  Make it yours.
                </h2>
              </div>
              
              <button 
                onClick={() => setOpen(false)} 
                aria-label="Close palette studio" 
                className="grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] text-[var(--ink)] transition-colors hover:bg-[color:color-mix(in_srgb,var(--ink)_8%,transparent)]"
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>

            {/* Presets Grid */}
            <div className="mt-8 grid grid-cols-2 gap-3">
              {PALETTES.map((palette) => {
                const isActive = activePalette.id === palette.id;
                return (
                  <button 
                    key={palette.id} 
                    onClick={() => onPaletteChange(palette)} 
                    className={`flex flex-col rounded-[1.25rem] p-4 text-left transition-all duration-300 ${
                      isActive 
                        ? "bg-[var(--ink)] text-[var(--bg)] shadow-md" 
                        : "bg-[color:color-mix(in_srgb,var(--ink)_3%,transparent)] text-[var(--ink)] hover:bg-[color:color-mix(in_srgb,var(--ink)_6%,transparent)]"
                    }`}
                  >
                    <span className="flex gap-2">
                      {[palette.light["--bg"], palette.light["--ink"], palette.light["--primary"]].map((color, idx) => (
                        <i 
                          key={idx} 
                          className="h-4 w-4 rounded-full ring-1 ring-inset ring-black/10" 
                          style={{ backgroundColor: color }} 
                        />
                      ))}
                    </span>
                    <span className="mt-3 block font-sans text-[13px] font-medium tracking-tight">
                      {palette.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Fine Tune Section */}
            <div className="mt-8">
              <div className="mb-4 h-px w-full bg-[color:color-mix(in_srgb,var(--ink)_6%,transparent)]" />
              <p className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-[color:color-mix(in_srgb,var(--ink)_40%,transparent)]">
                Fine Tune
              </p>
              
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                {editableTokens.map(({ token, label }) => (
                  <label key={token} className="flex cursor-pointer items-center justify-between gap-2 font-sans text-[13px] font-medium text-[var(--ink)] transition-opacity hover:opacity-70">
                    {label}
                    {/* Hack to hide default browser styling for color inputs while keeping it native */}
                    <div className="relative h-6 w-10 overflow-hidden rounded-full ring-1 ring-inset ring-[color:color-mix(in_srgb,var(--ink)_15%,transparent)]">
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
            </div>

            {/* Actions */}
            <button 
              onClick={onRandomize} 
              className="group mt-8 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] font-sans text-[13px] font-medium text-[var(--ink)] transition-all hover:bg-[color:color-mix(in_srgb,var(--ink)_8%,transparent)] active:scale-[0.98]"
            >
              <Dices size={16} strokeWidth={1.5} className="transition-transform group-hover:rotate-12" /> 
              Randomize colors
            </button>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Dock Trigger Button */}
      <button 
        onClick={() => setOpen((prev) => !prev)} 
        className="group flex h-14 cursor-pointer items-center gap-3 rounded-full bg-[color:color-mix(in_srgb,var(--bg)_65%,transparent)] p-2 pr-4 backdrop-blur-2xl backdrop-saturate-150 ring-1 ring-inset ring-[color:color-mix(in_srgb,var(--ink)_10%,transparent)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[color:color-mix(in_srgb,var(--bg)_85%,transparent)] active:scale-[0.96]"
      >
        <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--ink)] text-[var(--bg)] transition-transform duration-500 group-hover:rotate-12">
          <Palette size={18} strokeWidth={1.5} />
        </span>
        <span className="hidden font-sans text-[14px] font-medium tracking-tight text-[var(--ink)] sm:block">
          Studio
        </span>
        <SlidersHorizontal size={14} strokeWidth={2} className="hidden text-[color:color-mix(in_srgb,var(--ink)_40%,transparent)] transition-colors group-hover:text-[var(--ink)] sm:block" />
      </button>
    </div>
  );
}