import { motion } from 'motion/react'
import { TYPE_ICONS } from './icons'
import { TYPES, TYPE_ORDER } from './schemas'
import type { QrType } from './types'

type Props = {
  value: QrType
  onChange: (type: QrType) => void
}

export function QrTypeTabs({ value, onChange }: Props) {
  const move = (index: number, dir: 1 | -1) => {
    const next = (index + dir + TYPE_ORDER.length) % TYPE_ORDER.length
    const el = document.getElementById(`tab-${TYPE_ORDER[next]}`)
    el?.focus()
  }

  return (
    <div
      role="tablist"
      aria-label="Tipo de QR Code"
      className="no-bar mb-5 flex gap-1 overflow-x-auto border-b border-panel-line pb-2.5"
    >
      {TYPE_ORDER.map((type, i) => {
        const selected = type === value
        return (
          <button
            key={type}
            id={`tab-${type}`}
            role="tab"
            type="button"
            aria-selected={selected}
            aria-label={TYPES[type].label}
            onClick={() => onChange(type)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') move(i, 1)
              if (e.key === 'ArrowLeft') move(i, -1)
            }}
            className={`relative min-h-11 rounded-lg px-3 py-2 text-[11px] font-semibold whitespace-nowrap transition-colors ${
              selected ? 'text-accent' : 'text-panel-muted hover:text-panel-ink'
            }`}
          >
            {selected && (
              <motion.span
                layoutId="tab-indicator"
                className="absolute inset-0 rounded-lg bg-accent-soft"
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              />
            )}
            <span className="relative flex flex-col items-center gap-1">
              <span className="[&>svg]:h-[18px] [&>svg]:w-[18px]">{TYPE_ICONS[type]}</span>
              {TYPES[type].label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
