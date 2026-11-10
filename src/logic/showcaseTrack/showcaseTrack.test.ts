import { describe, expect, it } from 'vitest'
import { showcaseOffsetVw } from '@/logic/showcaseTrack/showcaseTrack'

describe('showcaseOffsetVw', () => {
  it('fait défiler la bande jusqu’au dernier projet, bornée hors de la course', () => {
    const progresses = [-0.5, 0, 0.5, 1, 2]

    const offsets = progresses.map((progress) => showcaseOffsetVw(progress, 3))

    expect(offsets).toEqual([-0, -0, -100, -200, -200])
  })
})
