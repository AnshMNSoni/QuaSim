import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const host = req.nextUrl.hostname

  // Redirect ALL netlify preview/branch URLs to production
  if (
    host.endsWith(".netlify.app") &&
    host !== "quasimdottech.netlify.app"
  ) {
    const url = req.nextUrl.clone()
    url.hostname = "quasimdottech.netlify.app"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
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
