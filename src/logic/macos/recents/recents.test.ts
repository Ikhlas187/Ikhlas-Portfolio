import { describe, expect, it } from 'vitest'
import { addRecent } from '@/logic/macos/recents/recents'

describe('addRecent', () => {
  it('place le dernier fichier ouvert en tête', () => {
    const recents = [['desktop', 'about']]

    expect(addRecent(recents, ['desktop', 'cv'])).toEqual([
      ['desktop', 'cv'],
      ['desktop', 'about'],
    ])
  })

  it('remonte un fichier déjà présent sans le dupliquer', () => {
    const recents = [
      ['desktop', 'cv'],
      ['desktop', 'about'],
    ]

    expect(addRecent(recents, ['desktop', 'about'])).toEqual([
      ['desktop', 'about'],
      ['desktop', 'cv'],
    ])
  })

  it('oublie le plus ancien au-delà de la limite', () => {
    const fullRecents = [['documents', 'stack'], ['desktop', 'about']]
    const limit = 2

    expect(addRecent(fullRecents, ['desktop', 'cv'], limit)).toEqual([
      ['desktop', 'cv'],
      ['documents', 'stack'],
    ])
  })

  it('ne modifie pas la liste reçue', () => {
    const recents = [['desktop', 'about']]

    addRecent(recents, ['desktop', 'cv'])

    expect(recents).toEqual([['desktop', 'about']])
  })
})
