export type Box = { width: number; height: number }

export type CounterScaledBox = Box & { inverseScale: number }

// Annule le rétrécissement CSS des parents : Qt mesure l'écran à l'écran mais place la souris dans le repère de la page.
export function counterScale(layout: Box, renderedWidth: number): CounterScaledBox {
  const scale = layout.width > 0 && renderedWidth > 0 ? renderedWidth / layout.width : 1
  return { width: layout.width * scale, height: layout.height * scale, inverseScale: 1 / scale }
}
