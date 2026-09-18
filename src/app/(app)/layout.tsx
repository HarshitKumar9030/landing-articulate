import { Sidebar } from "@/components/dashboard/sidebar";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/register?callbackUrl=/dashboard");
  }

  return (
    <div className="flex h-screen w-full flex-col md:flex-row overflow-hidden bg-[var(--bg)] p-2 gap-2 font-sans text-[var(--ink)]">
      <Sidebar 
        onSignOut={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }} 
      />

      {/* Enclosure (Main Content) */}
      <main className="flex-1 overflow-y-auto rounded-[1.5rem] bg-[var(--surface)]">
        {children}
      </main>
    </div>
  );
}
