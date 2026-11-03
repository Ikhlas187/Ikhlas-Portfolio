import { describe, expect, it } from 'vitest'
import { contextMenuPosition, screenPoint } from '@/logic/macos/contextMenu/contextMenu'

const screen = { width: 1512, height: 982 }
const menu = { width: 240, height: 110 }

describe('contextMenuPosition', () => {
  it('ouvre le menu sous le pointeur quand il tient dans l’écran', () => {
    const pointer = { x: 300, y: 200 }

    expect(contextMenuPosition(pointer, menu, screen)).toEqual({ x: 300, y: 200 })
  })

  it('rabat le menu à gauche du pointeur près du bord droit', () => {
    const nearRightEdge = { x: 1400, y: 200 }

    expect(contextMenuPosition(nearRightEdge, menu, screen)).toEqual({ x: 1160, y: 200 })
  })

  it('rabat le menu au-dessus du pointeur près du bas de l’écran', () => {
    const nearBottom = { x: 300, y: 940 }

    expect(contextMenuPosition(nearBottom, menu, screen)).toEqual({ x: 300, y: 830 })
  })
})

describe('screenPoint', () => {
  it('ramène un point de la page en pixels de l’écran du Mac mis à l’échelle', () => {
    const client = { x: 600, y: 300 }

    expect(screenPoint(client, { left: 100, top: 50 }, 0.5)).toEqual({ x: 1000, y: 500 })
  })
})
