'use client'

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Calendario Colloqui</h1>
          <p className="text-text-muted text-sm mt-1">Gestisci le disponibilità e i colloqui fissati.</p>
        </div>
      </div>

      <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
        <h2 className="text-xl font-bold text-text-main mb-2">Calendario in Costruzione</h2>
        <p className="text-text-muted max-w-md">L'integrazione del calendario e degli slot verrà implementata in questa sezione.</p>
      </div>
    </div>
  )
}
