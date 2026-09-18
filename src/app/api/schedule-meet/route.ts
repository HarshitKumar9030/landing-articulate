import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { z } from "zod";

const scheduleSchema = z.object({
  date: z.string().min(1),
  time: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = scheduleSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid date or time." }, { status: 400 });
    }
    
    const { date, time } = parsed.data;
    const db = await getDb();
    const now = new Date();

    // Update the lead in the database with the meeting request
    const lead = await db.collection("leads").findOne({ email: session.user.email });
    const currentNotes = lead?.notes || "";
    const newNote = `\n[${now.toISOString()}] Meeting requested for ${date} at ${time}`;
    
    await db.collection("leads").updateOne(
      { email: session.user.email },
      { 
        $set: { 
          updatedAt: now, 
          lastContactAt: now,
          notes: currentNotes + newNote
        }
      }
    );

    // Send email notification via Mailgun
    const mailgunDomain = process.env.MAILGUN_DOMAIN;
    const mailgunApiKey = process.env.MAILGUN_API_KEY;
    const mailgunFrom = process.env.MAILGUN_FROM_EMAIL || `noreply@${mailgunDomain}`;
    
    if (mailgunDomain && mailgunApiKey) {
      const formData = new URLSearchParams();
      formData.append("from", `ArticulateX System <${mailgunFrom}>`);
      formData.append("to", "harshit@articulatex.in");
      formData.append("subject", `Meeting Request: ${session.user.name || session.user.email}`);
      formData.append("text", `User: ${session.user.name || 'Unknown'}\nEmail: ${session.user.email}\n\nRequested a Google Meet for:\nDate: ${date}\nTime: ${time}\n\nPlease check the management portal to confirm and send the invite.`);
      
      try {
        await fetch(`https://api.mailgun.net/v3/${mailgunDomain}/messages`, {
          method: "POST",
          headers: {
            Authorization: `Basic ${Buffer.from(`api:${mailgunApiKey}`).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        });
      } catch (mailErr) {
        console.error("Failed to send email:", mailErr);
      }
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Schedule API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
