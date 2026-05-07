import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import ToastNotification from './components/ToastNotification'
import AdminDashboard from './pages/AdminDashboard'
import HomePage from './pages/HomePage'
import PharmacyDashboard from './pages/PharmacyDashboard'
import PharmacyDetailsPage from './pages/PharmacyDetailsPage'
import SearchResultsPage from './pages/SearchResultsPage'

function App() {
  return (
    <div className="min-h-screen bg-[#f7faf9] text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/pharmacy/:id" element={<PharmacyDetailsPage />} />
          <Route path="/dashboard/pharmacy" element={<PharmacyDashboard />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <ToastNotification />
    </div>
  )
}

export default App
