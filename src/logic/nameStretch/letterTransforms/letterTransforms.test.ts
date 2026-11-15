import { describe, expect, test } from 'vitest'
import { letterTransforms } from '@/logic/nameStretch/letterTransforms/letterTransforms'

describe('letterTransforms', () => {
  test('au repos : aucune lettre ne bouge', () => {
    const widths = [0.5, 0.6]
    const restValues = [0, 0]

    expect(letterTransforms(widths, restValues, 0.35)).toEqual([
      { offset: 0, scaleX: 1, scaleY: 1 },
      { offset: 0, scaleX: 1, scaleY: 1 },
    ])
  })

  test('la largeur totale reste celle du mot au repos', () => {
    const widths = [0.5, 0.6, 0.7]
    const stretchedValues = [0.2, 0.9, 0.1]

    const transforms = letterTransforms(widths, stretchedValues, 0.35)

    const stretchedWidth = transforms.reduce((sum, { scaleX }, index) => sum + widths[index] * scaleX, 0)
    expect(stretchedWidth).toBeCloseTo(1.8)
  })

  test('une lettre élargie s’écrase, une lettre affinée grandit', () => {
    const widths = [1, 1]
    const stretchedValues = [1, 0]

    const [wideLetter, thinLetter] = letterTransforms(widths, stretchedValues, 0.35)

    expect(wideLetter.scaleY).toBeLessThan(1)
    expect(thinLetter.scaleY).toBeGreaterThan(1)
  })

  test('chaque lettre est décalée de ce que gagnent les précédentes', () => {
    const widths = [1, 1]
    const stretchedValues = [1, 0]

    const [wideLetter, thinLetter] = letterTransforms(widths, stretchedValues, 0.35)

    expect(thinLetter.offset).toBeCloseTo(wideLetter.scaleX - 1)
  })
})
