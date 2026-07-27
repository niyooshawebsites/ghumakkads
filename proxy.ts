// proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(req: NextRequest) {
  // Example: Redirect users based on authentication
  const session = await auth();

  if (!session && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// Optional: Filter where the proxy runs
export const config = {
  matcher: "/dashboard/:path*",
};
