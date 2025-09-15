import jwt from "jsonwebtoken"

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
}

export function verifyToken(token: string): User | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "cuidaia-secret-key") as any
    return decoded
  } catch (error) {
    console.error("Token verification failed:", error)
    return null
  }
}

export function generateToken(user: User): string {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    process.env.JWT_SECRET || "cuidaia-secret-key",
    { expiresIn: "7d" },
  )
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false

  const token = localStorage.getItem("auth_token")
  if (!token) return false

  try {
    const user = verifyToken(token)
    return user !== null
  } catch {
    return false
  }
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  const userData = localStorage.getItem("user_data")
  if (!userData) return null

  try {
    return JSON.parse(userData)
  } catch {
    return null
  }
}
