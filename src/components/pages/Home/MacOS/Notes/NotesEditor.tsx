import { useRef } from 'react'
import { Pin, Search, SquarePen } from 'lucide-react'
import {
  FRAME_ICON_STROKE,
  FRAME_SEARCH_FIELD,
  FRAME_TOOL,
  FRAME_TOOLBAR,
} from '@/components/pages/Home/MacOS/frameClasses'
import { GIANT_SUR } from '@/data/giantSur'
import { MACOS } from '@/data/macos'
import { useLocale } from '@/lib/LocaleProvider'
import { cn } from '@/lib/utils'
import { joinNote, splitNote, type BookNote } from '@/logic/macos/notesBook/notesBook'

type NotesEditorProps = {
  note: BookNote | undefined
  query: string
  onQueryChange: (query: string) => void
  onEdit: (body: string) => void
  onTogglePin: () => void
  onNewNote: () => void
}

// Les champs de saisie gardent l'anneau macOS : le contour orange global du site ferait double emploi.
const NO_OUTLINE = { outline: 'none' }

export default function NotesEditor({ note, query, onQueryChange, onEdit, onTogglePin, onNewNote }: NotesEditorProps) {
  const { locale } = useLocale()
  const texts = MACOS[locale].notes
  const bodyRef = useRef<HTMLTextAreaElement>(null)
  const { title, rest } = splitNote(note?.body ?? '')

  return (
    <div className="flex min-w-0 flex-1 flex-col bg-(--macos-frame-surface)">
      <div data-window-drag className={FRAME_TOOLBAR}>
        <div className="flex-1" />
        <button type="button" aria-label={texts.pinNote} disabled={!note} onClick={onTogglePin} className={FRAME_TOOL}>
          <Pin
            strokeWidth={FRAME_ICON_STROKE}
            className={cn(note?.isPinned && 'fill-current text-(--macos-notes-amber)')}
          />
        </button>
        <button type="button" aria-label={texts.newNote} onClick={onNewNote} className={FRAME_TOOL}>
          <SquarePen strokeWidth={FRAME_ICON_STROKE} />
        </button>
        <label className={cn(FRAME_SEARCH_FIELD, 'w-[143px]')}>
          <Search size={14} className="shrink-0" />
          <input
            aria-label={texts.searchNotes}
            placeholder={texts.search}
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            style={NO_OUTLINE}
            className="w-full bg-transparent text-(--macos-frame-fg) select-text placeholder:text-(--macos-frame-muted)"
          />
        </label>
      </div>
      {note ? (
        <div className="flex min-h-0 flex-1 flex-col px-[26px] pb-[19.5px]">
          <p className="pb-[9.75px] text-center text-[9.75px] text-(--macos-frame-muted)">
            {new Date(note.modifiedAt).toLocaleString(GIANT_SUR[locale].intlLocale, {
              dateStyle: 'long',
              timeStyle: 'short',
            })}
          </p>
          <input
            aria-label={texts.noteTitle}
            placeholder={texts.titlePlaceholder}
            value={title}
            onChange={(event) => onEdit(joinNote(event.target.value, rest))}
            onKeyDown={(event) => {
              if (event.key !== 'Enter') return
              event.preventDefault()
              bodyRef.current?.focus()
            }}
            style={NO_OUTLINE}
            className="bg-transparent text-[22px] font-bold select-text placeholder:text-(--macos-frame-muted)"
          />
          <textarea
            ref={bodyRef}
            aria-label={texts.note}
            placeholder={texts.bodyPlaceholder}
            value={rest}
            onChange={(event) => onEdit(`${title}\n${event.target.value}`)}
            style={NO_OUTLINE}
            className="mt-[6.5px] flex-1 resize-none overscroll-contain bg-transparent text-[14px] leading-relaxed select-text placeholder:text-(--macos-frame-muted)"
          />
        </div>
      ) : (
        <p className="grid flex-1 place-items-center text-(--macos-frame-muted)">{texts.noNoteSelected}</p>
      )}
    </div>
  )
}
