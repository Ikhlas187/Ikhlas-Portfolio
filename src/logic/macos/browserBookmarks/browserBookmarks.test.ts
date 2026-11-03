import { describe, expect, it } from 'vitest'
import { addBookmark, isBookmarked } from '@/logic/macos/browserBookmarks/browserBookmarks'

const google = { title: 'Google', address: 'https://www.google.com' }
const about = { title: 'About Ikhlas', address: 'https://ikhlas.studio/about' }

describe('browserBookmarks', () => {
  it('ajoute la page en fin de barre', () => {
    const bookmarks = [google]

    expect(addBookmark(bookmarks, about)).toEqual([google, about])
  })

  it('n’ajoute ni un doublon ni une adresse vide', () => {
    const bookmarks = [google]

    expect(addBookmark(bookmarks, { title: 'Google again', address: google.address })).toBe(bookmarks)
    expect(addBookmark(bookmarks, { title: 'Home', address: '' })).toBe(bookmarks)
  })

  it('reconnaît une adresse déjà en signet', () => {
    const bookmarks = [google]

    expect(isBookmarked(bookmarks, google.address)).toBe(true)
    expect(isBookmarked(bookmarks, about.address)).toBe(false)
  })
})
