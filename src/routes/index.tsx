import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout'
import {
  DashboardPage,
  EmployeeListPage,
  EmployeeDetailPage,
  AddEmployeePage,
  ClientListPage,
  ClientDetailPage,
  SiteListPage,
  SiteDetailPage,
  OperationsPage,
  AttendancePage,
  ContractsPage,
  PayrollPage,
  ExpensesPage,
  ReportsPage,
  SettingsPage,
} from '@/pages'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'employees', element: <EmployeeListPage /> },
      { path: 'employees/new', element: <AddEmployeePage /> },
      { path: 'employees/:id', element: <EmployeeDetailPage /> },
      { path: 'employees/:id/edit', element: <AddEmployeePage /> },
      { path: 'clients', element: <ClientListPage /> },
      { path: 'clients/new', element: <ClientListPage /> },
      { path: 'clients/:id', element: <ClientDetailPage /> },
      { path: 'clients/:id/edit', element: <ClientListPage /> },
      { path: 'sites', element: <SiteListPage /> },
      { path: 'sites/new', element: <SiteListPage /> },
      { path: 'sites/:id', element: <SiteDetailPage /> },
      { path: 'sites/:id/edit', element: <SiteListPage /> },
      { path: 'operations', element: <OperationsPage /> },
      { path: 'attendance', element: <AttendancePage /> },
      { path: 'contracts', element: <ContractsPage /> },
      { path: 'payroll', element: <PayrollPage /> },
      { path: 'expenses', element: <ExpensesPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
])
