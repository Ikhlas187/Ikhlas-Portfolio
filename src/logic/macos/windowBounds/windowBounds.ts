export type Size = { width: number; height: number }

export type Point = { x: number; y: number }

export type Rect = Point & Size

export type Screen = Size & { menuBarHeight: number }

// Définition logique d’un MacBook Pro 14" ; 32 px : barre de menus du 1er macOS.
export const MACOS_SCREEN: Screen = { width: 1512, height: 982, menuBarHeight: 32 }

const CASCADE_STEP = 26
const CASCADE_LENGTH = 8

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max))
}

export function clampWindowPosition(position: Point, size: Size, screen: Screen): Point {
  return {
    x: clamp(position.x, 0, screen.width - size.width),
    y: clamp(position.y, screen.menuBarHeight, screen.height - size.height),
  }
}

export function fitSize(size: Size, screen: Screen): Size {
  return {
    width: Math.min(size.width, screen.width),
    height: Math.min(size.height, screen.height - screen.menuBarHeight),
  }
}

export function maximizedRect(screen: Screen): Rect {
  return { x: 0, y: screen.menuBarHeight, width: screen.width, height: screen.height - screen.menuBarHeight }
}

// Chaque nouvelle fenêtre part du centre puis se décale en escalier, comme sur macOS.
export function cascadeRect(size: Size, openedCount: number, screen: Screen): Rect {
  const fitted = fitSize(size, screen)
  const step = (openedCount % CASCADE_LENGTH) * CASCADE_STEP
  const centered = {
    x: Math.round((screen.width - fitted.width) / 2) - 80 + step,
    y: Math.round((screen.height - fitted.height) / 2) - 60 + step,
  }
  return { ...clampWindowPosition(centered, fitted, screen), ...fitted }
}
