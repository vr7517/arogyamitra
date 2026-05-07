export default function StatsCard({ title, value, icon: Icon, tone = 'teal', caption }) {
  const tones = {
    teal: 'from-teal-500 to-emerald-500 shadow-teal-500/20',
    orange: 'from-orange-500 to-rose-500 shadow-orange-500/20',
    blue: 'from-sky-500 to-blue-600 shadow-sky-500/20',
    violet: 'from-violet-500 to-fuchsia-500 shadow-violet-500/20',
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{title}</p>
          <h3 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">{value}</h3>
          {caption && <p className="mt-2 text-xs font-bold text-emerald-600 dark:text-emerald-300">{caption}</p>}
        </div>
        <span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg ${tones[tone]}`}>
          <Icon size={22} />
        </span>
      </div>
    </div>
  )
}
