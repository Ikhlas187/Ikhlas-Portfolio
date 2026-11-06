import { describe, expect, it } from 'vitest'
import { footerPath } from '@/logic/footerShape/footerShape'

describe('footerPath', () => {
  const shape = { width: 1000, height: 600, notchWidth: 400, notchDepth: 100, cornerRadius: 28, notchRadius: 24, shoulderRadius: 16 }

  it('centre l’encoche et descend jusqu’à sa profondeur', () => {
    const path = footerPath(shape)

    expect(path).toContain('L 284 0 A 16 16 0 0 1 300 16')
    expect(path).toContain('L 300 76 A 24 24 0 0 0 324 100')
    expect(path).toContain('L 676 100 A 24 24 0 0 0 700 76')
    expect(path).toContain('L 700 16 A 16 16 0 0 1 716 0')
  })

  it('ferme le contour par les 4 coins arrondis', () => {
    const path = footerPath(shape)

    expect(path.startsWith('M 28 0')).toBe(true)
    expect(path).toContain('A 28 28 0 0 1 1000 28')
    expect(path).toContain('A 28 28 0 0 1 0 572')
    expect(path.endsWith('Z')).toBe(true)
  })
})
