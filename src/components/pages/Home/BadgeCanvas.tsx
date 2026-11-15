import { Suspense, useState, type RefObject } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import { motion, useMotionValueEvent, useTransform, type MotionValue } from 'framer-motion'
import Badge from '@/components/pages/Home/Badge'
import { badgeIntro } from '@/logic/badgeIntro/badgeIntro'

type BadgeCanvasProps = {
  eventSource: RefObject<HTMLElement | null>
  introProgress: MotionValue<number>
  name: string
  label: string
}

const FOV = 23
const START_DISTANCE = 13

export default function BadgeCanvas({ eventSource, introProgress, name, label }: BadgeCanvasProps) {
  const opacity = useTransform(introProgress, (progress) => badgeIntro(progress).canvasOpacity)
  const [isHidden, setIsHidden] = useState(false)
  useMotionValueEvent(opacity, 'change', (value) => setIsHidden(value <= 0))

  return (
    <motion.div role="img" aria-label={label} style={{ opacity }} className="absolute inset-0 z-10">
      <Canvas
        eventSource={eventSource as RefObject<HTMLElement>}
        eventPrefix="client"
        camera={{ position: [0, 0, START_DISTANCE], fov: FOV }}
        dpr={[1, 2]}
        gl={{ alpha: true }}
        frameloop={isHidden ? 'never' : 'always'}
        style={{ pointerEvents: 'none' }}
      >
        <ambientLight intensity={Math.PI} />
        <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
          <Suspense fallback={null}>
            <Badge name={name} introProgress={introProgress} fov={FOV} startDistance={START_DISTANCE} />
          </Suspense>
        </Physics>
        <Environment blur={0.75}>
          <Lightformer intensity={2} position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer
            intensity={10}
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </motion.div>
  )
}
