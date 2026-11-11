import { describe, expect, test } from 'vitest'
import { heroExit, heroExitDistance } from '@/logic/heroExit/heroExit'

describe('heroExitDistance', () => {
  test.each([
    { width: 390, height: 844, distance: 1738 },
    { width: 600, height: 900, distance: 2373 },
    { width: 810, height: 844, distance: 960 },
    { width: 1200, height: 844, distance: 945 },
    { width: 1440, height: 900, distance: 1070 },
    { width: 1920, height: 1080, distance: 1344 },
  ])('à $width x $height : $distance px comme la réf., à 1 % près', ({ width, height, distance }) => {
    const viewport = { width, height }

    const exitDistance = heroExitDistance(viewport)

    expect(Math.abs(exitDistance - distance) / distance).toBeLessThan(0.01)
  })
})

describe('heroExit', () => {
  test.each([
    { progress: 0, blur: 0, scale: 1 },
    { progress: 0.5, blur: 7.5, scale: 0.8 },
    { progress: 1, blur: 15, scale: 0.6 },
    { progress: 3, blur: 15, scale: 0.6 },
    { progress: -0.1, blur: 0, scale: 1 },
  ])('à $progress de la distance : flou $blur px, échelle $scale', ({ progress, blur, scale }) => {
    const viewport = { width: 1440, height: 900 }
    const scrollY = progress * heroExitDistance(viewport)

    const exitStyle = heroExit(scrollY, viewport)

    expect(exitStyle.blur).toBeCloseTo(blur)
    expect(exitStyle.scale).toBeCloseTo(scale)
  })
})
