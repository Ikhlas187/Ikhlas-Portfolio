import { describe, expect, it } from 'vitest'
import { groupByAlbum, swipeGesture } from '@/logic/macos/photoAlbums/photoAlbums'

describe('groupByAlbum', () => {
  it('regroupe les photos par album dans l’ordre d’apparition', () => {
    const photos = [
      { id: 'a', album: 'NEVORA' },
      { id: 'b', album: 'DRIP' },
      { id: 'c', album: 'NEVORA' },
    ]

    expect(groupByAlbum(photos)).toEqual([
      ['NEVORA', [photos[0], photos[2]]],
      ['DRIP', [photos[1]]],
    ])
  })
})

describe('swipeGesture', () => {
  it.each([
    [-80, 10, 'next'],
    [90, -20, 'previous'],
    [70, 60, null],
    [3, -4, 'tap'],
    [30, 0, null],
  ])('Δx %d, Δy %d donne %s', (deltaX, deltaY, gesture) => {
    expect(swipeGesture(deltaX, deltaY)).toBe(gesture)
  })
})
