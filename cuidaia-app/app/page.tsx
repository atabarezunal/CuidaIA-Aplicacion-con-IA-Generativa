"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Heart } from "lucide-react"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("auth_token")

    if (token) {
      // User is logged in, redirect to dashboard
      router.push("/dashboard")
    } else {
      // User is not logged in, redirect to login
      router.push("/login")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
          <Heart className="w-8 h-8 text-primary-foreground" />
        </div>
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-xl">Cargando CuidaIA...</span>
        </div>
      </div>
    </div>
  )
}
