import { ChevronLeft } from 'lucide-react'

type NotesBackButtonProps = { label: string; onClick: () => void }

export default function NotesBackButton({ label, onClick }: NotesBackButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex cursor-pointer items-center gap-[2px] text-[15px] font-medium text-(--macos-notes-tint)"
    >
      <ChevronLeft strokeWidth={2.2} className="size-[20px]" /> {label}
    </button>
  )
}
