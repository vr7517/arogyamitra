import DashboardSidebar from '../components/DashboardSidebar'

export default function DashboardLayout({ title, children }) {
  return (
    <div className="flex">
      <DashboardSidebar title={title} />
      <section className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </section>
    </div>
  )
}
