"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "next-themes";
import { usePalette } from "./theme-provider";
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
import { CoursesOffered } from "./courses-offered";
import { Testimonials } from "./testimonials";
import { track } from "@vercel/analytics";

export function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  
  const { palette, setPalette, updatePaletteToken, randomizePalette, activeTokens } = usePalette();
  const { resolvedTheme, setTheme } = useTheme();
  
  const { scrollYProgress } = useScroll();
  const orbit = useTransform(scrollYProgress, [0, 0.45], [0, 90]);
  const dark = mounted ? resolvedTheme === "dark" : false;

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

  const handleThemeToggle = () => {
    setTheme(dark ? "light" : "dark");
  };

  const openContact = () => {
    track("contact_opened");
    setContactOpen(true);
  };

  const applyPalette = (nextPalette: any) => {
    track("palette_selected", { palette: nextPalette.id });
    setPalette(nextPalette);
  };

  const handleRandomize = () => {
    track("palette_randomized");
    randomizePalette();
  };

  return (
    <main 
      // Changed overflow-hidden to overflow-x-hidden to prevent vertical clipping
      className="relative min-h-screen overflow-x-hidden"
    >
      <EntryLoader />
      <div className="noise pointer-events-none fixed inset-0 z-10 opacity-[.025]" />
      
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
      <CoursesOffered onContactOpen={openContact} />
      <Programs onContactOpen={openContact} />
      <Testimonials />
      <QuoteSection />
      <ConversationCta onContactOpen={openContact} />
      {/* <BrandFooterReveal /> */}
      <SiteFooter onContactOpen={openContact} />
      <ContactDock onOpen={openContact} />
      <PaletteStudio activePalette={palette} tokens={activeTokens} onPaletteChange={applyPalette} onTokenChange={updatePaletteToken} onRandomize={handleRandomize} />
      <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
    </main>
  );
}
