import type { Point, Size } from '@/logic/macos/windowBounds/windowBounds'

const MARGIN = 6

// Le menu s'ouvre sous le pointeur ; s'il déborde de l'écran, il se rabat de l'autre côté, comme sur macOS.
export function contextMenuPosition(pointer: Point, menu: Size, screen: Size): Point {
  const x = pointer.x + menu.width + MARGIN > screen.width ? pointer.x - menu.width : pointer.x
  const y = pointer.y + menu.height + MARGIN > screen.height ? pointer.y - menu.height : pointer.y
  return { x: Math.max(MARGIN, x), y: Math.max(MARGIN, y) }
}

// Point du pointeur dans l'écran du Mac, qui peut être mis à l'échelle (MacBook 3D).
export function screenPoint(client: Point, screenRect: { left: number; top: number }, scale: number): Point {
  return { x: (client.x - screenRect.left) / scale, y: (client.y - screenRect.top) / scale }
}
