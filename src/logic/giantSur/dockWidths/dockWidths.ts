const HOVERED_WIDTH = '8rem'
const NEIGHBOUR_WIDTH = '6.5rem'
const SECOND_NEIGHBOUR_WIDTH = '5.5rem'
const REST_WIDTH = '4em'

// Largeur CSS de chaque icône du Dock selon l'icône survolée (null : aucune).
export function dockWidths(itemCount: number, hoveredIndex: number | null) {
  return Array.from({ length: itemCount }, (_, index) => {
    if (hoveredIndex === null) return REST_WIDTH
    const distance = Math.abs(index - hoveredIndex)
    if (distance === 0) return HOVERED_WIDTH
    if (distance === 1) return NEIGHBOUR_WIDTH
    if (distance === 2) return SECOND_NEIGHBOUR_WIDTH
    return REST_WIDTH
  })
}
