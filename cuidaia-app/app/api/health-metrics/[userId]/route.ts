import { type NextRequest, NextResponse } from "next/server"

// Simulación de base de datos con datos de ejemplo
const healthMetrics: any = {
  "550e8400-e29b-41d4-a716-446655440000": [
    {
      id: "metric-1",
      metricType: "blood_pressure",
      value: "120/80",
      unit: "mmHg",
      notes: "Medición matutina en ayunas",
      recordedAt: "2024-12-15T08:00:00Z",
      userId: "550e8400-e29b-41d4-a716-446655440000",
    },
    {
      id: "metric-2",
      metricType: "heart_rate",
      value: "72",
      unit: "bpm",
      notes: "En reposo después de 5 minutos",
      recordedAt: "2024-12-15T08:05:00Z",
      userId: "550e8400-e29b-41d4-a716-446655440000",
    },
    {
      id: "metric-3",
      metricType: "weight",
      value: "68.5",
      unit: "kg",
      notes: "Peso matutino sin ropa",
      recordedAt: "2024-12-15T07:30:00Z",
      userId: "550e8400-e29b-41d4-a716-446655440000",
    },
    {
      id: "metric-4",
      metricType: "glucose",
      value: "110",
      unit: "mg/dL",
      notes: "Glucosa en ayunas",
      recordedAt: "2024-12-14T08:00:00Z",
      userId: "550e8400-e29b-41d4-a716-446655440000",
    },
    {
      id: "metric-5",
      metricType: "mood",
      value: "Positivo",
      unit: "",
      notes: "Me siento bien hoy, con energía",
      recordedAt: "2024-12-15T09:00:00Z",
      userId: "550e8400-e29b-41d4-a716-446655440000",
    },
  ],
}

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params

    console.log("[v0] Loading health metrics for user:", userId)

    const userMetrics = healthMetrics[userId] || []

    // Sort by recorded date, most recent first
    const sortedMetrics = userMetrics.sort(
      (a: any, b: any) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime(),
    )

    return NextResponse.json({
      metrics: sortedMetrics,
    })
  } catch (error) {
    console.error("[v0] Error loading health metrics:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
