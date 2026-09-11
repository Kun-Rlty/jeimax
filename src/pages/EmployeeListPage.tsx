import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Plus, MoreHorizontal, Eye, Edit, MapPin, Clock, DollarSign } from 'lucide-react'
import { PageHeader, Button, SearchInput, Select, StatusBadge, Badge, EmptyState } from '@/components/ui'
import { mockEmployees, mockSites } from '@/data/mock'
import type { Employee } from '@/types'
import { cn } from '@/utils'

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'new', label: 'New' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'terminated', label: 'Terminated' },
]

const siteOptions = [
  { value: '', label: 'All Sites' },
  ...mockSites.map((s) => ({ value: s.id, label: s.siteName })),
]

export function EmployeeListPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [siteFilter, setSiteFilter] = useState('')
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return mockEmployees.filter((emp) => {
      const matchesSearch =
        !search ||
        emp.employeeId.toLowerCase().includes(search.toLowerCase()) ||
        emp.firstName.toLowerCase().includes(search.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(search.toLowerCase()) ||
        emp.phone.includes(search)
      const matchesStatus = !statusFilter || emp.status === statusFilter
      const matchesSite = !siteFilter || emp.siteId === siteFilter
      return matchesSearch && matchesStatus && matchesSite
    })
  }, [search, statusFilter, siteFilter])

  return (
    <div>
      <PageHeader
        title="Employees"
        description="Manage JIC employees and their employment information."
        actions={
          <Link to="/employees/new">
            <Button icon={<Plus className="h-4 w-4" />}>Add Employee</Button>
          </Link>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 max-w-sm">
          <SearchInput
            placeholder="Search by ID, name, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select options={statusOptions} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} />
        <Select options={siteOptions} value={siteFilter} onChange={(e) => setSiteFilter(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No employees found"
          description="No employees match your current filters. Try adjusting your search criteria."
          action={
            <Button variant="secondary" onClick={() => { setSearch(''); setStatusFilter(''); setSiteFilter('') }}>
              Clear Filters
            </Button>
          }
        />
      ) : (
        <div className="bg-surface rounded-lg border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-secondary border-b border-border">
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Employee ID</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary hidden md:table-cell">Position</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary hidden lg:table-cell">Site</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary hidden lg:table-cell">Phone</th>
                  <th className="text-right px-4 py-3 font-medium text-text-secondary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp) => (
                  <tr key={emp.id} className="border-b border-border-light hover:bg-surface-secondary/50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-text-secondary">{emp.employeeId}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-jic-blue/10 flex items-center justify-center shrink-0">
                          <span className="text-xs font-semibold text-jic-blue">
                            {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-text-primary">{emp.firstName} {emp.lastName}</p>
                          <p className="text-xs text-text-tertiary md:hidden">{emp.position}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-text-secondary hidden md:table-cell">{emp.position}</td>
                    <td className="px-4 py-3 text-text-secondary hidden lg:table-cell">
                      {emp.siteName || <span className="text-text-tertiary italic">Unassigned</span>}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={emp.status} />
                    </td>
                    <td className="px-4 py-3 text-text-secondary hidden lg:table-cell font-mono text-xs">{emp.phone}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1 relative">
                        <Link
                          to={`/employees/${emp.id}`}
                          className="p-1.5 rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface-tertiary transition-colors"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/employees/${emp.id}/edit`}
                          className="p-1.5 rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface-tertiary transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <div className="relative">
                          <button
                            onClick={() => setOpenMenuId(openMenuId === emp.id ? null : emp.id)}
                            className="p-1.5 rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface-tertiary transition-colors"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                          {openMenuId === emp.id && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
                              <div className="absolute right-0 top-full mt-1 w-44 bg-surface rounded-lg border border-border shadow-lg py-1 z-50">
                                <Link
                                  to={`/employees/${emp.id}?tab=attendance`}
                                  onClick={() => setOpenMenuId(null)}
                                  className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-surface-tertiary"
                                >
                                  <Clock className="h-4 w-4" /> View Attendance
                                </Link>
                                <Link
                                  to={`/employees/${emp.id}?tab=payroll`}
                                  onClick={() => setOpenMenuId(null)}
                                  className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-surface-tertiary"
                                >
                                  <DollarSign className="h-4 w-4" /> View Payroll
                                </Link>
                                {emp.status === 'active' && !emp.siteId && (
                                  <Link
                                    to={`/employees/${emp.id}?tab=employment`}
                                    onClick={() => setOpenMenuId(null)}
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-surface-tertiary"
                                  >
                                    <MapPin className="h-4 w-4" /> Assign Site
                                  </Link>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-border flex items-center justify-between text-sm text-text-secondary">
            <span>Showing {filtered.length} of {mockEmployees.length} employees</span>
          </div>
        </div>
      )}
    </div>
  )
}
