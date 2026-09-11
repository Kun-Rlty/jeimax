import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PageHeader, Button, Select, Card, CardTitle, StatusBadge } from '@/components/ui'
import { mockEmployees, mockSites } from '@/data/mock'
import type { AttendanceStatus } from '@/types'

const siteOptions = [
  { value: '', label: 'All Sites' },
  ...mockSites.filter((s) => s.status === 'active').map((s) => ({ value: s.id, label: s.siteName })),
]

const shiftOptions = [
  { value: 'day', label: 'Day Shift (6:00 AM - 6:00 PM)' },
  { value: 'night', label: 'Night Shift (6:00 PM - 6:00 AM)' },
]

const statusOptions: { value: AttendanceStatus; label: string }[] = [
  { value: 'present', label: 'Present' },
  { value: 'absent', label: 'Absent' },
  { value: 'late', label: 'Late' },
  { value: 'on_leave', label: 'On Leave' },
]

const today = new Date().toISOString().split('T')[0]

interface AttendanceEntry {
  employeeId: string
  status: AttendanceStatus
  checkIn: string
  checkOut: string
  notes: string
}

export function RecordAttendancePage() {
  const navigate = useNavigate()
  const [date, setDate] = useState(today)
  const [shift, setShift] = useState('day')
  const [siteId, setSiteId] = useState('')
  const [entries, setEntries] = useState<Record<string, AttendanceEntry>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const deployedGuards = mockEmployees.filter(
    (e) => e.siteId && e.status === 'active'
  )

  const filteredGuards = siteId
    ? deployedGuards.filter((e) => e.siteId === siteId)
    : deployedGuards

  const updateEntry = (empId: string, field: keyof AttendanceEntry, value: string) => {
    setEntries((prev) => {
      const existing = prev[empId] || {
        employeeId: empId,
        status: 'present' as AttendanceStatus,
        checkIn: '',
        checkOut: '',
        notes: '',
      }
      return { ...prev, [empId]: { ...existing, [field]: value } }
    })
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    const records = Object.values(entries).map((e) => ({
      ...e,
      date,
      shift,
    }))
    await new Promise((r) => setTimeout(r, 500))
    console.log('Attendance records:', records)
    setIsSubmitting(false)
    navigate('/attendance')
  }

  return (
    <div>
      <PageHeader
        title="Record Attendance"
        description="Mark attendance for deployed guards."
        breadcrumbs={[
          { label: 'Attendance', href: '/attendance' },
          { label: 'Record Attendance' },
        ]}
        actions={
          <Button variant="ghost" icon={<ArrowLeft className="h-4 w-4" />} onClick={() => navigate('/attendance')}>
            Back
          </Button>
        }
      />

      <Card className="mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-text-primary">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-jic-blue/20 focus:border-jic-blue"
            />
          </div>
          <Select
            label="Shift"
            options={shiftOptions}
            value={shift}
            onChange={(e) => setShift(e.target.value)}
          />
          <Select
            label="Filter by Site"
            options={siteOptions}
            value={siteId}
            onChange={(e) => setSiteId(e.target.value)}
          />
        </div>
      </Card>

      <div className="bg-surface rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-secondary border-b border-border">
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Employee</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary hidden md:table-cell">Site</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Status</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary hidden md:table-cell">Check In</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary hidden md:table-cell">Check Out</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary hidden lg:table-cell">Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuards.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-text-secondary">
                    No deployed guards found.
                  </td>
                </tr>
              ) : (
                filteredGuards.map((emp) => {
                  const entry = entries[emp.id]
                  const status = entry?.status || 'present'
                  return (
                    <tr key={emp.id} className="border-b border-border-light">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-jic-blue/10 flex items-center justify-center shrink-0">
                            <span className="text-xs font-semibold text-jic-blue">
                              {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-text-primary">{emp.firstName} {emp.lastName}</p>
                            <p className="text-xs text-text-tertiary">{emp.employeeId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-text-secondary hidden md:table-cell">{emp.siteName}</td>
                      <td className="px-4 py-3">
                        <select
                          value={status}
                          onChange={(e) => updateEntry(emp.id, 'status', e.target.value)}
                          className="rounded-md border border-border bg-surface px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-jic-blue/20"
                        >
                          {statusOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <input
                          type="time"
                          value={entry?.checkIn || ''}
                          onChange={(e) => updateEntry(emp.id, 'checkIn', e.target.value)}
                          className="rounded-md border border-border bg-surface px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-jic-blue/20 w-28"
                        />
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <input
                          type="time"
                          value={entry?.checkOut || ''}
                          onChange={(e) => updateEntry(emp.id, 'checkOut', e.target.value)}
                          className="rounded-md border border-border bg-surface px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-jic-blue/20 w-28"
                        />
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <input
                          type="text"
                          value={entry?.notes || ''}
                          onChange={(e) => updateEntry(emp.id, 'notes', e.target.value)}
                          placeholder="Optional note"
                          className="rounded-md border border-border bg-surface px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-jic-blue/20 w-32"
                        />
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        {filteredGuards.length > 0 && (
          <div className="px-4 py-3 border-t border-border flex items-center justify-between">
            <span className="text-sm text-text-secondary">
              {filteredGuards.length} guard(s) &middot; {Object.keys(entries).length} updated
            </span>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => navigate('/attendance')}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} loading={isSubmitting}>
                Save Attendance
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
