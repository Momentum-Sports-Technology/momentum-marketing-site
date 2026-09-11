// Outbound email through SendGrid's v3 HTTP API. No SDK dependency needed.
// The same SendGrid account sends the booking site's email, with
// momentumnetball.co.uk authenticated as a sending domain. Without
// SENDGRID_API_KEY the message is logged and the call reports `sent: false`,
// so forms still succeed in development.

const FROM_EMAIL = process.env.EMAIL_FROM_ADDRESS || "noreply@momentumnetball.co.uk";
const FROM_NAME = process.env.EMAIL_FROM_NAME || "Momentum Netball";
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
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    console.warn(`[email] SENDGRID_API_KEY not set. Would send to ${to}: ${subject}\n${text}`);
    return { sent: false };
  }

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: FROM_EMAIL, name: FROM_NAME },
      ...(replyTo ? { reply_to: { email: replyTo } } : {}),
      subject,
      content: [{ type: "text/plain", value: text }],
    }),
  });

  // SendGrid answers 202 Accepted on success, with an empty body.
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`SendGrid ${response.status}: ${body}`);
  }
  return { sent: true };
}

export function escapeForEmail(value: unknown): string {
  return String(value ?? "")
    .replace(/[\r\n]+/g, " ")
    .trim();
}
