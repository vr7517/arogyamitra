import { useCallback, useEffect, useMemo, useState } from 'react'
import { reservations as seedReservations, users } from '../data/dummyData'
import { AppContext } from './appContextObject'

const readStorageList = (key, fallback = []) => {
  const savedValue = localStorage.getItem(key)
  if (!savedValue) return fallback

  try {
    return JSON.parse(savedValue)
  } catch {
    localStorage.removeItem(key)
    return fallback
  }
}

export function AppProvider({ children }) {
  const [registeredUsers, setRegisteredUsers] = useState(() => readStorageList('arogya-registered-users'))
  const allUsers = useMemo(() => [...users, ...registeredUsers], [registeredUsers])
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUserId = Number(localStorage.getItem('arogya-user-id'))
    return [...users, ...readStorageList('arogya-registered-users')].find((user) => user.id === savedUserId) || null
  })
  const [theme, setTheme] = useState(() => localStorage.getItem('arogya-theme') || 'light')
  const [toast, setToast] = useState(null)
  const [reservations, setReservations] = useState(() => {
    const savedReservations = localStorage.getItem('arogya-reservations')
    if (savedReservations) {
      try {
        return JSON.parse(savedReservations)
      } catch {
        localStorage.removeItem('arogya-reservations')
      }
    }
    return seedReservations
  })
  const [notifications, setNotifications] = useState(() => {
    const savedNotifications = localStorage.getItem('arogya-notifications')
    if (savedNotifications) {
      try {
        return JSON.parse(savedNotifications)
      } catch {
        localStorage.removeItem('arogya-notifications')
      }
    }
    return []
  })

  useEffect(() => {
    localStorage.setItem('arogya-registered-users', JSON.stringify(registeredUsers))
  }, [registeredUsers])

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('arogya-user-id', String(currentUser.id))
      return
    }
    localStorage.removeItem('arogya-user-id')
  }, [currentUser])

  useEffect(() => {
    localStorage.setItem('arogya-theme', theme)
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    localStorage.setItem('arogya-reservations', JSON.stringify(reservations))
  }, [reservations])

  useEffect(() => {
    localStorage.setItem('arogya-notifications', JSON.stringify(notifications))
  }, [notifications])

  const role = currentUser?.role || 'guest'

  const showToast = useCallback((message, type = 'success') => {
    setToast({ id: Date.now(), message, type })
  }, [])

  const login = useCallback(({ email, password }) => {
    const user = allUsers.find(
      (entry) => entry.email.toLowerCase() === email.trim().toLowerCase() && entry.password === password,
    )

    if (!user) {
      showToast('Invalid email or password', 'error')
      return { ok: false, message: 'Invalid email or password' }
    }

    setCurrentUser(user)
    showToast(`Welcome back, ${user.name}`)
    return { ok: true, user }
  }, [allUsers, showToast])

  const register = useCallback((form) => {
    const email = form.email.trim().toLowerCase()
    const name = form.name.trim()
    const password = form.password
    const locality = form.locality.trim()
    const role = form.role === 'pharmacy' ? 'pharmacy' : 'user'

    if (!name || !email || !password || !locality) {
      showToast('Please complete all required fields', 'error')
      return { ok: false }
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error')
      return { ok: false }
    }

    if (allUsers.some((user) => user.email.toLowerCase() === email)) {
      showToast('An account with this email already exists', 'error')
      return { ok: false }
    }

    if (role === 'pharmacy' && !form.pharmacyName.trim()) {
      showToast('Please enter pharmacy name', 'error')
      return { ok: false }
    }

    const nextUser = {
      id: Date.now(),
      name,
      email,
      password,
      role,
      locality,
      ...(role === 'pharmacy'
        ? {
            pharmacyId: Date.now() + 1,
            pharmacyName: form.pharmacyName.trim(),
            pharmacyAddress: form.pharmacyAddress.trim() || locality,
            pharmacyContact: form.pharmacyContact.trim(),
          }
        : {}),
    }

    setRegisteredUsers((current) => [...current, nextUser])
    setCurrentUser(nextUser)
    showToast(`Account created for ${name}`)
    return { ok: true, user: nextUser }
  }, [allUsers, showToast])

  const logout = useCallback(() => {
    setCurrentUser(null)
    showToast('Logged out successfully')
  }, [showToast])

  const addNotification = useCallback((notification) => {
    const nextNotification = {
      id: Date.now(),
      title: notification.title,
      message: notification.message,
      type: notification.type || 'reservation',
      read: false,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setNotifications((current) => [nextNotification, ...current].slice(0, 20))
    return nextNotification
  }, [])

  const reserveMedicine = useCallback((reservation) => {
    if (!currentUser) {
      showToast('Please login to reserve medicine', 'error')
      return { ok: false }
    }

    const medicineName = reservation.medicineName || reservation.medicine || 'Medicine'
    const pharmacyName = reservation.pharmacyName || reservation.pharmacy || 'selected pharmacy'
    const nextReservation = {
      id: Date.now(),
      userId: currentUser.id,
      medicineId: reservation.medicineId,
      pharmacyId: reservation.pharmacyId,
      medicineName,
      pharmacyName,
      quantity: reservation.quantity || 1,
      status: 'Confirmed',
      placedAt: 'Just now',
    }

    setReservations((current) => [nextReservation, ...current])
    addNotification({
      title: 'Reservation confirmed',
      message: `${medicineName} reserved at ${pharmacyName}`,
      type: 'reservation',
    })
    showToast(`${medicineName} reserved at ${pharmacyName}`)
    return { ok: true, reservation: nextReservation }
  }, [addNotification, currentUser, showToast])

  const updateReservationStatus = useCallback((reservationId, status) => {
    let updatedReservation

    setReservations((current) =>
      current.map((reservation) => {
        if (reservation.id !== reservationId) return reservation

        updatedReservation = {
          ...reservation,
          status,
          updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
        return updatedReservation
      }),
    )

    if (updatedReservation) {
      addNotification({
        title: 'Reservation status updated',
        message: `${updatedReservation.medicineName || 'Medicine'} is now ${status.toLowerCase()}`,
        type: 'reservation',
      })
      showToast(`Reservation marked ${status}`)
    }
  }, [addNotification, showToast])

  const markNotificationsRead = useCallback(() => {
    setNotifications((current) => current.map((notification) => ({ ...notification, read: true })))
  }, [])

  const clearNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  const value = useMemo(
    () => ({
      currentUser,
      role,
      login,
      register,
      logout,
      isAuthenticated: Boolean(currentUser),
      theme,
      setTheme,
      toast,
      setToast,
      showToast,
      reservations,
      notifications,
      unreadNotifications: notifications.filter((notification) => !notification.read).length,
      reserveMedicine,
      updateReservationStatus,
      addNotification,
      markNotificationsRead,
      clearNotifications,
    }),
    [
      currentUser,
      login,
      register,
      logout,
      role,
      theme,
      toast,
      showToast,
      reservations,
      notifications,
      reserveMedicine,
      updateReservationStatus,
      addNotification,
      markNotificationsRead,
      clearNotifications,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
