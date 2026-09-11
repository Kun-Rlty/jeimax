import { useParams, Link } from 'react-router-dom'
import { AlertTriangle, MapPin, Users, FileText, Edit } from 'lucide-react'
import { PageHeader, Button, StatusBadge, Card, CardTitle, Badge } from '@/components/ui'
import { mockClients, mockSites, mockEmployees } from '@/data/mock'
import { formatDate, calculateDaysRemaining, cn } from '@/utils'

export function ClientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const client = mockClients.find((c) => c.id === id)

  if (!client) {
    return (
      <div>
        <PageHeader title="Client Not Found" breadcrumbs={[{ label: 'Clients', href: '/clients' }, { label: 'Not Found' }]} />
        <Card>
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-text-tertiary mx-auto mb-3" />
            <p className="text-text-secondary">Client not found.</p>
            <Link to="/clients"><Button variant="secondary" className="mt-4">Back to Clients</Button></Link>
          </div>
        </Card>
      </div>
    )
  }

  const clientSites = mockSites.filter((s) => client.sites.includes(s.id))
  const clientEmployees = mockEmployees.filter((e) => clientSites.some((s) => s.id === e.siteId))
  const daysRemaining = client.contractEnd ? calculateDaysRemaining(client.contractEnd) : null

  return (
    <div>
      <PageHeader
        title={client.name}
        description={client.clientId}
        breadcrumbs={[{ label: 'Clients', href: '/clients' }, { label: client.name }]}
        actions={
          <Link to={`/clients/${client.id}/edit`}>
            <Button variant="secondary" icon={<Edit className="h-4 w-4" />}>Edit</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <Card>
          <CardTitle>Client Information</CardTitle>
          <div className="mt-4 space-y-3">
            <InfoRow label="Client ID" value={client.clientId} />
            <InfoRow label="Contact Person" value={client.contactPerson} />
            <InfoRow label="Phone" value={client.phone} />
            <InfoRow label="Email" value={client.email} />
            {client.address && <InfoRow label="Address" value={client.address} />}
            <InfoRow label="Status" value={<StatusBadge status={client.status} />} />
          </div>
        </Card>

        <Card>
          <CardTitle>Contract</CardTitle>
          <div className="mt-4 space-y-3">
            <InfoRow label="Start" value={client.contractStart ? formatDate(client.contractStart) : '-'} />
            <InfoRow label="End" value={client.contractEnd ? formatDate(client.contractEnd) : '-'} />
            {daysRemaining !== null && (
              <InfoRow
                label="Remaining"
                value={
                  <span className={cn(
                    'font-medium',
                    daysRemaining < 0 ? 'text-danger' : daysRemaining <= 30 ? 'text-warning' : 'text-success'
                  )}>
                    {daysRemaining < 0 ? `Expired ${Math.abs(daysRemaining)}d ago` : `${daysRemaining} days`}
                  </span>
                }
              />
            )}
          </div>
          <div className="mt-4">
            <Button variant="secondary" size="sm" icon={<FileText className="h-4 w-4" />}>View Contract</Button>
          </div>
        </Card>

        <Card>
          <CardTitle>Summary</CardTitle>
          <div className="mt-4 space-y-3">
            <InfoRow label="Total Sites" value={clientSites.length} />
            <InfoRow label="Total Guards" value={client.totalGuards} />
          </div>
        </Card>
      </div>

      <Card className="mb-4">
        <CardTitle>Assigned Sites</CardTitle>
        <div className="mt-4 space-y-2">
          {clientSites.length === 0 ? (
            <p className="text-sm text-text-secondary">No sites assigned.</p>
          ) : (
            clientSites.map((site) => (
              <Link
                key={site.id}
                to={`/sites/${site.id}`}
                className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg hover:bg-surface-tertiary transition-colors"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-text-tertiary" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">{site.siteName}</p>
                    <p className="text-xs text-text-secondary">{site.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={site.status} />
                  <span className="text-xs text-text-tertiary">{site.assignedGuards}/{site.requiredGuards} guards</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </Card>

      <Card>
        <CardTitle>Assigned Guards</CardTitle>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 text-text-secondary font-medium">ID</th>
                <th className="text-left py-2 text-text-secondary font-medium">Name</th>
                <th className="text-left py-2 text-text-secondary font-medium">Position</th>
                <th className="text-left py-2 text-text-secondary font-medium">Site</th>
                <th className="text-left py-2 text-text-secondary font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {clientEmployees.map((emp) => (
                <tr key={emp.id} className="border-b border-border-light">
                  <td className="py-2.5 font-mono text-xs">{emp.employeeId}</td>
                  <td className="py-2.5 font-medium">{emp.firstName} {emp.lastName}</td>
                  <td className="py-2.5 text-text-secondary">{emp.position}</td>
                  <td className="py-2.5 text-text-secondary">{emp.siteName}</td>
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

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
      <span className="text-sm text-text-tertiary w-28 shrink-0">{label}</span>
      <span className="text-sm text-text-primary">{value}</span>
    </div>
  )
}
