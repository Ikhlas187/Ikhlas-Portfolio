export type Spring = { value: number; velocity: number; target: number }

type SpringSettings = { stiffness: number; damping: number }

const SUBSTEPS = 2
const REST_THRESHOLD = 5e-4

// Euler semi-implicite en 2 sous-pas, masse 1 ; un ressort assez proche de sa cible s'y pose.
export function stepSprings(springs: Spring[], dt: number, { stiffness, damping }: SpringSettings) {
  let isMoving = false
  const nextSprings = springs.map((spring) => {
    let { value, velocity } = spring
    for (let step = 0; step < SUBSTEPS; step++) {
      const h = dt / SUBSTEPS
      velocity += (stiffness * (spring.target - value) - damping * velocity) * h
      value += velocity * h
    }
    if (Math.abs(spring.target - value) > REST_THRESHOLD || Math.abs(velocity) > REST_THRESHOLD) {
      isMoving = true
      return { value, velocity, target: spring.target }
    }
    return { value: spring.target, velocity: 0, target: spring.target }
  })
  return { springs: nextSprings, isMoving }
}
