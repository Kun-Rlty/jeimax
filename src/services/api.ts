import type { Employee, Client, Site, AttendanceRecord, Contract, PayrollRecord, Expense, SiteAlert } from '@/types'
import { mockEmployees, mockClients, mockSites, mockAttendance, mockContracts, mockPayroll, mockExpenses, mockAlerts } from '@/data/mock'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const employeeService = {
  getAll: async (): Promise<Employee[]> => {
    await delay(300)
    return [...mockEmployees]
  },
  getById: async (id: string): Promise<Employee | undefined> => {
    await delay(200)
    return mockEmployees.find((e) => e.id === id)
  },
  create: async (data: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Promise<Employee> => {
    await delay(500)
    const newEmployee: Employee = {
      ...data,
      id: String(mockEmployees.length + 1),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockEmployees.push(newEmployee)
    return newEmployee
  },
}

export const clientService = {
  getAll: async (): Promise<Client[]> => {
    await delay(300)
    return [...mockClients]
  },
  getById: async (id: string): Promise<Client | undefined> => {
    await delay(200)
    return mockClients.find((c) => c.id === id)
  },
}

export const siteService = {
  getAll: async (): Promise<Site[]> => {
    await delay(300)
    return [...mockSites]
  },
  getById: async (id: string): Promise<Site | undefined> => {
    await delay(200)
    return mockSites.find((s) => s.id === id)
  },
}

export const attendanceService = {
  getAll: async (): Promise<AttendanceRecord[]> => {
    await delay(300)
    return [...mockAttendance]
  },
}

export const contractService = {
  getAll: async (): Promise<Contract[]> => {
    await delay(300)
    return [...mockContracts]
  },
}

export const payrollService = {
  getAll: async (): Promise<PayrollRecord[]> => {
    await delay(300)
    return [...mockPayroll]
  },
}

export const expenseService = {
  getAll: async (): Promise<Expense[]> => {
    await delay(300)
    return [...mockExpenses]
  },
}

export const alertService = {
  getAll: async (): Promise<SiteAlert[]> => {
    await delay(200)
    return [...mockAlerts]
  },
}
