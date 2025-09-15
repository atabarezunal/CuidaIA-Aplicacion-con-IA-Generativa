import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

// Simulación de base de datos
const reminders: any = {
  "550e8400-e29b-41d4-a716-446655440000": [
    {
      id: "reminder-1",
      title: "Tomar Metformina",
      description: "Tomar con alimentos",
      reminderType: "medication",
      scheduledTime: "08:00",
      scheduledDays: "daily",
      isActive: true,
      userId: "550e8400-e29b-41d4-a716-446655440000",
      createdAt: "2024-01-01T00:00:00Z",
    },
  ],
}

export async function DELETE(request: NextRequest, { params }: { params: { reminderId: string } }) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Token de autorización requerido" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "cuidaia-secret-key") as any

    const { reminderId } = params

    console.log("[v0] Deleting reminder:", reminderId)

    // Buscar y eliminar el recordatorio
    let reminderFound = false
    for (const userId in reminders) {
      const userReminders = reminders[userId]
      const reminderIndex = userReminders.findIndex((r: any) => r.id === reminderId)

      if (reminderIndex !== -1) {
        userReminders.splice(reminderIndex, 1)
        reminderFound = true
        break
      }
    }

    if (!reminderFound) {
      return NextResponse.json({ error: "Recordatorio no encontrado" }, { status: 404 })
    }

    console.log("[v0] Reminder deleted successfully:", reminderId)

    return NextResponse.json({
      message: "Recordatorio eliminado exitosamente",
    })
  } catch (error) {
    console.error("[v0] Error deleting reminder:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
