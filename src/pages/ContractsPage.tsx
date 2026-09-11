import { useState, useMemo } from 'react'
import { FileText, Plus, AlertTriangle } from 'lucide-react'
import { PageHeader, Button, Tabs, StatusBadge, Badge, Card, SearchInput } from '@/components/ui'
import { mockContracts } from '@/data/mock'
import { formatDate, calculateDaysRemaining, cn } from '@/utils'

export function ContractsPage() {
  const [activeTab, setActiveTab] = useState('active')
  const [search, setSearch] = useState('')

  const tabs = useMemo(() => {
    const active = mockContracts.filter((c) => c.status === 'active')
    const expiring = mockContracts.filter((c) => c.status === 'expiring')
    const expired = mockContracts.filter((c) => c.status === 'expired')
    const all = mockContracts
    return [
      { id: 'all', label: 'All Contracts', count: all.length },
      { id: 'active', label: 'Active', count: active.length },
      { id: 'expiring', label: 'Expiring', count: expiring.length },
      { id: 'expired', label: 'Expired', count: expired.length },
    ]
  }, [])

  const filtered = useMemo(() => {
    let result = mockContracts
    if (activeTab !== 'all') {
      result = result.filter((c) => c.status === activeTab)
    }
    if (search) {
      result = result.filter(
        (c) =>
          c.contractNumber.toLowerCase().includes(search.toLowerCase()) ||
          c.entityName.toLowerCase().includes(search.toLowerCase())
      )
    }
    return result
  }, [activeTab, search])

  return (
    <div>
      <PageHeader
        title="Contracts"
        description="Manage contracts for employees, clients, and sites."
        actions={
          <Button icon={<Plus className="h-4 w-4" />}>New Contract</Button>
        }
      />

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-4" />

      <div className="flex gap-3 mb-4">
        <div className="flex-1 max-w-sm">
          <SearchInput placeholder="Search contracts..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="bg-surface rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-secondary border-b border-border">
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Contract #</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Entity</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary hidden md:table-cell">Type</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary hidden lg:table-cell">Start</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary hidden lg:table-cell">End</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Status</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary hidden lg:table-cell">Value</th>
                <th className="text-right px-4 py-3 font-medium text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((contract) => {
                const days = calculateDaysRemaining(contract.endDate)
                return (
                  <tr key={contract.id} className="border-b border-border-light hover:bg-surface-secondary/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-medium text-text-primary">{contract.contractNumber}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-text-primary">{contract.entityName}</p>
                    </td>
                    <td className="px-4 py-3 text-text-secondary capitalize hidden md:table-cell">{contract.entityType}</td>
                    <td className="px-4 py-3 text-text-secondary hidden lg:table-cell">{formatDate(contract.startDate)}</td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div>
                        <span className="text-text-secondary">{formatDate(contract.endDate)}</span>
                        <p className={cn('text-xs mt-0.5',
                          days < 0 ? 'text-danger' : days <= 30 ? 'text-warning' : 'text-text-tertiary'
                        )}>
                          {days < 0 ? `Expired ${Math.abs(days)}d ago` : `${days}d remaining`}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={contract.status} /></td>
                    <td className="px-4 py-3 text-text-secondary hidden lg:table-cell font-mono text-xs">
                      {contract.value ? `TZS ${(contract.value / 1000000).toFixed(0)}M` : '-'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {contract.status === 'expiring' && (
                          <Button size="sm" variant="secondary">Renew</Button>
                        )}
                        {contract.status === 'expired' && (
                          <Button size="sm">Renew</Button>
                        )}
                        <Button size="sm" variant="ghost">View</Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-border text-sm text-text-secondary">
          Showing {filtered.length} contracts
        </div>
      </div>
    </div>
  )
}
