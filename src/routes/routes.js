export const routes = [
  { path: '/', label: 'Home' },
  { path: '/search', label: 'Search' },
  { path: '/dashboard/user', label: 'User Dashboard', roles: ['user', 'admin'] },
  { path: '/dashboard/pharmacy', label: 'Pharmacy Dashboard', roles: ['pharmacy', 'admin'] },
  { path: '/dashboard/admin', label: 'Admin Dashboard', roles: ['admin'] },
]
