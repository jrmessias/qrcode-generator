import { TYPES } from './schemas'
import type { QrType, Values } from './types'

type Props = {
  type: QrType
  values: Values
  onChange: (key: string, value: string) => void
}

const inputClass =
  'w-full rounded-xl border border-panel-line bg-panel-field px-3.5 py-3 text-[15px] text-panel-ink transition-colors placeholder:text-panel-muted focus:border-accent focus:outline-none'

export function QrForm({ type, values, onChange }: Props) {
  const config = TYPES[type]

  if (config.deferred) {
    return (
      <div>
        <h2 className="mb-4 font-display text-xl font-bold">{config.title}</h2>
        <div className="flex items-start gap-3 rounded-xl border border-dashed border-panel-line p-4 text-sm text-panel-muted">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 h-4.5 w-4.5 flex-none">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v5M12 16h.01" strokeLinecap="round" />
          </svg>
          <p>
            <b className="font-semibold text-panel-ink">Disponível na fase 2.</b> {config.deferred}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="mb-4 font-display text-xl font-bold">{config.title}</h2>
      <div className="grid gap-x-3.5 sm:grid-cols-2">
        {config.fields.map((field) => (
          <div
            key={field.key}
            className={`mb-3.5 flex flex-col gap-1.5 ${field.half ? '' : 'sm:col-span-2'}`}
          >
            <label htmlFor={`f-${field.key}`} className="text-xs font-semibold text-panel-muted">
              {field.label}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                id={`f-${field.key}`}
                className={`${inputClass} min-h-26 resize-y`}
                placeholder={field.placeholder}
                value={values[field.key] ?? ''}
                onChange={(e) => onChange(field.key, e.target.value)}
              />
            ) : (
              <input
                id={`f-${field.key}`}
                type={field.type ?? 'text'}
                className={inputClass}
                placeholder={field.placeholder}
                value={values[field.key] ?? ''}
                onChange={(e) => onChange(field.key, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
