import { Search } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { medicines } from '../data/dummyData'

export default function SearchBar({ initialValue = '', onSearch, compact = false }) {
  const [query, setQuery] = useState(initialValue)
  const navigate = useNavigate()
  const suggestions = medicines
    .filter((medicine) => medicine.name.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 4)

  const submit = (event) => {
    event.preventDefault()
    if (onSearch) {
      onSearch(query)
      return
    }
    navigate(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <div className="relative w-full">
      <form
        onSubmit={submit}
        className={`flex w-full flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-2 text-slate-950 shadow-xl shadow-slate-200/70 sm:flex-row dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/20 ${
          compact ? 'shadow-sm' : ''
        }`}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-white px-3 dark:bg-slate-900">
          <Search className="shrink-0 text-teal-500" size={22} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search Paracetamol, Dolo, ORS..."
            className="h-12 min-w-0 w-full bg-white text-base font-semibold text-slate-950 outline-none placeholder:text-slate-500 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400"
          />
        </div>
        <button
          type="submit"
          className="rounded-2xl bg-gradient-to-r from-orange-500 via-rose-500 to-teal-500 px-7 py-3 text-sm font-black text-white shadow-lg shadow-rose-500/20 transition hover:-translate-y-0.5"
        >
          Find medicine
        </button>
      </form>

      {query && suggestions.length > 0 && !compact && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-2xl border border-slate-200 bg-white p-2 text-left text-slate-950 shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
          {suggestions.map((medicine) => (
            <button
              key={medicine.id}
              type="button"
              onClick={() => setQuery(medicine.name)}
              className="block w-full rounded-xl px-4 py-3 text-left text-sm font-bold text-slate-800 hover:bg-teal-50 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              {medicine.name}
              <span className="ml-2 text-xs font-semibold text-slate-500 dark:text-slate-400">{medicine.category}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
