import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/db";

type ContactSubmission = { interest: string; message: string; receivedAt: Date; channel: "website" };
type WebsiteLead = {
  name: string; email: string; company: string; title: string; source: string; stage: string; tags: string[]; notes: string; createdAt: Date;
  updatedAt?: Date; lastContactAt?: Date; lastInterest?: string; lastInquiry?: string; contactSubmissions?: ContactSubmission[];
};

const submissionSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email().max(254),
  interest: z.string().trim().min(2).max(80),
  message: z.string().trim().min(10).max(5_000),
});

const attempts = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now(); const windowStart = now - 15 * 60_000;
  const recent = (attempts.get(ip) ?? []).filter((time) => time > windowStart);
  recent.push(now); attempts.set(ip, recent);
  return recent.length > 5;
}

export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get("origin");
    const allowedOrigins = (process.env.ALLOWED_CONTACT_ORIGINS ?? "https://articulatex.in,https://www.articulatex.in").split(",").map((value) => value.trim()).filter(Boolean);
    if (process.env.NODE_ENV === "production" && origin && !allowedOrigins.includes(origin)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (rateLimited(ip)) return NextResponse.json({ error: "Please wait a few minutes before trying again." }, { status: 429 });
    const input = submissionSchema.parse(await request.json());
    const db = await getDb(); const now = new Date();
    const submission: ContactSubmission = { interest: input.interest, message: input.message, receivedAt: now, channel: "website" };
    await db.collection<WebsiteLead>("leads").updateOne(
      { email: input.email },
      { $setOnInsert: { name: input.name, email: input.email, company: "", title: "", source: "Website", stage: "new", tags: ["website"], notes: input.message, createdAt: now }, $set: { updatedAt: now, lastContactAt: now, lastInterest: input.interest, lastInquiry: input.message }, $push: { contactSubmissions: { $each: [submission], $slice: -20 } } },
      { upsert: true },
    );
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: "Please complete every field with valid details." }, { status: 400 });
    return NextResponse.json({ error: "We could not send your inquiry. Please try again." }, { status: 500 });
  }
}
