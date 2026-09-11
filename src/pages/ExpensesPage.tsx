import { useState, useMemo } from 'react'
import { Plus, Briefcase, Receipt } from 'lucide-react'
import { PageHeader, Button, SearchInput, Select, StatusBadge, Badge, Card, EmptyState, Modal, Input } from '@/components/ui'
import { mockExpenses } from '@/data/mock'
import { formatCurrency, formatDate } from '@/utils'

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'paid', label: 'Paid' },
]

const categoryOptions = [
  { value: '', label: 'All Categories' },
  { value: 'Uniform', label: 'Uniform' },
  { value: 'Equipment', label: 'Equipment' },
  { value: 'Transport', label: 'Transport' },
  { value: 'Training', label: 'Training' },
  { value: 'Office Supplies', label: 'Office Supplies' },
]

export function ExpensesPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  const filtered = useMemo(() => {
    return mockExpenses.filter((e) => {
      const matchesSearch =
        !search ||
        e.description.toLowerCase().includes(search.toLowerCase()) ||
        e.category.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = !statusFilter || e.status === statusFilter
      const matchesCategory = !categoryFilter || e.category === categoryFilter
      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [search, statusFilter, categoryFilter])

  const totals = useMemo(() => {
    return filtered.reduce(
      (acc, e) => ({
        total: acc.total + e.amount,
        pending: acc.pending + (e.status === 'pending' ? e.amount : 0),
        approved: acc.approved + (e.status === 'approved' ? e.amount : 0),
      }),
      { total: 0, pending: 0, approved: 0 }
    )
  }, [filtered])

  return (
    <div>
      <PageHeader
        title="Expenses"
        description="Track and manage operational expenses."
        actions={
          <Button icon={<Plus className="h-4 w-4" />} onClick={() => setShowAddModal(true)}>
            Add Expense
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <Card padding>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-info-bg text-jic-blue"><Briefcase className="h-5 w-5" /></div>
            <div>
              <p className="text-xs text-text-secondary">Total</p>
              <p className="text-lg font-bold text-text-primary">{formatCurrency(totals.total)}</p>
            </div>
          </div>
        </Card>
        <Card padding>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning-bg text-warning"><Receipt className="h-5 w-5" /></div>
            <div>
              <p className="text-xs text-text-secondary">Pending</p>
              <p className="text-lg font-bold text-text-primary">{formatCurrency(totals.pending)}</p>
            </div>
          </div>
        </Card>
        <Card padding>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success-bg text-success"><Briefcase className="h-5 w-5" /></div>
            <div>
              <p className="text-xs text-text-secondary">Approved</p>
              <p className="text-lg font-bold text-text-primary">{formatCurrency(totals.approved)}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 max-w-sm">
          <SearchInput placeholder="Search expenses..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select options={statusOptions} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} />
        <Select options={categoryOptions} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No expenses found"
          description="No expenses match your current filters."
          action={<Button variant="secondary" onClick={() => { setSearch(''); setStatusFilter(''); setCategoryFilter('') }}>Clear Filters</Button>}
        />
      ) : (
        <div className="bg-surface rounded-lg border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-secondary border-b border-border">
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Date</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Category</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Description</th>
                  <th className="text-right px-4 py-3 font-medium text-text-secondary">Amount</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary hidden md:table-cell">Payment</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary hidden lg:table-cell">Submitted By</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((expense) => (
                  <tr key={expense.id} className="border-b border-border-light hover:bg-surface-secondary/50 transition-colors">
                    <td className="px-4 py-3 text-text-secondary">{formatDate(expense.date)}</td>
                    <td className="px-4 py-3">
                      <Badge variant="neutral">{expense.category}</Badge>
                    </td>
                    <td className="px-4 py-3 text-text-primary max-w-xs truncate">{expense.description}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs font-medium">{formatCurrency(expense.amount)}</td>
                    <td className="px-4 py-3 text-text-secondary hidden md:table-cell capitalize text-xs">{expense.paymentMethod.replace('_', ' ')}</td>
                    <td className="px-4 py-3 text-text-secondary hidden lg:table-cell">{expense.submittedBy}</td>
                    <td className="px-4 py-3"><StatusBadge status={expense.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-border text-sm text-text-secondary">
            Showing {filtered.length} expenses &middot; Total: {formatCurrency(totals.total)}
          </div>
        </div>
      )}

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Expense" size="md">
        <div className="space-y-4">
          <Input label="Date" type="date" required />
          <Select
            label="Category"
            required
            options={categoryOptions.filter((o) => o.value !== '')}
            placeholder="Select category"
          />
          <Input label="Description" required placeholder="Enter expense description" />
          <Input label="Amount (TZS)" type="number" required placeholder="0" />
          <Select
            label="Payment Method"
            required
            options={[
              { value: 'bank_transfer', label: 'Bank Transfer' },
              { value: 'cash', label: 'Cash' },
              { value: 'mobile_money', label: 'Mobile Money' },
            ]}
            placeholder="Select method"
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button onClick={() => setShowAddModal(false)}>Save Expense</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
