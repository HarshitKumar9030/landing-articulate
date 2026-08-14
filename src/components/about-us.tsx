"use client";

import { useState, useRef, type MouseEvent as ReactMouseEvent, type ReactNode } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight, Globe } from "lucide-react";
import { IconBrandInstagram, IconBrandLinkedin } from "@tabler/icons-react";

type TeamMemberData = {
  name: string;
  role: string;
  linkedin: string;
  instagram: string;
  story: string;
  website?: string;
};

const team: TeamMemberData[] = [
  {
    name: "Vineet",
    role: "Founder",
    linkedin: "https://www.linkedin.com/",
    instagram: "https://www.instagram.com/",
    story: "Vineet built ArticulateX on the premise that great leadership requires equally great articulation. With a background in strategic communication, he strips away corporate noise to help founders turn raw vision into compelling, high-stakes narratives.",
  },
  {
    name: "Aniket",
    role: "Founder",
    linkedin: "https://www.linkedin.com/",
    instagram: "https://www.instagram.com/",
    story: "Aniket operates at the precise intersection of business strategy and human psychology. He engineers messages that do more than just sound good—they are meticulously designed to demand attention, shift perspectives, and drive immediate action.",
  },
  {
    name: "Harshit",
    role: "Creative Director",
    linkedin: "https://www.linkedin.com/",
    instagram: "https://www.instagram.com/",
    website: "https://www.harshit.page",
    story: "Harshit shapes the visual and experiential identity of every narrative we build. He ensures that the structural integrity of what is being said is perfectly aligned with the aesthetic reality of what is being seen and felt.",
  },
];

export function AboutUs() {
  const [activeMember, setActiveMember] = useState<string | null>(null);

  return (
    <section
      id="about-us"
      className="relative overflow-hidden bg-[var(--bg)] px-[clamp(24px,5vw,80px)] py-24 md:py-36"
    >
      <div className="mx-auto max-w-7xl">
        
        {/* Editorial Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-24 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end"
        >
          <div className="max-w-2xl">
            <h2 className="text-balance font-sans text-[clamp(40px,7vw,80px)] font-semibold leading-[0.9] tracking-tighter text-[var(--ink)]">
              The architects of <br />
              <span className="text-[color:color-mix(in_srgb,var(--ink)_40%,transparent)]">articulation.</span>
            </h2>
          </div>
          <p className="max-w-sm text-balance font-sans text-[16px] leading-relaxed text-[var(--muted)]">
            A collective of strategists and creatives building a studio where thoughtful ideas become unforgettable communication.
          </p>
        </motion.div>

        {/* 
          Typographic Roster List
          Replaced the card grid with an editorial, full-width list layout.
        */}
        <div className="flex flex-col border-t border-[color:color-mix(in_srgb,var(--ink)_10%,transparent)]">
          {team.map((member, index) => (
            <TeamMember 
              key={member.name} 
              member={member} 
              index={index} 
              isActive={activeMember === member.name}
              isDimmed={activeMember !== null && activeMember !== member.name}
              onToggle={() => setActiveMember(activeMember === member.name ? null : member.name)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// Individual Team Member Row
// ----------------------------------------------------------------------
function TeamMember({ 
  member, 
  index, 
  isActive, 
  isDimmed, 
  onToggle 
}: { 
  member: TeamMemberData; 
  index: number;
  isActive: boolean;
  isDimmed: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      animate={{ opacity: isDimmed ? 0.3 : 1 }}
      className="group relative flex flex-col border-b border-[color:color-mix(in_srgb,var(--ink)_10%,transparent)] py-8 transition-opacity duration-500 md:py-12"
    >
      {/* 
        Clickable Header Row 
        Uses group-hover logic to subtly shift the text right, acting as a hover affordance.
      */}
      <div 
        className="flex cursor-pointer items-start justify-between md:items-center"
        onClick={onToggle}
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:gap-12">
          <motion.h3 
            layout 
            className="font-sans text-[clamp(32px,5vw,56px)] font-medium tracking-tight text-[var(--ink)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2"
          >
            {member.name}
          </motion.h3>
          <motion.p 
            layout 
            className="font-mono text-[12px] font-medium tracking-[0.15em] text-[color:color-mix(in_srgb,var(--ink)_50%,transparent)] uppercase transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2"
          >
            {member.role}
          </motion.p>
        </div>

        {/* Morphing Toggle Button */}
        <button
          className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] text-[var(--ink)] transition-colors group-hover:bg-[var(--ink)] group-hover:text-[var(--bg)]"
          aria-label="Toggle Story"
        >
          <motion.div
            animate={{ rotate: isActive ? 135 : 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M7 1V13M1 7H13" />
            </svg>
          </motion.div>
        </button>
      </div>

      {/* Expandable Story Section */}
      <AnimatePresence mode="wait">
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-8 pt-8 md:flex-row md:items-start md:justify-between md:pt-12">
              <motion.p 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
                className="max-w-[500px] text-balance font-sans text-[16px] leading-relaxed text-[var(--muted)]"
              >
                {member.story}
              </motion.p>

              {/* Magnetic Social Links - Pushed to the right on desktop */}
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 0.2 }}
                className="flex flex-wrap gap-2 md:justify-end"
              >
                <MagneticButton href={member.linkedin} ariaLabel={`${member.name}'s LinkedIn`}>
                  <IconBrandLinkedin className="h-4 w-4" strokeWidth={1.5} />
                </MagneticButton>

                <MagneticButton href={member.instagram} ariaLabel={`${member.name}'s Instagram`}>
                  <IconBrandInstagram className="h-4 w-4" strokeWidth={1.5} />
                </MagneticButton>

                {member.website && (
                  <MagneticButton href={member.website} ariaLabel={`${member.name}'s Website`} isWide>
                    <Globe className="h-3.5 w-3.5" strokeWidth={1.5} />
                    <span className="px-1 text-[13px]">harshit.page</span>
                    <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </MagneticButton>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

// ----------------------------------------------------------------------
// Micro-interaction: Magnetic Button Wrapper
// ----------------------------------------------------------------------
function MagneticButton({ 
  children, 
  href, 
  ariaLabel, 
  isWide = false 
}: { 
  children: ReactNode; 
  href: string; 
  ariaLabel: string;
  isWide?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.5 });

  const handleMouseMove = (e: ReactMouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const pullStrength = 0.3;
    x.set((e.clientX - centerX) * pullStrength);
    y.set((e.clientY - centerY) * pullStrength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={ariaLabel}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={`inline-flex items-center justify-center gap-1 rounded-full bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] text-[var(--ink)] transition-colors hover:bg-[var(--ink)] hover:text-[var(--bg)] ${
        isWide ? "h-12 px-5 font-sans font-medium" : "h-12 w-12"
      }`}
    >
      {children}
    </motion.a>
  );
}