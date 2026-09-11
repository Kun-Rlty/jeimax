import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, AlertTriangle } from 'lucide-react'
import { PageHeader, Button, Select, Card, CardTitle, Alert, StatusBadge } from '@/components/ui'
import { mockPayroll } from '@/data/mock'
import { formatCurrency, cn } from '@/utils'

const periodOptions = [
  { value: 'September 2025', label: 'September 2025' },
  { value: 'August 2025', label: 'August 2025' },
  { value: 'July 2025', label: 'July 2025' },
]

const typeOptions = [
  { value: 'government', label: 'Government Sites' },
  { value: 'private', label: 'Private Sites' },
  { value: 'staff', label: 'Staff' },
]

export function ProcessPayrollPage() {
  const navigate = useNavigate()
  const [period, setPeriod] = useState('September 2025')
  const [payrollType, setPayrollType] = useState('government')
  const [isProcessing, setIsProcessing] = useState(false)

  const records = mockPayroll.filter((p) => p.period === period && p.type === payrollType)
  const pendingRecords = records.filter((r) => r.status === 'pending')
  const totals = records.reduce(
    (acc, r) => ({
      gross: acc.gross + r.grossAmount,
      deductions: acc.deductions + r.deductions,
      net: acc.net + r.netAmount,
    }),
    { gross: 0, deductions: 0, net: 0 }
  )

  const handleProcess = async () => {
    setIsProcessing(true)
    await new Promise((r) => setTimeout(r, 1000))
    console.log('Processing payroll:', { period, type: payrollType, records: pendingRecords })
    setIsProcessing(false)
    navigate('/payroll')
  }

  return (
    <div>
      <PageHeader
        title="Process Payroll"
        description="Review and process payroll for the selected period."
        breadcrumbs={[
          { label: 'Payroll', href: '/payroll' },
          { label: 'Process Payroll' },
        ]}
        actions={
          <Button variant="ghost" icon={<ArrowLeft className="h-4 w-4" />} onClick={() => navigate('/payroll')}>
            Back
          </Button>
        }
      />

      <Card className="mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Payroll Period"
            options={periodOptions}
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          />
          <Select
            label="Payroll Type"
            options={typeOptions}
            value={payrollType}
            onChange={(e) => setPayrollType(e.target.value)}
          />
        </div>
      </Card>

      {pendingRecords.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-text-tertiary mx-auto mb-3" />
            <p className="text-text-secondary">No pending payroll records for this period and type.</p>
            <Button variant="secondary" className="mt-4" onClick={() => navigate('/payroll')}>
              Back to Payroll
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <Alert variant="info" title="Processing Summary" className="mb-4">
            You are about to process <strong>{pendingRecords.length}</strong> payroll record(s) for <strong>{period}</strong> ({payrollType}).
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <Card padding>
              <div className="text-center">
                <p className="text-xs text-text-secondary">Gross Amount</p>
                <p className="text-lg font-bold text-text-primary mt-1">{formatCurrency(totals.gross)}</p>
              </div>
            </Card>
            <Card padding>
              <div className="text-center">
                <p className="text-xs text-text-secondary">Total Deductions</p>
                <p className="text-lg font-bold text-danger mt-1">{formatCurrency(totals.deductions)}</p>
              </div>
            </Card>
            <Card padding>
              <div className="text-center">
                <p className="text-xs text-text-secondary">Net Amount</p>
                <p className="text-lg font-bold text-success mt-1">{formatCurrency(totals.net)}</p>
              </div>
            </Card>
          </div>

          <div className="bg-surface rounded-lg border border-border shadow-sm overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-secondary border-b border-border">
                    <th className="text-left px-4 py-3 font-medium text-text-secondary">Employee</th>
                    {payrollType !== 'staff' && (
                      <th className="text-left px-4 py-3 font-medium text-text-secondary hidden md:table-cell">Site</th>
                    )}
                    <th className="text-right px-4 py-3 font-medium text-text-secondary">Base</th>
                    <th className="text-right px-4 py-3 font-medium text-text-secondary hidden md:table-cell">Overtime</th>
                    <th className="text-right px-4 py-3 font-medium text-text-secondary">Gross</th>
                    <th className="text-right px-4 py-3 font-medium text-text-secondary hidden md:table-cell">Deductions</th>
                    <th className="text-right px-4 py-3 font-medium text-text-secondary">Net</th>
                    <th className="text-left px-4 py-3 font-medium text-text-secondary">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingRecords.map((record) => (
                    <tr key={record.id} className="border-b border-border-light">
                      <td className="px-4 py-3 font-medium text-text-primary">{record.employeeName}</td>
                      {payrollType !== 'staff' && (
                        <td className="px-4 py-3 text-text-secondary hidden md:table-cell">{record.siteName}</td>
                      )}
                      <td className="px-4 py-3 text-right font-mono text-xs">{formatCurrency(record.baseSalary)}</td>
                      <td className="px-4 py-3 text-right font-mono text-xs hidden md:table-cell">
                        {record.overtime > 0 ? (
                          <span className="text-jic-orange">{formatCurrency(record.overtime)}</span>
                        ) : '-'}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs">{formatCurrency(record.grossAmount)}</td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-danger hidden md:table-cell">{formatCurrency(record.deductions)}</td>
                      <td className="px-4 py-3 text-right font-mono text-xs font-medium">{formatCurrency(record.netAmount)}</td>
                      <td className="px-4 py-3"><StatusBadge status={record.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => navigate('/payroll')}>
              Cancel
            </Button>
            <Button onClick={handleProcess} loading={isProcessing}>
              Process Payroll
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
