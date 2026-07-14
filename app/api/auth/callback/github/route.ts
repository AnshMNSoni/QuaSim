import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  if (error || !code) {
    console.error("[GitHub Auth Callback] Error or missing code:", error)
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
  }

  try {
    const githubClientId = process.env.GITHUB_CLIENT_ID
    const githubSecret = process.env.GITHUB_SECRET

    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: githubClientId,
        client_secret: githubSecret,
        code,
      }),
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error("[GitHub Auth Callback] Token exchange failed:", errorText)
      return NextResponse.redirect(`${origin}/auth/auth-code-error`)
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    if (!accessToken) {
      console.error("[GitHub Auth Callback] No access token returned:", tokenData)
      return NextResponse.redirect(`${origin}/auth/auth-code-error`)
    }

    // Fetch user profile info
    const userinfoResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": "QuaSim-Auth",
      },
    })

    if (!userinfoResponse.ok) {
      console.error("[GitHub Auth Callback] Failed to fetch profile info")
      return NextResponse.redirect(`${origin}/auth/auth-code-error`)
    }

    const githubUser = await userinfoResponse.json()

    // Fetch primary email if profile doesn't include it
    let email = githubUser.email
    if (!email) {
      try {
        const emailsResponse = await fetch("https://api.github.com/user/emails", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "User-Agent": "QuaSim-Auth",
          },
        })
        if (emailsResponse.ok) {
          const emails = await emailsResponse.json()
          const primaryEmail = emails.find((e: any) => e.primary)
          email = primaryEmail ? primaryEmail.email : (emails[0] ? emails[0].email : null)
        }
      } catch (emailErr) {
        console.error("[GitHub Auth Callback] Failed to fetch user emails:", emailErr)
      }
    }

    // Create session and set cookie
    await createSession({
      id: String(githubUser.id) || `github-${Date.now()}`,
      email: email || `${githubUser.login}@github.com`,
      user_metadata: {
        avatar_url: githubUser.avatar_url,
        full_name: githubUser.name || githubUser.login,
      },
    })

    return NextResponse.redirect(`${origin}/`)
  } catch (err) {
    console.error("[GitHub Auth Callback] Unexpected error:", err)
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
  }
}
