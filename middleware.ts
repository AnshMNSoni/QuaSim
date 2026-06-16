import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { middleware as supabaseMiddleware } from "./lib/supabase/middleware"

export function middleware(req: NextRequest) {
  // Run the Netlify preview redirect middleware
  return supabaseMiddleware(req)
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
