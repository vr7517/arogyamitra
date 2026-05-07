import { AlertTriangle, Edit3, Package, PackagePlus, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import StatsCard from '../components/StatsCard'
import DashboardLayout from '../layouts/DashboardLayout'
import { inventory, medicines } from '../data/dummyData'

export default function PharmacyDashboard() {
  const [items, setItems] = useState(
    inventory
      .filter((item) => item.pharmacyId === 1)
      .map((item) => ({ ...item, medicine: medicines.find((medicine) => medicine.id === item.medicineId) })),
  )
  const lowStock = useMemo(() => items.filter((item) => item.stock <= 12), [items])

  const addMedicine = () => {
    const nextMedicine = medicines[(items.length + 1) % medicines.length]
    setItems((current) => [
      ...current,
      { id: Date.now(), pharmacyId: 1, medicineId: nextMedicine.id, medicine: nextMedicine, stock: 20, price: 55 },
    ])
  }

  return (
    <DashboardLayout title="Pharmacy Panel">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight">City Medicos inventory</h1>
          <p className="mt-2 font-semibold text-slate-500 dark:text-slate-400">Manage medicines, prices, reservations, and low stock alerts.</p>
        </div>
        <button
          type="button"
          onClick={addMedicine}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-teal-500/20"
        >
          <PackagePlus size={18} />
          Add medicine
        </button>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        <StatsCard title="Total SKUs" value={items.length} icon={Package} caption="+4 this week" />
        <StatsCard title="Low stock" value={lowStock.length} icon={AlertTriangle} tone="orange" caption="Needs attention" />
        <StatsCard title="Reservations" value="46" icon={PackagePlus} tone="blue" caption="18 pending pickup" />
      </div>

      {lowStock.length > 0 && (
        <div className="mt-6 rounded-2xl border border-orange-200 bg-orange-50 p-5 dark:border-orange-400/20 dark:bg-orange-400/10">
          <h2 className="flex items-center gap-2 font-black text-orange-700 dark:text-orange-200">
            <AlertTriangle size={20} />
            Low stock alerts
          </h2>
          <p className="mt-2 text-sm font-semibold text-orange-700 dark:text-orange-100">
            {lowStock.map((item) => item.medicine.name).join(', ')} need replenishment today.
          </p>
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
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
                      value={item.stock}
                      onChange={(event) =>
                        setItems((current) =>
                          current.map((entry) => (entry.id === item.id ? { ...entry, stock: Number(event.target.value) } : entry)),
                        )
                      }
                      className="w-24 rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
                    />
                  </td>
                  <td className="px-5 py-4">Rs {item.price}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-black ${item.stock <= 12 ? 'bg-orange-50 text-orange-700 dark:bg-orange-400/10' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10'}`}>
                      {item.stock <= 12 ? 'Low stock' : 'Healthy'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button type="button" className="rounded-xl border border-slate-200 p-2 text-slate-500 dark:border-slate-700" aria-label="Edit medicine">
                        <Edit3 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setItems((current) => current.filter((entry) => entry.id !== item.id))}
                        className="rounded-xl border border-slate-200 p-2 text-rose-500 dark:border-slate-700"
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
    </DashboardLayout>
  )
}
