type Props = {
  checked: boolean
  onChange: (value: boolean) => void
  children: React.ReactNode
}

export function Toggle({ checked, onChange, children }: Props) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-panel-muted">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span
        aria-hidden="true"
        className="relative h-5 w-9 flex-none rounded-full bg-panel-field transition-colors peer-checked:bg-accent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent after:absolute after:top-[3px] after:left-[3px] after:h-3.5 after:w-3.5 after:rounded-full after:bg-white after:transition-transform after:content-[''] peer-checked:after:translate-x-4"
      />
      {children}
    </label>
  )
}
