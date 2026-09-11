import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { DollarSign, FileText, Download } from 'lucide-react'
import { PageHeader, Button, Tabs, Select, StatusBadge, Card, CardTitle } from '@/components/ui'
import { mockPayroll } from '@/data/mock'
import { formatCurrency, cn } from '@/utils'

const periodOptions = [
  { value: 'September 2025', label: 'September 2025' },
  { value: 'August 2025', label: 'August 2025' },
  { value: 'July 2025', label: 'July 2025' },
]

export function PayrollPage() {
  const [activeTab, setActiveTab] = useState('government')
  const [period, setPeriod] = useState('September 2025')

  const tabs = [
    { id: 'government', label: 'Government Sites' },
    { id: 'private', label: 'Private Sites' },
    { id: 'staff', label: 'Staff' },
  ]

  const filtered = useMemo(() => {
    return mockPayroll.filter((p) => p.type === activeTab && p.period === period)
  }, [activeTab, period])

  const totals = useMemo(() => {
    return filtered.reduce(
      (acc, p) => ({
        gross: acc.gross + p.grossAmount,
        deductions: acc.deductions + p.deductions,
        net: acc.net + p.netAmount,
        overtime: acc.overtime + p.overtime,
      }),
      { gross: 0, deductions: 0, net: 0, overtime: 0 }
    )
  }, [filtered])

  const pendingCount = filtered.filter((p) => p.status === 'pending').length
  const processingCount = filtered.filter((p) => p.status === 'processing').length
  const paidCount = filtered.filter((p) => p.status === 'paid').length

  return (
    <div>
      <PageHeader
        title="Payroll"
        description="Process and manage payroll for government sites, private sites, and staff."
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" icon={<Download className="h-4 w-4" />}>Export</Button>
            <Link to="/payroll/process">
              <Button icon={<FileText className="h-4 w-4" />}>Process Payroll</Button>
            </Link>
          </div>
        }
      />

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-4" />

      <div className="flex gap-3 mb-4">
        <Select options={periodOptions} value={period} onChange={(e) => setPeriod(e.target.value)} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Card padding>
          <div className="text-center">
            <p className="text-xs text-text-secondary">Gross Amount</p>
            <p className="text-lg font-bold text-text-primary mt-1">{formatCurrency(totals.gross)}</p>
          </div>
        </Card>
        <Card padding>
          <div className="text-center">
            <p className="text-xs text-text-secondary">Deductions</p>
            <p className="text-lg font-bold text-danger mt-1">{formatCurrency(totals.deductions)}</p>
          </div>
        </Card>
        <Card padding>
          <div className="text-center">
            <p className="text-xs text-text-secondary">Net Amount</p>
            <p className="text-lg font-bold text-success mt-1">{formatCurrency(totals.net)}</p>
          </div>
        </Card>
        <Card padding>
          <div className="text-center">
            <p className="text-xs text-text-secondary">Overtime</p>
            <p className="text-lg font-bold text-jic-orange mt-1">{formatCurrency(totals.overtime)}</p>
          </div>
        </Card>
      </div>

      <div className="flex gap-4 mb-4 text-sm">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-warning" />
          Pending: <strong>{pendingCount}</strong>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-info" />
          Processing: <strong>{processingCount}</strong>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-success" />
          Paid: <strong>{paidCount}</strong>
        </span>
      </div>

      <div className="bg-surface rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-secondary border-b border-border">
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Employee</th>
                {activeTab !== 'staff' && <th className="text-left px-4 py-3 font-medium text-text-secondary hidden md:table-cell">Site</th>}
                <th className="text-right px-4 py-3 font-medium text-text-secondary">Base</th>
                <th className="text-right px-4 py-3 font-medium text-text-secondary hidden md:table-cell">Overtime</th>
                <th className="text-right px-4 py-3 font-medium text-text-secondary">Gross</th>
                <th className="text-right px-4 py-3 font-medium text-text-secondary hidden md:table-cell">Deductions</th>
                <th className="text-right px-4 py-3 font-medium text-text-secondary">Net</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-text-secondary">
                    No payroll records for this period.
                  </td>
                </tr>
              ) : (
                filtered.map((record) => (
                  <tr key={record.id} className="border-b border-border-light hover:bg-surface-secondary/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-text-primary">{record.employeeName}</td>
                    {activeTab !== 'staff' && (
                      <td className="px-4 py-3 text-text-secondary hidden md:table-cell">{record.siteName}</td>
                    )}
                    <td className="px-4 py-3 text-right font-mono text-xs">{formatCurrency(record.baseSalary)}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs hidden md:table-cell">
                      {record.overtime > 0 ? (
                        <span className="text-jic-orange">{formatCurrency(record.overtime)} ({record.overtimeShifts} shifts)</span>
                      ) : '-'}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs">{formatCurrency(record.grossAmount)}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs text-danger hidden md:table-cell">{formatCurrency(record.deductions)}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs font-medium">{formatCurrency(record.netAmount)}</td>
                    <td className="px-4 py-3"><StatusBadge status={record.status} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-border flex items-center justify-between text-sm">
            <span className="text-text-secondary">{filtered.length} employees</span>
            <div className="flex gap-4 font-medium">
              <span>Gross: {formatCurrency(totals.gross)}</span>
              <span className="text-danger">Deductions: {formatCurrency(totals.deductions)}</span>
              <span className="text-success">Net: {formatCurrency(totals.net)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
