import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { CanvasTexture, SRGBColorSpace, type MeshBasicMaterial } from 'three'
import { cssToken } from '@/components/pages/Home/MacBook/cssToken'
import type { MacBookMotion, StageMotion } from '@/components/pages/Home/MacBook/macBookMotion'
import { easeDive, stageLightAt } from '@/logic/macBookScroll/macBookScroll'

type FloorGlowProps = {
  motion: MacBookMotion
  stage: StageMotion
}

const TEXTURE_SIZE = 256
const POOL_SIZE = 1.1
const POOL_OPACITY = 0.16

function createPoolTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = TEXTURE_SIZE
  const context = canvas.getContext('2d')
  if (context) {
    const center = TEXTURE_SIZE / 2
    const gradient = context.createRadialGradient(center, center, 0, center, center, center)
    gradient.addColorStop(0, cssToken('--color-white'))
    gradient.addColorStop(0.35, cssToken('--color-macbook-floor'))
    gradient.addColorStop(1, cssToken('--color-white'))
    context.fillStyle = gradient
    context.fillRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE)
  }
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  return texture
}

// Sol invisible sur fond crème : une flaque de lumière sous le Mac, pour que son ombre douce se lise.
export default function FloorGlow({ motion, stage }: FloorGlowProps) {
  const texture = useMemo(createPoolTexture, [])
  const poolRef = useRef<MeshBasicMaterial>(null)

  useEffect(() => () => texture.dispose(), [texture])

  useFrame(() => {
    if (poolRef.current) poolRef.current.opacity = POOL_OPACITY * stageLightAt(easeDive(motion.zoom), stage.retreat)
  })

  return (
    <>
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.0002, 0.02]}>
        <planeGeometry args={[POOL_SIZE, POOL_SIZE]} />
        <meshBasicMaterial ref={poolRef} map={texture} transparent depthWrite={false} opacity={POOL_OPACITY} />
      </mesh>
      <ContactShadows position={[0, 0.0003, 0]} scale={0.7} resolution={512} blur={2.6} far={0.12} opacity={0.9} />
    </>
  )
}
