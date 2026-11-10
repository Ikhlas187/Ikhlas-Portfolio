// Forme d'une note épinglée : contrat entre le site et api/notes.ts (fonction Vercel, base Neon).
export const NOTE_COLORS = ['pink', 'yellow', 'orange', 'green', 'blue'] as const

export type NoteColor = (typeof NOTE_COLORS)[number]

export type PinnedNote = {
  id: string
  text: string
  author: string | null
  color: NoteColor
  createdAt: string
}

// Refus renvoyé par api/notes.ts (champ error) : ceux de la modération, trop de notes d'affilée, serveur injoignable.
export type NoteRejection = 'empty' | 'tooLong' | 'blockedWord' | 'link'
export type NotesError = NoteRejection | 'tooMany' | 'unavailable'
