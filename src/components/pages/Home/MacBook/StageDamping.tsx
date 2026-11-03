import { useFrame } from '@react-three/fiber'
import { MathUtils } from 'three'
import type { StageMotion } from '@/components/pages/Home/MacBook/macBookMotion'

type StageDampingProps = {
  stage: StageMotion
  isRetreated: boolean
  isReducedMotion: boolean
}

const POINTER_DAMPING = 2.5
const RETREAT_DAMPING = 3

// Monté avant la caméra et l'environnement : ils lisent des valeurs déjà lissées pour l'image en cours.
export default function StageDamping({ stage, isRetreated, isReducedMotion }: StageDampingProps) {
  useFrame(({ pointer }, delta) => {
    const pointerX = isReducedMotion ? 0 : pointer.x
    const pointerY = isReducedMotion ? 0 : pointer.y
    stage.pointerX = MathUtils.damp(stage.pointerX, pointerX, POINTER_DAMPING, delta)
    stage.pointerY = MathUtils.damp(stage.pointerY, pointerY, POINTER_DAMPING, delta)
    stage.retreat = isReducedMotion
      ? Number(isRetreated)
      : MathUtils.damp(stage.retreat, Number(isRetreated), RETREAT_DAMPING, delta)
  })

  return null
}
