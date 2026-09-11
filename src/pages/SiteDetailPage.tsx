import { useParams, Link } from 'react-router-dom'
import { AlertTriangle, MapPin, Users, Shield, Clock, Edit, AlertCircle } from 'lucide-react'
import { PageHeader, Button, StatusBadge, Card, CardTitle, Badge, Alert } from '@/components/ui'
import { mockSites, mockEmployees } from '@/data/mock'
import { formatDate, calculateDaysRemaining, cn } from '@/utils'

export function SiteDetailPage() {
  const { id } = useParams<{ id: string }>()
  const site = mockSites.find((s) => s.id === id)

  if (!site) {
    return (
      <div>
        <PageHeader title="Site Not Found" breadcrumbs={[{ label: 'Sites', href: '/sites' }, { label: 'Not Found' }]} />
        <Card>
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-text-tertiary mx-auto mb-3" />
            <p className="text-text-secondary">Site not found.</p>
            <Link to="/sites"><Button variant="secondary" className="mt-4">Back to Sites</Button></Link>
          </div>
        </Card>
      </div>
    )
  }

  const siteEmployees = mockEmployees.filter((e) => e.siteId === site.id)
  const daysRemaining = site.contractEnd ? calculateDaysRemaining(site.contractEnd) : null
  const isUnderstaffed = site.assignedGuards < site.requiredGuards
  const malindoAlert = site.malindoSite && site.assignedGuards < site.minimumGuards

  return (
    <div>
      <PageHeader
        title={site.siteName}
        description={site.location}
        breadcrumbs={[{ label: 'Sites', href: '/sites' }, { label: site.siteName }]}
        actions={
          <div className="flex gap-2">
            <Link to={`/sites/${site.id}/edit`}>
              <Button variant="secondary" icon={<Edit className="h-4 w-4" />}>Edit</Button>
            </Link>
            <Link to={`/sites/${site.id}/assign-guard`}>
              <Button icon={<Users className="h-4 w-4" />}>Assign Guard</Button>
            </Link>
          </div>
        }
      />

      {malindoAlert && (
        <Alert variant="danger" title="Staffing Required" className="mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p>This site must have at least <strong>1 guard</strong> assigned at all times.</p>
              <p className="mt-1">Currently assigned: <strong>{site.assignedGuards}</strong> guards</p>
            </div>
            <Link to={`/sites/${site.id}/assign-guard`}>
              <Button size="sm" icon={<Users className="h-4 w-4" />}>Assign Guard</Button>
            </Link>
          </div>
        </Alert>
      )}

      {isUnderstaffed && !malindoAlert && (
        <Alert variant="warning" title="Understaffed" className="mb-4">
          <p>This site requires <strong>{site.requiredGuards}</strong> guards but only <strong>{site.assignedGuards}</strong> are assigned.</p>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <Card>
          <CardTitle>Site Information</CardTitle>
          <div className="mt-4 space-y-3">
            <InfoRow label="Client" value={site.clientName} />
            <InfoRow label="Location" value={site.location} />
            <InfoRow label="Status" value={<StatusBadge status={site.status} />} />
          </div>
        </Card>

        <Card>
          <CardTitle>Staffing</CardTitle>
          <div className="mt-4 space-y-3">
            <InfoRow label="Required Guards" value={site.requiredGuards} />
            <InfoRow label="Assigned Guards" value={
              <span className={cn('font-medium', isUnderstaffed ? 'text-danger' : 'text-success')}>
                {site.assignedGuards}
              </span>
            } />
            <InfoRow label="Day Shift" value={
              <Badge variant="info" size="md">{site.dayShiftGuards} guards</Badge>
            } />
            <InfoRow label="Night Shift" value={
              <Badge variant="neutral" size="md">{site.nightShiftGuards} guards</Badge>
            } />
          </div>
        </Card>

        <Card>
          <CardTitle>Contract</CardTitle>
          <div className="mt-4 space-y-3">
            <InfoRow label="Start" value={site.contractStart ? formatDate(site.contractStart) : '-'} />
            <InfoRow label="End" value={site.contractEnd ? formatDate(site.contractEnd) : '-'} />
            {daysRemaining !== null && (
              <InfoRow label="Remaining" value={
                <span className={cn(
                  'font-medium',
                  daysRemaining < 0 ? 'text-danger' : daysRemaining <= 30 ? 'text-warning' : 'text-success'
                )}>
                  {daysRemaining < 0 ? `Expired ${Math.abs(daysRemaining)}d ago` : `${daysRemaining} days`}
                </span>
              } />
            )}
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <CardTitle>Assigned Guards ({siteEmployees.length})</CardTitle>
          <Link to={`/sites/${site.id}/assign-guard`}>
            <Button size="sm" icon={<Users className="h-4 w-4" />}>Assign Guard</Button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 text-text-secondary font-medium">ID</th>
                <th className="text-left py-2 text-text-secondary font-medium">Name</th>
                <th className="text-left py-2 text-text-secondary font-medium">Position</th>
                <th className="text-left py-2 text-text-secondary font-medium">Phone</th>
                <th className="text-left py-2 text-text-secondary font-medium">Status</th>
                <th className="text-right py-2 text-text-secondary font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {siteEmployees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-text-secondary">
                    No guards assigned to this site.
                  </td>
                </tr>
              ) : (
                siteEmployees.map((emp) => (
                  <tr key={emp.id} className="border-b border-border-light">
                    <td className="py-2.5 font-mono text-xs">{emp.employeeId}</td>
                    <td className="py-2.5 font-medium">{emp.firstName} {emp.lastName}</td>
                    <td className="py-2.5 text-text-secondary">{emp.position}</td>
                    <td className="py-2.5 text-text-secondary font-mono text-xs">{emp.phone}</td>
                    <td className="py-2.5"><StatusBadge status={emp.status} /></td>
                    <td className="py-2.5 text-right">
                      <Link to={`/employees/${emp.id}`} className="text-xs text-jic-blue hover:underline">View</Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
      <span className="text-sm text-text-tertiary w-28 shrink-0">{label}</span>
      <span className="text-sm text-text-primary">{value}</span>
    </div>
  )
}
