"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Calendar, BookOpen, Lock, CalendarDays } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [course, setCourse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActiveClient, setIsActiveClient] = useState(false);

  useEffect(() => {
    const savedCourse = localStorage.getItem("onboarding_course");
    const savedNotified = localStorage.getItem("onboarding_notified");

    // Fetch user status from DB first
    fetch("/api/user/status")
      .then(res => res.json())
      .then(data => {
        if (data.isActive) {
          setIsActiveClient(true);
          // If they are an active client, we don't need to force them back to onboarding
          // even if localStorage is empty (e.g. new device)
          if (savedCourse) setCourse(savedCourse);
          else setCourse("Your Curriculum"); // Fallback if not in localStorage
        } else {
          // Not an active client, enforce onboarding flow
          if (!savedCourse || savedNotified !== "true") {
            router.push("/onboarding");
            return;
          }
          setCourse(savedCourse);
        }
      })
      .catch(err => {
        console.error("Failed to fetch status", err);
        // Fallback to localStorage check if API fails
        if (!savedCourse || savedNotified !== "true") {
          router.push("/onboarding");
          return;
        }
        setCourse(savedCourse);
      })
      .finally(() => setIsLoading(false));
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[80vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--ink)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="px-6 py-12 md:px-12 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <h1 className="font-sans text-[clamp(28px,5vw,40px)] font-semibold tracking-tight text-[var(--ink)]">
            Welcome to your Studio
          </h1>
          <p className="mt-3 max-w-2xl font-sans text-[16px] leading-relaxed text-[color:color-mix(in_srgb,var(--ink)_60%,transparent)]">
            Your onboarding is complete. We're preparing your personalized curriculum based on your goals.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Course Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-between overflow-hidden rounded-[2rem] bg-[color:color-mix(in_srgb,var(--ink)_3%,transparent)] p-8 transition-transform hover:scale-[1.02]"
            style={{ WebkitBackdropFilter: "blur(60px) saturate(180%)", backdropFilter: "blur(60px) saturate(180%)" }}
          >
            <div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--ink)_8%,transparent)] text-[var(--ink)]">
                <BookOpen size={24} strokeWidth={2} />
              </div>
              <h3 className="mb-2 font-sans text-[12px] font-medium uppercase tracking-widest text-[color:color-mix(in_srgb,var(--ink)_50%,transparent)]">
                Selected Track
              </h3>
              <p className="font-sans text-[24px] font-semibold tracking-tight text-[var(--ink)]">
                {course}
              </p>
            </div>
          </motion.div>

          {/* Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-between overflow-hidden rounded-[2rem] bg-[color:color-mix(in_srgb,var(--ink)_3%,transparent)] p-8 transition-transform hover:scale-[1.02]"
            style={{ WebkitBackdropFilter: "blur(60px) saturate(180%)", backdropFilter: "blur(60px) saturate(180%)" }}
          >
            <div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--ink)_8%,transparent)] text-[var(--ink)]">
                <Calendar size={24} strokeWidth={2} />
              </div>
              <h3 className="mb-2 font-sans text-[12px] font-medium uppercase tracking-widest text-[color:color-mix(in_srgb,var(--ink)_50%,transparent)]">
                Next Step
              </h3>
              <p className="font-sans text-[24px] font-semibold tracking-tight text-[var(--ink)]">
                {isActiveClient ? "Curriculum Active" : "Google Meet Scheduled"}
              </p>
              <p className="mt-2 font-sans text-[14px] leading-relaxed text-[color:color-mix(in_srgb,var(--ink)_60%,transparent)]">
                {isActiveClient 
                  ? "Your personalized curriculum is now unlocked. Check the calendar below for your upcoming sessions."
                  : "Our team has been notified of your preferred time. Please check your email shortly for the official calendar invitation and meeting link."}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Curriculum Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-6 overflow-hidden rounded-[2.5rem] bg-[color:color-mix(in_srgb,var(--ink)_3%,transparent)] p-8 md:p-12"
          style={{ WebkitBackdropFilter: "blur(60px) saturate(180%)", backdropFilter: "blur(60px) saturate(180%)" }}
        >
          {!isActiveClient && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[var(--bg)]/50 backdrop-blur-md">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--ink)] text-[var(--bg)] shadow-xl">
                <Lock size={24} strokeWidth={2} />
              </div>
              <h3 className="font-sans text-[22px] font-semibold tracking-tight text-[var(--ink)]">
                Curriculum Locked
              </h3>
              <p className="mt-2 max-w-sm text-center font-sans text-[14px] leading-relaxed text-[color:color-mix(in_srgb,var(--ink)_60%,transparent)]">
                Your personalized curriculum calendar will be unlocked once your onboarding is finalized and you become an active client.
              </p>
            </div>
          )}

          {/* Calendar Content */}
          <div className={!isActiveClient ? "pointer-events-none select-none opacity-20 blur-[4px]" : ""}>
            <div className="mb-10 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--ink)_8%,transparent)] text-[var(--ink)]">
                <CalendarDays size={28} strokeWidth={2} />
              </div>
              <h3 className="font-sans text-[28px] font-semibold tracking-tight text-[var(--ink)]">
                Curriculum Calendar
              </h3>
            </div>
            <div className="space-y-6">
              {[1, 2, 3].map((week) => (
                <div key={week} className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 rounded-[2rem] bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] p-6 md:p-8 transition-colors hover:bg-[color:color-mix(in_srgb,var(--ink)_6%,transparent)]">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--ink)_8%,transparent)] font-sans text-lg font-medium text-[var(--ink)]">
                    W{week}
                  </div>
                  <div className="w-full">
                    {isActiveClient ? (
                      <>
                        <h4 className="mb-1 font-sans text-[18px] font-semibold text-[var(--ink)]">Module {week}: Core Foundations</h4>
                        <p className="font-sans text-[14px] text-[color:color-mix(in_srgb,var(--ink)_60%,transparent)]">Focusing on vocal clarity, pacing, and audience engagement.</p>
                      </>
                    ) : (
                      <>
                        <div className="mb-3 h-6 w-3/4 max-w-[16rem] rounded-lg bg-[color:color-mix(in_srgb,var(--ink)_12%,transparent)]"></div>
                        <div className="h-5 w-full max-w-[24rem] rounded-lg bg-[color:color-mix(in_srgb,var(--ink)_6%,transparent)]"></div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
