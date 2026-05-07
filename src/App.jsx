import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import ToastNotification from './components/ToastNotification'
import AdminDashboard from './pages/AdminDashboard'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import PharmacyDashboard from './pages/PharmacyDashboard'
import PharmacyDetailsPage from './pages/PharmacyDetailsPage'
import SearchResultsPage from './pages/SearchResultsPage'
import UserDashboard from './pages/UserDashboard'

function App() {
  return (
    <div className="min-h-screen bg-[#f7faf9] text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/pharmacy/:id" element={<PharmacyDetailsPage />} />
          <Route
            path="/dashboard/user"
            element={
              <ProtectedRoute roles={['user', 'admin']}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/pharmacy"
            element={
              <ProtectedRoute roles={['pharmacy', 'admin']}>
                <PharmacyDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <ToastNotification />
    </div>
  )
}

export default App
