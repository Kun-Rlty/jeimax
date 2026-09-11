import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Shield } from 'lucide-react'
import { useAuthStore } from '@/stores'
import type { UserRole } from '@/types'
import { cn } from '@/utils'

interface DemoUser {
  email: string
  password: string
  firstName: string
  lastName: string
  role: UserRole
  roleLabel: string
}

const demoUsers: DemoUser[] = [
  { email: 'admin@jeimax.co.tz', password: 'admin123', firstName: 'Admin', lastName: 'User', role: 'it_chief', roleLabel: 'IT & System Chief' },
  { email: 'lilian@jeimax.co.tz', password: 'lilian123', firstName: 'Lilian', lastName: 'Mrosso', role: 'operations_field', roleLabel: 'Operations & Field' },
  { email: 'irene@jeimax.co.tz', password: 'irene123', firstName: 'Irene', lastName: 'Mkamba', role: 'accountant', roleLabel: 'Accountant' },
  { email: 'fatima@jeimax.co.tz', password: 'fatima123', firstName: 'Fatima', lastName: 'Juma', role: 'hr_compliance', roleLabel: 'HR & Compliance' },
]

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    await new Promise((r) => setTimeout(r, 400))

    const user = demoUsers.find(
      (u) => u.email === email && u.password === password
    )

    if (!user) {
      setError('Invalid email or password')
      setLoading(false)
      return
    }

    login({
      id: String(demoUsers.indexOf(user) + 1),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    })

    setLoading(false)
    navigate('/dashboard')
  }

  const fillDemo = (user: DemoUser) => {
    setEmail(user.email)
    setPassword(user.password)
    setError('')
  }

  return (
    <div className="min-h-screen bg-surface-secondary flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-xl bg-jic-blue flex items-center justify-center mx-auto mb-4">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary">JEIMAX HRMS</h1>
            <p className="text-sm text-text-secondary mt-1">Sign in to your account</p>
          </div>

          <div className="bg-surface rounded-lg border border-border shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text-primary">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError('') }}
                  required
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-jic-blue/20 focus:border-jic-blue"
                  placeholder="your@email.co.tz"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text-primary">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError('') }}
                    required
                    className="w-full rounded-md border border-border bg-surface px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-jic-blue/20 focus:border-jic-blue"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-text-tertiary hover:text-text-primary"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-md bg-danger-bg border border-danger/20 text-sm text-danger">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-md bg-jic-blue text-white text-sm font-medium hover:bg-jic-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>

          <div className="mt-6">
            <p className="text-xs text-text-tertiary text-center mb-3">Demo accounts — click to autofill</p>
            <div className="grid grid-cols-2 gap-2">
              {demoUsers.map((user) => (
                <button
                  key={user.email}
                  onClick={() => fillDemo(user)}
                  className={cn(
                    'p-3 rounded-lg border text-left transition-colors',
                    email === user.email
                      ? 'border-jic-blue bg-jic-blue/5'
                      : 'border-border bg-surface hover:border-jic-blue/30'
                  )}
                >
                  <p className="text-xs font-medium text-text-primary truncate">{user.firstName} {user.lastName}</p>
                  <p className="text-[10px] text-text-tertiary mt-0.5">{user.roleLabel}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
