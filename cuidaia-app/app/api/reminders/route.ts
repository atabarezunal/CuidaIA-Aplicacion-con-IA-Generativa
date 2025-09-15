import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

// Simulación de base de datos - en producción usar base de datos real
const reminders: any = {}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Token de autorización requerido" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "cuidaia-secret-key") as any

    const { userId, reminder } = await request.json()

    console.log("[v0] Creating reminder for user:", userId)

    const newReminder = {
      id: crypto.randomUUID(),
      ...reminder,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (!reminders[userId]) {
      reminders[userId] = []
    }

    reminders[userId].push(newReminder)

    console.log("[v0] Reminder created successfully:", newReminder.id)

    return NextResponse.json({
      message: "Recordatorio creado exitosamente",
      reminder: newReminder,
    })
  } catch (error) {
    console.error("[v0] Error creating reminder:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
