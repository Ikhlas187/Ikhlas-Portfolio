// Forme d'une note épinglée : contrat à reprendre tel quel le jour où portfolio-backend stocke les notes.
export const NOTE_COLORS = ['pink', 'yellow', 'orange', 'green', 'blue'] as const

export type NoteColor = (typeof NOTE_COLORS)[number]

export type PinnedNote = {
  id: string
  text: string
  author: string | null
  color: NoteColor
  createdAt: string
}
