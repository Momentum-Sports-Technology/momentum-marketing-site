import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ADMIN_EMAIL, escapeForEmail, sendEmail } from "@/lib/email";
import { appendSubmission } from "@/lib/submissions";

// Sign-ups are appended to data/newsletter.jsonl and emailed to the admin
// inbox. Wire a mailing tool here once the list destination is decided.

const schema = z.object({
  email: z.string().trim().email().max(200),
  website: z.string().max(0).optional().default(""),
});

export async function POST(request: NextRequest) {
  const parsed = schema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
  }

  try {
    appendSubmission("newsletter", { email: parsed.data.email });
    await sendEmail({
      to: ADMIN_EMAIL,
      subject: "New newsletter sign-up",
      text: `${escapeForEmail(parsed.data.email)} signed up for news and events on the website.`,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter error:", error);
    return NextResponse.json({ error: "We could not save your sign-up" }, { status: 500 });
  }
}
