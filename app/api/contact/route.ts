import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ADMIN_EMAIL, escapeForEmail, sendEmail } from "@/lib/email";
import { appendSubmission } from "@/lib/submissions";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional().default(""),
  interest: z.string().trim().max(80).optional().default("General enquiry"),
  message: z.string().trim().min(1).max(4000),
  // Honeypot. Real browsers leave it empty.
  website: z.string().max(0).optional().default(""),
});

export async function POST(request: NextRequest) {
  const parsed = contactSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form and try again" }, { status: 400 });
  }
  const data = parsed.data;

  try {
    appendSubmission("contact", data);
    await sendEmail({
      to: ADMIN_EMAIL,
      replyTo: data.email,
      subject: `Website enquiry: ${escapeForEmail(data.interest)} from ${escapeForEmail(data.name)}`,
      text: [
        `Name: ${escapeForEmail(data.name)}`,
        `Email: ${escapeForEmail(data.email)}`,
        `Phone: ${escapeForEmail(data.phone) || "-"}`,
        `Interest: ${escapeForEmail(data.interest)}`,
        "",
        data.message,
      ].join("\n"),
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact error:", error);
    return NextResponse.json({ error: "We could not send your message" }, { status: 500 });
  }
}
