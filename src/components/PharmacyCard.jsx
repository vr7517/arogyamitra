import { CheckCircle2, Clock, IndianRupee, MapPin, ShieldCheck, Star } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../hooks/useApp'

export default function PharmacyCard({ result }) {
  const { currentUser, isAuthenticated, reservations, reserveMedicine } = useApp()
  const location = useLocation()
  const navigate = useNavigate()
  const isReserved = reservations.some(
    (reservation) =>
      reservation.userId === currentUser?.id &&
      reservation.medicineId === result.medicineId &&
      reservation.pharmacyId === result.pharmacyId &&
      reservation.status !== 'Completed' &&
      reservation.status !== 'Cancelled',
  )

  return (
    <article className="card-hover rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-black text-slate-950 dark:text-white">{result.pharmacy}</h3>
            {result.available && (
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                In stock
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{result.medicine}</p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm font-black text-amber-700 dark:bg-amber-400/10 dark:text-amber-200">
          <Star size={15} fill="currentColor" />
          {result.rating}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <span className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <MapPin size={16} className="text-teal-500" />
          {result.distanceKm} km
        </span>
        <span className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <Clock size={16} className="text-orange-500" />
          {result.deliveryTime}
        </span>
        <span className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <IndianRupee size={16} className="text-emerald-500" />
          {result.price}
        </span>
        <span className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <ShieldCheck size={16} className="text-blue-500" />
          {result.stock} strips
        </span>
      </div>

      <div className="mt-5 flex gap-3">
        <Link
          to={`/pharmacy/${result.pharmacyId}`}
          className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-black text-slate-700 transition hover:border-teal-300 hover:text-teal-700 dark:border-slate-700 dark:text-slate-200"
        >
          Details
        </Link>
        <button
          type="button"
          onClick={() => {
            if (!isAuthenticated) {
              navigate('/login', { state: { from: location } })
              return
            }
            reserveMedicine({
              medicineId: result.medicineId,
              medicineName: result.medicine,
              pharmacyId: result.pharmacyId,
              pharmacyName: result.pharmacy,
            })
          }}
          disabled={!result.available || isReserved}
          className={`flex-1 rounded-2xl px-4 py-3 text-sm font-black shadow-lg transition disabled:cursor-not-allowed ${
            isReserved
              ? 'bg-emerald-50 text-emerald-700 shadow-none dark:bg-emerald-400/10 dark:text-emerald-200'
              : 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-teal-500/20 hover:-translate-y-0.5 disabled:from-slate-300 disabled:to-slate-400'
          }`}
        >
          {isReserved ? (
            <span className="inline-flex items-center justify-center gap-2">
              <CheckCircle2 size={16} />
              Reserved
            </span>
          ) : (
            'Reserve'
          )}
        </button>
      </div>
    </article>
  )
}
