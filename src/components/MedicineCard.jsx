import { CheckCircle2, Package, Pill } from 'lucide-react'

export default function MedicineCard({ item, onReserve, reserved = false }) {
  const lowStock = item.stock <= 12

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-400/10 dark:text-teal-300">
          <Pill size={21} />
        </span>
        <div>
          <h4 className="font-black text-slate-950 dark:text-white">{item.name}</h4>
          <p className="text-xs font-bold text-slate-500">{item.category}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-sm font-bold text-slate-500">
          <Package size={16} />
          {item.stock} units
        </span>
        <span className={`rounded-full px-3 py-1 text-xs font-black ${lowStock ? 'bg-rose-50 text-rose-600 dark:bg-rose-400/10' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10'}`}>
          {lowStock ? 'Low stock' : 'Available'}
        </span>
      </div>
      {onReserve && (
        <button
          type="button"
          onClick={() => onReserve(item)}
          disabled={item.stock <= 0 || reserved}
          className={`mt-4 w-full rounded-2xl px-4 py-2.5 text-sm font-black shadow-lg disabled:cursor-not-allowed ${
            reserved
              ? 'bg-emerald-50 text-emerald-700 shadow-none dark:bg-emerald-400/10 dark:text-emerald-200'
              : 'bg-teal-600 text-white shadow-teal-500/20 disabled:bg-slate-300'
          }`}
        >
          {reserved ? (
            <span className="inline-flex items-center justify-center gap-2">
              <CheckCircle2 size={16} />
              Reserved
            </span>
          ) : (
            'Reserve'
          )}
        </button>
      )}
    </div>
  )
}
