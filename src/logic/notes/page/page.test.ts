import { describe, expect, it } from 'vitest'
import { hasMoreNotes, visibleNotes } from '@/logic/notes/page/page'

const fifteenNotes = Array.from({ length: 15 }, (_, index) => index)

describe('visibleNotes', () => {
  it('montre les 7 premières notes sur le tableau', () => {
    const firstStep = 0

    expect(visibleNotes(fifteenNotes, firstStep, 'board')).toEqual([0, 1, 2, 3, 4, 5, 6])
  })

  it('remplace les notes par les 7 suivantes sur le tableau', () => {
    const secondStep = 1

    expect(visibleNotes(fifteenNotes, secondStep, 'board')).toEqual([7, 8, 9, 10, 11, 12, 13])
  })

  it('revient à la 1re page après la dernière', () => {
    const stepAfterLastPage = 3

    expect(visibleNotes(fifteenNotes, stepAfterLastPage, 'board')).toEqual([0, 1, 2, 3, 4, 5, 6])
  })

  it('ajoute 6 notes à chaque clic en grille', () => {
    const secondStep = 1

    expect(visibleNotes(fifteenNotes, secondStep, 'grid')).toHaveLength(12)
  })
})

describe('hasMoreNotes', () => {
  it('cache le bouton quand toutes les notes tiennent sur le tableau', () => {
    const twoNotes = 2

    expect(hasMoreNotes(twoNotes, 0, 'board')).toBe(false)
  })

  it('cache le bouton en grille quand la dernière note est affichée', () => {
    const lastGridStep = 2

    expect(hasMoreNotes(fifteenNotes.length, lastGridStep, 'grid')).toBe(false)
  })

  it('garde le bouton en grille tant que des notes restent cachées', () => {
    const firstStep = 0

    expect(hasMoreNotes(fifteenNotes.length, firstStep, 'grid')).toBe(true)
  })
})
