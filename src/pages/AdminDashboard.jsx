import { BarChart3, Building2, ClipboardList, Search, Settings, ShieldCheck, Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'
import StatsCard from '../components/StatsCard'
import { activityLogs, analytics, pharmacies, users } from '../data/dummyData'
import DashboardLayout from '../layouts/DashboardLayout'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend)

const adminItems = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'pharmacies', label: 'Pharmacies', icon: Building2 },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'activity', label: 'Activity', icon: ClipboardList },
  { id: 'settings', label: 'Settings', icon: Settings },
]

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
  scales: {
    y: { beginAtZero: true, grid: { color: 'rgba(148, 163, 184, 0.16)' } },
    x: { grid: { display: false } },
  },
}

function PanelHeader({ title, description }) {
  return (
    <div>
      <h1 className="text-3xl font-black tracking-tight">{title}</h1>
      <p className="mt-2 font-semibold text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  )
}

export default function AdminDashboard() {
  const [activePanel, setActivePanel] = useState('overview')
  const [managedPharmacies, setManagedPharmacies] = useState(pharmacies)

  const trendData = useMemo(() => ({
    labels: analytics.medicineTrends.labels,
    datasets: [
      {
        data: analytics.medicineTrends.data,
        borderColor: '#14b8a6',
        backgroundColor: 'rgba(20, 184, 166, 0.18)',
        tension: 0.4,
        fill: true,
      },
    ],
  }), [])

  const pharmacyData = useMemo(() => ({
    labels: analytics.pharmacyActivity.labels,
    datasets: [{ data: analytics.pharmacyActivity.data, backgroundColor: ['#14b8a6', '#fb923c', '#f43f5e', '#38bdf8'] }],
  }), [])

  const userData = useMemo(() => ({
    labels: analytics.userAnalytics.labels,
    datasets: [{ data: analytics.userAnalytics.data, backgroundColor: '#0f766e', borderRadius: 12 }],
  }), [])

  const toggleVerification = (id) => {
    setManagedPharmacies((current) =>
      current.map((pharmacy) => (pharmacy.id === id ? { ...pharmacy, verified: !pharmacy.verified } : pharmacy)),
    )
  }

  const renderPanel = () => {
    if (activePanel === 'pharmacies') {
      return (
        <>
          <PanelHeader title="Manage pharmacies" description="Verify pharmacy partners and review operating details." />
          <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead className="bg-slate-50 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                  <tr>
                    <th className="px-5 py-4 font-black">Pharmacy</th>
                    <th className="px-5 py-4 font-black">Contact</th>
                    <th className="px-5 py-4 font-black">Distance</th>
                    <th className="px-5 py-4 font-black">Status</th>
                    <th className="px-5 py-4 font-black">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {managedPharmacies.map((pharmacy) => (
                    <tr key={pharmacy.id} className="text-sm font-bold">
                      <td className="px-5 py-4">
                        <span className="block font-black">{pharmacy.name}</span>
                        <span className="text-slate-500">{pharmacy.address}</span>
                      </td>
                      <td className="px-5 py-4 text-slate-500">{pharmacy.contact}</td>
                      <td className="px-5 py-4">{pharmacy.distanceKm} km</td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-black ${pharmacy.verified ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10' : 'bg-orange-50 text-orange-700 dark:bg-orange-400/10'}`}>
                          {pharmacy.verified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => toggleVerification(pharmacy.id)}
                          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-black text-slate-600 dark:border-slate-700 dark:text-slate-300"
                        >
                          {pharmacy.verified ? 'Mark pending' : 'Verify'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )
    }

    if (activePanel === 'users') {
      return (
        <>
          <PanelHeader title="Manage users" description="Demo account directory and role visibility for the platform." />
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {users.map((user) => (
              <div key={user.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-black">{user.name}</h2>
                    <p className="mt-1 text-sm font-bold text-slate-500">{user.email}</p>
                  </div>
                  <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-black capitalize text-teal-700 dark:bg-teal-400/10 dark:text-teal-200">
                    {user.role}
                  </span>
                </div>
                <p className="mt-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Locality: {user.locality}</p>
              </div>
            ))}
          </div>
        </>
      )
    }

    if (activePanel === 'activity') {
      return (
        <>
          <PanelHeader title="Activity logs" description="Recent operational events from the demo platform." />
          <div className="mt-6 grid gap-3">
            {activityLogs.map((log) => (
              <div key={log} className="rounded-lg border border-slate-200 bg-white px-4 py-4 text-sm font-bold text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                {log}
              </div>
            ))}
          </div>
        </>
      )
    }

    if (activePanel === 'settings') {
      return (
        <>
          <PanelHeader title="Admin settings" description="Prototype governance toggles for pharmacy approval rules." />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {['Require pharmacy verification', 'Enable emergency reservations', 'Notify low stock pharmacies', 'Show public ratings'].map((setting, index) => (
              <label key={setting} className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-5 text-sm font-black shadow-sm dark:border-slate-800 dark:bg-slate-900">
                {setting}
                <input type="checkbox" defaultChecked={index !== 3} className="h-5 w-5 accent-teal-600" />
              </label>
            ))}
          </div>
        </>
      )
    }

    return (
      <>
        <PanelHeader title="ArogyaMitra admin dashboard" description="Platform-wide analytics, pharmacy governance, and activity monitoring." />
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatsCard title="Total users" value={analytics.totals.users.toLocaleString()} icon={Users} caption="+12.4%" />
          <StatsCard title="Pharmacies" value={analytics.totals.pharmacies} icon={Building2} tone="blue" caption="184 verified" />
          <StatsCard title="Medicines" value={analytics.totals.medicines.toLocaleString()} icon={ShieldCheck} tone="orange" caption="Across inventory" />
          <StatsCard title="Searches" value={analytics.totals.searches.toLocaleString()} icon={Search} tone="violet" caption="This month" />
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="flex items-center gap-2 text-xl font-black">
              <BarChart3 size={20} className="text-teal-500" />
              Medicine trends
            </h2>
            <div className="mt-5 h-72">
              <Line data={trendData} options={chartOptions} />
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-black">Pharmacy activity</h2>
            <div className="mt-5 h-72">
              <Doughnut data={pharmacyData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-black">User analytics</h2>
          <div className="mt-5 h-64">
            <Bar data={userData} options={chartOptions} />
          </div>
        </div>
      </>
    )
  }

  return (
    <DashboardLayout title="Admin Panel" items={adminItems} activeItem={activePanel} onItemChange={setActivePanel}>
      {renderPanel()}
    </DashboardLayout>
  )
}
