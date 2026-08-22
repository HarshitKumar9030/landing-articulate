"use client";

import { useEffect, useState } from "react";
import { Contrast, Pause, Play, Square, Type, Volume2 } from "lucide-react";

type AccessibilityToolsProps = {
  readerText: string;
};

export function AccessibilityTools({ readerText }: AccessibilityToolsProps) {
  const [largeText, setLargeText] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  useEffect(() => {
    setLargeText(window.localStorage.getItem("articulatex.large-text") === "true");
    setReducedMotion(window.localStorage.getItem("articulatex.reduced-motion") === "true");
    setHighContrast(window.localStorage.getItem("articulatex.high-contrast") === "true");
    setSpeechSupported("speechSynthesis" in window);
    setHydrated(true);
    return () => window.speechSynthesis?.cancel();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.dataset.largeText = String(largeText);
    document.documentElement.dataset.reducedMotion = String(reducedMotion);
    document.documentElement.dataset.highContrast = String(highContrast);
    window.localStorage.setItem("articulatex.large-text", String(largeText));
    window.localStorage.setItem("articulatex.reduced-motion", String(reducedMotion));
    window.localStorage.setItem("articulatex.high-contrast", String(highContrast));
  }, [highContrast, hydrated, largeText, reducedMotion]);

  const read = () => {
    if (!speechSupported) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(readerText);
    utterance.rate = 0.95;
    utterance.onend = () => { setSpeaking(false); setPaused(false); };
    utterance.onerror = () => { setSpeaking(false); setPaused(false); };
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
    setPaused(false);
  };

  const togglePause = () => {
    if (!speaking) return;
    if (paused) {
      window.speechSynthesis.resume();
      setPaused(false);
    } else {
      window.speechSynthesis.pause();
      setPaused(true);
    }
  };

  const stop = () => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    setPaused(false);
  };

  return (
    <div className="mt-8 border-t border-[color-mix(in_srgb,var(--bg)_12%,transparent)] pt-6">
      <div className="flex items-center gap-2 font-sans text-[13px] font-medium text-[color-mix(in_srgb,var(--bg)_65%,transparent)]">
        <Type className="size-4" /> Accessibility
      </div>
      <div className="mt-3 grid gap-2">
        <button type="button" aria-pressed={largeText} onClick={() => setLargeText((value) => !value)} className={`flex items-center justify-between rounded-xl px-3 py-2 text-left font-sans text-[12px] text-[var(--bg)] transition-colors ${largeText ? "bg-[var(--primary)]" : "bg-[color-mix(in_srgb,var(--bg)_8%,transparent)] hover:bg-[color-mix(in_srgb,var(--bg)_14%,transparent)]"}`}>
          <span>Large text</span><span className="text-[color-mix(in_srgb,var(--bg)_55%,transparent)]">{largeText ? "On" : "Off"}</span>
        </button>
        <button type="button" aria-pressed={reducedMotion} onClick={() => setReducedMotion((value) => !value)} className={`flex items-center justify-between rounded-xl px-3 py-2 text-left font-sans text-[12px] text-[var(--bg)] transition-colors ${reducedMotion ? "bg-[var(--primary)]" : "bg-[color-mix(in_srgb,var(--bg)_8%,transparent)] hover:bg-[color-mix(in_srgb,var(--bg)_14%,transparent)]"}`}>
          <span>Reduce motion</span><span className="text-[color-mix(in_srgb,var(--bg)_55%,transparent)]">{reducedMotion ? "On" : "Off"}</span>
        </button>
        <button type="button" aria-pressed={highContrast} onClick={() => setHighContrast((value) => !value)} className={`flex items-center justify-between rounded-xl px-3 py-2 text-left font-sans text-[12px] text-[var(--bg)] transition-colors ${highContrast ? "bg-[var(--primary)]" : "bg-[color-mix(in_srgb,var(--bg)_8%,transparent)] hover:bg-[color-mix(in_srgb,var(--bg)_14%,transparent)]"}`}>
          <span className="flex items-center gap-2"><Contrast className="size-3.5" />High contrast</span><span className="text-[color-mix(in_srgb,var(--bg)_55%,transparent)]">{highContrast ? "On" : "Off"}</span>
        </button>
      </div>
      <div className="mt-4 flex items-center gap-2 font-sans text-[12px] text-[color-mix(in_srgb,var(--bg)_55%,transparent)]"><Volume2 className="size-3.5" /> Read the landing page</div>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={read} disabled={!speechSupported} className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[var(--bg)] px-3 py-2 font-sans text-[12px] font-medium text-[var(--ink)] disabled:opacity-40"><Play className="size-3.5 fill-current" /> Read</button>
        <button type="button" onClick={togglePause} disabled={!speaking} aria-label={paused ? "Resume reading" : "Pause reading"} className="grid size-8 place-items-center rounded-full bg-[color-mix(in_srgb,var(--bg)_10%,transparent)] text-[var(--bg)] disabled:opacity-40">{paused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}</button>
        <button type="button" onClick={stop} disabled={!speaking} aria-label="Stop reading" className="grid size-8 place-items-center rounded-full bg-[color-mix(in_srgb,var(--bg)_10%,transparent)] text-[var(--bg)] disabled:opacity-40"><Square className="size-3.5" /></button>
      </div>
      {!speechSupported && <p className="mt-2 font-sans text-[11px] text-[color:color-mix(in_srgb,var(--bg)_55%,transparent)]">Read aloud is not available in this browser.</p>}
    </div>
  );
}
