import { describe, expect, test } from 'vitest'
import { stepSprings, type Spring } from '@/logic/nameStretch/springStep/springStep'

const settings = { stiffness: 260, damping: 16.8 }

function runFor(springs: Spring[], seconds: number) {
  let current = springs
  for (let time = 0; time < seconds; time += 1 / 60) current = stepSprings(current, 1 / 60, settings).springs
  return current
}

describe('stepSprings', () => {
  test('un ressort tiré vers sa cible s’en approche', () => {
    const pulledSprings = [{ value: 0, velocity: 0, target: 1 }]

    const { springs, isMoving } = stepSprings(pulledSprings, 1 / 60, settings)

    expect(springs[0].value).toBeGreaterThan(0)
    expect(isMoving).toBe(true)
  })

  test('il dépasse un peu sa cible avant de se poser', () => {
    const pulledSprings = [{ value: 0, velocity: 0, target: 1 }]

    const springsNearPeak = runFor(pulledSprings, 0.25)

    expect(springsNearPeak[0].value).toBeGreaterThan(1)
  })

  test('après 1,5 s il est posé exactement sur sa cible, sans vitesse', () => {
    const pulledSprings = [{ value: 0, velocity: 0, target: 1 }]

    const settledSprings = runFor(pulledSprings, 1.5)

    expect(settledSprings[0]).toEqual({ value: 1, velocity: 0, target: 1 })
  })

  test('ne modifie pas les ressorts reçus', () => {
    const pulledSprings = [{ value: 0, velocity: 0, target: 1 }]

    stepSprings(pulledSprings, 1 / 60, settings)

    expect(pulledSprings).toEqual([{ value: 0, velocity: 0, target: 1 }])
  })
})
