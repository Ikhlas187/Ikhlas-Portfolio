import { ChevronsLeftRight, Minus, X } from 'lucide-react'
import { MACOS } from '@/data/macos'
import { useLocale } from '@/lib/LocaleProvider'
import { cn } from '@/lib/utils'

type TrafficLightsProps = {
  isFocused: boolean
  isZoomable: boolean
  onClose: () => void
  onMinimize: () => void
  onZoom: () => void
}

const LIGHT = 'grid size-[13px] cursor-pointer place-items-center rounded-full shadow-(--macos-frame-light-ring)'
const GLYPH = 'size-[8px] text-(--macos-glyph) opacity-0 group-hover/lights:opacity-100'
// Hors focus, les pastilles passent au gris de la ligne de séparation, sauf au survol du groupe.
const IDLE = 'bg-(--macos-frame-line) shadow-[inset_0_0_0_0.5px_var(--macos-frame-line)] group-hover/lights:shadow-(--macos-frame-light-ring)'

// Pastilles du Safari de mihrimatrix/macos-clone-react : 13 px, écart de 8 px, symboles visibles au survol du groupe.
export default function TrafficLights({ isFocused, isZoomable, onClose, onMinimize, onZoom }: TrafficLightsProps) {
  const { locale } = useLocale()
  const labels = MACOS[locale].windowControls
  const idle = !isFocused && IDLE

  return (
    <div className="group/lights flex gap-[8px]">
      <button
        type="button"
        aria-label={labels.close}
        onClick={onClose}
        className={cn(LIGHT, 'bg-(--macos-close)', idle, 'group-hover/lights:bg-(--macos-close)')}
      >
        <X strokeWidth={3.25} className={GLYPH} />
      </button>
      <button
        type="button"
        aria-label={labels.minimize}
        onClick={onMinimize}
        className={cn(LIGHT, 'bg-(--macos-minimize)', idle, 'group-hover/lights:bg-(--macos-minimize)')}
      >
        <Minus strokeWidth={3.25} className={GLYPH} />
      </button>
      <button
        type="button"
        aria-label={labels.zoom}
        onClick={onZoom}
        disabled={!isZoomable}
        className={cn(
          LIGHT,
          'bg-(--macos-zoom)',
          idle,
          'group-hover/lights:bg-(--macos-zoom) disabled:cursor-default disabled:bg-(--macos-frame-line)',
        )}
      >
        <ChevronsLeftRight strokeWidth={3.25} className={cn(GLYPH, 'rotate-45')} />
      </button>
    </div>
  )
}
