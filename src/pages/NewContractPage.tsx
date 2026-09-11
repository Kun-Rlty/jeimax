import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PageHeader, Button, Input, Select, Card, CardTitle } from '@/components/ui'
import { mockClients, mockSites, mockEmployees } from '@/data/mock'

const schema = z.object({
  entityType: z.enum(['employee', 'client', 'site'], { required_error: 'Entity type is required' }),
  entityId: z.string().min(1, 'Entity is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  value: z.coerce.number().optional(),
  terms: z.string().optional(),
})

type FormData = z.infer<typeof schema>

const entityTypeOptions = [
  { value: 'employee', label: 'Employee' },
  { value: 'client', label: 'Client' },
  { value: 'site', label: 'Site' },
]

export function NewContractPage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const entityType = watch('entityType')

  const getEntityOptions = () => {
    switch (entityType) {
      case 'employee':
        return mockEmployees
          .filter((e) => e.status === 'active' || e.status === 'new')
          .map((e) => ({ value: e.id, label: `${e.firstName} ${e.lastName} (${e.employeeId})` }))
      case 'client':
        return mockClients.map((c) => ({ value: c.id, label: `${c.name} (${c.clientId})` }))
      case 'site':
        return mockSites.map((s) => ({ value: s.id, label: `${s.siteName} (${s.clientName})` }))
      default:
        return []
    }
  }

  const entityOptions = getEntityOptions()

  const onSubmit = async (data: FormData) => {
    await new Promise((r) => setTimeout(r, 500))
    console.log('Contract data:', data)
    navigate('/contracts')
  }

  return (
    <div>
      <PageHeader
        title="New Contract"
        description="Create a new contract for an employee, client, or site."
        breadcrumbs={[
          { label: 'Contracts', href: '/contracts' },
          { label: 'New Contract' },
        ]}
        actions={
          <Button variant="ghost" icon={<ArrowLeft className="h-4 w-4" />} onClick={() => navigate('/contracts')}>
            Back
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardTitle>Contract Details</CardTitle>
            <div className="mt-4 space-y-4">
              <Select
                label="Contract Type"
                required
                options={entityTypeOptions}
                placeholder="Select type"
                {...register('entityType')}
                error={errors.entityType?.message}
              />
              <Select
                label="Entity"
                required
                options={entityOptions.length > 0 ? entityOptions : [{ value: '', label: 'Select type first' }]}
                placeholder="Select entity"
                {...register('entityId')}
                error={errors.entityId?.message}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Start Date" type="date" required {...register('startDate')} error={errors.startDate?.message} />
                <Input label="End Date" type="date" required {...register('endDate')} error={errors.endDate?.message} />
              </div>
              <Input label="Contract Value (TZS)" type="number" {...register('value')} />
            </div>
          </Card>

          <Card>
            <CardTitle>Terms & Conditions</CardTitle>
            <div className="mt-4 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text-primary">Terms</label>
                <textarea
                  {...register('terms')}
                  rows={8}
                  placeholder="Enter contract terms and conditions..."
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-jic-blue/20 focus:border-jic-blue"
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button type="button" variant="secondary" onClick={() => navigate('/contracts')}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Create Contract
          </Button>
        </div>
      </form>
    </div>
  )
}
