import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Eye, Edit, AlertTriangle } from 'lucide-react'
import { PageHeader, Button, SearchInput, Select, StatusBadge, Badge, EmptyState } from '@/components/ui'
import { mockSites } from '@/data/mock'

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'new', label: 'New' },
  { value: 'outgoing', label: 'Out-going' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'terminated', label: 'Terminated' },
]

export function SiteListPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filtered = useMemo(() => {
    return mockSites.filter((site) => {
      const matchesSearch =
        !search ||
        site.siteName.toLowerCase().includes(search.toLowerCase()) ||
        site.clientName.toLowerCase().includes(search.toLowerCase()) ||
        site.location.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = !statusFilter || site.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [search, statusFilter])

  return (
    <div>
      <PageHeader
        title="Sites"
        description="Manage security sites, assignments, and operations."
        actions={
          <Link to="/sites/new">
            <Button icon={<Plus className="h-4 w-4" />}>Add Site</Button>
          </Link>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 max-w-sm">
          <SearchInput placeholder="Search by name, client, or location..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select options={statusOptions} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No sites found"
          description="No sites match your current filters."
          action={<Button variant="secondary" onClick={() => { setSearch(''); setStatusFilter('') }}>Clear Filters</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((site) => (
            <Link
              key={site.id}
              to={`/sites/${site.id}`}
              className="bg-surface rounded-lg border border-border p-5 hover:border-jic-blue/30 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-text-primary">{site.siteName}</h3>
                  <p className="text-xs text-text-secondary mt-0.5">{site.clientName}</p>
                </div>
                <StatusBadge status={site.status} />
              </div>

              <p className="text-xs text-text-tertiary mb-3">{site.location}</p>

              {site.malindoSite && site.assignedGuards === 0 && (
                <div className="flex items-center gap-2 p-2 bg-danger-bg rounded-md mb-3">
                  <AlertTriangle className="h-3.5 w-3.5 text-danger shrink-0" />
                  <span className="text-xs text-danger font-medium">Minimum 1 guard required</span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-text-secondary">
                    <span className="font-medium text-text-primary">{site.assignedGuards}</span>/{site.requiredGuards} guards
                  </span>
                  <span className="text-text-secondary">
                    <Badge variant="info" size="sm">{site.dayShiftGuards}D</Badge>
                    <Badge variant="neutral" size="sm" className="ml-1">{site.nightShiftGuards}N</Badge>
                  </span>
                </div>
              </div>

              {site.contractEnd && (
                <div className="mt-3 pt-3 border-t border-border-light text-xs text-text-tertiary">
                  Contract ends: {new Date(site.contractEnd).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
