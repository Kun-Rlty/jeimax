import { useState, useMemo } from 'react'
import { Shield, Users, MapPin, AlertTriangle } from 'lucide-react'
import { PageHeader, Card, CardTitle, StatusBadge, Badge, Button, Select } from '@/components/ui'
import { mockSites, mockEmployees } from '@/data/mock'
import { cn } from '@/utils'

const shiftOptions = [
  { value: '', label: 'All Shifts' },
  { value: 'day', label: 'Day Shift (6AM - 6PM)' },
  { value: 'night', label: 'Night Shift (6PM - 6AM)' },
]

export function OperationsPage() {
  const [shiftFilter, setShiftFilter] = useState('')

  const activeSites = useMemo(() => mockSites.filter((s) => s.status === 'active' || s.status === 'new'), [])

  const deploymentData = useMemo(() => {
    return activeSites.map((site) => {
      const guards = mockEmployees.filter((e) => e.siteId === site.id && e.status === 'active')
      return { ...site, guards }
    })
  }, [])

  const understaffedSites = deploymentData.filter((d) => d.assignedGuards < d.requiredGuards)
  const malindoSite = deploymentData.find((d) => d.malindoSite)

  return (
    <div>
      <PageHeader
        title="Operations"
        description="Guard deployment, site assignments, and field operations."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Card padding>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-info-bg text-jic-blue"><Shield className="h-5 w-5" /></div>
            <div>
              <p className="text-xs text-text-secondary">Total Deployed</p>
              <p className="text-lg font-bold text-text-primary">{mockEmployees.filter((e) => e.siteId && e.status === 'active').length}</p>
            </div>
          </div>
        </Card>
        <Card padding>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success-bg text-success"><MapPin className="h-5 w-5" /></div>
            <div>
              <p className="text-xs text-text-secondary">Active Sites</p>
              <p className="text-lg font-bold text-text-primary">{activeSites.length}</p>
            </div>
          </div>
        </Card>
        <Card padding>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning-bg text-warning"><AlertTriangle className="h-5 w-5" /></div>
            <div>
              <p className="text-xs text-text-secondary">Understaffed</p>
              <p className="text-lg font-bold text-text-primary">{understaffedSites.length}</p>
            </div>
          </div>
        </Card>
        <Card padding>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-50 text-jic-orange"><Users className="h-5 w-5" /></div>
            <div>
              <p className="text-xs text-text-secondary">Available Guards</p>
              <p className="text-lg font-bold text-text-primary">{mockEmployees.filter((e) => !e.siteId && e.status === 'active').length}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <Select options={shiftOptions} value={shiftFilter} onChange={(e) => setShiftFilter(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {deploymentData.map((site) => (
          <Card key={site.id}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-text-primary">{site.siteName}</h3>
                <p className="text-xs text-text-secondary">{site.clientName} &middot; {site.location}</p>
              </div>
              <StatusBadge status={site.status} />
            </div>

            <div className="flex items-center gap-4 mb-3 text-sm">
              <span className="text-text-secondary">
                Guards: <span className={cn('font-medium', site.assignedGuards < site.requiredGuards ? 'text-danger' : 'text-success')}>
                  {site.assignedGuards}
                </span>/{site.requiredGuards}
              </span>
              <Badge variant="info" size="sm">Day: {site.dayShiftGuards}</Badge>
              <Badge variant="neutral" size="sm">Night: {site.nightShiftGuards}</Badge>
            </div>

            {site.malindoSite && site.assignedGuards < site.minimumGuards && (
              <div className="flex items-center gap-2 p-2 bg-danger-bg rounded-md mb-3">
                <AlertTriangle className="h-3.5 w-3.5 text-danger shrink-0" />
                <span className="text-xs text-danger font-medium">Malindo requires minimum 1 guard</span>
              </div>
            )}

            <div className="space-y-1.5">
              {site.guards.length === 0 ? (
                <p className="text-xs text-text-tertiary italic">No guards assigned</p>
              ) : (
                site.guards.map((guard) => (
                  <div key={guard.id} className="flex items-center justify-between p-2 bg-surface-secondary rounded text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-jic-blue/10 flex items-center justify-center">
                        <span className="text-[10px] font-semibold text-jic-blue">{guard.firstName.charAt(0)}{guard.lastName.charAt(0)}</span>
                      </div>
                      <span className="font-medium text-text-primary">{guard.firstName} {guard.lastName}</span>
                    </div>
                    <span className="text-xs text-text-tertiary font-mono">{guard.phone}</span>
                  </div>
                ))
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-border-light">
              <Button size="sm" variant="secondary" className="w-full" icon={<Users className="h-4 w-4" />}>
                Assign Guard
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
