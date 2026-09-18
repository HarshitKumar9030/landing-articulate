export type StudioMessage = {
  id: string;
  role: "user" | "ai";
  content: string;
};

export type StudioThread = {
  id: string;
  title: string;
  messages: StudioMessage[];
  updatedAt: number;
};

export const STUDIO_THREADS_KEY = "studio_threads";
export const ACTIVE_STUDIO_THREAD_KEY = "active_studio_thread";
export const STUDIO_THREADS_EVENT = "studio-threads-updated";

export function createStudioThread(userEmail?: string | null): StudioThread {
  return {
    id: crypto.randomUUID(),
    title: "New conversation",
    messages: [
      {
        id: "initial",
        role: "ai",
        content: `Welcome back to ArticulateX Studio, ${userEmail?.split("@")[0].toUpperCase() || "friend"}. What course topic or communication question can I help with?`,
      },
    ],
    updatedAt: Date.now(),
  };
}

export function readStudioThreads(): StudioThread[] {
  try {
    const saved = localStorage.getItem(STUDIO_THREADS_KEY);
    if (!saved) return [];
    const threads = JSON.parse(saved) as StudioThread[];
    return Array.isArray(threads) ? threads : [];
  } catch {
    return [];
  }
}

export function writeStudioThreads(threads: StudioThread[]) {
  localStorage.setItem(STUDIO_THREADS_KEY, JSON.stringify(threads));
  window.dispatchEvent(new Event(STUDIO_THREADS_EVENT));
}
