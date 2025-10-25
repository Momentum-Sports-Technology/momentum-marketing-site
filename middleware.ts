import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Simple middleware - NextAuth session check will be handled in the pages
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

