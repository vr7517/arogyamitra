import { useMemo } from 'react'
import { getLiveSearchResults } from '../utils/liveData'

export function useMedicineSearch(query, filters, sortBy) {
  return useMemo(() => {
    const normalized = query.trim().toLowerCase()

    const filtered = getLiveSearchResults().filter((item) => {
      const matchesQuery =
        !normalized ||
        item.medicine.toLowerCase().includes(normalized) ||
        item.pharmacy.toLowerCase().includes(normalized) ||
        item.category.toLowerCase().includes(normalized)
      const matchesDistance = item.distanceKm <= Number(filters.distance)
      const matchesAvailability = filters.availability === 'all' || item.available
      const matchesPrice = item.price <= Number(filters.price)

      return matchesQuery && matchesDistance && matchesAvailability && matchesPrice
    })

    return [...filtered].sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'stock') return b.stock - a.stock
      return a.distanceKm - b.distanceKm
    })
  }, [query, filters, sortBy])
}
