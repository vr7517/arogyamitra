import { Building2, LockKeyhole, LogIn, Mail, MapPin, Phone, ShieldCheck, User, UserPlus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { users } from '../data/dummyData'
import { useApp } from '../hooks/useApp'

const roleDestinations = {
  admin: '/dashboard/admin',
  pharmacy: '/dashboard/pharmacy',
  user: '/dashboard/user',
}

const emptyRegisterForm = {
  name: '',
  email: '',
  password: '',
  locality: '',
  role: 'user',
  pharmacyName: '',
  pharmacyAddress: '',
  pharmacyContact: '',
}

export default function LoginPage() {
  const { isAuthenticated, login, register, currentUser } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [mode, setMode] = useState('login')
  const [loginForm, setLoginForm] = useState({ email: 'user@arogyamitra.test', password: 'user123' })
  const [registerForm, setRegisterForm] = useState(emptyRegisterForm)
  const [submitting, setSubmitting] = useState(false)
  const demoAccounts = useMemo(() => users.map(({ id, name, role, email, password }) => ({ id, name, role, email, password })), [])

  if (isAuthenticated) {
    return <Navigate to={roleDestinations[currentUser.role] || '/dashboard/user'} replace />
  }

  const goToPanel = (user) => {
    const fallback = roleDestinations[user.role] || '/dashboard/user'
    navigate(location.state?.from?.pathname || fallback, { replace: true })
  }

  const handleLogin = (event) => {
    event.preventDefault()
    setSubmitting(true)
    const result = login(loginForm)
    setSubmitting(false)

    if (result.ok) {
      goToPanel(result.user)
    }
  }

  const handleRegister = (event) => {
    event.preventDefault()
    setSubmitting(true)
    const result = register(registerForm)
    setSubmitting(false)

    if (result.ok) {
      setRegisterForm(emptyRegisterForm)
      goToPanel(result.user)
    }
  }

  return (
    <section className="mx-auto grid min-h-[calc(100vh-76px)] max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
      <div>
        <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-2 text-sm font-black text-teal-700 dark:bg-teal-400/10 dark:text-teal-200">
          <ShieldCheck size={16} />
          Account access
        </span>
        <h1 className="mt-5 max-w-xl text-4xl font-black tracking-tight sm:text-5xl">Login or create your ArogyaMitra account.</h1>
        <p className="mt-4 max-w-xl text-base font-semibold leading-7 text-slate-600 dark:text-slate-300">
          Register as a patient user or pharmacy owner. Pharmacy accounts open directly into the pharmacy management panel.
        </p>

        <div className="mt-6 grid gap-3">
          {demoAccounts.map((account) => (
            <button
              key={account.id}
              type="button"
              onClick={() => {
                setMode('login')
                setLoginForm({ email: account.email, password: account.password })
              }}
              className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white px-4 py-3 text-left shadow-sm transition hover:border-teal-300 dark:border-slate-800 dark:bg-slate-900"
            >
              <span>
                <span className="block text-sm font-black">{account.name}</span>
                <span className="block text-xs font-bold text-slate-500 dark:text-slate-400">{account.email}</span>
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black capitalize text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {account.role}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          {['login', 'register'].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setMode(item)}
              className={`rounded-md px-4 py-2 text-sm font-black capitalize ${mode === item ? 'bg-white text-teal-700 shadow-sm dark:bg-slate-950 dark:text-teal-200' : 'text-slate-500 dark:text-slate-300'}`}
            >
              {item}
            </button>
          ))}
        </div>

        {mode === 'login' ? (
          <form onSubmit={handleLogin}>
            <h2 className="mt-6 text-2xl font-black">Login</h2>
            <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">Use a demo account or your registered account.</p>

            <label className="mt-6 block">
              <span className="text-sm font-black text-slate-600 dark:text-slate-300">Email</span>
              <span className="mt-2 flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-950">
                <Mail size={18} className="text-teal-500" />
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(event) => setLoginForm((current) => ({ ...current, email: event.target.value }))}
                  className="min-w-0 flex-1 bg-transparent font-semibold outline-none"
                  required
                />
              </span>
            </label>

            <label className="mt-4 block">
              <span className="text-sm font-black text-slate-600 dark:text-slate-300">Password</span>
              <span className="mt-2 flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-950">
                <LockKeyhole size={18} className="text-teal-500" />
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
                  className="min-w-0 flex-1 bg-transparent font-semibold outline-none"
                  required
                />
              </span>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-teal-500/20 transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <LogIn size={18} />
              {submitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <h2 className="mt-6 text-2xl font-black">Register</h2>
            <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">Create a user or pharmacy account for this prototype.</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="text-sm font-black text-slate-600 dark:text-slate-300">Account type</span>
                <select
                  value={registerForm.role}
                  onChange={(event) => setRegisterForm((current) => ({ ...current, role: event.target.value }))}
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 font-semibold outline-none dark:border-slate-700 dark:bg-slate-950"
                >
                  <option value="user">User</option>
                  <option value="pharmacy">Pharmacy</option>
                </select>
              </label>

              <label>
                <span className="text-sm font-black text-slate-600 dark:text-slate-300">Name</span>
                <span className="mt-2 flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-950">
                  <User size={18} className="text-teal-500" />
                  <input
                    type="text"
                    value={registerForm.name}
                    onChange={(event) => setRegisterForm((current) => ({ ...current, name: event.target.value }))}
                    className="min-w-0 flex-1 bg-transparent font-semibold outline-none"
                    required
                  />
                </span>
              </label>

              <label>
                <span className="text-sm font-black text-slate-600 dark:text-slate-300">Locality</span>
                <span className="mt-2 flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-950">
                  <MapPin size={18} className="text-teal-500" />
                  <input
                    type="text"
                    value={registerForm.locality}
                    onChange={(event) => setRegisterForm((current) => ({ ...current, locality: event.target.value }))}
                    className="min-w-0 flex-1 bg-transparent font-semibold outline-none"
                    required
                  />
                </span>
              </label>

              <label>
                <span className="text-sm font-black text-slate-600 dark:text-slate-300">Email</span>
                <span className="mt-2 flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-950">
                  <Mail size={18} className="text-teal-500" />
                  <input
                    type="email"
                    value={registerForm.email}
                    onChange={(event) => setRegisterForm((current) => ({ ...current, email: event.target.value }))}
                    className="min-w-0 flex-1 bg-transparent font-semibold outline-none"
                    required
                  />
                </span>
              </label>

              <label>
                <span className="text-sm font-black text-slate-600 dark:text-slate-300">Password</span>
                <span className="mt-2 flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-950">
                  <LockKeyhole size={18} className="text-teal-500" />
                  <input
                    type="password"
                    value={registerForm.password}
                    onChange={(event) => setRegisterForm((current) => ({ ...current, password: event.target.value }))}
                    className="min-w-0 flex-1 bg-transparent font-semibold outline-none"
                    required
                    minLength={6}
                  />
                </span>
              </label>

              {registerForm.role === 'pharmacy' && (
                <>
                  <label>
                    <span className="text-sm font-black text-slate-600 dark:text-slate-300">Pharmacy name</span>
                    <span className="mt-2 flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-950">
                      <Building2 size={18} className="text-teal-500" />
                      <input
                        type="text"
                        value={registerForm.pharmacyName}
                        onChange={(event) => setRegisterForm((current) => ({ ...current, pharmacyName: event.target.value }))}
                        className="min-w-0 flex-1 bg-transparent font-semibold outline-none"
                        required
                      />
                    </span>
                  </label>

                  <label>
                    <span className="text-sm font-black text-slate-600 dark:text-slate-300">Pharmacy contact</span>
                    <span className="mt-2 flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-950">
                      <Phone size={18} className="text-teal-500" />
                      <input
                        type="tel"
                        value={registerForm.pharmacyContact}
                        onChange={(event) => setRegisterForm((current) => ({ ...current, pharmacyContact: event.target.value }))}
                        className="min-w-0 flex-1 bg-transparent font-semibold outline-none"
                      />
                    </span>
                  </label>

                  <label className="sm:col-span-2">
                    <span className="text-sm font-black text-slate-600 dark:text-slate-300">Pharmacy address</span>
                    <input
                      type="text"
                      value={registerForm.pharmacyAddress}
                      onChange={(event) => setRegisterForm((current) => ({ ...current, pharmacyAddress: event.target.value }))}
                      className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 font-semibold outline-none dark:border-slate-700 dark:bg-slate-950"
                      placeholder="Optional, locality is used if blank"
                    />
                  </label>
                </>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-teal-500/20 transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <UserPlus size={18} />
              {submitting ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
