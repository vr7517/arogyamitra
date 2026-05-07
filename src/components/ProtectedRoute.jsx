import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useApp } from '../hooks/useApp'

export default function ProtectedRoute({ children, roles = [] }) {
  const { currentUser, isAuthenticated, showToast } = useApp()
  const location = useLocation()
  const hasAccess = roles.length === 0 || roles.includes(currentUser?.role)

  useEffect(() => {
    if (isAuthenticated && !hasAccess) {
      showToast('You do not have access to that dashboard', 'error')
    }
  }, [hasAccess, isAuthenticated, showToast])

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!hasAccess) {
    return <Navigate to="/dashboard/user" replace />
  }

  return children
}
