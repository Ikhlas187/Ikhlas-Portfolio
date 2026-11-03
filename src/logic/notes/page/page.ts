// Réf. tpdapson.com : sur le tableau (>= 1024px) « See more » remplace les 7 notes par les 7 suivantes, en grille il en ajoute 6.
export const BOARD_PAGE_SIZE = 7
export const GRID_PAGE_SIZE = 6

export type NotesLayout = 'board' | 'grid'

export function boardPageCount(noteCount: number) {
  return Math.max(1, Math.ceil(noteCount / BOARD_PAGE_SIZE))
}

export function visibleNotes<T>(notes: T[], step: number, layout: NotesLayout) {
  if (layout === 'grid') return notes.slice(0, GRID_PAGE_SIZE * (step + 1))
  const page = step % boardPageCount(notes.length)
  return notes.slice(page * BOARD_PAGE_SIZE, (page + 1) * BOARD_PAGE_SIZE)
}

// Sur le tableau les pages tournent en boucle : le bouton reste tant qu'il y a plus d'une page.
export function hasMoreNotes(noteCount: number, step: number, layout: NotesLayout) {
  if (layout === 'grid') return GRID_PAGE_SIZE * (step + 1) < noteCount
  return noteCount > BOARD_PAGE_SIZE
}
