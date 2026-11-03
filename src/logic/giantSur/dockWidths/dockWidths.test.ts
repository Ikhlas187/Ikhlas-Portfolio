import { describe, expect, test } from 'vitest'
import { dockWidths } from '@/logic/giantSur/dockWidths/dockWidths'

describe('dockWidths', () => {
  test('keeps every icon at rest when nothing is hovered', () => {
    const itemCount = 4

    expect(dockWidths(itemCount, null)).toEqual(['4em', '4em', '4em', '4em'])
  })

  test('grows the hovered icon and its 2 neighbours on each side', () => {
    const itemCount = 7
    const middleIndex = 3

    expect(dockWidths(itemCount, middleIndex)).toEqual(['4em', '5.5rem', '6.5rem', '8rem', '6.5rem', '5.5rem', '4em'])
  })

  test('stops at the start of the dock when the first icon is hovered', () => {
    const itemCount = 4
    const firstIndex = 0

    expect(dockWidths(itemCount, firstIndex)).toEqual(['8rem', '6.5rem', '5.5rem', '4em'])
  })

  test('stops at the end of the dock when the last icon is hovered', () => {
    const itemCount = 4
    const lastIndex = 3

    expect(dockWidths(itemCount, lastIndex)).toEqual(['4em', '5.5rem', '6.5rem', '8rem'])
  })

  test('grows only the existing neighbour when the second icon is hovered', () => {
    const itemCount = 5
    const secondIndex = 1

    expect(dockWidths(itemCount, secondIndex)).toEqual(['6.5rem', '8rem', '6.5rem', '5.5rem', '4em'])
  })
})
