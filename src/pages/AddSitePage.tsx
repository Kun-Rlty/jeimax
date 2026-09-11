import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PageHeader, Button, Input, Select, Card, CardTitle } from '@/components/ui'
import { mockClients } from '@/data/mock'

const schema = z.object({
  siteName: z.string().min(1, 'Site name is required'),
  clientId: z.string().min(1, 'Client is required'),
  location: z.string().min(1, 'Location is required'),
  requiredGuards: z.coerce.number().min(1, 'At least 1 guard required'),
  malindoSite: z.boolean(),
  contractStart: z.string().optional(),
  contractEnd: z.string().optional(),
})

type FormData = z.infer<typeof schema>

const clientOptions = mockClients
  .filter((c) => c.status === 'active')
  .map((c) => ({ value: c.id, label: c.name }))

export function AddSitePage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { malindoSite: false },
  })

  const malindoSite = watch('malindoSite')

  const onSubmit = async (data: FormData) => {
    await new Promise((r) => setTimeout(r, 500))
    console.log('Site data:', data)
    navigate('/sites')
  }

  return (
    <div>
      <PageHeader
        title="Add Site"
        description="Register a new security site."
        breadcrumbs={[{ label: 'Sites', href: '/sites' }, { label: 'Add Site' }]}
        actions={
          <Button variant="ghost" icon={<ArrowLeft className="h-4 w-4" />} onClick={() => navigate('/sites')}>
            Back
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardTitle>Site Information</CardTitle>
            <div className="mt-4 space-y-4">
              <Input label="Site Name" required {...register('siteName')} error={errors.siteName?.message} />
              <Select
                label="Client"
                required
                options={clientOptions}
                placeholder="Select client"
                {...register('clientId')}
                error={errors.clientId?.message}
              />
              <Input label="Location" required {...register('location')} error={errors.location?.message} />
            </div>
          </Card>

          <Card>
            <CardTitle>Configuration</CardTitle>
            <div className="mt-4 space-y-4">
              <Input
                label="Required Guards"
                type="number"
                required
                {...register('requiredGuards')}
                error={errors.requiredGuards?.message}
              />
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('malindoSite')}
                  className="rounded border-border"
                />
                <span className="text-sm text-text-primary">Malindo Site</span>
              </label>
              {malindoSite && (
                <p className="text-xs text-text-secondary">
                  This site must have at least 1 guard assigned at all times.
                </p>
              )}
              <Input label="Contract Start" type="date" {...register('contractStart')} />
              <Input label="Contract End" type="date" {...register('contractEnd')} />
            </div>
          </Card>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button type="button" variant="secondary" onClick={() => navigate('/sites')}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Add Site
          </Button>
        </div>
      </form>
    </div>
  )
}
