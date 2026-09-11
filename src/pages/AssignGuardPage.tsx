import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, AlertTriangle } from 'lucide-react'
import { PageHeader, Button, Select, Card, CardTitle, Alert } from '@/components/ui'
import { mockSites, mockEmployees } from '@/data/mock'

const schema = z.object({
  siteId: z.string().min(1, 'Site is required'),
  employeeId: z.string().min(1, 'Guard is required'),
  shift: z.enum(['day', 'night'], { required_error: 'Shift is required' }),
  startDate: z.string().min(1, 'Start date is required'),
})

type FormData = z.infer<typeof schema>

export function AssignGuardPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const preselectedSite = searchParams.get('siteId') || ''

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { siteId: preselectedSite },
  })

  const selectedSiteId = watch('siteId')
  const selectedEmployeeId = watch('employeeId')

  const activeSites = mockSites.filter((s) => s.status === 'active' || s.status === 'new')
  const availableGuards = mockEmployees.filter(
    (e) => e.status === 'active' && !e.siteId
  )
  const selectedEmployee = mockEmployees.find((e) => e.id === selectedEmployeeId)
  const selectedSite = mockSites.find((s) => s.id === selectedSiteId)
  const isAlreadyAssigned = selectedEmployee?.siteId && selectedEmployee.siteId !== selectedSiteId

  const siteOptions = activeSites.map((s) => ({
    value: s.id,
    label: `${s.siteName} (${s.assignedGuards}/${s.requiredGuards} guards)`,
  }))

  const guardOptions = availableGuards.map((g) => ({
    value: g.id,
    label: `${g.firstName} ${g.lastName} (${g.employeeId})`,
  }))

  const onSubmit = async (data: FormData) => {
    await new Promise((r) => setTimeout(r, 500))
    console.log('Guard assignment:', data)
    navigate(-1)
  }

  return (
    <div>
      <PageHeader
        title="Assign Guard"
        description="Assign a guard to a security site."
        breadcrumbs={[
          { label: 'Operations', href: '/operations' },
          { label: 'Assign Guard' },
        ]}
        actions={
          <Button variant="ghost" icon={<ArrowLeft className="h-4 w-4" />} onClick={() => navigate(-1)}>
            Back
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardTitle>Assignment Details</CardTitle>
            <div className="mt-4 space-y-4">
              <Select
                label="Site"
                required
                options={siteOptions}
                placeholder="Select site"
                {...register('siteId')}
                error={errors.siteId?.message}
              />
              <Select
                label="Guard"
                required
                options={guardOptions.length > 0 ? guardOptions : [{ value: '', label: 'No available guards' }]}
                placeholder="Select guard"
                {...register('employeeId')}
                error={errors.employeeId?.message}
              />
              <Select
                label="Shift"
                required
                options={[
                  { value: 'day', label: 'Day Shift (6:00 AM - 6:00 PM)' },
                  { value: 'night', label: 'Night Shift (6:00 PM - 6:00 AM)' },
                ]}
                placeholder="Select shift"
                {...register('shift')}
                error={errors.shift?.message}
              />
              <input type="hidden" {...register('startDate')} />
            </div>
          </Card>

          <Card>
            <CardTitle>Preview</CardTitle>
            <div className="mt-4 space-y-4">
              {selectedSite && (
                <div className="p-3 bg-surface-secondary rounded-lg">
                  <p className="text-xs text-text-tertiary">Site</p>
                  <p className="text-sm font-medium text-text-primary">{selectedSite.siteName}</p>
                  <p className="text-xs text-text-secondary">{selectedSite.location}</p>
                  <p className="text-xs text-text-secondary mt-1">
                    Current staffing: {selectedSite.assignedGuards}/{selectedSite.requiredGuards}
                  </p>
                </div>
              )}

              {selectedEmployee && (
                <div className="p-3 bg-surface-secondary rounded-lg">
                  <p className="text-xs text-text-tertiary">Guard</p>
                  <p className="text-sm font-medium text-text-primary">
                    {selectedEmployee.firstName} {selectedEmployee.lastName}
                  </p>
                  <p className="text-xs text-text-secondary">{selectedEmployee.employeeId}</p>
                  <p className="text-xs text-text-secondary">{selectedEmployee.phone}</p>
                  {selectedEmployee.siteId && (
                    <div className="flex items-center gap-1 mt-2">
                      <AlertTriangle className="h-3.5 w-3.5 text-warning" />
                      <span className="text-xs text-warning">
                        Currently assigned to {selectedEmployee.siteName}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {isAlreadyAssigned && (
                <Alert variant="danger" title="Guard Already Assigned">
                  This guard is currently assigned to another site. Reassigning will remove them from their current site.
                </Alert>
              )}

              {!selectedSite && !selectedEmployee && (
                <p className="text-sm text-text-tertiary text-center py-4">
                  Select a site and guard to preview the assignment.
                </p>
              )}
            </div>
          </Card>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting} disabled={!!isAlreadyAssigned}>
            Assign Guard
          </Button>
        </div>
      </form>
    </div>
  )
}
