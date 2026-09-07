import { NextRequest, NextResponse } from "next/server";
import { createSession, destroySession, isValidSession } from "@/lib/sessions";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, password, sessionId } = body;

  if (action === "signin") {
    if (process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ success: true, sessionId: createSession() });
    }
    return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 });
  }

  if (action === "signout") {
    if (sessionId) destroySession(sessionId);
    return NextResponse.json({ success: true });
  }

  if (action === "session") {
    if (isValidSession(sessionId)) {
      return NextResponse.json({ authenticated: true, user: { id: "admin", name: "Admin" } });
    }
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
