"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, MessageSquareHeart, Send, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const CATEGORIES = ["Bug Report", "Feature Request", "General Feedback", "Testimonial"];

export default function FeedbackPage() {
  const [category, setCategory] = useState("General Feedback");
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || message.length < 5) {
      toast.error("Please provide a bit more detail in your message.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, rating, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit feedback");
      }

      toast.success("Thank you! Your feedback has been sent directly to our team.");
      setMessage("");
      setRating(5);
      setCategory("General Feedback");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-[var(--bg)] px-4 py-12 md:px-8 md:py-20">
      {/* Back Button */}
      <div className="absolute left-6 top-6 md:left-12 md:top-12">
        <Link 
          href="/"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] text-[var(--ink)] transition-transform hover:scale-105 hover:bg-[color:color-mix(in_srgb,var(--ink)_8%,transparent)] active:scale-95"
        >
          <ArrowLeft size={24} />
        </Link>
      </div>

      <div className="mx-auto w-full max-w-3xl flex-1">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 mt-12 text-center md:mt-0"
        >
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--ink)_5%,transparent)] text-[var(--ink)]">
            <MessageSquareHeart size={36} strokeWidth={1.5} />
          </div>
          <h1 className="font-sans text-[clamp(36px,6vw,56px)] font-semibold tracking-tight text-[var(--ink)]">
            Share Your Thoughts
          </h1>
          <p className="mx-auto mt-6 max-w-xl font-sans text-[18px] leading-relaxed text-[color:color-mix(in_srgb,var(--ink)_60%,transparent)]">
            Help us shape the future of ArticulateX. We read every single piece of feedback to improve your experience.
          </p>
        </motion.div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden rounded-[2.5rem] bg-[color:color-mix(in_srgb,var(--ink)_3%,transparent)] p-6 md:p-12"
          style={{ WebkitBackdropFilter: "blur(60px) saturate(180%)", backdropFilter: "blur(60px) saturate(180%)" }}
        >
          <form onSubmit={handleSubmit} className="space-y-12">
            
            {/* Category Selection */}
            <div>
              <label className="mb-4 block font-sans text-[13px] font-semibold uppercase tracking-widest text-[color:color-mix(in_srgb,var(--ink)_50%,transparent)]">
                What is this regarding?
              </label>
              <div className="flex flex-wrap gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`rounded-full px-6 py-3 font-sans text-[15px] font-medium transition-all duration-300 ${
                      category === cat
                        ? "bg-[var(--ink)] text-[var(--bg)] shadow-lg scale-105"
                        : "bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] text-[var(--ink)] hover:bg-[color:color-mix(in_srgb,var(--ink)_8%,transparent)]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="mb-4 block font-sans text-[13px] font-semibold uppercase tracking-widest text-[color:color-mix(in_srgb,var(--ink)_50%,transparent)]">
                How would you rate your experience?
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-2 transition-transform hover:scale-110"
                  >
                    <Star
                      size={32}
                      className={`transition-colors duration-300 ${
                        star <= (hoveredRating || rating)
                          ? "fill-[var(--ink)] text-[var(--ink)]"
                          : "fill-transparent text-[color:color-mix(in_srgb,var(--ink)_20%,transparent)]"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="mb-4 block font-sans text-[13px] font-semibold uppercase tracking-widest text-[color:color-mix(in_srgb,var(--ink)_50%,transparent)]">
                Your Feedback
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what you love, what's missing, or what could be better..."
                className="min-h-[200px] w-full resize-none rounded-[1.5rem] bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] p-6 font-sans text-[16px] leading-relaxed text-[var(--ink)] placeholder-[color:color-mix(in_srgb,var(--ink)_40%,transparent)] outline-none transition-colors focus:bg-[color:color-mix(in_srgb,var(--ink)_6%,transparent)]"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="group flex w-full items-center justify-center gap-3 rounded-full bg-[var(--ink)] py-5 font-sans text-[16px] font-medium text-[var(--bg)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Feedback
                    <Send size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}