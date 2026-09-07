// Outbound email through Resend's HTTP API. No SDK dependency needed.
// Without RESEND_API_KEY the message is logged and the call reports
// `sent: false`, so forms still succeed in development.

const FROM = process.env.EMAIL_FROM || "Momentum Netball <noreply@momentumnetball.co.uk>";
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "hello@momentumnetball.co.uk";

interface SendArgs {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}

export async function sendEmail({
  to,
  subject,
  text,
  replyTo,
}: SendArgs): Promise<{ sent: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(`[email] RESEND_API_KEY not set. Would send to ${to}: ${subject}\n${text}`);
    return { sent: false };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to: [to], subject, text, reply_to: replyTo }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend ${response.status}: ${body}`);
  }
  return { sent: true };
}

export function escapeForEmail(value: unknown): string {
  return String(value ?? "")
    .replace(/[\r\n]+/g, " ")
    .trim();
}
