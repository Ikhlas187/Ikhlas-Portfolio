import type { NotesStore } from '@/lib/notesStore'
import { visitorToken } from '@/lib/visitorToken'
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
const visitorHeaders = () => ({ 'X-Visitor-Token': visitorToken() })

export const apiNotesStore: NotesStore = {
  listNotes: async () => {
    const response = await fetch(NOTES_URL, { headers: visitorHeaders() })
    if (!response.ok) throw new NotesRequestError(await readError(response))
    return (await response.json()) as PinnedNote[]
  },
  pinNote: async (note) => {
    const response = await fetch(NOTES_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...visitorHeaders() },
      body: JSON.stringify({ text: note.text, author: note.author ?? '', color: note.color }),
    })
    if (!response.ok) throw new NotesRequestError(await readError(response))
    return (await response.json()) as PinnedNote
  },
  removeNote: async (id) => {
    const response = await fetch(`${NOTES_URL}?id=${encodeURIComponent(id)}`, { method: 'DELETE', headers: visitorHeaders() })
    if (!response.ok) throw new NotesRequestError(await readError(response))
  },
}
