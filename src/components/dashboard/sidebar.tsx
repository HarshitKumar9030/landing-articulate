"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, MessageSquare, Calendar, Settings, LogOut, Search, Plus, CreditCard, X, Video, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  ACTIVE_STUDIO_THREAD_KEY,
  createStudioThread,
  readStudioThreads,
  STUDIO_THREADS_EVENT,
  StudioThread,
  writeStudioThreads,
} from "@/lib/studio-threads";

export function Sidebar({ onSignOut }: { onSignOut: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNewSessionOpen, setIsNewSessionOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [meetDate, setMeetDate] = useState("");
  const [meetTime, setMeetTime] = useState("");
  const [isScheduling, setIsScheduling] = useState(false);
  const [threadSearch, setThreadSearch] = useState("");
  const [threads, setThreads] = useState<StudioThread[]>([]);

  useEffect(() => {
    const refreshThreads = () => setThreads(readStudioThreads().sort((a, b) => b.updatedAt - a.updatedAt));
    refreshThreads();
    window.addEventListener(STUDIO_THREADS_EVENT, refreshThreads);
    window.addEventListener("storage", refreshThreads);
    return () => {
      window.removeEventListener(STUDIO_THREADS_EVENT, refreshThreads);
      window.removeEventListener("storage", refreshThreads);
    };
  }, []);

  const createThread = () => {
    const newThread = createStudioThread();
    writeStudioThreads([newThread, ...readStudioThreads()]);
    localStorage.setItem(ACTIVE_STUDIO_THREAD_KEY, newThread.id);
    window.dispatchEvent(new Event(STUDIO_THREADS_EVENT));
    router.push("/chat");
    setIsMobileMenuOpen(false);
  };

  const openThread = (thread: StudioThread) => {
    localStorage.setItem(ACTIVE_STUDIO_THREAD_KEY, thread.id);
    window.dispatchEvent(new Event(STUDIO_THREADS_EVENT));
    router.push("/chat");
    setIsMobileMenuOpen(false);
  };

  const filteredThreads = threads.filter((thread) => {
    const query = threadSearch.toLowerCase().trim();
    if (!query) return true;

    return (
      thread.title.toLowerCase().includes(query) ||
      thread.messages.some((message) => message.content.toLowerCase().includes(query))
    );
  });

  const handleScheduleMeet = async () => {
    if (!meetDate || !meetTime) {
      toast.error("Please select both a date and time.");
      return;
    }

    setIsScheduling(true);
    try {
      const res = await fetch("/api/schedule-meet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: meetDate, time: meetTime }),
      });

      if (!res.ok) throw new Error("Failed to schedule");

      toast.success("Meeting scheduled! Check your email for the invite.");
      setIsNewSessionOpen(false);
      setMeetDate("");
      setMeetTime("");
    } catch (error) {
      toast.error("Failed to schedule meeting. Please try again.");
    } finally {
      setIsScheduling(false);
    }
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="flex items-center justify-between rounded-[1.5rem] bg-[var(--bg)] p-4 md:hidden">
        <Image 
          src="/images/logo.png" 
          alt="ArticulateX" 
          width={120} 
          height={36} 
          className="h-8 w-auto object-contain invert mix-blend-screen opacity-90" 
          priority 
        />
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--ink)_8%,transparent)] text-[var(--ink)]"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden w-[260px] shrink-0 flex-col justify-between rounded-[1.5rem] bg-[var(--bg)] p-3 md:flex">
        <div className="flex flex-col gap-6">
          {/* Header / Logo */}
          <div className="px-3 pt-2 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image 
                src="/images/logo.png" 
                alt="ArticulateX" 
                width={160} 
                height={48} 
                className="h-12 w-auto object-contain invert mix-blend-screen opacity-90" 
                priority 
              />
            </div>
          </div>

          {/* New Thread Button */}
          <div className="px-2">
            <button 
              onClick={createThread}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[color:color-mix(in_srgb,var(--ink)_8%,transparent)] px-4 py-2.5 text-[14px] font-medium text-[var(--ink)] transition-colors hover:bg-[color:color-mix(in_srgb,var(--ink)_12%,transparent)]"
            >
              <Plus size={16} />
              New Thread
            </button>
          </div>

          {/* Search */}
          <div className="px-2">
            <div className="relative flex items-center">
              <Search size={16} className="absolute left-3 text-[color:color-mix(in_srgb,var(--ink)_40%,transparent)]" />
              <input 
                type="text" 
                placeholder="Search your threads..." 
                value={threadSearch}
                onChange={(event) => setThreadSearch(event.target.value)}
                className="w-full rounded-xl bg-transparent py-2 pl-9 pr-4 text-[14px] text-[var(--ink)] placeholder-[color:color-mix(in_srgb,var(--ink)_40%,transparent)] outline-none transition-colors focus:bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)]"
              />
            </div>
          </div>

          <div className="flex max-h-48 flex-col gap-1 overflow-y-auto px-2">
            {filteredThreads.map((thread) => (
              <button
                key={thread.id}
                onClick={() => openThread(thread)}
                className="truncate rounded-xl px-3 py-2 text-left text-[13px] text-[color:color-mix(in_srgb,var(--ink)_60%,transparent)] transition-colors hover:bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] hover:text-[var(--ink)]"
              >
                {thread.title}
              </button>
            ))}
            {threadSearch && filteredThreads.length === 0 && (
              <p className="px-3 py-2 text-[12px] text-[color:color-mix(in_srgb,var(--ink)_40%,transparent)]">No threads found</p>
            )}
          </div>
          
          {/* Navigation */}
          <nav className="flex flex-col gap-1 px-2">
            <Link href="/dashboard" className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-colors hover:bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] hover:text-[var(--ink)] ${pathname === '/dashboard' ? 'bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] text-[var(--ink)]' : 'text-[color:color-mix(in_srgb,var(--ink)_60%,transparent)]'}`}>
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
            <Link href="/chat" className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-colors hover:bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] hover:text-[var(--ink)] ${pathname === '/chat' ? 'bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] text-[var(--ink)]' : 'text-[color:color-mix(in_srgb,var(--ink)_60%,transparent)]'}`}>
              <MessageSquare size={18} />
              Studio Chat
            </Link>
            <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium text-[color:color-mix(in_srgb,var(--ink)_40%,transparent)] cursor-not-allowed">
              <Calendar size={18} />
              Curriculum
            </div>
            <Link href="/billing" className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-colors hover:bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] hover:text-[var(--ink)] ${pathname === '/billing' ? 'bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] text-[var(--ink)]' : 'text-[color:color-mix(in_srgb,var(--ink)_60%,transparent)]'}`}>
              <CreditCard size={18} />
              Billing
            </Link>
          </nav>
        </div>
        
        {/* Footer / User */}
        <div className="flex flex-col gap-1 px-2 pb-2">
          <button onClick={() => setIsSettingsOpen(true)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium text-[color:color-mix(in_srgb,var(--ink)_60%,transparent)] transition-colors hover:bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] hover:text-[var(--ink)] text-left">
            <Settings size={18} />
            Settings
          </button>
          <button onClick={onSignOut} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium text-[color:color-mix(in_srgb,var(--ink)_60%,transparent)] transition-colors hover:bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] hover:text-[var(--ink)] text-left">
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </aside>

      {/* Modals & Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex flex-col bg-[var(--bg)]/80 backdrop-blur-3xl md:hidden"
          >
            <div className="flex items-center justify-between p-6">
              <Image 
                src="/images/logo.png" 
                alt="ArticulateX" 
                width={120} 
                height={36} 
                className="h-8 w-auto object-contain invert mix-blend-screen opacity-90" 
              />
              <button onClick={() => setIsMobileMenuOpen(false)} className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--ink)_8%,transparent)] text-[var(--ink)] transition-transform hover:scale-105 active:scale-95">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto px-6 pb-20 pt-4">
              <div className="flex flex-col gap-8">
                <button 
                  onClick={createThread}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[color:color-mix(in_srgb,var(--ink)_8%,transparent)] px-4 py-4 text-[16px] font-medium text-[var(--ink)] transition-colors hover:bg-[color:color-mix(in_srgb,var(--ink)_12%,transparent)]"
                >
                  <Plus size={20} />
                  New Thread
                </button>

                <div className="relative flex items-center">
                  <Search size={18} className="absolute left-4 text-[color:color-mix(in_srgb,var(--ink)_40%,transparent)]" />
                  <input
                    type="text"
                    value={threadSearch}
                    onChange={(event) => setThreadSearch(event.target.value)}
                    placeholder="Search your threads..."
                    className="w-full rounded-2xl bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] py-4 pl-12 pr-4 text-[16px] text-[var(--ink)] placeholder-[color:color-mix(in_srgb,var(--ink)_40%,transparent)] outline-none"
                  />
                </div>

                <div className="flex max-h-56 flex-col gap-1 overflow-y-auto">
                  {filteredThreads.map((thread) => (
                    <button
                      key={thread.id}
                      onClick={() => openThread(thread)}
                      className="truncate rounded-2xl px-4 py-3 text-left text-[16px] text-[color:color-mix(in_srgb,var(--ink)_60%,transparent)] transition-colors hover:bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] hover:text-[var(--ink)]"
                    >
                      {thread.title}
                    </button>
                  ))}
                </div>

                <nav className="flex flex-col gap-2">
                  <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-4 rounded-2xl px-4 py-4 text-[18px] font-medium transition-colors ${pathname === '/dashboard' ? 'bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] text-[var(--ink)]' : 'text-[color:color-mix(in_srgb,var(--ink)_60%,transparent)]'}`}>
                    <LayoutDashboard size={24} />
                    Dashboard
                  </Link>
                  <Link href="/chat" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-4 rounded-2xl px-4 py-4 text-[18px] font-medium transition-colors ${pathname === '/chat' ? 'bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] text-[var(--ink)]' : 'text-[color:color-mix(in_srgb,var(--ink)_60%,transparent)]'}`}>
                    <MessageSquare size={24} />
                    Studio Chat
                  </Link>
                  <div className="flex items-center gap-4 rounded-2xl px-4 py-4 text-[18px] font-medium text-[color:color-mix(in_srgb,var(--ink)_40%,transparent)] cursor-not-allowed">
                    <Calendar size={24} />
                    Curriculum
                  </div>
                  <Link href="/billing" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-4 rounded-2xl px-4 py-4 text-[18px] font-medium transition-colors ${pathname === '/billing' ? 'bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] text-[var(--ink)]' : 'text-[color:color-mix(in_srgb,var(--ink)_60%,transparent)]'}`}>
                    <CreditCard size={24} />
                    Billing
                  </Link>
                </nav>

                <div className="mt-auto flex flex-col gap-2 pt-8">
                  <button onClick={() => { setIsMobileMenuOpen(false); setIsSettingsOpen(true); }} className="flex w-full items-center gap-4 rounded-2xl px-4 py-4 text-[18px] font-medium text-[color:color-mix(in_srgb,var(--ink)_60%,transparent)] transition-colors hover:bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] hover:text-[var(--ink)] text-left">
                    <Settings size={24} />
                    Settings
                  </button>
                  <button onClick={onSignOut} className="flex w-full items-center gap-4 rounded-2xl px-4 py-4 text-[18px] font-medium text-[color:color-mix(in_srgb,var(--ink)_60%,transparent)] transition-colors hover:bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] hover:text-[var(--ink)] text-left">
                    <LogOut size={24} />
                    Log out
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {isSettingsOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex flex-col bg-[var(--bg)]/80 backdrop-blur-3xl"
          >
            <div className="flex items-center justify-between p-6 md:p-10">
              <div className="w-12" /> {/* Spacer for centering */}
              <button onClick={() => setIsSettingsOpen(false)} className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--ink)_8%,transparent)] text-[var(--ink)] transition-transform hover:scale-105 active:scale-95">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto px-6 pb-20">
              <div className="mx-auto max-w-2xl">
                <h2 className="mb-12 text-center font-sans text-[clamp(32px,5vw,48px)] font-semibold tracking-tight text-[var(--ink)]">Settings</h2>
                
                <div className="space-y-8">
                  <div>
                    <label className="mb-3 block font-sans text-[13px] font-semibold uppercase tracking-widest text-[color:color-mix(in_srgb,var(--ink)_50%,transparent)]">Full Name</label>
                    <input type="text" defaultValue="Harshit" className="w-full rounded-[1.5rem] bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] px-6 py-5 font-sans text-[18px] text-[var(--ink)] outline-none transition-colors focus:bg-[color:color-mix(in_srgb,var(--ink)_6%,transparent)]" />
                  </div>
                  <div>
                    <label className="mb-3 block font-sans text-[13px] font-semibold uppercase tracking-widest text-[color:color-mix(in_srgb,var(--ink)_50%,transparent)]">Age</label>
                    <input type="number" defaultValue={25} className="w-full rounded-[1.5rem] bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] px-6 py-5 font-sans text-[18px] text-[var(--ink)] outline-none transition-colors focus:bg-[color:color-mix(in_srgb,var(--ink)_6%,transparent)]" />
                  </div>
                  <div>
                    <label className="mb-3 block font-sans text-[13px] font-semibold uppercase tracking-widest text-[color:color-mix(in_srgb,var(--ink)_50%,transparent)]">Email Address</label>
                    <input type="email" defaultValue="harshit@articulatex.in" disabled className="w-full cursor-not-allowed rounded-[1.5rem] bg-[color:color-mix(in_srgb,var(--ink)_2%,transparent)] px-6 py-5 font-sans text-[18px] text-[color:color-mix(in_srgb,var(--ink)_40%,transparent)] outline-none" />
                  </div>
                  
                  <div className="pt-8">
                    <button 
                      onClick={() => {
                        toast.success("Settings saved successfully");
                        setIsSettingsOpen(false);
                      }} 
                      className="w-full rounded-full bg-[var(--ink)] py-5 font-sans text-[16px] font-medium text-[var(--bg)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {isNewSessionOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex flex-col bg-[var(--bg)]/80 backdrop-blur-3xl"
          >
            <div className="flex items-center justify-between p-6 md:p-10">
              <div className="w-12" /> {/* Spacer */}
              <button onClick={() => setIsNewSessionOpen(false)} className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--ink)_8%,transparent)] text-[var(--ink)] transition-transform hover:scale-105 active:scale-95">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto px-6 pb-20">
              <div className="mx-auto max-w-2xl">
                <div className="mb-8 flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--ink)_5%,transparent)] text-[var(--ink)]">
                    <Video size={32} strokeWidth={1.5} />
                  </div>
                </div>
                <h2 className="mb-4 text-center font-sans text-[clamp(32px,5vw,48px)] font-semibold tracking-tight text-[var(--ink)]">Schedule Session</h2>
                <p className="mb-12 text-center font-sans text-[18px] leading-relaxed text-[color:color-mix(in_srgb,var(--ink)_60%,transparent)]">
                  Ready for a 1-on-1 session? Pick a date and time that works for you, and we'll send a Google Meet invite to your email.
                </p>
                
                <div className="space-y-8">
                  <div className="grid gap-8 md:grid-cols-2">
                    <div>
                      <label className="mb-3 block font-sans text-[13px] font-semibold uppercase tracking-widest text-[color:color-mix(in_srgb,var(--ink)_50%,transparent)]">Date</label>
                      <input 
                        type="date" 
                        value={meetDate}
                        onChange={(e) => setMeetDate(e.target.value)}
                        className="w-full rounded-[1.5rem] bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] px-6 py-5 font-sans text-[18px] text-[var(--ink)] outline-none transition-colors focus:bg-[color:color-mix(in_srgb,var(--ink)_6%,transparent)] [&::-webkit-calendar-picker-indicator]:opacity-50" 
                      />
                    </div>
                    <div>
                      <label className="mb-3 block font-sans text-[13px] font-semibold uppercase tracking-widest text-[color:color-mix(in_srgb,var(--ink)_50%,transparent)]">Time</label>
                      <input 
                        type="time" 
                        value={meetTime}
                        onChange={(e) => setMeetTime(e.target.value)}
                        className="w-full rounded-[1.5rem] bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] px-6 py-5 font-sans text-[18px] text-[var(--ink)] outline-none transition-colors focus:bg-[color:color-mix(in_srgb,var(--ink)_6%,transparent)] [&::-webkit-calendar-picker-indicator]:opacity-50" 
                      />
                    </div>
                  </div>
                  
                  <div className="pt-8">
                    <button 
                      onClick={handleScheduleMeet}
                      disabled={isScheduling}
                      className="w-full rounded-full bg-[var(--ink)] py-5 font-sans text-[16px] font-medium text-[var(--bg)] transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                    >
                      {isScheduling ? "Scheduling..." : "Confirm Schedule"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
