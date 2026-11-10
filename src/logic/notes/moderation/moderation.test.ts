import { describe, expect, it } from 'vitest'
import { noteRejection, normalizeForModeration } from '@/logic/notes/moderation/moderation'

describe('normalizeForModeration', () => {
  it('retire accents, chiffres déguisés et lettres répétées', () => {
    const text = 'Énnnculé 3t c0nnard'

    const normalized = normalizeForModeration(text)

    expect(normalized).toBe('encule et conard')
  })
})

describe('noteRejection', () => {
  it('accepte une note normale', () => {
    const text = 'Super portfolio, le Mac est fou !'

    const rejection = noteRejection(text, 'Awa')

    expect(rejection).toBeNull()
  })

  it.each([
    ['une insulte française', 'espèce de connard'],
    ['une insulte anglaise', 'what the FUCK'],
    ['une insulte déguisée', 'p.u.t.e'],
    ['une insulte collée à un autre mot', 'salesalope'],
    ['un mot répété pour contourner', 'shiiiiit'],
  ])('refuse %s', (_case, text) => {
    const rejection = noteRejection(text, '')

    expect(rejection).toBe('blockedWord')
  })

  it('refuse une insulte dans le prénom', () => {
    const text = 'Bonjour'

    const rejection = noteRejection(text, 'bitch')

    expect(rejection).toBe('blockedWord')
  })

  it('ne confond pas un mot normal qui contient une racine courte', () => {
    const text = 'Je suis passé par Dickens et Sussex'

    const rejection = noteRejection(text, '')

    expect(rejection).toBeNull()
  })

  it('refuse les liens', () => {
    const text = 'Va voir www.spam.com'

    const rejection = noteRejection(text, '')

    expect(rejection).toBe('link')
  })

  it('refuse une note vide ou trop longue', () => {
    const emptyText = '   '
    const longText = 'a'.repeat(101)

    const rejections = [noteRejection(emptyText, ''), noteRejection(longText, '')]

    expect(rejections).toEqual(['empty', 'tooLong'])
  })
})
