import { NextRequest, NextResponse } from "next/server";

// Simple session store (in production, use a proper database or session store)
const sessions = new Map<string, { userId: string; expiresAt: number }>();

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, password, sessionId } = body;

  if (action === "signin") {
    // Check password
    if (password === process.env.ADMIN_PASSWORD) {
      // Create session
      const newSessionId = crypto.randomUUID();
      sessions.set(newSessionId, {
        userId: "admin",
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      });

      return NextResponse.json({
        success: true,
        sessionId: newSessionId,
      });
    }

    return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 });
  }

  if (action === "signout") {
    if (sessionId) {
      sessions.delete(sessionId);
    }
    return NextResponse.json({ success: true });
  }

  if (action === "session") {
    if (sessionId) {
      const session = sessions.get(sessionId);
      if (session && session.expiresAt > Date.now()) {
        return NextResponse.json({
          authenticated: true,
          user: { id: session.userId, name: "Admin" },
        });
      }
      sessions.delete(sessionId);
    }
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
