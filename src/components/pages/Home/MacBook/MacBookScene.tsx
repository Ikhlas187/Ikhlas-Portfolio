import { Suspense, useMemo, useRef } from 'react'
import type { Group } from 'three'
import CameraRig from '@/components/pages/Home/MacBook/CameraRig'
import FloorGlow from '@/components/pages/Home/MacBook/FloorGlow'
import MacBookModel from '@/components/pages/Home/MacBook/MacBookModel'
import StageDamping from '@/components/pages/Home/MacBook/StageDamping'
import StudioEnvironment from '@/components/pages/Home/MacBook/StudioEnvironment'
import { cssToken } from '@/components/pages/Home/MacBook/cssToken'
import type { MacBookMotion, MacBookPhase, StageMotion } from '@/components/pages/Home/MacBook/macBookMotion'
import { WORLD_SCALE } from '@/components/pages/Home/MacBook/sceneScale'

type MacBookSceneProps = {
  motion: MacBookMotion
  phase: MacBookPhase
  isZoomed: boolean
  isPoweredOn: boolean
  isShutDown: boolean
  isReducedMotion: boolean
  onOpen: () => void
  onZoomIn: () => void
  onShutDown: () => void
}

export default function MacBookScene({ motion, isShutDown, isReducedMotion, ...modelProps }: MacBookSceneProps) {
  const screenAnchor = useRef<Group>(null)
  const stage = useRef<StageMotion>({ pointerX: 0, pointerY: 0, retreat: 0 }).current
  const background = useMemo(() => cssToken('--color-white'), [])

  return (
    <>
      <color attach="background" args={[background]} />
      <StageDamping stage={stage} isRetreated={isShutDown} isReducedMotion={isReducedMotion} />
      <CameraRig motion={motion} stage={stage} screenAnchor={screenAnchor} />
      <Suspense fallback={null}>
        <StudioEnvironment motion={motion} stage={stage} isReducedMotion={isReducedMotion} />
      </Suspense>
      <group scale={WORLD_SCALE}>
        <FloorGlow />
        <Suspense fallback={null}>
          <MacBookModel motion={motion} screenAnchor={screenAnchor} isShutDown={isShutDown} {...modelProps} />
        </Suspense>
      </group>
    </>
  )
}
