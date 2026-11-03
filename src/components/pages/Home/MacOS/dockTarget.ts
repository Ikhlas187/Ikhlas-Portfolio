import type { Rect } from '@/logic/macos/windowBounds/windowBounds'

const FALLBACK_ICON_SIZE = 48

// Position en pixels de l'écran macOS (offsets de mise en page, insensibles à la 3D du MacBook).
function offsetWithin(element: HTMLElement, root: HTMLElement) {
  let x = 0
  let y = 0
  for (let node: HTMLElement | null = element; node && node !== root; node = node.offsetParent as HTMLElement | null) {
    x += node.offsetLeft
    y += node.offsetTop
  }
  return { x, y }
}

// Icône du Dock de l'app ; une app absente du Dock vise le bout droit du Dock, là où macOS range les fenêtres réduites.
export function dockTargetRect(root: HTMLElement, app: string): Rect | null {
  const icon = root.querySelector<HTMLElement>(`[data-dock-app="${app}"] img`)
  if (icon) return { ...offsetWithin(icon, root), width: icon.offsetWidth, height: icon.offsetHeight }
  const dock = root.querySelector<HTMLElement>('[data-dock]')
  if (!dock) return null
  const { x, y } = offsetWithin(dock, root)
  return {
    x: x + dock.offsetWidth - FALLBACK_ICON_SIZE - 8,
    y: y + (dock.offsetHeight - FALLBACK_ICON_SIZE) / 2,
    width: FALLBACK_ICON_SIZE,
    height: FALLBACK_ICON_SIZE,
  }
}
