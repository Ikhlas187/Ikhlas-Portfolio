import { Pin, Trash2 } from 'lucide-react'
import { FRAME_ICON_STROKE, FRAME_TOOL, FRAME_TOOLBAR } from '@/components/pages/Home/MacOS/frameClasses'
import { MACOS } from '@/data/macos'
import { GIANT_SUR } from '@/data/giantSur'
import { useLocale } from '@/lib/LocaleProvider'
import { cn } from '@/lib/utils'
import { isSameDay, notePreview, noteTitle, type BookNote } from '@/logic/macos/notesBook/notesBook'

type NotesListProps = {
  title: string
  notes: BookNote[]
  selectedId: string | undefined
  onSelect: (id: string) => void
  onDelete: () => void
}

export default function NotesList({ title, notes, selectedId, onSelect, onDelete }: NotesListProps) {
  const { locale } = useLocale()
  const texts = MACOS[locale].notes
  const intlLocale = GIANT_SUR[locale].intlLocale
  const groups = [
    { name: texts.pinned, isPinned: true, items: notes.filter((note) => note.isPinned) },
    { name: texts.others, isPinned: false, items: notes.filter((note) => !note.isPinned) },
  ].filter((group) => group.items.length > 0)

  // Aujourd'hui : l'heure ; avant : la date, comme dans Notes.
  const stamp = (at: number) =>
    isSameDay(at, Date.now())
      ? new Date(at).toLocaleTimeString(intlLocale, { hour: '2-digit', minute: '2-digit' })
      : new Date(at).toLocaleDateString(intlLocale)

  return (
    <div className="flex w-[208px] shrink-0 flex-col bg-(--macos-frame-surface) shadow-[0.5px_0_0_var(--macos-frame-line)]">
      <div data-window-drag className={FRAME_TOOLBAR}>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[15px] leading-tight font-bold">{title}</h1>
          <p className="text-[11px] text-(--macos-frame-muted)">
            {texts.noteCount.replace('{count}', String(notes.length))}
          </p>
        </div>
        <button type="button" aria-label={texts.deleteNote} disabled={!selectedId} onClick={onDelete} className={FRAME_TOOL}>
          <Trash2 strokeWidth={FRAME_ICON_STROKE} />
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-[8.125px] pb-[6.5px]">
        {notes.length === 0 && <p className="mt-[52px] text-center text-(--macos-frame-muted)">{texts.noNotes}</p>}
        {groups.map((group) => (
          <section key={group.name + group.isPinned} className="mb-[9.75px]">
            <h2 className="flex items-center gap-[3.25px] px-[8.125px] pb-[3.25px] text-[13px] leading-[1.5] font-bold">
              {group.isPinned && <Pin size={12} className="fill-current text-(--macos-notes-amber)" />}
              {group.name}
            </h2>
            {group.items.map((note) => (
              <button
                key={note.id}
                type="button"
                onClick={() => onSelect(note.id)}
                className={cn(
                  'block w-full cursor-pointer rounded-[7px] px-[8.125px] py-[6.5px] text-left',
                  note.id === selectedId ? 'bg-(--macos-notes-selected)' : 'hover:bg-(--macos-frame-hover)',
                )}
              >
                <span className="block truncate font-semibold">{noteTitle(note, texts.untitled)}</span>
                <span className="mt-[1.625px] flex gap-[6.5px] text-[9.75px]">
                  <span className="shrink-0">{stamp(note.modifiedAt)}</span>
                  <span className="truncate text-(--macos-frame-muted)">{notePreview(note) || texts.noAdditionalText}</span>
                </span>
              </button>
            ))}
          </section>
        ))}
      </div>
    </div>
  )
}
