import { useState, useMemo } from 'react'
import { Clock, CheckCircle, AlertTriangle } from 'lucide-react'
import { PageHeader, Button, Select, StatusBadge, Badge, Card } from '@/components/ui'
import { mockAttendance, mockEmployees, mockSites } from '@/data/mock'
import type { AttendanceStatus } from '@/types'
import { cn } from '@/utils'

const dateOptions = [
  { value: '2025-09-10', label: '10 Sep 2025' },
  { value: '2025-09-09', label: '09 Sep 2025' },
  { value: '2025-09-08', label: '08 Sep 2025' },
]

const shiftOptions = [
  { value: '', label: 'All Shifts' },
  { value: 'day', label: 'Day Shift' },
  { value: 'night', label: 'Night Shift' },
]

export function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState('2025-09-10')
  const [shiftFilter, setShiftFilter] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const filtered = useMemo(() => {
    return mockAttendance.filter((a) => {
      const matchesDate = a.date === selectedDate
      const matchesShift = !shiftFilter || a.shift === shiftFilter
      return matchesDate && matchesShift
    })
  }, [selectedDate, shiftFilter])

  const stats = useMemo(() => {
    const present = filtered.filter((a) => a.status === 'present').length
    const absent = filtered.filter((a) => a.status === 'absent').length
    const late = filtered.filter((a) => a.status === 'late').length
    const onLeave = filtered.filter((a) => a.status === 'on_leave').length
    return { present, absent, late, onLeave, total: filtered.length }
  }, [filtered])

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filtered.map((a) => a.id))
    }
  }

  return (
    <div>
      <PageHeader
        title="Attendance"
        description="Track and manage daily attendance records."
        actions={
          <Button icon={<CheckCircle className="h-4 w-4" />}>Record Attendance</Button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Card padding>
          <div className="text-center">
            <p className="text-2xl font-bold text-success">{stats.present}</p>
            <p className="text-xs text-text-secondary mt-1">Present</p>
          </div>
        </Card>
        <Card padding>
          <div className="text-center">
            <p className="text-2xl font-bold text-danger">{stats.absent}</p>
            <p className="text-xs text-text-secondary mt-1">Absent</p>
          </div>
        </Card>
        <Card padding>
          <div className="text-center">
            <p className="text-2xl font-bold text-warning">{stats.late}</p>
            <p className="text-xs text-text-secondary mt-1">Late</p>
          </div>
        </Card>
        <Card padding>
          <div className="text-center">
            <p className="text-2xl font-bold text-info">{stats.onLeave}</p>
            <p className="text-xs text-text-secondary mt-1">On Leave</p>
          </div>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <Select options={dateOptions} value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
        <Select options={shiftOptions} value={shiftFilter} onChange={(e) => setShiftFilter(e.target.value)} />
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="info">{selectedIds.length} selected</Badge>
            <Button size="sm" variant="secondary">Bulk Mark Present</Button>
          </div>
        )}
      </div>

      <div className="bg-surface rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-secondary border-b border-border">
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filtered.length && filtered.length > 0}
                    onChange={toggleAll}
                    className="rounded border-border"
                  />
                </th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Employee</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary hidden md:table-cell">Site</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Shift</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary hidden md:table-cell">Check In</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary hidden md:table-cell">Check Out</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary">Status</th>
                <th className="text-left px-4 py-3 font-medium text-text-secondary hidden lg:table-cell">Notes</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-text-secondary">
                    No attendance records for this date.
                  </td>
                </tr>
              ) : (
                filtered.map((record) => (
                  <tr key={record.id} className="border-b border-border-light hover:bg-surface-secondary/50 transition-colors">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(record.id)}
                        onChange={() => toggleSelect(record.id)}
                        className="rounded border-border"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-text-primary">{record.employeeName}</p>
                    </td>
                    <td className="px-4 py-3 text-text-secondary hidden md:table-cell">{record.siteName}</td>
                    <td className="px-4 py-3">
                      <Badge variant={record.shift === 'day' ? 'info' : 'neutral'}>{record.shift === 'day' ? 'Day' : 'Night'}</Badge>
                    </td>
                    <td className="px-4 py-3 text-text-secondary hidden md:table-cell font-mono text-xs">{record.checkIn || '-'}</td>
                    <td className="px-4 py-3 text-text-secondary hidden md:table-cell font-mono text-xs">{record.checkOut || '-'}</td>
                    <td className="px-4 py-3"><StatusBadge status={record.status} /></td>
                    <td className="px-4 py-3 text-text-secondary text-xs hidden lg:table-cell">{record.notes || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-border text-sm text-text-secondary">
          Showing {filtered.length} records
        </div>
      </div>
    </div>
  )
}
