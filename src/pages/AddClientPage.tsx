import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PageHeader, Button, Input, Card, CardTitle } from '@/components/ui'

const schema = z.object({
  name: z.string().min(1, 'Client name is required'),
  contactPerson: z.string().min(1, 'Contact person is required'),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email('Invalid email').min(1, 'Email is required'),
  address: z.string().optional(),
  contractStart: z.string().optional(),
  contractEnd: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export function AddClientPage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    await new Promise((r) => setTimeout(r, 500))
    console.log('Client data:', data)
    navigate('/clients')
  }

  return (
    <div>
      <PageHeader
        title="Add Client"
        description="Add a new client to the JIC system."
        breadcrumbs={[{ label: 'Clients', href: '/clients' }, { label: 'Add Client' }]}
        actions={
          <Button variant="ghost" icon={<ArrowLeft className="h-4 w-4" />} onClick={() => navigate('/clients')}>
            Back
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardTitle>Client Information</CardTitle>
            <div className="mt-4 space-y-4">
              <Input label="Client Name" required {...register('name')} error={errors.name?.message} />
              <Input label="Contact Person" required {...register('contactPerson')} error={errors.contactPerson?.message} />
              <Input label="Phone" required {...register('phone')} error={errors.phone?.message} />
              <Input label="Email" type="email" required {...register('email')} error={errors.email?.message} />
              <Input label="Address" {...register('address')} />
            </div>
          </Card>

          <Card>
            <CardTitle>Contract Information</CardTitle>
            <div className="mt-4 space-y-4">
              <Input label="Contract Start" type="date" {...register('contractStart')} />
              <Input label="Contract End" type="date" {...register('contractEnd')} />
            </div>
          </Card>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button type="button" variant="secondary" onClick={() => navigate('/clients')}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Add Client
          </Button>
        </div>
      </form>
    </div>
  )
}
