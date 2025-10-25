import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface RegistrationData {
  name: string;
  email: string;
  phone: string;
  experience: string;
  message: string;
  timestamp: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.name || !body.email || !body.phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create registrations directory if it doesn't exist
    const registrationsDir = path.join(process.cwd(), "data", "registrations");
    if (!fs.existsSync(registrationsDir)) {
      fs.mkdirSync(registrationsDir, { recursive: true });
    }

    // Save registration data
    const registration: RegistrationData = {
      ...body,
      timestamp: new Date().toISOString(),
    };

    const filename = `registration-${Date.now()}.json`;
    const filepath = path.join(registrationsDir, filename);

    fs.writeFileSync(filepath, JSON.stringify(registration, null, 2));

    // TODO: In production, send email notification here
    // Example with Resend:
    // if (process.env.RESEND_API_KEY) {
    //   const resend = new Resend(process.env.RESEND_API_KEY);
    //   await resend.emails.send({
    //     from: 'Momentum Netball <noreply@momentumnetball.co.uk>',
    //     to: process.env.ADMIN_EMAIL || 'admin@momentumnetball.co.uk',
    //     subject: 'New Mixed League Registration',
    //     html: `<p>New registration from ${registration.name}</p>...`
    //   });
    // }

    return NextResponse.json({ success: true, message: "Registration received" });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Failed to process registration" }, { status: 500 });
  }
}

