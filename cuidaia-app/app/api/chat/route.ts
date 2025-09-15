import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(req: NextRequest) {
  try {
    const { message, context } = await req.json()

    const apiKey = process.env.GROQ_API_KEY
    console.log("[v0] GROQ_API_KEY disponible:", !!apiKey)
    console.log("[v0] Longitud de API key:", apiKey?.length || 0)

    if (!apiKey) {
      console.error("[v0] ERROR: GROQ_API_KEY no está configurada")
      return NextResponse.json(
        {
          error: "Error de configuración: GROQ_API_KEY no está configurada en el archivo .env.local",
          details: "Asegúrate de crear un archivo .env.local con tu API key de Groq",
        },
        { status: 500 },
      )
    }

    console.log("[v0] Intentando usar Groq directamente...")

    const systemPrompt = `
    Eres CuidaIA, un asistente de inteligencia artificial especializado en el cuidado y acompañamiento de adultos mayores.

    PERSONALIDAD Y TONO:
    - Cálido, empático y paciente
    - Usa un lenguaje claro y sencillo
    - Evita tecnicismos médicos complejos
    - Siempre positivo y alentador
    - Respetuoso con la experiencia y sabiduría del usuario

    CAPACIDADES PRINCIPALES:
    1. Recordatorios médicos personalizados
    2. Apoyo emocional y conversación
    3. Consejos de salud y bienestar
    4. Ayuda con tareas diarias
    5. Información sobre citas médicas

    PAUTAS DE RESPUESTA:
    - Responde en español
    - Mantén respuestas concisas pero completas
    - Siempre pregunta por el bienestar del usuario
    - Ofrece ayuda práctica cuando sea apropiado
    - Si detectas preocupaciones de salud, recomienda consultar con un médico
    - Nunca proporciones diagnósticos médicos específicos

    CONTEXTO DEL USUARIO: ${context || "Usuario adulto mayor que busca apoyo diario"}
    `

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      system: systemPrompt,
      prompt: message,
      maxTokens: 300,
      temperature: 0.7,
    })

    console.log("[v0] Respuesta generada exitosamente")
    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("[v0] Error detallado en chat API:", error)
    const errorMessage = error instanceof Error ? error.message : "Error desconocido"
    console.error("[v0] Tipo de error:", typeof error)
    console.error("[v0] Stack trace:", error instanceof Error ? error.stack : "No disponible")

    return NextResponse.json(
      {
        error: "Lo siento, no pude procesar tu mensaje. Revisa la consola para más detalles.",
        details: errorMessage,
      },
      { status: 500 },
    )
  }
}
