import { type NextRequest, NextResponse } from "next/server"

// Simulación de base de datos con datos de ejemplo
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
    {
      id: "reminder-2",
      title: "Cita con Dr. García",
      description: "Consulta de seguimiento - Cardiología",
      reminderType: "appointment",
      scheduledTime: "16:30",
      scheduledDays: "weekly",
      isActive: true,
      userId: "550e8400-e29b-41d4-a716-446655440000",
      createdAt: "2024-01-01T00:00:00Z",
    },
    {
      id: "reminder-3",
      title: "Ejercicio matutino",
      description: "Caminata de 15 minutos",
      reminderType: "exercise",
      scheduledTime: "07:00",
      scheduledDays: "daily",
      isActive: true,
      userId: "550e8400-e29b-41d4-a716-446655440000",
      createdAt: "2024-01-01T00:00:00Z",
    },
  ],
}

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params

    console.log("[v0] Loading reminders for user:", userId)

    const userReminders = reminders[userId] || []

    return NextResponse.json({
      reminders: userReminders,
    })
  } catch (error) {
    console.error("[v0] Error loading reminders:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
