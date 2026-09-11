import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Eye, Edit, MapPin } from 'lucide-react'
import { PageHeader, Button, SearchInput, StatusBadge, EmptyState } from '@/components/ui'
import { mockClients } from '@/data/mock'

export function ClientListPage() {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return mockClients.filter((client) => {
      return (
        !search ||
        client.clientId.toLowerCase().includes(search.toLowerCase()) ||
        client.name.toLowerCase().includes(search.toLowerCase())
      )
    })
  }, [search])

  return (
    <div>
      <PageHeader
        title="Clients"
        description="Manage JIC client relationships and contracts."
        actions={
          <Link to="/clients/new">
            <Button icon={<Plus className="h-4 w-4" />}>Add Client</Button>
          </Link>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 max-w-sm">
          <SearchInput placeholder="Search by ID or name..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No clients found"
          description="No clients match your search."
          action={<Button variant="secondary" onClick={() => setSearch('')}>Clear Search</Button>}
        />
      ) : (
        <div className="bg-surface rounded-lg border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-secondary border-b border-border">
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Client ID</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary hidden md:table-cell">Contact</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary hidden lg:table-cell">Phone</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary hidden lg:table-cell">Sites</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary hidden lg:table-cell">Guards</th>
                  <th className="text-right px-4 py-3 font-medium text-text-secondary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((client) => (
                  <tr key={client.id} className="border-b border-border-light hover:bg-surface-secondary/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-text-secondary">{client.clientId}</td>
                    <td className="px-4 py-3 font-medium text-text-primary">{client.name}</td>
                    <td className="px-4 py-3 text-text-secondary hidden md:table-cell">{client.contactPerson}</td>
                    <td className="px-4 py-3 text-text-secondary hidden lg:table-cell font-mono text-xs">{client.phone}</td>
                    <td className="px-4 py-3"><StatusBadge status={client.status} /></td>
                    <td className="px-4 py-3 text-text-secondary hidden lg:table-cell">{client.sites.length}</td>
                    <td className="px-4 py-3 text-text-secondary hidden lg:table-cell">{client.totalGuards}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/clients/${client.id}`} className="p-1.5 rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface-tertiary transition-colors">
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link to={`/clients/${client.id}/edit`} className="p-1.5 rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface-tertiary transition-colors">
                          <Edit className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-border text-sm text-text-secondary">
            Showing {filtered.length} of {mockClients.length} clients
          </div>
        </div>
      )}
    </div>
  )
}
