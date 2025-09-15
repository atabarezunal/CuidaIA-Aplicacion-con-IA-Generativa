"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Heart, ArrowLeft, Save, Plus, X, Loader2, User, Stethoscope, Pill, Phone } from "lucide-react"
import Link from "next/link"

interface MedicalProfile {
  bloodType: string
  allergies: string
  chronicConditions: string
  currentMedications: string
  medicalNotes: string
  primaryDoctorName: string
  primaryDoctorPhone: string
  insuranceProvider: string
  insuranceNumber: string
}

interface Medication {
  id?: string
  name: string
  dosage: string
  frequency: string
  instructions: string
  startDate: string
  isActive: boolean
}

interface EmergencyContact {
  id?: string
  name: string
  phone: string
  relationship: string
  isPrimary: boolean
  notes: string
}

export default function MedicalProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("personal")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  // Estados para los formularios
  const [medicalProfile, setMedicalProfile] = useState<MedicalProfile>({
    bloodType: "",
    allergies: "",
    chronicConditions: "",
    currentMedications: "",
    medicalNotes: "",
    primaryDoctorName: "",
    primaryDoctorPhone: "",
    insuranceProvider: "",
    insuranceNumber: "",
  })

  const [medications, setMedications] = useState<Medication[]>([])
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([])

  // Estados para nuevos elementos
  const [newMedication, setNewMedication] = useState<Medication>({
    name: "",
    dosage: "",
    frequency: "",
    instructions: "",
    startDate: "",
    isActive: true,
  })

  const [newContact, setNewContact] = useState<EmergencyContact>({
    name: "",
    phone: "",
    relationship: "",
    isPrimary: false,
    notes: "",
  })

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
      loadMedicalProfile(parsedUser.id)
    } catch (error) {
      console.error("Error parsing user data:", error)
      router.push("/login")
    }
  }, [router])

  const loadMedicalProfile = async (userId: string) => {
    try {
      const response = await fetch(`/api/medical-profile/${userId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.profile) setMedicalProfile(data.profile)
        if (data.medications) setMedications(data.medications)
        if (data.emergencyContacts) setEmergencyContacts(data.emergencyContacts)
      }
    } catch (error) {
      console.error("Error loading medical profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveMedicalProfile = async () => {
    setIsSaving(true)
    setError("")
    setMessage("")

    try {
      const response = await fetch("/api/medical-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          userId: user.id,
          profile: medicalProfile,
          medications,
          emergencyContacts,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage("Perfil médico guardado exitosamente")
        setTimeout(() => setMessage(""), 3000)
      } else {
        setError(data.error || "Error al guardar el perfil")
      }
    } catch (error) {
      setError("Error de conexión. Intenta de nuevo.")
    } finally {
      setIsSaving(false)
    }
  }

  const addMedication = () => {
    if (!newMedication.name || !newMedication.dosage || !newMedication.frequency) {
      setError("Por favor completa todos los campos del medicamento")
      return
    }

    setMedications([...medications, { ...newMedication, id: crypto.randomUUID() }])
    setNewMedication({
      name: "",
      dosage: "",
      frequency: "",
      instructions: "",
      startDate: "",
      isActive: true,
    })
    setError("")
  }

  const removeMedication = (id: string) => {
    setMedications(medications.filter((med) => med.id !== id))
  }

  const addEmergencyContact = () => {
    if (!newContact.name || !newContact.phone || !newContact.relationship) {
      setError("Por favor completa todos los campos del contacto")
      return
    }

    setEmergencyContacts([...emergencyContacts, { ...newContact, id: crypto.randomUUID() }])
    setNewContact({
      name: "",
      phone: "",
      relationship: "",
      isPrimary: false,
      notes: "",
    })
    setError("")
  }

  const removeEmergencyContact = (id: string) => {
    setEmergencyContacts(emergencyContacts.filter((contact) => contact.id !== id))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-xl">Cargando perfil médico...</span>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: "personal", label: "Información Personal", icon: User },
    { id: "medical", label: "Historia Médica", icon: Stethoscope },
    { id: "medications", label: "Medicamentos", icon: Pill },
    { id: "contacts", label: "Contactos de Emergencia", icon: Phone },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b-2 border-border p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Perfil Médico</h1>
                <p className="text-muted-foreground">Gestiona tu información de salud</p>
              </div>
            </div>
          </div>
          <Button onClick={saveMedicalProfile} disabled={isSaving} className="text-lg px-6">
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Guardar
              </>
            )}
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        {/* Messages */}
        {message && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <AlertDescription className="text-lg text-green-800">{message}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription className="text-lg">{error}</AlertDescription>
          </Alert>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                size="lg"
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 text-lg px-4 py-3"
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </Button>
            )
          })}
        </div>

        {/* Tab Content */}
        {activeTab === "personal" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <User className="w-6 h-6 text-primary" />
                Información Personal
              </CardTitle>
              <CardDescription className="text-lg">Datos básicos y información de contacto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-lg font-medium">
                    Nombre
                  </Label>
                  <Input
                    id="firstName"
                    value={user?.firstName || ""}
                    className="text-lg h-12"
                    disabled
                    placeholder="Tu nombre"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-lg font-medium">
                    Apellido
                  </Label>
                  <Input
                    id="lastName"
                    value={user?.lastName || ""}
                    className="text-lg h-12"
                    disabled
                    placeholder="Tu apellido"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-lg font-medium">
                    Correo electrónico
                  </Label>
                  <Input
                    id="email"
                    value={user?.email || ""}
                    className="text-lg h-12"
                    disabled
                    placeholder="tu@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bloodType" className="text-lg font-medium">
                    Tipo de sangre
                  </Label>
                  <Select
                    value={medicalProfile.bloodType}
                    onValueChange={(value) => setMedicalProfile({ ...medicalProfile, bloodType: value })}
                  >
                    <SelectTrigger className="text-lg h-12">
                      <SelectValue placeholder="Selecciona tu tipo de sangre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="insuranceProvider" className="text-lg font-medium">
                  Proveedor de seguro médico
                </Label>
                <Input
                  id="insuranceProvider"
                  value={medicalProfile.insuranceProvider}
                  onChange={(e) => setMedicalProfile({ ...medicalProfile, insuranceProvider: e.target.value })}
                  className="text-lg h-12"
                  placeholder="IMSS, ISSSTE, Seguro privado, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="insuranceNumber" className="text-lg font-medium">
                  Número de seguro
                </Label>
                <Input
                  id="insuranceNumber"
                  value={medicalProfile.insuranceNumber}
                  onChange={(e) => setMedicalProfile({ ...medicalProfile, insuranceNumber: e.target.value })}
                  className="text-lg h-12"
                  placeholder="Número de afiliación"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "medical" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Stethoscope className="w-6 h-6 text-primary" />
                Historia Médica
              </CardTitle>
              <CardDescription className="text-lg">
                Información médica importante y condiciones de salud
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="primaryDoctorName" className="text-lg font-medium">
                    Médico de cabecera
                  </Label>
                  <Input
                    id="primaryDoctorName"
                    value={medicalProfile.primaryDoctorName}
                    onChange={(e) => setMedicalProfile({ ...medicalProfile, primaryDoctorName: e.target.value })}
                    className="text-lg h-12"
                    placeholder="Dr. Juan Pérez"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primaryDoctorPhone" className="text-lg font-medium">
                    Teléfono del médico
                  </Label>
                  <Input
                    id="primaryDoctorPhone"
                    value={medicalProfile.primaryDoctorPhone}
                    onChange={(e) => setMedicalProfile({ ...medicalProfile, primaryDoctorPhone: e.target.value })}
                    className="text-lg h-12"
                    placeholder="+52 555 123 4567"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergies" className="text-lg font-medium">
                  Alergias
                </Label>
                <Textarea
                  id="allergies"
                  value={medicalProfile.allergies}
                  onChange={(e) => setMedicalProfile({ ...medicalProfile, allergies: e.target.value })}
                  className="text-lg min-h-[100px]"
                  placeholder="Penicilina, mariscos, polen, etc. Describe cualquier alergia conocida"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="chronicConditions" className="text-lg font-medium">
                  Condiciones crónicas
                </Label>
                <Textarea
                  id="chronicConditions"
                  value={medicalProfile.chronicConditions}
                  onChange={(e) => setMedicalProfile({ ...medicalProfile, chronicConditions: e.target.value })}
                  className="text-lg min-h-[100px]"
                  placeholder="Diabetes, hipertensión, artritis, etc. Describe condiciones médicas permanentes"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicalNotes" className="text-lg font-medium">
                  Notas médicas adicionales
                </Label>
                <Textarea
                  id="medicalNotes"
                  value={medicalProfile.medicalNotes}
                  onChange={(e) => setMedicalProfile({ ...medicalProfile, medicalNotes: e.target.value })}
                  className="text-lg min-h-[120px]"
                  placeholder="Cirugías previas, tratamientos especiales, observaciones importantes, etc."
                />
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "medications" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Pill className="w-6 h-6 text-primary" />
                Medicamentos
              </CardTitle>
              <CardDescription className="text-lg">Gestiona tu lista de medicamentos actuales</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Lista de medicamentos actuales */}
              {medications.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Medicamentos actuales</h3>
                  {medications.map((medication) => (
                    <div key={medication.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold">{medication.name}</h4>
                          <Badge variant={medication.isActive ? "secondary" : "outline"}>
                            {medication.isActive ? "Activo" : "Inactivo"}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">
                          <strong>Dosis:</strong> {medication.dosage} | <strong>Frecuencia:</strong>{" "}
                          {medication.frequency}
                        </p>
                        {medication.instructions && (
                          <p className="text-muted-foreground">
                            <strong>Instrucciones:</strong> {medication.instructions}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeMedication(medication.id!)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Formulario para agregar nuevo medicamento */}
              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-4">Agregar nuevo medicamento</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="medName" className="text-lg font-medium">
                      Nombre del medicamento
                    </Label>
                    <Input
                      id="medName"
                      value={newMedication.name}
                      onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                      className="text-lg h-12"
                      placeholder="Metformina"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medDosage" className="text-lg font-medium">
                      Dosis
                    </Label>
                    <Input
                      id="medDosage"
                      value={newMedication.dosage}
                      onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                      className="text-lg h-12"
                      placeholder="500mg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medFrequency" className="text-lg font-medium">
                      Frecuencia
                    </Label>
                    <Select
                      value={newMedication.frequency}
                      onValueChange={(value) => setNewMedication({ ...newMedication, frequency: value })}
                    >
                      <SelectTrigger className="text-lg h-12">
                        <SelectValue placeholder="Selecciona frecuencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Una vez al día">Una vez al día</SelectItem>
                        <SelectItem value="Cada 12 horas">Cada 12 horas</SelectItem>
                        <SelectItem value="Cada 8 horas">Cada 8 horas</SelectItem>
                        <SelectItem value="Cada 6 horas">Cada 6 horas</SelectItem>
                        <SelectItem value="Según necesidad">Según necesidad</SelectItem>
                        <SelectItem value="Semanal">Semanal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medStartDate" className="text-lg font-medium">
                      Fecha de inicio
                    </Label>
                    <Input
                      id="medStartDate"
                      type="date"
                      value={newMedication.startDate}
                      onChange={(e) => setNewMedication({ ...newMedication, startDate: e.target.value })}
                      className="text-lg h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <Label htmlFor="medInstructions" className="text-lg font-medium">
                    Instrucciones especiales
                  </Label>
                  <Textarea
                    id="medInstructions"
                    value={newMedication.instructions}
                    onChange={(e) => setNewMedication({ ...newMedication, instructions: e.target.value })}
                    className="text-lg min-h-[80px]"
                    placeholder="Tomar con alimentos, evitar alcohol, etc."
                  />
                </div>

                <Button onClick={addMedication} className="mt-4 text-lg px-6">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Medicamento
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "contacts" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Phone className="w-6 h-6 text-primary" />
                Contactos de Emergencia
              </CardTitle>
              <CardDescription className="text-lg">
                Personas importantes a contactar en caso de emergencia
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Lista de contactos actuales */}
              {emergencyContacts.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Contactos registrados</h3>
                  {emergencyContacts.map((contact) => (
                    <div key={contact.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold">{contact.name}</h4>
                          {contact.isPrimary && <Badge variant="default">Contacto Principal</Badge>}
                        </div>
                        <p className="text-muted-foreground">
                          <strong>Teléfono:</strong> {contact.phone} | <strong>Relación:</strong> {contact.relationship}
                        </p>
                        {contact.notes && (
                          <p className="text-muted-foreground">
                            <strong>Notas:</strong> {contact.notes}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeEmergencyContact(contact.id!)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Formulario para agregar nuevo contacto */}
              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-4">Agregar nuevo contacto</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactName" className="text-lg font-medium">
                      Nombre completo
                    </Label>
                    <Input
                      id="contactName"
                      value={newContact.name}
                      onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                      className="text-lg h-12"
                      placeholder="Ana González"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPhone" className="text-lg font-medium">
                      Teléfono
                    </Label>
                    <Input
                      id="contactPhone"
                      value={newContact.phone}
                      onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                      className="text-lg h-12"
                      placeholder="+52 555 123 4567"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactRelationship" className="text-lg font-medium">
                      Relación
                    </Label>
                    <Select
                      value={newContact.relationship}
                      onValueChange={(value) => setNewContact({ ...newContact, relationship: value })}
                    >
                      <SelectTrigger className="text-lg h-12">
                        <SelectValue placeholder="Selecciona relación" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hijo/a">Hijo/a</SelectItem>
                        <SelectItem value="Esposo/a">Esposo/a</SelectItem>
                        <SelectItem value="Hermano/a">Hermano/a</SelectItem>
                        <SelectItem value="Nieto/a">Nieto/a</SelectItem>
                        <SelectItem value="Médico">Médico</SelectItem>
                        <SelectItem value="Amigo/a">Amigo/a</SelectItem>
                        <SelectItem value="Vecino/a">Vecino/a</SelectItem>
                        <SelectItem value="Otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <Label htmlFor="contactNotes" className="text-lg font-medium">
                    Notas adicionales
                  </Label>
                  <Textarea
                    id="contactNotes"
                    value={newContact.notes}
                    onChange={(e) => setNewContact({ ...newContact, notes: e.target.value })}
                    className="text-lg min-h-[80px]"
                    placeholder="Vive cerca, disponible 24/7, etc."
                  />
                </div>

                <Button onClick={addEmergencyContact} className="mt-4 text-lg px-6">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Contacto
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
