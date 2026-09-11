import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { DollarSign, FileText, Briefcase, ArrowRight } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { StatCard, Card, CardTitle, StatusBadge } from '@/components/ui'
import { mockPayroll, mockExpenses } from '@/data/mock'
import { formatCurrency } from '@/utils'

const payrollByType = [
  { type: 'Government', amount: 945200 },
  { type: 'Private', amount: 778600 },
  { type: 'Staff', amount: 1657500 },
]

const COLORS = ['#1f3a8f', '#f19325', '#0f7b3f']

export function AccountantDashboardPage() {
  const stats = useMemo(() => {
    const pendingPayroll = mockPayroll.filter((p) => p.status === 'pending').length
    const totalGross = mockPayroll.reduce((sum, p) => sum + p.grossAmount, 0)
    const totalDeductions = mockPayroll.reduce((sum, p) => sum + p.deductions, 0)
    const totalExpenses = mockExpenses.reduce((sum, e) => sum + e.amount, 0)
    return { pendingPayroll, totalGross, totalDeductions, totalExpenses }
  }, [])

  const recentExpenses = mockExpenses.slice(0, 5)

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Accountant Dashboard</h1>
          <p className="text-sm text-text-secondary mt-0.5">Payroll, expenses, and financial overview.</p>
        </div>
        <div className="text-sm text-text-secondary">
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard title="Pending Payroll" value={stats.pendingPayroll} icon={<FileText className="h-5 w-5" />} variant="orange" />
        <StatCard title="Total Gross" value={formatCurrency(stats.totalGross)} icon={<DollarSign className="h-5 w-5" />} variant="blue" />
        <StatCard title="Total Deductions" value={formatCurrency(stats.totalDeductions)} icon={<DollarSign className="h-5 w-5" />} variant="default" />
        <StatCard title="Total Expenses" value={formatCurrency(stats.totalExpenses)} icon={<Briefcase className="h-5 w-5" />} variant="default" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardTitle>Payroll Summary by Type</CardTitle>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={payrollByType}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e5eb" />
                <XAxis dataKey="type" tick={{ fontSize: 12 }} stroke="#8b95a5" />
                <YAxis tick={{ fontSize: 12 }} stroke="#8b95a5" tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                <Tooltip formatter={(v) => [`TZS ${Number(v).toLocaleString()}`, 'Amount']} />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]} fill="#1f3a8f" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <Link to="/payroll" className="mt-2 block text-sm text-jic-blue hover:underline flex items-center gap-1">
            View Payroll <ArrowRight className="h-3 w-3" />
          </Link>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Recent Expenses</CardTitle>
            <Link to="/expenses" className="text-sm text-jic-blue hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {recentExpenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                <div>
                  <p className="text-sm font-medium text-text-primary">{expense.category}</p>
                  <p className="text-xs text-text-secondary">{expense.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-text-primary">{formatCurrency(expense.amount)}</p>
                  <StatusBadge status={expense.status} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <CardTitle>Pending Payroll</CardTitle>
          <Link to="/payroll" className="text-sm text-jic-blue hover:underline flex items-center gap-1">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 text-text-secondary font-medium">Employee</th>
                <th className="text-left py-2 text-text-secondary font-medium hidden md:table-cell">Site</th>
                <th className="text-right py-2 text-text-secondary font-medium">Gross</th>
                <th className="text-right py-2 text-text-secondary font-medium hidden md:table-cell">Deductions</th>
                <th className="text-right py-2 text-text-secondary font-medium">Net</th>
                <th className="text-left py-2 text-text-secondary font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockPayroll.filter((p) => p.status === 'pending').slice(0, 5).map((record) => (
                <tr key={record.id} className="border-b border-border-light">
                  <td className="py-2.5 font-medium text-text-primary">{record.employeeName}</td>
                  <td className="py-2.5 text-text-secondary hidden md:table-cell">{record.siteName}</td>
                  <td className="py-2.5 text-right font-mono text-xs">{formatCurrency(record.grossAmount)}</td>
                  <td className="py-2.5 text-right font-mono text-xs text-danger hidden md:table-cell">{formatCurrency(record.deductions)}</td>
                  <td className="py-2.5 text-right font-mono text-xs font-medium">{formatCurrency(record.netAmount)}</td>
                  <td className="py-2.5"><StatusBadge status={record.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
