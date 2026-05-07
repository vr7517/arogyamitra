import { LayoutDashboard, LogOut, Menu, Pill, Search, UserCircle, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useApp } from '../hooks/useApp'
import DarkModeToggle from './DarkModeToggle'
import NotificationCenter from './NotificationCenter'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Search', to: '/search' },
]

export default function Navbar() {
  const { currentUser, isAuthenticated, logout, role } = useApp()
  const [open, setOpen] = useState(false)
  const dashboardPath = role === 'admin' ? '/dashboard/admin' : role === 'pharmacy' ? '/dashboard/pharmacy' : '/dashboard/user'

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/82">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/25">
            <Pill size={23} />
          </span>
          <span>
            <span className="block text-lg font-black tracking-tight">ArogyaMitra</span>
            <span className="block text-xs font-semibold text-teal-600 dark:text-teal-300">Medicine finder</span>
          </span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-2xl px-4 py-2 text-sm font-bold transition ${
                  isActive
                    ? 'bg-teal-50 text-teal-700 dark:bg-teal-400/10 dark:text-teal-200'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          {isAuthenticated && (
            <NavLink
              to={dashboardPath}
              className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              <LayoutDashboard size={16} />
              Dashboard
            </NavLink>
          )}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <DarkModeToggle />
          {isAuthenticated ? (
            <>
              <NotificationCenter />
              <Link
                to={dashboardPath}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                <UserCircle size={17} className="text-teal-500" />
                {currentUser.name}
              </Link>
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-black text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-950"
              >
                <LogOut size={17} />
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-teal-500/25 transition hover:-translate-y-0.5"
            >
              <Search size={17} />
              Login
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white md:hidden dark:border-slate-800 dark:bg-slate-900"
          aria-label="Open menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden dark:border-slate-800 dark:bg-slate-950">
          <div className="grid gap-2">
            {[...navItems, ...(isAuthenticated ? [{ label: 'Dashboard', to: dashboardPath }] : [{ label: 'Login', to: '/login' }])].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                {item.label}
              </Link>
            ))}
            {isAuthenticated && (
              <>
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                  <span className="text-sm font-black text-slate-700 dark:text-slate-200">Notifications</span>
                  <NotificationCenter />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    logout()
                    setOpen(false)
                  }}
                  className="rounded-2xl bg-slate-900 px-4 py-3 text-left text-sm font-black text-white dark:bg-white dark:text-slate-950"
                >
                  Logout {currentUser.name}
                </button>
              </>
            )}
            <DarkModeToggle />
          </div>
        </div>
      )}
    </header>
  )
}
