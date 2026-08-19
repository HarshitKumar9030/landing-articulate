"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "next-themes";
import { Hero } from "./hero";
import { Manifesto } from "./manifesto";
import { Programs } from "./programs";
import { QuoteSection } from "./quote-section";
import { SiteFooter } from "./site-footer";
import { BrandFooterReveal } from "./brand-footer-reveal";
import { SiteHeader } from "./site-header";
import { Ticker } from "./ticker";
import { ContactDialog, ContactDock } from "./contact-dialog";
import { FocusAreas } from "./focus-areas";
import { MethodSection } from "./method-section";
import { ConversationCta } from "./conversation-cta";
import { EntryLoader } from "./entry-loader";
import { PaletteStudio } from "./palette-studio";
import { AboutUs } from "./about-us";
import { createRandomPalette, PALETTES, type Palette, type PaletteTokens } from "@/constants";
import { track } from "@vercel/analytics";

const PALETTE_STORAGE_KEY = "articulatex.palette.v1";
const paletteTokenKeys: Array<keyof PaletteTokens> = ["--bg", "--surface", "--ink", "--muted", "--line", "--primary", "--violet", "--tint", "--deep-bg", "--deep-ink", "--deep-dot"];

function isPalette(value: unknown): value is Palette {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<Palette>;
  return typeof candidate.id === "string" && typeof candidate.name === "string" && paletteTokenKeys.every((key) => typeof candidate.light?.[key] === "string" && typeof candidate.dark?.[key] === "string");
}

export function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [palette, setPalette] = useState<Palette>(PALETTES[0]);
  const [paletteHydrated, setPaletteHydrated] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  
  const { scrollYProgress } = useScroll();
  const orbit = useTransform(scrollYProgress, [0, 0.45], [0, 90]);
  const dark = mounted ? resolvedTheme === "dark" : false;
  const activeTokens = dark ? palette.dark : palette.light;

  useEffect(() => {
    setMounted(true);

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      // These triggers now match the classNames added to the components
      gsap.to(".orb-one", { y: -60, x: 32, scrollTrigger: { trigger: ".manifesto", start: "top bottom", end: "bottom top", scrub: 1.3 } });
      gsap.to(".orb-two", { y: 85, x: -48, scrollTrigger: { trigger: ".programs", start: "top bottom", end: "bottom top", scrub: 1.1 } });
      
      gsap.utils.toArray<HTMLElement>(".program-row").forEach((row) => 
        gsap.fromTo(row, 
          { xPercent: -7, opacity: 0 }, 
          { xPercent: 0, opacity: 1, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: row, start: "top 86%" } }
        )
      );
    });
    
    return () => context.revert();
  }, []);

  useEffect(() => {
    try {
      const savedPalette = window.localStorage.getItem(PALETTE_STORAGE_KEY);
      if (savedPalette) {
        const parsedPalette: unknown = JSON.parse(savedPalette);
        if (isPalette(parsedPalette)) setPalette(parsedPalette);
      }
    } catch {
      window.localStorage.removeItem(PALETTE_STORAGE_KEY);
    } finally {
      setPaletteHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!paletteHydrated) return;
    window.localStorage.setItem(PALETTE_STORAGE_KEY, JSON.stringify(palette));
  }, [palette, paletteHydrated]);

  const handleThemeToggle = () => {
    setTheme(dark ? "light" : "dark");
  };

  const updatePaletteToken = (token: keyof PaletteTokens, value: string) => {
    const mode = dark ? "dark" : "light";
    setPalette((current) => ({ ...current, id: "custom", name: "Custom", [mode]: { ...current[mode], [token]: value } }));
  };

  const openContact = () => {
    track("contact_opened");
    setContactOpen(true);
  };

  const applyPalette = (nextPalette: Palette) => {
    track("palette_selected", { palette: nextPalette.id });
    setPalette(nextPalette);
  };

  const randomizePalette = () => {
    track("palette_randomized");
    setPalette(createRandomPalette());
  };

  return (
    <main 
      // Changed overflow-hidden to overflow-x-hidden to prevent vertical clipping
      className={`
        ${dark ? "dark" : "light"} 
        site relative min-h-screen overflow-x-hidden 
        bg-(--bg) text-(--ink) 
        transition-colors duration-700
      `}
      style={activeTokens as CSSProperties}
    >
      <EntryLoader />
      <div className="noise pointer-events-none fixed inset-0 z-10 opacity-[.025]" />
      
      <motion.div 
        // Fixed z-index to -z-10 (from -z-1)
        className="fixed inset-0 -z-10 bg-[#0b0f1b]" 
        animate={{ clipPath: dark ? "circle(0% at 92% 7%)" : "circle(150% at 92% 7%)" }} 
        transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }} 
      />
      
      <SiteHeader 
        dark={dark} 
        menuOpen={menuOpen} 
        onThemeToggle={handleThemeToggle} 
        onMenuToggle={() => setMenuOpen((value) => !value)} 
        onNavigate={() => setMenuOpen(false)} 
        onContactOpen={openContact}
      />
      
      <Hero orbit={orbit} dark={dark} />
      <Ticker />
      <FocusAreas onContactOpen={openContact} />
      <Manifesto />
      <AboutUs />
      <MethodSection />
      <Programs onContactOpen={openContact} />
      <QuoteSection />
      <ConversationCta onContactOpen={openContact} />
      {/* <BrandFooterReveal /> */}
      <SiteFooter onContactOpen={openContact} />
      <ContactDock onOpen={openContact} />
      <PaletteStudio activePalette={palette} tokens={activeTokens} onPaletteChange={applyPalette} onTokenChange={updatePaletteToken} onRandomize={randomizePalette} />
      <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
    </main>
  );
}
