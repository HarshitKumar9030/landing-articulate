"use client";

import { useEffect, useState, useRef, type ReactNode, type MouseEvent as ReactMouseEvent } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, Send, X, MessageCircle } from "lucide-react";

// ----------------------------------------------------------------------
// Micro-interaction: Magnetic Physics Wrapper
// ----------------------------------------------------------------------
function Magnetic({ children, strength = 20 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * (strength / 100));
    y.set((e.clientY - centerY) * (strength / 100));
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="flex w-full items-center justify-center sm:w-auto"
    >
      {children}
    </motion.div>
  );
}

type ContactDialogProps = { open: boolean; onClose: () => void };

export function ContactDialog({ open, onClose }: ContactDialogProps) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // Lock body scroll to prevent double-scrolling issues
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Handle escape key
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
      {open && (
        <motion.div 
          className="fixed inset-0 z-[70] flex items-end justify-center bg-[color:color-mix(in_srgb,var(--ink)_60%,transparent)] p-0 backdrop-blur-2xl sm:items-center sm:p-6 md:p-12" 
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
            className="relative flex h-full max-h-[90vh] w-full max-w-[1200px] flex-col overflow-hidden bg-[var(--bg)] sm:rounded-[2rem] md:flex-row md:rounded-[3rem]" 
            initial={{ opacity: 0, y: 40, scale: 0.98 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 20, scale: 0.98 }} 
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} 
            onMouseDown={(event) => event.stopPropagation()}
          >
            {/* Left Panel - Inverted Editorial Block */}
            <aside className="relative flex flex-col bg-[var(--ink)] p-8 text-[var(--bg)] md:w-5/12 md:p-16 lg:p-20">
              <div className="relative z-10 flex h-full flex-col">
                {/* <div className="mb-12 flex items-center gap-4 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--bg)_50%,transparent)]">
                  <span className="h-px w-8 bg-[color:color-mix(in_srgb,var(--bg)_20%,transparent)]" />
                  The Brief
                </div> */}
                
                <h2 id="contact-title" className="font-sans text-[clamp(40px,5vw,72px)] font-medium leading-[0.95] tracking-tighter">
                  Let’s make<br />
                  <span className="text-[color:color-mix(in_srgb,var(--bg)_40%,transparent)]">it land.</span>
                </h2>
                
                <p className="mt-8 max-w-[280px] text-balance font-sans text-[16px] leading-relaxed text-[color:color-mix(in_srgb,var(--bg)_60%,transparent)]">
                  Tell us what you want to say. We’ll help you make it impossible to miss.
                </p>
                
                <div className="mt-auto hidden pt-12 md:block">
                  <div className="font-sans text-[13px] leading-relaxed text-[color:color-mix(in_srgb,var(--bg)_50%,transparent)]">
                    New Delhi · Worldwide<br />
                    <a href="mailto:hello@articulatex.in" className="text-[var(--bg)] no-underline transition-opacity hover:opacity-70">
                      hello@articulatex.in
                    </a>
                  </div>
                </div>
              </div>
            </aside>

            {/* 
              Right Panel - Form 
              CRITICAL LENIS FIX: data-lenis-prevent stops Lenis from hijacking the wheel 
              events here, allowing native scrolling inside the modal.
            */}
            <div 
              data-lenis-prevent="true"
              className="relative flex flex-col overflow-y-auto bg-[var(--bg)] p-8 md:w-7/12 md:p-16 lg:p-20"
            >
              {/* Close Button - Magnetic & Borderless */}
              <div className="absolute right-6 top-6 z-10 hidden md:block">
                <Magnetic strength={15}>
                  <button 
                    aria-label="Close contact form" 
                    onClick={close} 
                    className="grid h-12 w-12 cursor-pointer place-items-center rounded-full bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] text-[var(--ink)] transition-colors hover:bg-[color:color-mix(in_srgb,var(--ink)_8%,transparent)] active:scale-95"
                  >
                    <X size={20} strokeWidth={1.5} />
                  </button>
                </Magnetic>
              </div>

              {/* Mobile Close Button */}
              <button 
                aria-label="Close contact form" 
                onClick={close} 
                className="absolute right-6 top-6 z-10 grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] text-[var(--ink)] md:hidden"
              >
                <X size={18} strokeWidth={1.5} />
              </button>

              {sent ? (
                <motion.div 
                  className="flex h-full min-h-[400px] flex-col justify-center" 
                  initial={{ opacity: 0, filter: "blur(8px)" }} 
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h3 className="font-sans text-[clamp(40px,4vw,56px)] font-medium leading-[0.9] tracking-tighter text-[var(--ink)]">
                    Received.
                  </h3>
                  
                  <p className="mt-6 max-w-[320px] text-balance font-sans text-[16px] leading-relaxed text-[var(--muted)]">
                    Thanks for reaching out. The ArticulateX team will review your brief and be in touch shortly.
                  </p>
                  
                  <button 
                    onClick={close} 
                    className="group mt-12 inline-flex w-fit items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--ink)]"
                  >
                    Return to site 
                    <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </motion.div>
              ) : (
                <form 
                  onSubmit={async (event) => { 
                    event.preventDefault(); 
                    setSending(true); 
                    setError(""); 
                    const form = new FormData(event.currentTarget); 
                    try { 
                      const response = await fetch("/api/contact", { 
                        method: "POST", 
                        headers: { "content-type": "application/json" }, 
                        body: JSON.stringify({ name: form.get("name"), email: form.get("email"), interest: form.get("interest"), message: form.get("message") }) 
                      }); 
                      const data = await response.json(); 
                      if (!response.ok) throw new Error(data.error || "Unable to send your inquiry."); 
                      setSent(true); 
                    } catch (submissionError) { 
                      setError(submissionError instanceof Error ? submissionError.message : "Unable to send your inquiry."); 
                    } finally { 
                      setSending(false); 
                    } 
                  }}
                  className="flex h-full flex-col"
                >
                  <h3 className="font-sans text-[32px] font-medium tracking-tight text-[var(--ink)] md:text-[40px]">
                    What are we<br />working on?
                  </h3>
                  
                  <div className="mt-12 grid gap-8">
                    {/* Pure contrast inputs. No rings, no borders. */}
                    <label className="group grid gap-3 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-[color:color-mix(in_srgb,var(--ink)_40%,transparent)]">
                      Your Name
                      <input 
                        required 
                        name="name" 
                        placeholder="Jane Smith" 
                        className="h-14 rounded-2xl bg-[color:color-mix(in_srgb,var(--ink)_3%,transparent)] px-5 font-sans text-[15px] font-medium text-[var(--ink)] outline-none transition-all placeholder:font-normal placeholder:text-[color:color-mix(in_srgb,var(--ink)_30%,transparent)] focus:bg-[color:color-mix(in_srgb,var(--ink)_6%,transparent)] hover:bg-[color:color-mix(in_srgb,var(--ink)_5%,transparent)]" 
                      />
                    </label>
                    
                    <label className="group grid gap-3 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-[color:color-mix(in_srgb,var(--ink)_40%,transparent)]">
                      Email Address
                      <input 
                        required 
                        type="email" 
                        name="email" 
                        placeholder="jane@company.com" 
                        className="h-14 rounded-2xl bg-[color:color-mix(in_srgb,var(--ink)_3%,transparent)] px-5 font-sans text-[15px] font-medium text-[var(--ink)] outline-none transition-all placeholder:font-normal placeholder:text-[color:color-mix(in_srgb,var(--ink)_30%,transparent)] focus:bg-[color:color-mix(in_srgb,var(--ink)_6%,transparent)] hover:bg-[color:color-mix(in_srgb,var(--ink)_5%,transparent)]" 
                      />
                    </label>
                    
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
                            {/* Fluid pill selector */}
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
                        className="resize-none rounded-2xl bg-[color:color-mix(in_srgb,var(--ink)_3%,transparent)] p-5 font-sans text-[15px] font-medium text-[var(--ink)] outline-none transition-all placeholder:font-normal placeholder:text-[color:color-mix(in_srgb,var(--ink)_30%,transparent)] focus:bg-[color:color-mix(in_srgb,var(--ink)_6%,transparent)] hover:bg-[color:color-mix(in_srgb,var(--ink)_5%,transparent)]" 
                      />
                    </label>
                  </div>
                  
                  {error && <p className="mt-5 text-sm text-red-500">{error}</p>}
                  
                  <div className="mt-12 sm:w-fit">
                    <Magnetic strength={20}>
                      <button 
                        type="submit" 
                        disabled={sending}
                        className="group flex h-14 w-full items-center justify-center gap-3 rounded-full bg-[var(--ink)] px-8 font-sans text-[14px] font-medium text-[var(--bg)] transition-transform hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
                      >
                        {sending ? "Sending…" : "Send inquiry"}
                        <Send size={15} strokeWidth={2} className="opacity-80 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                      </button>
                    </Magnetic>
                  </div>
                </form>
              )}
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ----------------------------------------------------------------------
// Expanding Hover Dock Trigger (Matches Studio Dock exactly)
// ----------------------------------------------------------------------
export function ContactDock({ onOpen }: { onOpen: () => void }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 sm:bottom-8 sm:right-8">
      <motion.div 
        // flex-row-reverse ensures it expands to the left, away from the screen edge
        className="group flex flex-row-reverse items-center gap-2"
        initial={{ opacity: 0, y: 20, scale: 0.9 }} 
        animate={{ opacity: 1, y: 0, scale: 1 }} 
        transition={{ delay: 0.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <button 
          onClick={onOpen} 
          className="flex h-14 cursor-pointer items-center justify-center rounded-full bg-[var(--ink)] p-2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02] active:scale-[0.96]"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--bg)] text-[var(--ink)] transition-transform duration-500 group-hover:-rotate-12">
            <MessageCircle size={18} strokeWidth={1.5} />
          </div>
          
          {/* Expanding Label Container */}
          <div className="grid w-0 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-[150px]">
            <span className="truncate whitespace-nowrap pl-2 pr-3 font-sans text-[14px] font-medium tracking-tight text-[var(--bg)]">
              Start a conversation
            </span>
          </div>
        </button>

        {/* Hidden Dismiss Button that slides out on hover */}
        <div className="grid w-0 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-10">
          <button 
            onClick={(e) => { e.stopPropagation(); setDismissed(true); }}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--ink)_8%,transparent)] text-[var(--ink)] transition-colors hover:bg-[color:color-mix(in_srgb,var(--ink)_15%,transparent)]"
            aria-label="Dismiss dock"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}