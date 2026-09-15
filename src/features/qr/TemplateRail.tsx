import { TEMPLATES } from './schemas'
import type { QrDesign } from './types'

type Props = {
  value: QrDesign
  onChange: (design: QrDesign) => void
}

const same = (a: QrDesign, b: QrDesign) =>
  a.fg === b.fg && a.eye === b.eye && a.bg === b.bg && a.style === b.style

export function TemplateRail({ value, onChange }: Props) {
  return (
    <div
      className="no-bar flex w-full min-w-0 justify-center gap-2 overflow-x-auto sm:grid sm:w-auto sm:grid-cols-2 sm:overflow-x-visible"
      aria-label="Modelos"
    >
      {TEMPLATES.map((template, i) => (
        <button
          key={i}
          type="button"
          aria-pressed={same(template, value)}
          aria-label={`Modelo ${i + 1}`}
          onClick={() => onChange(template)}
          className={`grid h-11 w-11 flex-none place-items-center rounded-xl border bg-panel-field transition-transform hover:-translate-y-px ${
            same(template, value) ? 'border-accent ring-2 ring-accent/40' : 'border-panel-line'
          }`}
        >
          <span
            className="block h-5 w-5 rounded"
            style={{
              background: template.fg,
              boxShadow: `inset 0 0 0 3px ${template.bg}, 0 0 0 1px ${template.eye}`,
            }}
          />
        </button>
      ))}
    </div>
  )
}
