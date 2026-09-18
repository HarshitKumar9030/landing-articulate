import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LogOut, ShieldCheck } from "lucide-react";
import { OnboardingChat } from "@/components/onboarding-chat";
import { getDb } from "@/lib/db";

export default async function OnboardingPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/register?callbackUrl=/onboarding");
  }

  // Check if user is already an active client
  if (session.user.email) {
    const db = await getDb();
    const lead = await db.collection("leads").findOne({ email: session.user.email });
    if (lead && (lead.stage === "won" || lead.stage === "active")) {
      redirect("/dashboard");
    }
  }

  return (
    <main className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[var(--bg)] px-[clamp(24px,5vw,80px)] pb-24 pt-32 text-[var(--ink)] md:pt-40">
      
      {/* Cinematic Noise & Ambient Glow */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.06] mix-blend-overlay" />
      <div className="pointer-events-none absolute -left-[10%] -top-[10%] -z-20 h-[60vw] w-[60vw] max-w-[800px] rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--ink)_4%,transparent)_0%,transparent_60%)] blur-[80px]" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 flex-col">
        
        {/* Header Section */}
        <header className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] px-4 py-1.5 font-sans text-[14px] font-medium text-[var(--ink)] backdrop-blur-md">
              <ShieldCheck size={16} className="text-[var(--ink)]" />
              Connection Secured
            </div>
            
            <h1 className="max-w-3xl font-sans text-[clamp(48px,6vw,96px)] font-bold leading-[0.9] tracking-tighter text-[var(--ink)]">
              Welcome to <br />
              <span className="text-[color:color-mix(in_srgb,var(--ink)_35%,transparent)]">the room.</span>
            </h1>
          </div>
          
          <div className="flex flex-col items-start gap-4 md:items-end">
            <p className="max-w-xs text-balance font-sans text-[15px] leading-relaxed text-[color:color-mix(in_srgb,var(--ink)_60%,transparent)] md:text-right">
              Authenticated as <strong className="font-semibold text-[var(--ink)]">{session.user.email}</strong>. Let’s get your stage set.
            </p>
          </div>
        </header>

        {/* AI Chat Interface */}
        <div className="mt-12 flex w-full flex-1 flex-col items-center justify-center md:mt-16">
          <OnboardingChat userEmail={session.user.email} />
        </div>

        {/* Footer Navigation & Destructive Action */}
        <footer className="mt-16 pt-16 flex flex-col items-center justify-between gap-6 md:mt-auto md:flex-row">
          <Link 
            href="/" 
            className="group flex items-center gap-2 font-sans text-[15px] font-medium text-[color:color-mix(in_srgb,var(--ink)_60%,transparent)] transition-colors hover:text-[var(--ink)]"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Return to Index
          </Link>
          
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="group flex items-center gap-2 font-sans text-[15px] font-medium text-[color:color-mix(in_srgb,var(--ink)_60%,transparent)] transition-colors hover:text-[var(--ink)]"
            >
              <LogOut size={16} className="transition-transform group-hover:-translate-x-1" />
              Terminate Session
            </button>
          </form>
        </footer>

      </div>
    </main>
  );
}