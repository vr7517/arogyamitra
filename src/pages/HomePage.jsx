import { Ambulance, BadgeIndianRupee, Clock3, MapPin, ShieldPlus, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import PharmacyCard from '../components/PharmacyCard'
import SearchBar from '../components/SearchBar'
import { getLivePharmacies, getLiveSearchResults } from '../utils/liveData'

const features = [
  { title: 'Live stock view', icon: ShieldPlus, text: 'Check quantity, price, and pharmacy status before leaving home.' },
  { title: 'Fast local discovery', icon: MapPin, text: 'Distance-aware pharmacy cards tuned for urgent purchase decisions.' },
  { title: 'Reserve in seconds', icon: Clock3, text: 'Hold medicines with a quick toast confirmation and clear next action.' },
  { title: 'Price comparison', icon: BadgeIndianRupee, text: 'Compare nearby offers for the same medicine in one screen.' },
]

export default function HomePage() {
  const livePharmacies = getLivePharmacies()
  const quickResults = getLiveSearchResults()
    .filter((result) => result.available)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 3)
  const nearest = [...livePharmacies].sort((a, b) => a.distanceKm - b.distanceKm)[0]

  return (
    <>
      <section className="soft-grid relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-16">
          <div className="flex flex-col justify-center">
            <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-black text-orange-600 dark:bg-orange-400/10 dark:text-orange-200">
              <Sparkles size={16} />
              Smart medicine availability near you
            </span>
            <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl dark:text-white">
              Find medicines nearby before the prescription clock starts ticking.
            </h1>
            <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-slate-600 dark:text-slate-300">
              Search availability, compare prices, and reserve essential medicines from trusted pharmacies in your locality.
            </p>
            <div className="mt-8 max-w-3xl">
              <SearchBar />
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to="/search?q=Paracetamol"
                className="inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-rose-500/25 transition hover:-translate-y-0.5"
              >
                <Ambulance size={18} />
                Emergency near me
              </Link>
              <span className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                <MapPin size={18} className="text-teal-500" />
                Nearest: {nearest.name} at {nearest.distanceKm} km
              </span>
            </div>
          </div>

          <div className="relative min-h-[440px] overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500 via-emerald-500 to-sky-500 p-6 text-white shadow-2xl shadow-teal-950/20">
            <div className="absolute inset-x-10 top-8 h-28 rounded-full bg-white/20 blur-3xl" />
            <div className="relative grid h-full content-between">
              <div className="rounded-2xl bg-white/16 p-5 backdrop-blur-md">
                <p className="text-sm font-black uppercase tracking-wider text-white/75">Healthcare cockpit</p>
                <h2 className="mt-3 text-3xl font-black">24x7 verified pharmacy network</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {['120 strips', '12 min ETA', 'Rs 38 best price', '4.9 rating'].map((item) => (
                  <div key={item} className="rounded-2xl bg-white p-5 text-slate-950 shadow-xl">
                    <p className="text-2xl font-black">{item}</p>
                    <p className="mt-1 text-xs font-bold text-slate-500">Live demo metric</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-3xl font-black tracking-tight">Nearby pharmacy picks</h2>
            <p className="mt-2 font-semibold text-slate-500 dark:text-slate-400">Fast, available, and ready for reservation.</p>
          </div>
          <Link to="/search" className="text-sm font-black text-teal-600 dark:text-teal-300">View all results</Link>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {quickResults.map((result) => (
            <PharmacyCard key={result.id} result={result} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-400/10 dark:text-teal-300">
                  <Icon size={22} />
                </span>
                <h3 className="mt-5 text-lg font-black">{feature.title}</h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-500 dark:text-slate-400">{feature.text}</p>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}
