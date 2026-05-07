import { BarChart3, Building2, ClipboardList, Pill, Search, Users } from 'lucide-react'
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

export default function AdminDashboard() {
  const trendData = {
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
  }

  const pharmacyData = {
    labels: analytics.pharmacyActivity.labels,
    datasets: [{ data: analytics.pharmacyActivity.data, backgroundColor: ['#14b8a6', '#fb923c', '#f43f5e', '#38bdf8'] }],
  }

  const userData = {
    labels: analytics.userAnalytics.labels,
    datasets: [{ data: analytics.userAnalytics.data, backgroundColor: '#0f766e', borderRadius: 12 }],
  }

  return (
    <DashboardLayout title="Admin Panel">
      <div>
        <h1 className="text-3xl font-black tracking-tight">ArogyaMitra admin dashboard</h1>
        <p className="mt-2 font-semibold text-slate-500 dark:text-slate-400">Platform-wide analytics, pharmacy governance, and activity monitoring.</p>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Total users" value={analytics.totals.users.toLocaleString()} icon={Users} caption="+12.4%" />
        <StatsCard title="Pharmacies" value={analytics.totals.pharmacies} icon={Building2} tone="blue" caption="184 verified" />
        <StatsCard title="Medicines" value={analytics.totals.medicines.toLocaleString()} icon={Pill} tone="orange" caption="Across inventory" />
        <StatsCard title="Searches" value={analytics.totals.searches.toLocaleString()} icon={Search} tone="violet" caption="This month" />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="flex items-center gap-2 text-xl font-black">
            <BarChart3 size={20} className="text-teal-500" />
            Medicine trends
          </h2>
          <div className="mt-5 h-72">
            <Line data={trendData} options={chartOptions} />
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-black">Pharmacy activity</h2>
          <div className="mt-5 h-72">
            <Doughnut data={pharmacyData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-black">User analytics</h2>
          <div className="mt-5 h-64">
            <Bar data={userData} options={chartOptions} />
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="flex items-center gap-2 text-xl font-black">
            <ClipboardList size={20} className="text-orange-500" />
            Activity logs
          </h2>
          <div className="mt-5 grid gap-3">
            {activityLogs.map((log) => (
              <div key={log} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {log}
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-black text-slate-500">Manage pharmacies</h3>
              <p className="mt-2 text-sm font-semibold">{pharmacies.map((pharmacy) => pharmacy.name).join(', ')}</p>
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-500">Manage users</h3>
              <p className="mt-2 text-sm font-semibold">{users.map((user) => user.name).join(', ')}</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
