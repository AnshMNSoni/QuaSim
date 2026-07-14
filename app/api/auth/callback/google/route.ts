import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  if (error || !code) {
    console.error("[Google Auth Callback] Error or missing code:", error)
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
  }

  try {
    const googleClientId = process.env.GOOGLE_CLIENT_ID
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || "" // Expects GOOGLE_CLIENT_SECRET from .env.local

    const redirectUri = `${origin}/api/auth/callback/google`

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: googleClientId!,
        client_secret: googleClientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error("[Google Auth Callback] Token exchange failed:", errorText)
      return NextResponse.redirect(`${origin}/auth/auth-code-error`)
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Fetch user profile info
    const userinfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!userinfoResponse.ok) {
      console.error("[Google Auth Callback] Failed to fetch userinfo")
      return NextResponse.redirect(`${origin}/auth/auth-code-error`)
    }

    const googleUser = await userinfoResponse.json()

    // Create session and set cookie
    await createSession({
      id: googleUser.sub || `google-${Date.now()}`,
      email: googleUser.email,
      user_metadata: {
        avatar_url: googleUser.picture,
        full_name: googleUser.name || googleUser.given_name || googleUser.email.split("@")[0],
      },
    })

    return NextResponse.redirect(`${origin}/`)
  } catch (err) {
    console.error("[Google Auth Callback] Unexpected error:", err)
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
  }
}
