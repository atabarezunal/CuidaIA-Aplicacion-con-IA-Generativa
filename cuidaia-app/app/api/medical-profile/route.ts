import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

// Simulación de base de datos - en producción usar base de datos real
const medicalProfiles: any = {}
const medications: any = {}
const emergencyContacts: any = {}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Token de autorización requerido" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "cuidaia-secret-key") as any

    const { userId, profile, medications: userMedications, emergencyContacts: userContacts } = await request.json()

    console.log("[v0] Saving medical profile for user:", userId)

    // Guardar perfil médico
    medicalProfiles[userId] = {
      ...profile,
      userId,
      updatedAt: new Date().toISOString(),
    }

    // Guardar medicamentos
    medications[userId] = userMedications.map((med: any) => ({
      ...med,
      userId,
      id: med.id || crypto.randomUUID(),
      updatedAt: new Date().toISOString(),
    }))

    // Guardar contactos de emergencia
    emergencyContacts[userId] = userContacts.map((contact: any) => ({
      ...contact,
      userId,
      id: contact.id || crypto.randomUUID(),
      updatedAt: new Date().toISOString(),
    }))

    console.log("[v0] Medical profile saved successfully for user:", userId)

    return NextResponse.json({
      message: "Perfil médico guardado exitosamente",
      profile: medicalProfiles[userId],
      medications: medications[userId],
      emergencyContacts: emergencyContacts[userId],
    })
  } catch (error) {
    console.error("[v0] Error saving medical profile:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
