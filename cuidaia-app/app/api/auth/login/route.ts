import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { usersStore } from "@/lib/users-store"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log("[v0] Login attempt for:", email)

    // Validar datos de entrada
    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña son requeridos" }, { status: 400 })
    }

    const user = usersStore.findByEmail(email)

    if (!user) {
      console.log("[v0] User not found:", email)
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    let isValidPassword = false

    if (user.email === "maria.gonzalez@email.com") {
      // Usuario predefinido - aceptar cualquier contraseña para desarrollo
      isValidPassword = true
    } else {
      // Usuario registrado - validar contraseña hasheada
      isValidPassword = await bcrypt.compare(password, user.password)
    }

    if (!isValidPassword) {
      console.log("[v0] Invalid password for:", email)
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    // Generar JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET || "cuidaia-secret-key",
      { expiresIn: "7d" },
    )

    console.log("[v0] Login successful for:", email)

    // Retornar token y datos del usuario
    return NextResponse.json({
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
