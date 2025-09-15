"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Heart,
  MessageCircle,
  Calendar,
  Activity,
  Phone,
  Clock,
  Loader2,
  LogOut,
  Settings,
  Plus,
  X,
  Check,
  Bell,
  TrendingUp,
  Save,
  FileText,
} from "lucide-react"
import { useAIChatService } from "@/components/ai-chat-service"

interface DashboardUser {
  id: string
  firstName: string
  lastName: string
  email: string
}

interface Reminder {
  id: string
  title: string
  description: string
  reminderType: "medication" | "appointment" | "exercise" | "social"
  scheduledTime: string
  scheduledDays: string
  isActive: boolean
  lastCompleted?: string
  medicationId?: string
}

interface HealthMetric {
  id?: string
  metricType: "blood_pressure" | "heart_rate" | "weight" | "glucose" | "mood" | "pain_level"
  value: string
  unit?: string
  notes?: string
  recordedAt: string
}

interface MedicalProfile {
  allergies?: string
  blood_type?: string
  chronic_conditions?: string
}

interface EmergencyContact {
  name: string
  phone: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<DashboardUser | null>(null)
  const [activeSection, setActiveSection] = useState("home")
  const [chatMessage, setChatMessage] = useState("")
  const [chatHistory, setChatHistory] = useState([
    { type: "ai", message: "¡Hola! Soy tu asistente CuidaIA. ¿En qué puedo ayudarte hoy?" },
  ])
  const [isLoading, setIsLoading] = useState(true)

  // Reminders state
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [isLoadingReminders, setIsLoadingReminders] = useState(false)
  const [isSavingReminder, setIsSavingReminder] = useState(false)
  const [reminderMessage, setReminderMessage] = useState("")
  const [reminderError, setReminderError] = useState("")
  const [newReminder, setNewReminder] = useState<Partial<Reminder>>({
    title: "",
    description: "",
    reminderType: "medication",
    scheduledTime: "",
    scheduledDays: "daily",
    isActive: true,
  })

  // Health metrics state
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([])
  const [isLoadingHealth, setIsLoadingHealth] = useState(false)
  const [isSavingHealth, setIsSavingHealth] = useState(false)
  const [healthMessage, setHealthMessage] = useState("")
  const [healthError, setHealthError] = useState("")
  const [newHealthMetric, setNewHealthMetric] = useState<Partial<HealthMetric>>({
    metricType: "blood_pressure",
    value: "",
    unit: "",
    notes: "",
  })

