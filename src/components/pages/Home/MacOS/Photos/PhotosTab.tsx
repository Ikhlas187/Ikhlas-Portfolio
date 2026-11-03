import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type PhotosTabProps = { label: string; isActive: boolean; Icon: LucideIcon; onClick: () => void }

export default function PhotosTab({ label, isActive, Icon, onClick }: PhotosTabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={cn(
        'flex cursor-pointer flex-col items-center gap-[2px]',
        isActive ? 'text-(--macos-photos-text)' : 'text-(--macos-photos-text-40)',
      )}
    >
      <Icon strokeWidth={1.8} className="size-[22px]" />
      <span className="text-[11px] font-medium">{label}</span>
    </button>
  )
}
