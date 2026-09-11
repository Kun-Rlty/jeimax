import { useState } from 'react'
import { BarChart3, Download, FileText, Users, MapPin, Building2, Clock, DollarSign, Briefcase } from 'lucide-react'
import { PageHeader, Button, Select, Card, CardTitle } from '@/components/ui'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const reportTypes = [
  { id: 'employee', label: 'Employee Report', icon: <Users className="h-4 w-4" /> },
  { id: 'site', label: 'Site Report', icon: <MapPin className="h-4 w-4" /> },
  { id: 'client', label: 'Client Report', icon: <Building2 className="h-4 w-4" /> },
  { id: 'attendance', label: 'Attendance Report', icon: <Clock className="h-4 w-4" /> },
  { id: 'payroll', label: 'Payroll Report', icon: <DollarSign className="h-4 w-4" /> },
  { id: 'expense', label: 'Expense Report', icon: <Briefcase className="h-4 w-4" /> },
]

const payrollByType = [
  { type: 'Government', amount: 945200 },
  { type: 'Private', amount: 778600 },
  { type: 'Staff', amount: 1657500 },
]

const COLORS = ['#1f3a8f', '#f19325', '#0f7b3f']

const expenseByCategory = [
  { category: 'Uniform', amount: 250000 },
  { category: 'Equipment', amount: 85000 },
  { category: 'Transport', amount: 45000 },
  { category: 'Training', amount: 350000 },
  { category: 'Office', amount: 65000 },
]

export function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('employee')

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Generate and export operational reports."
        actions={
          <Button variant="secondary" icon={<Download className="h-4 w-4" />}>Export All</Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {reportTypes.map((report) => (
          <button
            key={report.id}
            onClick={() => setSelectedReport(report.id)}
            className={`flex items-center gap-3 p-4 bg-surface rounded-lg border transition-all text-left ${
              selectedReport === report.id
                ? 'border-jic-blue ring-1 ring-jic-blue/20 bg-jic-blue/5'
                : 'border-border hover:border-jic-blue/30'
            }`}
          >
            <div className={`p-2 rounded-lg ${selectedReport === report.id ? 'bg-jic-blue text-white' : 'bg-surface-tertiary text-text-secondary'}`}>
              {report.icon}
            </div>
            <span className={`text-sm font-medium ${selectedReport === report.id ? 'text-jic-blue' : 'text-text-primary'}`}>
              {report.label}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardTitle>Payroll Summary by Type</CardTitle>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={payrollByType}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e5eb" />
                <XAxis dataKey="type" tick={{ fontSize: 12 }} stroke="#8b95a5" />
                <YAxis tick={{ fontSize: 12 }} stroke="#8b95a5" tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                <Tooltip formatter={(v) => [`TZS ${Number(v).toLocaleString()}`, 'Amount']} />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {payrollByType.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardTitle>Expenses by Category</CardTitle>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="amount"
                  nameKey="category"
                >
                  {expenseByCategory.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`TZS ${Number(v).toLocaleString()}`, 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {expenseByCategory.map((cat, i) => (
              <div key={cat.category} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-text-secondary">{cat.category}</span>
                </div>
                <span className="font-medium text-text-primary">TZS {cat.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-4">
        <div className="flex items-center justify-between mb-4">
          <CardTitle>Quick Report Generation</CardTitle>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Report Type"
            options={reportTypes.map((r) => ({ value: r.id, label: r.label }))}
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
          />
          <Select
            label="Period"
            options={[
              { value: 'this_month', label: 'This Month' },
              { value: 'last_month', label: 'Last Month' },
              { value: 'this_quarter', label: 'This Quarter' },
              { value: 'this_year', label: 'This Year' },
            ]}
          />
          <div className="flex items-end gap-2">
            <Button className="w-full" icon={<FileText className="h-4 w-4" />}>Generate Report</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
