import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { escapeForEmail, notifyAdmin } from "@/lib/email";
import { appendSubmission } from "@/lib/submissions";

// Sign-ups are appended to data/newsletter.jsonl and emailed to the admin
// inbox. Wire a mailing tool here once the list destination is decided.

const schema = z.object({
  email: z.string().trim().email().max(200),
  name: z.string().trim().max(120).optional().default(""),
  phone: z.string().trim().max(40).optional().default(""),
  /** Which page the sign-up came from, e.g. "basingstoke". */
  source: z.string().trim().max(60).optional().default("website"),
  website: z.string().max(0).optional().default(""),
});

export async function POST(request: NextRequest) {
  const parsed = schema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
  }

  try {
    const { email, name, phone, source } = parsed.data;
    appendSubmission("newsletter", { email, name, phone, source });
    await notifyAdmin({
      replyTo: email,
      subject: `New sign-up (${escapeForEmail(source)}): ${escapeForEmail(name) || escapeForEmail(email)}`,
      text: [
        `Email: ${escapeForEmail(email)}`,
        `Name: ${escapeForEmail(name) || "-"}`,
        `Mobile: ${escapeForEmail(phone) || "-"}`,
        `Source: ${escapeForEmail(source)}`,
      ].join("\n"),
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter error:", error);
    return NextResponse.json({ error: "We could not save your sign-up" }, { status: 500 });
  }
}
