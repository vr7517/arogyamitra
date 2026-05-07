import { AlertTriangle, BarChart3, ClipboardCheck, ClipboardList, Edit3, History, Package, PackagePlus, Settings, Truck, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import StatsCard from '../components/StatsCard'
import DashboardLayout from '../layouts/DashboardLayout'
import { inventory, medicines, users } from '../data/dummyData'
import { useApp } from '../hooks/useApp'

const pharmacyItems = [
  { id: 'overview', label: 'Overview', icon: Package },
  { id: 'reservations', label: 'Reservations', icon: ClipboardCheck },
  { id: 'inventory', label: 'Inventory', icon: ClipboardList },
  { id: 'add', label: 'Add medicine', icon: PackagePlus },
  { id: 'history', label: 'History', icon: History },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
]

const activeReservationStatuses = ['Confirmed', 'Ready to deliver', 'Out for delivery']
const reservationStatusOptions = ['Confirmed', 'Ready to deliver', 'Out for delivery', 'Completed', 'Cancelled']

const initialForm = {
  name: '',
  category: '',
  demand: 'Medium',
  stock: 20,
  price: 50,
}

export default function PharmacyDashboard() {
  const { currentUser, reservations, showToast, updateReservationStatus } = useApp()
  const pharmacyId = currentUser?.pharmacyId || 1
  const pharmacyName = currentUser?.pharmacyName || 'City Medicos'
  const inventoryStorageKey = `arogya-pharmacy-inventory-${pharmacyId}`
  const [activePanel, setActivePanel] = useState('overview')
  const [medicineForm, setMedicineForm] = useState(initialForm)
  const [items, setItems] = useState(() => {
    const savedInventory = localStorage.getItem(inventoryStorageKey) || (pharmacyId === 1 ? localStorage.getItem('arogya-pharmacy-inventory') : null)
    if (savedInventory) {
      try {
        return JSON.parse(savedInventory)
      } catch {
        localStorage.removeItem(inventoryStorageKey)
      }
    }

    return inventory
      .filter((item) => item.pharmacyId === pharmacyId)
      .map((item) => ({ ...item, medicine: medicines.find((medicine) => medicine.id === item.medicineId) }))
  })
  const lowStock = useMemo(() => items.filter((item) => item.stock <= 12), [items])
  const pharmacyReservations = useMemo(
    () =>
      reservations
        .filter((reservation) => reservation.pharmacyId === pharmacyId)
        .map((reservation) => ({
          ...reservation,
          customer: users.find((user) => user.id === reservation.userId),
          medicine: medicines.find((medicine) => medicine.id === reservation.medicineId) || { name: reservation.medicineName || 'Medicine' },
        })),
    [pharmacyId, reservations],
  )
  const activeReservations = useMemo(
    () => pharmacyReservations.filter((reservation) => activeReservationStatuses.includes(reservation.status)),
    [pharmacyReservations],
  )
  const readyReservations = useMemo(
    () => pharmacyReservations.filter((reservation) => reservation.status === 'Ready to deliver' || reservation.status === 'Out for delivery'),
    [pharmacyReservations],
  )
  const reservationHistory = useMemo(
    () => pharmacyReservations.filter((reservation) => !activeReservationStatuses.includes(reservation.status)),
    [pharmacyReservations],
  )

  const saveItems = (nextItems) => {
    localStorage.setItem(inventoryStorageKey, JSON.stringify(nextItems))
    setItems(nextItems)
  }

  const addMedicine = (event) => {
    event.preventDefault()
    const name = medicineForm.name.trim()
    const category = medicineForm.category.trim()
    const stock = Number(medicineForm.stock)
    const price = Number(medicineForm.price)

    if (!name || !category || stock < 0 || price <= 0) {
      showToast('Please enter valid medicine details', 'error')
      return
    }

    const existingItem = items.find((item) => item.medicine.name.toLowerCase() === name.toLowerCase())
    if (existingItem) {
      const nextItems = items.map((item) =>
        item.id === existingItem.id
          ? {
              ...item,
              stock: item.stock + stock,
              price,
              medicine: { ...item.medicine, category, demand: medicineForm.demand },
            }
          : item,
      )
      saveItems(nextItems)
      setMedicineForm(initialForm)
      setActivePanel('inventory')
      showToast(`${name} already existed, so stock was updated`)
      return
    }

    const newMedicine = {
      id: Date.now(),
      name,
      category,
      demand: medicineForm.demand,
    }
    const nextItems = [
      {
        id: Date.now() + 1,
        pharmacyId,
        medicineId: newMedicine.id,
        medicine: newMedicine,
        stock,
        price,
      },
      ...items,
    ]

    saveItems(nextItems)
    setMedicineForm(initialForm)
    setActivePanel('inventory')
    showToast(`${name} added to inventory`)
  }

  const updateItem = (id, patch) => {
    const nextItems = items.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry))
    saveItems(nextItems)
  }

  const deleteItem = (id) => {
    const nextItems = items.filter((entry) => entry.id !== id)
    saveItems(nextItems)
    showToast('Medicine removed from inventory')
  }

  const inventoryTable = (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead className="bg-slate-50 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300">
            <tr>
              <th className="px-5 py-4 font-black">Medicine</th>
              <th className="px-5 py-4 font-black">Category</th>
              <th className="px-5 py-4 font-black">Stock</th>
              <th className="px-5 py-4 font-black">Price</th>
              <th className="px-5 py-4 font-black">Status</th>
              <th className="px-5 py-4 font-black">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((item) => (
              <tr key={item.id} className="text-sm font-bold">
                <td className="px-5 py-4">{item.medicine.name}</td>
                <td className="px-5 py-4 text-slate-500">{item.medicine.category}</td>
                <td className="px-5 py-4">
                  <input
                    type="number"
                    min="0"
                    value={item.stock}
                    onChange={(event) =>
                      updateItem(item.id, { stock: Number(event.target.value) })
                    }
                    className="w-24 rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
                  />
                </td>
                <td className="px-5 py-4">
                  <input
                    type="number"
                    min="1"
                    value={item.price}
                    onChange={(event) => updateItem(item.id, { price: Number(event.target.value) })}
                    className="w-24 rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
                  />
                </td>
                <td className="px-5 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-black ${item.stock <= 12 ? 'bg-orange-50 text-orange-700 dark:bg-orange-400/10' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10'}`}>
                    {item.stock <= 12 ? 'Low stock' : 'Healthy'}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <button type="button" className="rounded-lg border border-slate-200 p-2 text-slate-500 dark:border-slate-700" aria-label="Edit medicine">
                      <Edit3 size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteItem(item.id)}
                      className="rounded-lg border border-slate-200 p-2 text-rose-500 dark:border-slate-700"
                      aria-label="Delete medicine"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const reservationList = (entries, mode = 'active') => (
    <div className="mt-6 grid gap-4">
      {entries.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-8 text-center text-sm font-bold text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          No {mode === 'history' ? 'history records' : 'active reservations'} yet.
        </div>
      ) : (
        entries.map((reservation) => (
          <div key={reservation.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-black">{reservation.medicine.name}</h2>
                  <span className={`rounded-full px-3 py-1 text-xs font-black ${
                    reservation.status === 'Completed'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10'
                      : reservation.status === 'Cancelled'
                        ? 'bg-rose-50 text-rose-700 dark:bg-rose-400/10'
                        : 'bg-teal-50 text-teal-700 dark:bg-teal-400/10'
                  }`}>
                    {reservation.status}
                  </span>
                </div>
                <p className="mt-2 text-sm font-bold text-slate-500 dark:text-slate-400">
                  Customer: {reservation.customer?.name || 'Walk-in user'} - Qty {reservation.quantity}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
                  Reserved: {reservation.placedAt}{reservation.updatedAt ? ` - Updated: ${reservation.updatedAt}` : ''}
                </p>
              </div>

              {mode !== 'history' && (
                <div className="flex flex-col gap-3 sm:min-w-56">
                  <select
                    value={reservation.status}
                    onChange={(event) => updateReservationStatus(reservation.id, event.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-black outline-none dark:border-slate-700 dark:bg-slate-950"
                  >
                    {reservationStatusOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => updateReservationStatus(reservation.id, 'Ready to deliver')}
                      className="rounded-lg bg-teal-600 px-3 py-2 text-xs font-black text-white"
                    >
                      Ready
                    </button>
                    <button
                      type="button"
                      onClick={() => updateReservationStatus(reservation.id, 'Completed')}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-black text-slate-600 dark:border-slate-700 dark:text-slate-300"
                    >
                      Complete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )

  const renderPanel = () => {
    if (activePanel === 'inventory') {
      return (
        <>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Inventory</h1>
            <p className="mt-2 font-semibold text-slate-500 dark:text-slate-400">Update stock counts, review prices, and remove unavailable medicines.</p>
          </div>
          <div className="mt-6">{inventoryTable}</div>
        </>
      )
    }

    if (activePanel === 'reservations') {
      return (
        <>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-black tracking-tight">Reserved medicines</h1>
              <p className="mt-2 font-semibold text-slate-500 dark:text-slate-400">Incoming user reservations, delivery readiness, and status controls.</p>
            </div>
            <div className="rounded-lg bg-teal-50 px-4 py-3 text-sm font-black text-teal-700 dark:bg-teal-400/10 dark:text-teal-200">
              {readyReservations.length} ready to deliver
            </div>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <StatsCard title="Active reserved" value={activeReservations.length} icon={ClipboardCheck} caption="Needs action" />
            <StatsCard title="Ready to deliver" value={readyReservations.length} icon={Truck} tone="blue" caption="Prepared orders" />
            <StatsCard title="Completed history" value={reservationHistory.length} icon={History} tone="orange" caption="Closed records" />
          </div>
          {reservationList(activeReservations)}
        </>
      )
    }

    if (activePanel === 'add') {
      return (
        <>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Add medicine</h1>
            <p className="mt-2 font-semibold text-slate-500 dark:text-slate-400">Create a medicine record with stock, price, category, and demand level.</p>
          </div>
          <div className="mt-6 grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
            <form onSubmit={addMedicine} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="sm:col-span-2">
                  <span className="text-sm font-black text-slate-600 dark:text-slate-300">Medicine name</span>
                  <input
                    type="text"
                    value={medicineForm.name}
                    onChange={(event) => setMedicineForm((current) => ({ ...current, name: event.target.value }))}
                    placeholder="Example: Amoxicillin 500mg"
                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 font-semibold outline-none focus:border-teal-400 dark:border-slate-700 dark:bg-slate-950"
                    required
                  />
                </label>
                <label>
                  <span className="text-sm font-black text-slate-600 dark:text-slate-300">Category</span>
                  <input
                    type="text"
                    value={medicineForm.category}
                    onChange={(event) => setMedicineForm((current) => ({ ...current, category: event.target.value }))}
                    placeholder="Antibiotic"
                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 font-semibold outline-none focus:border-teal-400 dark:border-slate-700 dark:bg-slate-950"
                    required
                  />
                </label>
                <label>
                  <span className="text-sm font-black text-slate-600 dark:text-slate-300">Demand</span>
                  <select
                    value={medicineForm.demand}
                    onChange={(event) => setMedicineForm((current) => ({ ...current, demand: event.target.value }))}
                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 font-semibold outline-none focus:border-teal-400 dark:border-slate-700 dark:bg-slate-950"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </label>
                <label>
                  <span className="text-sm font-black text-slate-600 dark:text-slate-300">Opening stock</span>
                  <input
                    type="number"
                    min="0"
                    value={medicineForm.stock}
                    onChange={(event) => setMedicineForm((current) => ({ ...current, stock: event.target.value }))}
                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 font-semibold outline-none focus:border-teal-400 dark:border-slate-700 dark:bg-slate-950"
                    required
                  />
                </label>
                <label>
                  <span className="text-sm font-black text-slate-600 dark:text-slate-300">Price</span>
                  <input
                    type="number"
                    min="1"
                    value={medicineForm.price}
                    onChange={(event) => setMedicineForm((current) => ({ ...current, price: event.target.value }))}
                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 font-semibold outline-none focus:border-teal-400 dark:border-slate-700 dark:bg-slate-950"
                    required
                  />
                </label>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-teal-500/20"
                >
                  <PackagePlus size={18} />
                  Save medicine
                </button>
                <button
                  type="button"
                  onClick={() => setMedicineForm(initialForm)}
                  className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-black text-slate-600 dark:border-slate-700 dark:text-slate-300"
                >
                  Clear form
                </button>
              </div>
            </form>

            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-xl font-black">Recently added</h2>
              <div className="mt-4 grid gap-3">
                {items.slice(0, 5).map((item) => (
                  <div key={item.id} className="rounded-lg bg-slate-50 px-4 py-3 dark:bg-slate-800">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-black">{item.medicine.name}</span>
                      <span className="text-sm font-black text-teal-600 dark:text-teal-300">Rs {item.price}</span>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
                      {item.medicine.category} • {item.stock} in stock • {item.medicine.demand} demand
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )
    }

    if (activePanel === 'analytics') {
      return (
        <>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Pharmacy analytics</h1>
            <p className="mt-2 font-semibold text-slate-500 dark:text-slate-400">Inventory health and stock attention metrics.</p>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <StatsCard title="Healthy SKUs" value={items.length - lowStock.length} icon={Package} caption="Ready to sell" />
            <StatsCard title="Low stock SKUs" value={lowStock.length} icon={AlertTriangle} tone="orange" caption="Reorder soon" />
            <StatsCard title="Average stock" value={Math.round(items.reduce((sum, item) => sum + item.stock, 0) / items.length || 0)} icon={BarChart3} tone="blue" caption="Units per SKU" />
          </div>
        </>
      )
    }

    if (activePanel === 'history') {
      return (
        <>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Reservation history</h1>
            <p className="mt-2 font-semibold text-slate-500 dark:text-slate-400">Completed and cancelled reservation records for this pharmacy.</p>
          </div>
          {reservationList(reservationHistory, 'history')}
        </>
      )
    }

    if (activePanel === 'settings') {
      return (
        <>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Pharmacy settings</h1>
            <p className="mt-2 font-semibold text-slate-500 dark:text-slate-400">Operational preferences for the demo pharmacy panel.</p>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {['Accept reservations', 'Allow WhatsApp contact', 'Show low stock alerts', 'Emergency pickup enabled'].map((setting) => (
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
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-black tracking-tight">{pharmacyName} inventory</h1>
            <p className="mt-2 font-semibold text-slate-500 dark:text-slate-400">Manage medicines, prices, reservations, and low stock alerts.</p>
          </div>
          <button
            type="button"
            onClick={() => setActivePanel('add')}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-teal-500/20"
          >
            <PackagePlus size={18} />
            Add medicine
          </button>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          <StatsCard title="Total SKUs" value={items.length} icon={Package} caption="+4 this week" />
          <StatsCard title="Low stock" value={lowStock.length} icon={AlertTriangle} tone="orange" caption="Needs attention" />
          <StatsCard title="Reservations" value={activeReservations.length} icon={ClipboardCheck} tone="blue" caption={`${readyReservations.length} ready to deliver`} />
        </div>

        {activeReservations.length > 0 && (
          <div className="mt-6 rounded-lg border border-teal-200 bg-teal-50 p-5 dark:border-teal-400/20 dark:bg-teal-400/10">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="flex items-center gap-2 font-black text-teal-700 dark:text-teal-200">
                  <ClipboardCheck size={20} />
                  {activeReservations.length} reserved medicines need status updates
                </h2>
                <p className="mt-2 text-sm font-semibold text-teal-700 dark:text-teal-100">
                  {readyReservations.length} orders are ready to deliver.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActivePanel('reservations')}
                className="rounded-lg bg-teal-600 px-4 py-3 text-sm font-black text-white"
              >
                Manage reservations
              </button>
            </div>
          </div>
        )}

        {lowStock.length > 0 && (
          <div className="mt-6 rounded-lg border border-orange-200 bg-orange-50 p-5 dark:border-orange-400/20 dark:bg-orange-400/10">
            <h2 className="flex items-center gap-2 font-black text-orange-700 dark:text-orange-200">
              <AlertTriangle size={20} />
              Low stock alerts
            </h2>
            <p className="mt-2 text-sm font-semibold text-orange-700 dark:text-orange-100">
              {lowStock.map((item) => item.medicine.name).join(', ')} need replenishment today.
            </p>
          </div>
        )}

        <div className="mt-6">{inventoryTable}</div>
      </>
    )
  }

  return (
    <DashboardLayout title="Pharmacy Panel" items={pharmacyItems} activeItem={activePanel} onItemChange={setActivePanel}>
      {renderPanel()}
    </DashboardLayout>
  )
}
