import { CheckCircle2, X } from 'lucide-react'
import { useEffect } from 'react'
import { useApp } from '../hooks/useApp'

export default function ToastNotification() {
  const { toast, setToast } = useApp()

  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(null), 3200)
    return () => window.clearTimeout(timer)
  }, [setToast, toast])

  if (!toast) return null

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm rounded-2xl border border-emerald-200 bg-white p-4 shadow-2xl shadow-emerald-950/15 dark:border-emerald-400/20 dark:bg-slate-900">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="mt-0.5 text-emerald-500" size={22} />
        <div className="flex-1">
          <p className="font-black text-slate-950 dark:text-white">Reservation successful</p>
          <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">{toast.message}</p>
        </div>
        <button type="button" onClick={() => setToast(null)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
