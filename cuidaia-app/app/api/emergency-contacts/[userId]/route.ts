import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    console.log("[v0] Fetching emergency contacts for user:", params.userId)

    // Simulate database query for emergency contacts
    const emergencyContacts = [
      {
        id: 1,
        name: "Dr. García (Médico de Familia)",
        phone: "(555) 123-4567",
        relationship: "doctor",
        is_primary: true,
      },
      {
        id: 2,
        name: "María González (Hija)",
        phone: "(555) 987-6543",
        relationship: "family",
        is_primary: true,
      },
      {
        id: 3,
        name: "Farmacia San José",
        phone: "(555) 456-7890",
        relationship: "pharmacy",
        is_primary: false,
      },
      {
        id: 4,
        name: "Carlos González (Hijo)",
        phone: "(555) 321-9876",
        relationship: "family",
        is_primary: false,
      },
    ]

    return NextResponse.json({
      success: true,
      contacts: emergencyContacts,
    })
  } catch (error) {
    console.error("[v0] Error fetching emergency contacts:", error)
    return NextResponse.json({ success: false, error: "Error al obtener contactos de emergencia" }, { status: 500 })
  }
}
