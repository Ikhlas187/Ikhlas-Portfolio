import { useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, useEnvironment } from '@react-three/drei'
import { FogExp2 } from 'three'
import { cssToken } from '@/components/pages/Home/MacBook/cssToken'
import type { MacBookMotion, StageMotion } from '@/components/pages/Home/MacBook/macBookMotion'
import { easeDive, stageLightAt } from '@/logic/macBookScroll/macBookScroll'

type StudioEnvironmentProps = {
  motion: MacBookMotion
  stage: StageMotion
  isReducedMotion: boolean
}

// HDRI du .blend d'origine (STUDIO-10, réduite à 1024 × 512) : mêmes reflets que le rendu Blender.
const HDRI_URL = '/models/studio-10.hdr'
const INTENSITY = 0.75
// Rotation 0 = orientation du monde Blender, vérifiée par comparaison de rendus.
const LID_SWEEP = 0.9
const POINTER_SWEEP = 0.35
const IDLE_SWEEP = 0.12
const IDLE_SECONDS = 14
// Brouillard au plus dense : le Mac se fond exactement dans le fond, il ne reste que l'écran.
const MAX_FADE = 0.9999

useEnvironment.preload({ files: HDRI_URL })

// Reflets de studio qui glissent sur l'aluminium et le logo, puis fondu au noir du Mac en fin de plongée.
export default function StudioEnvironment({ motion, stage, isReducedMotion }: StudioEnvironmentProps) {
  const scene = useThree((state) => state.scene)
  const fog = useMemo(() => new FogExp2(cssToken('--color-black'), 0), [])
  const cream = useMemo(() => cssToken('--color-white'), [])

  useEffect(() => {
    scene.fog = fog
    return () => {
      scene.fog = null
    }
  }, [scene, fog])

  useFrame(({ clock, camera }) => {
    const idle = isReducedMotion ? 0 : Math.sin((clock.elapsedTime * Math.PI * 2) / IDLE_SECONDS) * IDLE_SWEEP
    scene.environmentRotation.y = motion.lid * LID_SWEEP + stage.pointerX * POINTER_SWEEP + idle
    // FogExp2 : part du brouillard = 1 - exp(-(densité × distance)²), calée sur la distance caméra → Mac.
    const fade = Math.min(1 - stageLightAt(easeDive(motion.zoom), stage.retreat), MAX_FADE)
    fog.density = Math.sqrt(-Math.log(1 - fade)) / camera.position.length()
  })

  // Bandeaux de lumière ajoutés à la HDRI : ils passent sur le capot et le logo quand l'environnement tourne.
  return (
    <Environment files={HDRI_URL} resolution={512} environmentIntensity={INTENSITY}>
      <Lightformer
        form="rect"
        intensity={5}
        color={cream}
        position={[0, 4, 1.5]}
        rotation-x={Math.PI / 2.3}
        scale={[14, 0.5, 1]}
      />
      <Lightformer
        form="rect"
        intensity={3}
        color={cream}
        position={[2.5, 3, -2]}
        rotation={[Math.PI / 2.6, 0.6, 0]}
        scale={[10, 0.3, 1]}
      />
    </Environment>
  )
}
