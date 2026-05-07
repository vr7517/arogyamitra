export default function FilterPanel({ filters, setFilters, sortBy, setSortBy }) {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-lg font-black">Filters</h2>
      <div className="mt-5 grid gap-5">
        <label className="grid gap-2">
          <span className="text-sm font-bold text-slate-500">Distance up to {filters.distance} km</span>
          <input
            type="range"
            min="1"
            max="8"
            value={filters.distance}
            onChange={(event) => setFilters((current) => ({ ...current, distance: event.target.value }))}
            className="accent-teal-500"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-bold text-slate-500">Max price Rs {filters.price}</span>
          <input
            type="range"
            min="20"
            max="200"
            value={filters.price}
            onChange={(event) => setFilters((current) => ({ ...current, price: event.target.value }))}
            className="accent-teal-500"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-bold text-slate-500">Availability</span>
          <select
            value={filters.availability}
            onChange={(event) => setFilters((current) => ({ ...current, availability: event.target.value }))}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-bold outline-none dark:border-slate-700 dark:bg-slate-950"
          >
            <option value="all">All pharmacies</option>
            <option value="available">In stock only</option>
          </select>
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-bold text-slate-500">Sort by</span>
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-bold outline-none dark:border-slate-700 dark:bg-slate-950"
          >
            <option value="distance">Nearest</option>
            <option value="price">Lowest price</option>
            <option value="rating">Top rated</option>
            <option value="stock">Highest stock</option>
          </select>
        </label>
      </div>
    </aside>
  )
}
