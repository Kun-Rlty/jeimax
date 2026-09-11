import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, AlertTriangle } from 'lucide-react'
import { PageHeader, Button, Input, Card, CardTitle, Alert } from '@/components/ui'
import { mockContracts } from '@/data/mock'
import { formatDate, calculateDaysRemaining, cn } from '@/utils'

const schema = z.object({
  newStartDate: z.string().min(1, 'Start date is required'),
  newEndDate: z.string().min(1, 'End date is required'),
  value: z.coerce.number().optional(),
  terms: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export function RenewContractPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const contract = mockContracts.find((c) => c.id === id)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

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

  const onSubmit = async (data: FormData) => {
    await new Promise((r) => setTimeout(r, 500))
    console.log('Contract renewal:', { originalContract: contract.id, ...data })
    navigate('/contracts')
  }

  return (
    <div>
      <PageHeader
        title="Renew Contract"
        description="Create a new contract period. The existing contract will be preserved."
        breadcrumbs={[
          { label: 'Contracts', href: '/contracts' },
          { label: 'Renew' },
        ]}
        actions={
          <Button variant="ghost" icon={<ArrowLeft className="h-4 w-4" />} onClick={() => navigate('/contracts')}>
            Back
          </Button>
        }
      />

      <Alert variant="info" title="Contract Renewal" className="mb-4">
        This will create a new contract period for <strong>{contract.entityName}</strong>. The current contract ({contract.contractNumber}) will remain in history.
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardTitle>Current Contract</CardTitle>
          <div className="mt-4 space-y-3">
            <InfoRow label="Contract #" value={contract.contractNumber} />
            <InfoRow label="Entity" value={contract.entityName} />
            <InfoRow label="Type" value={<span className="capitalize">{contract.entityType}</span>} />
            <InfoRow label="Start" value={formatDate(contract.startDate)} />
            <InfoRow label="End" value={formatDate(contract.endDate)} />
            <InfoRow
              label="Status"
              value={
                <span className={cn(
                  'font-medium',
                  daysRemaining < 0 ? 'text-danger' : daysRemaining <= 30 ? 'text-warning' : 'text-success'
                )}>
                  {daysRemaining < 0 ? `Expired ${Math.abs(daysRemaining)}d ago` : `${daysRemaining}d remaining`}
                </span>
              }
            />
            {contract.value && (
              <InfoRow label="Value" value={`TZS ${contract.value.toLocaleString()}`} />
            )}
          </div>
        </Card>

        <Card>
          <CardTitle>New Contract Period</CardTitle>
          <form id="renewForm" onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="New Start Date" type="date" required {...register('newStartDate')} error={errors.newStartDate?.message} />
                <Input label="New End Date" type="date" required {...register('newEndDate')} error={errors.newEndDate?.message} />
              </div>
              <Input label="Contract Value (TZS)" type="number" {...register('value')} />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text-primary">Terms</label>
                <textarea
                  {...register('terms')}
                  rows={5}
                  placeholder="Enter new contract terms..."
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-jic-blue/20 focus:border-jic-blue"
                />
              </div>
            </div>
          </form>
        </Card>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button type="button" variant="secondary" onClick={() => navigate('/contracts')}>
          Cancel
        </Button>
        <Button type="submit" form="renewForm" loading={isSubmitting}>
          Renew Contract
        </Button>
      </div>
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
