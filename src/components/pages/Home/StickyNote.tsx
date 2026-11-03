import { motion, type Transition } from 'framer-motion'
import { Pin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NOTE_COLOR_CLASSES } from '@/components/pages/Home/noteColorClasses'
import { noteSignature } from '@/logic/notes/draft/draft'
import { noteSway } from '@/logic/notes/sway/sway'
import { noteTextSize, type NoteTextSize } from '@/logic/notes/textSize/textSize'
import type { PinnedNote } from '@/types/note'

const TEXT_SIZE_CLASSES: Record<NoteTextSize, string> = {
  large: 'text-[9cqw] leading-[1.2]',
  medium: 'text-[7.6cqw] leading-[1.25]',
  small: 'text-[6.6cqw] leading-[1.3]',
}

// La punaise arrive un peu au-dessus, s'enfonce en s'écrasant au moment où la note touche le tableau, puis reprend sa forme.
const PIN_PRESS = { y: [-10, 0, 2, 0], scaleY: [1, 1, 0.72, 1], scaleX: [1, 1, 1.14, 1] }
const PIN_PRESS_TRANSITION: Transition = { duration: 0.5, delay: 0.12, times: [0, 0.4, 0.6, 1], ease: 'easeOut' }

type StickyNoteProps = {
  note: PinnedNote
  anonymousLabel: string
  rotation: string
  isUnderForm?: boolean
  isJustPinned?: boolean
}

export default function StickyNote({
  note,
  anonymousLabel,
  rotation,
  isUnderForm = false,
  isJustPinned = false,
}: StickyNoteProps) {
  const sway = noteSway(note.id)

  return (
    <div
      className="@container relative aspect-[210/190] w-full origin-[50%_0] animate-note-sway motion-reduce:animate-none"
      style={{ animationDuration: `${sway.durationS}s`, animationDelay: `${sway.delayS}s` }}
    >
      <figure
        className={cn(
          'absolute inset-0 m-0 flex origin-[50%_-1%] flex-col gap-[3cqw] overflow-hidden rounded-[6px] p-[10.5cqw] drop-shadow-(--sticky-note-shadow)',
          NOTE_COLOR_CLASSES[note.color].paper,
          rotation,
        )}
      >
        <blockquote
          className={cn(
            'm-0 flex min-h-0 flex-1 flex-col overflow-hidden font-sans font-medium [overflow-wrap:anywhere]',
            TEXT_SIZE_CLASSES[noteTextSize(note.text)],
            isUnderForm && 'lg:justify-end',
          )}
        >
          <span>{note.text}</span>
        </blockquote>
        <figcaption className={cn('truncate font-sans text-[6.2cqw] font-medium', isUnderForm && 'lg:order-first')}>
          {noteSignature(note, anonymousLabel)}
        </figcaption>
      </figure>
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute top-[-9.5cqw] left-1/2 size-[13.7cqw] origin-bottom -translate-x-1/2"
        initial={false}
        animate={isJustPinned ? PIN_PRESS : undefined}
        transition={PIN_PRESS_TRANSITION}
      >
        <Pin
          strokeWidth={1.75}
          className="size-full rotate-[30deg] fill-primary text-black drop-shadow-(--pin-shadow)"
        />
      </motion.span>
    </div>
  )
}
