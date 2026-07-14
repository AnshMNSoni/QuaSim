import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_jwt_secret_please_change"
)

export interface SessionUser {
  id: string
  email: string
  user_metadata: {
    avatar_url?: string
    full_name?: string
  }
}

export async function createSession(user: SessionUser) {
  const token = await new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY)

  const cookieStore = await cookies()
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("session")?.value
    if (!token) return null

    const { payload } = await jwtVerify(token, SECRET_KEY, {
      algorithms: ["HS256"],
    })
    return payload as unknown as SessionUser
  } catch (error) {
    return null
  }
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}
