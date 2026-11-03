import type { ReactNode } from 'react'

type PhotoActionButtonProps = { label: string; onClick: () => void; children: ReactNode }

export default function PhotoActionButton({ label, onClick, children }: PhotoActionButtonProps) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className="cursor-pointer p-[8px] text-(--macos-photos-text)">
      {children}
    </button>
  )
}
