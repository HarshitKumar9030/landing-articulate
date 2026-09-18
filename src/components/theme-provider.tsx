"use client";

import { createContext, useContext, useEffect, useState, type ReactNode, type CSSProperties } from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { PALETTES, type Palette, type PaletteTokens, createRandomPalette } from "@/constants";

const PALETTE_STORAGE_KEY = "articulatex.palette.v1";
const paletteTokenKeys: Array<keyof PaletteTokens> = [
  "--bg", "--surface", "--ink", "--muted", "--line", "--primary", "--violet", "--tint", "--deep-bg", "--deep-ink", "--deep-dot"
];

function isPalette(value: unknown): value is Palette {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<Palette>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.name === "string" &&
    paletteTokenKeys.every(
      (key) => typeof candidate.light?.[key] === "string" && typeof candidate.dark?.[key] === "string"
    )
  );
}

type PaletteContextType = {
  palette: Palette;
  setPalette: (palette: Palette) => void;
  updatePaletteToken: (token: keyof PaletteTokens, value: string) => void;
  randomizePalette: () => void;
  activeTokens: PaletteTokens;
};

const PaletteContext = createContext<PaletteContextType | null>(null);

export function usePalette() {
  const context = useContext(PaletteContext);
  if (!context) {
    throw new Error("usePalette must be used within a PaletteProvider");
  }
  return context;
}

function PaletteProviderInner({ children }: { children: ReactNode }) {
  const [palette, setPalette] = useState<Palette>(PALETTES[0]);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    try {
      const savedPalette = window.localStorage.getItem(PALETTE_STORAGE_KEY);
      if (savedPalette) {
        const parsedPalette: unknown = JSON.parse(savedPalette);
        if (isPalette(parsedPalette)) setPalette(parsedPalette);
      }
    } catch {
      window.localStorage.removeItem(PALETTE_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    window.localStorage.setItem(PALETTE_STORAGE_KEY, JSON.stringify(palette));
  }, [palette, mounted]);

  const dark = mounted ? resolvedTheme === "dark" : false;
  const activeTokens = dark ? palette.dark : palette.light;

  const updatePaletteToken = (token: keyof PaletteTokens, value: string) => {
    const mode = dark ? "dark" : "light";
    setPalette((current) => ({
      ...current,
      id: "custom",
      name: "Custom",
      [mode]: { ...current[mode], [token]: value },
    }));
  };

  const randomizePalette = () => {
    setPalette(createRandomPalette());
  };

  return (
    <PaletteContext.Provider value={{ palette, setPalette, updatePaletteToken, randomizePalette, activeTokens }}>
      <div 
        style={mounted ? (activeTokens as CSSProperties) : undefined} 
        className="min-h-screen w-full bg-[var(--bg)] text-[var(--ink)] transition-colors duration-700"
      >
        {children}
      </div>
    </PaletteContext.Provider>
  );
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <PaletteProviderInner>{children}</PaletteProviderInner>
    </NextThemesProvider>
  );
}