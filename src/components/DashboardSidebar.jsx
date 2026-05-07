import { BarChart3, ClipboardList, Home, PackagePlus, Settings, Users } from 'lucide-react'

const defaultDashboardItems = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'inventory', label: 'Inventory', icon: ClipboardList },
  { id: 'add', label: 'Add medicine', icon: PackagePlus },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function DashboardSidebar({ title = 'Dashboard', items = defaultDashboardItems, activeItem = 'overview', onItemChange }) {
  return (
    <aside className="hidden min-h-[calc(100vh-76px)] w-72 shrink-0 border-r border-slate-200 bg-white p-5 lg:block dark:border-slate-800 dark:bg-slate-950">
      <h2 className="px-3 text-xl font-black">{title}</h2>
      <div className="mt-6 grid gap-2">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeItem === item.id
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onItemChange?.(item.id)}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-black transition ${
                isActive
                  ? 'bg-teal-50 text-teal-700 dark:bg-teal-400/10 dark:text-teal-200'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900'
              }`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          )
        })}
      </div>
    </aside>
  )
}
