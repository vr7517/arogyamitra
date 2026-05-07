export default function LoadingSkeleton({ count = 3 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="skeleton-shimmer h-6 w-2/3 rounded-full" />
          <div className="mt-4 grid gap-3">
            <div className="skeleton-shimmer h-10 rounded-2xl" />
            <div className="skeleton-shimmer h-10 rounded-2xl" />
            <div className="skeleton-shimmer h-12 rounded-2xl" />
          </div>
        </div>
      ))}
    </div>
  )
}
