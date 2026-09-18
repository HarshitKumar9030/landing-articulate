import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/db";

const feedbackSchema = z.object({
  category: z.enum(["Bug Report", "Feature Request", "General Feedback", "Testimonial"]),
  rating: z.number().min(1).max(5),
  message: z.string().trim().min(5).max(2000),
});

// Rate limiter: Max 3 feedbacks per 15 minutes per IP
const attempts = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now(); 
  const windowStart = now - 15 * 60_000;
  const recent = (attempts.get(ip) ?? []).filter((time) => time > windowStart);
  recent.push(now); 
  attempts.set(ip, recent);
  return recent.length > 3;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    
    // 1. Spam Prevention: Rate Limiting
    if (rateLimited(ip)) {
      return NextResponse.json({ error: "You've submitted too much feedback recently. Please wait a bit." }, { status: 429 });
    }

    // 2. Input Validation
    const body = await request.json();
    const parsed = feedbackSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid feedback format." }, { status: 400 });
    }
    
    const { category, rating, message } = parsed.data;
    const now = new Date();

    // 3. Save to Database
    try {
      const db = await getDb();
      await db.collection("feedbacks").insertOne({
        category,
        rating,
        message,
        ip,
        createdAt: now,
      });
    } catch (dbError) {
      console.error("Failed to save feedback to DB:", dbError);
      // Continue to send email even if DB fails
    }

    // 4. Send Email Notification via Mailgun
    const mailgunDomain = process.env.MAILGUN_DOMAIN;
    const mailgunApiKey = process.env.MAILGUN_API_KEY;
    const mailgunFrom = process.env.MAILGUN_FROM_EMAIL || `noreply@${mailgunDomain}`;
    
    if (mailgunDomain && mailgunApiKey) {
      const formData = new URLSearchParams();
      formData.append("from", `ArticulateX Feedback <${mailgunFrom}>`);
      formData.append("to", "harshit@articulatex.in");
      formData.append("subject", `New Feedback: ${category} (${rating}/5 Stars)`);
      formData.append("text", `Category: ${category}\nRating: ${rating}/5\n\nMessage:\n${message}\n\nIP: ${ip}`);
      
      try {
        const mailRes = await fetch(`https://api.mailgun.net/v3/${mailgunDomain}/messages`, {
          method: "POST",
          headers: {
            Authorization: `Basic ${Buffer.from(`api:${mailgunApiKey}`).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        });
        
        if (!mailRes.ok) {
          console.error("Mailgun error:", await mailRes.text());
        }
      } catch (mailErr) {
        console.error("Failed to send email:", mailErr);
      }
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Feedback API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
