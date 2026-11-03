import type { NotesEntry } from '@/data/macos'

type NotesListProps = { entries: NotesEntry[]; onOpen: (id: string) => void }

export default function NotesList({ entries, onOpen }: NotesListProps) {
  return (
    <div className="min-h-0 flex-1 overflow-auto border-t border-(--macos-app-line)">
      {entries.map((entry) => (
        <button
          key={entry.id}
          type="button"
          onClick={() => onOpen(entry.id)}
          className="block w-full cursor-pointer border-b border-(--macos-app-line) px-[16px] py-[10px] text-left hover:bg-(--macos-notes-hover)"
        >
          <div className="truncate text-[15px] leading-[22.5px] font-medium text-(--macos-app-ink)">{entry.title}</div>
          <div className="mt-[2px] line-clamp-1 text-[13px] leading-[19.5px] text-(--macos-app-muted)">{entry.body[0]}</div>
        </button>
      ))}
    </div>
  )
}
