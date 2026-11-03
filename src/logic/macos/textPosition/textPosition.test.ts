import { describe, expect, it } from 'vitest'
import { lineCount, textPositionAt } from '@/logic/macos/textPosition/textPosition'

const code = 'const a = 1\nconst b = 2\n'

describe('textPositionAt', () => {
  it('place le début du texte en ligne 1, colonne 1', () => {
    const offset = 0

    expect(textPositionAt(code, offset)).toEqual({ line: 1, column: 1 })
  })

  it('compte les colonnes depuis le dernier retour à la ligne', () => {
    const offsetOfB = code.indexOf('b')

    expect(textPositionAt(code, offsetOfB)).toEqual({ line: 2, column: 7 })
  })

  it('ramène un indice hors du texte sur ses bornes', () => {
    const offsets = [-4, 500]

    expect(offsets.map((offset) => textPositionAt(code, offset))).toEqual([
      { line: 1, column: 1 },
      { line: 3, column: 1 },
    ])
  })
})

describe('lineCount', () => {
  it('compte la ligne vide qui suit le dernier retour à la ligne, comme l’éditeur', () => {
    const textEndingWithNewline = code

    expect(lineCount(textEndingWithNewline)).toBe(3)
  })

  it('compte une ligne pour un texte vide', () => {
    const emptyText = ''

    expect(lineCount(emptyText)).toBe(1)
  })
})
