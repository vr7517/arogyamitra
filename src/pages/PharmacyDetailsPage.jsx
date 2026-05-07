import { MessageCircle, Phone, ShieldCheck } from 'lucide-react'
import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import MedicineCard from '../components/MedicineCard'
import PharmacyMap from '../components/PharmacyMap'
import { useApp } from '../hooks/useApp'
import { getLiveMedicineListForPharmacy, getLivePharmacyById } from '../utils/liveData'

export default function PharmacyDetailsPage() {
  const { id } = useParams()
  const { currentUser, reservations, reserveMedicine } = useApp()
  const pharmacy = getLivePharmacyById(id)
  const medicineList = useMemo(
    () => getLiveMedicineListForPharmacy(pharmacy.id),
    [pharmacy.id],
  )
  const isReserved = (medicine) =>
    reservations.some(
      (reservation) =>
        reservation.userId === currentUser?.id &&
        reservation.medicineId === medicine.medicineId &&
        reservation.pharmacyId === pharmacy.id &&
        reservation.status !== 'Completed' &&
        reservation.status !== 'Cancelled',
    )
  const firstAvailableMedicine = medicineList.find((item) => item.stock > 0 && !isReserved(item))
  const allAvailableReserved = medicineList.some((item) => item.stock > 0) && !firstAvailableMedicine
  const handleReserve = (medicine) => {
    reserveMedicine({
      medicineId: medicine.medicineId,
      medicineName: medicine.name,
      pharmacyId: pharmacy.id,
      pharmacyName: pharmacy.name,
    })
  }

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
              onClick={() => firstAvailableMedicine && handleReserve(firstAvailableMedicine)}
              disabled={!firstAvailableMedicine}
              className={`rounded-2xl px-4 py-3 font-black shadow-lg disabled:cursor-not-allowed ${
                allAvailableReserved
                  ? 'bg-emerald-50 text-emerald-700 shadow-none dark:bg-emerald-400/10 dark:text-emerald-200'
                  : 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-teal-500/20 disabled:from-slate-300 disabled:to-slate-400'
              }`}
            >
              {allAvailableReserved ? 'Reserved' : 'Reserve Medicine'}
            </button>
          </div>

          <h2 className="mt-8 text-2xl font-black">Available medicines</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {medicineList.map((item) => (
              <MedicineCard key={item.id} item={item} onReserve={handleReserve} reserved={isReserved(item)} />
            ))}
          </div>
        </div>

        <aside className="grid gap-5">
          <PharmacyMap pharmacy={pharmacy} />
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
