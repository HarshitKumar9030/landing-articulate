"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Send, X, MessageCircle } from "lucide-react";

type ContactDialogProps = { open: boolean; onClose: () => void };

export function ContactDialog({ open, onClose }: ContactDialogProps) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  const close = () => {
    setSent(false);
    setError("");
    onClose();
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div 
          className="fixed inset-0 z-[70] flex items-end justify-center bg-[color:color-mix(in_srgb,var(--ink)_20%,transparent)] p-3 backdrop-blur-xl sm:items-center sm:p-6 md:p-12" 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          onMouseDown={close}
        >
          <motion.section 
            role="dialog" 
            aria-modal="true" 
            aria-labelledby="contact-title" 
            // Removed the double-glass and gave it a solid ground for better contrast
            className="relative grid max-h-[92vh] w-full max-w-[1000px] overflow-y-auto overflow-x-hidden rounded-[2rem] bg-[var(--bg)] shadow-[0_40px_100px_color-mix(in_srgb,var(--ink)_20%,transparent)] md:grid-cols-[0.8fr_1.2fr] md:rounded-[3rem]" 
            initial={{ opacity: 0, y: 40, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 20, scale: 0.95 }} 
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} 
            onMouseDown={(event) => event.stopPropagation()}
          >
            {/* Left Panel - Stark Editorial Contrast */}
            <aside className="relative flex flex-col overflow-hidden bg-[var(--ink)] px-8 py-12 text-[var(--bg)] sm:px-12 sm:py-16">
              
              {/* Organic Asymmetric Glow */}
              <div className="pointer-events-none absolute -right-[20%] -top-[10%] h-[120%] w-[120%] bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--bg)_12%,transparent)_0%,transparent_60%)] blur-2xl" />
              
              {/* Hand-drawn Accent Doodle */}
              <motion.div 
                initial={{ opacity: 0, rotate: -20, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
                className="absolute left-[10%] z-50 top-[10%] text-[color:color-mix(in_srgb,var(--bg)_10%,transparent)]"
              >
                <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 80 C 20 20, 80 20, 80 80 C 80 120, 20 60, 40 40" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>

              <div className="relative z-10 flex h-full flex-col">
                <div className="mb-12 inline-flex z-0 items-center gap-2 rounded-full bg-[color:color-mix(in_srgb,var(--bg)_8%,transparent)] px-4 py-1.5 font-sans text-[12px] font-medium tracking-tight text-[var(--bg)]">
                  The next step
                </div>
                
                <h2 id="contact-title" className="mt-3 font-sans text-[clamp(48px,5vw,72px)] font-medium leading-[0.9] tracking-tighter">
                  Let’s make<br />
                  <span className="text-[color:color-mix(in_srgb,var(--bg)_40%,transparent)]">it land.</span>
                </h2>
                
                <p className="mt-8 max-w-[260px] text-balance font-sans text-[16px] leading-relaxed text-[color:color-mix(in_srgb,var(--bg)_60%,transparent)]">
                  Tell us what you want to say. We’ll help you make it impossible to miss.
                </p>
                
                <div className="mt-auto hidden pt-12 md:block">
                  <div className="mb-8 h-px w-full bg-[color:color-mix(in_srgb,var(--bg)_8%,transparent)]" />
                  <div className="font-sans text-[13px] leading-relaxed text-[color:color-mix(in_srgb,var(--bg)_50%,transparent)]">
                    New Delhi · Worldwide<br />
                    <a href="mailto:hello@articulatex.in" className="text-[var(--bg)] no-underline transition-opacity hover:opacity-70">
                      hello@articulatex.in
                    </a>
                  </div>
                </div>
              </div>
            </aside>

            {/* Right Panel - Borderless, Soft Form */}
            <div className="relative flex flex-col bg-[var(--bg)] px-8 py-12 sm:px-12 sm:py-16">
              
              <button 
                aria-label="Close contact form" 
                onClick={close} 
                className="absolute right-6 top-6 z-10 grid h-12 w-12 cursor-pointer place-items-center rounded-full bg-[color:color-mix(in_srgb,var(--ink)_3%,transparent)] text-[var(--ink)] transition-colors hover:bg-[color:color-mix(in_srgb,var(--ink)_6%,transparent)]"
              >
                <X size={20} strokeWidth={1.5} />
              </button>

              {sent ? (
                <motion.div 
                  className="flex h-full min-h-[400px] flex-col justify-center" 
                  initial={{ opacity: 0, scale: 0.98 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="mb-10 flex h-16 w-16 items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] text-[var(--ink)]">
                    {/* Cinematic SVG Path Reveal for Success */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <motion.path 
                        initial={{ pathLength: 0 }} 
                        animate={{ pathLength: 1 }} 
                        transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                        d="M20 6L9 17l-5-5" 
                      />
                    </svg>
                  </div>
                  
                  <h3 className="font-sans text-[clamp(40px,4vw,56px)] font-medium leading-[0.9] tracking-tighter text-[var(--ink)]">
                    We’ll be<br />in touch.
                  </h3>
                  
                  <p className="mt-6 max-w-[320px] text-balance font-sans text-[16px] leading-relaxed text-[var(--muted)]">
                    Thanks for reaching out. You’ll hear from the ArticulateX team shortly to discuss next steps.
                  </p>
                  
                  <button 
                    onClick={close} 
                    className="group mt-12 inline-flex w-fit items-center gap-2 rounded-full bg-[color:color-mix(in_srgb,var(--ink)_3%,transparent)] px-6 py-3 font-sans text-sm font-medium text-[var(--ink)] transition-colors hover:bg-[color:color-mix(in_srgb,var(--ink)_6%,transparent)]"
                  >
                    Back to the site 
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </motion.div>
              ) : (
                <form 
                  onSubmit={async (event) => { event.preventDefault(); setSending(true); setError(""); const form = new FormData(event.currentTarget); try { const response = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: form.get("name"), email: form.get("email"), interest: form.get("interest"), message: form.get("message") }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error || "Unable to send your inquiry."); setSent(true); } catch (submissionError) { setError(submissionError instanceof Error ? submissionError.message : "Unable to send your inquiry."); } finally { setSending(false); } }}
                  className="flex h-full flex-col"
                >
                  <h3 className="font-sans text-[28px] font-medium tracking-tight text-[var(--ink)] md:text-[36px]">
                    What are we<br />working on?
                  </h3>
                  
                  <div className="mt-12 grid gap-8">
                    
                    {/* Borderless Input Block */}
                    <label className="group grid gap-3 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-[color:color-mix(in_srgb,var(--ink)_40%,transparent)]">
                      Your Name
                      <input 
                        required 
                        name="name" 
                        placeholder="Jane Smith" 
                        // Zero resting borders. Just soft color-mix shapes.
                        className="h-14 rounded-full bg-[color:color-mix(in_srgb,var(--ink)_3%,transparent)] px-6 font-sans text-[15px] font-medium text-[var(--ink)] outline-none transition-all placeholder:font-normal placeholder:text-[color:color-mix(in_srgb,var(--ink)_30%,transparent)] focus:bg-[color:color-mix(in_srgb,var(--ink)_5%,transparent)] focus:ring-1 focus:ring-inset focus:ring-[color:color-mix(in_srgb,var(--ink)_15%,transparent)] hover:bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)]" 
                      />
                    </label>
                    
                    <label className="group grid gap-3 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-[color:color-mix(in_srgb,var(--ink)_40%,transparent)]">
                      Email Address
                      <input 
                        required 
                        type="email" 
                        name="email" 
                        placeholder="jane@company.com" 
                        className="h-14 rounded-full bg-[color:color-mix(in_srgb,var(--ink)_3%,transparent)] px-6 font-sans text-[15px] font-medium text-[var(--ink)] outline-none transition-all placeholder:font-normal placeholder:text-[color:color-mix(in_srgb,var(--ink)_30%,transparent)] focus:bg-[color:color-mix(in_srgb,var(--ink)_5%,transparent)] focus:ring-1 focus:ring-inset focus:ring-[color:color-mix(in_srgb,var(--ink)_15%,transparent)] hover:bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)]" 
                      />
                    </label>
                    
                    {/* Tactile Chip Selector */}
                    <fieldset className="mt-2">
                      <legend className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-[color:color-mix(in_srgb,var(--ink)_40%,transparent)]">
                        I’m interested in
                      </legend>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {["Speaking coaching", "Team workshop", "A keynote", "Something else"].map((option) => (
                          <label key={option} className="cursor-pointer">
                            <input 
                              className="peer sr-only" 
                              type="radio" 
                              name="interest" 
                              value={option} 
                              defaultChecked={option === "Speaking coaching"} 
                            />
                            <span className="block rounded-full bg-[color:color-mix(in_srgb,var(--ink)_3%,transparent)] px-5 py-3 font-sans text-[13px] font-medium text-[var(--ink)] transition-all peer-checked:bg-[var(--ink)] peer-checked:text-[var(--bg)] hover:bg-[color:color-mix(in_srgb,var(--ink)_6%,transparent)] peer-checked:hover:bg-[var(--ink)]">
                              {option}
                            </span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                    
                    <label className="group grid gap-3 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-[color:color-mix(in_srgb,var(--ink)_40%,transparent)]">
                      A few words
                      <textarea 
                        required 
                        name="message" 
                        rows={3} 
                        placeholder="What do you need to make land?" 
                        className="resize-none rounded-[1.5rem] bg-[color:color-mix(in_srgb,var(--ink)_3%,transparent)] p-6 font-sans text-[15px] font-medium text-[var(--ink)] outline-none transition-all placeholder:font-normal placeholder:text-[color:color-mix(in_srgb,var(--ink)_30%,transparent)] focus:bg-[color:color-mix(in_srgb,var(--ink)_5%,transparent)] focus:ring-1 focus:ring-inset focus:ring-[color:color-mix(in_srgb,var(--ink)_15%,transparent)] hover:bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)]" 
                      />
                    </label>
                  </div>
                  
                  {error && <p className="mt-5 text-sm text-red-500">{error}</p>}
                  <button 
                    type="submit" 
                    disabled={sending}
                    className="group mt-12 inline-flex h-14 w-full items-center justify-center gap-3 rounded-full bg-[var(--ink)] px-8 font-sans text-[14px] font-medium text-[var(--bg)] transition-transform hover:scale-[1.02] active:scale-[0.98] sm:w-fit"
                  >
                    {sending ? "Sending…" : "Send inquiry"}
                    <Send size={15} strokeWidth={2} className="opacity-80 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </button>
                </form>
              )}
            </div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function ContactDock({ onOpen }: { onOpen: () => void }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <motion.div 
      className="group fixed bottom-6 right-6 z-40 flex items-center gap-2 sm:bottom-8 sm:right-8" 
      initial={{ opacity: 0, y: 20, scale: 0.9 }} 
      animate={{ opacity: 1, y: 0, scale: 1 }} 
      transition={{ delay: 0.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <button 
        onClick={onOpen} 
        className="flex h-14 cursor-pointer items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--bg)_65%,transparent)] p-2 backdrop-blur-2xl backdrop-saturate-150 ring-1 ring-inset ring-[color:color-mix(in_srgb,var(--ink)_10%,transparent)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[color:color-mix(in_srgb,var(--bg)_85%,transparent)] active:scale-[0.96]"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--ink)] text-[var(--bg)]">
          <MessageCircle size={18} strokeWidth={1.5} />
        </div>
        
        <div className="grid w-0 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-[150px]">
          <span className="truncate whitespace-nowrap pl-3 pr-2 font-sans text-[14px] font-medium tracking-tight text-[var(--ink)]">
            Start a conversation
          </span>
        </div>
      </button>

      <div className="grid w-0 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-10">
        <button 
          onClick={(e) => { e.stopPropagation(); setDismissed(true); }}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--bg)_65%,transparent)] text-[var(--ink)] backdrop-blur-2xl backdrop-saturate-150 ring-1 ring-inset ring-[color:color-mix(in_srgb,var(--ink)_10%,transparent)] transition-colors hover:bg-[color:color-mix(in_srgb,var(--bg)_85%,transparent)]"
          aria-label="Dismiss dock"
        >
          <X size={16} strokeWidth={1.5} />
        </button>
      </div>
    </motion.div>
  );
}
