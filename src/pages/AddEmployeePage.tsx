import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PageHeader, Button, Input, Select, Card, CardTitle } from '@/components/ui'
import { mockSites } from '@/data/mock'

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  position: z.string().min(1, 'Position is required'),
  nationalId: z.string().optional(),
  address: z.string().optional(),
  siteId: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
})

type FormData = z.infer<typeof schema>

const positionOptions = [
  { value: 'Security Guard', label: 'Security Guard' },
  { value: 'Supervisor', label: 'Supervisor' },
  { value: 'Operations Manager', label: 'Operations Manager' },
  { value: 'HR Officer', label: 'HR Officer' },
  { value: 'Accountant', label: 'Accountant' },
]

const siteOptions = [
  { value: '', label: 'No site assignment' },
  ...mockSites.filter((s) => s.status === 'active').map((s) => ({ value: s.id, label: s.siteName })),
]

export function AddEmployeePage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    // Mock save
    await new Promise((r) => setTimeout(r, 500))
    console.log('Employee data:', data)
    navigate('/employees')
  }

  return (
    <div>
      <PageHeader
        title="Add Employee"
        description="Add a new employee to the JIC workforce."
        breadcrumbs={[{ label: 'Employees', href: '/employees' }, { label: 'Add Employee' }]}
        actions={
          <Button variant="ghost" icon={<ArrowLeft className="h-4 w-4" />} onClick={() => navigate('/employees')}>
            Back
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardTitle>Personal Information</CardTitle>
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="First Name" required {...register('firstName')} error={errors.firstName?.message} />
                <Input label="Last Name" required {...register('lastName')} error={errors.lastName?.message} />
              </div>
              <Input label="Phone" required {...register('phone')} error={errors.phone?.message} />
              <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
              <Input label="National ID" {...register('nationalId')} />
              <Input label="Address" {...register('address')} />
            </div>
          </Card>

          <Card>
            <CardTitle>Employment Information</CardTitle>
            <div className="mt-4 space-y-4">
              <Select
                label="Position"
                required
                options={positionOptions}
                placeholder="Select position"
                {...register('position')}
                error={errors.position?.message}
              />
              <Select
                label="Site Assignment"
                options={siteOptions}
                {...register('siteId')}
              />
            </div>
          </Card>

          <Card>
            <CardTitle>Emergency Contact</CardTitle>
            <div className="mt-4 space-y-4">
              <Input label="Emergency Contact Name" {...register('emergencyContact')} />
              <Input label="Emergency Contact Phone" {...register('emergencyPhone')} />
            </div>
          </Card>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button type="button" variant="secondary" onClick={() => navigate('/employees')}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Add Employee
          </Button>
        </div>
      </form>
    </div>
  )
}
