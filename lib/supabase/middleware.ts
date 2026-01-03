// middleware.ts
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
