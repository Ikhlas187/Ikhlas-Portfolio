import { Maximize2, Minus, X } from 'lucide-react'
import { MACOS } from '@/data/macos'
import { useLocale } from '@/lib/LocaleProvider'
import { cn } from '@/lib/utils'

type TrafficLightsProps = {
  isFocused: boolean
  canZoom: boolean
  onClose: () => void
  onMinimize: () => void
  onZoom: () => void
}

const LIGHT =
  'flex size-[12px] cursor-pointer items-center justify-center rounded-full border border-(--macos-separator)'

// Pastilles rouge / jaune / verte : grises hors focus, symboles visibles au survol du groupe.
export default function TrafficLights({ isFocused, canZoom, onClose, onMinimize, onZoom }: TrafficLightsProps) {
  const { locale } = useLocale()
  const labels = MACOS[locale].windowControls
  const idle = !isFocused && 'bg-(--macos-pressed)'

  return (
    <div className="group/lights flex items-center gap-[8px]">
      <button
        type="button"
        aria-label={labels.close}
        onClick={onClose}
        className={cn(LIGHT, 'bg-(--macos-close)', idle, 'group-hover/lights:bg-(--macos-close)')}
      >
        <X strokeWidth={3} className="size-[8px] text-(--macos-glyph) opacity-0 group-hover/lights:opacity-100" />
      </button>
      <button
        type="button"
        aria-label={labels.minimize}
        onClick={onMinimize}
        className={cn(LIGHT, 'bg-(--macos-minimize)', idle, 'group-hover/lights:bg-(--macos-minimize)')}
      >
        <Minus strokeWidth={3} className="size-[8px] text-(--macos-glyph) opacity-0 group-hover/lights:opacity-100" />
      </button>
      <button
        type="button"
        aria-label={labels.zoom}
        onClick={onZoom}
        disabled={!canZoom}
        className={cn(
          LIGHT,
          'bg-(--macos-zoom)',
          idle,
          'group-hover/lights:bg-(--macos-zoom) disabled:cursor-default disabled:bg-(--macos-pressed)',
        )}
      >
        <Maximize2
          strokeWidth={3}
          className="size-[7px] text-(--macos-glyph) opacity-0 group-hover/lights:opacity-100"
        />
      </button>
    </div>
  )
}
