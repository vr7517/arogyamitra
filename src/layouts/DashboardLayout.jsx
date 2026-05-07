import DashboardSidebar from '../components/DashboardSidebar'

export default function DashboardLayout({ title, items, activeItem, onItemChange, children }) {
  return (
    <div className="flex">
      <DashboardSidebar title={title} items={items} activeItem={activeItem} onItemChange={onItemChange} />
      <section className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {items?.length > 0 && (
          <div className="mb-5 flex gap-2 overflow-x-auto lg:hidden">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onItemChange?.(item.id)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-black ${
                  activeItem === item.id
                    ? 'bg-teal-600 text-white'
                    : 'border border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
        <div className="mx-auto max-w-7xl">{children}</div>
      </section>
    </div>
  )
}
