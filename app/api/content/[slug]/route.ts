import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { getContent, isContentSlug, updateContent } from "@/lib/content";
import { isValidSession, sessionFromRequest } from "@/lib/sessions";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { slug } = await params;
  if (!isContentSlug(slug)) {
    return NextResponse.json({ error: "Unknown content" }, { status: 404 });
  }
  try {
    return NextResponse.json(await getContent(slug));
  } catch (error) {
    console.error(`Error reading content ${slug}:`, error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { slug } = await params;
  if (!isContentSlug(slug)) {
    return NextResponse.json({ error: "Unknown content" }, { status: 404 });
  }
  if (!isValidSession(sessionFromRequest(request))) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }
  try {
    await updateContent(slug, await request.json());
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Content failed validation",
          issues: error.issues.map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`),
        },
        { status: 400 }
      );
    }
    console.error(`Error writing content ${slug}:`, error);
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}
