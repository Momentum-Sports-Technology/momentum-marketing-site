import { NextRequest, NextResponse } from "next/server";
import { isValidSession, sessionFromRequest } from "@/lib/sessions";
import { isSubmissionKind, readSubmissions, submissionsToCsv } from "@/lib/submissions";

type Params = { params: Promise<{ kind: string }> };

/** Admin only. `?format=csv` downloads the file as CSV; otherwise JSON, newest first. */
export async function GET(request: NextRequest, { params }: Params) {
  const { kind } = await params;
  if (!isSubmissionKind(kind)) {
    return NextResponse.json({ error: "Unknown submission type" }, { status: 404 });
  }
  if (!isValidSession(sessionFromRequest(request))) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const records = readSubmissions(kind);
  if (request.nextUrl.searchParams.get("format") === "csv") {
    const date = new Date().toISOString().slice(0, 10);
    return new NextResponse(submissionsToCsv(kind, records), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="momentum-${kind}-${date}.csv"`,
      },
    });
  }
  return NextResponse.json({ kind, count: records.length, records });
}
