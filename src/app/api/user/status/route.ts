import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();
    const lead = await db.collection("leads").findOne({ email: session.user.email });

    if (!lead) {
      return NextResponse.json({ stage: "new", isActive: false });
    }

    const isActive = lead.stage === "won" || lead.stage === "active";

    return NextResponse.json({ 
      stage: lead.stage, 
      isActive,
      curriculum: lead.curriculum || null
    });
  } catch (error) {
    console.error("Error fetching user status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
