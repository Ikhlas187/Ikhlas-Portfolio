import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type ControlCenterToggleProps = {
  icon: LucideIcon
  label: string
  status?: string
  isOn: boolean
  onToggle: () => void
}

// Ligne du centre de contrôle : pastille ronde (bleue quand activée), nom et état en dessous.
export default function ControlCenterToggle({ icon: Icon, label, status, isOn, onToggle }: ControlCenterToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isOn}
      onClick={onToggle}
      className="flex w-full cursor-pointer items-center gap-[9px] rounded-[10px] text-left outline-none focus-visible:ring-2 focus-visible:ring-(--macos-cc-icon-on)"
    >
      <span
        className={cn(
          'flex size-[28px] shrink-0 items-center justify-center rounded-full transition-colors duration-200',
          isOn ? 'bg-(--macos-cc-icon-on) text-(--macos-cc-icon-glyph-on)' : 'bg-(--macos-cc-icon-off) text-(--macos-cc-text)',
        )}
      >
        <Icon strokeWidth={2.2} className="size-[15px]" />
      </span>
      <span className="flex min-w-0 flex-col leading-[1.2]">
        <span className="truncate text-[12px] font-semibold">{label}</span>
        {status && <span className="truncate text-[11px] text-(--macos-cc-text-muted)">{status}</span>}
      </span>
    </button>
  )
}
