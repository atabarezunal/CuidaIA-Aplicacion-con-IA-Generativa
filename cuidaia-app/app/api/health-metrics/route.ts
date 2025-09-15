import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

// Simulación de base de datos - en producción usar base de datos real
const healthMetrics: any = {}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Token de autorización requerido" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "cuidaia-secret-key") as any

    const { userId, metric } = await request.json()

    console.log("[v0] Creating health metric for user:", userId)

    const newMetric = {
      id: crypto.randomUUID(),
      ...metric,
      userId,
      createdAt: new Date().toISOString(),
    }

    if (!healthMetrics[userId]) {
      healthMetrics[userId] = []
    }

    healthMetrics[userId].unshift(newMetric) // Add to beginning for chronological order

    console.log("[v0] Health metric created successfully:", newMetric.id)

    return NextResponse.json({
      message: "Métrica de salud registrada exitosamente",
      metric: newMetric,
    })
  } catch (error) {
    console.error("[v0] Error creating health metric:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
