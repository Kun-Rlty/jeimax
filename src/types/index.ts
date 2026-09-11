export type EmployeeStatus = 'new' | 'active' | 'inactive' | 'terminated'

export type SiteStatus = 'new' | 'active' | 'outgoing' | 'inactive' | 'terminated'

export type ContractStatus = 'new' | 'active' | 'expiring' | 'expired'

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'on_leave'

export type ShiftType = 'day' | 'night'

export type PayrollStatus = 'pending' | 'processing' | 'completed' | 'paid'

export type PaymentMethod = 'bank_transfer' | 'cash' | 'mobile_money'

export type ExpenseStatus = 'pending' | 'approved' | 'rejected' | 'paid'

export type UserRole = 'it_chief' | 'md' | 'accountant' | 'contract_tendering' | 'operations_field' | 'hr_compliance'

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: UserRole
  avatar?: string
}

export interface Employee {
  id: string
  employeeId: string
  firstName: string
  lastName: string
  phone: string
  email?: string
  position: string
  siteId?: string
  siteName?: string
  status: EmployeeStatus
  hireDate: string
  contractEndDate?: string
  nationalId?: string
  address?: string
  emergencyContact?: string
  emergencyPhone?: string
  createdAt: string
  updatedAt: string
}

export interface Client {
  id: string
  clientId: string
  name: string
  contactPerson: string
  phone: string
  email: string
  address?: string
  contractStart?: string
  contractEnd?: string
  status: ContractStatus
  sites: string[]
  totalGuards: number
  createdAt: string
}

export interface Site {
  id: string
  siteName: string
  clientId: string
  clientName: string
  location: string
  status: SiteStatus
  requiredGuards: number
  assignedGuards: number
  dayShiftGuards: number
  nightShiftGuards: number
  contractStart?: string
  contractEnd?: string
  malindoSite: boolean
  minimumGuards: number
  createdAt: string
}

export interface GuardAssignment {
  id: string
  employeeId: string
  employeeName: string
  siteId: string
  siteName: string
  shift: ShiftType
  startDate: string
  endDate?: string
  isActive: boolean
}

export interface AttendanceRecord {
  id: string
  employeeId: string
  employeeName: string
  siteId: string
  siteName: string
  date: string
  status: AttendanceStatus
  checkIn?: string
  checkOut?: string
  shift: ShiftType
  overtime: number
  notes?: string
}

export interface Contract {
  id: string
  contractNumber: string
  entityType: 'employee' | 'client' | 'site'
  entityId: string
  entityName: string
  startDate: string
  endDate: string
  status: ContractStatus
  terms?: string
  value?: number
  createdAt: string
}

export interface PayrollRecord {
  id: string
  period: string
  type: 'government' | 'private' | 'staff'
  employeeId: string
  employeeName: string
  siteName?: string
  baseSalary: number
  overtime: number
  overtimeShifts: number
  grossAmount: number
  deductions: number
  netAmount: number
  status: PayrollStatus
  paidDate?: string
}

export interface Expense {
  id: string
  date: string
  category: string
  description: string
  amount: number
  paymentMethod: PaymentMethod
  receiptUrl?: string
  status: ExpenseStatus
  submittedBy: string
  approvedBy?: string
  createdAt: string
}

export interface OvertimeRecord {
  id: string
  employeeId: string
  employeeName: string
  siteId: string
  siteName: string
  date: string
  shift: ShiftType
  amount: number
  paid: boolean
  paidOnSpot: boolean
}

export interface Incident {
  id: string
  siteId: string
  siteName: string
  date: string
  type: string
  description: string
  reportedBy: string
  status: 'open' | 'investigating' | 'resolved'
}

export interface SiteAlert {
  id: string
  siteId: string
  siteName: string
  type: 'staffing' | 'contract' | 'attendance' | 'incident'
  message: string
  severity: 'low' | 'medium' | 'high'
}
