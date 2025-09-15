import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { usersStore } from "@/lib/users-store"

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password, phone, dateOfBirth } = await request.json()

    console.log("[v0] Registration attempt for:", email)

    // Validar datos de entrada
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: "Todos los campos obligatorios deben ser completados" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "La contraseña debe tener al menos 6 caracteres" }, { status: 400 })
    }

    if (usersStore.emailExists(email)) {
      return NextResponse.json({ error: "Este email ya está registrado" }, { status: 409 })
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = {
      id: crypto.randomUUID(),
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      dateOfBirth,
      createdAt: new Date().toISOString(),
    }

    usersStore.add(newUser)

    console.log("[v0] User registered successfully:", email)

    // Retornar éxito (sin datos sensibles)
    return NextResponse.json({
      message: "Usuario registrado exitosamente",
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      },
    })
  } catch (error) {
    console.error("[v0] Registration error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
