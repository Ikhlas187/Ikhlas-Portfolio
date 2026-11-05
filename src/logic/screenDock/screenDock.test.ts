import { describe, expect, test } from 'vitest'
import { dockDistance, dockOffset, dockScale } from '@/logic/screenDock/screenDock'

describe('dockScale', () => {
  test.each([
    [-0.2, 1],
    [0, 1],
    [0.5, 0.75],
    [1, 0.5],
    [1.3, 0.5],
  ])('avancée %s → échelle %s', (progress, scale) => {
    expect(dockScale(progress)).toBeCloseTo(scale)
  })
})

describe('dockOffset', () => {
  test.each([
    [-0.2, 0],
    [0, 0],
    [0.25, 175],
    [1, 700],
    [1.3, 700],
  ])('avancée %s sur 700 px → %s px', (progress, offset) => {
    expect(dockOffset(progress, 700)).toBeCloseTo(offset)
  })
})

describe('dockDistance', () => {
  test('écart vertical entre les 2 centres', () => {
    // Arrange
    const moving = { top: 689, height: 686.8 }
    const target = { top: 1497.3, height: 481.7 }

    // Act
    const distance = dockDistance(moving, target)

    // Assert
    expect(distance).toBeCloseTo(705.75)
  })
})
