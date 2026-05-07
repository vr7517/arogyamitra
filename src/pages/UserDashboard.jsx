import { Bell, CalendarCheck, HeartPulse, MapPin, Search, Settings } from 'lucide-react'
import { useMemo, useState } from 'react'
import StatsCard from '../components/StatsCard'
import { medicines, pharmacies } from '../data/dummyData'
import { useApp } from '../hooks/useApp'
import DashboardLayout from '../layouts/DashboardLayout'

const userItems = [
  { id: 'overview', label: 'Overview', icon: HeartPulse },
  { id: 'reservations', label: 'Reservations', icon: CalendarCheck },
  { id: 'nearby', label: 'Nearby', icon: MapPin },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function UserDashboard() {
  const { currentUser, notifications, reservations, updateReservationStatus } = useApp()
  const [activePanel, setActivePanel] = useState('overview')
  const userReservations = useMemo(
    () =>
      reservations
        .filter((reservation) => reservation.userId === currentUser.id)
        .map((reservation) => ({
          ...reservation,
          medicine: medicines.find((medicine) => medicine.id === reservation.medicineId) || { name: reservation.medicineName || 'Medicine' },
          pharmacy: pharmacies.find((pharmacy) => pharmacy.id === reservation.pharmacyId) || { name: reservation.pharmacyName || 'Selected pharmacy' },
        })),
    [currentUser.id, reservations],
  )
  const userNotifications = useMemo(
    () => notifications.filter((notification) => notification.type === 'reservation' || notification.type === 'medicine'),
    [notifications],
  )

  const renderPanel = () => {
    if (activePanel === 'reservations') {
      return (
        <>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Reservations</h1>
            <p className="mt-2 font-semibold text-slate-500 dark:text-slate-400">Track pickups and confirmed medicine holds.</p>
          </div>
          <div className="mt-6 grid gap-4">
            {userReservations.map((reservation) => (
              <div key={reservation.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="text-lg font-black">{reservation.medicine.name}</h2>
                    <p className="mt-1 text-sm font-bold text-slate-500">{reservation.pharmacy.name} - Qty {reservation.quantity}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`w-fit rounded-full px-3 py-1 text-xs font-black ${
                      reservation.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200'
                        : reservation.status === 'Cancelled'
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-400/10 dark:text-rose-200'
                          : 'bg-teal-50 text-teal-700 dark:bg-teal-400/10 dark:text-teal-200'
                    }`}>
                      {reservation.status}
                    </span>
                    {reservation.status !== 'Completed' && reservation.status !== 'Cancelled' && (
                      <button
                        type="button"
                        onClick={() => updateReservationStatus(reservation.id, 'Completed')}
                        className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-black text-white"
                      >
                        I got medicine
                      </button>
                    )}
                  </div>
                </div>
                <p className="mt-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Placed: {reservation.placedAt}</p>
                {reservation.status === 'Completed' && (
                  <p className="mt-2 text-sm font-semibold text-emerald-600 dark:text-emerald-300">
                    Completed. You can reserve this medicine again if needed.
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      )
    }

    if (activePanel === 'nearby') {
      return (
        <>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Nearby pharmacies</h1>
            <p className="mt-2 font-semibold text-slate-500 dark:text-slate-400">Quick access to trusted pharmacies near {currentUser.locality}.</p>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {pharmacies.map((pharmacy) => (
              <div key={pharmacy.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-black">{pharmacy.name}</h2>
                    <p className="mt-1 text-sm font-bold text-slate-500">{pharmacy.address}</p>
                  </div>
                  <span className="text-sm font-black text-teal-600 dark:text-teal-300">{pharmacy.distanceKm} km</span>
                </div>
                <p className="mt-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Open until {pharmacy.openUntil} - {pharmacy.deliveryTime}</p>
              </div>
            ))}
          </div>
        </>
      )
    }

    if (activePanel === 'alerts') {
      return (
        <>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Medicine alerts</h1>
            <p className="mt-2 font-semibold text-slate-500 dark:text-slate-400">Live reservation confirmations and medicine updates.</p>
          </div>
          <div className="mt-6 grid gap-3">
            {userNotifications.length === 0 ? (
              <div className="rounded-lg border border-slate-200 bg-white px-4 py-8 text-center text-sm font-bold text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                No live notifications yet.
              </div>
            ) : (
              userNotifications.map((notification) => (
                <div key={notification.id} className="rounded-lg border border-slate-200 bg-white px-4 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-black">{notification.title}</p>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{notification.createdAt}</span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">{notification.message}</p>
                </div>
              ))
            )}
          </div>
        </>
      )
    }

    if (activePanel === 'settings') {
      return (
        <>
          <div>
            <h1 className="text-3xl font-black tracking-tight">User settings</h1>
            <p className="mt-2 font-semibold text-slate-500 dark:text-slate-400">Preference controls for the demo user panel.</p>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {['WhatsApp pickup reminders', 'Low price alerts', 'Emergency medicine updates', 'Nearby stock notifications'].map((setting) => (
              <label key={setting} className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-5 text-sm font-black shadow-sm dark:border-slate-800 dark:bg-slate-900">
                {setting}
                <input type="checkbox" defaultChecked className="h-5 w-5 accent-teal-600" />
              </label>
            ))}
          </div>
        </>
      )
    }

    return (
      <>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Welcome, {currentUser.name}</h1>
          <p className="mt-2 font-semibold text-slate-500 dark:text-slate-400">Your medicine reservations, local pharmacies, and alerts in one panel.</p>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          <StatsCard title="Active reservations" value={userReservations.filter((item) => item.status !== 'Completed').length} icon={CalendarCheck} caption="Needs pickup" />
          <StatsCard title="Nearby pharmacies" value={pharmacies.length} icon={MapPin} tone="blue" caption={currentUser.locality} />
          <StatsCard title="Saved searches" value="8" icon={Search} tone="orange" caption="This month" />
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-black">Next pickup</h2>
            {userReservations[0] ? (
              <>
                <p className="mt-3 text-2xl font-black">{userReservations[0].medicine.name}</p>
                <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                  {userReservations[0].pharmacy.name} - {userReservations[0].status}
                </p>
              </>
            ) : (
              <p className="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-400">No active reservation yet.</p>
            )}
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-black">Recommended action</h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-slate-500 dark:text-slate-400">
              Check availability before leaving home and reserve urgent medicines from the nearest verified pharmacy.
            </p>
          </div>
        </div>
      </>
    )
  }

  return (
    <DashboardLayout title="User Panel" items={userItems} activeItem={activePanel} onItemChange={setActivePanel}>
      {renderPanel()}
    </DashboardLayout>
  )
}
