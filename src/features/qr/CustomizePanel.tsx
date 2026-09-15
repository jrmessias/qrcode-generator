import type { DotStyle, QrDesign } from './types'

const STYLES: { value: DotStyle; label: string }[] = [
  { value: 'square', label: 'Clássico' },
  { value: 'rounded', label: 'Arredondado' },
  { value: 'dots', label: 'Círculos' },
  { value: 'classy', label: 'Elegante' },
  { value: 'extra-rounded', label: 'Suave' },
]

type Props = {
  value: QrDesign
  onChange: (design: QrDesign) => void
  warning?: string
}

export function CustomizePanel({ value, onChange, warning }: Props) {
  const color = (key: 'fg' | 'eye' | 'bg', label: string) => (
    <span className="flex items-center gap-2 text-xs text-panel-muted">
      <label htmlFor={`cz-${key}`}>{label}</label>
      <input
        id={`cz-${key}`}
        type="color"
        value={value[key]}
        onChange={(e) => onChange({ ...value, [key]: e.target.value })}
        className="h-8 w-8 cursor-pointer rounded-lg border border-panel-line bg-transparent p-0"
      />
    </span>
  )

  return (
    <div className="w-full border-t border-panel-line pt-4">
      <div className="flex flex-wrap items-center justify-center gap-3.5">
        <span className="flex items-center gap-2 text-xs text-panel-muted">
          <label htmlFor="cz-style">Estilo</label>
          <select
            id="cz-style"
            value={value.style}
            onChange={(e) => onChange({ ...value, style: e.target.value as DotStyle })}
            className="rounded-lg border border-panel-line bg-panel-field px-2.5 py-1.5 text-[13px] text-panel-ink"
          >
            {STYLES.map((style) => (
              <option key={style.value} value={style.value}>
                {style.label}
              </option>
            ))}
          </select>
        </span>
        {color('fg', 'Pixels')}
        {color('eye', 'Olhos')}
        {color('bg', 'Fundo')}
      </div>
      {warning && <p className="mt-3 text-center text-xs text-signal">{warning}</p>}
    </div>
  )
}
