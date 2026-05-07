import { useState } from 'react'
import { CheckCircle2, Package, Pill } from 'lucide-react'

const descriptionTemplates = {
  Fever: {
    uses: 'temporary relief of fever and mild to moderate pain, such as headache, body aches, and sore throat.',
    suggestions: [
      'Take with plenty of water.',
      'Use only as directed and avoid exceeding the daily dose.',
      'Rest and stay hydrated while the fever is treated.',
    ],
  },
  Antibiotic: {
    uses: 'treating bacterial infections such as respiratory, skin, or urinary tract infections.',
    suggestions: [
      'Complete the full course even if symptoms improve.',
      'Do not use for viral infections like common colds.',
      'Take with food if it upsets your stomach.',
    ],
  },
  Allergy: {
    uses: 'reducing allergy symptoms such as sneezing, itching, and watery eyes.',
    suggestions: [
      'Avoid allergens whenever possible.',
      'Take at the same time each day for best results.',
      'Consult a doctor if symptoms persist for more than a week.',
    ],
  },
  Hydration: {
    uses: 'restoring fluids and electrolytes lost due to dehydration.',
    suggestions: [
      'Mix with clean water and drink slowly.',
      'Use after vomiting or diarrhea to remain hydrated.',
      'Keep refrigerated for a more soothing drink.',
    ],
  },
  Diabetes: {
    uses: 'helping manage blood sugar levels as part of diabetes treatment.',
    suggestions: [
      'Monitor your blood sugar regularly.',
      'Pair with a healthy diet and regular exercise.',
      'Take at the same time each day for consistency.',
    ],
  },
  Acidity: {
    uses: 'relieving heartburn, acid reflux, and indigestion.',
    suggestions: [
      'Avoid spicy or fatty foods while using it.',
      'Take before meals for better relief.',
      'Don’t lie down immediately after taking it.',
    ],
  },
  Supplement: {
    uses: 'supporting general wellbeing by filling common nutrient gaps.',
    suggestions: [
      'Take with food to improve absorption.',
      'Store in a cool, dry place.',
      'Use regularly for best long-term benefits.',
    ],
  },
}

const generateMedicineDescription = (item) => {
  const template = descriptionTemplates[item.category] || {
    uses: 'supporting common health needs and temporary symptom relief.',
    suggestions: [
      'Read the label carefully before use.',
      'If symptoms worsen, seek professional advice.',
      'Keep out of reach of children.',
    ],
  }

  return {
    description: `${item.name} is commonly used for ${template.uses}`,
    uses: template.uses,
    suggestions: template.suggestions,
  }
}

export default function MedicineCard({ item, onReserve, reserved = false }) {
  const lowStock = item.stock <= 12
  const [aiSummary, setAiSummary] = useState(null)

  const handleGenerateAi = () => {
    setAiSummary((current) => (current ? null : generateMedicineDescription(item)))
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-400/10 dark:text-teal-300">
          <Pill size={21} />
        </span>
        <div>
          <h4 className="font-black text-slate-950 dark:text-white">{item.name}</h4>
          <p className="text-xs font-bold text-slate-500">{item.category}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-sm font-bold text-slate-500">
          <Package size={16} />
          {item.stock} units
        </span>
        <span className={`rounded-full px-3 py-1 text-xs font-black ${lowStock ? 'bg-rose-50 text-rose-600 dark:bg-rose-400/10' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10'}`}>
          {lowStock ? 'Low stock' : 'Available'}
        </span>
      </div>
      <button
        type="button"
        onClick={handleGenerateAi}
        className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-black text-slate-700 transition hover:border-teal-500 hover:text-teal-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-teal-400 dark:hover:text-teal-300"
      >
        {aiSummary ? 'Hide AI summary' : 'Generate AI summary'}
      </button>
      {aiSummary && (
        <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-200">
          <p className="font-black text-slate-950 dark:text-white">AI-generated usage & suggestions</p>
          <p className="mt-3 leading-6">{aiSummary.description}</p>
          <div className="mt-3">
            <p className="font-black text-slate-800 dark:text-slate-100">Uses</p>
            <p className="mt-1 text-slate-600 dark:text-slate-300">{aiSummary.uses}</p>
          </div>
          <div className="mt-3">
            <p className="font-black text-slate-800 dark:text-slate-100">Suggestions</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-600 dark:text-slate-300">
              {aiSummary.suggestions.map((suggestion) => (
                <li key={suggestion}>{suggestion}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {onReserve && (
        <button
          type="button"
          onClick={() => onReserve(item)}
          disabled={item.stock <= 0 || reserved}
          className={`mt-4 w-full rounded-2xl px-4 py-2.5 text-sm font-black shadow-lg disabled:cursor-not-allowed ${
            reserved
              ? 'bg-emerald-50 text-emerald-700 shadow-none dark:bg-emerald-400/10 dark:text-emerald-200'
              : 'bg-teal-600 text-white shadow-teal-500/20 disabled:bg-slate-300'
          }`}
        >
          {reserved ? (
            <span className="inline-flex items-center justify-center gap-2">
              <CheckCircle2 size={16} />
              Reserved
            </span>
          ) : (
            'Reserve'
          )}
        </button>
      )}
    </div>
  )
}
