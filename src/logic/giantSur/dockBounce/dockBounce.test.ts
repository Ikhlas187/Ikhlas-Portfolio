import { describe, expect, it } from 'vitest'
import { dockBounceKeyframes } from '@/logic/giantSur/dockBounce/dockBounce'

describe('dockBounceKeyframes', () => {
  it('alterne sommet et retour au repos, en partant et en finissant au repos', () => {
    const height = 20

    const { y } = dockBounceKeyframes(height, 2, 0.5)

    expect(y).toEqual([0, -20, 0, -10, 0])
  })

  it('amortit chaque saut par le facteur donné', () => {
    const height = 32

    const { y } = dockBounceKeyframes(height, 3, 0.5)

    expect(y.filter((value) => value < 0)).toEqual([-32, -16, -8])
  })

  it('répartit les instants de 0 à 1 dans l’ordre', () => {
    const height = 20

    const { times } = dockBounceKeyframes(height, 3, 0.6)

    expect(times[0]).toBe(0)
    expect(times[times.length - 1]).toBe(1)
    expect(times).toEqual([...times].sort((left, right) => left - right))
  })

  it('donne moins de temps à un petit saut qu’à un grand', () => {
    const height = 20

    const { times } = dockBounceKeyframes(height, 2, 0.25)

    const firstJump = times[2] - times[0]
    const secondJump = times[4] - times[2]
    expect(secondJump).toBeLessThan(firstJump)
  })
})
