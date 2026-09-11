import { useState } from 'react'
import { Settings as SettingsIcon, Users, Shield, User, Save } from 'lucide-react'
import { PageHeader, Button, Tabs, Card, CardTitle, Input, Select } from '@/components/ui'

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'users', label: 'User Management' },
    { id: 'roles', label: 'Roles & Permissions' },
    { id: 'system', label: 'System Settings' },
  ]

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage system settings, users, and permissions."
      />

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-4" />

      {activeTab === 'profile' && (
        <Card className="max-w-2xl">
          <CardTitle>Profile Settings</CardTitle>
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="First Name" defaultValue="Admin" />
              <Input label="Last Name" defaultValue="User" />
            </div>
            <Input label="Email" type="email" defaultValue="admin@jeimax.co.tz" />
            <Input label="Phone" defaultValue="+255 754 000 000" />
            <div className="pt-2">
              <Button icon={<Save className="h-4 w-4" />}>Save Changes</Button>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'users' && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <CardTitle>User Management</CardTitle>
            <Button size="sm" icon={<Users className="h-4 w-4" />}>Add User</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-text-secondary font-medium">Name</th>
                  <th className="text-left py-2 text-text-secondary font-medium">Email</th>
                  <th className="text-left py-2 text-text-secondary font-medium">Role</th>
                  <th className="text-left py-2 text-text-secondary font-medium">Status</th>
                  <th className="text-right py-2 text-text-secondary font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border-light">
                  <td className="py-2.5 font-medium">Admin User</td>
                  <td className="py-2.5 text-text-secondary">admin@jeimax.co.tz</td>
                  <td className="py-2.5"><span className="px-2 py-0.5 rounded-full bg-jic-blue/10 text-jic-blue text-xs font-medium">IT & System Chief</span></td>
                  <td className="py-2.5"><span className="px-2 py-0.5 rounded-full bg-success-bg text-success text-xs font-medium">Active</span></td>
                  <td className="py-2.5 text-right"><Button size="sm" variant="ghost">Edit</Button></td>
                </tr>
                <tr className="border-b border-border-light">
                  <td className="py-2.5 font-medium">Lilian Mrosso</td>
                  <td className="py-2.5 text-text-secondary">lilian@jeimax.co.tz</td>
                  <td className="py-2.5"><span className="px-2 py-0.5 rounded-full bg-jic-orange/10 text-jic-orange text-xs font-medium">Operations & Field</span></td>
                  <td className="py-2.5"><span className="px-2 py-0.5 rounded-full bg-success-bg text-success text-xs font-medium">Active</span></td>
                  <td className="py-2.5 text-right"><Button size="sm" variant="ghost">Edit</Button></td>
                </tr>
                <tr className="border-b border-border-light">
                  <td className="py-2.5 font-medium">Irene Mkamba</td>
                  <td className="py-2.5 text-text-secondary">irene@jeimax.co.tz</td>
                  <td className="py-2.5"><span className="px-2 py-0.5 rounded-full bg-success-bg text-success text-xs font-medium">Accountant</span></td>
                  <td className="py-2.5"><span className="px-2 py-0.5 rounded-full bg-success-bg text-success text-xs font-medium">Active</span></td>
                  <td className="py-2.5 text-right"><Button size="sm" variant="ghost">Edit</Button></td>
                </tr>
                <tr className="border-b border-border-light">
                  <td className="py-2.5 font-medium">Fatima Juma</td>
                  <td className="py-2.5 text-text-secondary">fatima@jeimax.co.tz</td>
                  <td className="py-2.5"><span className="px-2 py-0.5 rounded-full bg-info-bg text-info text-xs font-medium">HR & Compliance</span></td>
                  <td className="py-2.5"><span className="px-2 py-0.5 rounded-full bg-success-bg text-success text-xs font-medium">Active</span></td>
                  <td className="py-2.5 text-right"><Button size="sm" variant="ghost">Edit</Button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { role: 'IT & System Chief', desc: 'Full system access', count: 1 },
            { role: 'MD', desc: 'Management oversight', count: 1 },
            { role: 'Accountant', desc: 'Financial operations', count: 1 },
            { role: 'Contract & Tendering', desc: 'Contract management', count: 0 },
            { role: 'Operations & Field', desc: 'Guard deployment & operations', count: 1 },
            { role: 'HR & Compliance', desc: 'Employee management', count: 1 },
          ].map((item) => (
            <Card key={item.role}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-text-primary">{item.role}</h3>
                  <p className="text-sm text-text-secondary mt-1">{item.desc}</p>
                  <p className="text-xs text-text-tertiary mt-2">{item.count} user(s)</p>
                </div>
                <Button size="sm" variant="ghost">Edit</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'system' && (
        <Card className="max-w-2xl">
          <CardTitle>System Settings</CardTitle>
          <div className="mt-4 space-y-4">
            <Input label="Company Name" defaultValue="JEIMAX Investments Company Limited" />
            <Input label="Company Short Name" defaultValue="JIC" />
            <Input label="Default Currency" defaultValue="TZS" />
            <Input label="Overtime Rate (TZS per shift)" type="number" defaultValue="4000" />
            <Select
              label="Timezone"
              options={[{ value: 'Africa/Dar_es_Salaam', label: 'East Africa Time (EAT)' }]}
              defaultValue="Africa/Dar_es_Salaam"
            />
            <div className="pt-2">
              <Button icon={<Save className="h-4 w-4" />}>Save Settings</Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
