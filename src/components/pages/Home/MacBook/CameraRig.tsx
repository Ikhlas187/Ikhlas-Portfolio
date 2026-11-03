import { useMemo, type RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MathUtils, Vector3, type Group, type PerspectiveCamera } from 'three'
import { coverDistance, fitDistance } from '@/logic/cameraFit/cameraFit'
import { diveDistance, easeDive } from '@/logic/macBookScroll/macBookScroll'
import type { MacBookMotion, StageMotion } from '@/components/pages/Home/MacBook/macBookMotion'
import { WORLD_SCALE } from '@/components/pages/Home/MacBook/sceneScale'

type CameraRigProps = {
  motion: MacBookMotion
  stage: StageMotion
  screenAnchor: RefObject<Group | null>
}

const LAPTOP_WIDTH = 0.32 * WORLD_SCALE
const SCREEN = { width: 0.3036 * WORLD_SCALE, height: 0.1983 * WORLD_SCALE }
// Orbite de l'ouverture partie de l'arrière en plongée, pour que le logo du capot fermé se lise à l'endroit.
const CLOSED_ORBIT = { yaw: 2.55, elevation: 0.86 }
const OPEN_ORBIT = { yaw: 0.14, elevation: 0.3 }
// Rotation de la caméra autour du Mac avec la souris, en radians, avant la plongée.
const POINTER_YAW = 0.32
const POINTER_PITCH = 0.1
// Marge du cadrage plein écran quand le Mac est éteint : la place sous l'écran accueille le bouton Allumer.
const RETREAT_MARGIN = 1.4
// Léger débord du plein écran : sans lui, l'arrondi laisse une ligne de fond de 1 px sur les bords.
const COVER_OVERSCAN = 0.99

export default function CameraRig({ motion, stage, screenAnchor }: CameraRigProps) {
  const camera = useThree((state) => state.camera) as PerspectiveCamera
  const size = useThree((state) => state.size)
  const vectors = useMemo(
    () => ({
      overviewTarget: new Vector3(),
      zoomTarget: new Vector3(),
      normal: new Vector3(),
      diveDirection: new Vector3(),
      direction: new Vector3(),
      target: new Vector3(),
    }),
    [],
  )

  useFrame(() => {
    const { overviewTarget, zoomTarget, normal, diveDirection, direction, target } = vectors
    const aspect = size.width / size.height
    const lens = { verticalFovDeg: camera.fov, aspect }
    const isPortrait = aspect < 1
    const dive = easeDive(motion.zoom)
    const parallax = 1 - dive

    overviewTarget
      .set(0, MathUtils.lerp(0.0, 0.085, motion.lid), MathUtils.lerp(0.02, -0.02, motion.lid))
      .multiplyScalar(WORLD_SCALE)
    const overviewBox = { width: LAPTOP_WIDTH, height: MathUtils.lerp(0.2, 0.26, motion.lid) * WORLD_SCALE }
    const overviewMargin = isPortrait ? MathUtils.lerp(1.6, 1.35, motion.lid) : MathUtils.lerp(2.9, 2.4, motion.lid)
    const overviewDistance = fitDistance(overviewBox, lens, overviewMargin)
    const orbit = easeDive(motion.lid)
    const yaw = MathUtils.lerp(CLOSED_ORBIT.yaw, OPEN_ORBIT.yaw, orbit) - stage.pointerX * POINTER_YAW * parallax
    const elevation =
      MathUtils.lerp(CLOSED_ORBIT.elevation, OPEN_ORBIT.elevation, orbit) + stage.pointerY * POINTER_PITCH * parallax
    direction.set(Math.sin(yaw) * Math.cos(elevation), Math.sin(elevation), Math.cos(yaw) * Math.cos(elevation))

    let zoomDistance = overviewDistance
    if (screenAnchor.current) {
      screenAnchor.current.getWorldPosition(zoomTarget)
      screenAnchor.current.getWorldDirection(normal)
      // Écran plein cadre sans aucun bord ; ScreenDisplay loge macOS dans la partie visible.
      zoomDistance = MathUtils.lerp(
        coverDistance(SCREEN, lens) * COVER_OVERSCAN,
        fitDistance(SCREEN, lens, RETREAT_MARGIN),
        stage.retreat,
      )
    } else {
      zoomTarget.copy(overviewTarget)
      normal.copy(direction)
    }

    target.lerpVectors(overviewTarget, zoomTarget, dive)
    diveDirection.lerpVectors(direction, normal, dive).normalize()
    camera.position
      .copy(diveDirection)
      .multiplyScalar(diveDistance(overviewDistance, zoomDistance, dive))
      .add(target)
    camera.lookAt(target)
  })

  return null
}
