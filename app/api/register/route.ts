import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ADMIN_EMAIL, escapeForEmail, sendEmail } from "@/lib/email";
import { appendSubmission } from "@/lib/submissions";

const registrationSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(1).max(40),
  experience: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
  message: z.string().trim().max(4000).optional().default(""),
  website: z.string().max(0).optional().default(""),
});

export async function POST(request: NextRequest) {
  const parsed = registrationSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const data = parsed.data;

  try {
    appendSubmission("register", data);
    await sendEmail({
      to: ADMIN_EMAIL,
      replyTo: data.email,
      subject: `Mixed League registration: ${escapeForEmail(data.name)}`,
      text: [
        `Name: ${escapeForEmail(data.name)}`,
        `Email: ${escapeForEmail(data.email)}`,
        `Phone: ${escapeForEmail(data.phone)}`,
        `Experience: ${data.experience}`,
        "",
        data.message || "(no message)",
      ].join("\n"),
    });
    return NextResponse.json({ success: true, message: "Registration received" });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Failed to process registration" }, { status: 500 });
  }
}
