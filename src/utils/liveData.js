import { inventory, medicines, pharmacies } from '../data/dummyData'

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

const normalizeInventoryItem = (item) => {
  const medicine = item.medicine || medicines.find((entry) => entry.id === item.medicineId) || {
    id: item.medicineId,
    name: item.medicineName || 'Medicine',
    category: item.category || 'General',
    demand: item.demand || 'Medium',
  }

  return {
    ...item,
    medicineId: item.medicineId || medicine.id,
    medicine,
  }
}

export const getLivePharmacies = () => {
  const registeredPharmacies = readStorageList('arogya-registered-users')
    .filter((user) => user.role === 'pharmacy')
    .map((user, index) => ({
      id: user.pharmacyId,
      name: user.pharmacyName || user.name,
      address: user.pharmacyAddress || user.locality,
      contact: user.pharmacyContact || '+91 90000 00000',
      whatsapp: user.pharmacyContact || '+91 90000 00000',
      distanceKm: 2.4 + index,
      rating: 4.2,
      deliveryTime: '25 min',
      openUntil: '10:00 PM',
      verified: false,
      lat: 28.6329 + index * 0.01,
      lng: 77.2195 + index * 0.01,
    }))

  return [...pharmacies, ...registeredPharmacies]
}

export const getLivePharmacyById = (id) => getLivePharmacies().find((pharmacy) => pharmacy.id === Number(id)) || pharmacies[0]

export const getLiveInventoryForPharmacy = (pharmacyId) => {
  const storageKey = `arogya-pharmacy-inventory-${pharmacyId}`
  const savedInventory = readStorageList(storageKey, null)
  const legacyInventory = pharmacyId === 1 ? readStorageList('arogya-pharmacy-inventory', null) : null

  if (savedInventory || legacyInventory) {
    return (savedInventory || legacyInventory).map(normalizeInventoryItem)
  }

  return inventory
    .filter((item) => item.pharmacyId === pharmacyId)
    .map(normalizeInventoryItem)
}

export const getLiveMedicineListForPharmacy = (pharmacyId) =>
  getLiveInventoryForPharmacy(pharmacyId).map((item) => ({
    ...item,
    ...item.medicine,
  }))

export const getLiveSearchResults = () =>
  getLivePharmacies().flatMap((pharmacy) =>
    getLiveInventoryForPharmacy(pharmacy.id).map((item) => ({
      id: `${pharmacy.id}-${item.id}`,
      inventoryId: item.id,
      pharmacyId: pharmacy.id,
      medicineId: item.medicineId,
      medicine: item.medicine.name,
      category: item.medicine.category,
      demand: item.medicine.demand,
      pharmacy: pharmacy.name,
      address: pharmacy.address,
      distanceKm: pharmacy.distanceKm,
      rating: pharmacy.rating,
      deliveryTime: pharmacy.deliveryTime,
      stock: item.stock,
      price: item.price,
      available: item.stock > 0,
    })),
  )
