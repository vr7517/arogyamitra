export const users = [
  { id: 1, name: 'Aarav Sharma', email: 'user@arogyamitra.test', password: 'user123', role: 'user', locality: 'Sector 21' },
  { id: 2, name: 'City Medicos Owner', email: 'pharmacy@arogyamitra.test', password: 'pharmacy123', role: 'pharmacy', locality: 'MG Road', pharmacyId: 1 },
  { id: 3, name: 'ArogyaMitra Admin', email: 'admin@arogyamitra.test', password: 'admin123', role: 'admin', locality: 'Operations' },
]

export const reservations = [
  { id: 1, userId: 1, medicineId: 1, pharmacyId: 1, status: 'Ready for pickup', quantity: 2, placedAt: 'Today, 10:30 AM' },
  { id: 2, userId: 1, medicineId: 4, pharmacyId: 4, status: 'Confirmed', quantity: 4, placedAt: 'Yesterday, 7:15 PM' },
  { id: 3, userId: 1, medicineId: 3, pharmacyId: 2, status: 'Completed', quantity: 1, placedAt: 'Apr 28, 6:05 PM' },
]

export const medicines = [
  { id: 1, name: 'Paracetamol 500mg', category: 'Fever', demand: 'High' },
  { id: 2, name: 'Azithromycin 250mg', category: 'Antibiotic', demand: 'Medium' },
  { id: 3, name: 'Cetirizine 10mg', category: 'Allergy', demand: 'High' },
  { id: 4, name: 'ORS Sachet', category: 'Hydration', demand: 'High' },
  { id: 5, name: 'Metformin 500mg', category: 'Diabetes', demand: 'Medium' },
  { id: 6, name: 'Pantoprazole 40mg', category: 'Acidity', demand: 'Medium' },
  { id: 7, name: 'Dolo 650', category: 'Fever', demand: 'High' },
  { id: 8, name: 'Vitamin D3', category: 'Supplement', demand: 'Low' },
]

export const pharmacies = [
  {
    id: 1,
    name: 'City Medicos',
    address: '12 MG Road, Civil Lines',
    contact: '+91 98765 43010',
    whatsapp: '+91 98765 43010',
    distanceKm: 1.2,
    rating: 4.8,
    deliveryTime: '18 min',
    openUntil: '11:30 PM',
    verified: true,
    lat: 28.6329,
    lng: 77.2195,
  },
  {
    id: 2,
    name: 'Apollo Care Pharmacy',
    address: 'Near Metro Gate 2, Sector 21',
    contact: '+91 98765 43011',
    whatsapp: '+91 98765 43011',
    distanceKm: 2.1,
    rating: 4.6,
    deliveryTime: '24 min',
    openUntil: '10:00 PM',
    verified: true,
    lat: 28.5908,
    lng: 77.0806,
  },
  {
    id: 3,
    name: 'Wellness Plus',
    address: 'Shop 8, Green Market',
    contact: '+91 98765 43012',
    whatsapp: '+91 98765 43012',
    distanceKm: 3.6,
    rating: 4.4,
    deliveryTime: '32 min',
    openUntil: '9:45 PM',
    verified: false,
    lat: 28.5577,
    lng: 77.2088,
  },
  {
    id: 4,
    name: 'LifeLine 24x7',
    address: 'Hospital Road, Block C',
    contact: '+91 98765 43013',
    whatsapp: '+91 98765 43013',
    distanceKm: 0.8,
    rating: 4.9,
    deliveryTime: '12 min',
    openUntil: '24 hours',
    verified: true,
    lat: 28.6448,
    lng: 77.2167,
  },
]

export const inventory = [
  { id: 1, pharmacyId: 1, medicineId: 1, stock: 84, price: 38 },
  { id: 2, pharmacyId: 1, medicineId: 2, stock: 12, price: 118 },
  { id: 3, pharmacyId: 1, medicineId: 3, stock: 34, price: 24 },
  { id: 4, pharmacyId: 1, medicineId: 4, stock: 9, price: 18 },
  { id: 5, pharmacyId: 2, medicineId: 1, stock: 45, price: 42 },
  { id: 6, pharmacyId: 2, medicineId: 5, stock: 30, price: 58 },
  { id: 7, pharmacyId: 2, medicineId: 6, stock: 18, price: 74 },
  { id: 8, pharmacyId: 3, medicineId: 3, stock: 0, price: 22 },
  { id: 9, pharmacyId: 3, medicineId: 7, stock: 16, price: 36 },
  { id: 10, pharmacyId: 3, medicineId: 8, stock: 6, price: 165 },
  { id: 11, pharmacyId: 4, medicineId: 1, stock: 120, price: 40 },
  { id: 12, pharmacyId: 4, medicineId: 4, stock: 52, price: 20 },
  { id: 13, pharmacyId: 4, medicineId: 7, stock: 74, price: 39 },
  { id: 14, pharmacyId: 4, medicineId: 6, stock: 11, price: 70 },
]

export const activityLogs = [
  'LifeLine 24x7 accepted 8 emergency reservations',
  'City Medicos updated Azithromycin stock',
  'Apollo Care Pharmacy completed verification',
  '165 searches for fever medicines today',
]

export const analytics = {
  totals: { users: 12840, pharmacies: 284, medicines: 1520, searches: 45600 },
  medicineTrends: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    data: [120, 190, 170, 240, 310, 280, 360],
  },
  pharmacyActivity: {
    labels: ['Verified', 'Pending', 'Low Stock', '24x7'],
    data: [184, 48, 32, 20],
  },
  userAnalytics: {
    labels: ['Search', 'Reserve', 'Call', 'WhatsApp'],
    data: [4200, 980, 740, 560],
  },
}

export const getSearchResults = () =>
  inventory.map((item) => {
    const medicine = medicines.find((entry) => entry.id === item.medicineId)
    const pharmacy = pharmacies.find((entry) => entry.id === item.pharmacyId)

    return {
      ...item,
      medicine: medicine.name,
      category: medicine.category,
      demand: medicine.demand,
      pharmacy: pharmacy.name,
      address: pharmacy.address,
      distanceKm: pharmacy.distanceKm,
      rating: pharmacy.rating,
      deliveryTime: pharmacy.deliveryTime,
      pharmacyId: pharmacy.id,
      available: item.stock > 0,
    }
  })
