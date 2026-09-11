import { useMemo } from 'react'
import {
  Users,
  MapPin,
  Building2,
  Shield,
  Clock,
  FileText,
  Plus,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { StatCard, PageHeader, Card, CardTitle, StatusBadge, Badge } from '@/components/ui'
import { mockEmployees, mockSites, mockClients, mockAlerts, mockAttendance, mockPayroll } from '@/data/mock'
import { formatCurrency } from '@/utils'

const attendanceTrend = [
  { day: 'Mon', present: 10, absent: 1, late: 1 },
  { day: 'Tue', present: 11, absent: 0, late: 1 },
  { day: 'Wed', present: 9, absent: 2, late: 1 },
  { day: 'Thu', present: 10, absent: 1, late: 1 },
  { day: 'Fri', present: 11, absent: 1, late: 0 },
  { day: 'Sat', present: 8, absent: 2, late: 2 },
  { day: 'Sun', present: 7, absent: 3, late: 2 },
]

const siteDistribution = [
  { name: 'Malindo', value: 4 },
  { name: 'TCC', value: 3 },
  { name: 'Slipway', value: 2 },
  { name: 'Stadium', value: 5 },
  { name: 'TPA', value: 4 },
]

const COLORS = ['#1f3a8f', '#f19325', '#0f7b3f', '#dc2626', '#8b95a5']

export function DashboardPage() {
  const stats = useMemo(() => {
    const activeEmployees = mockEmployees.filter((e) => e.status === 'active').length
    const newEmployees = mockEmployees.filter((e) => e.status === 'new').length
    const activeSites = mockSites.filter((s) => s.status === 'active').length
    const activeClients = mockClients.filter((c) => c.status === 'active').length
    const totalGuardsDeployed = mockSites.reduce((sum, s) => sum + s.assignedGuards, 0)
    const pendingPayroll = mockPayroll.filter((p) => p.status === 'pending').length
    return { activeEmployees, newEmployees, activeSites, activeClients, totalGuardsDeployed, pendingPayroll }
  }, [])

  const quickActions = [
    { label: 'Add Employee', href: '/employees/new', icon: <Plus className="h-4 w-4" /> },
    { label: 'Add Client', href: '/clients/new', icon: <Plus className="h-4 w-4" /> },
    { label: 'Add Site', href: '/sites/new', icon: <Plus className="h-4 w-4" /> },
    { label: 'Assign Guard', href: '/operations', icon: <Shield className="h-4 w-4" /> },
    { label: 'Record Attendance', href: '/attendance', icon: <Clock className="h-4 w-4" /> },
    { label: 'Process Payroll', href: '/payroll', icon: <FileText className="h-4 w-4" /> },
  ]

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Dashboard</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Welcome back. Here is your organization overview.
          </p>
        </div>
        <div className="text-sm text-text-secondary">
          {new Date().toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </div>
      </div>

      {mockAlerts.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <span className="text-sm font-medium text-text-primary">Active Alerts</span>
            <Badge variant="warning" size="sm">{mockAlerts.length}</Badge>
          </div>
          <div className="space-y-2">
            {mockAlerts.slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border"
              >
                <div className="flex items-center gap-3">
                  <StatusBadge status={alert.severity === 'high' ? 'danger' : alert.severity === 'medium' ? 'warning' : 'info'} />
                  <div>
                    <p className="text-sm font-medium text-text-primary">{alert.siteName}</p>
                    <p className="text-xs text-text-secondary">{alert.message}</p>
                  </div>
                </div>
                <Link
                  to={`/sites/${alert.siteId}`}
                  className="text-xs text-jic-blue hover:underline shrink-0"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            to={action.href}
            className="flex items-center gap-2 p-3 bg-surface rounded-lg border border-border hover:border-jic-blue/30 hover:bg-jic-blue/5 transition-colors text-sm font-medium text-text-primary"
          >
            <span className="text-jic-blue">{action.icon}</span>
            {action.label}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <StatCard title="Active Employees" value={stats.activeEmployees} icon={<Users className="h-5 w-5" />} variant="blue" />
        <StatCard title="New Employees" value={stats.newEmployees} icon={<Users className="h-5 w-5" />} variant="orange" />
        <StatCard title="Active Sites" value={stats.activeSites} icon={<MapPin className="h-5 w-5" />} variant="success" />
        <StatCard title="Active Clients" value={stats.activeClients} icon={<Building2 className="h-5 w-5" />} variant="blue" />
        <StatCard title="Guards Deployed" value={stats.totalGuardsDeployed} icon={<Shield className="h-5 w-5" />} variant="orange" />
        <StatCard title="Pending Payroll" value={stats.pendingPayroll} icon={<FileText className="h-5 w-5" />} variant="default" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardTitle>Attendance This Week</CardTitle>
          <div className="mt-4 h-64">
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
          <CardTitle>Site Deployment</CardTitle>
          <div className="mt-4 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={siteDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {siteDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {siteDistribution.map((site, i) => (
              <div key={site.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-text-secondary">{site.name}</span>
                </div>
                <span className="font-medium text-text-primary">{site.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-4">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Recent Attendance</CardTitle>
            <Link to="/attendance" className="text-sm text-jic-blue hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-text-secondary font-medium">Employee</th>
                  <th className="text-left py-2 text-text-secondary font-medium">Site</th>
                  <th className="text-left py-2 text-text-secondary font-medium">Date</th>
                  <th className="text-left py-2 text-text-secondary font-medium">Shift</th>
                  <th className="text-left py-2 text-text-secondary font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockAttendance.slice(0, 5).map((record) => (
                  <tr key={record.id} className="border-b border-border-light">
                    <td className="py-2.5 font-medium text-text-primary">{record.employeeName}</td>
                    <td className="py-2.5 text-text-secondary">{record.siteName}</td>
                    <td className="py-2.5 text-text-secondary">{record.date}</td>
                    <td className="py-2.5">
                      <Badge variant={record.shift === 'day' ? 'info' : 'neutral'}>{record.shift === 'day' ? 'Day' : 'Night'}</Badge>
                    </td>
                    <td className="py-2.5">
                      <StatusBadge status={record.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
