import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Shield, MapPin, Clock, AlertTriangle, Users, ArrowRight } from 'lucide-react'
import { StatCard, Card, CardTitle, StatusBadge, Badge, Alert } from '@/components/ui'
import { mockSites, mockEmployees, mockAttendance, mockAlerts } from '@/data/mock'
import { cn } from '@/utils'

export function OperationsDashboardPage() {
  const stats = useMemo(() => {
    const deployed = mockEmployees.filter((e) => e.siteId && e.status === 'active').length
    const activeSites = mockSites.filter((s) => s.status === 'active').length
    const understaffed = mockSites.filter((s) => s.status === 'active' && s.assignedGuards < s.requiredGuards).length
    const available = mockEmployees.filter((e) => !e.siteId && e.status === 'active').length
    return { deployed, activeSites, understaffed, available }
  }, [])

  const todayAttendance = mockAttendance.filter((a) => a.date === '2025-09-10')
  const present = todayAttendance.filter((a) => a.status === 'present').length
  const absent = todayAttendance.filter((a) => a.status === 'absent').length
  const late = todayAttendance.filter((a) => a.status === 'late').length

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Operations Dashboard</h1>
          <p className="text-sm text-text-secondary mt-0.5">Guard deployment, site status, and field operations.</p>
        </div>
        <div className="text-sm text-text-secondary">
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard title="Guards Deployed" value={stats.deployed} icon={<Shield className="h-5 w-5" />} variant="blue" />
        <StatCard title="Active Sites" value={stats.activeSites} icon={<MapPin className="h-5 w-5" />} variant="success" />
        <StatCard title="Understaffed" value={stats.understaffed} icon={<AlertTriangle className="h-5 w-5" />} variant="orange" />
        <StatCard title="Available Guards" value={stats.available} icon={<Users className="h-5 w-5" />} variant="default" />
      </div>

      {mockAlerts.length > 0 && (
        <div className="mb-4">
          <Alert variant="warning" title={`${mockAlerts.length} Active Alert(s)`}>
            <div className="space-y-1 mt-1">
              {mockAlerts.slice(0, 2).map((a) => (
                <p key={a.id} className="text-xs">{a.siteName}: {a.message}</p>
              ))}
            </div>
          </Alert>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <Card>
          <CardTitle>Today's Attendance</CardTitle>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm"><span className="w-2.5 h-2.5 rounded-full bg-success" /> Present</span>
              <span className="text-sm font-medium">{present}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm"><span className="w-2.5 h-2.5 rounded-full bg-danger" /> Absent</span>
              <span className="text-sm font-medium">{absent}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm"><span className="w-2.5 h-2.5 rounded-full bg-warning" /> Late</span>
              <span className="text-sm font-medium">{late}</span>
            </div>
          </div>
          <Link to="/attendance" className="mt-4 block text-sm text-jic-blue hover:underline flex items-center gap-1">
            Record Attendance <ArrowRight className="h-3 w-3" />
          </Link>
        </Card>

        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Site Deployment</CardTitle>
            <Link to="/operations" className="text-sm text-jic-blue hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {mockSites.filter((s) => s.status === 'active').map((site) => (
              <Link
                key={site.id}
                to={`/sites/${site.id}`}
                className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg hover:bg-surface-tertiary transition-colors"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-text-tertiary" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">{site.siteName}</p>
                    <p className="text-xs text-text-secondary">{site.clientName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn('text-xs font-medium', site.assignedGuards < site.requiredGuards ? 'text-danger' : 'text-success')}>
                    {site.assignedGuards}/{site.requiredGuards}
                  </span>
                  <Badge variant={site.assignedGuards < site.requiredGuards ? 'warning' : 'success'} size="sm">
                    {site.assignedGuards < site.requiredGuards ? 'Under' : 'OK'}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>

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
                <th className="text-left py-2 text-text-secondary font-medium">Shift</th>
                <th className="text-left py-2 text-text-secondary font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {todayAttendance.slice(0, 5).map((record) => (
                <tr key={record.id} className="border-b border-border-light">
                  <td className="py-2.5 font-medium text-text-primary">{record.employeeName}</td>
                  <td className="py-2.5 text-text-secondary">{record.siteName}</td>
                  <td className="py-2.5"><Badge variant={record.shift === 'day' ? 'info' : 'neutral'}>{record.shift}</Badge></td>
                  <td className="py-2.5"><StatusBadge status={record.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
