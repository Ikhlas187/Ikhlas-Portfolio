import { describe, expect, it } from 'vitest'
import { canScrollBy } from '@/logic/scrollCapture/scrollCapture'

describe('canScrollBy', () => {
  it('descend tant que le bas du contenu n’est pas atteint', () => {
    const middleOfList = { offset: 100, contentSize: 1000, viewportSize: 400 }

    expect(canScrollBy(middleOfList, 40)).toBe(true)
  })

  it('refuse de descendre en bas du contenu', () => {
    const bottomOfList = { offset: 600, contentSize: 1000, viewportSize: 400 }

    expect(canScrollBy(bottomOfList, 40)).toBe(false)
  })

  it('refuse de monter en haut du contenu', () => {
    const topOfList = { offset: 0, contentSize: 1000, viewportSize: 400 }

    expect(canScrollBy(topOfList, -40)).toBe(false)
  })

  it('monte dès que le contenu a défilé', () => {
    const scrolledList = { offset: 1, contentSize: 1000, viewportSize: 400 }

    expect(canScrollBy(scrolledList, -40)).toBe(true)
  })

  it('ne défile pas sans delta', () => {
    const middleOfList = { offset: 100, contentSize: 1000, viewportSize: 400 }

    expect(canScrollBy(middleOfList, 0)).toBe(false)
  })
})