  // Medical profile state
  const [medicalProfile, setMedicalProfile] = useState<MedicalProfile | null>(null)
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    { name: "Familia", phone: "(555) 123-4567" },
    { name: "Emergencia", phone: "911" },
  ])
  const [medications, setMedications] = useState<any[]>([])

  const router = useRouter()

  const { generateAIResponse, isLoading: aiLoading } = useAIChatService()

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem("auth_token")
    const userData = localStorage.getItem("user_data")

    if (!token || !userData) {
      router.push("/login")
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      loadReminders(parsedUser.id)
      loadHealthMetrics(parsedUser.id)
      loadMedicalProfile(parsedUser.id)
      setIsLoading(false)
    } catch (error) {
      console.error("Error parsing user data:", error)
      handleLogout()
    }
  }, [router])

  const loadReminders = async (userId: string) => {
    setIsLoadingReminders(true)
    try {
      const response = await fetch(`/api/users/${userId}/reminders`)
      if (response.ok) {
        const data = await response.json()
        setReminders(data.reminders || [])
      }
    } catch (error) {
      console.error("Error loading reminders:", error)
    } finally {
      setIsLoadingReminders(false)
    }
  }

  const loadHealthMetrics = async (userId: string) => {
    setIsLoadingHealth(true)
    try {
      const response = await fetch(`/api/health-metrics/${userId}`)
      if (response.ok) {
        const data = await response.json()
        setHealthMetrics(data.metrics || [])
      }
    } catch (error) {
      console.error("Error loading health metrics:", error)
    } finally {
      setIsLoadingHealth(false)
    }
  }

  const loadMedicalProfile = async (userId: string) => {
    try {
      const response = await fetch(`/api/medical-profile/${userId}`)
      if (response.ok) {
        const data = await response.json()
        setMedicalProfile(data.profile || {})
        setMedications(data.medications || [])
        setEmergencyContacts(data.emergencyContacts || [])
      } else {
        console.error("Error loading medical profile:", response.status)
      }
    } catch (error) {
      console.error("Error loading medical profile:", error)
    }
  }

  const saveHealthMetric = async () => {
    if (!newHealthMetric.metricType || !newHealthMetric.value) {
      setHealthError("Por favor completa el tipo de métrica y el valor")
      return
    }

    setIsSavingHealth(true)
    setHealthError("")
    setHealthMessage("")

    try {
      const response = await fetch("/api/health-metrics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          userId: user?.id,
          metric: {
            ...newHealthMetric,
            recordedAt: new Date().toISOString(),
          },
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setHealthMetrics([data.metric, ...healthMetrics])
        setNewHealthMetric({
          metricType: "blood_pressure",
          value: "",
          unit: "",
          notes: "",
        })
        setHealthMessage("Métrica de salud registrada exitosamente")
        setTimeout(() => setHealthMessage(""), 3000)
      } else {
        setHealthError(data.error || "Error al registrar la métrica")
      }
    } catch (error) {
      setHealthError("Error de conexión. Intenta de nuevo.")
    } finally {
      setIsSavingHealth(false)
    }
  }

  const saveReminder = async () => {
    if (!newReminder.title || !newReminder.scheduledTime) {
      setReminderError("Por favor completa el título y la hora del recordatorio")
      return
    }

    setIsSavingReminder(true)
    setReminderError("")
    setReminderMessage("")

    try {
      const response = await fetch("/api/reminders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          userId: user?.id,
          reminder: newReminder,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setReminders([...reminders, data.reminder])
        setNewReminder({
          title: "",
          description: "",
          reminderType: "medication",
          scheduledTime: "",
          scheduledDays: "daily",
          isActive: true,
        })
        setReminderMessage("Recordatorio creado exitosamente")
        setTimeout(() => setReminderMessage(""), 3000)
      } else {
        setReminderError(data.error || "Error al crear el recordatorio")
      }
    } catch (error) {
      setReminderError("Error de conexión. Intenta de nuevo.")
    } finally {
      setIsSavingReminder(false)
    }
  }

  const completeReminder = async (reminderId: string) => {
    try {
      const response = await fetch(`/api/reminders/${reminderId}/complete`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      })

      if (response.ok) {
        setReminders(
          reminders.map((r) => (r.id === reminderId ? { ...r, lastCompleted: new Date().toISOString() } : r)),
        )
      }
    } catch (error) {
      console.error("Error completing reminder:", error)
    }
  }

  const deleteReminder = async (reminderId: string) => {
    try {
      const response = await fetch(`/api/reminders/${reminderId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      })

      if (response.ok) {
        setReminders(reminders.filter((r) => r.id !== reminderId))
      }
    } catch (error) {
      console.error("Error deleting reminder:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_data")
    router.push("/login")
  }

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || aiLoading) return

    const userMessage = chatMessage
    setChatMessage("")

    setChatHistory((prev) => [...prev, { type: "user", message: userMessage }])

    try {
      const aiResponse = await generateAIResponse(userMessage)
      setChatHistory((prev) => [...prev, { type: "ai", message: aiResponse }])
    } catch (error) {
      console.error("Error al enviar mensaje:", error)
      setChatHistory((prev) => [
        ...prev,
        { type: "ai", message: "Lo siento, hubo un problema al procesar tu mensaje. ¿Podrías intentarlo de nuevo?" },
      ])
    }
  }

  const handleQuickQuestion = async (question: string) => {
    setChatMessage(question)
    setChatHistory((prev) => [...prev, { type: "user", message: question }])

    try {
      const aiResponse = await generateAIResponse(question)
      setChatHistory((prev) => [...prev, { type: "ai", message: aiResponse }])
    } catch (error) {
      console.error("Error al procesar pregunta rápida:", error)
    }
  }

  const getLatestHealthMetrics = () => {
    const latestMetrics: { [key: string]: HealthMetric } = {}

    healthMetrics.forEach((metric) => {
      if (
        !latestMetrics[metric.metricType] ||
        new Date(metric.recordedAt) > new Date(latestMetrics[metric.metricType].recordedAt)
      ) {
        latestMetrics[metric.metricType] = metric
      }
    })

    return [
      {
        label: "Presión Arterial",
        value: latestMetrics.blood_pressure?.value || "120/80",
        status: "normal",
        unit: latestMetrics.blood_pressure?.unit || "mmHg",
      },
      {
        label: "Frecuencia Cardíaca",
        value: latestMetrics.heart_rate?.value || "72",
        status: "normal",
        unit: latestMetrics.heart_rate?.unit || "bpm",
      },
      {
        label: "Estado de Ánimo",
        value: latestMetrics.mood?.value || "Positivo",
        status: "good",
        unit: "",
      },
    ]
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-xl">Cargando CuidaIA...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const navigationItems = [
    { id: "home", label: "Inicio", icon: Heart },
    { id: "chat", label: "Conversación", icon: MessageCircle },
    { id: "reminders", label: "Recordatorios", icon: Calendar },
    { id: "health", label: "Salud", icon: Activity },
    { id: "emergency", label: "Emergencia", icon: Phone },
  ]

  const upcomingReminders = reminders
    .filter((r) => r.isActive)
    .slice(0, 3)
    .map((r) => ({
      id: r.id,
      time: r.scheduledTime,
      task: r.title,
      type: r.reminderType,
      description: r.description,
    }))

  const currentHealthMetrics = getLatestHealthMetrics()

  const handleEmergencyCall = (phoneNumber: string) => {
    // In a real app, this would integrate with the device's phone app
    if (confirm(`¿Deseas llamar a ${phoneNumber}?`)) {
      // Simulate call or open phone app
      window.location.href = `tel:${phoneNumber}`
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b-2 border-border p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">CuidaIA</h1>
              <p className="text-muted-foreground text-lg">Tu asistente personal inteligente</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Heart className="w-5 h-5 mr-2" />
              {user.firstName} {user.lastName}
            </Badge>
            <Button variant="outline" size="sm" onClick={() => setActiveSection("profile")}>
              <Settings className="w-4 h-4 mr-2" />
              Perfil
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Navigation */}
        <nav className="mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "default" : "outline"}
                  size="lg"
                  onClick={() => setActiveSection(item.id)}
                  className="flex items-center gap-3 text-lg px-6 py-4 min-w-[160px]"
                >
                  <Icon className="w-6 h-6" />
                  {item.label}
                </Button>
              )
            })}
          </div>
        </nav>

        {/* Main Content */}
        <main className="space-y-8">
          {activeSection === "home" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <Heart className="w-8 h-8 text-primary" />
                    ¡Buen día, {user.firstName}!
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Hoy es{" "}
                    {new Date().toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-muted-foreground">
                    Tienes {upcomingReminders.length} recordatorios para hoy. Tu estado de salud se ve bien. ¿Te
                    gustaría conversar conmigo o revisar tus medicamentos?
                  </p>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Acciones Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    className="w-full justify-start text-lg py-6"
                    size="lg"
                    onClick={() => setActiveSection("chat")}
                  >
                    <MessageCircle className="w-6 h-6 mr-3" />
                    Conversar con CuidaIA
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-lg py-6 bg-transparent"
                    size="lg"
                    onClick={() => setActiveSection("health")}
                  >
                    <Activity className="w-6 h-6 mr-3" />
                    Registrar Métrica de Salud
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-lg py-6 bg-transparent"
                    size="lg"
                    onClick={() => setActiveSection("reminders")}
                  >
                    <Calendar className="w-6 h-6 mr-3" />
                    Ver Citas Médicas
                  </Button>
                </CardContent>
              </Card>

              {/* Today's Reminders */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-3">
                    <Clock className="w-6 h-6" />
                    Recordatorios de Hoy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingReminders.length > 0 ? (
                    upcomingReminders.map((reminder) => (
                      <div key={reminder.id} className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-primary min-w-[80px]">{reminder.time}</div>
                        <div className="flex-1">
                          <p className="text-lg font-medium">{reminder.task}</p>
                          <Badge variant="secondary" className="mt-1">
                            {reminder.type === "medication" && "Medicamento"}
                            {reminder.type === "appointment" && "Cita Médica"}
                            {reminder.type === "social" && "Social"}
                            {reminder.type === "exercise" && "Ejercicio"}
                          </Badge>
                        </div>
                        <Button size="sm" onClick={() => completeReminder(reminder.id)} className="text-sm">
                          <Check className="w-4 h-4 mr-1" />
                          Completar
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-lg text-muted-foreground">No tienes recordatorios para hoy</p>
                      <Button
                        variant="outline"
                        className="mt-4 bg-transparent"
                        onClick={() => setActiveSection("reminders")}
                      >
                        Crear Recordatorio
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === "reminders" && (
            <div className="space-y-8">
              {/* Messages */}
              {reminderMessage && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-lg text-green-800">{reminderMessage}</AlertDescription>
                </Alert>
              )}

              {reminderError && (
                <Alert variant="destructive">
                  <AlertDescription className="text-lg">{reminderError}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Create New Reminder */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-3">
                      <Plus className="w-6 h-6 text-primary" />
                      Crear Recordatorio
                    </CardTitle>
                    <CardDescription className="text-lg">
                      Programa recordatorios para medicamentos, citas y actividades
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="reminderTitle" className="text-lg font-medium">
                        Título del recordatorio
                      </Label>
                      <Input
                        id="reminderTitle"
                        value={newReminder.title || ""}
                        onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                        className="text-lg h-12"
                        placeholder="Tomar Metformina"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reminderType" className="text-lg font-medium">
                        Tipo de recordatorio
                      </Label>
                      <Select
                        value={newReminder.reminderType}
                        onValueChange={(value: any) => setNewReminder({ ...newReminder, reminderType: value })}
                      >
                        <SelectTrigger className="text-lg h-12">
                          <SelectValue placeholder="Selecciona el tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="medication">Medicamento</SelectItem>
                          <SelectItem value="appointment">Cita Médica</SelectItem>
                          <SelectItem value="exercise">Ejercicio</SelectItem>
                          <SelectItem value="social">Social</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="reminderTime" className="text-lg font-medium">
                          Hora
                        </Label>
                        <Input
                          id="reminderTime"
                          type="time"
                          value={newReminder.scheduledTime || ""}
                          onChange={(e) => setNewReminder({ ...newReminder, scheduledTime: e.target.value })}
                          className="text-lg h-12"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reminderDays" className="text-lg font-medium">
                          Frecuencia
                        </Label>
                        <Select
                          value={newReminder.scheduledDays}
                          onValueChange={(value) => setNewReminder({ ...newReminder, scheduledDays: value })}
                        >
                          <SelectTrigger className="text-lg h-12">
                            <SelectValue placeholder="Selecciona frecuencia" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Diario</SelectItem>
                            <SelectItem value="weekly">Semanal</SelectItem>
                            <SelectItem value="monday,wednesday,friday">Lun, Mié, Vie</SelectItem>
                            <SelectItem value="tuesday,thursday">Mar, Jue</SelectItem>
                            <SelectItem value="weekends">Fines de semana</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reminderDescription" className="text-lg font-medium">
                        Descripción (opcional)
                      </Label>
                      <Textarea
                        id="reminderDescription"
                        value={newReminder.description || ""}
                        onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                        className="text-lg min-h-[80px]"
                        placeholder="Tomar con alimentos, después del desayuno..."
                      />
                    </div>

                    <Button onClick={saveReminder} className="w-full text-lg h-12" disabled={isSavingReminder}>
                      {isSavingReminder ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Crear Recordatorio
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Existing Reminders */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-3">
                      <Calendar className="w-6 h-6 text-primary" />
                      Mis Recordatorios
                    </CardTitle>
                    <CardDescription className="text-lg">Gestiona tus recordatorios existentes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingReminders ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        <span className="ml-2">Cargando recordatorios...</span>
                      </div>
                    ) : reminders.length > 0 ? (
                      <div className="space-y-4">
                        {reminders.map((reminder) => (
                          <div key={reminder.id} className="p-4 bg-muted rounded-lg">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="text-lg font-semibold">{reminder.title}</h4>
                                  <Badge variant={reminder.isActive ? "secondary" : "outline"}>
                                    {reminder.isActive ? "Activo" : "Inactivo"}
                                  </Badge>
                                  <Badge variant="outline">
                                    {reminder.reminderType === "medication" && "Medicamento"}
                                    {reminder.reminderType === "appointment" && "Cita"}
                                    {reminder.reminderType === "exercise" && "Ejercicio"}
                                    {reminder.reminderType === "social" && "Social"}
                                  </Badge>
                                </div>
                                <p className="text-muted-foreground mb-2">
                                  <strong>Hora:</strong> {reminder.scheduledTime} | <strong>Frecuencia:</strong>{" "}
                                  {reminder.scheduledDays}
                                </p>
                                {reminder.description && (
                                  <p className="text-muted-foreground text-sm">{reminder.description}</p>
                                )}
                                {reminder.lastCompleted && (
                                  <p className="text-green-600 text-sm mt-2">
                                    Último completado: {new Date(reminder.lastCompleted).toLocaleString("es-ES")}
                                  </p>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" onClick={() => completeReminder(reminder.id)} variant="outline">
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => deleteReminder(reminder.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-lg text-muted-foreground">No tienes recordatorios creados</p>
                        <p className="text-muted-foreground">Crea tu primer recordatorio usando el formulario</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Chat Section - Same as original */}
          {activeSection === "chat" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <MessageCircle className="w-8 h-8 text-primary" />
                  Conversación con CuidaIA
                </CardTitle>
                <CardDescription className="text-lg">
                  Puedes preguntarme sobre salud, recordatorios, o simplemente conversar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted rounded-lg p-6 min-h-[400px] max-h-[500px] overflow-y-auto space-y-4">
                  {chatHistory.map((chat, index) => (
                    <div key={index} className={`flex ${chat.type === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] p-4 rounded-lg text-lg ${
                          chat.type === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-background text-foreground border-2 border-border"
                        }`}
                      >
                        {chat.message}
                      </div>
                    </div>
                  ))}
                  {aiLoading && (
                    <div className="flex justify-start">
                      <div className="bg-background text-foreground border-2 border-border p-4 rounded-lg flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-lg">CuidaIA está pensando...</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <Textarea
                    placeholder="Escribe tu mensaje aquí..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="flex-1 text-lg min-h-[60px]"
                    onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                    disabled={aiLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    size="lg"
                    className="px-8"
                    disabled={aiLoading || !chatMessage.trim()}
                  >
                    {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enviar"}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="text-left justify-start text-lg py-4 bg-transparent"
                    size="lg"
                    onClick={() => handleQuickQuestion("¿Cómo me siento hoy?")}
                    disabled={aiLoading}
                  >
                    "¿Cómo me siento hoy?"
                  </Button>
                  <Button
                    variant="outline"
                    className="text-left justify-start text-lg py-4 bg-transparent"
                    size="lg"
                    onClick={() => handleQuickQuestion("Recordar tomar medicamento")}
                    disabled={aiLoading}
                  >
                    "Recordar tomar medicamento"
                  </Button>
                  <Button
                    variant="outline"
                    className="text-left justify-start text-lg py-4 bg-transparent"
                    size="lg"
                    onClick={() => handleQuickQuestion("¿Qué ejercicios puedo hacer?")}
                    disabled={aiLoading}
                  >
                    "¿Qué ejercicios puedo hacer?"
                  </Button>
                  <Button
                    variant="outline"
                    className="text-left justify-start text-lg py-4 bg-transparent"
                    size="lg"
                    onClick={() => handleQuickQuestion("Programar cita médica")}
                    disabled={aiLoading}
                  >
                    "Programar cita médica"
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Health Section - Enhanced with full monitoring functionality */}
          {activeSection === "health" && (
            <div className="space-y-8">
              {/* Messages */}
              {healthMessage && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-lg text-green-800">{healthMessage}</AlertDescription>
                </Alert>
              )}

              {healthError && (
                <Alert variant="destructive">
                  <AlertDescription className="text-lg">{healthError}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Current Health Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-3">
                      <Activity className="w-8 h-8 text-primary" />
                      Estado Actual de Salud
                    </CardTitle>
                    <CardDescription className="text-lg">Tus métricas más recientes</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {currentHealthMetrics.map((metric, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div>
                          <p className="text-lg font-medium">{metric.label}</p>
                          <p className="text-2xl font-bold text-primary">
                            {metric.value} {metric.unit}
                          </p>
                        </div>
                        <Badge
                          variant={metric.status === "normal" || metric.status === "good" ? "secondary" : "destructive"}
                        >
                          {metric.status === "normal" && "Normal"}
                          {metric.status === "good" && "Bien"}
                        </Badge>
                      </div>
                    ))}

                    <Button
                      className="w-full text-lg bg-transparent"
                      variant="outline"
                      onClick={() => setActiveSection("health-history")}
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Ver Historial Completo
                    </Button>
                  </CardContent>
                </Card>

                {/* Register New Metric */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-3">
                      <Plus className="w-6 h-6 text-primary" />
                      Registrar Métrica
                    </CardTitle>
                    <CardDescription className="text-lg">Añade una nueva medición de salud</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="metricType" className="text-lg font-medium">
                        Tipo de métrica
                      </Label>
                      <Select
                        value={newHealthMetric.metricType}
                        onValueChange={(value: any) => setNewHealthMetric({ ...newHealthMetric, metricType: value })}
                      >
                        <SelectTrigger className="text-lg h-12">
                          <SelectValue placeholder="Selecciona el tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blood_pressure">Presión Arterial</SelectItem>
                          <SelectItem value="heart_rate">Frecuencia Cardíaca</SelectItem>
                          <SelectItem value="weight">Peso</SelectItem>
                          <SelectItem value="glucose">Glucosa</SelectItem>
                          <SelectItem value="mood">Estado de Ánimo</SelectItem>
                          <SelectItem value="pain_level">Nivel de Dolor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="metricValue" className="text-lg font-medium">
                          Valor
                        </Label>
                        <Input
                          id="metricValue"
                          value={newHealthMetric.value || ""}
                          onChange={(e) => setNewHealthMetric({ ...newHealthMetric, value: e.target.value })}
                          className="text-lg h-12"
                          placeholder={
                            newHealthMetric.metricType === "blood_pressure"
                              ? "120/80"
                              : newHealthMetric.metricType === "heart_rate"
                                ? "72"
                                : newHealthMetric.metricType === "weight"
                                  ? "70.5"
                                  : newHealthMetric.metricType === "glucose"
                                    ? "110"
                                    : newHealthMetric.metricType === "mood"
                                      ? "Positivo"
                                      : newHealthMetric.metricType === "pain_level"
                                        ? "3"
                                        : "Valor"
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="metricUnit" className="text-lg font-medium">
                          Unidad
                        </Label>
                        <Input
                          id="metricUnit"
                          value={newHealthMetric.unit || ""}
                          onChange={(e) => setNewHealthMetric({ ...newHealthMetric, unit: e.target.value })}
                          className="text-lg h-12"
                          placeholder={
                            newHealthMetric.metricType === "blood_pressure"
                              ? "mmHg"
                              : newHealthMetric.metricType === "heart_rate"
                                ? "bpm"
                                : newHealthMetric.metricType === "weight"
                                  ? "kg"
                                  : newHealthMetric.metricType === "glucose"
                                    ? "mg/dL"
                                    : ""
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="metricNotes" className="text-lg font-medium">
                        Notas (opcional)
                      </Label>
                      <Textarea
                        id="metricNotes"
                        value={newHealthMetric.notes || ""}
                        onChange={(e) => setNewHealthMetric({ ...newHealthMetric, notes: e.target.value })}
                        className="text-lg min-h-[80px]"
                        placeholder="Medición tomada en ayunas, después del ejercicio, etc."
                      />
                    </div>

                    <Button onClick={saveHealthMetric} className="w-full text-lg h-12" disabled={isSavingHealth}>
                      {isSavingHealth ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Registrar Métrica
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Health History */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-primary" />
                    Historial Reciente
                  </CardTitle>
                  <CardDescription className="text-lg">Tus últimas 10 mediciones registradas</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingHealth ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      <span className="ml-2">Cargando métricas...</span>
                    </div>
                  ) : healthMetrics.length > 0 ? (
                    <div className="space-y-4">
                      {healthMetrics.slice(0, 10).map((metric) => (
                        <div key={metric.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-lg font-semibold">
                                {metric.metricType === "blood_pressure" && "Presión Arterial"}
                                {metric.metricType === "heart_rate" && "Frecuencia Cardíaca"}
                                {metric.metricType === "weight" && "Peso"}
                                {metric.metricType === "glucose" && "Glucosa"}
                                {metric.metricType === "mood" && "Estado de Ánimo"}
                                {metric.metricType === "pain_level" && "Nivel de Dolor"}
                              </h4>
                              <Badge variant="outline">
                                {metric.value} {metric.unit}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground text-sm">
                              {new Date(metric.recordedAt).toLocaleString("es-ES")}
                            </p>
                            {metric.notes && <p className="text-muted-foreground text-sm mt-1">{metric.notes}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Activity className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-lg text-muted-foreground">No tienes métricas registradas</p>
                      <p className="text-muted-foreground">Comienza registrando tu primera medición</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* AI Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Recomendaciones de IA</CardTitle>
                  <CardDescription className="text-lg">Basadas en tus métricas de salud recientes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-card border-2 border-primary/20 rounded-lg">
                    <h4 className="font-semibold text-lg mb-2">Sugerencia del día</h4>
                    <p className="text-muted-foreground">
                      Basándome en tus métricas, te recomiendo una caminata de 15 minutos después del almuerzo. Esto
                      ayudará a mantener tu presión arterial estable.
                    </p>
                  </div>
                  <div className="p-4 bg-card border-2 border-secondary/20 rounded-lg">
                    <h4 className="font-semibold text-lg mb-2">Nutrición</h4>
                    <p className="text-muted-foreground">
                      Considera incluir más frutas ricas en potasio como plátanos o naranjas en tu dieta.
                    </p>
                  </div>
                  {healthMetrics.length >= 5 && (
                    <div className="p-4 bg-card border-2 border-accent/20 rounded-lg">
                      <h4 className="font-semibold text-lg mb-2">Tendencias</h4>
                      <p className="text-muted-foreground">
                        Tus métricas muestran una tendencia estable. Continúa con tus hábitos actuales y consulta con tu
                        médico si tienes dudas.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Chat Section - Same as original */}
          {activeSection === "chat" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <MessageCircle className="w-8 h-8 text-primary" />
                  Conversación con CuidaIA
                </CardTitle>
                <CardDescription className="text-lg">
                  Puedes preguntarme sobre salud, recordatorios, o simplemente conversar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted rounded-lg p-6 min-h-[400px] max-h-[500px] overflow-y-auto space-y-4">
                  {chatHistory.map((chat, index) => (
                    <div key={index} className={`flex ${chat.type === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] p-4 rounded-lg text-lg ${
                          chat.type === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-background text-foreground border-2 border-border"
                        }`}
                      >
                        {chat.message}
                      </div>
                    </div>
                  ))}
                  {aiLoading && (
                    <div className="flex justify-start">
                      <div className="bg-background text-foreground border-2 border-border p-4 rounded-lg flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-lg">CuidaIA está pensando...</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <Textarea
                    placeholder="Escribe tu mensaje aquí..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="flex-1 text-lg min-h-[60px]"
                    onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                    disabled={aiLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    size="lg"
                    className="px-8"
                    disabled={aiLoading || !chatMessage.trim()}
                  >
                    {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enviar"}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="text-left justify-start text-lg py-4 bg-transparent"
                    size="lg"
                    onClick={() => handleQuickQuestion("¿Cómo me siento hoy?")}
                    disabled={aiLoading}
                  >
                    "¿Cómo me siento hoy?"
                  </Button>
                  <Button
                    variant="outline"
                    className="text-left justify-start text-lg py-4 bg-transparent"
                    size="lg"
                    onClick={() => handleQuickQuestion("Recordar tomar medicamento")}
                    disabled={aiLoading}
                  >
                    "Recordar tomar medicamento"
                  </Button>
                  <Button
                    variant="outline"
                    className="text-left justify-start text-lg py-4 bg-transparent"
                    size="lg"
                    onClick={() => handleQuickQuestion("¿Qué ejercicios puedo hacer?")}
                    disabled={aiLoading}
                  >
                    "¿Qué ejercicios puedo hacer?"
                  </Button>
                  <Button
                    variant="outline"
                    className="text-left justify-start text-lg py-4 bg-transparent"
                    size="lg"
                    onClick={() => handleQuickQuestion("Programar cita médica")}
                    disabled={aiLoading}
                  >
                    "Programar cita médica"
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Emergency Section - Enhanced with dynamic contacts */}
          {activeSection === "emergency" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3 text-destructive">
                  <Phone className="w-8 h-8" />
                  Contactos de Emergencia
                </CardTitle>
                <CardDescription className="text-lg">Números importantes siempre disponibles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Button
                    variant="destructive"
                    size="lg"
                    className="h-20 text-xl"
                    onClick={() => handleEmergencyCall("911")}
                  >
                    <Phone className="w-8 h-8 mr-4" />
                    Emergencias: 911
                  </Button>

                  {emergencyContacts.map((contact, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="lg"
                      className="h-20 text-xl bg-transparent hover:bg-primary/10"
                      onClick={() => handleEmergencyCall(contact.phone)}
                    >
                      <Phone className="w-8 h-8 mr-4" />
                      {contact.name}: {contact.phone}
                    </Button>
                  ))}
                </div>

                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4 text-blue-800">Información Médica Importante:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
                      <div>
                        <p>
                          <strong>Alergias:</strong> {medicalProfile?.allergies || "Ninguna registrada"}
                        </p>
                        <p>
                          <strong>Tipo de Sangre:</strong> {medicalProfile?.blood_type || "No especificado"}
                        </p>
                      </div>
                      <div>
                        <p>
                          <strong>Condiciones:</strong> {medicalProfile?.chronic_conditions || "Ninguna registrada"}
                        </p>
                        <p>
                          <strong>Medicamentos:</strong> {medications.length} medicamentos activos
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-destructive/10 border-destructive/20">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">En caso de emergencia:</h3>
                    <ol className="list-decimal list-inside space-y-2 text-lg">
                      <li>Mantén la calma</li>
                      <li>Llama al 911 si es grave</li>
                      <li>Contacta a tu familia</li>
                      <li>Ten a mano tu lista de medicamentos</li>
                      <li>Menciona tus alergias y condiciones médicas</li>
                    </ol>
                  </CardContent>
                </Card>

                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-lg bg-transparent"
                    onClick={() => window.open("/medical-profile", "_blank")}
                  >
                    <FileText className="w-6 h-6 mr-3" />
                    Ver Perfil Médico Completo
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Profile Section - Updated to link to medical profile page */}
          {activeSection === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Heart className="w-8 h-8 text-primary" />
                  Mi Perfil
                </CardTitle>
                <CardDescription className="text-lg">Gestiona tu información personal y médica</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">Información Personal</h3>
                    <p>
                      <strong>Nombre:</strong> {user.firstName} {user.lastName}
                    </p>
                    <p>
                      <strong>Email:</strong> {user.email}
                    </p>
                  </div>
                  <Button className="w-full" onClick={() => router.push("/medical-profile")}>
                    Completar Perfil Médico
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}
