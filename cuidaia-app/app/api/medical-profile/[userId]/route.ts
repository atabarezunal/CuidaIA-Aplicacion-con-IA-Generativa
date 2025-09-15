import { type NextRequest, NextResponse } from "next/server"

// Simulación de base de datos - en producción usar base de datos real
const medicalProfiles: any = {
  "550e8400-e29b-41d4-a716-446655440000": {
    bloodType: "O+",
    allergies: "Penicilina, Mariscos",
    chronicConditions: "Hipertensión arterial, Diabetes tipo 2",
    currentMedications: "",
    medicalNotes: "Paciente estable, requiere monitoreo regular de glucosa y presión arterial",
    primaryDoctorName: "Dr. Carlos García",
    primaryDoctorPhone: "+52 555 234 5678",
    insuranceProvider: "IMSS",
    insuranceNumber: "12345678901",
  },
}

const medications: any = {
  "550e8400-e29b-41d4-a716-446655440000": [
    {
      id: "med-1",
      name: "Metformina",
      dosage: "500mg",
      frequency: "Cada 12 horas",
      instructions: "Tomar con alimentos",
      startDate: "2024-01-01",
      isActive: true,
    },
    {
      id: "med-2",
      name: "Losartán",
      dosage: "50mg",
      frequency: "Una vez al día",
      instructions: "Tomar en la mañana",
      startDate: "2024-01-01",
      isActive: true,
    },
  ],
}

const emergencyContacts: any = {
  "550e8400-e29b-41d4-a716-446655440000": [
    {
      id: "contact-1",
      name: "Ana González",
      phone: "+52 555 987 6543",
      relationship: "Hija",
      isPrimary: true,
      notes: "Contacto principal - Vive cerca",
    },
    {
      id: "contact-2",
      name: "Dr. Carlos García",
      phone: "+52 555 234 5678",
      relationship: "Médico",
      isPrimary: false,
      notes: "Cardiólogo de cabecera",
    },
  ],
}

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params

    console.log("[v0] Loading medical profile for user:", userId)

    const profile = medicalProfiles[userId] || {}
    const userMedications = medications[userId] || []
    const userEmergencyContacts = emergencyContacts[userId] || []

    return NextResponse.json({
      profile,
      medications: userMedications,
      emergencyContacts: userEmergencyContacts,
    })
  } catch (error) {
    console.error("[v0] Error loading medical profile:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
