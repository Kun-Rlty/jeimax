import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, AlertTriangle, Edit } from 'lucide-react'
import { PageHeader, Button, Card, CardTitle, StatusBadge } from '@/components/ui'
import { mockContracts } from '@/data/mock'
import { formatDate, calculateDaysRemaining, cn } from '@/utils'

export function ViewContractPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const contract = mockContracts.find((c) => c.id === id)

  if (!contract) {
    return (
      <div>
        <PageHeader
          title="Contract Not Found"
          breadcrumbs={[
            { label: 'Contracts', href: '/contracts' },
            { label: 'Not Found' },
          ]}
        />
        <Card>
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-text-tertiary mx-auto mb-3" />
            <p className="text-text-secondary">Contract not found.</p>
            <Button variant="secondary" className="mt-4" onClick={() => navigate('/contracts')}>
              Back to Contracts
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  const daysRemaining = calculateDaysRemaining(contract.endDate)

  return (
    <div>
      <PageHeader
        title={contract.contractNumber}
        description={`${contract.entityType.charAt(0).toUpperCase() + contract.entityType.slice(1)} contract for ${contract.entityName}`}
        breadcrumbs={[
          { label: 'Contracts', href: '/contracts' },
          { label: contract.contractNumber },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="ghost" icon={<ArrowLeft className="h-4 w-4" />} onClick={() => navigate('/contracts')}>
              Back
            </Button>
            {(contract.status === 'expiring' || contract.status === 'expired') && (
              <Button
                icon={<Edit className="h-4 w-4" />}
                onClick={() => navigate(`/contracts/${contract.id}/renew`)}
              >
                Renew
              </Button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardTitle>Contract Information</CardTitle>
          <div className="mt-4 space-y-3">
            <InfoRow label="Contract #" value={contract.contractNumber} />
            <InfoRow label="Type" value={<span className="capitalize">{contract.entityType}</span>} />
            <InfoRow label="Entity" value={contract.entityName} />
            <InfoRow label="Status" value={<StatusBadge status={contract.status} />} />
          </div>
        </Card>

        <Card>
          <CardTitle>Period</CardTitle>
          <div className="mt-4 space-y-3">
            <InfoRow label="Start Date" value={formatDate(contract.startDate)} />
            <InfoRow label="End Date" value={formatDate(contract.endDate)} />
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
          </div>
        </Card>

        <Card>
          <CardTitle>Value</CardTitle>
          <div className="mt-4 space-y-3">
            <InfoRow
              label="Contract Value"
              value={contract.value ? `TZS ${contract.value.toLocaleString()}` : '-'}
            />
            <InfoRow label="Created" value={formatDate(contract.createdAt)} />
          </div>
        </Card>
      </div>

      {contract.terms && (
        <Card className="mt-4">
          <CardTitle>Terms & Conditions</CardTitle>
          <div className="mt-4">
            <p className="text-sm text-text-secondary whitespace-pre-wrap">{contract.terms}</p>
          </div>
        </Card>
      )}
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
