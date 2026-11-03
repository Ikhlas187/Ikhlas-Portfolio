import { describe, expect, it } from 'vitest'
import {
  canPostTestimonial,
  capitalize,
  entriesInFolder,
  folderNames,
  testimonialEntry,
} from '@/logic/macos/notesFolders/notesFolders'
import type { NotesEntry } from '@/data/macos'
import type { PinnedNote } from '@/types/note'

const entries: NotesEntry[] = [
  { id: 'about', folder: null, title: 'about', body: ['a'] },
  { id: 'nevora', folder: 'projects', title: 'nevora', body: ['b'] },
  { id: 'drip', folder: 'projects', title: 'drip', body: ['c'] },
  { id: 'idea', folder: 'ideas', title: 'idea', body: ['d'] },
]

describe('capitalize', () => {
  it('met la 1re lettre en majuscule', () => {
    expect(capitalize('projects')).toBe('Projects')
  })
})

describe('canPostTestimonial', () => {
  it.each([
    ['  ok ', false],
    ['top', true],
  ])('« %s » publiable : %s', (text, isPostable) => {
    expect(canPostTestimonial(text)).toBe(isPostable)
  })
})

describe('testimonialEntry', () => {
  const labels = { from: 'from {name}', anonymous: 'someone who stopped by' }

  it('signe la note du visiteur anonyme et date le corps', () => {
    const anonymousNote: PinnedNote = {
      id: 'n1',
      text: 'Nice site',
      author: null,
      color: 'yellow',
      createdAt: '2026-11-03T10:00:00.000Z',
    }

    expect(testimonialEntry(anonymousNote, labels, 'en-US')).toEqual({
      id: 'testimonial-n1',
      folder: 'testimonials',
      title: 'from someone who stopped by',
      body: ['Nice site', 'November 3, 2026'],
    })
  })
})

describe('folderNames', () => {
  it('place Testimonials avant les autres dossiers, sans doublon', () => {
    expect(folderNames(entries)).toEqual(['testimonials', 'projects', 'ideas'])
  })
})

describe('entriesInFolder', () => {
  it('rend les notes hors dossier pour null', () => {
    expect(entriesInFolder(entries, null).map((entry) => entry.id)).toEqual(['about'])
  })
})
