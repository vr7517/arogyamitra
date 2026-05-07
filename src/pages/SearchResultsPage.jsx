import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import FilterPanel from '../components/FilterPanel'
import LoadingSkeleton from '../components/LoadingSkeleton'
import PharmacyCard from '../components/PharmacyCard'
import SearchBar from '../components/SearchBar'
import { useMedicineSearch } from '../hooks/useMedicineSearch'

export default function SearchResultsPage() {
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') || '')
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ distance: 8, availability: 'all', price: 200 })
  const [sortBy, setSortBy] = useState('distance')
  const results = useMedicineSearch(query, filters, sortBy)

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 550)
    return () => window.clearTimeout(timer)
  }, [query, filters, sortBy])

  const handleSearch = (value) => {
    setQuery(value)
    setParams(value ? { q: value } : {})
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-2xl bg-gradient-to-r from-slate-950 to-teal-800 p-6 text-white shadow-xl dark:from-slate-900 dark:to-teal-950">
        <h1 className="text-3xl font-black tracking-tight">Search medicine availability</h1>
        <p className="mt-2 font-semibold text-white/75">Filter by distance, stock, price, and pharmacy performance.</p>
        <div className="mt-5 max-w-3xl">
          <SearchBar initialValue={query} onSearch={handleSearch} compact />
        </div>
      </div>

      <div className="mt-7 grid gap-6 lg:grid-cols-[290px_1fr]">
        <FilterPanel filters={filters} setFilters={setFilters} sortBy={sortBy} setSortBy={setSortBy} />
        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-black">{results.length} matching pharmacies</h2>
            <p className="text-sm font-bold text-slate-500">Live dummy inventory</p>
          </div>
          {loading ? (
            <LoadingSkeleton count={6} />
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {results.map((result) => (
                <PharmacyCard key={result.id} result={result} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
