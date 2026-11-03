import { describe, expect, it } from 'vitest'
import { cascadeRect, clampWindowPosition, maximizedRect } from '@/logic/macos/windowBounds/windowBounds'

const screen = { width: 1000, height: 800, menuBarHeight: 30 }

describe('clampWindowPosition', () => {
  it('laisse en place une fenêtre déjà dans l’écran', () => {
    const insidePosition = { x: 100, y: 200 }

    expect(clampWindowPosition(insidePosition, { width: 300, height: 200 }, screen)).toEqual({ x: 100, y: 200 })
  })

  it('ramène une fenêtre sortie à droite et en bas contre les bords', () => {
    const outsidePosition = { x: 900, y: 750 }

    expect(clampWindowPosition(outsidePosition, { width: 300, height: 200 }, screen)).toEqual({ x: 700, y: 600 })
  })

  it('empêche de passer sous la barre de menu ou à gauche', () => {
    const aboveMenuBar = { x: -50, y: 0 }

    expect(clampWindowPosition(aboveMenuBar, { width: 300, height: 200 }, screen)).toEqual({ x: 0, y: 30 })
  })

  it('colle en haut à gauche une fenêtre plus grande que l’écran', () => {
    const hugeWindowPosition = { x: 40, y: 90 }

    expect(clampWindowPosition(hugeWindowPosition, { width: 1200, height: 900 }, screen)).toEqual({ x: 0, y: 30 })
  })
})

describe('maximizedRect', () => {
  it('occupe tout l’écran sous la barre de menu', () => {
    const menuBarHeight = screen.menuBarHeight

    expect(maximizedRect(screen)).toEqual({ x: 0, y: menuBarHeight, width: 1000, height: 770 })
  })
})

describe('cascadeRect', () => {
  it('décale chaque nouvelle fenêtre de la précédente', () => {
    const size = { width: 400, height: 300 }

    const firstRect = cascadeRect(size, 0, screen)
    const secondRect = cascadeRect(size, 1, screen)

    expect(secondRect.x - firstRect.x).toBe(26)
    expect(secondRect.y - firstRect.y).toBe(26)
  })

  it('réduit une fenêtre trop grande à la taille de l’écran', () => {
    const oversized = { width: 2000, height: 2000 }

    expect(cascadeRect(oversized, 0, screen)).toEqual({ x: 0, y: 30, width: 1000, height: 770 })
  })
})
