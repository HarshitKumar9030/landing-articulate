"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Loader2, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import {
  ACTIVE_STUDIO_THREAD_KEY,
  createStudioThread,
  readStudioThreads,
  STUDIO_THREADS_EVENT,
  StudioMessage,
  writeStudioThreads,
} from "@/lib/studio-threads";

type Message = StudioMessage;

export function StudioChat({ userEmail }: { userEmail: string | null | undefined }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const threads = readStudioThreads();
    const savedActiveId = localStorage.getItem(ACTIVE_STUDIO_THREAD_KEY);
    const initialThreads = threads.length > 0 ? threads : [createStudioThread(userEmail)];
    const activeThread = initialThreads.find((thread) => thread.id === savedActiveId) || initialThreads[0];

    if (threads.length === 0) writeStudioThreads(initialThreads);
    localStorage.setItem(ACTIVE_STUDIO_THREAD_KEY, activeThread.id);
    setThreadId(activeThread.id);
    setMessages(activeThread.messages);

    const handleThreadChange = () => {
      const activeId = localStorage.getItem(ACTIVE_STUDIO_THREAD_KEY);
      const nextThread = readStudioThreads().find((thread) => thread.id === activeId);
      if (nextThread) {
        if (nextThread.id === threadId && JSON.stringify(nextThread.messages) === JSON.stringify(messages)) return;
        setThreadId(nextThread.id);
        setMessages(nextThread.messages);
      }
    };

    window.addEventListener(STUDIO_THREADS_EVENT, handleThreadChange);
    window.addEventListener("storage", handleThreadChange);
    return () => {
      window.removeEventListener(STUDIO_THREADS_EVENT, handleThreadChange);
      window.removeEventListener("storage", handleThreadChange);
    };
  }, [messages, threadId, userEmail]);

  useEffect(() => {
    if (!threadId || messages.length === 0) return;
    const threads = readStudioThreads();
    const currentThread = threads.find((thread) => thread.id === threadId);
    if (!currentThread) return;

    const firstUserMessage = messages.find((message) => message.role === "user");
    const title = firstUserMessage?.content.slice(0, 42) || currentThread.title;
    writeStudioThreads(
      threads.map((thread) =>
        thread.id === threadId ? { ...thread, title, messages, updatedAt: Date.now() } : thread
      )
    );
  }, [messages, threadId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const apiMessages = [...messages, userMsg].map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, mode: "studio" }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();
      let aiMessage = "";
      const aiMessageId = (Date.now() + 1).toString();

      setMessages((prev) => [...prev, { id: aiMessageId, role: "ai", content: "" }]);
      setIsLoading(false);

      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (value) {
          buffer += decoder.decode(value, { stream: true });
        }
        
        const parts = buffer.split(/\r?\n\r?\n/);
        const lastPart = parts.pop() || "";
        buffer = done ? "" : lastPart;
        
        const eventsToProcess = done ? [...parts, lastPart] : parts;
        
        for (const event of eventsToProcess) {
          if (!event.trim()) continue;
          
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
    <div className="flex h-full w-full flex-col">
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-12 scrollbar-hide">
        <div className="mx-auto flex max-w-3xl flex-col gap-8">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start gap-4"}`}
              >
                {msg.role === "ai" && (
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--ink)] text-[var(--bg)]">
                    <Bot size={16} />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-[1.5rem] px-6 py-4 font-sans text-[15px] leading-relaxed tracking-tight ${
                    msg.role === "user"
                      ? "bg-[color:color-mix(in_srgb,var(--ink)_5%,transparent)] text-[var(--ink)]"
                      : "text-[var(--ink)]"
                  }`}
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start gap-4"
            >
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--ink)] text-[var(--bg)]">
                <Bot size={16} />
              </div>
              <div className="flex items-center gap-2 px-2 py-4">
                <Loader2 className="h-4 w-4 animate-spin text-[var(--ink)] opacity-40" />
                <span className="font-sans text-[14px] text-[color:color-mix(in_srgb,var(--ink)_50%,transparent)]">
                  Thinking...
                </span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-6 md:p-8">
        <div className="mx-auto max-w-3xl">
          <form
            onSubmit={handleSubmit}
            className="relative flex w-full items-center overflow-hidden rounded-[1.5rem] bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] transition-colors focus-within:bg-[color:color-mix(in_srgb,var(--ink)_6%,transparent)]"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message Studio..."
              className="w-full bg-transparent px-6 py-4 font-sans text-[15px] tracking-tight text-[var(--ink)] placeholder-[color:color-mix(in_srgb,var(--ink)_40%,transparent)] outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="mr-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--ink)] text-[var(--bg)] transition-transform duration-300 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100"
            >
              <ArrowUp size={18} strokeWidth={2.5} />
            </button>
          </form>
          <p className="mt-3 text-center font-sans text-[12px] text-[color:color-mix(in_srgb,var(--ink)_40%,transparent)]">
            AI can make mistakes. Consider verifying important information.
          </p>
        </div>
      </div>
    </div>
  );
}
