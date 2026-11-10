import type { NotesStore } from '@/lib/notesStore'
import type { NotesError, PinnedNote } from '@/types/note'

const NOTES_URL = '/api/notes'

export class NotesRequestError extends Error {
  constructor(readonly reason: NotesError) {
    super(reason)
  }
}

async function readError(response: Response): Promise<NotesError> {
  try {
    const body = (await response.json()) as { error?: NotesError }
    return body.error ?? 'unavailable'
  } catch {
    return 'unavailable'
  }
}

// Notes partagées entre tous les visiteurs (api/notes.ts sur Vercel, base Neon).
export const apiNotesStore: NotesStore = {
  listNotes: async () => {
    const response = await fetch(NOTES_URL)
    if (!response.ok) throw new NotesRequestError(await readError(response))
    return (await response.json()) as PinnedNote[]
  },
  pinNote: async (note) => {
    const response = await fetch(NOTES_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: note.text, author: note.author ?? '', color: note.color }),
    })
    if (!response.ok) throw new NotesRequestError(await readError(response))
    return (await response.json()) as PinnedNote
  },
}
