"use client";

import { useEffect, useState, useRef, type ReactNode, type MouseEvent as ReactMouseEvent } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, type Variants } from "framer-motion";
import { ArrowRight, ArrowUpRight, X, MessageCircle } from "lucide-react";
import { APP_CONTENT } from "@/constants";

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
  const [activeInterest, setActiveInterest] = useState<string>(APP_CONTENT.contact.interests[0]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
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

  const backdropVariants: Variants = {
    hidden: { opacity: 0, backdropFilter: "blur(0px)" },
    show: { opacity: 1, backdropFilter: "blur(24px)", transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, backdropFilter: "blur(0px)", transition: { duration: 0.5 } }
  };

  const modalVariants: Variants = {
    hidden: { opacity: 0, y: 100, scale: 0.95, rotateX: 10 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      rotateX: 0, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.1, delayChildren: 0.2 } 
    },
    exit: { opacity: 0, y: 40, scale: 0.95, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
  };

  const lineVariants: Variants = {
    hidden: { opacity: 0, y: "100%" },
    show: { opacity: 1, y: "0%", transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const inputVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  const borderVariants: Variants = {
    hidden: { scaleX: 0 },
    show: { scaleX: 1, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div 
          className="fixed inset-0 z-[150] flex items-end justify-center bg-[color:color-mix(in_srgb,var(--ink)_20%,transparent)] p-0 sm:items-center sm:p-6 md:p-12" 
          variants={backdropVariants}
          initial="hidden"
          animate="show"
          exit="exit"
          onMouseDown={close}
          style={{ perspective: "1000px" }}
        >
          <motion.section 
            role="dialog" 
            aria-modal="true" 
            aria-labelledby="contact-title" 
            className="relative flex h-full max-h-[95vh] w-full max-w-[1400px] flex-col overflow-hidden bg-[var(--bg)] shadow-[0_40px_100px_color-mix(in_srgb,var(--ink)_40%,transparent)] sm:rounded-[3rem] md:flex-row" 
            variants={modalVariants}
            onMouseDown={(event) => event.stopPropagation()}
            style={{ transformOrigin: "bottom center" }}
          >
            <div className="pointer-events-none absolute inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.06] mix-blend-overlay" />

            <aside className="relative z-10 flex flex-col justify-between p-8 md:w-5/12 md:p-16 lg:p-20">
              <div>
                <h2 id="contact-title" className="font-sans text-[clamp(48px,6vw,96px)] font-bold leading-[0.9] tracking-tighter text-[var(--ink)]">
                  <div className="overflow-hidden pb-2 pt-1">
                    <motion.div variants={lineVariants}>Let’s make</motion.div>
                  </div>
                  <div className="overflow-hidden pb-2 pt-1">
                    <motion.div variants={lineVariants} className="text-[color:color-mix(in_srgb,var(--ink)_35%,transparent)]">
                      it land.
                    </motion.div>
                  </div>
                </h2>
                
                <motion.p 
                  variants={lineVariants}
                  className="mt-8 max-w-[320px] text-balance font-sans text-[18px] font-medium leading-relaxed text-[color:color-mix(in_srgb,var(--ink)_60%,transparent)]"
                >
                  Tell us what you want to say. We’ll help you make it impossible to miss.
                </motion.p>
              </div>

              <motion.div 
                variants={lineVariants}
                className="mt-12 hidden md:block"
              >
                <div className="font-sans text-[13px] font-medium leading-relaxed text-[color:color-mix(in_srgb,var(--ink)_50%,transparent)]">
                  {APP_CONTENT.contact.location}<br />
                  <a href="mailto:hello@articulatex.in" className="text-[var(--ink)] no-underline transition-opacity hover:opacity-70">
                    hello@articulatex.in
                  </a>
                </div>
              </motion.div>
            </aside>

            <div 
              data-lenis-prevent="true"
              className="relative z-10 flex flex-col overflow-y-auto p-8 md:w-7/12 md:p-16 lg:p-20"
            >
              <div className="absolute right-8 top-8 z-20 hidden md:block">
                <Magnetic strength={15}>
                  <button 
                    aria-label="Close contact form" 
                    onClick={close} 
                    className="grid size-14 cursor-pointer place-items-center rounded-full bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] text-[var(--ink)] backdrop-blur-md transition-colors hover:bg-[color:color-mix(in_srgb,var(--ink)_8%,transparent)] active:scale-95"
                  >
                    <X size={20} strokeWidth={2} />
                  </button>
                </Magnetic>
              </div>
              
              <button 
                aria-label="Close contact form" 
                onClick={close} 
                className="absolute right-6 top-6 z-20 grid size-10 cursor-pointer place-items-center rounded-full bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] text-[var(--ink)] md:hidden"
              >
                <X size={18} strokeWidth={2} />
              </button>

              {sent ? (
                <motion.div 
                  className="flex h-full min-h-[400px] flex-col justify-center" 
                  initial={{ opacity: 0, filter: "blur(8px)", scale: 0.95 }} 
                  animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h3 className="font-sans text-[clamp(40px,4vw,56px)] font-bold leading-[0.9] tracking-tighter text-[var(--ink)]">
                    Received.
                  </h3>
                  <p className="mt-6 max-w-[320px] text-balance font-sans text-[18px] font-medium leading-relaxed text-[color:color-mix(in_srgb,var(--ink)_60%,transparent)]">
                    Thanks for reaching out. The ArticulateX team will review your brief and be in touch shortly.
                  </p>
                  <button 
                    onClick={close} 
                    className="group mt-12 inline-flex w-fit items-center gap-3 font-mono text-[12px] font-bold uppercase tracking-[0.1em] text-[var(--ink)]"
                  >
                    Return to site 
                    <ArrowRight size={16} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-1" />
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
                        body: JSON.stringify({ name: form.get("name"), email: form.get("email"), interest: activeInterest, message: form.get("message") }) 
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
                  className="flex flex-col pb-16 pt-12 md:pb-24 md:pt-4"
                >
                  <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid gap-14 md:gap-16">
                    
                    <motion.div variants={inputVariants} className="group relative mt-6 md:mt-2">
                      <label htmlFor="name" className="absolute -top-7 left-0 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--ink)_40%,transparent)] transition-colors group-focus-within:text-[var(--ink)]">
                        01. Your Name
                      </label>
                      <input 
                        id="name"
                        required 
                        name="name" 
                        placeholder="John Doe" 
                        className="w-full bg-transparent pb-3 pt-4 font-sans text-[24px] font-medium text-[var(--ink)] outline-none transition-colors placeholder:text-[color:color-mix(in_srgb,var(--ink)_15%,transparent)] md:text-[32px]" 
                      />
                      {/* FIX: Used Tailwind 'origin-left' instead of 'style={{ originX: 0 }}' */}
                      <motion.div variants={borderVariants} className="absolute bottom-0 left-0 h-px w-full origin-left bg-[color:color-mix(in_srgb,var(--ink)_15%,transparent)]" />
                      <div className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[var(--ink)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-focus-within:scale-x-100" />
                    </motion.div>

                    <motion.div variants={inputVariants} className="group relative mt-4">
                      <label htmlFor="email" className="absolute -top-7 left-0 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--ink)_40%,transparent)] transition-colors group-focus-within:text-[var(--ink)]">
                        02. Email Address
                      </label>
                      <input 
                        id="email"
                        required 
                        type="email" 
                        name="email" 
                        placeholder="john@company.com" 
                        className="w-full bg-transparent pb-3 pt-4 font-sans text-[24px] font-medium text-[var(--ink)] outline-none transition-colors placeholder:text-[color:color-mix(in_srgb,var(--ink)_15%,transparent)] md:text-[32px]" 
                      />
                      <motion.div variants={borderVariants} className="absolute bottom-0 left-0 h-px w-full origin-left bg-[color:color-mix(in_srgb,var(--ink)_15%,transparent)]" />
                      <div className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[var(--ink)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-focus-within:scale-x-100" />
                    </motion.div>

                    <motion.fieldset variants={inputVariants} className="relative mt-4">
                      <legend className="mb-6 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--ink)_40%,transparent)]">
                        03. Area of Interest
                      </legend>
                      <div className="flex flex-wrap gap-3">
                        {APP_CONTENT.contact.interests.map((option, idx) => (
                          <label key={option} className="cursor-pointer">
                            <input 
                              className="peer sr-only" 
                              type="radio" 
                              name="interest" 
                              value={option} 
                              defaultChecked={idx === 0}
                              onChange={() => setActiveInterest(option)}
                            />
                            <span className="block rounded-full border border-[color:color-mix(in_srgb,var(--ink)_15%,transparent)] bg-transparent px-6 py-3 font-sans text-[14px] font-medium text-[var(--ink)] transition-all hover:border-[color:color-mix(in_srgb,var(--ink)_30%,transparent)] peer-checked:border-[var(--ink)] peer-checked:bg-[var(--ink)] peer-checked:text-[var(--bg)]">
                              {option}
                            </span>
                          </label>
                        ))}
                      </div>
                    </motion.fieldset>

                    <motion.div variants={inputVariants} className="group relative mt-4">
                      <label htmlFor="message" className="absolute -top-7 left-0 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[color:color-mix(in_srgb,var(--ink)_40%,transparent)] transition-colors group-focus-within:text-[var(--ink)]">
                        04. The Brief
                      </label>
                      <textarea 
                        id="message"
                        required 
                        name="message" 
                        rows={2} 
                        placeholder="What do you need to make land?" 
                        className="w-full resize-none bg-transparent pb-3 pt-4 font-sans text-[24px] font-medium text-[var(--ink)] outline-none transition-colors placeholder:text-[color:color-mix(in_srgb,var(--ink)_15%,transparent)] md:text-[32px]" 
                      />
                      <motion.div variants={borderVariants} className="absolute bottom-0 left-0 h-px w-full origin-left bg-[color:color-mix(in_srgb,var(--ink)_15%,transparent)]" />
                      <div className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[var(--ink)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-focus-within:scale-x-100" />
                    </motion.div>

                  </motion.div>
                  
                  {error && <p className="mt-6 text-sm font-medium text-red-500">{error}</p>}
                  
                  <motion.div variants={inputVariants} className="mt-16 sm:w-fit">
                    <Magnetic strength={15}>
                      <button 
                        type="submit" 
                        disabled={sending}
                        className="group flex h-16 w-full items-center justify-center gap-4 rounded-full bg-[var(--ink)] px-10 font-sans text-[15px] font-medium text-[var(--bg)] transition-transform hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
                      >
                        {sending ? "Sending..." : "Submit Brief"}
                        <ArrowUpRight size={18} strokeWidth={2} className="opacity-80 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                      </button>
                    </Magnetic>
                  </motion.div>
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
// Premium Floating Dock Trigger (Breathing Animation)
// ----------------------------------------------------------------------
export function ContactDock({ onOpen }: { onOpen: () => void }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 sm:bottom-8 sm:right-10">
      <motion.div 
        className="group flex flex-row-reverse items-center gap-3"
        initial={{ opacity: 0, y: 30, scale: 0.8 }} 
        animate={{ opacity: 1, y: 0, scale: 1 }} 
        transition={{ delay: 1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.button 
          onClick={onOpen} 
          animate={{ boxShadow: ["0px 0px 0px rgba(0,0,0,0)", "0px 10px 40px rgba(0,0,0,0.15)", "0px 0px 0px rgba(0,0,0,0)"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex h-16 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-[color:color-mix(in_srgb,var(--ink)_10%,transparent)] bg-[color:color-mix(in_srgb,var(--bg)_80%,transparent)] p-2 backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.03] hover:bg-[color:color-mix(in_srgb,var(--bg)_95%,transparent)] active:scale-95"
        >
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[var(--ink)] text-[var(--bg)] transition-transform duration-500 group-hover:-rotate-12">
            <MessageCircle size={20} strokeWidth={1.5} />
          </div>
          
          <div className="grid w-0 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-[150px]">
            <span className="truncate whitespace-nowrap pl-3 pr-5 font-sans text-[15px] font-semibold tracking-tight text-[var(--ink)]">
              {APP_CONTENT.contact.dockLabel}
            </span>
          </div>
        </motion.button>

        <div className="grid w-0 overflow-hidden opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-12 group-hover:opacity-100">
          <button 
            onClick={(e) => { e.stopPropagation(); setDismissed(true); }}
            className="flex size-12 cursor-pointer items-center justify-center rounded-full border border-[color:color-mix(in_srgb,var(--ink)_10%,transparent)] bg-[color:color-mix(in_srgb,var(--bg)_80%,transparent)] text-[var(--ink)] backdrop-blur-xl transition-colors hover:bg-[color:color-mix(in_srgb,var(--ink)_5%,transparent)]"
            aria-label="Dismiss dock"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}