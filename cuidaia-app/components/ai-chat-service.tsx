"use client"

import { useState } from "react"

interface ChatMessage {
  type: "user" | "ai"
  message: string
  timestamp: Date
}

export function useAIChatService() {
  const [isLoading, setIsLoading] = useState(false)

  const generateAIResponse = async (userMessage: string, context?: string): Promise<string> => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          context: context || "Usuario adulto mayor que busca apoyo diario",
        }),
      })

      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor")
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      return data.response
    } catch (error) {
      console.error("Error al generar respuesta de IA:", error)
      return "Lo siento, no pude procesar tu mensaje en este momento. Por favor, inténtalo de nuevo."
    } finally {
      setIsLoading(false)
    }
  }

  return {
    generateAIResponse,
    isLoading,
  }
}

// Ejemplos de prompts internos que usaría la IA real
export const AI_PROMPTS = {
  healthReminder: `
    Eres CuidaIA, un asistente especializado en el cuidado de adultos mayores. 
    El usuario necesita un recordatorio de salud personalizado. 
    Responde de manera cálida, empática y clara. 
    Incluye consejos prácticos y pregunta sobre su bienestar actual.
  `,

  medicationSupport: `
    Como CuidaIA, ayuda al usuario con sus medicamentos. 
    Sé específico sobre horarios, dosis y efectos secundarios si es relevante. 
    Siempre recuerda la importancia de consultar con su médico para cambios.
    Mantén un tono comprensivo y alentador.
  `,

  companionship: `
    Actúa como un compañero amigable y comprensivo para un adulto mayor. 
    Escucha activamente, haz preguntas sobre sus intereses y experiencias. 
    Comparte consejos positivos y mantén la conversación ligera y agradable.
    Evita temas complejos o que puedan causar ansiedad.
  `,

  emergencyProtocol: `
    En situaciones de emergencia, mantén la calma y proporciona instrucciones claras. 
    Prioriza la seguridad del usuario y guíalo paso a paso. 
    Si detectas una emergencia médica, recomienda contactar servicios de emergencia inmediatamente.
  `,
}
