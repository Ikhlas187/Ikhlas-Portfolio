import type { NoteColor, PinnedNote } from '@/types/note'

export const NOTE_TEXT_MAX_LENGTH = 100
export const NOTE_AUTHOR_MAX_LENGTH = 30

export type NoteDraft = {
  text: string
  author: string
  color: NoteColor
}

export function limitNoteText(text: string) {
  return Array.from(text).slice(0, NOTE_TEXT_MAX_LENGTH).join('')
}

export function limitNoteAuthor(author: string) {
  return Array.from(author).slice(0, NOTE_AUTHOR_MAX_LENGTH).join('')
}

export function isNoteDraftPinnable(draft: NoteDraft) {
  return draft.text.trim().length > 0
}

// Un nom vide reste null : la signature « Anonymous / Anonyme » se traduit à l'affichage.
export function createPinnedNote(draft: NoteDraft, id: string, createdAt: string): PinnedNote | null {
  if (!isNoteDraftPinnable(draft)) return null
  const author = limitNoteAuthor(draft.author.trim())
  return {
    id,
    text: limitNoteText(draft.text.trim()),
    author: author.length > 0 ? author : null,
    color: draft.color,
    createdAt,
  }
}

export function noteSignature(note: PinnedNote, anonymousLabel: string) {
  return `— ${note.author ?? anonymousLabel}`
}
