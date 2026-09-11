import { useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { z } from 'zod'
import { ArrowLeft, AlertTriangle, Users, CheckCircle } from 'lucide-react'
import { PageHeader, Button, Select, Card, CardTitle, Alert, Badge } from '@/components/ui'
import { mockSites, mockEmployees } from '@/data/mock'
import { cn } from '@/utils'

export function AssignGuardPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const preselectedSite = searchParams.get('siteId') || ''

  const [siteId, setSiteId] = useState(preselectedSite)
  const [selectedGuardIds, setSelectedGuardIds] = useState<string[]>([])
  const [shift, setShift] = useState<'day' | 'night'>('day')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ siteId?: string; guards?: string }>({})

  const activeSites = mockSites.filter((s) => s.status === 'active' || s.status === 'new')
  const selectedSite = mockSites.find((s) => s.id === siteId)

  const remainingSlots = selectedSite
    ? Math.max(0, selectedSite.requiredGuards - selectedSite.assignedGuards)
    : 0

  const allGuards = mockEmployees.filter((e) => e.status === 'active')

  const guardsByCategory = useMemo(() => {
    if (!siteId) return { available: [], assignedHere: [], assignedElsewhere: [] }

    const available: typeof allGuards = []
    const assignedHere: typeof allGuards = []
    const assignedElsewhere: typeof allGuards = []

    allGuards.forEach((guard) => {
      if (guard.siteId === siteId) {
        assignedHere.push(guard)
      } else if (guard.siteId) {
        assignedElsewhere.push(guard)
      } else {
        available.push(guard)
      }
    })

    return { available, assignedHere, assignedElsewhere }
  }, [siteId, allGuards])

  const siteOptions = activeSites.map((s) => ({
    value: s.id,
    label: `${s.siteName} (${s.assignedGuards}/${s.requiredGuards} guards)`,
  }))

  const toggleGuard = (guardId: string) => {
    setSelectedGuardIds((prev) => {
      if (prev.includes(guardId)) {
        return prev.filter((id) => id !== guardId)
      }
      return [...prev, guardId]
    })
    setErrors((prev) => ({ ...prev, guards: undefined }))
  }

  const validate = (): boolean => {
    const newErrors: { siteId?: string; guards?: string } = {}

    if (!siteId) {
      newErrors.siteId = 'Site is required'
    }

    if (selectedGuardIds.length === 0) {
      newErrors.guards = 'Select at least one guard'
    } else if (selectedGuardIds.length !== remainingSlots) {
      newErrors.guards = `Select exactly ${remainingSlots} guard(s) — ${remainingSlots} slot(s) available`
    }

    // Check if any selected guard is already assigned elsewhere
    const conflicting = selectedGuardIds.some((id) => {
      const guard = allGuards.find((g) => g.id === id)
      return guard?.siteId && guard.siteId !== siteId
    })
    if (conflicting) {
      newErrors.guards = 'One or more selected guards are already assigned to another site. Remove them before proceeding.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return

    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 500))
    console.log('Guard assignment:', { siteId, guardIds: selectedGuardIds, shift })
    setIsSubmitting(false)
    navigate(-1)
  }

  return (
    <div>
      <PageHeader
        title="Assign Guards"
        description="Assign one or more guards to a security site."
        breadcrumbs={[
          { label: 'Operations', href: '/operations' },
          { label: 'Assign Guards' },
        ]}
        actions={
          <Button variant="ghost" icon={<ArrowLeft className="h-4 w-4" />} onClick={() => navigate(-1)}>
            Back
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardTitle>Site & Shift</CardTitle>
          <div className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-primary">
                Site <span className="text-danger">*</span>
              </label>
              <select
                value={siteId}
                onChange={(e) => {
                  setSiteId(e.target.value)
                  setSelectedGuardIds([])
                  setErrors({})
                }}
                className={cn(
                  'w-full rounded-md border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-jic-blue/20 focus:border-jic-blue',
                  errors.siteId ? 'border-danger' : 'border-border'
                )}
              >
                <option value="">Select site</option>
                {siteOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {errors.siteId && <p className="text-xs text-danger">{errors.siteId}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-primary">
                Shift <span className="text-danger">*</span>
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShift('day')}
                  className={cn(
                    'flex-1 px-3 py-2 rounded-md border text-sm font-medium transition-colors',
                    shift === 'day'
                      ? 'bg-jic-blue text-white border-jic-blue'
                      : 'bg-surface border-border text-text-secondary hover:border-jic-blue/30'
                  )}
                >
                  Day (6AM–6PM)
                </button>
                <button
                  type="button"
                  onClick={() => setShift('night')}
                  className={cn(
                    'flex-1 px-3 py-2 rounded-md border text-sm font-medium transition-colors',
                    shift === 'night'
                      ? 'bg-jic-blue text-white border-jic-blue'
                      : 'bg-surface border-border text-text-secondary hover:border-jic-blue/30'
                  )}
                >
                  Night (6PM–6AM)
                </button>
              </div>
            </div>

            {selectedSite && (
              <div className="p-3 bg-surface-secondary rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-text-tertiary">Staffing</span>
                  <Badge variant={remainingSlots === 0 ? 'success' : 'warning'}>
                    {remainingSlots === 0 ? 'Fully Staffed' : `${remainingSlots} slot(s) open`}
                  </Badge>
                </div>
                <div className="space-y-1 text-xs text-text-secondary">
                  <div className="flex justify-between">
                    <span>Required guards</span>
                    <span className="font-medium text-text-primary">{selectedSite.requiredGuards}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Currently assigned</span>
                    <span className="font-medium text-text-primary">{selectedSite.assignedGuards}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Selected now</span>
                    <span className={cn('font-medium', selectedGuardIds.length > 0 ? 'text-jic-blue' : 'text-text-primary')}>
                      {selectedGuardIds.length}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Select Guards</CardTitle>
            {siteId && (
              <span className="text-sm text-text-secondary">
                <span className={cn('font-medium', selectedGuardIds.length === remainingSlots && remainingSlots > 0 ? 'text-success' : 'text-text-primary')}>
                  {selectedGuardIds.length}
                </span>
                /{remainingSlots} selected
              </span>
            )}
          </div>

          {errors.guards && (
            <Alert variant="danger" className="mb-4">{errors.guards}</Alert>
          )}

          {!siteId ? (
            <div className="text-center py-12">
              <Users className="h-10 w-10 text-text-tertiary mx-auto mb-3" />
              <p className="text-sm text-text-secondary">Select a site first to see available guards.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {guardsByCategory.assignedHere.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">
                    Already at this site ({guardsByCategory.assignedHere.length})
                  </p>
                  <div className="space-y-1">
                    {guardsByCategory.assignedHere.map((guard) => (
                      <label
                        key={guard.id}
                        className="flex items-center gap-3 p-2.5 rounded-lg bg-success-bg/50 border border-success/20 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedGuardIds.includes(guard.id)}
                          onChange={() => toggleGuard(guard.id)}
                          className="rounded border-border"
                        />
                        <div className="w-7 h-7 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-semibold text-success">
                            {guard.firstName.charAt(0)}{guard.lastName.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate">
                            {guard.firstName} {guard.lastName}
                          </p>
                          <p className="text-xs text-text-tertiary">{guard.employeeId}</p>
                        </div>
                        <Badge variant="success" size="sm">Assigned</Badge>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {guardsByCategory.available.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">
                    Available ({guardsByCategory.available.length})
                  </p>
                  <div className="space-y-1">
                    {guardsByCategory.available.map((guard) => {
                      const isSelected = selectedGuardIds.includes(guard.id)
                      return (
                        <label
                          key={guard.id}
                          className={cn(
                            'flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors',
                            isSelected
                              ? 'bg-jic-blue/5 border-jic-blue/30'
                              : 'bg-surface border-border hover:border-jic-blue/20'
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleGuard(guard.id)}
                            className="rounded border-border"
                          />
                          <div className={cn(
                            'w-7 h-7 rounded-full flex items-center justify-center shrink-0',
                            isSelected ? 'bg-jic-blue/10' : 'bg-surface-tertiary'
                          )}>
                            <span className={cn('text-[10px] font-semibold', isSelected ? 'text-jic-blue' : 'text-text-secondary')}>
                              {guard.firstName.charAt(0)}{guard.lastName.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-text-primary truncate">
                              {guard.firstName} {guard.lastName}
                            </p>
                            <p className="text-xs text-text-tertiary">{guard.employeeId}</p>
                          </div>
                          {isSelected && <CheckCircle className="h-4 w-4 text-jic-blue shrink-0" />}
                        </label>
                      )
                    })}
                  </div>
                </div>
              )}

              {guardsByCategory.assignedElsewhere.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">
                    Assigned to other sites ({guardsByCategory.assignedElsewhere.length})
                  </p>
                  <div className="space-y-1">
                    {guardsByCategory.assignedElsewhere.map((guard) => (
                      <div
                        key={guard.id}
                        className="flex items-center gap-3 p-2.5 rounded-lg bg-surface-secondary border border-border opacity-60"
                      >
                        <div className="w-7 h-7 rounded-full bg-surface-tertiary flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-semibold text-text-tertiary">
                            {guard.firstName.charAt(0)}{guard.lastName.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate">
                            {guard.firstName} {guard.lastName}
                          </p>
                          <p className="text-xs text-text-tertiary">{guard.employeeId}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <AlertTriangle className="h-3.5 w-3.5 text-warning" />
                          <span className="text-xs text-warning">{guard.siteName}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {guardsByCategory.available.length === 0 &&
                guardsByCategory.assignedHere.length === 0 &&
                guardsByCategory.assignedElsewhere.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-10 w-10 text-text-tertiary mx-auto mb-3" />
                  <p className="text-sm text-text-secondary">No active guards found.</p>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          loading={isSubmitting}
          disabled={!siteId || remainingSlots === 0 || selectedGuardIds.length !== remainingSlots}
        >
          Assign {selectedGuardIds.length > 0 ? selectedGuardIds.length : ''} Guard{selectedGuardIds.length !== 1 ? 's' : ''}
        </Button>
      </div>
    </div>
  )
}
