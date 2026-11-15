import { describe, expect, test } from 'vitest'
import { gazeOffset, pupilRange } from '@/logic/eyesCursor/gaze/gaze'

const range = { x: 2.5, y: 5.5 }

describe('pupilRange', () => {
  test('œil 20 × 26, pupille 10, bord 2 : 2,5 px de course en largeur, 5,5 px en hauteur', () => {
    const eye = { width: 20, height: 26, pupil: 10, stroke: 2 }

    expect(pupilRange(eye.width, eye.height, eye.pupil, eye.stroke)).toEqual(range)
  })
})

describe('gazeOffset', () => {
  test('sans cible : regard au repos, un peu à droite et en bas', () => {
    const pointer = { x: 100, y: 100 }

    expect(gazeOffset(pointer, null, range)).toEqual({ x: 0.875, y: 0.55 })
  })

  test('cible loin à droite : pupille en butée à droite', () => {
    const pointer = { x: 100, y: 100 }
    const farRightTarget = { x: 400, y: 100 }

    expect(gazeOffset(pointer, farRightTarget, range)).toEqual({ x: 2.5, y: 0 })
  })

  test('cible proche : pupille à mi-course', () => {
    const pointer = { x: 100, y: 100 }
    const nearTarget = { x: 100, y: 124 }

    expect(gazeOffset(pointer, nearTarget, range)).toEqual({ x: 0, y: 2.75 })
  })

  test('pointeur sur le centre de la cible : pupille centrée', () => {
    const pointer = { x: 100, y: 100 }

    expect(gazeOffset(pointer, pointer, range)).toEqual({ x: 0, y: 0 })
  })
})
