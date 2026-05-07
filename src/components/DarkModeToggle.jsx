import { Moon, Sun } from 'lucide-react'
import { useApp } from '../hooks/useApp'

export default function DarkModeToggle() {
  const { theme, setTheme } = useApp()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
