import { MessageCircle, Navigation, Phone, ShieldCheck } from 'lucide-react'
import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import MedicineCard from '../components/MedicineCard'
import { useApp } from '../hooks/useApp'
import { inventory, medicines, pharmacies } from '../data/dummyData'

export default function PharmacyDetailsPage() {
  const { id } = useParams()
  const { showToast } = useApp()
  const pharmacy = pharmacies.find((item) => item.id === Number(id)) || pharmacies[0]
  const medicineList = useMemo(
    () =>
      inventory
        .filter((item) => item.pharmacyId === pharmacy.id)
        .map((item) => ({ ...item, ...medicines.find((medicine) => medicine.id === item.medicineId) })),
    [pharmacy.id],
  )

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <Link to="/search" className="text-sm font-black text-teal-600 dark:text-teal-300">Back to search</Link>
          <div className="mt-5 flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-4xl font-black tracking-tight">{pharmacy.name}</h1>
                {pharmacy.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-3 py-1 text-xs font-black text-teal-700 dark:bg-teal-400/10 dark:text-teal-200">
                    <ShieldCheck size={14} />
                    Verified
                  </span>
                )}
              </div>
              <p className="mt-3 max-w-2xl font-semibold leading-7 text-slate-500 dark:text-slate-400">{pharmacy.address}</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200">
              Open until {pharmacy.openUntil}
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <a href={`tel:${pharmacy.contact}`} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 font-black dark:border-slate-700">
              <Phone size={18} />
              Call
            </a>
            <a href={`https://wa.me/${pharmacy.whatsapp.replace(/\D/g, '')}`} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 font-black dark:border-slate-700">
              <MessageCircle size={18} />
              WhatsApp
            </a>
            <button
              type="button"
              onClick={() => showToast(`Medicine reserved at ${pharmacy.name}`)}
              className="rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 px-4 py-3 font-black text-white shadow-lg shadow-teal-500/20"
            >
              Reserve Medicine
            </button>
          </div>

          <h2 className="mt-8 text-2xl font-black">Available medicines</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {medicineList.map((item) => (
              <MedicineCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        <aside className="grid gap-5">
          <div className="relative min-h-80 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
            <div className="absolute inset-0 soft-grid" />
            <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-xl">
                <Navigation size={28} />
              </span>
              <p className="mt-4 text-lg font-black">Map placeholder</p>
              <p className="mt-1 text-sm font-semibold text-slate-500">API ready for Google Maps integration</p>
            </div>
          </div>
          <div className="rounded-2xl border border-rose-100 bg-rose-50 p-5 dark:border-rose-400/20 dark:bg-rose-400/10">
            <h3 className="font-black text-rose-700 dark:text-rose-200">Emergency highlight</h3>
            <p className="mt-2 text-sm font-semibold leading-6 text-rose-600 dark:text-rose-100">
              This view can prioritize nearest 24x7 pharmacies and high-stock essential medicines during emergencies.
            </p>
          </div>
        </aside>
      </div>
    </section>
  )
}
