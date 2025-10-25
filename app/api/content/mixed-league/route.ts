import { NextRequest, NextResponse } from "next/server";
import { getMixedLeagueContent, updateMixedLeagueContent } from "@/lib/content";

export async function GET() {
  try {
    const content = await getMixedLeagueContent();
    return NextResponse.json(content);
  } catch (error) {
    console.error("Error fetching content:", error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // In production, add proper authentication here
    // For now, we'll rely on the admin middleware protection
    const body = await request.json();
    await updateMixedLeagueContent(body);

    return NextResponse.json({ success: true, message: "Content updated successfully" });
  } catch (error) {
    console.error("Error updating content:", error);
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}

