import { describe, expect, it } from 'vitest'
import type { NotesEntry } from '@/data/macos'
import type { PinnedNote } from '@/types/note'
import {
  ALL_NOTES,
  EMPTY_NOTES_CHANGES,
  addFolder,
  applyNotesChanges,
  countInFolder,
  createNote,
  deleteNote,
  editNote,
  isSameDay,
  joinNote,
  notePreview,
  noteTitle,
  notesFolders,
  seedNotes,
  setNotePinned,
  splitNote,
  testimonialNote,
  visibleNotes,
  type BookNote,
} from '@/logic/macos/notesBook/notesBook'

const NOW = Date.UTC(2026, 10, 3, 12)

const entries: NotesEntry[] = [
  { id: 'about', folder: null, title: 'about', body: ['first', 'second'], isPinned: true },
  { id: 'nevora', folder: 'projects', title: 'nevora', body: ['app'] },
]

const seeds = seedNotes(entries, NOW)

const draftNote: BookNote = { id: 'draft', folder: 'notes', body: '', isPinned: false, modifiedAt: NOW + 1 }

describe('seedNotes', () => {
  it('range les notes sans dossier dans Notes et garde l’ordre des données', () => {
    const entriesInOrder = entries

    const seededNotes = seedNotes(entriesInOrder, NOW)

    expect(seededNotes).toEqual([
      { id: 'about', folder: 'notes', body: 'about\nfirst\n\nsecond', isPinned: true, modifiedAt: NOW },
      { id: 'nevora', folder: 'projects', body: 'nevora\napp', isPinned: false, modifiedAt: NOW - 60_000 },
    ])
  })
})

describe('splitNote / joinNote', () => {
  it('sépare le titre du reste puis les recolle', () => {
    const body = 'title\nline 1\nline 2'

    const parts = splitNote(body)

    expect(parts).toEqual({ title: 'title', rest: 'line 1\nline 2' })
    expect(joinNote(parts.title, parts.rest)).toBe(body)
  })

  it('n’ajoute pas de saut de ligne quand le reste est vide', () => {
    const emptyRest = ''

    expect(joinNote('title', emptyRest)).toBe('title')
  })
})

describe('noteTitle / notePreview', () => {
  it('prend le titre de remplacement pour une note vide', () => {
    const emptyNote = draftNote

    expect(noteTitle(emptyNote, 'New Note')).toBe('New Note')
    expect(notePreview(emptyNote)).toBe('')
  })

  it('montre la 2e ligne en aperçu', () => {
    const aboutNote = seeds[0]

    expect(noteTitle(aboutNote, 'New Note')).toBe('about')
    expect(notePreview(aboutNote)).toBe('first')
  })
})

describe('applyNotesChanges', () => {
  it('place les notes créées en tête et applique modifications, épingles et suppressions', () => {
    const withDraft = createNote(EMPTY_NOTES_CHANGES, draftNote)
    const changes = deleteNote(setNotePinned(editNote(withDraft, 'about', 'about\nedited', NOW + 5), 'draft', true), 'nevora')

    const notesAfterChanges = applyNotesChanges(seeds, changes)

    expect(notesAfterChanges).toEqual([
      { ...draftNote, isPinned: true },
      { ...seeds[0], body: 'about\nedited', modifiedAt: NOW + 5 },
    ])
  })

  it('modifie puis supprime une note créée sans toucher aux notes d’Ikhlas', () => {
    const changesWithDraft = createNote(EMPTY_NOTES_CHANGES, draftNote)

    const editedChanges = editNote(changesWithDraft, 'draft', 'todo', NOW + 9)
    const changesAfterDeletion = deleteNote(editedChanges, 'draft')

    expect(editedChanges.created).toEqual([{ ...draftNote, body: 'todo', modifiedAt: NOW + 9 }])
    expect(editedChanges.edited).toEqual({})
    expect(changesAfterDeletion).toEqual(EMPTY_NOTES_CHANGES)
  })

  it('ne modifie pas les changements reçus', () => {
    const changes = createNote(EMPTY_NOTES_CHANGES, draftNote)

    editNote(changes, 'draft', 'todo', NOW)

    expect(changes.created).toEqual([draftNote])
  })
})

describe('addFolder / notesFolders', () => {
  it('liste Notes, les dossiers des données puis Testimonials', () => {
    const noChanges = EMPTY_NOTES_CHANGES

    expect(notesFolders(seeds, noChanges)).toEqual(['notes', 'projects', 'testimonials'])
  })

  it('ajoute un dossier nommé en fin de liste', () => {
    const existing = notesFolders(seeds, EMPTY_NOTES_CHANGES)

    const changesWithWork = addFolder(EMPTY_NOTES_CHANGES, '  work ', existing)

    expect(notesFolders(seeds, changesWithWork)).toEqual(['notes', 'projects', 'testimonials', 'work'])
  })

  it.each(['   ', 'projects'])('ignore le nom « %s » (vide ou déjà pris)', (name) => {
    const existing = notesFolders(seeds, EMPTY_NOTES_CHANGES)

    expect(addFolder(EMPTY_NOTES_CHANGES, name, existing)).toBe(EMPTY_NOTES_CHANGES)
  })
})

describe('visibleNotes / countInFolder', () => {
  const notes = [...seeds, draftNote]

  it('filtre par dossier et trie les plus récentes en premier', () => {
    const folder = 'notes'

    expect(visibleNotes(notes, folder, '').map((note) => note.id)).toEqual(['draft', 'about'])
  })

  it('compte toutes les notes ou celles d’un dossier', () => {
    const projectsFolder = 'projects'

    expect(countInFolder(notes, ALL_NOTES)).toBe(3)
    expect(countInFolder(notes, projectsFolder)).toBe(1)
  })

  it('cherche dans le corps sans tenir compte de la casse', () => {
    const query = 'NEVO'

    expect(visibleNotes(notes, ALL_NOTES, query).map((note) => note.id)).toEqual(['nevora'])
  })
})

describe('isSameDay', () => {
  it('compare le jour calendaire', () => {
    const morning = new Date(2026, 10, 3, 8).getTime()

    expect(isSameDay(morning, new Date(2026, 10, 3, 20).getTime())).toBe(true)
    expect(isSameDay(morning, new Date(2026, 10, 4, 8).getTime())).toBe(false)
  })
})

describe('testimonialNote', () => {
  const labels = { from: 'from {name}', anonymous: 'someone' }
  const pinned: PinnedNote = { id: '7', text: 'great site', author: 'Ada', color: 'yellow', createdAt: '2026-11-01T10:00:00.000Z' }

  it('range la note dans Testimonials avec l’auteur en titre', () => {
    const pinnedByAda = pinned

    expect(testimonialNote(pinnedByAda, labels)).toEqual({
      id: 'testimonial-7',
      folder: 'testimonials',
      body: 'from Ada\ngreat site',
      isPinned: false,
      modifiedAt: Date.parse('2026-11-01T10:00:00.000Z'),
    })
  })

  it('signe une note sans auteur avec le libellé anonyme', () => {
    const anonymousNote = { ...pinned, author: null }

    expect(testimonialNote(anonymousNote, labels).body).toBe('from someone\ngreat site')
  })
})
