import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const provider = searchParams.get("provider")
  const origin = request.nextUrl.origin

  if (provider === "google") {
    const googleClientId = process.env.GOOGLE_CLIENT_ID
    if (!googleClientId) {
      return NextResponse.json({ error: "Google OAuth client ID is not configured" }, { status: 500 })
    }

    const redirectUri = `${origin}/api/auth/callback/google`
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` + new URLSearchParams({
      client_id: googleClientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid email profile",
      state: "google",
      access_type: "offline",
      prompt: "consent",
    }).toString()

    return NextResponse.redirect(authUrl)
  }

  if (provider === "github") {
    const githubClientId = process.env.GITHUB_CLIENT_ID
    if (!githubClientId) {
      return NextResponse.json({ error: "GitHub OAuth client ID is not configured" }, { status: 500 })
    }

    const redirectUri = `${origin}/api/auth/callback/github`
    const authUrl = `https://github.com/login/oauth/authorize?` + new URLSearchParams({
      client_id: githubClientId,
      redirect_uri: redirectUri,
      scope: "read:user user:email",
      state: "github",
    }).toString()

    return NextResponse.redirect(authUrl)
  }

  return NextResponse.json({ error: "Invalid provider" }, { status: 400 })
}
