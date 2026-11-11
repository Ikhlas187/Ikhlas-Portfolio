import { useId, useState, type FormEvent } from 'react'
import { Pin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import NoteColorPicker from '@/components/pages/Home/NoteColorPicker'
import RollingLabel from '@/components/pages/Home/RollingLabel'
import { NOTE_COLOR_CLASSES } from '@/components/pages/Home/noteColorClasses'
import { NOTES_SECTION } from '@/data/notes'
import { useLocale } from '@/lib/LocaleProvider'
import { cn } from '@/lib/utils'
import { noteRejection } from '@/logic/notes/moderation/moderation'
import {
  NOTE_AUTHOR_MAX_LENGTH,
  NOTE_TEXT_MAX_LENGTH,
  isNoteDraftPinnable,
  limitNoteAuthor,
  limitNoteText,
  type NoteDraft,
} from '@/logic/notes/draft/draft'
import type { NoteColor, NotesError } from '@/types/note'

type NoteFormProps = {
  // Rend la raison du refus, null quand la note est épinglée.
  onPin: (draft: NoteDraft) => Promise<NotesError | null>
  // Le visiteur a déjà sa note au tableau : il doit la retirer avant d'en épingler une autre.
  hasPinnedNote: boolean
}

type Status = 'idle' | 'pinned' | NotesError

export default function NoteForm({ onPin, hasPinnedNote }: NoteFormProps) {
  const { locale } = useLocale()
  const copy = NOTES_SECTION[locale]
  const textId = useId()
  const [text, setText] = useState('')
  const [author, setAuthor] = useState('')
  const [color, setColor] = useState<NoteColor>('blue')
  const [isPinning, setIsPinning] = useState(false)
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const draft = { text, author, color }
    if (hasPinnedNote) {
      setStatus('alreadyPinned')
      return
    }
    if (!isNoteDraftPinnable(draft)) {
      setStatus('empty')
      return
    }
    const rejection = noteRejection(text, author)
    if (rejection) {
      setStatus(rejection)
      return
    }
    setIsPinning(true)
    const error = await onPin(draft)
    setIsPinning(false)
    if (error) {
      setStatus(error)
      return
    }
    setText('')
    setStatus('pinned')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative z-10 mx-auto flex w-full max-w-[480px] flex-col gap-4 rounded-[24px] bg-white p-5 shadow-(--note-form-shadow) sm:rounded-[28px] sm:p-7 lg:absolute lg:top-1/2 lg:left-1/2 lg:w-[420px] lg:-translate-x-1/2 lg:-translate-y-1/2"
    >
      <div className="flex items-baseline justify-between">
        <label htmlFor={textId} className="text-[13px] text-gray-400">
          {copy.noteLabel}
        </label>
        <span aria-hidden="true" className="text-[12px] text-gray-500 tabular-nums">
          {Array.from(text).length}/{NOTE_TEXT_MAX_LENGTH}
        </span>
      </div>
      <Textarea
        id={textId}
        rows={3}
        value={text}
        maxLength={NOTE_TEXT_MAX_LENGTH * 2}
        placeholder={copy.notePlaceholder}
        onChange={(event) => setText(limitNoteText(event.target.value))}
        className={cn('h-[120px] text-[18px] leading-[1.35] font-medium', NOTE_COLOR_CLASSES[color].field)}
      />
      <Input
        value={author}
        maxLength={NOTE_AUTHOR_MAX_LENGTH}
        placeholder={copy.namePlaceholder}
        aria-label={copy.nameLabel}
        autoComplete="given-name"
        onChange={(event) => setAuthor(limitNoteAuthor(event.target.value))}
        className="bg-[color-mix(in_srgb,var(--color-black)_4%,var(--color-white))]"
      />
      <div className="flex items-center justify-between gap-3">
        <NoteColorPicker value={color} onChange={setColor} label={copy.colorGroupLabel} colorNames={copy.colorNames} />
        <Button
          type="submit"
          disabled={isPinning || hasPinnedNote}
          className="h-auto rounded-full bg-black px-5 py-3 text-sm leading-[normal] font-medium text-white hover:bg-black disabled:cursor-wait disabled:opacity-70"
        >
          <RollingLabel>
            {copy.pinLabel}
            <Pin aria-hidden="true" className="size-4 rotate-[30deg]" />
          </RollingLabel>
        </Button>
      </div>
      <p aria-live="polite" className="-mt-1 text-[13px] leading-[1.3] text-gray-400 empty:hidden">
        {status === 'pinned' && hasPinnedNote && copy.pinnedStatus}
        {status === 'empty' && copy.emptyStatus}
        {hasPinnedNote && status !== 'pinned' && copy.rejectedStatus.alreadyPinned}
        {!hasPinnedNote && status !== 'idle' && status !== 'pinned' && status !== 'empty' && status !== 'alreadyPinned' && copy.rejectedStatus[status]}
      </p>
    </form>
  )
}
