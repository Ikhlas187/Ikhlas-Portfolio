import { describe, expect, it } from 'vitest'
import {
  NOTE_TEXT_MAX_LENGTH,
  createPinnedNote,
  isNoteDraftPinnable,
  limitNoteAuthor,
  limitNoteText,
  noteSignature,
} from '@/logic/notes/draft/draft'
import type { PinnedNote } from '@/types/note'

describe('limitNoteText', () => {
  it('coupe un texte trop long à la longueur maximale', () => {
    const tooLongText = 'a'.repeat(NOTE_TEXT_MAX_LENGTH + 20)

    const limitedText = limitNoteText(tooLongText)

    expect(limitedText).toHaveLength(NOTE_TEXT_MAX_LENGTH)
  })

  it('laisse intact un texte assez court', () => {
    const shortText = 'Hello Ikhlas'

    expect(limitNoteText(shortText)).toBe('Hello Ikhlas')
  })

  it('ne coupe pas un emoji en deux', () => {
    const textEndingWithEmojis = 'a'.repeat(NOTE_TEXT_MAX_LENGTH - 1) + '🔥🔥'

    expect(limitNoteText(textEndingWithEmojis)).toBe('a'.repeat(NOTE_TEXT_MAX_LENGTH - 1) + '🔥')
  })
})

describe('limitNoteAuthor', () => {
  it('coupe un nom de plus de 30 caractères', () => {
    const longName = 'b'.repeat(45)

    expect(limitNoteAuthor(longName)).toBe('b'.repeat(30))
  })
})

describe('isNoteDraftPinnable', () => {
  it('refuse une note faite seulement d’espaces', () => {
    const blankDraft = { text: '   \n ', author: 'Ada', color: 'pink' as const }

    expect(isNoteDraftPinnable(blankDraft)).toBe(false)
  })
})

describe('createPinnedNote', () => {
  it('garde le texte nettoyé, le nom et la couleur choisie', () => {
    const draft = { text: '  Nice work!  ', author: ' Ada ', color: 'green' as const }

    const pinnedNote = createPinnedNote(draft, 'n1', '2026-11-02T10:00:00.000Z')

    expect(pinnedNote).toEqual({
      id: 'n1',
      text: 'Nice work!',
      author: 'Ada',
      color: 'green',
      createdAt: '2026-11-02T10:00:00.000Z',
    })
  })

  it('laisse le nom à null quand il est vide', () => {
    const draftWithoutName = { text: 'Hi', author: '  ', color: 'blue' as const }

    const anonymousNote = createPinnedNote(draftWithoutName, 'n2', '2026-11-02T10:00:00.000Z')

    expect(anonymousNote?.author).toBeNull()
  })

  it('ne crée rien pour un texte vide', () => {
    const emptyDraft = { text: '', author: 'Ada', color: 'blue' as const }

    expect(createPinnedNote(emptyDraft, 'n3', '2026-11-02T10:00:00.000Z')).toBeNull()
  })
})

describe('noteSignature', () => {
  it('signe « Anonyme » une note sans nom', () => {
    const anonymousNote: PinnedNote = { id: 'n4', text: 'Hi', author: null, color: 'pink', createdAt: '' }

    expect(noteSignature(anonymousNote, 'Anonyme')).toBe('— Anonyme')
  })
})
