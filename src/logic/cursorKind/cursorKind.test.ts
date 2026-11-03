import { describe, expect, it } from 'vitest'
import { cursorKindOf } from '@/logic/cursorKind/cursorKind'

describe('cursorKindOf', () => {
  it('reconnaît les libellés prévus', () => {
    const attributeValues = ['view', 'scroll']

    expect(attributeValues.map(cursorKindOf)).toEqual(['view', 'scroll'])
  })

  it('ignore une valeur inconnue', () => {
    const unknownValue = 'drag'

    expect(cursorKindOf(unknownValue)).toBeNull()
  })

  it('ignore un élément sans attribut', () => {
    const missingValue = null

    expect(cursorKindOf(missingValue)).toBeNull()
  })
})
