import { useEffect, useMemo, useState } from 'react'
import { users } from '../data/dummyData'
import { AppContext } from './appContextObject'

export function AppProvider({ children }) {
  const [role, setRole] = useState(() => localStorage.getItem('arogya-role') || 'user')
  const [theme, setTheme] = useState(() => localStorage.getItem('arogya-theme') || 'light')
  const [toast, setToast] = useState(null)

  useEffect(() => {
    localStorage.setItem('arogya-role', role)
  }, [role])

  useEffect(() => {
    localStorage.setItem('arogya-theme', theme)
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const currentUser = useMemo(() => users.find((user) => user.role === role) || users[0], [role])

  const showToast = (message, type = 'success') => {
    setToast({ id: Date.now(), message, type })
  }

  const value = useMemo(
    () => ({
      currentUser,
      role,
      setRole,
      theme,
      setTheme,
      toast,
      setToast,
      showToast,
    }),
    [currentUser, role, theme, toast],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
