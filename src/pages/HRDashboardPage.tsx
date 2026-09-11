import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Users, UserPlus, Clock, FileText, AlertTriangle, ArrowRight } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { StatCard, Card, CardTitle, StatusBadge, Badge } from '@/components/ui'
import { mockEmployees, mockAttendance, mockContracts } from '@/data/mock'
import { calculateDaysRemaining, cn } from '@/utils'

const attendanceTrend = [
  { day: 'Mon', present: 10, absent: 1, late: 1 },
  { day: 'Tue', present: 11, absent: 0, late: 1 },
  { day: 'Wed', present: 9, absent: 2, late: 1 },
  { day: 'Thu', present: 10, absent: 1, late: 1 },
  { day: 'Fri', present: 11, absent: 1, late: 0 },
]

export function HRDashboardPage() {
  const stats = useMemo(() => {
    const active = mockEmployees.filter((e) => e.status === 'active').length
    const newEmp = mockEmployees.filter((e) => e.status === 'new').length
    const inactive = mockEmployees.filter((e) => e.status === 'inactive').length
    const terminated = mockEmployees.filter((e) => e.status === 'terminated').length
    const expiringContracts = mockContracts.filter((c) => {
      const days = calculateDaysRemaining(c.endDate)
      return days >= 0 && days <= 30
    }).length
    return { active, newEmp, inactive, terminated, expiringContracts }
  }, [])

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">HR & Compliance Dashboard</h1>
          <p className="text-sm text-text-secondary mt-0.5">Employee management and workforce overview.</p>
        </div>
        <div className="text-sm text-text-secondary">
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <StatCard title="Active Employees" value={stats.active} icon={<Users className="h-5 w-5" />} variant="success" />
        <StatCard title="New Employees" value={stats.newEmp} icon={<UserPlus className="h-5 w-5" />} variant="blue" />
        <StatCard title="Inactive" value={stats.inactive} icon={<Users className="h-5 w-5" />} variant="default" />
        <StatCard title="Terminated" value={stats.terminated} icon={<Users className="h-5 w-5" />} variant="default" />
        <StatCard title="Expiring Contracts" value={stats.expiringContracts} icon={<FileText className="h-5 w-5" />} variant="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Attendance This Week</CardTitle>
            <Link to="/attendance" className="text-sm text-jic-blue hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e5eb" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#8b95a5" />
                <YAxis tick={{ fontSize: 12 }} stroke="#8b95a5" />
                <Tooltip />
                <Area type="monotone" dataKey="present" stackId="1" stroke="#0f7b3f" fill="#0f7b3f" fillOpacity={0.1} />
                <Area type="monotone" dataKey="late" stackId="1" stroke="#f19325" fill="#f19325" fillOpacity={0.1} />
                <Area type="monotone" dataKey="absent" stackId="1" stroke="#dc2626" fill="#dc2626" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardTitle>Contracts Expiring Soon</CardTitle>
          <div className="mt-4 space-y-2">
            {mockContracts.filter((c) => {
              const days = calculateDaysRemaining(c.endDate)
              return days >= 0 && days <= 60
            }).length === 0 ? (
              <p className="text-sm text-text-secondary py-4 text-center">No contracts expiring soon.</p>
            ) : (
              mockContracts.filter((c) => {
                const days = calculateDaysRemaining(c.endDate)
                return days >= 0 && days <= 60
              }).map((contract) => {
                const days = calculateDaysRemaining(contract.endDate)
                return (
                  <Link
                    key={contract.id}
                    to={`/contracts/${contract.id}`}
                    className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg hover:bg-surface-tertiary transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-text-primary">{contract.entityName}</p>
                      <p className="text-xs text-text-tertiary">{contract.contractNumber}</p>
                    </div>
                    <span className={cn('text-xs font-medium', days <= 14 ? 'text-danger' : 'text-warning')}>
                      {days}d left
                    </span>
                  </Link>
                )
              })
            )}
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <CardTitle>Recent Employee Activity</CardTitle>
          <Link to="/employees" className="text-sm text-jic-blue hover:underline flex items-center gap-1">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 text-text-secondary font-medium">Employee</th>
                <th className="text-left py-2 text-text-secondary font-medium">Position</th>
                <th className="text-left py-2 text-text-secondary font-medium">Site</th>
                <th className="text-left py-2 text-text-secondary font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockEmployees.slice(0, 6).map((emp) => (
                <tr key={emp.id} className="border-b border-border-light">
                  <td className="py-2.5 font-medium text-text-primary">{emp.firstName} {emp.lastName}</td>
                  <td className="py-2.5 text-text-secondary">{emp.position}</td>
                  <td className="py-2.5 text-text-secondary">{emp.siteName || '-'}</td>
                  <td className="py-2.5"><StatusBadge status={emp.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
