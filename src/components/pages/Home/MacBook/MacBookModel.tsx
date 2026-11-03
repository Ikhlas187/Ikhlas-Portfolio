import { useLayoutEffect, useMemo, type RefObject } from 'react'
import { createPortal, useFrame, type ThreeEvent } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { MathUtils, type Group } from 'three'
import ScreenDisplay from '@/components/pages/Home/MacBook/ScreenDisplay'
import type { MacBookMotion, MacBookPhase } from '@/components/pages/Home/MacBook/macBookMotion'

type MacBookModelProps = {
  motion: MacBookMotion
  phase: MacBookPhase
  isZoomed: boolean
  isPoweredOn: boolean
  isShutDown: boolean
  screenAnchor: RefObject<Group | null>
  onOpen: () => void
  onZoomIn: () => void
  onShutDown: () => void
}

// Matériaux du .blend exportés tels quels (logo du capot et légendes des touches en textures) : aucun remplacement ici.
const MODEL_URL = '/models/macbook-pro-14.glb'
const DRACO_PATH = '/draco/'
// Rotation X du nœud Lid : 0 = état exporté (capot à 90°), +π/2 = capot posé sur le clavier.
const LID_CLOSED_ANGLE = Math.PI / 2
const LID_OPEN_ANGLE = -0.14
// Centre du plan Screen dans le repère du nœud Lid.
const SCREEN_CENTER: [number, number, number] = [0, 0.11483, -0.00497]

useGLTF.preload(MODEL_URL, DRACO_PATH)

export default function MacBookModel({
  motion,
  phase,
  isZoomed,
  isPoweredOn,
  isShutDown,
  screenAnchor,
  onOpen,
  onZoomIn,
  onShutDown,
}: MacBookModelProps) {
  const { scene } = useGLTF(MODEL_URL, DRACO_PATH)
  const lid = useMemo(() => scene.getObjectByName('Lid'), [scene])
  const isClickable = phase === 'closed' || (phase === 'open' && !isZoomed)

  useLayoutEffect(() => {
    if (!isClickable) document.body.style.cursor = ''
  }, [isClickable])

  useLayoutEffect(() => () => void (document.body.style.cursor = ''), [])

  useFrame(() => {
    if (lid) lid.rotation.x = MathUtils.lerp(LID_CLOSED_ANGLE, LID_OPEN_ANGLE, motion.lid)
  })

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    if (phase === 'closed') onOpen()
    else if (phase === 'open' && !isZoomed) onZoomIn()
  }

  return (
    <>
      <primitive
        object={scene}
        onClick={handleClick}
        onPointerOver={() => {
          if (isClickable) document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = ''
        }}
      />
      {lid &&
        createPortal(
          <group ref={screenAnchor} position={SCREEN_CENTER}>
            {phase === 'open' && (
              <ScreenDisplay
                isPoweredOn={isPoweredOn}
                isInteractive={isZoomed}
                isFitted={isZoomed && !isShutDown}
                onShutDown={onShutDown}
              />
            )}
          </group>,
          lid,
        )}
    </>
  )
}
