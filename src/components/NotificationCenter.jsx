import { Bell, CheckCheck, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export default function NotificationCenter() {
  const {
    notifications,
    unreadNotifications,
    markNotificationsRead,
    clearNotifications,
  } = useApp()
  const [open, setOpen] = useState(false)

  const toggleOpen = () => {
    setOpen((value) => !value)
    if (!open) {
      markNotificationsRead()
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggleOpen}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
        aria-label="Open notifications"
      >
        <Bell size={18} />
        {unreadNotifications > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[11px] font-black text-white">
            {unreadNotifications}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/15 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 dark:border-slate-800">
            <div>
              <h2 className="font-black">Notifications</h2>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{notifications.length} recent updates</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={markNotificationsRead}
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900"
                aria-label="Mark all read"
              >
                <CheckCheck size={16} />
              </button>
              <button
                type="button"
                onClick={clearNotifications}
                className="rounded-full p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-400/10"
                aria-label="Clear notifications"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto p-2">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
                No notifications yet.
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`rounded-2xl px-4 py-3 ${notification.read ? 'text-slate-600 dark:text-slate-300' : 'bg-teal-50 text-slate-950 dark:bg-teal-400/10 dark:text-white'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-black">{notification.title}</p>
                    <span className="shrink-0 text-xs font-bold text-slate-500 dark:text-slate-400">{notification.createdAt}</span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">{notification.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
