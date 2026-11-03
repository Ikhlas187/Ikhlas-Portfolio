import { useState } from 'react'
import { MACOS } from '@/data/macos'
import { useLocale } from '@/lib/LocaleProvider'
import { localNotesStore } from '@/lib/notesStore'
import { canPostTestimonial } from '@/logic/macos/notesFolders/notesFolders'
import { NOTE_TEXT_MAX_LENGTH, createPinnedNote, limitNoteAuthor, limitNoteText } from '@/logic/notes/draft/draft'
import type { PinnedNote } from '@/types/note'

type NotesComposeProps = { onCancel: () => void; onPosted: (note: PinnedNote) => void }

const HEADER_BUTTON = 'cursor-pointer text-[15px] text-(--macos-notes-tint)'

// Le témoignage rejoint les notes épinglées de PinNote (même stockage, même limite de longueur).
export default function NotesCompose({ onCancel, onPosted }: NotesComposeProps) {
  const { locale } = useLocale()
  const texts = MACOS[locale].notes
  const [text, setText] = useState('')
  const [author, setAuthor] = useState('')
  const [isPosting, setIsPosting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isPostable = canPostTestimonial(text) && !isPosting

  const post = async () => {
    const note = createPinnedNote({ text, author, color: 'yellow' }, crypto.randomUUID(), new Date().toISOString())
    if (!isPostable || !note) return
    setIsPosting(true)
    setError(null)
    try {
      onPosted(await localNotesStore.pinNote(note))
    } catch {
      setError(texts.postError)
      setIsPosting(false)
    }
  }

  return (
    <div className="flex h-full flex-col bg-(--macos-notes-paper)">
      <div className="flex shrink-0 items-center justify-between border-b border-(--macos-app-line) px-[16px] py-[10px]">
        <button type="button" onClick={onCancel} className={HEADER_BUTTON}>
          {texts.cancel}
        </button>
        <span className="text-[15px] font-semibold text-(--macos-app-ink)">{texts.newTestimonial}</span>
        <button
          type="button"
          onClick={post}
          disabled={!isPostable}
          className={`${HEADER_BUTTON} font-semibold disabled:cursor-default disabled:opacity-35`}
        >
          {isPosting ? texts.posting : texts.post}
        </button>
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-auto px-[20px] py-[16px]">
        <textarea
          autoFocus
          value={text}
          onChange={(event) => setText(limitNoteText(event.target.value))}
          placeholder={texts.composePlaceholder}
          className="min-h-[160px] w-full flex-1 resize-none bg-transparent text-[16px] leading-relaxed text-(--macos-app-ink) select-text placeholder:text-(--macos-app-faint) focus:outline-none"
        />
        <input
          value={author}
          onChange={(event) => setAuthor(limitNoteAuthor(event.target.value))}
          placeholder={texts.namePlaceholder}
          className="mt-[12px] w-full border-t border-(--macos-app-line) bg-transparent pt-[12px] text-[15px] text-(--macos-app-ink) select-text placeholder:text-(--macos-app-faint) focus:outline-none"
        />
        <div className="mt-[8px] flex items-center justify-between text-[12px]">
          <span className="text-(--macos-notes-error)">{error}</span>
          <span className="text-(--macos-app-faint) tabular-nums">{NOTE_TEXT_MAX_LENGTH - Array.from(text).length}</span>
        </div>
      </div>
    </div>
  )
}
