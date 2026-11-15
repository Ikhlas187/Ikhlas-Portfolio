import { useState, type RefObject } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import Badge from '@/components/pages/Home/Badge'
import { Button } from '@/components/ui/button'
import { MOBILE_QUERY, useMediaQuery } from '@/lib/useMediaQuery'

type BadgeCanvasProps = {
  eventSource: RefObject<HTMLElement | null>
  name: string
  role: string
  label: string
  flipLabel: string
}

export default function BadgeCanvas({ eventSource, name, role, label, flipLabel }: BadgeCanvasProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const isMobile = useMediaQuery(MOBILE_QUERY)
  const toggleFlip = () => setIsFlipped((flipped) => !flipped)

  return (
    <div role="img" aria-label={label} className="absolute inset-0 z-10">
      <Canvas
        eventSource={eventSource as RefObject<HTMLElement>}
        eventPrefix="client"
        camera={{ position: [0, 0, 13], fov: 25 }}
        dpr={[1, 2]}
        gl={{ alpha: true }}
        style={{ pointerEvents: 'none' }}
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={[0, -40, 0]} timeStep={1 / 60}>
          <Badge
            name={name}
            role={role}
            isFlipped={isFlipped}
            onFlip={toggleFlip}
            segmentLength={isMobile ? 0.8 : 1}
            scale={isMobile ? 0.8 : 1}
          />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer intensity={2} position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={10} position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>
      <Button type="button" onClick={toggleFlip} className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-24 focus-visible:left-1/2 focus-visible:-translate-x-1/2">
        {flipLabel}
      </Button>
    </div>
  )
}
