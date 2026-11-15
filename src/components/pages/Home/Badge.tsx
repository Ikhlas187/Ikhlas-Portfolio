import { useEffect, useRef, useState } from 'react'
import { extend, useFrame, useThree, type ThreeElement, type ThreeEvent } from '@react-three/fiber'
import { BallCollider, CuboidCollider, RigidBody, useRopeJoint, useSphericalJoint, type RapierRigidBody } from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
import { CatmullRomCurve3, DoubleSide, Group, MathUtils, Mesh, Vector2, Vector3 } from 'three'
import useBadgeTextures, { BADGE_HEIGHT, BADGE_WIDTH } from '@/components/pages/Home/useBadgeTextures'

extend({ MeshLineGeometry, MeshLineMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: ThreeElement<typeof MeshLineGeometry>
    meshLineMaterial: ThreeElement<typeof MeshLineMaterial>
  }
}

type BadgeProps = {
  name: string
  role: string
  isFlipped: boolean
  onFlip: () => void
  segmentLength: number
  scale: number
}

const SEGMENT = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 4, linearDamping: 4 } as const
const CLICK_MAX_DISTANCE = 6
const CLICK_MAX_DURATION = 350

function tokenColor(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

export default function Badge({ name, role, isFlipped, onFlip, segmentLength, scale }: BadgeProps) {
  const band = useRef<Mesh>(null)
  const face = useRef<Group>(null)
  const fixed = useRef<RapierRigidBody>(null!)
  const j1 = useRef<RapierRigidBody>(null!)
  const j2 = useRef<RapierRigidBody>(null!)
  const j3 = useRef<RapierRigidBody>(null!)
  const card = useRef<RapierRigidBody>(null!)
  const pointerStart = useRef({ x: 0, y: 0, time: 0 })
  const [dragOffset, setDragOffset] = useState<Vector3 | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [curve] = useState(() => new CatmullRomCurve3([new Vector3(), new Vector3(), new Vector3(), new Vector3()], false, 'chordal'))
  const [vectors] = useState(() => ({ pointer: new Vector3(), direction: new Vector3(), angular: new Vector3(), rotation: new Vector3() }))
  const { width, height } = useThree((state) => state.size)
  const textures = useBadgeTextures(name, role)
  const cardHalfHeight = (BADGE_HEIGHT * scale) / 2

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], segmentLength])
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], segmentLength])
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], segmentLength])
  useSphericalJoint(j3, card, [[0, 0, 0], [0, cardHalfHeight + 0.12 * scale, 0]])

  useEffect(() => {
    document.body.style.cursor = dragOffset ? 'grabbing' : isHovered ? 'grab' : ''
    return () => {
      document.body.style.cursor = ''
    }
  }, [dragOffset, isHovered])

  useFrame((state, delta) => {
    if (!fixed.current || !j1.current || !j2.current || !j3.current || !card.current || !band.current) return

    if (dragOffset) {
      vectors.pointer.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
      vectors.direction.copy(vectors.pointer).sub(state.camera.position).normalize()
      vectors.pointer.add(vectors.direction.multiplyScalar(state.camera.position.length()))
      ;[card, j1, j2, j3, fixed].forEach((body) => body.current?.wakeUp())
      card.current.setNextKinematicTranslation({
        x: vectors.pointer.x - dragOffset.x,
        y: vectors.pointer.y - dragOffset.y,
        z: vectors.pointer.z - dragOffset.z,
      })
    }

    curve.points[0].copy(j3.current.translation())
    curve.points[1].copy(j2.current.translation())
    curve.points[2].copy(j1.current.translation())
    curve.points[3].copy(fixed.current.translation())
    ;(band.current.geometry as MeshLineGeometry).setPoints(curve.getPoints(32))

    // Ramène doucement la carte face à l'écran, comme un badge qui pend.
    vectors.angular.copy(card.current.angvel())
    vectors.rotation.copy(card.current.rotation())
    card.current.setAngvel({ x: vectors.angular.x, y: vectors.angular.y - vectors.rotation.y * 0.25, z: vectors.angular.z }, true)

    if (face.current) face.current.rotation.y = MathUtils.damp(face.current.rotation.y, isFlipped ? Math.PI : 0, 6, delta)
  })

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    // Les 2 faces sont touchées par le même rayon : un seul appel par clic.
    event.stopPropagation()
    if (!card.current) return
    ;(event.target as Element).setPointerCapture(event.pointerId)
    pointerStart.current = { x: event.clientX, y: event.clientY, time: performance.now() }
    setDragOffset(new Vector3().copy(event.point).sub(vectors.rotation.copy(card.current.translation())))
  }

  const handlePointerUp = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
    ;(event.target as Element).releasePointerCapture(event.pointerId)
    setDragOffset(null)
    const distance = Math.hypot(event.clientX - pointerStart.current.x, event.clientY - pointerStart.current.y)
    if (distance < CLICK_MAX_DISTANCE && performance.now() - pointerStart.current.time < CLICK_MAX_DURATION) onFlip()
  }

  const metal = tokenColor('--color-gray-600')

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...SEGMENT} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...SEGMENT}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...SEGMENT}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...SEGMENT}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[2, 0, 0]} ref={card} {...SEGMENT} type={dragOffset ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[(BADGE_WIDTH * scale) / 2, cardHalfHeight, 0.01]} />
          <group
            scale={scale}
            onPointerOver={() => setIsHovered(true)}
            onPointerOut={() => setIsHovered(false)}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
          >
            <group ref={face}>
              {textures && (
                <>
                  <mesh position={[0, 0, 0.006]}>
                    <planeGeometry args={[BADGE_WIDTH, BADGE_HEIGHT]} />
                    <meshStandardMaterial map={textures.front} transparent alphaTest={0.5} roughness={0.6} />
                  </mesh>
                  <mesh position={[0, 0, -0.006]} rotation={[0, Math.PI, 0]}>
                    <planeGeometry args={[BADGE_WIDTH, BADGE_HEIGHT]} />
                    <meshStandardMaterial map={textures.back} transparent alphaTest={0.5} roughness={0.6} />
                  </mesh>
                </>
              )}
            </group>
            <group position={[0, BADGE_HEIGHT / 2 + 0.02, 0]}>
              <mesh>
                <torusGeometry args={[0.11, 0.022, 12, 32]} />
                <meshStandardMaterial color={metal} metalness={0.9} roughness={0.25} />
              </mesh>
              <mesh position={[0, 0.2, 0]}>
                <cylinderGeometry args={[0.035, 0.035, 0.22, 16]} />
                <meshStandardMaterial color={metal} metalness={0.9} roughness={0.25} />
              </mesh>
            </group>
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          args={[{ resolution: new Vector2(width, height) }]}
          color={tokenColor('--color-gray-600')}
          resolution={new Vector2(width, height)}
          lineWidth={0.12 * scale}
          side={DoubleSide}
        />
      </mesh>
    </>
  )
}
