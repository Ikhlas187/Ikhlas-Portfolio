import { describe, expect, it } from 'vitest'
import { noteTextSize } from '@/logic/notes/textSize/textSize'

describe('noteTextSize', () => {
  it('garde la grande taille pour un mot court', () => {
    const shortText = 'Nice work!'

    expect(noteTextSize(shortText)).toBe('large')
  })

  it('passe en taille moyenne entre 41 et 70 caractères', () => {
    const mediumText = 'a'.repeat(60)

    expect(noteTextSize(mediumText)).toBe('medium')
  })

  it('passe en petite taille au-delà de 70 caractères', () => {
    const longText = 'a'.repeat(100)

    expect(noteTextSize(longText)).toBe('small')
  })
})
