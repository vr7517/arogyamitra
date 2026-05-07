import { ExternalLink, MapPin, Navigation } from 'lucide-react'

export default function PharmacyMap({ pharmacy }) {
  const lat = pharmacy.lat
  const lng = pharmacy.lng
  const delta = 0.012
  const bbox = [lng - delta, lat - delta, lng + delta, lat + delta].join(',')
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`
  const openMapUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="relative h-80 bg-slate-100 dark:bg-slate-800">
        <iframe
          title={`${pharmacy.name} map`}
          src={mapUrl}
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className="pointer-events-none absolute left-4 top-4 rounded-2xl bg-white/95 px-4 py-3 shadow-lg dark:bg-slate-950/95">
          <p className="flex items-center gap-2 text-sm font-black">
            <MapPin size={16} className="text-teal-500" />
            {pharmacy.name}
          </p>
          <p className="mt-1 max-w-56 text-xs font-bold text-slate-500 dark:text-slate-400">{pharmacy.address}</p>
        </div>
      </div>

      <div className="grid gap-3 p-4 sm:grid-cols-2">
        <a
          href={directionsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-teal-500/20"
        >
          <Navigation size={17} />
          Directions
        </a>
        <a
          href={openMapUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 dark:border-slate-700 dark:text-slate-200"
        >
          <ExternalLink size={17} />
          Open map
        </a>
      </div>
    </div>
  )
}
