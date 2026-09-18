"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ArrowUp, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
};

export function OnboardingChat({ userEmail }: { userEmail: string | null | undefined }) {
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasNotifiedTeam, setHasNotifiedTeam] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const courses = [
    "Executive Presence",
    "Storytelling for Leaders",
    "Crisis Communication",
    "Keynote Mastery"
  ];

  // Load saved state on mount
  useEffect(() => {
    const savedCourse = localStorage.getItem("onboarding_course");
    const savedMessages = localStorage.getItem("onboarding_messages");
    const savedNotified = localStorage.getItem("onboarding_notified");
    
    if (savedCourse) setSelectedCourse(savedCourse);
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error("Failed to parse saved messages");
      }
    }
    if (savedNotified === "true") {
      setHasNotifiedTeam(true);
      router.push("/dashboard");
    }
  }, []);

  // Save state on change
  useEffect(() => {
    if (selectedCourse) localStorage.setItem("onboarding_course", selectedCourse);
  }, [selectedCourse]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("onboarding_messages", JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (hasNotifiedTeam) {
      localStorage.setItem("onboarding_notified", "true");
    }
  }, [hasNotifiedTeam]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (selectedCourse && messages.length === 0) {
      setMessages([
        {
          id: "initial",
          role: "ai",
          content: `Welcome to the room, ${userEmail || "friend"}. I see you're interested in ${selectedCourse}. I'm here to help set your stage. Tell me, what are your primary goals for this focus area?`,
        },
      ]);
    }
  }, [selectedCourse, userEmail, messages.length]);

  useEffect(() => {
    // GSAP entrance animation for the chat container
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 40, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out" }
      );
    }
  }, []);

  const notifyTeam = async (fullConversation: Message[]) => {
    if (hasNotifiedTeam) return;
    
    const transcript = fullConversation
      .map(m => `${m.role === 'ai' ? 'AI' : 'User'}: ${m.content}`)
      .join('\n\n');
      
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "System",
          email: userEmail || "unknown@example.com",
          interest: "Onboarding Chat Completed",
          message: `User ${userEmail} has completed the AI onboarding chat and is ready for a Google Meet.\n\nTranscript:\n${transcript}`,
        }),
      });
      setHasNotifiedTeam(true);
      
      // Redirect to dashboard after a short delay to let the user read the final message
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    } catch (error) {
      console.error("Failed to notify team:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // Gemini requires the first message to be from the user.
      // We prepend a hidden user message to establish context if the first visible message is from the AI.
      const apiMessages = [
        { role: "user", content: `Hi, I'm ready to start my onboarding for the ${selectedCourse} course.` },
        ...messages,
        userMsg
      ].map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, mode: "onboarding" }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error:", errorData);
        throw new Error(errorData.error || "Failed to get response");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();
      let aiMessage = "";
      const aiMessageId = (Date.now() + 1).toString();

      setMessages((prev) => [...prev, { id: aiMessageId, role: "ai", content: "" }]);
      setIsLoading(false); // Stop loading state since we are streaming

      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (value) {
          buffer += decoder.decode(value, { stream: true });
        }
        
        // SSE events are separated by double newlines
        const parts = buffer.split(/\r?\n\r?\n/);
        
        // Keep the last potentially incomplete event in the buffer
        const lastPart = parts.pop() || "";
        buffer = done ? "" : lastPart;
        
        const eventsToProcess = done ? [...parts, lastPart] : parts;
        
        for (const event of eventsToProcess) {
          if (!event.trim()) continue;
          
          // Extract data from the event (handles both single-line and multi-line data payloads)
          const dataStr = event
            .split(/\r?\n/)
            .filter(line => line.startsWith('data:'))
            .map(line => line.replace(/^data:\s*/, ''))
            .join('');
            
          if (!dataStr || dataStr === '[DONE]') continue;
          
          try {
            const data = JSON.parse(dataStr);
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              aiMessage += text;
              
              // Check for the trigger phrase
              if (aiMessage.includes("[MEETING_SCHEDULED]")) {
                aiMessage = aiMessage.replace("[MEETING_SCHEDULED]", "");
                if (!hasNotifiedTeam) {
                  // Pass the full conversation including this final message
                  const fullConversation = [...messages, userMsg, { id: aiMessageId, role: "ai" as const, content: aiMessage }];
                  notifyTeam(fullConversation);
                }
              }
              
              setMessages((prev) => 
                prev.map((m) => m.id === aiMessageId ? { ...m, content: aiMessage } : m)
              );
            }
          } catch (e) {
            console.error("Failed to parse event:", dataStr, e);
          }
        }
        
        if (done) break;
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "ai", content: "I'm having trouble connecting right now. Please try again." },
      ]);
      setIsLoading(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative mx-auto flex h-[75vh] w-full max-w-4xl flex-col overflow-hidden rounded-[2.5rem] bg-[color:color-mix(in_srgb,var(--ink)_2%,transparent)]"
      style={{
        // Apple-like liquid glass without gradients, borders, or shadows
        WebkitBackdropFilter: "blur(60px) saturate(180%)",
        backdropFilter: "blur(60px) saturate(180%)",
      }}
    >
      {!selectedCourse ? (
        <div className="flex h-full flex-col items-center justify-center p-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            <h2 className="mb-4 font-sans text-[clamp(28px,4vw,40px)] font-medium tracking-tight text-[var(--ink)]">
              Select your focus area
            </h2>
            <p className="mb-12 max-w-md font-sans text-[16px] leading-relaxed text-[color:color-mix(in_srgb,var(--ink)_60%,transparent)]">
              Choose the path that aligns with your goals. This helps us calibrate your onboarding experience.
            </p>
            
            <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
              {courses.map((course, idx) => (
                <motion.button
                  key={course}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => setSelectedCourse(course)}
                  className="group relative flex flex-col items-start justify-between overflow-hidden rounded-[2rem] bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] p-6 text-left transition-all duration-500 hover:bg-[color:color-mix(in_srgb,var(--ink)_8%,transparent)] hover:scale-[1.02] active:scale-[0.98]"
                  style={{ WebkitBackdropFilter: "blur(20px)", backdropFilter: "blur(20px)" }}
                >
                  <span className="font-sans text-[18px] font-medium tracking-tight text-[var(--ink)]">
                    {course}
                  </span>
                  <div className="mt-8 flex h-10 w-10 items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--ink)_6%,transparent)] text-[var(--ink)] transition-transform duration-500 group-hover:translate-x-2 group-hover:bg-[var(--ink)] group-hover:text-[var(--bg)]">
                    <ArrowUp className="h-5 w-5 rotate-45" strokeWidth={2} />
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      ) : (
        <>
          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 md:p-12 scrollbar-hide">
        <div className="flex flex-col gap-8">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20, filter: "blur(10px)", scale: 0.95 }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-[2rem] px-8 py-5 font-sans text-[16px] leading-relaxed tracking-tight ${
                    msg.role === "user"
                      ? "bg-[var(--ink)] text-[var(--bg)]"
                      : "bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] text-[var(--ink)]"
                  }`}
                  style={{
                    WebkitBackdropFilter: msg.role === "ai" ? "blur(20px)" : "none",
                    backdropFilter: msg.role === "ai" ? "blur(20px)" : "none",
                  }}
                >
                  {msg.role === "ai" ? (
                    <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-p:text-[var(--ink)] prose-headings:text-[var(--ink)] prose-li:text-[var(--ink)] prose-strong:text-[var(--ink)] prose-strong:font-semibold prose-pre:bg-[color:color-mix(in_srgb,var(--ink)_5%,transparent)] prose-pre:text-[var(--ink)] prose-code:text-[var(--ink)] prose-code:bg-[color:color-mix(in_srgb,var(--ink)_5%,transparent)] prose-code:px-1 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none prose-a:text-[var(--ink)] prose-a:underline-offset-4 hover:prose-a:text-[color:color-mix(in_srgb,var(--ink)_70%,transparent)] text-[var(--ink)]">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              className="flex justify-start"
            >
              <div 
                className="flex items-center gap-3 rounded-[2rem] bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] px-8 py-5"
                style={{ WebkitBackdropFilter: "blur(20px)", backdropFilter: "blur(20px)" }}
              >
                <Loader2 className="h-5 w-5 animate-spin text-[var(--ink)] opacity-40" />
                <span className="font-sans text-[15px] tracking-tight text-[color:color-mix(in_srgb,var(--ink)_50%,transparent)]">
                  Thinking...
                </span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} className="h-8" />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-6 md:p-8">
        <form
          onSubmit={handleSubmit}
          className="relative flex w-full items-center overflow-hidden rounded-full bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] transition-colors focus-within:bg-[color:color-mix(in_srgb,var(--ink)_6%,transparent)]"
          style={{ WebkitBackdropFilter: "blur(30px)", backdropFilter: "blur(30px)" }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your response..."
            className="w-full bg-transparent px-8 py-5 font-sans text-[16px] tracking-tight text-[var(--ink)] placeholder-[color:color-mix(in_srgb,var(--ink)_30%,transparent)] outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="mr-3 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--ink)] text-[var(--bg)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100"
          >
            <ArrowUp size={20} strokeWidth={2.5} />
          </button>
        </form>
      </div>
        </>
      )}
    </div>
  );
}