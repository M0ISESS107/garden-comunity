"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User, Volunteer, Plot, Family, Production, Workday } from "./types"

interface GardenState {
  currentUser: User | null
  users: User[]

  volunteers: Volunteer[]
  plots: Plot[]
  families: Family[]
  productions: Production[]
  workdays: Workday[]

  login: (email: string, password: string) => User | null
  logout: () => void
  register: (user: Omit<User, "id" | "createdAt">) => void

  // Volunteer actions
  addVolunteer: (volunteer: Omit<Volunteer, "id">) => void
  updateVolunteer: (id: string, volunteer: Partial<Volunteer>) => void
  deleteVolunteer: (id: string) => void

  // Plot actions
  addPlot: (plot: Omit<Plot, "id">) => void
  updatePlot: (id: string, plot: Partial<Plot>) => void
  deletePlot: (id: string) => void

  // Family actions
  addFamily: (family: Omit<Family, "id">) => void
  updateFamily: (id: string, family: Partial<Family>) => void
  deleteFamily: (id: string) => void

  addProduction: (production: Omit<Production, "id">) => void
  updateProduction: (id: string, production: Partial<Production>) => void
  deleteProduction: (id: string) => void
  distributeProduction: (id: string) => void

  addWorkday: (workday: Omit<Workday, "id">) => void
  updateWorkday: (id: string, workday: Partial<Workday>) => void
  deleteWorkday: (id: string) => void
  markAttendance: (workdayId: string, volunteerId: string, present: boolean, hours: number) => void
}

export const useGardenStore = create<GardenState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [],
      volunteers: [],
      plots: [],
      families: [],
      productions: [],
      workdays: [],

      login: (email, password) => {
        const user = get().users.find((u) => u.email === email && u.password === password)
        if (user) {
          set({ currentUser: user })
          return user
        }
        return null
      },

      logout: () => set({ currentUser: null }),

      register: (user) =>
        set((state) => ({
          users: [...state.users, { ...user, id: crypto.randomUUID(), createdAt: new Date().toISOString() }],
        })),

      addVolunteer: (volunteer) =>
        set((state) => ({
          volunteers: [...state.volunteers, { ...volunteer, id: crypto.randomUUID() }],
        })),

      updateVolunteer: (id, volunteer) =>
        set((state) => ({
          volunteers: state.volunteers.map((v) => (v.id === id ? { ...v, ...volunteer } : v)),
        })),

      deleteVolunteer: (id) =>
        set((state) => ({
          volunteers: state.volunteers.filter((v) => v.id !== id),
        })),

      addPlot: (plot) =>
        set((state) => ({
          plots: [...state.plots, { ...plot, id: crypto.randomUUID() }],
        })),

      updatePlot: (id, plot) =>
        set((state) => ({
          plots: state.plots.map((p) => (p.id === id ? { ...p, ...plot } : p)),
        })),

      deletePlot: (id) =>
        set((state) => ({
          plots: state.plots.filter((p) => p.id !== id),
        })),

      addFamily: (family) =>
        set((state) => ({
          families: [...state.families, { ...family, id: crypto.randomUUID() }],
        })),

      updateFamily: (id, family) =>
        set((state) => ({
          families: state.families.map((f) => (f.id === id ? { ...f, ...family } : f)),
        })),

      deleteFamily: (id) =>
        set((state) => ({
          families: state.families.filter((f) => f.id !== id),
        })),

      addProduction: (production) =>
        set((state) => ({
          productions: [...state.productions, { ...production, id: crypto.randomUUID() }],
        })),

      updateProduction: (id, production) =>
        set((state) => ({
          productions: state.productions.map((p) => (p.id === id ? { ...p, ...production } : p)),
        })),

      deleteProduction: (id) =>
        set((state) => ({
          productions: state.productions.filter((p) => p.id !== id),
        })),

      distributeProduction: (id) =>
        set((state) => ({
          productions: state.productions.map((p) => (p.id === id ? { ...p, distributed: true } : p)),
        })),

      addWorkday: (workday) =>
        set((state) => ({
          workdays: [...state.workdays, { ...workday, id: crypto.randomUUID() }],
        })),

      updateWorkday: (id, workday) =>
        set((state) => ({
          workdays: state.workdays.map((w) => (w.id === id ? { ...w, ...workday } : w)),
        })),

      deleteWorkday: (id) =>
        set((state) => ({
          workdays: state.workdays.filter((w) => w.id !== id),
        })),

      markAttendance: (workdayId, volunteerId, present, hours) =>
        set((state) => ({
          workdays: state.workdays.map((w) => {
            if (w.id === workdayId) {
              const existingAttendance = w.attendance.find((a) => a.volunteerId === volunteerId)
              if (existingAttendance) {
                return {
                  ...w,
                  attendance: w.attendance.map((a) => (a.volunteerId === volunteerId ? { ...a, present, hours } : a)),
                }
              } else {
                return {
                  ...w,
                  attendance: [...w.attendance, { volunteerId, present, hours }],
                }
              }
            }
            return w
          }),
        })),
    }),
    {
      name: "garden-storage",
    },
  ),
)
