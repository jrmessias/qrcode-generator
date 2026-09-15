import { useEffect, useReducer, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
// import { Toggle } from '../../components/Toggle'
import { CustomizePanel } from './CustomizePanel'
import { QrActions } from './QrActions'
import { QrForm } from './QrForm'
import { QrPreview } from './QrPreview'
import { QrTypeTabs } from './QrTypeTabs'
import { TemplateRail } from './TemplateRail'
import { ENCODERS, TEMPLATES, TYPE_ORDER, contrastRatio, initialValues, validate } from './schemas'
import type { QrDesign, QrType, Values } from './types'
import { useQrCode } from './useQrCode'

type State = {
  type: QrType
  values: Record<QrType, Values>
  design: QrDesign
}

type Action =
  | { kind: 'type'; type: QrType }
  | { kind: 'field'; key: string; value: string }
  | { kind: 'design'; design: QrDesign }

const initial: State = {
  type: 'url',
  values: Object.fromEntries(TYPE_ORDER.map((t) => [t, initialValues(t)])) as Record<QrType, Values>,
  design: TEMPLATES[0],
}

function reducer(state: State, action: Action): State {
  switch (action.kind) {
    case 'type':
      // o conteúdo de cada tipo fica guardado, então trocar de aba nunca descarta nada
      return { ...state, type: action.type }
    case 'field':
      return {
        ...state,
        values: {
          ...state.values,
          [state.type]: { ...state.values[state.type], [action.key]: action.value },
        },
      }
    case 'design':
      return { ...state, design: action.design }
  }
}

export function QrStudio() {
  const [state, dispatch] = useReducer(reducer, initial)
  // rastreamento de scans só existe com QR dinâmico, previsto para a fase 2:
  // const [track, setTrack] = useState(false)
  // const [trackNote, setTrackNote] = useState('')

  const raw = ENCODERS[state.type](state.values[state.type])
  const [payload, setPayload] = useState(raw)

  // preview só acompanha a digitação depois de 300 ms parado
  useEffect(() => {
    const id = setTimeout(() => setPayload(raw), 300)
    return () => clearTimeout(id)
  }, [raw])

  const error = validate(state.type, payload)
  const { holder, download, copy } = useQrCode(error ? '' : payload, state.design)
  const lowContrast =
    contrastRatio(state.design.fg, state.design.bg) < 3
      ? 'Contraste abaixo de 3:1 — o código pode não ser lido.'
      : undefined

  return (
    <div className="mt-7 grid gap-7 rounded-3xl border border-panel-line bg-panel p-5 text-panel-ink lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.9fr)]">
      <div className="min-w-0">
        <QrTypeTabs value={state.type} onChange={(type) => dispatch({ kind: 'type', type })} />

        <AnimatePresence mode="wait">
          <motion.div
            key={state.type}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <QrForm
              type={state.type}
              values={state.values[state.type]}
              onChange={(key, value) => dispatch({ kind: 'field', key, value })}
            />
          </motion.div>
        </AnimatePresence>

        {/* <div className="mt-5 flex flex-wrap gap-6 border-t border-panel-line pt-4.5">
          <Toggle
            checked={track}
            onChange={() => {
              setTrack(false)
              setTrackNote('Rastreamento exige QR dinâmico — previsto para a fase 2.')
            }}
          >
            Rastrear escaneamentos
          </Toggle>
        </div>
        {trackNote && <p className="mt-2 text-xs text-signal">{trackNote}</p>} */}
      </div>

      <div className="flex min-w-0 flex-col items-center gap-3.5">
        <QrPreview
          holder={holder}
          payload={payload}
          error={error}
          rail={<TemplateRail value={state.design} onChange={(design) => dispatch({ kind: 'design', design })} />}
        />

        <QrActions
          disabled={Boolean(error)}
          onDownload={(extension) => download(extension, `qrcode-${state.type}`)}
          onCopyImage={copy}
        />

        <CustomizePanel
          value={state.design}
          onChange={(design) => dispatch({ kind: 'design', design })}
          warning={lowContrast}
        />
      </div>
    </div>
  )
}
