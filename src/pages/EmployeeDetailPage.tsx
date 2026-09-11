import { useState, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Edit,
  MapPin,
  Clock,
  DollarSign,
  FileText,
  Phone,
  Mail,
  Home,
  AlertTriangle,
} from 'lucide-react'
import { PageHeader, Button, StatusBadge, Badge, Card, CardTitle, Tabs } from '@/components/ui'
import { mockEmployees, mockSites, mockAttendance, mockPayroll } from '@/data/mock'
import { formatDate, calculateDaysRemaining, cn } from '@/utils'

export function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const employee = mockEmployees.find((e) => e.id === id)

  const urlParams = new URLSearchParams(window.location.search)
  const [activeTab, setActiveTab] = useState(urlParams.get('tab') || 'overview')

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'employment', label: 'Employment' },
    { id: 'contract', label: 'Contract' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'payroll', label: 'Payroll' },
    { id: 'history', label: 'History' },
  ]

  const employeeAttendance = useMemo(
    () => mockAttendance.filter((a) => a.employeeId === id),
    [id]
  )

  const employeePayroll = useMemo(
    () => mockPayroll.filter((p) => p.employeeId === id),
    [id]
  )

  if (!employee) {
    return (
      <div>
        <PageHeader title="Employee Not Found" breadcrumbs={[{ label: 'Employees', href: '/employees' }, { label: 'Not Found' }]} />
        <Card>
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-text-tertiary mx-auto mb-3" />
            <p className="text-text-secondary">Employee not found.</p>
            <Link to="/employees">
              <Button variant="secondary" className="mt-4">Back to Employees</Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  const daysRemaining = employee.contractEndDate ? calculateDaysRemaining(employee.contractEndDate) : null

  return (
    <div>
      <PageHeader
        title={`${employee.firstName} ${employee.lastName}`}
        description={employee.employeeId}
        breadcrumbs={[
          { label: 'Employees', href: '/employees' },
          { label: `${employee.firstName} ${employee.lastName}` },
        ]}
        actions={
          <div className="flex gap-2">
            <Link to={`/employees/${employee.id}/edit`}>
              <Button variant="secondary" icon={<Edit className="h-4 w-4" />}>Edit</Button>
            </Link>
          </div>
        }
      />

      <div className="bg-surface rounded-lg border border-border p-5 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-jic-blue flex items-center justify-center shrink-0">
            <span className="text-white text-lg font-semibold">
              {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-lg font-semibold text-text-primary">
                {employee.firstName} {employee.lastName}
              </h2>
              <StatusBadge status={employee.status} />
              {employee.siteId && <Badge variant="info" dot>{employee.siteName}</Badge>}
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-text-secondary">
              <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{employee.phone}</span>
              {employee.email && <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{employee.email}</span>}
              <span className="flex items-center gap-1"><Home className="h-3.5 w-3.5" />{employee.position}</span>
            </div>
          </div>
          {daysRemaining !== null && (
            <div className={cn(
              'text-right shrink-0',
              daysRemaining < 0 ? 'text-danger' : daysRemaining <= 30 ? 'text-warning' : 'text-text-secondary'
            )}>
              <p className="text-xs text-text-tertiary">Contract ends</p>
              <p className="text-sm font-medium">{formatDate(employee.contractEndDate!)}</p>
              <p className="text-xs">
                {daysRemaining < 0 ? `Expired ${Math.abs(daysRemaining)} days ago` : `${daysRemaining} days remaining`}
              </p>
            </div>
          )}
        </div>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-4" />

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardTitle>Personal Information</CardTitle>
            <div className="mt-4 space-y-3">
              <InfoRow label="Employee ID" value={employee.employeeId} />
              <InfoRow label="Full Name" value={`${employee.firstName} ${employee.lastName}`} />
              <InfoRow label="Phone" value={employee.phone} />
              {employee.email && <InfoRow label="Email" value={employee.email} />}
              {employee.nationalId && <InfoRow label="National ID" value={employee.nationalId} />}
              {employee.address && <InfoRow label="Address" value={employee.address} />}
            </div>
          </Card>
          <Card>
            <CardTitle>Employment Information</CardTitle>
            <div className="mt-4 space-y-3">
              <InfoRow label="Position" value={employee.position} />
              <InfoRow label="Status" value={<StatusBadge status={employee.status} />} />
              <InfoRow label="Hire Date" value={formatDate(employee.hireDate)} />
              <InfoRow label="Current Site" value={employee.siteName || 'Unassigned'} />
              {employee.contractEndDate && (
                <InfoRow label="Contract End" value={formatDate(employee.contractEndDate)} />
              )}
            </div>
          </Card>
          {employee.emergencyContact && (
            <Card className="lg:col-span-2">
              <CardTitle>Emergency Contact</CardTitle>
              <div className="mt-4 flex gap-8">
                <InfoRow label="Name" value={employee.emergencyContact} />
                <InfoRow label="Phone" value={employee.emergencyPhone || '-'} />
              </div>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'employment' && (
        <Card>
          <CardTitle>Site Assignment</CardTitle>
          <div className="mt-4">
            {employee.siteId ? (
              <div className="flex items-center justify-between p-4 bg-surface-secondary rounded-lg">
                <div>
                  <p className="font-medium text-text-primary">{employee.siteName}</p>
                  <p className="text-sm text-text-secondary">Currently assigned</p>
                </div>
                <Link to={`/sites/${employee.siteId}`}>
                  <Button variant="secondary" size="sm" icon={<MapPin className="h-4 w-4" />}>View Site</Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <MapPin className="h-10 w-10 text-text-tertiary mx-auto mb-3" />
                <p className="text-text-secondary mb-3">This employee is not assigned to any site.</p>
                <Button size="sm" icon={<MapPin className="h-4 w-4" />}>Assign to Site</Button>
              </div>
            )}
          </div>
        </Card>
      )}

      {activeTab === 'contract' && (
        <Card>
          <CardTitle>Contract Information</CardTitle>
          <div className="mt-4 space-y-3">
            <InfoRow label="Contract Start" value={employee.hireDate ? formatDate(employee.hireDate) : '-'} />
            <InfoRow label="Contract End" value={employee.contractEndDate ? formatDate(employee.contractEndDate) : '-'} />
            <InfoRow
              label="Status"
              value={
                daysRemaining !== null ? (
                  <span className={cn(
                    'font-medium',
                    daysRemaining < 0 ? 'text-danger' : daysRemaining <= 30 ? 'text-warning' : 'text-success'
                  )}>
                    {daysRemaining < 0 ? 'Expired' : daysRemaining <= 30 ? 'Expiring Soon' : 'Active'}
                    {' '}({daysRemaining < 0 ? Math.abs(daysRemaining) + ' days overdue' : daysRemaining + ' days remaining'})
                  </span>
                ) : '-'
              }
            />
          </div>
          <div className="mt-4 flex gap-2">
            <Button variant="secondary" size="sm" icon={<FileText className="h-4 w-4" />}>Renew Contract</Button>
          </div>
        </Card>
      )}

      {activeTab === 'attendance' && (
        <Card>
          <CardTitle>Recent Attendance</CardTitle>
          <div className="mt-4 overflow-x-auto">
            {employeeAttendance.length === 0 ? (
              <p className="text-sm text-text-secondary py-4 text-center">No attendance records found.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-text-secondary font-medium">Date</th>
                    <th className="text-left py-2 text-text-secondary font-medium">Site</th>
                    <th className="text-left py-2 text-text-secondary font-medium">Shift</th>
                    <th className="text-left py-2 text-text-secondary font-medium">Check In</th>
                    <th className="text-left py-2 text-text-secondary font-medium">Check Out</th>
                    <th className="text-left py-2 text-text-secondary font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {employeeAttendance.map((record) => (
                    <tr key={record.id} className="border-b border-border-light">
                      <td className="py-2.5">{record.date}</td>
                      <td className="py-2.5 text-text-secondary">{record.siteName}</td>
                      <td className="py-2.5"><Badge variant={record.shift === 'day' ? 'info' : 'neutral'}>{record.shift}</Badge></td>
                      <td className="py-2.5 text-text-secondary">{record.checkIn || '-'}</td>
                      <td className="py-2.5 text-text-secondary">{record.checkOut || '-'}</td>
                      <td className="py-2.5"><StatusBadge status={record.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      )}

      {activeTab === 'payroll' && (
        <Card>
          <CardTitle>Payroll History</CardTitle>
          <div className="mt-4 overflow-x-auto">
            {employeePayroll.length === 0 ? (
              <p className="text-sm text-text-secondary py-4 text-center">No payroll records found.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-text-secondary font-medium">Period</th>
                    <th className="text-right py-2 text-text-secondary font-medium">Base</th>
                    <th className="text-right py-2 text-text-secondary font-medium">Overtime</th>
                    <th className="text-right py-2 text-text-secondary font-medium">Deductions</th>
                    <th className="text-right py-2 text-text-secondary font-medium">Net</th>
                    <th className="text-left py-2 text-text-secondary font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {employeePayroll.map((record) => (
                    <tr key={record.id} className="border-b border-border-light">
                      <td className="py-2.5">{record.period}</td>
                      <td className="py-2.5 text-right font-mono text-xs">{record.baseSalary.toLocaleString()}</td>
                      <td className="py-2.5 text-right font-mono text-xs">{record.overtime.toLocaleString()}</td>
                      <td className="py-2.5 text-right font-mono text-xs">{record.deductions.toLocaleString()}</td>
                      <td className="py-2.5 text-right font-mono text-xs font-medium">{record.netAmount.toLocaleString()}</td>
                      <td className="py-2.5"><StatusBadge status={record.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      )}

      {activeTab === 'history' && (
        <Card>
          <CardTitle>Employment History</CardTitle>
          <div className="mt-4">
            <div className="space-y-4">
              <TimelineItem
                date={employee.createdAt}
                title="Employee Created"
                description={`${employee.firstName} ${employee.lastName} was added to the system.`}
              />
              {employee.siteId && (
                <TimelineItem
                  date={employee.updatedAt}
                  title="Site Assignment"
                  description={`Assigned to ${employee.siteName}`}
                />
              )}
              <TimelineItem
                date={employee.hireDate}
                title="Employment Started"
                description={`Hired as ${employee.position}`}
              />
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
      <span className="text-sm text-text-tertiary w-32 shrink-0">{label}</span>
      <span className="text-sm text-text-primary">{value}</span>
    </div>
  )
}

function TimelineItem({ date, title, description }: { date: string; title: string; description: string }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className="w-2 h-2 rounded-full bg-jic-blue mt-1.5" />
        <div className="w-px flex-1 bg-border" />
      </div>
      <div className="pb-4">
        <p className="text-sm font-medium text-text-primary">{title}</p>
        <p className="text-xs text-text-secondary mt-0.5">{description}</p>
        <p className="text-xs text-text-tertiary mt-1">{formatDate(date)}</p>
      </div>
    </div>
  )
}
