import type { LucideIcon } from 'lucide-react'

type ControlCenterSliderProps = {
  icon: LucideIcon
  label: string
  value: number
  onChange: (value: number) => void
}

// Pas le Slider de shadcn : son getBoundingClientRect est faussé quand le bureau est affiché en CSS 3D sur le MacBook.
export default function ControlCenterSlider({ icon: Icon, label, value, onChange }: ControlCenterSliderProps) {
  const percent = Math.round(value * 100)

  return (
    <div className="flex flex-col gap-[7px] rounded-[14px] bg-(--macos-cc-tile) px-[12px] pt-[9px] pb-[11px]">
      <p className="text-[12px] font-semibold">{label}</p>
      <div className="relative h-[22px] overflow-hidden rounded-full bg-(--macos-cc-track)">
        <div className="absolute inset-y-0 left-0 rounded-full bg-(--macos-cc-fill)" style={{ width: `max(22px, ${percent}%)` }} />
        <Icon
          aria-hidden="true"
          strokeWidth={2.2}
          className="pointer-events-none absolute top-1/2 left-[5px] size-[13px] -translate-y-1/2 text-(--macos-cc-slider-glyph)"
        />
        <input
          type="range"
          min={0}
          max={100}
          value={percent}
          aria-label={label}
          onChange={(event) => onChange(Number(event.target.value) / 100)}
          className="absolute inset-0 size-full cursor-pointer opacity-0"
        />
      </div>
    </div>
  )
}
