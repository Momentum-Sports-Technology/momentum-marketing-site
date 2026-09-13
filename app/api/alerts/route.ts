import { NextRequest, NextResponse } from "next/server";
import { isValidSession, sessionFromRequest } from "@/lib/sessions";
import { clearAlerts, readAlerts } from "@/lib/alerts";

/** Admin only. GET lists outstanding alerts, DELETE dismisses them all. */
export async function GET(request: NextRequest) {
  if (!isValidSession(sessionFromRequest(request))) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }
  const alerts = readAlerts();
  return NextResponse.json({ count: alerts.length, alerts });
}

export async function DELETE(request: NextRequest) {
  if (!isValidSession(sessionFromRequest(request))) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }
  clearAlerts();
  return NextResponse.json({ success: true });
}
