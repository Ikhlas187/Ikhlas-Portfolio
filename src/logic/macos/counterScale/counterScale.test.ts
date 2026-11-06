import { describe, expect, it } from 'vitest'
import { counterScale } from '@/logic/macos/counterScale/counterScale'

describe('counterScale', () => {
  it('réduit la boîte à sa taille affichée et compense le rétrécissement des parents', () => {
    const layout = { width: 1000, height: 600 }

    const box = counterScale(layout, 500)

    expect(box).toEqual({ width: 500, height: 300, inverseScale: 2 })
  })

  it('laisse la boîte telle quelle quand elle est encore invisible', () => {
    const layout = { width: 0, height: 0 }

    const box = counterScale(layout, 0)

    expect(box).toEqual({ width: 0, height: 0, inverseScale: 1 })
  })
})
