export type UserRole = "coordinator" | "volunteer"

export interface User {
  id: string
  name: string
  email: string
  password: string // In production, this should be hashed
  role: UserRole
  phone?: string
  createdAt: string
}

export interface Volunteer {
  id: string
  userId?: string // Link to user account
  name: string
  email: string
  phone: string
  availability: string[]
  skills: string[]
  joinedDate: string
}

export interface Plot {
  id: string
  number: number
  familyId: string
  size: number
  plantType: string // Added plant type
  plantingDate: string // Added planting date
  harvestForecast: string // Added harvest forecast date
  status: "active" | "idle" | "preparation"
  assignedDate: string
}

export interface Workday {
  id: string
  title: string
  date: string
  startTime: string
  endTime: string
  activities: string[]
  coordinatorId: string
  attendance: { volunteerId: string; present: boolean; hours: number }[]
  notes?: string
}

export interface Family {
  id: string
  name: string
  members: number
  contactPerson: string
  contactPhone: string
  plotIds: string[]
  volunteerIds: string[]
  sharePercentage: number
}

export interface Production {
  id: string
  plotId: string
  crop: string
  quantity: number
  unit: string
  harvestDate: string
  benefitedFamilies: { familyId: string; amount: number }[]
  distributed: boolean
  workdayId?: string
}

export interface Harvest {
  id: string
  plotId: string
  crop: string
  quantity: number
  unit: string
  date: string
  distributed: boolean
  familyShares: { familyId: string; amount: number }[]
}

export interface NutritionalData {
  crop: string
  caloriesPerKg: number
  proteinPerKg: number
  vitamins: string[]
}

export const nutritionalDatabase: Record<string, NutritionalData> = {
  tomate: { crop: "Tomate", caloriesPerKg: 180, proteinPerKg: 8.8, vitamins: ["Vitamina C", "Vitamina A"] },
  alface: { crop: "Alface", caloriesPerKg: 150, proteinPerKg: 13.6, vitamins: ["Vitamina K", "Vitamina A"] },
  cenoura: { crop: "Cenoura", caloriesPerKg: 410, proteinPerKg: 9.3, vitamins: ["Vitamina A", "Vitamina K"] },
  couve: { crop: "Couve", caloriesPerKg: 490, proteinPerKg: 33.5, vitamins: ["Vitamina K", "Vitamina C", "Cálcio"] },
  beterraba: { crop: "Beterraba", caloriesPerKg: 430, proteinPerKg: 16, vitamins: ["Folato", "Manganês"] },
  outros: { crop: "Outros", caloriesPerKg: 300, proteinPerKg: 15, vitamins: ["Variado"] },
}
