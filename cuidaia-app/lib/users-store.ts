// Almacenamiento temporal de usuarios en memoria
// En producción, esto debería ser una base de datos real

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
  dateOfBirth?: string
  createdAt: string
}

// Usuarios predefinidos + usuarios registrados
const users: User[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    email: "maria.gonzalez@email.com",
    password: "$2b$10$example_hash_here",
    firstName: "María",
    lastName: "González",
    createdAt: new Date().toISOString(),
  },
]

export const usersStore = {
  // Obtener todos los usuarios
  getAll: (): User[] => users,

  // Buscar usuario por email
  findByEmail: (email: string): User | undefined => {
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase())
  },

  // Agregar nuevo usuario
  add: (user: User): void => {
    users.push(user)
  },

  // Verificar si email existe
  emailExists: (email: string): boolean => {
    return users.some((u) => u.email.toLowerCase() === email.toLowerCase())
  },
}
